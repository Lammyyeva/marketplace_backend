import { Injectable } from "@nestjs/common";
import {
  ProductVariant,
  PromotionService,
  RequestContext,
  RequestContextCacheService,
  TransactionalConnection,
} from "@vendure/core";
import { VariantSoldCountService } from "./variant-sold-count.service";

@Injectable()
export class ActiveSaleService {
  constructor(
    private connection: TransactionalConnection,
    private promotionService: PromotionService,
    private variantSoldCountService: VariantSoldCountService,
    private requestCache: RequestContextCacheService,
  ) {}

  async getActiveSalesForVariants(
    ctx: RequestContext,
    variants: Array<{ id: number; price: number }>,
  ) {
    if (!variants.length) return new Map<number, any>();

    const variantIds = variants.map((v) => v.id);
    const now = new Date();

    // 1. Get promotions (cached in request)
    const promotions = await this.requestCache.get(
      ctx,
      "active_sales_promotions",
      async () => {
        const { items } = await this.promotionService.findAll(ctx, {
          filter: { enabled: { eq: true } },
        });
        return items;
      },
    );

    // 2. Fetch all variant data in ONE query
    const variantData = await this.connection
      .getRepository(ctx, ProductVariant)
      .createQueryBuilder("variant")
      .leftJoin("variant.product", "product")
      .leftJoin("variant.facetValues", "v_fv")
      .leftJoin("product.facetValues", "p_fv")
      .leftJoin(
        "product_custom_fields_categories_category",
        "p_cat",
        'p_cat."productId" = product.id',
      )
      .select("variant.id", "variantId")
      .addSelect("v_fv.id", "v_fv_id")
      .addSelect("p_fv.id", "p_fv_id")
      .addSelect('p_cat."categoryId"', "categoryId")
      .where("variant.id IN (:...variantIds)", { variantIds })
      .getRawMany();

    // 3. Group data by variant
    const variantMap = new Map<number, { facetIds: Set<string>; categoryIds: Set<string> }>();
    for (const row of variantData) {
      const vId = Number(row.variantId);
      if (!variantMap.has(vId)) {
        variantMap.set(vId, { facetIds: new Set(), categoryIds: new Set() });
      }
      const entry = variantMap.get(vId)!;
      if (row.v_fv_id) entry.facetIds.add(String(row.v_fv_id));
      if (row.p_fv_id) entry.facetIds.add(String(row.p_fv_id));
      if (row.categoryId) entry.categoryIds.add(String(row.categoryId));
    }

    const results = new Map<number, any>();

    for (const vInfo of variants) {
      const vId = vInfo.id;
      const vPrice = vInfo.price;
      const data = variantMap.get(vId);
      if (!data) {
        results.set(vId, null);
        continue;
      }

      const resolvedSales: { promotion: any; percent: number }[] = [];

      for (const p of promotions) {
        if (p.startsAt && new Date(p.startsAt) > now) continue;
        if (p.endsAt && new Date(p.endsAt) < now) continue;

        const actionsAndConditions = [
          ...((p as any).actions ?? []),
          ...((p as any).conditions ?? []),
        ];

        const targetingArgs = actionsAndConditions
          .flatMap((ac) => ac.args ?? [])
          .filter((arg) =>
            [
              "variantIds",
              "productVariantIds",
              "variantDiscounts",
              "facetDiscounts",
              "categoryDiscounts",
            ].includes(arg.name),
          );

        const isGlobal = targetingArgs.length === 0;
        const matchesVariant =
          isGlobal ||
          targetingArgs.some((arg) => {
            let ids: any[] = arg.value;
            if (typeof ids === "string") {
              try {
                ids = JSON.parse(ids || "[]");
              } catch {
                ids = [];
              }
            }
            if (!Array.isArray(ids)) ids = [];

            if (arg.name === "variantDiscounts")
              return ids.some((d) => String(d.variantId) === String(vId));
            if (arg.name === "facetDiscounts")
              return ids.some((d) => data.facetIds.has(String(d.facetValueId)));
            if (arg.name === "categoryDiscounts")
              return ids.some((d) =>
                data.categoryIds.has(String(d.categoryId)),
              );

            const strIds = ids.map(String);
            return ids.length === 0 || strIds.includes(String(vId));
          });

        if (!matchesVariant) continue;

        resolvedSales.push({
          promotion: p,
          percent: this.resolveDiscountPercent(
            p,
            vId,
            data.facetIds,
            data.categoryIds,
          ),
        });
      }

      resolvedSales.sort((a, b) => b.percent - a.percent);

      const bestSale = resolvedSales[0];
      if (!bestSale) {
        results.set(vId, null);
        continue;
      }

      const promotion = bestSale.promotion;
      const discountPct = bestSale.percent;
      const maxQtyLimit = this.resolveMaxQty(promotion, vId);

      let perVariantTotalLimit: number | null = null;
      let perVariantSoldCount = 0;

      const perVariantAction = (promotion.actions ?? []).find(
        (a: any) => a.code === "per_variant_discount",
      );
      if (perVariantAction) {
        const arg = (perVariantAction.args ?? []).find(
          (a: any) => a.name === "variantDiscounts",
        );
        if (arg?.value) {
          try {
            const discounts = JSON.parse(arg.value);
            const entry = discounts.find(
              (d: any) => String(d.variantId) === String(vId),
            );
            if (entry && (entry.totalUnitsLimit ?? 0) > 0) {
              perVariantTotalLimit = entry.totalUnitsLimit;
              perVariantSoldCount =
                await this.variantSoldCountService.getSoldCount(
                  ctx,
                  vId,
                  promotion.id,
                );
              if (perVariantSoldCount >= perVariantTotalLimit!) {
                results.set(vId, null);
                continue;
              }
            }
          } catch {}
        }
      }

      let type = (promotion as any).customFields?.collectionType ?? null;
      if (!type) {
        if (maxQtyLimit.limitType) {
          type = maxQtyLimit.limitType;
        } else if (((promotion as any).conditions ?? [])[0]?.code) {
          const conditionCode = ((promotion as any).conditions ?? [])[0].code;
          if (conditionCode !== "always_true") type = conditionCode;
        }
      }

      results.set(vId, {
        saleId: promotion.id,
        price: Math.round(vPrice * (1 - discountPct / 100)),
        salePercent: discountPct,
        type,
        endDate: promotion.endsAt ?? null,
        totalCountOfSalePrice: perVariantTotalLimit ?? null,
        totalSoldOnSale: perVariantTotalLimit ? perVariantSoldCount : 0,
        limitCountOfEachOrder:
          maxQtyLimit.orderLimit ?? promotion.perCustomerUsageLimit ?? null,
        orderLimit: maxQtyLimit.orderLimit,
        isLimited: !!(maxQtyLimit.orderLimit || promotion.perCustomerUsageLimit),
        neverExpires: promotion.endsAt == null,
      });
    }

    return results;
  }

