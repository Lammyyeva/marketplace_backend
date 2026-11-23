import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import {
    Ctx,
    ListQueryBuilder,
    Product,
    RequestContext,
} from '@vendure/core';
import { Season } from '../entities/season';

@Resolver('Season')
export class SeasonEntityResolver {
    constructor(private listQueryBuilder: ListQueryBuilder) {}

    @ResolveField()
    async products(
        @Ctx() ctx: RequestContext,
        @Parent() season: Season,
        @Args() args: any,
    ) {
        return this.listQueryBuilder
            .build(Product, args.options || undefined, {
                ctx,
                relations: ['featuredAsset', 'variants'],
            })
            .innerJoin('season_product', 'sp', 'sp.productId = product.id')
            .andWhere('sp.seasonId = :seasonId', { seasonId: season.id })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }
}
