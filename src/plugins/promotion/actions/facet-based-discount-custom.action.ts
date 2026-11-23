import {
  LanguageCode,
  PromotionOrderAction,
  RequestContext,
  ProductVariant,
  TransactionalConnection,
} from "@vendure/core";
import { FacetDiscountEntry } from "../types/promotion-arg-types";
import { parseJsonArg } from "../utils/promotion-args";

let connection: TransactionalConnection;

export const facetBasedDiscountCustomAction = new PromotionOrderAction({
  code: "facet_based_discount_custom",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Apply different discounts based on product model facets",
    },
  ],
  args: {
    facetDiscounts: {
      type: "string",
      defaultValue: "[]",
      ui: { component: "facet-discount-form-input" },
      label: [{ languageCode: LanguageCode.en, value: "Facet discount map" }],
    },
  },

  init(injector) {
    connection = injector.get(TransactionalConnection);
  },

  async execute(ctx: RequestContext, order, args, state, promotion) {
    const facetDiscounts = parseJsonArg<FacetDiscountEntry[]>(
      args,
      "facetDiscounts",
      [],
    );

    if (!Array.isArray(facetDiscounts) || facetDiscounts.length === 0) return 0;

    const discountMap = new Map<string, number>(
      facetDiscounts.map((d) => [String(d.facetValueId), d.discount]),
    );

    const variantIds = [
      ...new Set(order.lines.map((line) => line.productVariant.id)),
    ];

    const variantFacets = await connection
      .getRepository(ctx, ProductVariant)
      .createQueryBuilder("variant")
      .leftJoin("variant.facetValues", "v_fv")
      .leftJoin("variant.product", "product")
      .leftJoin("product.facetValues", "p_fv")
      .select("variant.id", "variantId")
      .addSelect("v_fv.id", "v_fv_id")
      .addSelect("p_fv.id", "p_fv_id")
      .where("variant.id IN (:...variantIds)", { variantIds })
      .getRawMany();

    const facetMap = new Map<string, Set<string>>();
    for (const row of variantFacets) {
      const vid = String(row.variantId);
      if (!facetMap.has(vid)) facetMap.set(vid, new Set());
      if (row.v_fv_id) facetMap.get(vid)?.add(String(row.v_fv_id));
      if (row.p_fv_id) facetMap.get(vid)?.add(String(row.p_fv_id));
    }

    let totalDiscount = 0;

    for (const line of order.lines) {
      const variantId = String(line.productVariant.id);
      const appliedFacets = facetMap.get(variantId) || new Set<string>();

      let bestDiscount = 0;
      for (const fvId of appliedFacets) {
        const d = discountMap.get(fvId);
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
