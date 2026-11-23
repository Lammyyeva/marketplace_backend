import { Injectable } from "@nestjs/common";
import {
  ID,
  RequestContext,
  TransactionalConnection,
  Asset,
  FacetValue,
  ListQueryBuilder,
  ListQueryOptions,
  PaginatedList,
  TranslatableSaver,
  TranslationInput,
  TranslatorService,
  assertFound,
} from "@vendure/core";
import { Category } from "../entities/category.entity";
import { CategoryType } from "../entities/category-type.entity";
import { CategoryTranslation } from "../entities/category-translation.entity";
import { CategoryTypeTranslation } from "../entities/category-type-translation.entity";

export type CategoryTranslationInput = TranslationInput<Category>;
export type CategoryTypeTranslationInput = TranslationInput<CategoryType>;

import {
  CreateCategoryInput,
  CreateCategoryTypeInput,
  DeletionResult,
  UpdateCategoryInput,
  UpdateCategoryTypeInput,
} from "../../generated/generated-admin-types";

@Injectable()
export class CategoryService {
  constructor(
    private connection: TransactionalConnection,
    private translatableSaver: TranslatableSaver,
    private translator: TranslatorService,
    private listQueryBuilder: ListQueryBuilder,
  ) {}

  async findAllCategoryTypes(
    ctx: RequestContext,
    options?: ListQueryOptions<CategoryType>,
  ): Promise<PaginatedList<CategoryType>> {
    const [items, totalItems] = await this.listQueryBuilder
      .build(CategoryType, options, {
        ctx,
        relations: ["translations", "iconAsset", "imageAsset"],
      })
      .getManyAndCount();

    return {
      items: items.map((type) => this.translator.translate(type, ctx)),
      totalItems,
    };
  }

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<Category>,
  ): Promise<PaginatedList<Category>> {
    const qb = this.listQueryBuilder.build(Category, options, {
      ctx,
      relations: [
        "parent",
        "translations",
        "categoryType",
        "featuredAsset",
        "iconAsset",
        "models",
        "children",
      ],
    });

    const [items, totalItems] = await qb.getManyAndCount();

    return {
      items: items.map((cat) => this.translator.translate(cat, ctx)),
      totalItems,
    };
  }

  async findOne(ctx: RequestContext, id: ID) {
    const category = await this.connection
      .getRepository(ctx, Category)
      .findOne({
        where: { id },
        relations: [
          "parent",
          "featuredAsset",
          "iconAsset",
          "models",
          "children",
          "translations",
        ],
      });
    if (!category) {
      return null;
    }
    return this.translator.translate(category, ctx);
  }

  async categoryTree(ctx: RequestContext, categoryTypeId?: ID) {
    const categories = await this.findAll(ctx, {
      take: 10000,
      filter: categoryTypeId
        ? { categoryTypeId: { eq: categoryTypeId.toString() } }
        : undefined,
    });
    return this.buildCategoryTree(categories.items, null);
  }

  async findOneBySlug(ctx: RequestContext, slug: string) {
    const category = await this.connection
      .getRepository(ctx, Category)
      .findOne({
        where: { slug },
        relations: [
          "parent",
          "featuredAsset",
          "iconAsset",
          "models",
          "children",
          "translations",
        ],
      });
    if (!category) {
      return null;
    }
    return this.translator.translate(category, ctx);
  }

  async findOneCategoryType(ctx: RequestContext, id: ID) {
    const categoryType = await this.connection
      .getRepository(ctx, CategoryType)
      .findOne({
        where: { id },
        relations: ["translations", "iconAsset", "imageAsset"],
      });
    if (!categoryType) {
      return null;
    }
    return this.translator.translate(categoryType, ctx);
  }

  async createCategoryType(
    ctx: RequestContext,
    input: CreateCategoryTypeInput,
  ) {
    const categoryType = await this.translatableSaver.create({
      ctx,
      input,
      entityType: CategoryType,
      translationType: CategoryTypeTranslation,
      beforeSave: async (ct) => {
        if (input.iconAssetId) {
          ct.iconAsset = { id: input.iconAssetId } as Asset;
        }
        if (input.imageAssetId) {
          ct.imageAsset = { id: input.imageAssetId } as Asset;
        }
      },
    });
    return assertFound(this.findOneCategoryType(ctx, categoryType.id));
  }

  async updateCategoryType(
    ctx: RequestContext,
    input: UpdateCategoryTypeInput,
  ) {
    const categoryType = await this.translatableSaver.update({
      ctx,
      input,
      entityType: CategoryType,
      translationType: CategoryTypeTranslation,
      beforeSave: async (ct) => {
        if (input.iconAssetId !== undefined) {
          ct.iconAsset = input.iconAssetId
            ? ({ id: input.iconAssetId } as Asset)
            : (null as any);
        }
        if (input.imageAssetId !== undefined) {
          ct.imageAsset = input.imageAssetId
            ? ({ id: input.imageAssetId } as Asset)
            : (null as any);
        }
      },
    });
    return assertFound(this.findOneCategoryType(ctx, categoryType.id));
  }

  async deleteCategoryType(ctx: RequestContext, id: ID) {
    const categoryType = await this.connection.getEntityOrThrow(
      ctx,
      CategoryType,
      id,
    );
    await this.connection.getRepository(ctx, CategoryType).softRemove(categoryType);
    return {
      result: DeletionResult.DELETED,
      message: `CategoryType ${id} deleted successfully`,
    };
  }

  async create(ctx: RequestContext, input: CreateCategoryInput) {
    const category = await this.translatableSaver.create({
      ctx,
      input,
      entityType: Category,
      translationType: CategoryTranslation,
      beforeSave: async (c) => {
        if (input.parentId) {
          const parent = await this.connection
            .getRepository(ctx, Category)
            .findOne({ where: { id: input.parentId } });
          if (parent) {
            if (
              parent.categoryTypeId?.toString() !==
              input.categoryTypeId?.toString()
            ) {
              throw new Error(
                `Category type mismatch: Parent has categoryTypeId ${parent.categoryTypeId}, but new category has ${input.categoryTypeId}`,
              );
            }
            c.parent = parent;
          }
        }

        if (input.featuredAssetId) {
          c.featuredAsset = { id: input.featuredAssetId } as Asset;
        }
        if (input.iconAssetId) {
          c.iconAsset = { id: input.iconAssetId } as Asset;
        }
        if ((input as any).modelIds) {
          c.models = (input as any).modelIds.map(
            (id: ID) => ({ id }) as FacetValue,
          );
        } else {
          c.models = [];
        }
      },
    });

    return assertFound(this.findOne(ctx, category.id));
  }

  async update(ctx: RequestContext, input: UpdateCategoryInput) {
    const category = await this.translatableSaver.update({
      ctx,
      input,
      entityType: Category,
      translationType: CategoryTranslation,
      beforeSave: async (c) => {
        if (input.parentId !== undefined) {
          if (input.parentId === null) {
            c.parent = null as any;
          } else {
            const parent = await this.connection
              .getRepository(ctx, Category)
              .findOne({ where: { id: input.parentId } });
            if (parent) {
              c.parent = parent;
            }
          }
        }

        if (input.featuredAssetId !== undefined) {
          c.featuredAsset = input.featuredAssetId
            ? ({ id: input.featuredAssetId } as Asset)
            : (null as any);
        }

        if (input.iconAssetId !== undefined) {
          c.iconAsset = input.iconAssetId
            ? ({ id: input.iconAssetId } as Asset)
            : (null as any);
        }
        if ((input as any).modelIds) {
          c.models = (input as any).modelIds.map(
            (id: ID) => ({ id }) as FacetValue,
          );
        }
      },
    });

    return assertFound(this.findOne(ctx, category.id));
  }

  async delete(ctx: RequestContext, id: ID) {
    const category = await this.connection.getEntityOrThrow(ctx, Category, id);
    await this.connection.getRepository(ctx, Category).softRemove(category);
    return {
      result: DeletionResult.DELETED,
      message: `Category ${id} deleted successfully`,
    };
  }

  async assignModelToCategories(
    ctx: RequestContext,
    facetValueId: ID,
    categoryIds: ID[],
  ): Promise<FacetValue> {
    const facetValue = await this.connection.getEntityOrThrow(
      ctx,
      FacetValue,
      facetValueId,
    );

    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.connection
        .getRepository(ctx, Category)
        .findByIds(categoryIds);

      for (const category of categories) {
        const categoryWithModels = await this.connection
          .getRepository(ctx, Category)
          .findOne({
            where: { id: category.id },
            relations: ["models"],
          });

        if (categoryWithModels) {
          const hasModel = categoryWithModels.models.some(
            (b) => b.id.toString() === facetValueId.toString(),
          );

          if (!hasModel) {
            categoryWithModels.models = [
              ...categoryWithModels.models,
              facetValue,
            ];
            await this.connection
              .getRepository(ctx, Category)
              .save(categoryWithModels);
          }
        }
      }
    }

    return facetValue;
  }

  buildCategoryTree(categories: Category[], parentId: ID | null): any[] {
    const matched = categories.filter((category) => {
      const catParentId = category.parent?.id ?? category.parentId ?? null;

      if (parentId === null) {
        if (catParentId === null) {
          return true;
        }
        const parentInList = categories.some(
          (c) => c.id.toString() === catParentId.toString(),
        );
        return !parentInList;
      }

      return (
        catParentId != null && catParentId.toString() === parentId.toString()
      );
    });

    return matched
      .map((category) => {
        const children = this.buildCategoryTree(categories, category.id);
        return {
          ...category,
          children,
        };
      })
      .sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }
}
