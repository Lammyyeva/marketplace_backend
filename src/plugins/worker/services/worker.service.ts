import { Injectable } from "@nestjs/common";
import {
  ID,
  ListQueryBuilder,
  PaginatedList,
  RequestContext,
  TransactionalConnection,
  Order,
  OrderService,
  PasswordCipher,
} from "@vendure/core";
import { Worker } from "../entities/worker.entity";

@Injectable()
export class WorkerService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
    private orderService: OrderService,
    private passwordCipher: PasswordCipher,
  ) {}

  findAll(
    ctx: RequestContext,
    options: any,
  ): Promise<PaginatedList<Worker>> {
    return this.listQueryBuilder
      .build(Worker, options, {
        ctx,
        where: { channelId: ctx.channelId },
      })
      .getManyAndCount()
      .then(([items, totalItems]) => ({
        items,
        totalItems,
      }));
  }

  findOne(ctx: RequestContext, id: ID): Promise<Worker | null> {
    return this.connection.getRepository(ctx, Worker).findOne({
      where: { id, channelId: ctx.channelId },
    });
  }

  async create(ctx: RequestContext, input: any): Promise<Worker> {
    const passwordHash = await this.passwordCipher.hash(input.password);
    const worker = new Worker({
      ...input,
      passwordHash,
      channel: ctx.channel,
      channelId: ctx.channelId,
    });
    return this.connection.getRepository(ctx, Worker).save(worker);
  }

  async update(ctx: RequestContext, input: any): Promise<Worker> {
    const worker = await this.connection.getEntityOrThrow(ctx, Worker, input.id, {
      where: { channelId: ctx.channelId },
    });
    if (input.password) {
      worker.passwordHash = await this.passwordCipher.hash(input.password);
    }
    const { password, ...updateData } = input;
    Object.assign(worker, updateData);
    return this.connection.getRepository(ctx, Worker).save(worker);
  }

  async delete(ctx: RequestContext, id: ID): Promise<any> {
    const worker = await this.connection.getEntityOrThrow(ctx, Worker, id, {
      where: { channelId: ctx.channelId },
    });
    await this.connection.getRepository(ctx, Worker).softRemove(worker);
    return {
      result: "DELETED",
    };
  }

  async assignCourierToOrder(
    ctx: RequestContext,
    orderId: ID,
    courierId: ID,
  ): Promise<Order> {
    const courier = await this.connection.getEntityOrThrow(ctx, Worker, courierId, {
      where: { channelId: ctx.channelId, role: "Courier" as any },
    });
    
    // We update the custom field
    const order = await this.orderService.updateCustomFields(ctx, orderId, {
      assignedCourierId: courierId,
    });

    return order;
  }

  async unassignCourierFromOrder(
    ctx: RequestContext,
    orderId: ID,
  ): Promise<Order> {
    const order = await this.orderService.updateCustomFields(ctx, orderId, {
      assignedCourierId: null,
    });
    return order;
  }
}
