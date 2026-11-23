import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Product, TransactionalConnection } from '@vendure/core';
import { In } from 'typeorm';
import { indexProducts, applyIndexSettings } from '../indexer/product.indexer';
import { MeiliClientService } from '../meili.client';
import { MeiliAnalyticsService } from '../services/meili-analytics.service';
import { PRODUCT_INDEX, BATCH_SIZE } from '../constants';

export interface SyncProgress {
  total: number;
  indexed: number;
  failed: number;
  inProgress: boolean;
  startedAt: string | null;
  completedAt: string | null;
  lastError: string | null;
}

const DELETE_TASK_TIMEOUT_MS = 60_000;

const PRODUCT_RELATIONS = [
  'translations',
  'variants',
  'variants.translations',
  'variants.productVariantPrices',
  'variants.facetValues',
  'variants.facetValues.facet',
  'variants.facetValues.facet.translations',
  'variants.facetValues.translations',
  'variants.collections',
  'variants.collections.translations',
  'variants.stockLevels',
  'featuredAsset',
  'customFields.labels',
];

// True when this module is running inside bootstrapWorker() — set in index-worker.ts
const IS_WORKER = process.env.VENDURE_WORKER_CONTEXT === 'true';

@Injectable()
export class MeiliInitialSyncService implements OnApplicationBootstrap {
  private readonly logger = new Logger(MeiliInitialSyncService.name);

  // In-memory progress; also written to Redis via analyticsService for cross-process visibility
  private progress: SyncProgress = {
    total: 0,
    indexed: 0,
    failed: 0,
    inProgress: false,
    startedAt: null,
    completedAt: null,
    lastError: null,
  };

  constructor(
    private readonly connection: TransactionalConnection,
    private readonly clientService: MeiliClientService,
    private readonly analyticsService: MeiliAnalyticsService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const role = IS_WORKER ? 'WORKER' : 'SERVER';
    const host = process.env.MEILI_HOST || 'http://localhost:7700';
    this.logger.log(`[MeiliSync][${role}] Bootstrap — host: ${host}, index: "${PRODUCT_INDEX}"`);

    if (IS_WORKER) {
      // Worker process: apply index settings so they're ready for job processing.
      // Do NOT auto-sync here — the server handles enqueueing the initial sync job.
      this.logger.log('[MeiliSync][WORKER] Applying index settings only (no auto-sync in worker)');
      applyIndexSettings(this.clientService).catch((err: any) => {
        this.logger.warn(`[MeiliSync][WORKER] Settings apply failed (non-fatal): ${err?.message}`);
      });
      return;
    }

    // SERVER process: apply settings then check whether an initial sync is needed.
    // The actual sync is enqueued as a job (processed by the worker) to avoid
    // running two concurrent syncs at startup (server + worker both used to run it).
    applyIndexSettings(this.clientService)
      .then(() => {
        setTimeout(() => {
          this.scheduleAutoSyncIfEmpty().catch((err: any) => {
            this.logger.error(`[MeiliSync] Auto-sync check failed: ${err?.message}`);
          });
        }, 5_000); // wait for DB connections to stabilise and worker to start
      })
      .catch((err: any) => {
        this.logger.error(`[MeiliSync] Failed to apply index settings at startup: ${err?.message}`);
        setTimeout(() => {
          this.scheduleAutoSyncIfEmpty().catch((e: any) => {
            this.logger.error(`[MeiliSync] Auto-sync check failed: ${e?.message}`);
          });
        }, 8_000);
      });
  }

  /**
   * Backward compatibility for syncMeilisearchNow and older dashboard calls.
   */
  async syncAll(): Promise<void> {
    this.logger.log('[MeiliSync] syncAll() called (legacy) — delegating to runSync()');
    return this.runSync();
  }

  // ─── Public API (called by MeiliQueueService process handler in WORKER) ──────

  /**
   * Runs a full reindex. Called from inside the job queue processor (worker).
   * Safe to call concurrently — guarded by the job queue's single-consumer guarantee.
   */
  async runFullSync(): Promise<void> {
    await this.runSync();
  }

  async syncProduct(productId: string | number): Promise<void> {
    this.logger.log(`[MeiliSync] Syncing single product ${productId}`);
    const product = await this.connection.rawConnection.getRepository(Product).findOne({
      where: { id: productId as any },
      relations: PRODUCT_RELATIONS,
    });

    if (!product) {
      this.logger.warn(`[MeiliSync] Product ${productId} not found — skipping`);
      return;
    }

    const result = await indexProducts([product], this.clientService);
    this.logger.log(
      `[MeiliSync] Product ${productId} synced — ${result.totalDocsIndexed} ` +
      `of ${result.totalDocsSent} variant docs indexed ` +
      `(${result.failedDocIds.length} failed)`,
    );
  }

