import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  EventBus,
  ProductEvent,
  ProductVariantEvent,
  StockMovementEvent,
  CollectionModificationEvent,
  FacetValueEvent,
  TransactionalConnection,
} from '@vendure/core';
import { MeiliQueueService } from './meili-queue.service';

// True when this module is running inside bootstrapWorker()
const IS_WORKER = process.env.VENDURE_WORKER_CONTEXT === 'true';

/**
 * Listens to Vendure domain events and enqueues Meilisearch sync jobs.
 *
 * Previously this class ran direct sync in both server AND worker processes,
 * causing two concurrent syncs on every product change. Now it only enqueues
 * jobs from the server process; the worker processes them via MeiliQueueService.
 */
@Injectable()
export class MeiliSyncListener implements OnApplicationBootstrap {
  private readonly logger = new Logger(MeiliSyncListener.name);

  constructor(
    private eventBus: EventBus,
    private connection: TransactionalConnection,
    private queueService: MeiliQueueService,
  ) {}

  async onApplicationBootstrap() {
    if (IS_WORKER) {
      // Worker must NOT subscribe — it only processes jobs, never enqueues them.
      // A worker-side EventBus subscription would cause a second enqueue on top
      // of the server's, doubling every sync job.
      this.logger.log('[MeiliSync][WORKER] Event listener skipped — running in worker context');
      return;
    }

    this.subscribeToEvents();
    this.logger.log(
      '[MeiliSync][SERVER] Event listener initialized — subscribed to ' +
      'ProductEvent, ProductVariantEvent, StockMovementEvent, CollectionModificationEvent.',
    );
  }

  private subscribeToEvents() {
    this.eventBus.ofType(ProductEvent).subscribe((event) => {
      this.handleEvent(async () => {
        if (event.type === 'deleted') {
          this.logger.log(`[MeiliSync][EVENT] Product deleted: ${event.entity.id} — enqueueing delete`);
          await this.handleDeleteProduct(event.entity.id);
        } else {
          this.logger.log(`[MeiliSync][EVENT] Product ${event.type}: id=${event.entity.id}`);
          await this.queueService.enqueueProductSync(event.entity.id);
        }
      }, 'ProductEvent');
    });

    this.eventBus.ofType(ProductVariantEvent).subscribe((event) => {
      this.handleEvent(async () => {
        const variants = event.entity;
        if (!variants.length) return;

        let productId = (variants[0] as any).productId as string | number | undefined;
        if (!productId) {
          productId = await this.lookupProductIdForVariant(variants[0].id);
        }
        if (!productId) {
          this.logger.warn(
            `ProductVariantEvent: cannot resolve productId for variant ${variants[0].id} — skipping`,
          );
          return;
        }

        if (event.type === 'deleted') {
          const variantIds = variants.map((v) => v.id);
          this.logger.log(`Variants deleted [${variantIds.join(',')}] — enqueueing delete`);
          await this.queueService.enqueueDeleteVariants(variantIds);
        } else {
          this.logger.log(`Variants ${event.type} for product ${productId} — enqueueing sync`);
          await this.queueService.enqueueProductSync(productId);
        }
      }, 'ProductVariantEvent');
    });

    this.eventBus.ofType(StockMovementEvent).subscribe((event) => {
      this.handleEvent(async () => {
        const movements = event.stockMovements || [];
        if (!movements.length) return;

        const variantIds = [
          ...new Set(
            movements
              .map((m) => (m as any).productVariantId ?? (m as any).productVariant?.id)
              .filter(Boolean) as (string | number)[],
          ),
        ];
        if (!variantIds.length) return;

        const productIds = await this.lookupProductIdsForVariants(variantIds);
        for (const productId of productIds) {
          await this.queueService.enqueueProductSync(productId);
        }
      }, 'StockMovementEvent');
    });

    this.eventBus.ofType(CollectionModificationEvent).subscribe((event) => {
      this.handleEvent(async () => {
        const variantIds = event.productVariantIds || [];
        if (!variantIds.length) return;

        const productIds = await this.lookupProductIdsForVariants(variantIds);
        for (const productId of productIds) {
          await this.queueService.enqueueProductSync(productId);
        }
      }, 'CollectionModificationEvent');
    });

    this.eventBus.ofType(FacetValueEvent).subscribe((event) => {
      this.logger.debug(`FacetValueEvent (${event.type}) — no immediate reindex needed`);
    });
  }

  /** Wraps an async handler, logs errors, never throws back to EventBus. */
  private handleEvent(fn: () => Promise<void>, eventName: string): void {
    fn().catch((err: any) => {
      this.logger.error(`Error handling ${eventName}: ${err?.message}`, err?.stack);
    });
  }

  private async handleDeleteProduct(productId: string | number): Promise<void> {
    try {
      const variants = await this.connection.rawConnection
        .query(`SELECT id FROM product_variant WHERE "productId" = $1`, [productId])
        .catch(() => [] as any[]);

      const ids: (string | number)[] =
        variants.length > 0 ? variants.map((v: any) => v.id) : [productId];

      await this.queueService.enqueueDeleteVariants(ids);
      this.logger.log(`Product ${productId}: ${ids.length} variant delete jobs enqueued`);
    } catch (error) {
      this.logger.error(
        `Sync delete enqueue failed for product ${productId}: ${(error as any).message}`,
        (error as any).stack,
      );
    }
  }

  private async lookupProductIdForVariant(
    variantId: string | number,
  ): Promise<string | number | undefined> {
    try {
      const rows = await this.connection.rawConnection.query(
        `SELECT "productId" FROM product_variant WHERE id = $1 LIMIT 1`,
        [variantId],
      );
      return rows?.[0]?.productId;
    } catch {
      return undefined;
    }
  }

  private async lookupProductIdsForVariants(
    variantIds: (string | number)[],
  ): Promise<(string | number)[]> {
    if (!variantIds.length) return [];
    try {
      const rows = await this.connection.rawConnection.query(
        `SELECT DISTINCT "productId" FROM product_variant WHERE id = ANY($1)`,
        [variantIds],
      );
      return rows.map((r: any) => r.productId);
    } catch {
      return [];
    }
  }
}
