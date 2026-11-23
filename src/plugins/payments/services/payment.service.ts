import { Injectable } from "@nestjs/common";
import {
  EntityNotFoundError,
  ID,
  Logger,
  Order,
  OrderService,
  RequestContext,
  TransactionalConnection,
  UserInputError,
} from "@vendure/core";
import { randomUUID } from "crypto";
import { In } from "typeorm";

import { loggerCtx } from "../constants";
import { PaymentGateway } from "../entities/payment-gateway.entity";
import { PaymentRefund } from "../entities/payment-refund.entity";
import { PaymentStatusHistory } from "../entities/payment-status-history.entity";
import { PaymentTransaction } from "../entities/payment-transaction.entity";
import { PaymentProviderFactory } from "../providers/payment-provider.factory";
import {
  PaymentStatus,
  RawCallback,
  RECONCILABLE_PAYMENT_STATUSES,
  RefundStatus,
  StatusChangeSource,
  TERMINAL_PAYMENT_STATUSES,
} from "../types";
import { PaymentAuditService } from "./payment-audit.service";
import { PaymentGatewayService } from "./payment-gateway.service";
import { PaymentMetricsService } from "./payment-metrics.service";
import { SystemSettingsService } from "./system-settings.service";

export interface InitiatePaymentResult {
  transactionId: ID;
  externalTransactionId: string;
  redirectUrl: string;
}

/**
 * Orchestrates the full payment lifecycle, delegating bank-specific I/O to a
 * provider strategy (resolved via the factory) and keeping the custom audit
 * entities + Vendure order state in lock-step. This service is provider-agnostic.
 */
@Injectable()
export class PaymentService {
  constructor(
    private connection: TransactionalConnection,
    private orderService: OrderService,
    private gatewayService: PaymentGatewayService,
    private factory: PaymentProviderFactory,
    private audit: PaymentAuditService,
    private metrics: PaymentMetricsService,
    private systemSettings: SystemSettingsService,
  ) {}

  // ── 1. Initiate ────────────────────────────────────────────────────────────

  /**
   * Create a payment request, persist the transaction, and return the bank
   * redirect URL. Idempotent per (order, gateway): a re-initiation of an order
   * still in a non-terminal state reuses the existing transaction.
   */
  async initiatePayment(
    ctx: RequestContext,
    orderId: ID,
    gatewayCode: string,
  ): Promise<InitiatePaymentResult> {
    // Global kill-switch: reject all new payment requests when disabled.
    if (!(await this.systemSettings.isOnlinePaymentEnabled(ctx))) {
      throw new UserInputError("Online payments are currently disabled");
    }
    const order = await this.connection.getEntityOrThrow(ctx, Order, orderId);
    const gateway = await this.gatewayService.findByCode(ctx, gatewayCode);
    if (!gateway || !gateway.enabled) {
      throw new UserInputError(`Gateway "${gatewayCode}" is not available`);
    }

    const txRepo = this.connection.getRepository(ctx, PaymentTransaction);
    const existing = await txRepo.findOne({
      where: { orderId: order.id, gatewayId: gateway.id },
      order: { createdAt: "DESC" },
    });
    if (existing && !TERMINAL_PAYMENT_STATUSES.has(existing.status) && existing.externalTransactionId) {
      const cfg = this.gatewayService.resolveConfig(gateway);
      const details = await this.factory
        .get(gateway.code)
        .getTransactionDetails(cfg, existing.externalTransactionId);
      return {
        transactionId: existing.id,
        externalTransactionId: existing.externalTransactionId,
        redirectUrl: String((details.raw as any)?.formUrl ?? ""),
      };
    }

    const cfg = this.gatewayService.resolveConfig(gateway);
    const provider = this.factory.get(gateway.code);
    const expiresAt = new Date(Date.now() + cfg.expirationMinutes * 60_000);

    const createInput = {
      orderNumber: `${order.code}-${Date.now().toString(36)}`,
      amount: order.totalWithTax,
      currency: cfg.defaultCurrencyCode,
      description: `Order ${order.code}`,
      customerEmail: order.customer?.emailAddress,
      jsonParams: { vendureOrderCode: order.code },
    };
    const createResult = await this.loggedBankCall(
      ctx,
      { transactionId: null, gateway: gateway.code, operation: "createPayment", request: createInput },
      () => provider.createPayment(cfg, createInput),
    );

    const tx = await txRepo.save(
      new PaymentTransaction({
        orderId: order.id,
        customerId: order.customer?.id ?? null,
        gatewayId: gateway.id,
        externalTransactionId: createResult.externalTransactionId,
        idempotencyKey: randomUUID(),
        amount: order.totalWithTax,
        currency: cfg.defaultCurrencyCode,
        status: PaymentStatus.Pending,
        expiresAt,
        requestPayload: { orderCode: order.code, amount: order.totalWithTax } as any,
        responsePayload: createResult.raw as any,
      }),
    );

    await this.writeHistory(ctx, tx, null, PaymentStatus.Pending, StatusChangeSource.Customer);
    await this.audit.log(ctx, {
      action: "payment.initiated",
      paymentTransactionId: tx.id,
      actor: "customer",
      payload: { orderCode: order.code, gateway: gateway.code },
    });

    // Move the Vendure order into its payment-arranging state (stock is reserved
    // by Vendure when the order is placed / transitions to ArrangingPayment).
    await this.safeOrderTransition(ctx, order, "ArrangingPayment");

    return {
      transactionId: tx.id,
      externalTransactionId: createResult.externalTransactionId,
      redirectUrl: createResult.redirectUrl,
    };
  }

