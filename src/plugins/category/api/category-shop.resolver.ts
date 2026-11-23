import { Args, Query, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  ListQueryOptions,
  Permission,
  PaginatedList,
  RequestContext,
} from "@vendure/core";
import { CategoryService } from "../services/category.service";
import { Category } from "../entities/category.entity";
import { CategoryType } from "../entities/category-type.entity";

@Resolver()
export class CategoryShopResolver {
  constructor(private categoryService: CategoryService) {}

  @Query()
  @Allow(Permission.Public)
  async categories(
    @Ctx() ctx: RequestContext,
    @Args("options") options: ListQueryOptions<Category>,
  ): Promise<PaginatedList<Category>> {
    return this.categoryService.findAll(ctx, options);
  }

  @Query()
  @Allow(Permission.Public)
  async categoryTypes(
    @Ctx() ctx: RequestContext,
    @Args("options") options: ListQueryOptions<CategoryType>,
  ): Promise<PaginatedList<CategoryType>> {
    return this.categoryService.findAllCategoryTypes(ctx, options);
  }

  @Query()
  @Allow(Permission.Public)
  async category(
    @Ctx() ctx: RequestContext,
    @Args("id") id?: string,
    @Args("slug") slug?: string,
  ): Promise<Category | null> {
    if (id) {
      return this.categoryService.findOne(ctx, id);
    } else if (slug) {
      return this.categoryService.findOneBySlug(ctx, slug);
    }
    return null;
  }

  @Query()
  @Allow(Permission.Public)
  async categoryTree(
    @Ctx() ctx: RequestContext,
    @Args("categoryTypeId") categoryTypeId?: string,
  ): Promise<Category[]> {
    return this.categoryService.categoryTree(ctx, categoryTypeId);
  }
}
