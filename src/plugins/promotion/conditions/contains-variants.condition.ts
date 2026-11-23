import {
  LanguageCode,
  PromotionCondition,
  RequestContext,
} from "@vendure/core";

export const containsVariantsCondition = new PromotionCondition({
  code: "contains_variants",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Order contains at least one of the specified product variants",
    },
  ],
  args: {
    variantIds: {
      type: "ID",
      list: true,
      ui: { component: "product-selector-form-input" },
      label: [{ languageCode: LanguageCode.en, value: "Product variants" }],
      description: [
        {
          languageCode: LanguageCode.en,
          value: "Leave empty to apply to all products.",
        },
      ],
    },
  },
  check(_ctx: RequestContext, order, args) {
    const allowedIds = ((args.variantIds ?? []) as any[]).map(String);

    if (allowedIds.length === 0) return true;

    return order.lines.some((line) =>
      allowedIds.includes(String(line.productVariant.id)),
    );
  },
});
