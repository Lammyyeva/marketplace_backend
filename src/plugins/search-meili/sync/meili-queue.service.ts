import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { JobQueue, JobQueueService, Job } from '@vendure/core';
import { MeiliClientService } from '../meili.client';
import { MeiliInitialSyncService } from './initial-sync.service';
import { MeiliAnalyticsService } from '../services/meili-analytics.service';
import { deleteProductVariants } from '../indexer/product.indexer';
import { SYNC_JOB_NAME } from '../constants';

export type MeiliSyncJobData =
  | { type: 'full' }
  | { type: 'product'; productId: string | number }
  | { type: 'deleteVariants'; variantIds: (string | number)[] };

const IS_WORKER = process.env.VENDURE_WORKER_CONTEXT === 'true';

/**
 * Routes all Meilisearch sync work through Vendure's job queue.
 *
 * - Server process: enqueues jobs (fast, non-blocking)
 * - Worker process: processes jobs (retry, observable in admin UI)
 *
 * This eliminates the race condition where both server and worker
 * ran clearIndex() + addDocuments() concurrently at startup.
 */
@Injectable()
export class MeiliQueueService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MeiliQueueService.name);
  private syncQueue!: JobQueue<MeiliSyncJobData>;

  constructor(
    private readonly jobQueueService: JobQueueService,
    private readonly syncService: MeiliInitialSyncService,
    private readonly clientService: MeiliClientService,
    private readonly analyticsService: MeiliAnalyticsService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.syncQueue = await this.jobQueueService.createQueue<MeiliSyncJobData>({
      name: SYNC_JOB_NAME,
      process: async (job: Job<MeiliSyncJobData>) => {
        // This callback runs ONLY in the worker process (after startJobQueue()).
        const data = job.data;
        const jobLabel = `job #${job.id} (${data.type})`;
        const startedAt = Date.now();
        this.logger.log(`[MeiliQueue] ▶ STARTED ${jobLabel}`);
        try {
          switch (data.type) {
            case 'full':
              await this.syncService.runFullSync();
              break;

            case 'product':
              this.logger.log(
                `[MeiliQueue] product-sync target: productId=${data.productId}`,
              );
              await this.syncService.syncProduct(data.productId);
              break;

            case 'deleteVariants':
              this.logger.log(
                `[MeiliQueue] deleteVariants target: ${data.variantIds.length} ids`,
              );
              await deleteProductVariants(data.variantIds, this.clientService);
              break;

            default:
              this.logger.warn(`[MeiliQueue] Unknown job type for ${jobLabel} — skipping`);
          }
          const ms = Date.now() - startedAt;
          this.logger.log(`[MeiliQueue] ✔ COMPLETED ${jobLabel} in ${ms}ms`);
        } catch (err: any) {
          const ms = Date.now() - startedAt;
          this.logger.error(
            `[MeiliQueue] ✖ FAILED ${jobLabel} after ${ms}ms: ${err?.message}`,
            err?.stack,
          );
          // Re-throw so Vendure's job queue marks the job as failed and applies retry.
          throw err;
        }
      },
    });

    if (!IS_WORKER) {
      this.logger.log('[MeiliQueue] Queue registered (server — enqueue-only mode)');
      // After the queue is ready, check if the server detected an empty index at startup.
      // If so, enqueue the initial full sync (processed by worker, guaranteed single consumer).
      setTimeout(async () => {
        try {
          const needed = await this.analyticsService.needsInitialSync();
          if (needed) {
            this.logger.log('[MeiliQueue] Initial sync flag set — enqueueing full-sync job');
            await this.enqueueFullSync();
          }
        } catch (err: any) {
          this.logger.warn(`[MeiliQueue] Could not check initial sync flag: ${err?.message}`);
        }
      }, 2_000); // small delay to ensure queue is fully initialised
    } else {
      this.logger.log('[MeiliQueue] Queue registered (worker — processing mode)');
    }
  }

  /**
   * Enqueue a full reindex. Safe to call from server process.
   * The worker will execute it, ensuring only one sync runs at a time.
   * Returns the job id so operators can grep the worker logs for it.
   */
  async enqueueFullSync(): Promise<string | number | undefined> {
    this.logger.log('[MeiliQueue] Enqueueing full-sync job...');
    try {
      const job = await this.syncQueue.add({ type: 'full' }, { retries: 1 });
      const jobId = (job as any)?.id ?? '?';
      this.logger.log(
        `[MeiliQueue] ✚ ENQUEUED full-sync as job #${jobId} (queue: ${SYNC_JOB_NAME}). ` +
        `Worker should log "▶ STARTED job #${jobId}" within a few seconds.`,
      );
      return jobId;
    } catch (err: any) {
      this.logger.error(
        `[MeiliQueue] ENQUEUE FAILED for full-sync: ${err?.message}`,
        err?.stack,
      );
      throw err;
    }
  }

  /**
   * Enqueue a single-product sync. Safe to call from event handlers.
   */
  async enqueueProductSync(productId: string | number): Promise<void> {
    try {
      const job = await this.syncQueue.add({ type: 'product', productId }, { retries: 3 });
      const jobId = (job as any)?.id ?? '?';
      this.logger.log(`[MeiliQueue] ✚ ENQUEUED product-sync productId=${productId} as job #${jobId}`);
    } catch (err: any) {
      this.logger.error(
        `[MeiliQueue] ENQUEUE FAILED for product ${productId}: ${err?.message}`,
        err?.stack,
      );
      throw err;
    }
  }

  /**
   * Enqueue a variant deletion. Called when variants are removed.
   */
  async enqueueDeleteVariants(variantIds: (string | number)[]): Promise<void> {
    if (variantIds.length === 0) return;
    await this.syncQueue.add({ type: 'deleteVariants', variantIds }, { retries: 3 });
  }
}
