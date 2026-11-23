import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import {
    Ctx,
    Product,
    RequestContext,
    TransactionalConnection,
} from '@vendure/core';
import { Season } from '../entities/season';

@Resolver('Product')
export class ProductEntityResolver {
    constructor(private connection: TransactionalConnection) {}

    @ResolveField()
    async seasons(@Ctx() ctx: RequestContext, @Parent() product: Product) {
        return this.connection
            .getRepository(ctx, Season)
            .createQueryBuilder('season')
            .innerJoin('season_product', 'sp', 'sp.seasonId = season.id')
            .where('sp.productId = :productId', { productId: product.id })
            .getMany();
    }
}
