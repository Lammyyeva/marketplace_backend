import { Injectable } from "@nestjs/common";
import {
  ID,
  RequestContext,
  TransactionalConnection,
  Promotion,
} from "@vendure/core";
import { In } from "typeorm";
import { PromotionVariantSale } from "../entities/promotion-variant-sale.entity";

@Injectable()
export class VariantSoldCountService {
  constructor(private connection: TransactionalConnection) {}

  async getSoldCount(
    ctx: RequestContext,
    variantId: ID,
    promotionId: ID,
  ): Promise<number> {
    const repo = this.connection.getRepository(ctx, PromotionVariantSale);
    const row = await repo.findOne({
      where: {
        variantId: Number(variantId),
        promotionId: Number(promotionId),
        channelId: Number(ctx.channelId),
      },
    });
    return row?.sold ?? 0;
  }

  async getSoldCounts(ctx: RequestContext, promotionId: ID, variantIds: ID[]) {
    if (!variantIds.length) return [];

    const repo = this.connection.getRepository(ctx, PromotionVariantSale);
    const rows = await repo.find({
      where: {
        variantId: In(variantIds.map((id) => Number(id))),
        promotionId: Number(promotionId),
        channelId: Number(ctx.channelId),
      },
    });

    const soldMap = new Map<number, number>(
      rows.map((r) => [r.variantId, r.sold]),
    );

    const promotion = await this.connection
      .getRepository(ctx, Promotion)
      .findOne({
        where: { id: promotionId },
      });
    if (!promotion) return [];

    const action = (promotion.actions || []).find(
      (a) => a.code === "per_variant_discount",
    );
    let variantDiscounts: any[] = [];
    if (action) {
      const arg = (action.args || []).find(
        (a) => a.name === "variantDiscounts" || a.name === "variantDiscountMap",
      );
      if (arg) {
        try {
          variantDiscounts = JSON.parse(arg.value || "[]");
        } catch {}
      }
    }

    return variantIds.map((id) => {
      const soldCount = soldMap.get(Number(id)) ?? 0;
      const entry = variantDiscounts.find(
        (d) => String(d.variantId) === String(id),
      );
      const totalUnitsLimit = entry?.totalUnitsLimit ?? entry?.totalLimit ?? 0;

      return {
        variantId: id,
        soldCount,
        remaining:
          totalUnitsLimit > 0 ? Math.max(0, totalUnitsLimit - soldCount) : null,
        isExhausted: totalUnitsLimit > 0 && soldCount >= totalUnitsLimit,
      };
    });
  }

  async incrementSold(
    ctx: RequestContext,
    variantId: ID,
    promotionId: ID,
    qty: number,
    totalLimit: number,
  ): Promise<void> {
    if (qty <= 0) return;

    await this.connection.withTransaction(ctx, async (transactionCtx) => {
      const repo = this.connection.getRepository(
        transactionCtx,
        PromotionVariantSale,
      );

      const existing = await repo.findOne({
        where: {
          variantId: Number(variantId),
          promotionId: Number(promotionId),
          channelId: Number(ctx.channelId),
        },
        lock: { mode: "pessimistic_write" },
      });

      if (existing) {
        const safeQty = Math.min(qty, Math.max(0, totalLimit - existing.sold));
        if (safeQty <= 0) return;
        existing.sold += safeQty;
        await repo.save(existing);
      } else {
        const safeQty = Math.min(qty, totalLimit);
        const newRow = repo.create({
          variantId: Number(variantId),
          promotionId: Number(promotionId),
          channelId: Number(ctx.channelId),
          sold: safeQty,
        });
        await repo.save(newRow);
      }
    });
  }

  async decrementSold(
    ctx: RequestContext,
    variantId: ID,
    promotionId: ID,
    qty: number,
  ): Promise<void> {
    if (qty <= 0) return;

    await this.connection.withTransaction(ctx, async (transactionCtx) => {
      const repo = this.connection.getRepository(
        transactionCtx,
        PromotionVariantSale,
      );

      const existing = await repo.findOne({
        where: {
          variantId: Number(variantId),
          promotionId: Number(promotionId),
          channelId: Number(ctx.channelId),
        },
        lock: { mode: "pessimistic_write" },
      });

      if (existing) {
        existing.sold = Math.max(0, existing.sold - qty);
        await repo.save(existing);
      }
    });
  }
}
