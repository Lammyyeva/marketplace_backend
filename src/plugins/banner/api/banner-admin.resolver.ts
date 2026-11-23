import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  ID,
  ListQueryOptions,
  PaginatedList,
  Permission,
  RequestContext,
  Transaction,
} from "@vendure/core";
//import { DeletionResponse } from "@vendure/core";
import {
  CreateBannerInput,
  DeletionResponse,
  UpdateBannerInput,
} from "../../generated/generated-admin-types";
import { Banner } from "../entities/banner.entity";
import { BannerType } from "../entities/banner-type.entity";
import {
  BannerService,
  UpsertBannerAssetInput,
  RemoveBannerAssetInput,
  CreateBannerTypeInput,
  UpdateBannerTypeInput,
} from "../services/banner.service";

@Resolver("Banner")
export class BannerAdminResolver {
  constructor(private bannerService: BannerService) {}

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  async banner(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<Banner | undefined> {
    return this.bannerService.findOne(ctx, args.id);
  }

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  async banners(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: ListQueryOptions<Banner> },
  ): Promise<PaginatedList<Banner>> {
    return this.bannerService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  async bannerBySlug(
    @Ctx() ctx: RequestContext,
    @Args() args: { slug: string },
  ): Promise<Banner | undefined> {
    return this.bannerService.findBySlug(ctx, args.slug);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.CreateCatalog)
  async createBanner(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateBannerInput },
  ): Promise<Banner> {
    return this.bannerService.create(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async updateBanner(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateBannerInput },
  ): Promise<Banner> {
    return this.bannerService.update(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async upsertBannerAsset(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpsertBannerAssetInput },
  ): Promise<Banner> {
    return this.bannerService.upsertAsset(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async removeBannerAsset(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: RemoveBannerAssetInput },
  ): Promise<Banner> {
    return this.bannerService.removeAsset(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.DeleteCatalog)
  async deleteBanner(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<DeletionResponse> {
    return this.bannerService.delete(ctx, args.id);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.DeleteCatalog)
  async deleteBanners(
    @Ctx() ctx: RequestContext,
    @Args() args: { ids: ID[] },
  ): Promise<DeletionResponse[]> {
    return this.bannerService.deleteMany(ctx, args.ids);
  }

  //  =================type reslver

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  async bannerType(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<BannerType | undefined> {
    return this.bannerService.findOneType(ctx, args.id);
  }

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  async bannerTypes(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: ListQueryOptions<BannerType> },
  ): Promise<PaginatedList<BannerType>> {
    return this.bannerService.findAllTypes(ctx, args.options);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.CreateCatalog)
  async createBannerType(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: CreateBannerTypeInput },
  ): Promise<BannerType> {
    return this.bannerService.createType(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.UpdateCatalog)
  async updateBannerType(
    @Ctx() ctx: RequestContext,
    @Args() args: { input: UpdateBannerTypeInput },
  ): Promise<BannerType> {
    return this.bannerService.updateType(ctx, args.input);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.DeleteCatalog)
  async deleteBannerType(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<DeletionResponse> {
    return this.bannerService.deleteType(ctx, args.id);
  }

  @Mutation()
  @Transaction()
  @Allow(Permission.DeleteCatalog)
  async deleteBannerTypes(
    @Ctx() ctx: RequestContext,
    @Args() args: { ids: ID[] },
  ): Promise<DeletionResponse[]> {
    return this.bannerService.deleteManyTypes(ctx, args.ids);
  }
}
