import { CollectionFilter, LanguageCode } from "@vendure/core";

export const saleCollectionFilter = new CollectionFilter({
  args: {},
  code: "sale-collection-filter",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Filter products with active promotions (Sale)",
    },
  ],

  apply(qb) {
    const now = new Date();
    const alias = qb.alias;

    qb.andWhere(
      `EXISTS (
        SELECT 1 FROM active_sale_lookup asl 
        WHERE asl."variantId" = "${alias}"."id" 
          AND (asl."expiresAt" IS NULL OR asl."expiresAt" > :saleNow)
      )`,
      { saleNow: now },
    );

    return qb;
  },
});
