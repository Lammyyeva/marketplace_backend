import { LanguageCode, PromotionCondition } from "@vendure/core";

export const eligibleSubtotalAmountCondition = new PromotionCondition({
  description: [
    {
      languageCode: LanguageCode.en,
      value:
        "If eligible subtotal (excluding gifts) is greater than { amount }",
    },
  ],
  code: "eligible_subtotal_amount",
  args: {
    amount: {
      type: "int",
      ui: { component: "currency-form-input" },
      label: [{ languageCode: LanguageCode.en, value: "Minimum amount" }],
    },
    taxInclusive: {
      type: "boolean",
      label: [{ languageCode: LanguageCode.en, value: "Tax inclusive" }],
    },
  },
  check(_ctx, order, args, promotion) {
    const giftAction = (promotion.actions ?? []).find(
      (a: any) => a.code === "free_gift",
    );
    let giftVariantIds: string[] = [];

    if (giftAction) {
      const idsArg = (giftAction.args ?? []).find(
        (arg: any) => arg.name === "productVariantIds",
      );
      if (idsArg?.value) {
        try {
          giftVariantIds = JSON.parse(idsArg.value).map(String);
        } catch {
          giftVariantIds = [String(idsArg.value)];
        }
      }
    }

    let giftTotal = 0;
    for (const line of order.lines) {
      const isGiftLine = giftVariantIds.includes(
        String(line.productVariant.id),
      );
      if (isGiftLine) {
        const unitPrice = args.taxInclusive
          ? line.unitPriceWithTax
          : line.unitPrice;
        giftTotal += unitPrice * line.quantity;
      }
    }

    const orderTotal = args.taxInclusive
      ? order.subTotalWithTax
      : order.subTotal;
    const eligibleAmount = orderTotal - giftTotal;

    return eligibleAmount >= args.amount;
  },
});
