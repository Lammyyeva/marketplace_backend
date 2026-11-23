import { Injectable } from "@nestjs/common";
import {
  Asset,
  FacetValue,
  ID,
  ListQueryBuilder,
  ListQueryOptions,
  PaginatedList,
  Product,
  ProductVariant,
  RequestContext,
  TransactionalConnection,
  TranslationInput,
  TranslatableSaver,
  TranslatorService,
  assertFound,
  UserInputError,
} from "@vendure/core";
import {
  DeletionResponse,
  DeletionResult,
} from "@vendure/common/lib/generated-types";
import { Banner } from "../entities/banner.entity";
import { BannerTranslation } from "../entities/banner-translation.entity";
import { BannerType } from "../entities/banner-type.entity";
import { BannerTypeTranslation } from "../entities/banner-type-translation.entity";
import { BannerAsset } from "../entities/banner-asset.entity";
import { Category } from "../../category/entities/category.entity";

export type BannerTranslationInput = TranslationInput<Banner>;
export type BannerTypeTranslationInput = TranslationInput<BannerType>;

import {
  CreateBannerInput,
  UpdateBannerInput,
} from "../../generated/generated-admin-types";

export interface UpsertBannerAssetInput {
  bannerId: ID;
  languageCode: any;
  assetId: ID;
}

export interface RemoveBannerAssetInput {
  bannerId: ID;
  languageCode: any;
}

export type CreateBannerTypeInput = any;
export type UpdateBannerTypeInput = any;

@Injectable()
export class BannerService {
  constructor(
    private connection: TransactionalConnection,
    private translatorService: TranslatorService,
    private translatableSaver: TranslatableSaver,
    private listQueryBuilder: ListQueryBuilder,
  ) {}

  async findAll(
    ctx: RequestContext,
    options?: ListQueryOptions<Banner>,
  ): Promise<PaginatedList<Banner>> {
    const [items, totalItems] = await this.listQueryBuilder
      .build(Banner, options, {
        ctx,
        relations: [
          "translations",
          "assets",
          "assets.asset",
          "category",
          "model",
          "products",
          "variants",
          "type",
        ],
      })
      .getManyAndCount();

    return {
      items: items.map((b) => this.translate(ctx, b)),
      totalItems,
    };
  }

  async findOne(ctx: RequestContext, id: ID): Promise<Banner | undefined> {
    const banner = await this.connection.getRepository(ctx, Banner).findOne({
      where: { id },
      relations: [
        "translations",
        "assets",
        "assets.asset",
        "category",
        "model",
        "products",
        "variants",
        "type",
      ],
    });
    return banner ? this.translate(ctx, banner) : undefined;
  }

  async findBySlug(
    ctx: RequestContext,
    slug: string,
  ): Promise<Banner | undefined> {
    const banner = await this.connection.getRepository(ctx, Banner).findOne({
      where: { slug },
      relations: [
        "translations",
        "assets",
        "assets.asset",
        "category",
        "model",
        "products",
        "variants",
        "type",
      ],
    });
    return banner ? this.translate(ctx, banner) : undefined;
  }

  async findByCategoryId(
    ctx: RequestContext,
    categoryId: ID,
  ): Promise<Banner[]> {
    const banners = await this.connection.getRepository(ctx, Banner).find({
      where: { categoryId },
      relations: [
        "translations",
        "assets",
        "assets.asset",
        "category",
        "model",
        "products",
        "variants",
        "type",
      ],
    });
    return banners.map((b) => this.translate(ctx, b));
  }

