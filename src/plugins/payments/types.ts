/**
 * Domain types for the Payments plugin.
 *
 * The canonical (provider-agnostic) request/response DTOs live here so that the
 * core PaymentService never depends on any one bank's wire format. Each provider
 * strategy is responsible for translating between these canonical shapes and the
 * bank's SmartVista payload.
 */

/**
 * Internal, provider-agnostic payment lifecycle. This is the single source of
 * truth for transaction state and is deliberately decoupled from both the bank's
 * numeric `orderStatus` and Vendure's own Order state machine.
 */
export enum PaymentStatus {
  Pending = "Pending",
  Processing = "Processing",
  Authorized = "Authorized",
  Paid = "Paid",
  Failed = "Failed",
  Cancelled = "Cancelled",
  Refunded = "Refunded",
  PartiallyRefunded = "PartiallyRefunded",
  Expired = "Expired",
}

/** Terminal states no longer touched by the reconciliation worker. */
export const TERMINAL_PAYMENT_STATUSES: ReadonlySet<PaymentStatus> = new Set([
  PaymentStatus.Paid,
  PaymentStatus.Failed,
  PaymentStatus.Cancelled,
  PaymentStatus.Refunded,
  PaymentStatus.Expired,
]);

/** States the reconciliation worker actively polls the bank about. */
export const RECONCILABLE_PAYMENT_STATUSES: ReadonlyArray<PaymentStatus> = [
  PaymentStatus.Pending,
  PaymentStatus.Processing,
  PaymentStatus.Authorized,
];

export enum RefundStatus {
  Pending = "Pending",
  Succeeded = "Succeeded",
  Failed = "Failed",
}

/** Who triggered a status transition — used for the audit trail. */
export enum StatusChangeSource {
  Callback = "callback",
  Reconciliation = "reconciliation",
  Admin = "admin",
  System = "system",
  Customer = "customer",
}

/**
 * Resolved, decrypted runtime configuration for a single gateway. Built by the
 * PaymentGatewayService from the persisted (encrypted) PaymentGateway entity and
 * handed to a provider strategy. Secrets never leave this in-memory object.
 */
export interface ResolvedGatewayConfig {
  gatewayId: string;
  code: string;
  name: string;
  /** e.g. https://epg.halkbank.tm */
  baseUrl: string;
  /** REST base path; differs per SmartVista deployment ("/payment/rest/" | "/epg/rest/"). */
  basePath: string;
  userName: string;
  password: string;
  /** ISO-4217 numeric default currency (934 = TMT). */
  defaultCurrencyCode: string;
  /** Optional shared secret for HMAC validation of dynamic callbacks. */
  callbackSecret?: string;
  /** CIDR/IP entries permitted to hit the callback endpoint. Empty = no IP filter. */
  ipWhitelist: string[];
  /** Two-phase (preauth + deposit) vs one-phase capture. */
  twoPhase: boolean;
  /** Per-request timeout in ms. */
  timeoutMs: number;
  /** Order lifespan before auto-expiry (minutes). */
  expirationMinutes: number;
  /** returnUrl the bank redirects the customer back to after the hosted page. */
  returnUrl: string;
  /** Optional bank-specific extras kept as opaque JSON. */
  extra?: Record<string, unknown>;
}

// ─── Canonical provider DTOs ────────────────────────────────────────────────

export interface CreatePaymentInput {
  /** Merchant-side unique order number (we use Vendure order code). */
  orderNumber: string;
  /** Amount in minor units (e.g. tenge). */
  amount: number;
  /** ISO-4217 numeric currency code. */
  currency: string;
  description?: string;
  /** ISO 639-1 language for bank-side error messages / hosted page. */
  language?: string;
  customerEmail?: string;
  customerPhone?: string;
  /** Extra key/values forwarded into SmartVista jsonParams[]. */
  jsonParams?: Record<string, string>;
}

export interface CreatePaymentResult {
  /** Bank-generated order id (SmartVista `orderId` / `mdOrder`). */
  externalTransactionId: string;
  /** Hosted payment page the customer must be redirected to. */
  redirectUrl: string;
  raw: unknown;
}

export interface PaymentStatusResult {
  externalTransactionId: string;
  status: PaymentStatus;
  /** Bank's raw numeric order status, retained for auditing. */
  providerStatusCode?: number;
  /** Authorization / decline action code from the processor. */
  actionCode?: string;
  actionCodeDescription?: string;
  amount?: number;
  currency?: string;
  raw: unknown;
}

export interface RefundInput {
  externalTransactionId: string;
  /** Amount in minor units to refund. */
  amount: number;
  reason?: string;
}

export interface RefundResult {
  success: boolean;
  externalRefundId?: string;
  errorCode?: string;
  errorMessage?: string;
  raw: unknown;
}

export interface CancelResult {
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  raw: unknown;
}

/**
 * Raw inbound callback as received at the HTTP edge, normalised into a single
 * shape before being handed to a provider strategy for verification.
 */
export interface RawCallback {
  /** Merged query + body params. */
  params: Record<string, string>;
  rawBody: string;
  headers: Record<string, string | string[] | undefined>;
  sourceIp: string;
}

export interface VerifiedCallback {
  valid: boolean;
  externalTransactionId?: string;
  /** Reason a callback was rejected (signature/timestamp/replay/ip). */
  rejectionReason?: string;
}

/** Plugin init options. */
export interface PaymentsPluginOptions {
  /**
   * Env var name holding the 32-byte (hex/base64) master key used for
   * AES-256-GCM credential encryption at rest.
   */
  encryptionKeyEnvVar?: string;
  /** Override the default 15-minute expiration. */
  defaultExpirationMinutes?: number;
  /** Enable Prometheus metric collection. */
  enableMetrics?: boolean;
}
