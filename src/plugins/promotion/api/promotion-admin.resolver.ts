import { Args, Query, Resolver } from "@nestjs/graphql";
import { Allow, Ctx, ID, Permission, RequestContext } from "@vendure/core";
import { VariantSoldCountService } from "../services/variant-sold-count.service";

@Resolver()
export class PromotionAdminResolver {
  constructor(private variantSoldCountService: VariantSoldCountService) {}

  @Query()
  @Allow(Permission.ReadPromotion, Permission.ReadCatalog)
  async variantSoldCountsForPromotion(
    @Ctx() ctx: RequestContext,
    @Args() args: { promotionId: ID; variantIds: ID[] },
  ) {
    return this.variantSoldCountService.getSoldCounts(
      ctx,
      args.promotionId,
      args.variantIds,
    );
  }
}
