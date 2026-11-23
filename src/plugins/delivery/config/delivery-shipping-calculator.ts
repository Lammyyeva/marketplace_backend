import { Injector, LanguageCode, ShippingCalculator } from "@vendure/core";

export const deliveryShippingCalculator = new ShippingCalculator({
  code: "delivery-shipping-calculator",
  description: [
    { languageCode: LanguageCode.en, value: "Delivery method calculator" },
  ],
  args: {},

  init(_injector: Injector) {
    // connection = injector.get(TransactionalConnection);
  },

  calculate: async (_ctx, _order, _args, _method) => {
    const deliveryMethod = _order.customFields.deliveryMethod;

    if (!deliveryMethod) {
      return { price: 0, priceIncludesTax: false, taxRate: 0 };
    }

    const limitInCents = deliveryMethod.limitPrice * 100;
    const isFreeShipping = limitInCents > 0 && _order.subTotal >= limitInCents;

    // Vendure uses cents, so multiply minCost by 100
    const price = isFreeShipping ? 0 : deliveryMethod.minCost * 100;

    return {
      price,
      priceIncludesTax: false,
      taxRate: 0,
      metadata: {
        minCost: deliveryMethod.minCost,
        isFreeShipping,
        methodName: deliveryMethod.name,
      },
    };
  },
});
