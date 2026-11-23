import { Args, Query, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext, Allow, Permission } from "@vendure/core";
import { ProductService } from "../services/product.service";

@Resolver()
export class ProductAdminResolver {
  constructor(private productService: ProductService) {}

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadProduct)
  async getAllProducts(
    @Ctx() ctx: RequestContext,
    @Args("options") options?: any,
  ) {
    const result = await this.productService.getFilteredProducts(ctx, options);
    return result;
  }

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadProduct)
  async getFilters(
    @Ctx() ctx: RequestContext,
    @Args() args: { slug: string; type: string },
  ) {
    return this.productService.getFilters(ctx, args.slug, args.type);
  }

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadProduct)
  async models(@Ctx() ctx: RequestContext) {
    return this.productService.getModels(ctx);
  }
}