  async create(ctx: RequestContext, input: CreateBannerInput): Promise<Banner> {
    const tkTranslation = input.translations.find(
      (t: any) => t.languageCode === "tk" || (t.languageCode as any) === "tk",
    );
    if (!tkTranslation || !tkTranslation.name) {
      throw new UserInputError(
        "Turkmen (tk) translation with a name is required.",
      );
    }
    const banner = await this.translatableSaver.create({
      ctx,
      input,
      entityType: Banner,
      translationType: BannerTranslation,
      beforeSave: async (b) => {
        if (input.redirect) {
          b.redirect = input.redirect as any;
        }
        if (input.link) {
          b.link = input.link as any;
        }
        if (input.backColor) {
          b.backColor = input.backColor as any;
        }
        if (input.btnColor) {
          b.btnColor = input.btnColor;
        }
        if (input.slug) {
          b.slug = input.slug;
        }
        if (input.enabled !== undefined) {
          b.enabled = input.enabled as any;
        }
        if (input.sort !== undefined) {
          b.sort = input.sort as any;
        }
        if (input.categoryId) {
          b.category = { id: input.categoryId } as Category;
        }
        if ((input as any).modelId) {
          b.model = { id: (input as any).modelId } as FacetValue;
        }
        if (input.productIds) {
          b.products = input.productIds.map((id: ID) => ({ id }) as Product);
        }
        if (input.productVariantIds) {
          b.variants = input.productVariantIds.map(
            (id: ID) => ({ id }) as ProductVariant,
          );
        }
        if (input.typeId) {
          b.type = { id: input.typeId } as BannerType;
        }
        if (input.startDate) {
          b.startDate = input.startDate;
        }
        if (input.endDate) {
          b.endDate = input.endDate;
        }
      },
    });

    return assertFound(this.findOne(ctx, banner.id));
  }

  async update(ctx: RequestContext, input: UpdateBannerInput): Promise<Banner> {
    const banner = await this.translatableSaver.update({
      ctx,
      input,
      entityType: Banner,
      translationType: BannerTranslation,
      beforeSave: async (b) => {
        if (input.redirect !== undefined) {
          b.redirect = input.redirect as any;
        }
        if (input.link !== undefined) {
          b.link = input.link as any;
        }
        if (input.backColor !== undefined) {
          b.backColor = input.backColor as any;
        }
        if (input.btnColor !== undefined) {
          b.btnColor = input.btnColor as any;
        }
        if (input.slug !== undefined) {
          b.slug = input.slug as any;
        }
        if (input.enabled !== undefined) {
          b.enabled = input.enabled as any;
        }
        if (input.sort !== undefined) {
          b.sort = input.sort as any;
        }
        if (input.categoryId !== undefined) {
          b.category = input.categoryId
            ? ({ id: input.categoryId } as Category)
            : (null as any);
        }
        if ((input as any).modelId !== undefined) {
          b.model = (input as any).modelId
            ? ({ id: (input as any).modelId } as FacetValue)
            : (null as any);
        }
        if (input.productIds !== undefined && input.productIds !== null) {
          b.products = input.productIds.map((id: ID) => ({ id }) as Product);
        }
        if (
          input.productVariantIds !== undefined &&
          input.productVariantIds !== null
        ) {
          b.variants = input.productVariantIds.map(
            (id: ID) => ({ id }) as ProductVariant,
          );
        }
        if (input.typeId !== undefined) {
          b.type = { id: input.typeId } as BannerType;
        }
        if (input.startDate !== undefined) {
          b.startDate = input.startDate;
        }
        if (input.endDate !== undefined) {
          b.endDate = input.endDate;
        }
      },
    });

    return assertFound(this.findOne(ctx, banner.id));
  }

  async upsertAsset(
    ctx: RequestContext,
    input: UpsertBannerAssetInput,
  ): Promise<Banner> {
    const { bannerId, languageCode, assetId } = input;
    const assetRepo = this.connection.getRepository(ctx, BannerAsset);

    const bannerAsset = await assetRepo.findOne({
      where: {
        bannerId: bannerId as any,
        languageCode,
      },
    });

    if (bannerAsset) {
      await assetRepo.update(bannerAsset.id, {
        assetId: assetId,
      });
    } else {
      const banner = await this.connection.getEntityOrThrow(
        ctx,
        Banner,
        bannerId,
      );

      const newAsset = assetRepo.create({
        languageCode,
        banner,
        assetId: assetId,
      });

      await assetRepo.save(newAsset);
    }

    return assertFound(this.findOne(ctx, bannerId));
  }

