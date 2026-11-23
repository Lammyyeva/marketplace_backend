import {
  Args,
  Mutation,
  Query,
  Resolver,
  Parent,
  ResolveField,
} from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  ID,
  Permission,
  RequestContext,
  ProductVariant,
  TransactionalConnection,
} from "@vendure/core";
import { LikeProductVariantService } from "../services/like.service";
import { Like } from "../entities/like.entity";

@Resolver()
export class LikeProductVariantResolver {
  constructor(
    private likeProductVariantService: LikeProductVariantService,
    private connection: TransactionalConnection,
  ) {}

  @Mutation()
  @Allow(Permission.Authenticated)
  async likeProductVariant(
    @Ctx() ctx: RequestContext,
    @Args() args: { productVariantId: ID },
  ): Promise<{ success: boolean; message: string; like: Like | null }> {
    const userId = ctx.activeUserId;
    if (!userId) {
      return {
        success: false,
        message: "User must be logged in to like items",
        like: null,
      };
    }

    const like = await this.likeProductVariantService.likeProductVariant(
      ctx,
      args.productVariantId,
      userId,
    );
    return {
      success: true,
      message: like?.isLike ? "Product liked" : "Product unliked",
      like: like || null,
    };
  }

  @Query()
  @Allow(Permission.Authenticated)
  async myLikes(@Ctx() ctx: RequestContext): Promise<Like[]> {
    const userId = ctx.activeUserId;
    if (!userId) {
      return [];
    }
    return this.likeProductVariantService.getLikesForUser(ctx, userId);
  }
}

@Resolver("ProductVariant")
export class ProductVariantLikeResolver {
  constructor(private connection: TransactionalConnection) {}

  @ResolveField()
  async isLiked(
    @Ctx() ctx: RequestContext,
    @Parent() productVariant: ProductVariant,
  ): Promise<boolean> {
    const userId = ctx.activeUserId;
    if (!userId) {
      return false;
    }

    const like = await this.connection.getRepository(ctx, Like).findOne({
      where: {
        user: { id: userId },
        productVariant: { id: productVariant.id },
      },
    });

    return !!like?.isLike;
  }
}

@Resolver("SearchResult")
export class SearchResultLikeResolver {
  constructor(private connection: TransactionalConnection) {}

  @ResolveField()
  async isLiked(
    @Ctx() ctx: RequestContext,
    @Parent() searchResult: { productVariantId: ID },
  ): Promise<boolean> {
    const userId = ctx.activeUserId;
    if (!userId) {
      return false;
    }

    const like = await this.connection.getRepository(ctx, Like).findOne({
      where: {
        user: { id: userId },
        productVariant: { id: searchResult.productVariantId },
      },
    });

    return !!like?.isLike;
  }
}
