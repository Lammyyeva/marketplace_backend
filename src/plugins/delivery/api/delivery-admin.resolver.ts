import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  Permission,
  RequestContext,
  Transaction,
} from "@vendure/core";
import { DeliveryService } from "../services/delivery.service";

@Resolver()
export class AdminResolver {
  constructor(private deliveryService: DeliveryService) {}

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  days(@Ctx() ctx: RequestContext, @Args("options") options?: any) {
    return this.deliveryService.findAllDays(ctx, options);
  }

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  day(@Ctx() ctx: RequestContext, @Args("id") id: string) {
    return this.deliveryService.findOneDay(ctx, id);
  }

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  deliveryMethods(@Ctx() ctx: RequestContext, @Args("options") options?: any) {
    return this.deliveryService.findDeliveryMethods(ctx, options);
  }

  @Query()
  @Allow(Permission.ReadCatalog, Permission.ReadAdministrator)
  deliveryMethod(@Ctx() ctx: RequestContext, @Args("id") id: string) {
    return this.deliveryService.findOneMethod(ctx, id);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.CreateCatalog)
  createDay(@Ctx() ctx: RequestContext, @Args("input") input: any) {
    return this.deliveryService.createDay(ctx, input);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  updateDay(@Ctx() ctx: RequestContext, @Args("input") input: any) {
    return this.deliveryService.updateDay(ctx, input);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.DeleteCatalog)
  deleteDay(@Ctx() ctx: RequestContext, @Args("id") id: string) {
    return this.deliveryService.deleteDay(ctx, id);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.CreateCatalog)
  createDeliveryMethod(@Ctx() ctx: RequestContext, @Args("input") input: any) {
    return this.deliveryService.createDeliveryMethod(ctx, input);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  updateDeliveryMethod(@Ctx() ctx: RequestContext, @Args("input") input: any) {
    return this.deliveryService.updateDeliveryMethod(ctx, input);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.DeleteCatalog)
  deleteDeliveryMethod(@Ctx() ctx: RequestContext, @Args("id") id: string) {
    return this.deliveryService.deleteDeliveryMethod(ctx, id);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateCatalog)
  editButtonState(@Ctx() ctx: RequestContext, @Args("id") id: string) {
    return this.deliveryService.editButtonState(ctx, id);
  }

  @Transaction()
  @Mutation()
  @Allow(Permission.UpdateOrder, Permission.UpdateCatalog)
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
