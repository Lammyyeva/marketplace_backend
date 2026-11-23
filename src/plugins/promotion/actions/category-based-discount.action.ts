import {
  LanguageCode,
  PromotionOrderAction,
  RequestContext,
  ProductVariant,
  TransactionalConnection,
} from "@vendure/core";
import { CategoryDiscountEntry } from "../types/promotion-arg-types";
import { parseJsonArg } from "../utils/promotion-args";

let connection: TransactionalConnection;

export const categoryBasedDiscountAction = new PromotionOrderAction({
  code: "category_based_discount",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Apply different discounts based on custom product categories",
    },
  ],
  args: {
    categoryDiscounts: {
      type: "string",
      defaultValue: "[]",
      ui: { component: "category-discount-form-input" },
      label: [
        { languageCode: LanguageCode.en, value: "Category discount map" },
      ],
    },
  },

  init(injector) {
    connection = injector.get(TransactionalConnection);
  },

  async execute(ctx: RequestContext, order, args, state, promotion) {
    const categoryDiscounts = parseJsonArg<CategoryDiscountEntry[]>(
      args,
      "categoryDiscounts",
      [],
    );

    if (!Array.isArray(categoryDiscounts) || categoryDiscounts.length === 0)
      return 0;

    const discountMap = new Map<string, number>(
      categoryDiscounts.map((d) => [String(d.categoryId), d.discount]),
    );

    const variantIds = [
      ...new Set(order.lines.map((line) => line.productVariant.id)),
    ];

    const variantCategories = await connection
      .getRepository(ctx, ProductVariant)
      .createQueryBuilder("variant")
      .leftJoin("variant.product", "product")
      .leftJoin(
        "product_custom_fields_categories_category",
        "p_cat",
        'p_cat."productId" = product.id',
      )
      .select("variant.id", "variantId")
      .addSelect('p_cat."categoryId"', "categoryId")
      .where("variant.id IN (:...variantIds)", { variantIds })
      .getRawMany();

    const categoryMap = new Map<string, Set<string>>();
    for (const row of variantCategories) {
      const vid = String(row.variantId);
      if (!categoryMap.has(vid)) categoryMap.set(vid, new Set());
      if (row.categoryId) categoryMap.get(vid)?.add(String(row.categoryId));
    }

    let totalDiscount = 0;

    for (const line of order.lines) {
      const variantId = String(line.productVariant.id);
      const appliedCategories = categoryMap.get(variantId) || new Set<string>();

      let bestDiscount = 0;
      for (const catId of appliedCategories) {
        const d = discountMap.get(catId);
        if (d !== undefined && d > bestDiscount) {
          bestDiscount = d;
        }
      }

      if (bestDiscount === 0) continue;

      const unitPrice = ctx.channel.pricesIncludeTax
        ? line.unitPriceWithTax
        : line.unitPrice;

      const unitsToDiscount = line.quantity;

      if (unitsToDiscount > 0) {
        const discountAmount = Math.round(
          unitPrice * (bestDiscount / 100) * unitsToDiscount,
        );
        totalDiscount += discountAmount;
      }
    }

    return -totalDiscount;
  },
});
