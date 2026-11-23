import { Injectable } from "@nestjs/common";
import { Order, TransactionalConnection, RequestContext } from "@vendure/core";

@Injectable()
export class OrderLinesCacheService {
  private ctxCache = new WeakMap<RequestContext, Promise<Order | null>>();

  constructor(private connection: TransactionalConnection) {}

  async getOrderWithLines(ctx: RequestContext): Promise<Order | null> {
    const activeOrderId = (ctx.session as any)?.activeOrderId;
    if (!activeOrderId) return null;

    if (!this.ctxCache.has(ctx)) {
      const promise = this.connection
        .getRepository(ctx, Order)
        .findOne({
          where: { id: activeOrderId },
          relations: [
            "lines",
            "lines.productVariant",
            "lines.productVariant.product",
          ],
        })
        .then((order) => order ?? null);

      this.ctxCache.set(ctx, promise);
    }

    return this.ctxCache.get(ctx)!;
  }

  getQuantityForProduct(
    order: Order | null,
    productId: string | number,
  ): number {
    if (!order?.lines) return 0;
    return order.lines.reduce((sum, line) => {
      if (
        line.productVariant?.product?.id?.toString() === productId.toString()
      ) {
        return sum + line.quantity;
      }
      return sum;
    }, 0);
  }
}
