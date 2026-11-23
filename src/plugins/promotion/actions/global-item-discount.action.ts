import { LanguageCode, PromotionOrderAction } from "@vendure/core";

export const globalItemPercentageDiscountAction = new PromotionOrderAction({
  code: "global_item_percentage_discount",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Apply a percentage discount to every item in the cart",
    },
  ],
  args: {
    discountPercentage: {
      type: "int",
      defaultValue: 10,
      label: [{ languageCode: LanguageCode.en, value: "Discount percentage" }],
      description: [
        {
          languageCode: LanguageCode.en,
          value: "Percentage to take off each eligible item line.",
        },
      ],
    },
    excludeVariantIds: {
      type: "ID",
      list: true,
      ui: { component: "product-selector-form-input" },
      label: [
        { languageCode: LanguageCode.en, value: "Exclusions (Optional)" },
      ],
      description: [
        {
          languageCode: LanguageCode.en,
          value: "These products will NOT receive the discount.",
        },
      ],
    },
  },

  execute(ctx, order, args) {
    const { discountPercentage, excludeVariantIds } = args;
    const exclusionList = ((excludeVariantIds ?? []) as any[]).map(String);

    if (discountPercentage <= 0) return 0;

    let totalDiscount = 0;

    for (const line of order.lines) {
      const variantId = String(line.productVariant.id);

      if (exclusionList.includes(variantId)) {
        continue;
      }

      const unitPrice = ctx.channel.pricesIncludeTax
        ? line.unitPriceWithTax
        : line.unitPrice;

      const lineDiscount = Math.round(
        unitPrice * (discountPercentage / 100) * line.quantity,
      );
      totalDiscount += lineDiscount;
    }

    return -totalDiscount;
  },
});
