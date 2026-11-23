import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  ID,
  ListQueryOptions,
  PaginatedList,
  Permission,
  RequestContext,
} from "@vendure/core";

import { Banner } from "../entities/banner.entity";
import { BannerType } from "../entities/banner-type.entity";
import { BannerService } from "../services/banner.service";

@Resolver("Banner")
export class BannerShopResolver {
  constructor(private bannerService: BannerService) {}

  @Query()
  @Allow(Permission.Public)
  async banner(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<Banner | undefined> {
    return this.bannerService.findOne(ctx, args.id);
  }

  @Query()
  @Allow(Permission.Public)
  async banners(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: ListQueryOptions<Banner> },
  ): Promise<PaginatedList<Banner>> {
    return this.bannerService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.Public)
  async bannerBySlug(
    @Ctx() ctx: RequestContext,
    @Args() args: { slug: string },
  ): Promise<Banner | undefined> {
    return this.bannerService.findBySlug(ctx, args.slug);
  }

  @Mutation()
  @Allow(Permission.Public)
  async trackBannerClick(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<boolean> {
    return this.bannerService.incrementCounter(ctx, args.id);
  }

  // --- BannerType Resolvers ---
  @Query()
  @Allow(Permission.Public)
  async bannerType(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<BannerType | undefined> {
    return this.bannerService.findOneType(ctx, args.id);
  }

  @Query()
  @Allow(Permission.Public)
  async bannerTypes(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: ListQueryOptions<BannerType> },
  ): Promise<PaginatedList<BannerType>> {
    return this.bannerService.findAllTypes(ctx, args.options);
  }
}
