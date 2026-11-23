import { Logger } from "@vendure/core";
import { createHmac, timingSafeEqual } from "crypto";
import { URLSearchParams } from "url";

import { CALLBACK_TIMESTAMP_TOLERANCE_MS, loggerCtx } from "../constants";
import {
  CancelResult,
  CreatePaymentInput,
  CreatePaymentResult,
  PaymentStatus,
  PaymentStatusResult,
  RawCallback,
  RefundInput,
  RefundResult,
  ResolvedGatewayConfig,
  VerifiedCallback,
} from "../types";
import {
  PaymentProviderInterface,
  TestConnectionResult,
} from "./payment-provider.interface";

/**
 * Shared implementation of the BPC SmartVista E-commerce Payment Gateway (EPG)
 * REST protocol.
 *
 * Halkbank, Turkmenturk and Rysgal all run SmartVista, so ~95% of the logic
 * lives here. A concrete bank only needs to declare its `code` and, where a
 * deployment quirk exists, override one of the small protected hooks below
 * (endpoint path, field casing, status mapping). That is the whole cost of
 * onboarding the 4th, 5th or 10th bank.
 *
 * SmartVista endpoints used:
 *   register.do / registerPreAuth.do  -> { orderId, formUrl, errorCode }
 *   getOrderStatusExtended.do         -> { orderStatus, actionCode, amount, ... }
 *   refund.do                         -> { errorCode, errorMessage }
 *   reverse.do                        -> { errorCode, errorMessage }
 */
export abstract class SmartVistaBaseProvider implements PaymentProviderInterface {
  abstract readonly code: string;

  // ── Endpoint hooks (override per deployment if the path differs) ──────────
  protected registerEndpoint(config: ResolvedGatewayConfig): string {
    return config.twoPhase ? "registerPreAuth.do" : "register.do";
  }
  protected statusEndpoint(): string {
    return "getOrderStatusExtended.do";
  }
  protected refundEndpoint(): string {
    return "refund.do";
  }
  protected reverseEndpoint(): string {
    return "reverse.do";
  }

  // ── Status mapping hook (override if a bank deviates) ─────────────────────
  /**
   * Map SmartVista numeric `orderStatus` to our internal lifecycle.
   *  0 registered/not paid · 1 preauth hold · 2 deposited · 3 reversed
   *  4 refunded · 5 auth initiated via ACS (3DS) · 6 declined
   */
  protected mapOrderStatus(orderStatus: number | undefined): PaymentStatus {
    switch (orderStatus) {
      case 0:
        return PaymentStatus.Pending;
      case 1:
        return PaymentStatus.Authorized;
      case 2:
        return PaymentStatus.Paid;
      case 3:
        return PaymentStatus.Cancelled;
      case 4:
        return PaymentStatus.Refunded;
      case 5:
        return PaymentStatus.Processing;
      case 6:
        return PaymentStatus.Failed;
      default:
        return PaymentStatus.Pending;
    }
  }

  // ── PaymentProviderInterface implementation ───────────────────────────────

  async createPayment(
    config: ResolvedGatewayConfig,
    input: CreatePaymentInput,
  ): Promise<CreatePaymentResult> {
    const body: Record<string, string> = {
      orderNumber: input.orderNumber,
      amount: String(input.amount),
      currency: input.currency || config.defaultCurrencyCode,
      returnUrl: config.returnUrl,
      sessionTimeoutSecs: String(config.expirationMinutes * 60),
    };
    if (input.description) body.description = input.description;
    if (input.language) body.language = input.language;
    if (input.customerEmail) body.email = input.customerEmail;
    if (input.customerPhone) body.phone = input.customerPhone;
    if (input.jsonParams) body["jsonParams"] = JSON.stringify(input.jsonParams);

    const raw = await this.call(config, this.registerEndpoint(config), body);
    const errorCode = String(raw.errorCode ?? raw.ErrorCode ?? "0");
    const externalTransactionId = String(raw.orderId ?? raw.mdOrder ?? "");
    const redirectUrl = String(raw.formUrl ?? "");

    if (errorCode !== "0" || !externalTransactionId || !redirectUrl) {
      throw new Error(
        `[${this.code}] register failed: code=${errorCode} msg=${
          raw.errorMessage ?? raw.ErrorMessage ?? "unknown"
        }`,
      );
    }
    return { externalTransactionId, redirectUrl, raw };
  }

  async checkPaymentStatus(
    config: ResolvedGatewayConfig,
    externalTransactionId: string,
  ): Promise<PaymentStatusResult> {
    const raw = await this.call(config, this.statusEndpoint(), {
      orderId: externalTransactionId,
      language: "en",
    });
    // SmartVista is inconsistent about casing across deployments/versions.
    const orderStatus = this.num(raw.orderStatus ?? raw.OrderStatus);
    return {
      externalTransactionId,
      status: this.mapOrderStatus(orderStatus),
      providerStatusCode: orderStatus,
      actionCode: this.str(raw.actionCode),
      actionCodeDescription: this.str(raw.actionCodeDescription),
      amount: this.num(raw.amount ?? raw.Amount),
      currency: this.str(raw.currency ?? raw.Currency),
      raw,
    };
  }

  async getTransactionDetails(
    config: ResolvedGatewayConfig,
    externalTransactionId: string,
  ): Promise<PaymentStatusResult> {
    // Extended status already carries the full audit-grade detail.
    return this.checkPaymentStatus(config, externalTransactionId);
  }

