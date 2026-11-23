import { Injectable, OnModuleInit } from "@nestjs/common";
import {
  JobQueue,
  JobQueueService,
  TransactionalConnection,
  RequestContext,
  RequestContextService,
  Promotion,
  ProductVariant,
  Logger,
} from "@vendure/core";
import { ActiveSaleLookup } from "../entities/active-sale-lookup.entity";
import { parseJsonArg } from "../utils/promotion-args";

const loggerCtx = "ActiveSaleSync";

@Injectable()
export class ActiveSaleSyncService implements OnModuleInit {
  private syncJob: JobQueue<any>;

  constructor(
    private jobQueueService: JobQueueService,
    private connection: TransactionalConnection,
    private requestContextService: RequestContextService,
  ) {}

  async onModuleInit() {
    this.syncJob = await this.jobQueueService.createQueue({
      name: "sync-active-sales",
      process: async (job) => {
        try {
          const ctx = await this.requestContextService.create({
            apiType: "admin",
          });
          await this.performSync(ctx);
        } catch (err: any) {
          Logger.error(`Sync job failed: ${err.message}`, loggerCtx, err.stack);
          throw err; // Re-throw so the job queue knows it failed
        }
      },
    });
  }

  triggerSyncJob() {
    this.syncJob.add({});
  }

  private async performSync(ctx: RequestContext) {
    Logger.info("Rebuilding ActiveSaleLookup table...", loggerCtx);
    const repo = this.connection.getRepository(ctx, ActiveSaleLookup);

    try {
      await repo.clear(); // Fast table truncate
    } catch (e) {
      Logger.error("Failed to clear ActiveSaleLookup table", loggerCtx);
    }

    const now = new Date();

    const promotions = await this.connection
      .getRepository(ctx, Promotion)
      .createQueryBuilder("p")
      .where("p.enabled = :enabled", { enabled: true })
      .andWhere("p.deletedAt IS NULL")
      .andWhere("(p.startsAt IS NULL OR p.startsAt <= :now)", { now })
      .andWhere("(p.endsAt IS NULL OR p.endsAt >= :now)", { now })
      .getMany();

    const entriesToInsert: Partial<ActiveSaleLookup>[] = [];
    const variantRepo = this.connection.getRepository(ctx, ProductVariant);

    // Action codes that represent a real price reduction (shown in Sale collection filter)
    const DISCOUNT_ACTION_CODES = new Set([
      "per_variant_discount",
      "facet_based_discount_custom",
      "category_based_discount",
      "global_item_percentage_discount",
      "order_percentage_discount",
    ]);

    for (const p of promotions) {
      const actionsAndConditions = [
        ...(p.actions ?? []),
        ...(p.conditions ?? []),
      ];
      const matchedVariantIds = new Set<string>();

      // Determine if this promotion has any real percentage-discount action
      const isDiscount = (p.actions ?? []).some((a) =>
        DISCOUNT_ACTION_CODES.has(a.code),
      );

      for (const item of actionsAndConditions) {
        const vIds =
          parseJsonArg<string[]>(item.args, "productVariantIds", []) ||
          parseJsonArg<string[]>(item.args, "variantIds", []);
        for (const id of vIds) matchedVariantIds.add(String(id));

        if (item.code === "per_variant_discount") {
          const discounts = parseJsonArg<any[]>(
            item.args,
            "variantDiscounts",
            [],
          );
          for (const d of discounts) matchedVariantIds.add(String(d.variantId));
        }

        const catDiscounts = parseJsonArg<any[]>(
          item.args,
          "categoryDiscounts",
          [],
        );
        const catIds = catDiscounts.map((d: any) => String(d.categoryId));
        if (catIds.length > 0) {
          const rows = await variantRepo
            .createQueryBuilder("pv")
            .select("pv.id", "id")
            .innerJoin("pv.product", "product")
            .innerJoin("product.customFields.categories", "category")
            .where("category.id IN (:...catIds)", { catIds })
            .andWhere('pv."deletedAt" IS NULL')
            .getRawMany();
          for (const r of rows) matchedVariantIds.add(String(r.id));
        }

        const facetDiscounts = parseJsonArg<any[]>(
          item.args,
          "facetDiscounts",
          [],
        );
        const facetValueIds = facetDiscounts.map((d: any) =>
          String(d.facetValueId),
        );
        if (facetValueIds.length > 0) {
          const rows = await variantRepo
            .createQueryBuilder("pv")
            .select("pv.id", "id")
            .leftJoin("pv.facetValues", "pvfv")
            .leftJoin("pv.product", "product")
            .leftJoin("product.facetValues", "pfv")
            .where(
              "pvfv.id IN (:...facetValueIds) OR pfv.id IN (:...facetValueIds)",
              { facetValueIds },
            )
            .andWhere('pv."deletedAt" IS NULL')
            .getRawMany();
          for (const r of rows) matchedVariantIds.add(String(r.id));
        }

        /* Handle Global Discounts / Restrictions */
        if (["order_percentage_discount"].includes(item.code)) {
          const noTargets = !(item.args ?? []).some(
            (a) =>
              [
                "productVariantIds",
                "variantIds",
                "variantDiscounts",
                "facetDiscounts",
                "categoryDiscounts",
              ].includes(a.name) &&
              a.value !== "[]" &&
              a.value !== "",
          );
          if (noTargets) {
            const rows = await variantRepo
              .createQueryBuilder("pv")
              .select("pv.id", "id")
              .where('pv."deletedAt" IS NULL')
              .getRawMany();
            for (const r of rows) matchedVariantIds.add(String(r.id));
          }
        }
      }

      for (const vid of matchedVariantIds) {
        entriesToInsert.push({
          variantId: Number(vid),
          promotionId: Number(p.id),
          expiresAt: p.endsAt ?? null,
          isDiscount,
        });
      }
    }

    if (entriesToInsert.length > 0) {
      await repo.save(entriesToInsert, { chunk: 1000 });
    }

    Logger.info(
      `ActiveSaleLookup populated with ${entriesToInsert.length} rules across ${promotions.length} enabled promotions.`,
      loggerCtx,
    );
  }
}