  async getActiveSaleForVariant(
    ctx: RequestContext,
    variantId: number,
    variantPrice: number,
  ) {
    const now = new Date();


    const promotions = await this.requestCache.get(
      ctx,
      "active_sales_promotions",
      async () => {
        const { items } = await this.promotionService.findAll(ctx, {
          filter: { enabled: { eq: true } },
        });
        return items;
      },
    );

    const variantData = await this.connection
      .getRepository(ctx, ProductVariant)
      .createQueryBuilder("variant")
      .leftJoin("variant.product", "product")
      .leftJoin("variant.facetValues", "v_fv")
      .leftJoin("product.facetValues", "p_fv")
      .leftJoin(
        "product_custom_fields_categories_category",
        "p_cat",
        'p_cat."productId" = product.id',
      )
      .select("variant.id", "variantId")
      .addSelect("v_fv.id", "v_fv_id")
      .addSelect("p_fv.id", "p_fv_id")
      .addSelect('p_cat."categoryId"', "categoryId")
      .where("variant.id = :variantId", { variantId })
      .getRawMany();

    const variantFacetIds = new Set<string>();
    const variantCategoryIds = new Set<string>();

    for (const row of variantData) {
      if (row.v_fv_id) variantFacetIds.add(String(row.v_fv_id));
      if (row.p_fv_id) variantFacetIds.add(String(row.p_fv_id));
      if (row.categoryId) variantCategoryIds.add(String(row.categoryId));
    }

    const resolvedSales: { promotion: any; percent: number }[] = [];

    for (const p of promotions) {
      if (p.startsAt && new Date(p.startsAt) > now) continue;
      if (p.endsAt && new Date(p.endsAt) < now) continue;

      const actionsAndConditions = [
        ...((p as any).actions ?? []),
        ...((p as any).conditions ?? []),
      ];

      const targetingArgs = actionsAndConditions
        .flatMap((ac) => ac.args ?? [])
        .filter((arg) =>
          [
            "variantIds",
            "productVariantIds",
            "variantDiscounts",
            "facetDiscounts",
            "categoryDiscounts",
          ].includes(arg.name),
        );

      const isGlobal = targetingArgs.length === 0;
      const matchesVariant =
        isGlobal ||
        targetingArgs.some((arg) => {
          let ids: any[] = arg.value;
          if (typeof ids === "string") {
            try {
              ids = JSON.parse(ids || "[]");
            } catch {
              ids = [];
            }
          }
          if (!Array.isArray(ids)) ids = [];

          if (arg.name === "variantDiscounts")
            return ids.some((d) => String(d.variantId) === String(variantId));
          if (arg.name === "facetDiscounts")
            return ids.some((d) => variantFacetIds.has(String(d.facetValueId)));
          if (arg.name === "categoryDiscounts")
            return ids.some((d) =>
              variantCategoryIds.has(String(d.categoryId)),
            );

          const strIds = ids.map(String);
          return ids.length === 0 || strIds.includes(String(variantId));
        });

      if (!matchesVariant) continue;

      resolvedSales.push({
        promotion: p,
        percent: this.resolveDiscountPercent(
          p,
          variantId,
          variantFacetIds,
          variantCategoryIds,
        ),
      });
    }

    resolvedSales.sort((a, b) => b.percent - a.percent);

    const bestSale = resolvedSales[0];
    if (!bestSale) return null;

    const promotion = bestSale.promotion;
    const discountPct = bestSale.percent;
    const maxQtyLimit = this.resolveMaxQty(promotion, variantId);

    let perVariantTotalLimit: number | null = null;
    let perVariantSoldCount = 0;

    const perVariantAction = (promotion.actions ?? []).find(
      (a: any) => a.code === "per_variant_discount",
    );
    if (perVariantAction) {
      const arg = (perVariantAction.args ?? []).find(
        (a: any) => a.name === "variantDiscounts",
      );
      if (arg?.value) {
        try {
          const discounts = JSON.parse(arg.value);
          const entry = discounts.find(
            (d: any) => String(d.variantId) === String(variantId),
          );
          if (entry && (entry.totalUnitsLimit ?? 0) > 0) {
            perVariantTotalLimit = entry.totalUnitsLimit;
            perVariantSoldCount =
              await this.variantSoldCountService.getSoldCount(
                ctx,
                variantId,
                promotion.id,
              );
            if (perVariantSoldCount >= perVariantTotalLimit!) return null;
          }
        } catch {}
      }
    }

    let type = (promotion as any).customFields?.collectionType ?? null;
    if (!type) {
      if (maxQtyLimit.limitType) {
        type = maxQtyLimit.limitType;
      } else if (((promotion as any).conditions ?? [])[0]?.code) {
        const conditionCode = ((promotion as any).conditions ?? [])[0].code;
        if (conditionCode !== "always_true") type = conditionCode;
      }
    }

    return {
      saleId: promotion.id,
      price: Math.round(variantPrice * (1 - discountPct / 100)),
      salePercent: discountPct,
      type,
      endDate: promotion.endsAt ?? null,
      totalCountOfSalePrice: perVariantTotalLimit ?? null,
      totalSoldOnSale: perVariantTotalLimit ? perVariantSoldCount : 0,
      limitCountOfEachOrder:
        maxQtyLimit.orderLimit ?? promotion.perCustomerUsageLimit ?? null,
      orderLimit: maxQtyLimit.orderLimit,
      isLimited: !!(maxQtyLimit.orderLimit || promotion.perCustomerUsageLimit),
      neverExpires: promotion.endsAt == null,
    };
  }

