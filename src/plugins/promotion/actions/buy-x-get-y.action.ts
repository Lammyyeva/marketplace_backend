import {
  LanguageCode,
  PromotionOrderAction,
  RequestContext,
  ID,
  idsAreEqual,
} from "@vendure/core";

export const buyXgetYAction = new PromotionOrderAction({
  code: "buy_x_get_y_free_custom",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Buy { buyQty } get { freeQty } free",
    },
  ],
  args: {
    buyQty: {
      type: "int",
      defaultValue: 2,
      label: [{ languageCode: LanguageCode.en, value: "Buy quantity" }],
      description: [
        {
          languageCode: LanguageCode.en,
          value: "Number of items customer must buy to qualify.",
        },
      ],
    },
    freeQty: {
      type: "int",
      defaultValue: 1,
      label: [{ languageCode: LanguageCode.en, value: "Free quantity" }],
      description: [
        {
          languageCode: LanguageCode.en,
          value: "Number of items that become free per qualifying group.",
        },
      ],
    },
    productVariantIds: {
      type: "ID",
      list: true,
      ui: { component: "product-selector-form-input" },
      label: [
        {
          languageCode: LanguageCode.en,
          value: "Trigger variants (What to buy)",
        },
      ],
    },
    freeVariantIds: {
      type: "ID",
      list: true,
      ui: { component: "product-selector-form-input" },
      label: [
        {
          languageCode: LanguageCode.en,
          value: "Free variants (What becomes free)",
        },
      ],
      description: [
        {
          languageCode: LanguageCode.en,
          value:
            "If empty, the trigger items themselves become free. If set, only these items can be free.",
        },
      ],
    },
    maxQtyPerOrder: {
      type: "int",
      defaultValue: 0,
      label: [
        { languageCode: LanguageCode.en, value: "Max free units per order" },
      ],
      description: [
        {
          languageCode: LanguageCode.en,
          value:
            "0 = unlimited. Caps the total number of free units across all lines.",
        },
      ],
    },
  },
  execute(ctx: RequestContext, order, args, state, promotion) {
    const triggerVariantIds = ((args.productVariantIds ?? []) as any[]).map(
      String,
    );
    const freeVariantIds = ((args.freeVariantIds ?? []) as any[]).map(String);
    const { buyQty, freeQty, maxQtyPerOrder } = args;

    const isSeparateMode = freeVariantIds.length > 0;

    if (isSeparateMode) {
      let triggerCount = 0;
      const freeUnitsPool: number[] = [];

      for (const line of order.lines) {
        const variantId = String(line.productVariant.id);
        const unitPrice = ctx.channel.pricesIncludeTax
          ? line.unitPriceWithTax
          : line.unitPrice;

        if (
          triggerVariantIds.length === 0 ||
          triggerVariantIds.includes(variantId)
        ) {
          triggerCount += line.quantity;
        }

        // Is it a candidate for the free discount?
        if (freeVariantIds.includes(variantId)) {
          for (let i = 0; i < line.quantity; i++) {
            freeUnitsPool.push(unitPrice);
          }
        }
      }

      const earnedFreeQty = Math.floor(triggerCount / buyQty) * freeQty;
      let finalFreeCount = Math.min(earnedFreeQty, freeUnitsPool.length);

      if (maxQtyPerOrder > 0) {
        finalFreeCount = Math.min(finalFreeCount, maxQtyPerOrder);
      }

      if (finalFreeCount <= 0) return 0;

      freeUnitsPool.sort((a, b) => a - b);
      let totalDiscount = 0;
      for (let i = 0; i < finalFreeCount; i++) {
        totalDiscount += freeUnitsPool[i];
      }
      return -totalDiscount;
    } else {
      const groupSize = buyQty + freeQty;
      const bogoPool: number[] = [];

      for (const line of order.lines) {
        const variantId = String(line.productVariant.id);
        const unitPrice = ctx.channel.pricesIncludeTax
          ? line.unitPriceWithTax
          : line.unitPrice;

        if (
          triggerVariantIds.length === 0 ||
          triggerVariantIds.includes(variantId)
        ) {
          for (let i = 0; i < line.quantity; i++) {
            bogoPool.push(unitPrice);
          }
        }
      }

      const totalUnits = bogoPool.length;
      if (totalUnits < groupSize) return 0;

      const completeGroups = Math.floor(totalUnits / groupSize);
      const remainder = totalUnits % groupSize;
      const freeInRemainder = Math.max(0, remainder - buyQty);
      let totalFreeToDiscount = completeGroups * freeQty + freeInRemainder;

      if (maxQtyPerOrder > 0) {
        totalFreeToDiscount = Math.min(totalFreeToDiscount, maxQtyPerOrder);
      }

      if (totalFreeToDiscount <= 0) return 0;

      bogoPool.sort((a, b) => a - b);
      let totalDiscount = 0;
      for (let i = 0; i < totalFreeToDiscount; i++) {
        totalDiscount += bogoPool[i];
      }
      return -totalDiscount;
    }
  },
});
