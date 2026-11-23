import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import {
  Product,
  TransactionalConnection,
  Ctx,
  RequestContext,
  ActiveOrderService,
  ProductOptionGroup,
  ProductVariant,
} from "@vendure/core";
import { Label } from "../../label/entities/label.entity";
import { Category } from "../../category/entities/category.entity";

import { OrderLinesCacheService } from "../services/order-lines-cache.service";
import { ActiveSaleService } from "../../promotion/services/active-sale.service";

@Resolver("Product")
export class ProductEntityResolver {
  constructor(
    private connection: TransactionalConnection,
    private activeOrderService: ActiveOrderService,
    private orderLinesCache: OrderLinesCacheService,
    private activeSaleService: ActiveSaleService,
  ) { }

  @ResolveField()
  async labels(@Parent() product: Product): Promise<Label[]> {
    if (product.customFields && (product.customFields as any).labels) {
      return (product.customFields as any).labels as Label[];
    }

    const productWithLabels = await this.connection
      .getRepository(Product)
      .findOne({
        where: { id: product.id },
        relations: ["customFields.labels"],
      });
    return ((productWithLabels?.customFields as any)?.labels as Label[]) ?? [];
  }

  @ResolveField()
  async category(@Parent() product: Product): Promise<Category | null> {
    const categories = await this.getCategories(product);
    return categories.length ? categories[0] : null;
  }

  @ResolveField()
  async categories(@Parent() product: Product): Promise<Category[]> {
    return this.getCategories(product);
  }

  private async getCategories(product: Product): Promise<Category[]> {
    if (product.customFields && (product.customFields as any).categories) {
      return (product.customFields as any).categories as Category[];
    }

    const productWithCustomFields = await this.connection
      .getRepository(Product)
      .findOne({
        where: { id: product.id },
        relations: ["customFields.categories"],
      });

    return (productWithCustomFields?.customFields as any)?.categories || [];
  }

  // @ResolveField('image')
  // async image(@Parent() product: Product): Promise<any | null> {
  //   if (!product.assets || product.assets.length === 0) {
  //     return null;
  //   }
  //   return product.assets[0];
  // }

  @ResolveField()
  async selectedQuantity(
    @Parent() product: Product,
    @Ctx() ctx: RequestContext,
  ): Promise<number> {
    const order = await this.orderLinesCache.getOrderWithLines(ctx);
    return this.orderLinesCache.getQuantityForProduct(order, product.id);
  }

  @ResolveField()
  async isSelected(
    @Parent() product: Product,
    @Ctx() ctx: RequestContext,
  ): Promise<boolean> {
    const order = await this.orderLinesCache.getOrderWithLines(ctx);
    return this.orderLinesCache.getQuantityForProduct(order, product.id) > 0;
  }

  @ResolveField()
  async sale(
    @Ctx() ctx: RequestContext,
    @Parent() product: Product,
  ): Promise<any | null> {
    if ((product as any).sale) {
      return (product as any).sale;
    }

    // If not pre-loaded (e.g. standard Vendure product query), fetch it now
    const productWithVariants = await this.connection
      .getRepository(ctx, Product)
      .findOne({
        where: { id: product.id },
        relations: ["variants", "variants.productVariantPrices"],
      });

    const variant = productWithVariants?.variants?.[0];
    if (!variant) return null;

    const price = variant.productVariantPrices?.[0]?.price ?? 0;
    return this.activeSaleService.getActiveSaleForVariant(
      ctx,
      Number(variant.id),
      price,
    );
  }

  @ResolveField()
  async activeOptionGroups(
    @Parent() product: Product,
    @Ctx() ctx: RequestContext,
  ): Promise<any[]> {

    const productId = product.id;

    const [optionGroups, usedOptionIds] = await Promise.all([

      this.connection
        .getRepository(ctx, ProductOptionGroup)
        .createQueryBuilder("og")
        .innerJoin(
          "product_option_groups_product_option_group",
          "link",
          'link."productOptionGroupId" = og.id AND link."productId" = :productId',
          { productId },
        )
        .leftJoinAndSelect("og.options", "opt")
        .leftJoinAndSelect("og.translations", "ogt")
        .leftJoinAndSelect("opt.translations", "optt")
        .orderBy("og.id", "ASC")
        .addOrderBy("opt.id", "ASC")
        .getMany(),

      this.connection
        .getRepository(ctx, ProductVariant)
        .createQueryBuilder("v")
        .select("opt.id", "optionId")
        .innerJoin("v.options", "opt")
        .where("v.productId  = :productId", { productId })
        .andWhere("v.deletedAt IS NULL")
        .andWhere("v.enabled  = true")
        .getRawMany<{ optionId: string | number }>()
        .then((rows) => new Set(rows.map((r) => String(r.optionId)))),
    ]);

    return optionGroups.map((group) => ({
      ...group,
      options: group.options?.filter((o) => usedOptionIds.has(String(o.id))) ?? [],
    }));
  }
}

@Resolver("SearchResult")
export class SearchResultEntityResolver {
  constructor(
    private connection: TransactionalConnection,
    private activeOrderService: ActiveOrderService,
    private orderLinesCache: OrderLinesCacheService,
  ) { }

  @ResolveField()
  async category(@Parent() searchResult: any): Promise<Category | null> {
    const categories = await this.getSearchResultCategories(searchResult);
    return categories.length ? categories[0] : null;
  }

  @ResolveField()
  async categories(@Parent() searchResult: any): Promise<Category[]> {
    return this.getSearchResultCategories(searchResult);
  }

  private async getSearchResultCategories(
    searchResult: any,
  ): Promise<Category[]> {
    const productId = searchResult.productId;
    const product = await this.connection.getRepository(Product).findOne({
      where: { id: productId },
      relations: ["customFields.categories"],
    });
    return (product?.customFields as any)?.categories || [];
  }

  @ResolveField()
  async productLabels(@Parent() searchResult: any): Promise<Label[]> {
    const productId = searchResult.productId;
    const product = await this.connection.getRepository(Product).findOne({
      where: { id: productId },
      relations: ["customFields.labels"],
    });

    return ((product?.customFields as any)?.labels as Label[]) ?? [];
  }

  @ResolveField()
  async selectedQuantity(
    @Parent() searchResult: any,
    @Ctx() ctx: RequestContext,
  ): Promise<number> {
    const order = await this.orderLinesCache.getOrderWithLines(ctx);
    return this.orderLinesCache.getQuantityForProduct(
      order,
      searchResult.productId,
    );
  }

  @ResolveField()
  async isSelected(
    @Parent() searchResult: any,
    @Ctx() ctx: RequestContext,
  ): Promise<boolean> {
    const order = await this.orderLinesCache.getOrderWithLines(ctx);
    return (
      this.orderLinesCache.getQuantityForProduct(
        order,
        searchResult.productId,
      ) > 0
    );
  }
}
