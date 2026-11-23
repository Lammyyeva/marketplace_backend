import { LanguageCode, PromotionOrderAction } from "@vendure/core";
import { VariantSoldCountService } from "../services/variant-sold-count.service";
import { VariantDiscountEntry } from "../types/promotion-arg-types";
import { parseJsonArg } from "../utils/promotion-args";

let variantSoldCountService: VariantSoldCountService;

export const perVariantDiscountAction = new PromotionOrderAction({
  code: "per_variant_discount",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Apply individual discounts and unit limits per product variant",
    },
  ],
  args: {
    variantDiscounts: {
      type: "string",
      defaultValue: "[]",
      ui: { component: "per-variant-discount-form-input" },
      label: [{ languageCode: LanguageCode.en, value: "Variant discount map" }],
    },
  },

  init(injector) {
    variantSoldCountService = injector.get(VariantSoldCountService);
  },

  async execute(ctx, order, args, state, promotion) {
    const discounts = parseJsonArg<VariantDiscountEntry[]>(
      args,
      "variantDiscounts",
      [],
    );

    if (!Array.isArray(discounts) || discounts.length === 0) return 0;

    const discountMap = new Map<string, VariantDiscountEntry>(
      discounts.map((d) => [String(d.variantId), d]),
    );

    let totalDiscount = 0;

    for (const line of order.lines) {
      const variantId = String(line.productVariant.id);
      const entry = discountMap.get(variantId);
      if (!entry) continue;

      const totalUnitsLimit = Number(entry.totalUnitsLimit) || 0;
      const maxQtyPerOrder = Number(entry.maxQtyPerOrder) || 0;
      const discountPct = Number(entry.discount) || 0;

      if (discountPct <= 0) continue;

      const sold =
        totalUnitsLimit > 0
          ? await variantSoldCountService.getSoldCount(
              ctx,
              variantId,
              promotion.id,
            )
          : 0;

      if (totalUnitsLimit > 0 && sold >= totalUnitsLimit) continue;

      const unitPrice = ctx.channel.pricesIncludeTax
        ? line.unitPriceWithTax
        : line.unitPrice;

      let unitsToDiscount = line.quantity;

      if (maxQtyPerOrder > 0) {
        unitsToDiscount = Math.min(unitsToDiscount, maxQtyPerOrder);
      }

      if (totalUnitsLimit > 0) {
        const remaining = Math.max(0, totalUnitsLimit - sold);
        unitsToDiscount = Math.min(unitsToDiscount, remaining);
      }

      if (unitsToDiscount <= 0) continue;

      // discount amount
      totalDiscount += Math.round(
        unitPrice * (discountPct / 100) * unitsToDiscount,
      );
    }

    return -totalDiscount;
  },
});
