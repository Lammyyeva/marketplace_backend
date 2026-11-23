import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Ctx, RequestContext } from "@vendure/core";
import { ActiveSaleService } from "../services/active-sale.service";

@Resolver("ProductVariant")
export class ProductVariantSaleResolver {
  constructor(private activeSaleService: ActiveSaleService) {}

  @ResolveField()
  async sale(@Ctx() ctx: RequestContext, @Parent() variant: any) {
    return this.activeSaleService.getActiveSaleForVariant(
      ctx,
      variant.id,
      variant.price,
    );
  }
}