  async clearIndex(): Promise<void> {
    this.logger.log('[MeiliSync] Clearing Meilisearch index...');
    const meili = this.clientService.getClient();
    const index = meili.index(PRODUCT_INDEX);

    const task = await index.deleteAllDocuments();
    const taskUid = (task as any).taskUid;
    this.logger.log(`[MeiliSync] deleteAllDocuments task ${taskUid} enqueued — waiting...`);

    const completed = await meili.tasks.waitForTask(taskUid, {
      timeout: DELETE_TASK_TIMEOUT_MS,
      interval: 500,
    });

    if (completed.status !== 'succeeded') {
      const errMsg = (completed as any).error?.message || JSON.stringify((completed as any).error);
      throw new Error(`[MeiliSync] deleteAllDocuments task ${taskUid} failed: ${errMsg}`);
    }

    this.logger.log(`[MeiliSync] Index cleared (task ${taskUid} succeeded).`);
    this.progress = {
      total: 0,
      indexed: 0,
      failed: 0,
      inProgress: false,
      startedAt: null,
      completedAt: null,
      lastError: null,
    };
  }

  getSyncProgress(): SyncProgress {
    return { ...this.progress };
  }

  // ─── Internal ───────────────────────────────────────────────────────────────

  /**
   * Called from the server at startup. Checks the index and, if empty,
   * signals via Redis that a full sync job should be enqueued.
   * The actual job enqueueing happens in MeiliQueueService.onApplicationBootstrap
   * after both server and worker are ready.
   *
   * We don't enqueue here directly because the job queue may not be ready yet
   * at the point this fires (3-5 s after bootstrap). MeiliQueueService is
   * responsible for enqueueing on first boot via its own bootstrap.
   */
  private async scheduleAutoSyncIfEmpty(): Promise<void> {
    try {
      this.logger.log('[MeiliSync][SERVER] Checking index document count for auto-sync...');

      const healthy = await this.clientService.checkHealth();
      if (!healthy) {
        this.logger.warn('[MeiliSync] Meilisearch not reachable — skipping auto-sync');
        return;
      }

      const meili = this.clientService.getClient();
      const stats = await meili.index(PRODUCT_INDEX).getStats().catch(() => ({ numberOfDocuments: -1 }));
      const docCount = (stats as any).numberOfDocuments ?? -1;

      this.logger.log(`[MeiliSync][SERVER] Current index document count: ${docCount}`);

      if (docCount <= 1) {
        this.logger.log(
          `[MeiliSync][SERVER] Index has ${docCount} doc(s) — marking for auto-sync. ` +
          `MeiliQueueService will enqueue the job.`,
        );
        // Write a flag to Redis that the initial sync is needed.
        // MeiliQueueService reads this and enqueues the job after the queue is ready.
        await this.analyticsService.setNeedsInitialSync(true);
      } else {
        this.logger.log(`[MeiliSync][SERVER] Index already has ${docCount} documents — skipping auto-sync`);
      }
    } catch (err: any) {
      this.logger.warn(`[MeiliSync] Auto-sync check error (non-fatal): ${err?.message}`);
    }
  }

