// import {
//   LanguageCode,
//   PromotionCondition,
//   RequestContext,
// } from "@vendure/core";

// export const limitPerOrderCondition = new PromotionCondition({
//   code: "limit_per_order",
//   description: [
//     {
//       languageCode: LanguageCode.en,
//       value: "No order line exceeds { maxQty } units",
//     },
//   ],
//   args: {
//     maxQty: {
//       type: "int",
//       defaultValue: 1,
//       label: [
//         { languageCode: LanguageCode.en, value: "Max quantity per order line" },
//       ],
//       description: [
//         {
//           languageCode: LanguageCode.en,
//           value: "Maximum number of units of any single product in the order.",
//         },
//       ],
//     },
//   },
//   check(_ctx: RequestContext, order, args) {
//     return order.lines.every((line) => line.quantity <= args.maxQty);
//   },
// });

import { LanguageCode, PromotionCondition } from "@vendure/core";

export const limitPerOrderCondition = new PromotionCondition({
  code: "limit_per_order",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "No more than { maxQty } units per order",
    },
  ],
  args: {
    maxQty: {
      type: "int",
      defaultValue: 1,
      label: [{ languageCode: LanguageCode.en, value: "Max units per order" }],
      description: [
        {
          languageCode: LanguageCode.en,
          value: "Maximum units per order. No daily tracking.",
        },
      ],
    },
    variantIds: {
      type: "ID",
      list: true,
      ui: { component: "product-selector-form-input" },
      label: [
        {
          languageCode: LanguageCode.en,
          value: "Product variants (empty = all)",
        },
      ],
    },
  },
  check(_ctx, order, args) {
    const maxQty = args.maxQty ?? 1;
    const variantIds = ((args.variantIds ?? []) as any[]).map(String);

    const relevantLines =
      variantIds.length === 0
        ? order.lines
        : order.lines.filter((line) =>
            variantIds.includes(String(line.productVariant.id)),
          );

    // Promotion only fires if targeted products are in the order
    if (relevantLines.length === 0) return false;

    return relevantLines.every((line) => line.quantity <= maxQty);
  },
});