  private resolveDiscountPercent(
    promotion: any,
    variantId?: number,
    variantFacetIds?: Set<string>,
    variantCategoryIds?: Set<string>,
  ): number {
    const action = (promotion.actions ?? []).find((a: any) =>
      [
        "per_variant_discount",
        "products_percentage_discount",
        "facet_based_discount",
        "facet_based_discount_custom",
        "category_based_discount",
        "item_percentage_discount",
      ].includes(a.code),
    );
    if (!action) return 0;

    if (action.code === "per_variant_discount" && variantId) {
      const arg = (action.args ?? []).find(
        (a: any) => a.name === "variantDiscounts",
      );
      if (arg) {
        try {
          const discounts = JSON.parse(arg.value || "[]");
          const entry = discounts.find(
            (d: any) => String(d.variantId) === String(variantId),
          );
          if (entry) return entry.discount;
        } catch (e) {}
      }
    }

    if (
      action.code === "facet_based_discount_custom" &&
      variantFacetIds &&
      variantFacetIds.size > 0
    ) {
      const arg = (action.args ?? []).find(
        (a: any) => a.name === "facetDiscounts",
      );
      if (arg) {
        try {
          const discounts = JSON.parse(arg.value || "[]");
          let bestDiscount = 0;
          for (const d of discounts) {
            if (variantFacetIds.has(String(d.facetValueId))) {
              if (d.discount > bestDiscount) bestDiscount = d.discount;
            }
          }
          return bestDiscount;
        } catch (e) {}
      }
    }

    if (
      action.code === "category_based_discount" &&
      variantCategoryIds &&
      variantCategoryIds.size > 0
    ) {
      const arg = (action.args ?? []).find(
        (a: any) => a.name === "categoryDiscounts",
      );
      if (arg) {
        try {
          const discounts = JSON.parse(arg.value || "[]");
          let bestDiscount = 0;
          for (const d of discounts) {
            if (variantCategoryIds.has(String(d.categoryId))) {
              if (d.discount > bestDiscount) bestDiscount = d.discount;
            }
          }
          return bestDiscount;
        } catch (e) {}
      }
    }

    const arg = (action?.args ?? []).find((a: any) => a.name === "discount");
    return arg ? parseInt(arg.value, 10) : 0;
  }

