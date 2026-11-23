import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  ListQueryOptions,
  Permission,
  PaginatedList,
  RequestContext,
  Transaction,
} from "@vendure/core";
import { CategoryService } from "../services/category.service";
import { Category } from "../entities/category.entity";
import { CategoryType } from "../entities/category-type.entity";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateCategoryTypeInput,
  UpdateCategoryTypeInput,
} from "../../generated/generated-admin-types";

@Resolver()
export class CategoryAdminResolver {
  constructor(private categoryService: CategoryService) {}

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  async categories(
    @Ctx() ctx: RequestContext,
    @Args("options") options: ListQueryOptions<Category>,
  ): Promise<PaginatedList<Category>> {
    return this.categoryService.findAll(ctx, options);
  }

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  async categoryTypes(
    @Ctx() ctx: RequestContext,
    @Args("options") options: ListQueryOptions<CategoryType>,
  ): Promise<PaginatedList<CategoryType>> {
    return this.categoryService.findAllCategoryTypes(ctx, options);
  }

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  async categoryType(
    @Ctx() ctx: RequestContext,
    @Args("id") id: string,
  ): Promise<CategoryType | null> {
    return this.categoryService.findOneCategoryType(ctx, id);
  }

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
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
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  async categoryTree(
    @Ctx() ctx: RequestContext,
    @Args("categoryTypeId") categoryTypeId?: string,
  ): Promise<Category[]> {
    return this.categoryService.categoryTree(ctx, categoryTypeId);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.CreateCatalog)
  async createCategory(
    @Ctx() ctx: RequestContext,
    @Args("input") input: CreateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.create(ctx, input);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateCategory(
    @Ctx() ctx: RequestContext,
    @Args("input") input: UpdateCategoryInput,
  ): Promise<Category> {
    return this.categoryService.update(ctx, input);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.DeleteCatalog)
  async deleteCategory(@Ctx() ctx: RequestContext, @Args("id") id: string) {
    return this.categoryService.delete(ctx, id);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.CreateCatalog)
  async createCategoryType(
    @Ctx() ctx: RequestContext,
    @Args("input") input: CreateCategoryTypeInput,
  ): Promise<CategoryType> {
    return this.categoryService.createCategoryType(ctx, input);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateCategoryType(
    @Ctx() ctx: RequestContext,
    @Args("input") input: UpdateCategoryTypeInput,
  ): Promise<CategoryType> {
    return this.categoryService.updateCategoryType(ctx, input);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.DeleteCatalog)
  async deleteCategoryType(@Ctx() ctx: RequestContext, @Args("id") id: string) {
    return this.categoryService.deleteCategoryType(ctx, id);
  }
}
