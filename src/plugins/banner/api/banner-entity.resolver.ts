import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import {
  TransactionalConnection,
  Asset,
  RequestContext,
  TranslatorService,
  Ctx,
  Product,
} from "@vendure/core";
import { Banner } from "../entities/banner.entity";
import { BannerType } from "../entities/banner-type.entity";
import { BannerAsset } from "../entities/banner-asset.entity";
import { Category } from "../../category/entities/category.entity";

@Resolver("Banner")
export class BannerEntityResolver {
  constructor(
    private connection: TransactionalConnection,
    private translator: TranslatorService,
  ) {}

  @ResolveField()
  name(@Ctx() ctx: RequestContext, @Parent() banner: Banner): string {
    const translations = banner.translations || [];
    const translation = translations.find(
      (t) => t.languageCode === ctx.languageCode,
    ) as any;
    return translation?.name || (banner.translations?.[0] as any)?.name || "";
  }

  @ResolveField()
  translations(@Parent() banner: Banner): any[] {
    return banner.translations || [];
  }

  @ResolveField()
  async assets(
    @Ctx() ctx: RequestContext,
    @Parent() banner: Banner,
  ): Promise<BannerAsset[]> {
    if (banner.assets) {
      return banner.assets;
    }
    const bannerWithAssets = await this.connection
      .getRepository(Banner)
      .findOne({
        where: { id: banner.id },
        relations: ["assets", "assets.asset"],
      });
    return bannerWithAssets?.assets || [];
  }

  @ResolveField()
  async asset(
    @Ctx() ctx: RequestContext,
    @Parent() banner: Banner,
  ): Promise<Asset | null> {
    const assets = await this.assets(ctx, banner);
    const currentAsset = assets.find(
      (a) => a.languageCode === ctx.languageCode,
    );
    if (currentAsset) {
      return currentAsset.asset;
    }
    const tkAsset = assets.find((a) => (a.languageCode as any) === "tk");
    if (tkAsset) {
      return tkAsset.asset;
    }
    return assets[0]?.asset || null;
  }

  @ResolveField()
  async category(@Parent() banner: Banner): Promise<Category | null> {
    if (banner.category) {
      return banner.category;
    }
    const bannerWithCategory = await this.connection
      .getRepository(Banner)
      .findOne({
        where: { id: banner.id },
        relations: ["category"],
      });
    return bannerWithCategory?.category || null;
  }

  @ResolveField()
  async products(@Parent() banner: Banner): Promise<Product[]> {
    const bannerWithProducts = await this.connection
      .getRepository(Banner)
      .findOne({
        where: { id: banner.id },
        relations: ["products"],
      });
    return bannerWithProducts?.products || [];
  }

  @ResolveField()
  async type(@Parent() banner: Banner): Promise<any | null> {
    if (banner.type) {
      return banner.type;
    }
    const bannerWithType = await this.connection.getRepository(Banner).findOne({
      where: { id: banner.id },
      relations: ["type"],
    });
    return bannerWithType?.type || null;
  }
}

@Resolver("BannerType")
export class BannerTypeEntityResolver {
  constructor(
    private connection: TransactionalConnection,
    private translator: TranslatorService,
  ) {}

  @ResolveField()
  name(@Ctx() ctx: RequestContext, @Parent() bannerType: BannerType): string {
    return this.translator.translate(bannerType, ctx).name;
  }

  @ResolveField()
  translations(@Parent() bannerType: BannerType): any[] {
    return bannerType.translations || [];
  }

  @ResolveField()
  async banners(@Parent() bannerType: BannerType): Promise<Banner[]> {
    if (bannerType.banners) {
      return bannerType.banners;
    }
    const bannerTypeWithBanners = await this.connection
      .getRepository(BannerType)
      .findOne({
        where: { id: bannerType.id },
        relations: ["banners"],
      });
    return bannerTypeWithBanners?.banners || [];
  }
}