  /**
   * Core sync loop. Runs only in the worker (via job queue processor).
   *
   * Two-query pagination strategy:
   *   1. Load ALL non-deleted product IDs in one query (no relations).
   *      This is the only correct way to paginate when the entity has
   *      to-many relations — `repository.find({ relations, skip, take })`
   *      can silently miss or duplicate rows because TypeORM's offset
   *      applies after the join.
   *   2. Walk the ID list in batches; for each batch load the products
   *      WHERE id IN (...) with all relations.
   *   3. Index each batch; never abort the whole sync on a single batch
   *      failure — indexProducts now isolates bad documents internally.
   *   4. Verify final count.
   */
  async runSync(): Promise<void> {
    if (this.progress.inProgress) {
      this.logger.warn('[MeiliSync] runSync() called but already in progress — skipping');
      return;
    }

    this.progress = {
      total: 0,
      indexed: 0,
      failed: 0,
      inProgress: true,
      startedAt: new Date().toISOString(),
      completedAt: null,
      lastError: null,
    };

    this.logger.log('[MeiliSync] ===== Starting full reindex =====');

    try {
      this.logger.log('[MeiliSync] Step 0: Applying index settings...');
      await applyIndexSettings(this.clientService);

      this.logger.log('[MeiliSync] Step 1: Clearing existing index documents...');
      await this.clearIndex();
      this.progress.inProgress = true;
      this.progress.startedAt = this.progress.startedAt ?? new Date().toISOString();

      // Step 2: load ALL non-deleted product IDs (no relations, no joins).
      // This always returns exactly the count we expect — no skip/take/
      // to-many surprises.
      this.logger.log('[MeiliSync] Step 2: Loading all non-deleted product IDs...');
      const idRows = await this.connection.rawConnection
        .getRepository(Product)
        .createQueryBuilder('product')
        .select('product.id', 'id')
        .where('product.deletedAt IS NULL')
        .orderBy('product.id', 'ASC')
        .getRawMany<{ id: string | number }>();

      const allIds = idRows.map((r) => r.id);
      const total = allIds.length;
      this.progress.total = total;
      const totalBatches = Math.ceil(total / BATCH_SIZE);
      this.logger.log(
        `[MeiliSync] Found ${total} products. Will load in ${totalBatches} batch(es) ` +
        `of ${BATCH_SIZE}.`,
      );

      if (total === 0) {
        this.logger.warn('[MeiliSync] No products found in database — nothing to sync');
        this.progress.inProgress = false;
        this.progress.completedAt = new Date().toISOString();
        return;
      }

      // Step 3: for each batch of IDs, load with relations and index.
      let batchNum = 0;
      let totalFailedDocs = 0;
      let totalProductsSkipped = 0;
      const batchErrors: string[] = [];

      for (let i = 0; i < total; i += BATCH_SIZE) {
        batchNum++;
        const batchIds = allIds.slice(i, i + BATCH_SIZE);
        this.logger.log(
          `[MeiliSync] Step 3: Batch #${batchNum}/${totalBatches} — loading ` +
          `${batchIds.length} products by id (first=${batchIds[0]}, last=${batchIds[batchIds.length - 1]})`,
        );

        let products: Product[];
        try {
          products = await this.connection.rawConnection.getRepository(Product).find({
            where: { id: In(batchIds as any[]) },
            relations: PRODUCT_RELATIONS,
          });
        } catch (loadErr: any) {
          this.logger.error(
            `[MeiliSync] Batch #${batchNum}: DB load FAILED for ids ${batchIds[0]}..${batchIds[batchIds.length - 1]}: ` +
            (loadErr?.message ?? loadErr),
            loadErr?.stack,
          );
          batchErrors.push(`batch ${batchNum}: ${loadErr?.message}`);
          this.progress.failed += batchIds.length;
          continue; // try next batch — never give up on the whole sync
        }

        if (products.length !== batchIds.length) {
          this.logger.warn(
            `[MeiliSync] Batch #${batchNum}: requested ${batchIds.length} ids but ` +
            `DB returned ${products.length}. ${batchIds.length - products.length} products ` +
            `were dropped (deleted between phases? relation filter?).`,
          );
        }

        try {
          const result = await indexProducts(products, this.clientService);
          this.progress.indexed += result.totalDocsIndexed;
          totalFailedDocs += result.failedDocIds.length;
          totalProductsSkipped += result.productsSkipped;
          const pct = total > 0 ? Math.round((this.progress.indexed / (total * 3)) * 100) : 100;
          this.logger.log(
            `[MeiliSync] Batch #${batchNum} done — ` +
            `sent ${result.totalDocsSent}, indexed ${result.totalDocsIndexed}, ` +
            `failed ${result.failedDocIds.length}, skipped ${result.productsSkipped} products. ` +
            `Running total: ${this.progress.indexed} docs ~${pct}%`,
          );
        } catch (err: any) {
          // indexProducts is supposed to never throw; if it does it's a bug.
          this.logger.error(
            `[MeiliSync] Batch #${batchNum} threw unexpectedly: ${err?.message}`,
            err?.stack,
          );
          this.progress.failed += products.length;
          batchErrors.push(`batch ${batchNum}: ${err?.message}`);
          // Do not throw — keep going.
        }
      }

      this.progress.failed = totalFailedDocs + this.progress.failed;
      if (batchErrors.length > 0) {
        this.progress.lastError = batchErrors.slice(0, 5).join(' | ');
      }
      if (totalProductsSkipped > 0) {
        this.logger.warn(
          `[MeiliSync] ${totalProductsSkipped} products were skipped (no variants).`,
        );
      }

      this.logger.log('[MeiliSync] Step 4: Verifying final index document count...');
      try {
        const meili = this.clientService.getClient();
        const finalStats = await meili.index(PRODUCT_INDEX).getStats();
        const finalCount = (finalStats as any).numberOfDocuments ?? -1;
        this.logger.log(
          `[MeiliSync] Final Meilisearch count: ${finalCount} ` +
          `(indexed ${this.progress.indexed} variant docs from ${total} products)`,
        );
        if (finalCount !== this.progress.indexed) {
          this.logger.warn(
            `[MeiliSync] Count mismatch — Meilisearch: ${finalCount}, sent: ${this.progress.indexed}. ` +
            `Check for duplicate variant IDs or task errors.`,
          );
        }
      } catch (statsErr: any) {
        this.logger.warn(`[MeiliSync] Could not verify final doc count: ${statsErr?.message}`);
      }

      await this.analyticsService.recordSyncSuccess().catch(() => {});
      await this.analyticsService.setNeedsInitialSync(false).catch(() => {});

      this.progress.inProgress = false;
      this.progress.completedAt = new Date().toISOString();

      this.logger.log(
        `[MeiliSync] ===== Full reindex complete: ${this.progress.indexed} variant docs from ` +
        `${total} products (${this.progress.failed} failed) =====`,
      );
    } catch (err: any) {
      this.progress.inProgress = false;
      this.progress.completedAt = new Date().toISOString();
      this.progress.lastError = err?.message ?? 'Unknown error';

      this.logger.error(
        `[MeiliSync] ===== Full reindex FAILED: ${err?.message} =====`,
        err?.stack,
      );
      await this.analyticsService.recordSyncFailed().catch(() => {});
      throw err;
    }
  }
}
