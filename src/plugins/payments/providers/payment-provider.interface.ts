import {
  CancelResult,
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentStatusResult,
  RawCallback,
  RefundInput,
  RefundResult,
  ResolvedGatewayConfig,
  VerifiedCallback,
} from "../types";

/**
 * Strategy contract every bank integration must satisfy.
 *
 * The core PaymentService depends only on this interface — never on a concrete
 * bank — so swapping, adding, or A/B-testing providers requires no change to the
 * orchestration layer. A provider is a stateless strategy: the per-merchant
 * secrets/URLs arrive as a `ResolvedGatewayConfig` argument on every call, which
 * keeps a single provider instance safe to share across all gateways of that
 * brand and trivially unit-testable.
 */
export interface PaymentProviderInterface {
  /** Stable code matching `PaymentGateway.code`; used by the factory for lookup. */
  readonly code: string;

  /** Register an order with the bank and obtain the hosted-page redirect URL. */
  createPayment(
    config: ResolvedGatewayConfig,
    input: CreatePaymentInput,
  ): Promise<CreatePaymentResult>;

  /** Authoritative server-to-server status check (the source of truth). */
  checkPaymentStatus(
    config: ResolvedGatewayConfig,
    externalTransactionId: string,
  ): Promise<PaymentStatusResult>;

  /** Full or partial refund of a settled payment. */
  refundPayment(
    config: ResolvedGatewayConfig,
    input: RefundInput,
  ): Promise<RefundResult>;

  /** Cancel / void / reverse an authorisation that has not yet settled. */
  cancelPayment(
    config: ResolvedGatewayConfig,
    externalTransactionId: string,
  ): Promise<CancelResult>;

  /**
   * Validate an inbound callback at the edge: signature/HMAC, timestamp and IP.
   * This is a cheap gate — the caller MUST still re-verify via checkPaymentStatus
   * before mutating any order, because the browser return is not inherently trusted.
   */
  verifyCallback(
    config: ResolvedGatewayConfig,
    callback: RawCallback,
  ): VerifiedCallback;

  /** Rich, audit-oriented snapshot of the transaction as the bank sees it. */
  getTransactionDetails(
    config: ResolvedGatewayConfig,
    externalTransactionId: string,
  ): Promise<PaymentStatusResult>;

  /**
   * Connectivity + credential probe for the admin "Test connection" action.
   * Returns ok=true if the bank responds to an authenticated request (even with
   * a business error such as "unknown order"), distinguishing config/auth/network
   * failures from a healthy endpoint.
   */
  testConnection(config: ResolvedGatewayConfig): Promise<TestConnectionResult>;
}

export interface TestConnectionResult {
  ok: boolean;
  message: string;
}