  async refundPayment(
    config: ResolvedGatewayConfig,
    input: RefundInput,
  ): Promise<RefundResult> {
    const raw = await this.call(config, this.refundEndpoint(), {
      orderId: input.externalTransactionId,
      amount: String(input.amount),
    });
    const errorCode = String(raw.errorCode ?? raw.ErrorCode ?? "0");
    return {
      success: errorCode === "0",
      externalRefundId: this.str(raw.refundId),
      errorCode,
      errorMessage: this.str(raw.errorMessage ?? raw.ErrorMessage),
      raw,
    };
  }

  async cancelPayment(
    config: ResolvedGatewayConfig,
    externalTransactionId: string,
  ): Promise<CancelResult> {
    const raw = await this.call(config, this.reverseEndpoint(), {
      orderId: externalTransactionId,
    });
    const errorCode = String(raw.errorCode ?? raw.ErrorCode ?? "0");
    return {
      success: errorCode === "0",
      errorCode,
      errorMessage: this.str(raw.errorMessage ?? raw.ErrorMessage),
      raw,
    };
  }

  /**
   * Edge validation of an inbound callback. SmartVista's plain browser return is
   * unauthenticated, so we treat it as a *hint*: where a `callbackSecret` is
   * configured we additionally enforce an HMAC checksum + freshness + replay
   * window. The caller still re-verifies via checkPaymentStatus regardless.
   */
  verifyCallback(
    config: ResolvedGatewayConfig,
    callback: RawCallback,
  ): VerifiedCallback {
    const externalTransactionId =
      callback.params.orderId ?? callback.params.mdOrder;
    if (!externalTransactionId) {
      return { valid: false, rejectionReason: "missing orderId" };
    }

    // 1) IP whitelist (if configured).
    if (
      config.ipWhitelist.length > 0 &&
      !config.ipWhitelist.includes(callback.sourceIp)
    ) {
      return {
        valid: false,
        externalTransactionId,
        rejectionReason: `ip ${callback.sourceIp} not whitelisted`,
      };
    }

    // 2) HMAC checksum + timestamp (only when a secret is provisioned).
    if (config.callbackSecret) {
      const checksum = callback.params.checksum;
      const tsRaw = callback.params.timestamp;
      if (!checksum || !tsRaw) {
        return {
          valid: false,
          externalTransactionId,
          rejectionReason: "missing checksum/timestamp",
        };
      }
      const ts = Number(tsRaw) * (tsRaw.length <= 10 ? 1000 : 1);
      if (Math.abs(Date.now() - ts) > CALLBACK_TIMESTAMP_TOLERANCE_MS) {
        return {
          valid: false,
          externalTransactionId,
          rejectionReason: "stale timestamp",
        };
      }
      if (!this.verifyChecksum(config.callbackSecret, callback.params, checksum)) {
        return {
          valid: false,
          externalTransactionId,
          rejectionReason: "checksum mismatch",
        };
      }
    }

    return { valid: true, externalTransactionId };
  }

  async testConnection(config: ResolvedGatewayConfig): Promise<TestConnectionResult> {
    try {
      // A status query for a bogus order authenticates against the bank without
      // creating anything. A structured JSON reply (even errorCode 6 "unknown
      // order") proves URL + credentials + connectivity are good.
      const raw = await this.call(config, this.statusEndpoint(), {
        orderId: "00000000-0000-0000-0000-000000000000",
        language: "en",
      });
      const errorCode = String(raw.errorCode ?? raw.ErrorCode ?? "");
      if (errorCode === "5") {
        return { ok: false, message: "Access denied — check credentials" };
      }
      return { ok: true, message: `Reachable (errorCode=${errorCode || "0"})` };
    } catch (e) {
      return { ok: false, message: `Unreachable: ${(e as Error).message}` };
    }
  }

  // ── Internals ─────────────────────────────────────────────────────────────

  /**
   * SmartVista dynamic-callback checksum: HMAC-SHA256 over the sorted
   * `key;value;` concatenation of all params except `checksum`.
   */
  protected verifyChecksum(
    secret: string,
    params: Record<string, string>,
    provided: string,
  ): boolean {
    const payload = Object.keys(params)
      .filter((k) => k !== "checksum")
      .sort()
      .map((k) => `${k};${params[k]};`)
      .join("");
    const expected = createHmac("sha256", secret)
      .update(payload)
      .digest("hex")
      .toUpperCase();
    const a = Buffer.from(expected);
    const b = Buffer.from(provided.toUpperCase());
    return a.length === b.length && timingSafeEqual(a, b);
  }

  /** Perform a form-encoded SmartVista REST call with credentials + timeout. */
  protected async call(
    config: ResolvedGatewayConfig,
    endpoint: string,
    params: Record<string, string>,
  ): Promise<Record<string, any>> {
    const url = this.buildUrl(config, endpoint);
    const form = new URLSearchParams({
      userName: config.userName,
      password: config.password,
      ...params,
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
        signal: controller.signal,
      });
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 256)}`);
      }
      try {
        return JSON.parse(text);
      } catch {
        throw new Error(`Non-JSON response from ${this.code}: ${text.slice(0, 256)}`);
      }
    } catch (e) {
      Logger.error(
        `[${this.code}] ${endpoint} call failed: ${(e as Error).message}`,
        loggerCtx,
      );
      throw e;
    } finally {
      clearTimeout(timer);
    }
  }

  protected buildUrl(config: ResolvedGatewayConfig, endpoint: string): string {
    const base = config.baseUrl.replace(/\/+$/, "");
    const path = `${config.basePath.replace(/^\/+|\/+$/g, "")}/${endpoint}`;
    return `${base}/${path}`;
  }

  protected num(v: unknown): number | undefined {
    if (v === undefined || v === null || v === "") return undefined;
    const n = Number(v);
    return Number.isNaN(n) ? undefined : n;
  }

  protected str(v: unknown): string | undefined {
    return v === undefined || v === null ? undefined : String(v);
  }
}
