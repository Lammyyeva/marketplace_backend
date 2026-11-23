import { Args, ID as GraphQLID, Int, Query, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext, ProductService, Product, ID } from '@vendure/core';
import { BoughtTogetherService } from '../services/bought-together.service';
import { In } from 'typeorm';

@Resolver()
export class BoughtTogetherResolver {
  constructor(
    private boughtTogetherService: BoughtTogetherService,
    private productService: ProductService,
  ) { }

  @Query()
  async boughtTogether(
    @Ctx() ctx: RequestContext,
    @Args('productId', { type: () => GraphQLID }) productId: ID,
    @Args('limit', { type: () => Int, defaultValue: 4 }) limit: number,
  ) {
    const pairs = await this.boughtTogetherService.getBoughtTogether(ctx, productId, limit);
    if (pairs.length === 0) return [];

    const relatedIds = pairs.map((p) => p.relatedProductId);

    const productsResult = await this.productService.findAll(ctx, {
      filter: {
        id: { in: relatedIds.map(id => id.toString()) },
        enabled: { eq: true },
      },
    });

    const productMap = new Map<ID, Product>();
    for (const p of productsResult.items) {
      productMap.set(p.id, p);
    }

    return pairs
      .map((pair) => {
        const product = productMap.get(pair.relatedProductId);
        if (!product) return null;
        return {
          product,
          count: pair.count,
        };
      })
      .filter((res) => res !== null);
  }
}
