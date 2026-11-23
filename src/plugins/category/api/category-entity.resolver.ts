import { Args, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import {
  TransactionalConnection,
  Asset,
  RequestContext,
  TranslatorService,
  Product,
  FacetValue,
  ID,
} from "@vendure/core";
import { Category } from "../entities/category.entity";
import { CategoryType } from "../entities/category-type.entity";
import { Banner } from "../../banner/entities/banner.entity";
import { Ctx } from "@vendure/core";

@Resolver("Category")
export class CategoryEntityResolver {
  constructor(
    private connection: TransactionalConnection,
    private translator: TranslatorService,
  ) {}

  @ResolveField()
  async featuredAsset(@Parent() category: Category): Promise<Asset | null> {
    if (category.featuredAsset) {
      return category.featuredAsset;
    }
    const categoryWithAsset = await this.connection
      .getRepository(Category)
      .findOne({
        where: { id: category.id },
        relations: ["featuredAsset"],
      });
    return categoryWithAsset?.featuredAsset || null;
  }

  @ResolveField()
  async iconAsset(@Parent() category: Category): Promise<Asset | null> {
    if (category.iconAsset) {
      return category.iconAsset;
    }
    const categoryWithIcon = await this.connection
      .getRepository(Category)
      .findOne({
        where: { id: category.id },
        relations: ["iconAsset"],
      });
    return categoryWithIcon?.iconAsset || null;
  }

  @ResolveField()
  async children(@Parent() category: Category): Promise<Category[]> {
    return this.connection.getRepository(Category).find({
      where: { parent: { id: category.id } },
    });
  }

  @ResolveField()
  async parent(@Parent() category: Category): Promise<Category | null> {
    const categoryWithParent = await this.connection
      .getRepository(Category)
      .findOne({
        where: { id: category.id },
        relations: ["parent"],
      });
    return categoryWithParent?.parent || null;
  }

  @ResolveField()
  async banners(@Parent() category: Category): Promise<Banner[]> {
    return this.connection.getRepository(Banner).find({
      where: { category: { id: category.id } },
    });
  }

  @ResolveField()
  name(@Ctx() ctx: RequestContext, @Parent() category: Category): string {
    return this.translator.translate(category, ctx).name;
  }

  @ResolveField()
  async categoryType(
    @Parent() category: Category,
  ): Promise<CategoryType | null> {
    if (category.categoryType) {
      return category.categoryType;
    }
    const categoryWithCategoryType = await this.connection
      .getRepository(Category)
      .findOne({
        where: { id: category.id },
        relations: ["categoryType", "categoryType.translations"],
      });
    return categoryWithCategoryType?.categoryType || null;
  }

  @ResolveField()
  translations(@Parent() category: Category): any[] {
    return category.translations || [];
  }

  @ResolveField()
  async productsByLabel(
    @Ctx() ctx: RequestContext,
    @Parent() category: Category,
    @Args() args: { labelId: string },
  ) {
    return this.connection
      .getRepository(ctx, Product as any)
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.variants", "variants")
      .leftJoinAndSelect("product.assets", "assets")
      .leftJoin("product.customFields.categories", "category")
      .leftJoin("product.customFields.labels", "label")
      .where("category.id = :categoryId", { categoryId: category.id })
      .andWhere("label.id = :labelId", { labelId: args.labelId })
      .getMany();
  }
}

@Resolver("CategoryType")
export class CategoryTypeEntityResolver {
  constructor(
    private connection: TransactionalConnection,
    private translator: TranslatorService,
  ) {}

  @ResolveField()
  name(
    @Ctx() ctx: RequestContext,
    @Parent() categoryType: CategoryType,
  ): string {
    return this.translator.translate(categoryType, ctx).name;
  }

  @ResolveField()
  translations(@Parent() categoryType: CategoryType): any[] {
    return categoryType.translations || [];
  }

  @ResolveField()
  async categories(@Parent() categoryType: CategoryType): Promise<Category[]> {
    return this.connection.getRepository(Category).find({
      where: { categoryType: { id: categoryType.id } },
    });
  }

  @ResolveField()
  async iconAsset(@Parent() categoryType: CategoryType): Promise<Asset | null> {
    if (categoryType.iconAsset) {
      return categoryType.iconAsset;
    }
    const categoryTypeWithIcon = await this.connection
      .getRepository(CategoryType)
      .findOne({
        where: { id: categoryType.id },
        relations: ["iconAsset"],
      });
    return categoryTypeWithIcon?.iconAsset || null;
  }

  @ResolveField()
  async imageAsset(@Parent() categoryType: CategoryType): Promise<Asset | null> {
    if (categoryType.imageAsset) {
      return categoryType.imageAsset;
    }
    const categoryTypeWithImage = await this.connection
      .getRepository(CategoryType)
      .findOne({
        where: { id: categoryType.id },
        relations: ["imageAsset"],
      });
    return categoryTypeWithImage?.imageAsset || null;
  }
}

@Resolver("FacetValue")
export class FacetValueEntityResolver {
  constructor(private connection: TransactionalConnection) {}

  @ResolveField()
  async categoryIds(
    @Ctx() ctx: RequestContext,
    @Parent() facetValue: FacetValue,
  ): Promise<ID[]> {
    const facetValueWithCategories = await this.connection
      .getRepository(ctx, FacetValue)
      .findOne({
        where: { id: facetValue.id },
        relations: ["customFields.categories"],
      });

    const customFields = facetValueWithCategories?.customFields as any;
    const categories = customFields?.categories || [];

    return categories.map((cat: any) => cat.id);
  }
}
