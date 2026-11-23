import { CollectionFilter, LanguageCode } from "@vendure/core";

export const labelCollectionFilter = new CollectionFilter({
  args: {
    labelId: { type: "ID", ui: { component: "label-picker-form-input" } },
  },
  code: "product-label-filter",
  description: [{ languageCode: LanguageCode.en, value: "Filter by Labels" }],
  apply: (qb, args) => {
    const labelId = args.labelId;

    if (!labelId || labelId === "") {
      return qb;
    }

    const id = Number(labelId);
    if (isNaN(id) || id === 0) {
      return qb;
    }

    let productAlias = qb.expressionMap.aliases.find(
      (a) => a.name === "product",
    )?.name;
    if (!productAlias) {
      const mainAlias = qb.expressionMap.mainAlias?.name;
      if (mainAlias && mainAlias !== "product") {
        try {
          qb.leftJoin(`${mainAlias}.product`, "product");
          productAlias = "product";
        } catch (e: any) {}
      } else if (mainAlias === "product") {
        productAlias = "product";
      }
    }

    if (!productAlias) {
      return qb;
    }

    const subQuery = qb
      .subQuery()
      .select("1")
      .from("product_custom_fields_labels_label", "pcl")
      .where(`pcl.productId = ${productAlias}.id`)
      .andWhere("pcl.labelId = :selectedLabelId")
      .getQuery();

    qb.andWhere(`EXISTS (${subQuery})`, { selectedLabelId: id });

    return qb;
  },
});
