import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  EventBus,
  OrderPlacedEvent,
  RequestContext,
  TransactionalConnection,
  ID,
  Logger,
} from '@vendure/core';
import { BoughtTogetherEntity } from '../entities/bought-together.entity';

@Injectable()
export class BoughtTogetherService implements OnModuleInit {
  constructor(
    private connection: TransactionalConnection,
    private eventBus: EventBus,
  ) {}

  onModuleInit() {
    this.eventBus.ofType(OrderPlacedEvent).subscribe(async (event) => {
      try {
        await this.processOrder(event.ctx, event.order);
      } catch (err: any) {
        Logger.error(`Failed to process bought together for order ${event.order.id}: ${err.message}`, 'BoughtTogetherService');
      }
    });
  }

  private async processOrder(ctx: RequestContext, order: any): Promise<void> {
    const productIds = [
      ...new Set(
        order.lines
          .filter((line: any) => line.productVariant && line.productVariant.productId)
          .map((line: any) => line.productVariant.productId)
      ),
    ] as ID[];

    if (productIds.length < 2) return;

    const pairs = this.generatePairs(productIds);
    const channelId = ctx.channelId;

    for (const [p1, p2] of pairs) {
      await this.recordPair(ctx, p1, p2, channelId);
      await this.recordPair(ctx, p2, p1, channelId);
    }
  }

  private generatePairs(ids: ID[]): [ID, ID][] {
    const pairs: [ID, ID][] = [];
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        pairs.push([ids[i], ids[j]]);
      }
    }
    return pairs;
  }

  private async recordPair(
    ctx: RequestContext,
    productId: ID,
    relatedProductId: ID,
    channelId: ID,
  ): Promise<void> {
    const qb = this.connection
      .getRepository(ctx, BoughtTogetherEntity)
      .createQueryBuilder('bt');

    // Atomic Upsert (PostgreSQL style)
    await qb
      .insert()
      .values({
        productId: Number(productId),
        relatedProductId: Number(relatedProductId),
        channelId: Number(channelId),
        count: 1,
      })
      .onConflict(
        '("productId", "relatedProductId", "channelId") DO UPDATE SET count = bt.count + 1, "updatedAt" = NOW()'
      )
      .execute();
  }

  async getBoughtTogether(
    ctx: RequestContext,
    productId: ID,
    limit: number = 10,
  ): Promise<BoughtTogetherEntity[]> {
    return this.connection.getRepository(ctx, BoughtTogetherEntity).find({
      where: {
        productId: Number(productId) as any,
        channelId: Number(ctx.channelId) as any,
      },
      order: { count: 'DESC' },
      take: limit,
    });
  }
}