  async removeAsset(
    ctx: RequestContext,
    input: RemoveBannerAssetInput,
  ): Promise<Banner> {
    const { bannerId, languageCode } = input;
    const assetRepo = this.connection.getRepository(ctx, BannerAsset);

    const bannerAsset = await assetRepo.findOne({
      where: {
        bannerId: bannerId as any,
        languageCode,
      },
    });

    if (bannerAsset) {
      await assetRepo.remove(bannerAsset);
    }

    return assertFound(this.findOne(ctx, bannerId));
  }

  async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
    try {
      const banner = await this.connection.getEntityOrThrow(ctx, Banner, id);
      await this.connection.getRepository(ctx, Banner).softRemove(banner);
      return { result: DeletionResult.DELETED };
    } catch (e: any) {
      return { result: DeletionResult.NOT_DELETED, message: e.message };
    }
  }

  async deleteMany(
    ctx: RequestContext,
    ids: ID[],
  ): Promise<DeletionResponse[]> {
    return Promise.all(ids.map((id) => this.delete(ctx, id)));
  }

  private translate(ctx: RequestContext, banner: Banner): Banner {
    return this.translatorService.translate(banner, ctx);
  }

  async findAllTypes(
    ctx: RequestContext,
    options?: ListQueryOptions<BannerType>,
  ): Promise<PaginatedList<BannerType>> {
    const [items, totalItems] = await this.listQueryBuilder
      .build(BannerType, options, {
        ctx,
        relations: ["translations", "banners"],
      })
      .getManyAndCount();

    return {
      items: items.map((b) => this.translateType(ctx, b)),
      totalItems,
    };
  }

  async findOneType(
    ctx: RequestContext,
    id: ID,
  ): Promise<BannerType | undefined> {
    const bannerType = await this.connection
      .getRepository(ctx, BannerType)
      .findOne({
        where: { id },
        relations: ["translations", "banners"],
      });
    return bannerType ? this.translateType(ctx, bannerType) : undefined;
  }

  async createType(
    ctx: RequestContext,
    input: CreateBannerTypeInput,
  ): Promise<BannerType> {
    const bannerType = await this.translatableSaver.create({
      ctx,
      input,
      entityType: BannerType,
      translationType: BannerTypeTranslation,
      beforeSave: async (b) => {
        if (input.enabled !== undefined) {
          b.enabled = input.enabled as any;
        }
        if (input.sort !== undefined) {
          b.sort = input.sort as any;
        }
      },
    });

    return assertFound(this.findOneType(ctx, bannerType.id));
  }

  async updateType(
    ctx: RequestContext,
    input: UpdateBannerTypeInput,
  ): Promise<BannerType> {
    const bannerType = await this.translatableSaver.update({
      ctx,
      input,
      entityType: BannerType,
      translationType: BannerTypeTranslation,
      beforeSave: async (b) => {
        if (input.enabled !== undefined) {
          b.enabled = input.enabled as any;
        }
        if (input.sort !== undefined) {
          b.sort = input.sort as any;
        }
      },
    });

    return assertFound(this.findOneType(ctx, bannerType.id));
  }

  async deleteType(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
    const bannerType = await this.connection.getEntityOrThrow(
      ctx,
      BannerType,
      id,
    );
    if (bannerType.banners && bannerType.banners.length > 0) {
      return {
        result: DeletionResult.NOT_DELETED,
        message: "Cannot delete BannerType with associated banners.",
      };
    }
    await this.connection.getRepository(ctx, BannerType).softRemove(bannerType);
    return { result: DeletionResult.DELETED };
  }

  async deleteManyTypes(
    ctx: RequestContext,
    ids: ID[],
  ): Promise<DeletionResponse[]> {
    return Promise.all(ids.map((id) => this.deleteType(ctx, id)));
  }

  private translateType(
    ctx: RequestContext,
    bannerType: BannerType,
  ): BannerType {
    return this.translatorService.translate(bannerType, ctx);
  }

  async incrementCounter(ctx: RequestContext, id: ID): Promise<boolean> {
    await this.connection
      .getRepository(ctx, Banner)
      .increment({ id }, "counter", 1);
    return true;
  }
}
