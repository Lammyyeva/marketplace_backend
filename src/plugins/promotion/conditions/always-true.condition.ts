import { LanguageCode, PromotionCondition } from "@vendure/core";

export const alwaysTrueCondition = new PromotionCondition({
  code: "always_true",
  description: [{ languageCode: LanguageCode.en, value: "Always applies" }],
  args: {},
  check() {
    return true;
  },
});
