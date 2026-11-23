import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  Customer,
  ID,
  ListQueryOptions,
  Order,
  RequestContext,
  TransactionalConnection,
} from "@vendure/core";
import { PaymentAuditLog } from "../entities/payment-audit-log.entity";
import { PaymentGateway } from "../entities/payment-gateway.entity";
import { PaymentRefund } from "../entities/payment-refund.entity";
import { PaymentTransaction } from "../entities/payment-transaction.entity";
import { paymentPermission } from "../permissions";
import { PaymentProviderFactory } from "../providers/payment-provider.factory";
import { PaymentGatewayService } from "../services/payment-gateway.service";
import { PaymentQueryService } from "../services/payment-query.service";
import { PaymentReconciliationService } from "../services/payment-reconciliation.service";
import { PaymentReportService } from "../services/payment-report.service";
import { PaymentService } from "../services/payment.service";
import { SystemSettingsService } from "../services/system-settings.service";

@Resolver()
export class PaymentAdminResolver {
  constructor(
    private connection: TransactionalConnection,
    private paymentService: PaymentService,
    private gatewayService: PaymentGatewayService,
    private queryService: PaymentQueryService,
    private reportService: PaymentReportService,
    private reconciliation: PaymentReconciliationService,
    private systemSettings: SystemSettingsService,
    private factory: PaymentProviderFactory,
  ) {}

  // ── Transactions ──────────────────────────────────────────────────────────

  @Query()
  @Allow(paymentPermission.Read)
  paymentTransactions(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: ListQueryOptions<PaymentTransaction> },
  ) {
    return this.queryService.transactions(ctx, args.options);
  }

  @Query()
  @Allow(paymentPermission.Read)
  paymentTransaction(@Ctx() ctx: RequestContext, @Args() args: { id: ID }) {
    return this.queryService.transaction(ctx, args.id);
  }

  @Query()
  @Allow(paymentPermission.Read)
  paymentTransactionsForOrder(@Ctx() ctx: RequestContext, @Args() args: { orderId: ID }) {
    return this.queryService.transactionsForOrder(ctx, args.orderId);
  }

  @Query()
  @Allow(paymentPermission.Read)
  paymentRefunds(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: ListQueryOptions<PaymentRefund> },
  ) {
    return this.queryService.refunds(ctx, args.options);
  }

  @Query()
  @Allow(paymentPermission.Read)
  paymentAuditLogs(
    @Ctx() ctx: RequestContext,
    @Args() args: { options?: ListQueryOptions<PaymentAuditLog> },
  ) {
    return this.queryService.auditLogs(ctx, args.options);
  }

  // ── Gateways ───────────────────────────────────────────────────────────────

  @Query()
  @Allow(paymentPermission.Read)
  async paymentGateways(@Ctx() ctx: RequestContext) {
    const gateways = await this.gatewayService.findAll(ctx);
    // Never expose the encrypted credentials blob over the API.
    return gateways.map((g) => ({
      id: g.id,
      name: g.name,
      code: g.code,
      enabled: g.enabled,
      displayOrder: g.displayOrder,
      configuration: g.configuration,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
    }));
  }

  @Query()
  @Allow(paymentPermission.Read)
  async systemPaymentSettings(@Ctx() ctx: RequestContext) {
    const s = await this.systemSettings.get(ctx);
    return { onlinePaymentEnabled: s.onlinePaymentEnabled };
  }

  @Mutation()
  @Allow(paymentPermission.Update)
  async setOnlinePaymentEnabled(@Ctx() ctx: RequestContext, @Args() args: { enabled: boolean }) {
    const s = await this.systemSettings.setOnlinePaymentEnabled(ctx, args.enabled);
    return { onlinePaymentEnabled: s.onlinePaymentEnabled };
  }

  @Mutation()
  @Allow(paymentPermission.Update)
  async setPaymentGatewayEnabled(
    @Ctx() ctx: RequestContext,
    @Args() args: { code: string; enabled: boolean },
  ) {
    const g = await this.gatewayService.setEnabled(ctx, args.code, args.enabled);
    return { ...g, configuration: g.configuration };
  }

  @Mutation()
  @Allow(paymentPermission.Update)
  async reorderPaymentGateways(@Ctx() ctx: RequestContext, @Args() args: { orderedCodes: string[] }) {
    const gateways = await this.gatewayService.reorder(ctx, args.orderedCodes);
    return gateways.map((g) => ({ ...g, configuration: g.configuration }));
  }

  @Mutation()
  @Allow(paymentPermission.Update)
  async testPaymentGatewayConnection(@Ctx() ctx: RequestContext, @Args() args: { code: string }) {
    const gateway = await this.gatewayService.findByCode(ctx, args.code);
    if (!gateway) return { ok: false, message: `Unknown gateway "${args.code}"` };
    const cfg = this.gatewayService.resolveConfig(gateway);
    return this.factory.get(gateway.code).testConnection(cfg);
  }

  @Mutation()
  @Allow(paymentPermission.Create)
  async createPaymentGateway(@Ctx() ctx: RequestContext, @Args() args: { input: any }) {
    const g = await this.gatewayService.create(ctx, args.input);
    return { ...g, configuration: g.configuration };
  }

  @Mutation()
  @Allow(paymentPermission.Update)
  async updatePaymentGateway(@Ctx() ctx: RequestContext, @Args() args: { input: any }) {
    const g = await this.gatewayService.update(ctx, args.input.id, args.input);
    return { ...g, configuration: g.configuration };
  }

  // ── Refund / cancel / reconcile ─────────────────────────────────────────────

  @Mutation()
  @Allow(paymentPermission.Update)
  async refundPaymentTransaction(
    @Ctx() ctx: RequestContext,
    @Args() args: { transactionId: ID; amount: number; reason: string },
  ) {
    const actor = ctx.activeUserId ? `admin:${ctx.activeUserId}` : "admin";
    return this.paymentService.refund(ctx, args.transactionId, args.amount, args.reason, actor);
  }

  @Mutation()
  @Allow(paymentPermission.Update)
  async cancelPaymentTransaction(@Ctx() ctx: RequestContext, @Args() args: { transactionId: ID }) {
    const actor = ctx.activeUserId ? `admin:${ctx.activeUserId}` : "admin";
    return this.paymentService.cancel(ctx, args.transactionId, actor);
  }

  @Mutation()
  @Allow(paymentPermission.Update)
  async verifyPayment(@Ctx() ctx: RequestContext, @Args() args: { transactionId: ID }) {
    const tx = await this.connection.getEntityOrThrow(ctx, PaymentTransaction, args.transactionId, {
      relations: ["gateway"],
    });
    return this.paymentService.syncTransaction(ctx, tx);
  }

  @Mutation()
  @Allow(paymentPermission.Update)
  async reconcilePayments(@Ctx() ctx: RequestContext) {
    await this.reconciliation.reconcileAll(ctx);
    return true;
  }

  @Mutation()
  @Allow(paymentPermission.Update)
  async runPaymentReconciliation(@Ctx() ctx: RequestContext) {
    await this.reconciliation.reconcileAll(ctx);
    return true;
  }

  // ── Reports ─────────────────────────────────────────────────────────────────

  @Query()
  @Allow(paymentPermission.Read)
  async paymentKpis(
    @Ctx() ctx: RequestContext,
    @Args() args: { dateFrom?: string; dateTo?: string },
  ) {
    return this.reportService.kpis(
      ctx,
      args.dateFrom ? new Date(args.dateFrom) : undefined,
      args.dateTo ? new Date(args.dateTo) : undefined,
    );
  }

}

