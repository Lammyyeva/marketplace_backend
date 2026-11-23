import { Injectable, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
  EventBus,
  ProductEvent,
  TransactionalConnection,
  RequestContext,
  Logger,
  RequestContextService,
} from "@vendure/core";
import { EntityManager } from "typeorm";
import { ProductLabelTracker } from "../entities/product-label-tracker.entity";

const NEW_LABEL_TTL_DAYS = 7;
const HIT_LABEL_TTL_DAYS = 7;

@Injectable()
export class LabelTrackerService implements OnModuleInit {
  constructor(
    private eventBus: EventBus,
    private connection: TransactionalConnection,
    private requestContextService: RequestContextService,
  ) {}

  onModuleInit() {
    this.eventBus.ofType(ProductEvent).subscribe(async (event) => {
      try {
        if (event.type === "created") {
          await this.assignNewLabelToProduct(event.ctx, event.product.id as any);
        } else if (event.type === "updated") {
          await this.syncNewLabel(event.ctx, event.product.id as any);
        }
      } catch (err) {
        Logger.error(
          `Error processing product ${event.type} event for product ${event.product.id}: ${err}`,
          "LabelTrackerService",
        );
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // NEW LABEL LOGIC
  // ─────────────────────────────────────────────────────────────────

  private async assignNewLabelToProduct(ctx: RequestContext, productId: number) {
    const newLabelId = process.env.NEW_ID;
    if (!newLabelId) return;

    const [{ count }] = await this.connection.rawConnection.query(
      `SELECT COUNT(*) as count FROM product_custom_fields_labels_label 
       WHERE "productId" = $1 AND "labelId" = $2`,
      [productId, newLabelId],
    );

    if (Number(count) === 0) {
      await this.connection.rawConnection.query(
        `INSERT INTO product_custom_fields_labels_label ("productId", "labelId") 
         VALUES ($1, $2)`,
        [productId, newLabelId],
      );
    }

    const repo = this.connection.getRepository(ctx, ProductLabelTracker);
    await repo
      .createQueryBuilder()
      .insert()
      .values({
        productId: productId as any,
        labelId: newLabelId as any,
        expiresAt: () => `NOW() + INTERVAL '${NEW_LABEL_TTL_DAYS} days'`,
      })
      .orIgnore()
      .execute();
  }

  private async syncNewLabel(ctx: RequestContext, productId: number) {
    const newLabelId = process.env.NEW_ID;
    if (!newLabelId) return;

    const [{ count }] = await this.connection.rawConnection.query(
      `SELECT COUNT(*) as count FROM product_custom_fields_labels_label 
       WHERE "productId" = $1 AND "labelId" = $2`,
      [productId, newLabelId],
    );

    const repo = this.connection.getRepository(ctx, ProductLabelTracker);

    if (Number(count) > 0) {
      await repo
        .createQueryBuilder()
        .insert()
        .values({
          productId: productId as any,
          labelId: newLabelId as any,
          expiresAt: () => `NOW() + INTERVAL '${NEW_LABEL_TTL_DAYS} days'`,
        })
        .orIgnore()
        .execute();
    } else {
      await repo.delete({
        productId: productId as any,
        labelId: newLabelId as any,
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // WEEKLY CRON: handles both New label expiry + Hit label sync
  // ─────────────────────────────────────────────────────────────────

  @Cron("0 0 * * 0") // Every Sunday at midnight
  async handleWeeklyLabelSync() {
    Logger.info("Running weekly label sync...", "LabelTrackerService");
    const ctx = await this.requestContextService.create({ apiType: "admin" });

    try {
      await this.connection
        .getRepository(ctx, ProductLabelTracker)
        .metadata.connection.transaction(async (manager) => {
          await this.removeExpiredLabels(manager);
          await this.syncHitLabels(ctx, manager);
        });

      Logger.info("Weekly label sync completed.", "LabelTrackerService");
    } catch (err: any) {
      Logger.error(
        `Weekly label sync error: ${err.message}`,
        "LabelTrackerService",
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 1: Remove expired label assignments
  // ─────────────────────────────────────────────────────────────────

  private async removeExpiredLabels(manager: EntityManager) {
    // Remove from the join table any label<->product rows that have expired
    await manager.query(`
      DELETE FROM product_custom_fields_labels_label
      WHERE ("labelId"::text, "productId"::text) IN (
        SELECT "labelId"::text, "productId"::text
        FROM product_label_tracker
        WHERE "expiresAt" <= NOW()
      )
    `);

    // Remove expired tracker rows
    await manager
      .createQueryBuilder()
      .delete()
      .from(ProductLabelTracker)
      .where('"expiresAt" <= NOW()')
      .execute();

    Logger.info("Expired labels removed.", "LabelTrackerService");
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP 2: Sync Hit label — top N most sold products (last 30 days)
  // ─────────────────────────────────────────────────────────────────

  private async syncHitLabels(ctx: RequestContext, manager: EntityManager) {
    const hitLabelId = process.env.HIT_ID;
    const topN = Number(process.env.HIT_TOP_N ?? 10);
    if (!hitLabelId) {
      Logger.warn("HIT_ID not set, skipping hit label sync.", "LabelTrackerService");
      return;
    }

    // ── 1. Find top N products by units sold in last 30 days ──────
    const topProducts: { productId: string }[] = await manager.query(
      `
      SELECT pv."productId"::text
      FROM order_line oli
      JOIN product_variant pv ON pv.id = oli."productVariantId"
      JOIN "order" o ON o.id = oli."orderId"
      WHERE o."orderPlacedAt" >= NOW() - INTERVAL '30 days'
        AND o.state IN ('PaymentSettled', 'Shipped', 'Delivered', 'Completed')
      GROUP BY pv."productId"
      ORDER BY SUM(oli.quantity) DESC
      LIMIT $1
      `,
      [topN],
    );

    const topProductIds = topProducts.map((r) => r.productId);

    Logger.info(
      `Top ${topN} products by sales: [${topProductIds.join(", ")}]`,
      "LabelTrackerService",
    );

    // ── 2. Get products currently tracked as Hit ───────────────────
    const currentTracked: { productId: string }[] = await manager.query(
      `
      SELECT "productId"::text
      FROM product_label_tracker
      WHERE "labelId" = $1
      `,
      [hitLabelId],
    );

    const currentTrackedIds = currentTracked.map((r) => r.productId);

    // ── 3. Determine what needs to change ─────────────────────────
    const toAdd = topProductIds.filter((id) => !currentTrackedIds.includes(id));
    const toRefresh = topProductIds.filter((id) => currentTrackedIds.includes(id));

    // ── 4. Assign label + start tracking for new hit products ─────
    for (const productId of toAdd) {
      // Assign the Hit label
      await manager.query(
        `
        INSERT INTO product_custom_fields_labels_label ("labelId", "productId")
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [hitLabelId, productId],
      );

      // Start tracking with 7-day expiry
      await manager.query(
        `
        INSERT INTO product_label_tracker 
          ("productId", "labelId", "expiresAt", "createdAt", "updatedAt")
        VALUES ($1, $2, NOW() + INTERVAL '${HIT_LABEL_TTL_DAYS} days', NOW(), NOW())
        ON CONFLICT ("productId", "labelId") 
        DO UPDATE SET 
          "expiresAt" = NOW() + INTERVAL '${HIT_LABEL_TTL_DAYS} days',
          "updatedAt" = NOW()
        `,
        [productId, hitLabelId],
      );
    }

    // ── 5. Refresh expiry for products still in top N ─────────────
    for (const productId of toRefresh) {
      await manager.query(
        `
        UPDATE product_label_tracker
        SET 
          "expiresAt" = NOW() + INTERVAL '${HIT_LABEL_TTL_DAYS} days',
          "updatedAt" = NOW()
        WHERE "productId" = $1 AND "labelId" = $2
        `,
        [productId, hitLabelId],
      );
    }

    Logger.info(
      `Hit label sync done — added: ${toAdd.length}, refreshed: ${toRefresh.length}, expiring naturally: ${currentTrackedIds.filter((id) => !topProductIds.includes(id)).length}`,
      "LabelTrackerService",
    );
  }
}
