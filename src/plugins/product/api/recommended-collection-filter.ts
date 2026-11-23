import { CollectionFilter, LanguageCode } from "@vendure/core";

export const recommendedCollectionFilter = new CollectionFilter({
  args: {},
  code: "recommended-collection-filter",
  description: [
    { languageCode: LanguageCode.en, value: "Only Recommended Products" },
  ],
  apply: (qb) => {
    let productAlias = qb.expressionMap.aliases.find(
      (a) => a.name === "product",
    );
    if (!productAlias) {
      const mainAlias = qb.expressionMap.mainAlias?.name;
      if (mainAlias) {
        try {
          if (mainAlias !== "product") {
            qb.leftJoin(`${mainAlias}.product`, "product");
            productAlias = qb.expressionMap.aliases.find(
              (a) => a.name === "product",
            );
          }
        } catch {}
      }
    }

    qb.andWhere("product.customFields.isRecommended = :isRecommended", {
      isRecommended: true,
    });

    return qb;
  },
});