/**
 * Field resolvers for the PaymentTransaction GraphQL type. Computed fields
 * (order code, customer email, gateway code/name, history, refunds) are resolved
 * lazily so list queries stay cheap and only fetch what the client selects.
 */
@Resolver("PaymentTransaction")
export class PaymentTransactionEntityResolver {
  constructor(
    private connection: TransactionalConnection,
    private queryService: PaymentQueryService,
  ) {}

  @ResolveField()
  async orderCode(@Ctx() ctx: RequestContext, @Parent() tx: PaymentTransaction) {
    const order = await this.connection
      .getRepository(ctx, Order)
      .findOne({ where: { id: tx.orderId } });
    return order?.code ?? "";
  }

  @ResolveField()
  async customerEmail(@Ctx() ctx: RequestContext, @Parent() tx: PaymentTransaction) {
    if (!tx.customerId) return null;
    const customer = await this.connection
      .getRepository(ctx, Customer)
      .findOne({ where: { id: tx.customerId } });
    return customer?.emailAddress ?? null;
  }

  @ResolveField()
  async gatewayCode(@Ctx() ctx: RequestContext, @Parent() tx: PaymentTransaction) {
    return (await this.resolveGateway(ctx, tx))?.code ?? "";
  }

  @ResolveField()
  async gatewayName(@Ctx() ctx: RequestContext, @Parent() tx: PaymentTransaction) {
    return (await this.resolveGateway(ctx, tx))?.name ?? "";
  }

  private resolveGateway(ctx: RequestContext, tx: PaymentTransaction) {
    return tx.gateway
      ? Promise.resolve(tx.gateway)
      : this.connection.getRepository(ctx, PaymentGateway).findOne({ where: { id: tx.gatewayId } });
  }

  @ResolveField()
  history(@Ctx() ctx: RequestContext, @Parent() tx: PaymentTransaction) {
    return this.queryService.history(ctx, tx.id);
  }

  @ResolveField()
  refunds(@Ctx() ctx: RequestContext, @Parent() tx: PaymentTransaction) {
    return this.queryService.refundsForTransaction(ctx, tx.id);
  }
}
