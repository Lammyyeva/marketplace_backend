import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import {
  EventBus,
  Logger,
  Order,
  OrderPlacedEvent,
  OrderStateTransitionEvent,
  PromotionService,
  RequestContext,
  TransactionalConnection,
} from "@vendure/core";
import { VariantSoldCountService } from "./variant-sold-count.service";

const loggerCtx = "PromotionStatusListener";

@Injectable()
export class PromotionStatusListener implements OnApplicationBootstrap {
  constructor(
    private eventBus: EventBus,
    private promotionService: PromotionService,
    private connection: TransactionalConnection,
    private variantSoldCountService: VariantSoldCountService,
  ) {}

  onApplicationBootstrap() {
    this.eventBus.ofType(OrderPlacedEvent).subscribe(async ({ ctx, order }) => {
      Logger.info(
        `[PromotionStatusListener] OrderPlacedEvent received for Order ${order.code}`,
        loggerCtx,
      );

      const fullOrder = await this.connection
        .getRepository(ctx, Order)
        .findOne({
          where: { id: order.id },
          relations: ["promotions", "lines", "lines.productVariant"],
        });

      if (!fullOrder?.promotions?.length) return;

      for (const partialPromo of fullOrder.promotions) {
        await this.handlePromotion(ctx, fullOrder, Number(partialPromo.id));
      }
    });

    this.eventBus
      .ofType(OrderStateTransitionEvent)
      .subscribe(async ({ ctx, order, toState }) => {
        if (toState === "Cancelled") {
          Logger.info(
            `[PromotionStatusListener] OrderStateTransitionEvent (Cancelled) received for Order ${order.code}`,
            loggerCtx,
          );
          const fullOrder = await this.connection
            .getRepository(ctx, Order)
            .findOne({
              where: { id: order.id },
              relations: ["promotions", "lines", "lines.productVariant"],
            });
          if (!fullOrder?.promotions?.length) return;

          for (const partialPromo of fullOrder.promotions) {
            await this.handlePromotionCancellation(
              ctx,
              fullOrder,
              Number(partialPromo.id),
            );
          }
        }
      });
  }

  private async handlePromotion(
    ctx: RequestContext,
    order: Order,
    promotionId: number,
  ): Promise<void> {
    const promotion = await this.promotionService.findOne(ctx, promotionId);
    if (!promotion) return;

    const isPerVariant = (promotion.actions ?? []).some(
      (a: any) => a.code === "per_variant_discount",
    );

    if (isPerVariant) {
      await this.incrementPerVariantSoldCount(ctx, order, promotion);
      await this.checkAndDisablePerVariantPromotion(ctx, promotionId);
    }
  }

  private async handlePromotionCancellation(
    ctx: RequestContext,
    order: Order,
    promotionId: number,
  ): Promise<void> {
    const promotion = await this.promotionService.findOne(ctx, promotionId);
    if (!promotion) return;

    const isPerVariant = (promotion.actions ?? []).some(
      (a: any) => a.code === "per_variant_discount",
    );

    if (isPerVariant) {
      await this.decrementPerVariantSoldCount(ctx, order, promotion);
    }
  }

  private async checkAndDisablePerVariantPromotion(
    ctx: RequestContext,
    promotionId: number,
  ): Promise<void> {
    const promotion = await this.promotionService.findOne(ctx, promotionId);
    if (!promotion) return;

    const action = (promotion.actions ?? []).find(
      (a: any) => a.code === "per_variant_discount",
    );
    if (!action) return;

    let entries: any[] = [];
    try {
      entries = JSON.parse(
        (action.args ?? []).find((a: any) => a.name === "variantDiscounts")
          ?.value ?? "[]",
      );
    } catch {
      return;
    }

    const limitedEntries = entries.filter(
      (e: any) => (Number(e.totalUnitsLimit) || 0) > 0,
    );
    if (limitedEntries.length === 0) return; // No limits defined, never disable

    // Read actual sold counts from the entity
    const allExhausted = await Promise.all(
      limitedEntries.map(async (e: any) => {
        const sold = await this.variantSoldCountService.getSoldCount(
          ctx,
          e.variantId,
          promotionId,
        );
        return sold >= Number(e.totalUnitsLimit);
      }),
    ).then((results) => results.every(Boolean));

    if (allExhausted) {
      await this.promotionService.updatePromotion(ctx, {
        id: promotionId,
        enabled: false,
      });
      Logger.info(
        `Promotion ${promotionId} auto-disabled (all variant pools exhausted)`,
        loggerCtx,
      );
    }
  }

  private async incrementPerVariantSoldCount(
    ctx: RequestContext,
    order: Order,
    promotion: any,
  ): Promise<void> {
    const action = (promotion.actions ?? []).find(
      (a: any) => a.code === "per_variant_discount",
    );
    if (!action) return;

    const mapArg = (action.args ?? []).find(
      (a: any) => a.name === "variantDiscounts",
    );
    if (!mapArg?.value) return;

    let entries: any[] = [];
    try {
      entries = JSON.parse(mapArg.value);
    } catch {
      return;
    }

    for (const line of order.lines ?? []) {
      if (!line.productVariant) continue;

      const variantId = String(line.productVariant.id);
      const entry = entries.find((e: any) => String(e.variantId) === variantId);
      if (!entry) continue;

      const totalUnitsLimit = Number(entry.totalUnitsLimit) || 0;
      const maxQtyPerOrder = Number(entry.maxQtyPerOrder) || 0;
      if (totalUnitsLimit <= 0) continue; // No pool defined — nothing to track

      // Read current sold count before locking
      const sold = await this.variantSoldCountService.getSoldCount(
        ctx,
        variantId,
        promotion.id,
      );
      const remaining = Math.max(0, totalUnitsLimit - sold);
      if (remaining <= 0) continue; // Pool already exhausted

      const maxQty = maxQtyPerOrder > 0 ? maxQtyPerOrder : line.quantity;
      const effectiveQty = Math.min(line.quantity, maxQty, remaining);

      if (effectiveQty > 0) {
        await this.variantSoldCountService.incrementSold(
          ctx,
          variantId,
          promotion.id,
          effectiveQty,
          totalUnitsLimit,
        );
      }
    }
  }

  private async decrementPerVariantSoldCount(
    ctx: RequestContext,
    order: Order,
    promotion: any,
  ): Promise<void> {
    const action = (promotion.actions ?? []).find(
      (a: any) => a.code === "per_variant_discount",
    );
    if (!action) return;

    const mapArg = (action.args ?? []).find(
      (a: any) => a.name === "variantDiscounts",
    );
    if (!mapArg?.value) return;

    let entries: any[] = [];
    try {
      entries = JSON.parse(mapArg.value);
    } catch {
      return;
    }

    for (const line of order.lines ?? []) {
      if (!line.productVariant) continue;

      const variantId = String(line.productVariant.id);
      const entry = entries.find((e: any) => String(e.variantId) === variantId);
      if (!entry) continue;

      const totalUnitsLimit = Number(entry.totalUnitsLimit) || 0;
      const maxQtyPerOrder = Number(entry.maxQtyPerOrder) || 0;
      if (totalUnitsLimit <= 0) continue; // No pool defined

      const maxQty = maxQtyPerOrder > 0 ? maxQtyPerOrder : line.quantity;
      const effectiveQty = Math.min(line.quantity, maxQty);

      if (effectiveQty > 0) {
        await this.variantSoldCountService.decrementSold(
          ctx,
          variantId,
          promotion.id,
          effectiveQty,
        );
      }
    }
  }
}
