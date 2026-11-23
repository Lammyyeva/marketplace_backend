import { Args, Query, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  ID,
  ListQueryOptions,
  PaginatedList,
  Permission,
  RequestContext,
} from "@vendure/core";
import { LabelService } from "../services/label.service";
import { Label } from "../entities/label.entity";

@Resolver("Label")
export class LabelShopResolver {
  constructor(private labelService: LabelService) {}

  @Query()
  @Allow(Permission.Public)
  async labels(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: ListQueryOptions<Label> },
  ): Promise<PaginatedList<Label>> {
    return this.labelService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.Public)
  async label(
    @Ctx() ctx: RequestContext,
    @Args() args: { id: ID },
  ): Promise<Label | undefined> {
    return this.labelService.findOne(ctx, args.id);
  }
}
