import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext } from "@vendure/core";
import { ProductService } from "../services/product.service";

@Resolver()
export class ProductShopResolver {
  constructor(private productService: ProductService) { }

  @Query()
  async getAllProducts(
    @Ctx() ctx: RequestContext,
    @Args("options") options?: any,
  ) {
    return this.productService.getFilteredProducts(ctx, options);
  }

  @Query()
  async getHomePageData(
    @Ctx() ctx: RequestContext,
    @Args("options") options?: any,
  ) {
    return this.productService.getHomePageData(ctx, options);
  }

  @Query()
  async getFilters(
    @Ctx() ctx: RequestContext,
    @Args() args: { slug: string; type: string },
  ) {
    return this.productService.getFilters(ctx, args.slug, args.type);
  }

  @Query()
  async models(@Ctx() ctx: RequestContext) {
    return this.productService.getModels(ctx);
  }

  @Mutation()
  async trackProductClick(
    @Ctx() ctx: RequestContext,
    @Args("productId") productId: string,
    @Args("productName") productName: string,
  ) {
    try {
      await this.productService.trackProductClick(ctx, Number(productId), productName);
      return {
        success: true,
        message: "Click tracked successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to track click",
      };
    }
  }
}