  private resolveMaxQty(
    promotion: any,
    variantId?: number,
  ): {
    orderLimit: number | null;
    limitType: string | null;
  } {
    let orderLimit: number | null = null;
    let limitType: string | null = null;

    const perVariantAction = (promotion.actions ?? []).find(
      (a: any) => a.code === "per_variant_discount",
    );
    if (perVariantAction && variantId) {
      const arg = (perVariantAction.args ?? []).find(
        (a: any) => a.name === "variantDiscounts",
      );
      if (arg) {
        try {
          const discounts = JSON.parse(arg.value || "[]");
          const entry = discounts.find(
            (d: any) => String(d.variantId) === String(variantId),
          );
          if (entry && entry.maxQtyPerOrder > 0) {
            return {
              orderLimit: entry.maxQtyPerOrder,
              limitType: "per_variant_limit",
            };
          }
        } catch (e) {}
      }
    }

    const condition = (promotion.conditions ?? []).find(
      (c: any) => c.code === "limit_per_order",
    );
    if (condition) {
      const arg = (condition.args ?? []).find((a: any) => a.name === "maxQty");
      if (arg) {
        orderLimit = parseInt(arg.value, 10);
        limitType = condition.code;
      }
    }

    for (const action of promotion.actions ?? []) {
      const orderArg = (action.args ?? []).find(
        (a: any) => a.name === "maxQtyPerOrder",
      );

      if (orderArg && parseInt(orderArg.value, 10) > 0) {
        orderLimit = parseInt(orderArg.value, 10);
        if (!limitType) limitType = "limit_per_order";
      }
    }

    return { orderLimit, limitType };
  }
}
