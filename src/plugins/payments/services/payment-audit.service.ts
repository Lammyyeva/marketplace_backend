import { Injectable } from "@nestjs/common";
import { ID, RequestContext, TransactionalConnection } from "@vendure/core";
import { PaymentAuditLog } from "../entities/payment-audit-log.entity";

/** Keys whose values must never be written to the audit log in clear. */
const REDACTED_KEYS = ["password", "userName", "credentials", "secret", "callbackSecret", "checksum"];

@Injectable()
export class PaymentAuditService {
  constructor(private connection: TransactionalConnection) {}

  async log(
    ctx: RequestContext,
    params: {
      action: string;
      paymentTransactionId?: ID | null;
      actor?: string;
      sourceIp?: string;
      payload?: Record<string, unknown>;
    },
  ): Promise<void> {
    const repo = this.connection.getRepository(ctx, PaymentAuditLog);
    await repo.save(
      new PaymentAuditLog({
        action: params.action,
        paymentTransactionId: params.paymentTransactionId ?? null,
        actor: params.actor,
        sourceIp: params.sourceIp,
        payload: (params.payload ? this.redact(params.payload) : null) as any,
      }),
    );
  }

  /** Recursively strip secret fields so audit logs are safe to read/export. */
  private redact(obj: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (REDACTED_KEYS.includes(k)) {
        out[k] = "***REDACTED***";
      } else if (v && typeof v === "object" && !Array.isArray(v)) {
        out[k] = this.redact(v as Record<string, unknown>);
      } else {
        out[k] = v;
      }
    }
    return out;
  }
}
