import { LanguageCode, ShippingEligibilityChecker } from "@vendure/core";

export const deliveryEligibilityChecker = new ShippingEligibilityChecker({
  code: "delivery-eligibility-checker",
  description: [
    { languageCode: LanguageCode.en, value: "Delivery eligibility checker" },
  ],
  args: {},
  check: async (ctx, order) => {
    const deliveryMethod = order.customFields.deliveryMethod;

    if (!deliveryMethod || deliveryMethod.enabled === false) {
      return false;
    }
    return true;
  },
});