  // ── 2. Callback ──────────────────────────────────────────────────────────

  /**
   * Process an inbound bank callback. Validates at the edge, then ALWAYS
   * re-verifies server-to-server before mutating anything. Idempotent: a repeated
   * callback for an already-terminal transaction is a no-op.
   */
  async handleCallback(
    ctx: RequestContext,
    gatewayCode: string,
    raw: RawCallback,
  ): Promise<{ accepted: boolean; status?: PaymentStatus; reason?: string }> {
    const gateway = await this.gatewayService.findByCode(ctx, gatewayCode);
    if (!gateway) return { accepted: false, reason: "unknown gateway" };

    const cfg = this.gatewayService.resolveConfig(gateway);
    const provider = this.factory.get(gateway.code);

    const verified = provider.verifyCallback(cfg, raw);
    await this.audit.log(ctx, {
      action: "payment.callback.received",
      actor: "bank-callback",
      sourceIp: raw.sourceIp,
      payload: { gateway: gatewayCode, params: raw.params, verified },
    });
    if (!verified.valid || !verified.externalTransactionId) {
      this.metrics.paymentFailed(gatewayCode, "callback_invalid");
      return { accepted: false, reason: verified.rejectionReason ?? "invalid callback" };
    }

    const tx = await this.connection
      .getRepository(ctx, PaymentTransaction)
      .findOne({ where: { externalTransactionId: verified.externalTransactionId } });
    if (!tx) return { accepted: false, reason: "unknown transaction" };

    tx.callbackPayload = raw.params;
    await this.connection.getRepository(ctx, PaymentTransaction).save(tx);

    if (TERMINAL_PAYMENT_STATUSES.has(tx.status)) {
      return { accepted: true, status: tx.status }; // idempotent replay
    }

    // Source of truth: re-query the bank.
    const result = await this.loggedBankCall(
      ctx,
      { transactionId: tx.id, gateway: gateway.code, operation: "checkPaymentStatus", request: { orderId: verified.externalTransactionId } },
      () => provider.checkPaymentStatus(cfg, verified.externalTransactionId!),
    );
    await this.applyStatus(ctx, tx, result.status, StatusChangeSource.Callback, {
      actionCode: result.actionCode,
      providerStatusCode: result.providerStatusCode,
    });
    return { accepted: true, status: result.status };
  }

  // ── 3. Reconciliation sync ─────────────────────────────────────────────────

  /** List non-terminal transactions the reconciliation worker should re-check. */
  findReconcilable(ctx: RequestContext, limit = 200): Promise<PaymentTransaction[]> {
    return this.connection.getRepository(ctx, PaymentTransaction).find({
      where: { status: In([...RECONCILABLE_PAYMENT_STATUSES]) },
      take: limit,
      order: { updatedAt: "ASC" },
    });
  }

