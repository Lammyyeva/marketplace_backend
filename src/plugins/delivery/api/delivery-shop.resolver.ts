import {
  Args,
  Query,
  Resolver,
  Mutation,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  Permission,
  RequestContext,
  Transaction,
  Order,
  TransactionalConnection,
} from "@vendure/core";
import { DeliveryService } from "../services/delivery.service";

@Resolver()
export class ShopResolver {
  constructor(private deliveryService: DeliveryService) {}

  @Query()
  @Allow(Permission.Public)
  days(@Ctx() ctx: RequestContext, @Args("options") options?: any) {
    return this.deliveryService.findAllDays(ctx, options);
  }

  @Query()
  @Allow(Permission.Public)
  day(@Ctx() ctx: RequestContext, @Args("id") id: string) {
    return this.deliveryService.findOneDay(ctx, id);
  }

  @Query()
  @Allow(Permission.Public)
  deliveryMethods(@Ctx() ctx: RequestContext, @Args("options") options?: any) {
    return this.deliveryService.findDeliveryMethods(ctx, options);
  }

  @Query()
  @Allow(Permission.Public)
  deliveryMethod(@Ctx() ctx: RequestContext, @Args("id") id: string) {
    return this.deliveryService.findOneMethod(ctx, id);
  }

  @Query()
  @Allow(Permission.Public)
  deliveryGroups(
    @Ctx() ctx: RequestContext,
    @Args("channelId") channelId: string,
  ) {
    return this.deliveryService.getDeliveryGroups(ctx, channelId);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateOrder, Permission.Owner)
  applyDeliveryMethod(
    @Ctx() ctx: RequestContext,
    @Args("orderId") orderId: string,
    @Args("deliveryMethodId") deliveryMethodId: string,
  ) {
    return this.deliveryService.applyDeliveryMethod(
      ctx,
      orderId,
      deliveryMethodId,
    );
  }
}

@Resolver("Order")
export class OrderDeliveryResolver {
  constructor(
    private deliveryService: DeliveryService,
    private connection: TransactionalConnection,
  ) {}

  @ResolveField("deliveryGroups")
  async deliveryGroups(@Ctx() ctx: RequestContext, @Parent() _order: Order) {
    return this.deliveryService.getDeliveryGroups(ctx, String(ctx.channelId));
  }
}
