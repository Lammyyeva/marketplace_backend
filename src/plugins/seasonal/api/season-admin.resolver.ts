import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, ID, Permission, RequestContext, PaginatedList } from '@vendure/core';
import { SeasonService } from '../services/season.service';
import { Season } from '../entities/season';
import { CreateSeasonInput, UpdateSeasonInput } from '../season.types';

@Resolver()
export class SeasonAdminResolver {
    constructor(private seasonService: SeasonService) {}

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadSettings)
    async seasons(
        @Ctx() ctx: RequestContext,
        @Args() args: any,
    ): Promise<PaginatedList<Season>> {
        return this.seasonService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadSettings)
    async season(
        @Ctx() ctx: RequestContext,
        @Args() args: { id: ID },
    ): Promise<Season | undefined> {
        return this.seasonService.findOne(ctx, args.id);
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadSettings)
    async activeSeasons(@Ctx() ctx: RequestContext): Promise<Season[]> {
        return this.seasonService.getActiveSeasons(ctx);
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadSettings)
    async seasonBySlug(
        @Ctx() ctx: RequestContext,
        @Args() args: { slug: string },
    ): Promise<Season | undefined> {
        return this.seasonService.getSeasonBySlug(ctx, args.slug);
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadSettings)
    async productSeasons(
        @Ctx() ctx: RequestContext,
        @Args() args: { productId: ID },
    ): Promise<Season[]> {
        return this.seasonService.findForProduct(ctx, args.productId);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateSettings)
    async createSeason(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: CreateSeasonInput },
    ): Promise<Season> {
        return this.seasonService.create(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateSettings)
    async updateSeason(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: UpdateSeasonInput },
    ): Promise<Season> {
        return this.seasonService.update(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateSettings)
    async deleteSeason(
        @Ctx() ctx: RequestContext,
        @Args() args: { id: ID },
    ) {
        return this.seasonService.delete(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateSettings)
    async assignProductsToSeason(
        @Ctx() ctx: RequestContext,
        @Args() args: { seasonId: ID, productIds: ID[] },
    ): Promise<Season> {
        return this.seasonService.assignProducts(ctx, args.seasonId, args.productIds);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateSettings)
    async removeProductsFromSeason(
        @Ctx() ctx: RequestContext,
        @Args() args: { seasonId: ID, productIds: ID[] },
    ): Promise<Season> {
        return this.seasonService.removeProducts(ctx, args.seasonId, args.productIds);
    }
}