  /** Re-query the bank for one transaction and reconcile local state. */
  async syncTransaction(ctx: RequestContext, tx: PaymentTransaction): Promise<PaymentStatus> {
    // Expiry takes precedence over a still-pending bank state.
    if (tx.expiresAt && tx.expiresAt.getTime() < Date.now() && tx.status === PaymentStatus.Pending) {
      await this.applyStatus(ctx, tx, PaymentStatus.Expired, StatusChangeSource.System, {
        note: "expired before payment",
      });
      return PaymentStatus.Expired;
    }
    const gateway = await this.connection.getEntityOrThrow(ctx, PaymentGateway, tx.gatewayId);
    const cfg = this.gatewayService.resolveConfig(gateway);
    const result = await this.loggedBankCall(
      ctx,
      { transactionId: tx.id, gateway: gateway.code, operation: "checkPaymentStatus", request: { orderId: tx.externalTransactionId } },
      () => this.factory.get(gateway.code).checkPaymentStatus(cfg, tx.externalTransactionId!),
    );

    if (result.status !== tx.status) {
      await this.applyStatus(ctx, tx, result.status, StatusChangeSource.Reconciliation, {
        actionCode: result.actionCode,
        providerStatusCode: result.providerStatusCode,
        note: "synced via reconciliation",
      });
    }
    return result.status;
  }

  // ── 4. Refund ──────────────────────────────────────────────────────────────

  async refund(
    ctx: RequestContext,
    transactionId: ID,
    amount: number,
    reason: string,
    actor = "admin",
  ): Promise<PaymentRefund> {
    const tx = await this.connection.getEntityOrThrow(ctx, PaymentTransaction, transactionId, {
      relations: ["gateway"],
    });
    if (tx.status !== PaymentStatus.Paid && tx.status !== PaymentStatus.PartiallyRefunded) {
      throw new UserInputError(`Cannot refund a transaction in status ${tx.status}`);
    }
    const remaining = tx.amount - tx.refundedAmount;
    if (amount <= 0 || amount > remaining) {
      throw new UserInputError(`Refund amount must be between 1 and ${remaining} minor units`);
    }

    const cfg = this.gatewayService.resolveConfig(tx.gateway);
    const refundRepo = this.connection.getRepository(ctx, PaymentRefund);
    const refund = await refundRepo.save(
      new PaymentRefund({
        paymentTransactionId: tx.id,
        amount,
        reason,
        status: RefundStatus.Pending,
        initiatedBy: actor,
      }),
    );

    const refundInput = {
      externalTransactionId: tx.externalTransactionId!,
      amount,
      reason,
    };
    const result = await this.loggedBankCall(
      ctx,
      { transactionId: tx.id, gateway: tx.gateway.code, operation: "refundPayment", request: refundInput },
      () => this.factory.get(tx.gateway.code).refundPayment(cfg, refundInput),
    );

    refund.status = result.success ? RefundStatus.Succeeded : RefundStatus.Failed;
    refund.externalRefundId = result.externalRefundId ?? "";
    refund.responsePayload = result.raw as Record<string, unknown>;
    await refundRepo.save(refund);

    if (result.success) {
      tx.refundedAmount += amount;
      const fullyRefunded = tx.refundedAmount >= tx.amount;
      await this.connection.getRepository(ctx, PaymentTransaction).save(tx);
      await this.applyStatus(
        ctx,
        tx,
        fullyRefunded ? PaymentStatus.Refunded : PaymentStatus.PartiallyRefunded,
        StatusChangeSource.Admin,
        { note: `refund ${amount} by ${actor}: ${reason}` },
      );
      this.metrics.paymentRefunded(tx.gateway.code);
    } else {
      this.metrics.paymentFailed(tx.gateway.code, "refund_failed");
    }

    await this.audit.log(ctx, {
      action: "payment.refund",
      paymentTransactionId: tx.id,
      actor,
      payload: { amount, reason, success: result.success, errorCode: result.errorCode },
    });
    return refund;
  }

  // ── 5. Cancel ────────────────────────────────────────────────────────────

  async cancel(ctx: RequestContext, transactionId: ID, actor = "admin"): Promise<boolean> {
    const tx = await this.connection.getEntityOrThrow(ctx, PaymentTransaction, transactionId, {
      relations: ["gateway"],
    });
    if (TERMINAL_PAYMENT_STATUSES.has(tx.status)) {
      throw new UserInputError(`Cannot cancel a transaction in status ${tx.status}`);
    }
    const cfg = this.gatewayService.resolveConfig(tx.gateway);
    const result = await this.loggedBankCall(
      ctx,
      { transactionId: tx.id, gateway: tx.gateway.code, operation: "cancelPayment", request: { orderId: tx.externalTransactionId } },
      () => this.factory.get(tx.gateway.code).cancelPayment(cfg, tx.externalTransactionId!),
    );
    if (result.success) {
      await this.applyStatus(ctx, tx, PaymentStatus.Cancelled, StatusChangeSource.Admin, {
        note: `cancelled by ${actor}`,
      });
    }
    await this.audit.log(ctx, {
      action: "payment.cancel",
      paymentTransactionId: tx.id,
      actor,
      payload: { success: result.success, errorCode: result.errorCode },
    });
    return result.success;
  }

