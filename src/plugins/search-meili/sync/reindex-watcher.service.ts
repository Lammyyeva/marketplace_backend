import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TransactionalConnection } from '@vendure/core';
import { JobRecord } from '@vendure/core/dist/plugin/default-job-queue-plugin/job-record.entity';
import { MoreThan } from 'typeorm';
import { MeiliQueueService } from './meili-queue.service';
import { MeiliInitialSyncService } from './initial-sync.service';

const IS_WORKER = process.env.VENDURE_WORKER_CONTEXT === 'true';

/**
 * Auto-bridges Vendure's standard reindex to our Meilisearch sync.
 *
 * Vendure exposes a "Rebuild Search Index" button in the admin UI that
 * triggers a `reindex` job on the `update-search-index` queue, which is
 * handled by `DefaultSearchPlugin` and writes to the SQL `search_index_item`
 * table. Because we use `MeiliSearchStrategy` as the search reader, those
 * SQL writes have no effect on actual search results — yet operators
 * naturally expect the button to "do the right thing".
 *
 * Vendure does not emit a public event when reindex completes, so we poll
 * the `job_record` table for newly settled reindex jobs. When we detect
 * one, we enqueue a full Meilisearch sync via our own queue. The user's
 * habitual click on the standard reindex button now does what they expect.
 *
 * Runs only on the worker process to avoid double-enqueueing.
 */
@Injectable()
export class ReindexWatcherService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ReindexWatcherService.name);
  private lastSeenSettledAt: Date = new Date(); // initialize to "now" so we don't re-trigger on historical jobs

  constructor(
    private readonly connection: TransactionalConnection,
    private readonly queueService: MeiliQueueService,
    private readonly syncService: MeiliInitialSyncService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (!IS_WORKER) {
      // Only the worker polls; both processes share the same DB-backed
      // meili-sync-product queue, so a single watcher is sufficient.
      return;
    }
    this.logger.log(
      '[ReindexWatcher] Active — polling for completed Vendure reindex jobs every 30s. ' +
      'Will auto-enqueue Meilisearch full-sync when standard "Rebuild Search Index" finishes.',
    );
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkForCompletedReindex(): Promise<void> {
    if (!IS_WORKER) return;

    let recentReindexJobs: JobRecord[];
    try {
      // Query the job_record table for recently settled reindex jobs.
      // `data` is a jsonb column in Postgres; we filter post-query rather
      // than in SQL so the strategy works on SQLite/MySQL too.
      recentReindexJobs = await this.connection.rawConnection
        .getRepository(JobRecord)
        .find({
          where: {
            queueName: 'update-search-index',
            isSettled: true,
            settledAt: MoreThan(this.lastSeenSettledAt),
          },
          order: { settledAt: 'ASC' },
        });
    } catch (err: any) {
      this.logger.warn(`[ReindexWatcher] DB poll failed: ${err?.message}`);
      return;
    }

    if (recentReindexJobs.length === 0) return;

    // Advance the cursor regardless of whether we trigger — so a flood of
    // non-reindex jobs doesn't make us re-scan them forever.
    const newestSettledAt = recentReindexJobs[recentReindexJobs.length - 1].settledAt;
    if (newestSettledAt) this.lastSeenSettledAt = newestSettledAt;

    // Filter for actual full reindex jobs (data.type === 'reindex').
    const reindexJobs = recentReindexJobs.filter(
      (j) => j.state === ('COMPLETED' as any) && (j.data as any)?.type === 'reindex',
    );

    if (reindexJobs.length === 0) return;

    // De-duplicate: if multiple reindex jobs completed within one polling
    // window we still only need one full Meili sync.
    const job = reindexJobs[reindexJobs.length - 1];
    this.logger.log(
      `[ReindexWatcher] Detected completed Vendure reindex (job #${job.id}, settledAt=${job.settledAt?.toISOString()}). ` +
      `Auto-enqueuing Meilisearch full-sync to keep both indexes in sync.`,
    );

    const progress = this.syncService.getSyncProgress();
    if (progress.inProgress) {
      this.logger.log(
        '[ReindexWatcher] Meilisearch sync already in progress — skipping auto-enqueue.',
      );
      return;
    }

    try {
      await this.queueService.enqueueFullSync();
    } catch (err: any) {
      this.logger.error(
        `[ReindexWatcher] Failed to enqueue Meilisearch sync: ${err?.message}`,
        err?.stack,
      );
    }
  }
}
