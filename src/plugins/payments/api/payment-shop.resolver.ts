import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import {
  ActiveOrderService,
  Allow,
  Ctx,
  ID,
  Order,
  Permission,
  RequestContext,
  TransactionalConnection,
  UserInputError,
} from "@vendure/core";
import { PaymentGateway } from "../entities/payment-gateway.entity";
import { PaymentTransaction } from "../entities/payment-transaction.entity";
import { PaymentStatus } from "../types";
import { PaymentGatewayService } from "../services/payment-gateway.service";
import { PaymentService } from "../services/payment.service";
import { SystemSettingsService } from "../services/system-settings.service";

@Resolver()
export class PaymentShopResolver {
  constructor(
    private paymentService: PaymentService,
    private gatewayService: PaymentGatewayService,
    private systemSettings: SystemSettingsService,
    private activeOrderService: ActiveOrderService,
    private connection: TransactionalConnection,
  ) {}

  @Query()
  @Allow(Permission.Public)
  async availablePaymentGateways(@Ctx() ctx: RequestContext) {
    const onlinePaymentEnabled = await this.systemSettings.isOnlinePaymentEnabled(ctx);
    // Master switch off => return no gateways so the storefront hides everything.
    if (!onlinePaymentEnabled) {
      return { onlinePaymentEnabled: false, gateways: [] };
    }
    const gateways = await this.gatewayService.findEnabled(ctx);
    return {
      onlinePaymentEnabled: true,
      gateways: gateways.map((g) => ({ code: g.code, name: g.name })),
    };
  }

  @Mutation()
  @Allow(Permission.Owner)
  async initiatePayment(
    @Ctx() ctx: RequestContext,
    @Args() args: { gatewayCode: string },
  ) {
    const order = await this.activeOrderService.getActiveOrder(ctx, undefined);
    if (!order) throw new UserInputError("No active order");
    return this.paymentService.initiatePayment(ctx, order.id, args.gatewayCode);
  }

  @Mutation()
  @Allow(Permission.Owner)
  async retryPayment(
    @Ctx() ctx: RequestContext,
    @Args() args: { gatewayCode: string },
  ) {
    // A retry is a fresh initiation against the active order; initiatePayment
    // creates a new transaction when the prior one is terminal.
    const order = await this.activeOrderService.getActiveOrder(ctx, undefined);
    if (!order) throw new UserInputError("No active order");
    return this.paymentService.initiatePayment(ctx, order.id, args.gatewayCode);
  }

  @Query()
  @Allow(Permission.Owner)
  async paymentStatus(
    @Ctx() ctx: RequestContext,
    @Args() args: { transactionId: ID },
  ) {
    const tx = await this.connection
      .getRepository(ctx, PaymentTransaction)
      .findOne({ where: { id: args.transactionId } });
    if (!tx) return null;
    const order = await this.connection.getEntityOrThrow(ctx, Order, tx.orderId);
    return {
      transactionId: tx.id,
      orderCode: order.code,
      status: tx.status,
      amount: tx.amount,
      currency: tx.currency,
      externalTransactionId: tx.externalTransactionId,
      paidAt: tx.status === PaymentStatus.Paid ? tx.updatedAt : null,
    };
  }
}