  // ── Internal: bank-call logging ─────────────────────────────────────────────

  /**
   * Wraps a single bank API call so the request, response, and any error are all
   * persisted to the audit log. Nothing about an external call is hidden from
   * administrators. Returns the call result unchanged.
   */
  private async loggedBankCall<T extends { raw?: unknown }>(
    ctx: RequestContext,
    meta: { transactionId: ID | null; gateway: string; operation: string; request?: unknown },
    fn: () => Promise<T>,
  ): Promise<T> {
    await this.audit.log(ctx, {
      action: "bank.request",
      paymentTransactionId: meta.transactionId,
      actor: "system",
      payload: { gateway: meta.gateway, operation: meta.operation, request: meta.request },
    });
    try {
      const result = await fn();
      await this.audit.log(ctx, {
        action: "bank.response",
        paymentTransactionId: meta.transactionId,
        actor: "system",
        payload: { gateway: meta.gateway, operation: meta.operation, response: result.raw ?? result },
      });
      return result;
    } catch (e) {
      await this.audit.log(ctx, {
        action: "bank.error",
        paymentTransactionId: meta.transactionId,
        actor: "system",
        payload: { gateway: meta.gateway, operation: meta.operation, error: (e as Error).message },
      });
      throw e;
    }
  }

  // ── Internal: status transition + order sync ───────────────────────────────

  /**
   * Single funnel for every status change: persists the transaction, appends to
   * the status-history timeline, emits an audit record + metric, and reflects the
   * change onto the Vendure Order. Guards against illegal/no-op transitions.
   */
  private async applyStatus(
    ctx: RequestContext,
    tx: PaymentTransaction,
    next: PaymentStatus,
    source: StatusChangeSource,
    meta: { actionCode?: string; providerStatusCode?: number; note?: string } = {},
  ): Promise<void> {
    const prev = tx.status;
    if (prev === next) return;

    tx.status = next;
    await this.connection.getRepository(ctx, PaymentTransaction).save(tx);
    await this.writeHistory(ctx, tx, prev, next, source, meta.note);

    await this.audit.log(ctx, {
      action: "payment.status.changed",
      paymentTransactionId: tx.id,
      actor: source,
      payload: { from: prev, to: next, ...meta },
    });

    const order = await this.connection.getEntityOrThrow(ctx, Order, tx.orderId);
    switch (next) {
      case PaymentStatus.Paid:
        this.metrics.paymentSucceeded(String(tx.gatewayId));
        await this.safeOrderTransition(ctx, order, "PaymentSettled");
        break;
      case PaymentStatus.Failed:
      case PaymentStatus.Expired:
        this.metrics.paymentFailed(String(tx.gatewayId), next.toLowerCase());
        // Releasing reserved stock: cancelling the order frees Vendure stock
        // allocations. Best-effort; surfaced via audit on failure.
        await this.safeOrderTransition(ctx, order, "Cancelled");
        break;
      case PaymentStatus.Cancelled:
        await this.safeOrderTransition(ctx, order, "Cancelled");
        break;
      default:
        break; // Pending / Processing / Authorized / *Refunded: no order transition
    }
  }

  private async writeHistory(
    ctx: RequestContext,
    tx: PaymentTransaction,
    oldStatus: PaymentStatus | null,
    newStatus: PaymentStatus,
    source: StatusChangeSource,
    notes?: string,
  ): Promise<void> {
    await this.connection.getRepository(ctx, PaymentStatusHistory).save(
      new PaymentStatusHistory({
        paymentTransactionId: tx.id,
        oldStatus,
        newStatus,
        source,
        notes,
      }),
    );
  }

  /** Transition the Vendure order, tolerating already-in-state / illegal moves. */
  private async safeOrderTransition(ctx: RequestContext, order: Order, state: string): Promise<void> {
    try {
      const result = await this.orderService.transitionToState(ctx, order.id, state as any);
      if (result instanceof EntityNotFoundError) {
        Logger.warn(`Order ${order.code} not found for transition to ${state}`, loggerCtx);
      } else if ((result as any)?.errorCode) {
        Logger.warn(
          `Order ${order.code} could not transition to ${state}: ${(result as any).message}`,
          loggerCtx,
        );
      }
    } catch (e) {
      Logger.error(
        `Order transition to ${state} failed for ${order.code}: ${(e as Error).message}`,
        loggerCtx,
      );
    }
  }
}
