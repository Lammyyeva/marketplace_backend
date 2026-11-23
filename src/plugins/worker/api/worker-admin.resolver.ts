import { Args, Mutation, Query, Resolver, ResolveField, Parent } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  ID,
  Permission,
  RequestContext,
  Order,
} from "@vendure/core";
import { WorkerService } from "../services/worker.service";

@Resolver("Worker")
export class WorkerAdminResolver {
  constructor(private workerService: WorkerService) {}

  @Query()
  @Allow(Permission.ReadAdministrator)
  workers(
    @Ctx() ctx: RequestContext,
    @Args() args: any,
  ) {
    return this.workerService.findAll(ctx, args.options);
  }

  @Query()
  @Allow(Permission.ReadAdministrator)
  worker(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.workerService.findOne(ctx, args.id);
  }

  @Mutation()
  @Allow(Permission.CreateAdministrator)
  createWorker(@Ctx() ctx: RequestContext, @Args() args: { input: any }) {
    return this.workerService.create(ctx, args.input);
  }

  @Mutation()
  @Allow(Permission.UpdateAdministrator)
  updateWorker(@Ctx() ctx: RequestContext, @Args() args: { id: ID; input: any }) {
    return this.workerService.update(ctx, { ...args.input, id: args.id });
  }

  @Mutation()
  @Allow(Permission.DeleteAdministrator)
  deleteWorker(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.workerService.delete(ctx, args.id);
  }

  @Mutation()
  @Allow(Permission.UpdateOrder)
  assignCourierToOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { orderId: ID; courierId: ID },
  ) {
    return this.workerService.assignCourierToOrder(ctx, args.orderId, args.courierId);
  }

  @Mutation()
  @Allow(Permission.UpdateOrder)
  unassignCourierFromOrder(
    @Ctx() ctx: RequestContext,
    @Args() args: { orderId: ID },
  ) {
    return this.workerService.unassignCourierFromOrder(ctx, args.orderId);
  }
}

@Resolver("Order")
export class WorkerOrderResolver {
  constructor(private workerService: WorkerService) {}

  @ResolveField()
  courier(@Ctx() ctx: RequestContext, @Parent() order: Order) {
    const courierId = (order.customFields as any).assignedCourierId;
    if (courierId) {
      return this.workerService.findOne(ctx, courierId);
    }
    return null;
  }
}
