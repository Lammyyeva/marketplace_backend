import { Args, Query, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext } from '@vendure/core';
import { SeasonService } from '../services/season.service';
import { Season } from '../entities/season';

@Resolver()
export class SeasonShopResolver {
    constructor(private seasonService: SeasonService) {}

    @Query()
    async activeSeasons(@Ctx() ctx: RequestContext): Promise<Season[]> {
        return this.seasonService.getActiveSeasons(ctx);
    }

    @Query()
    async seasonBySlug(
        @Ctx() ctx: RequestContext,
        @Args() args: { slug: string },
    ): Promise<Season | undefined> {
        return this.seasonService.getSeasonBySlug(ctx, args.slug);
    }
}
