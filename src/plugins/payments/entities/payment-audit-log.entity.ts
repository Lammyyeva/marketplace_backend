import { DeepPartial, EntityId, ID, VendureEntity } from "@vendure/core";
import { Column, Entity, Index } from "typeorm";

/**
 * Tamper-evident, append-only audit record of every security/financially
 * relevant action (create, callback received, status synced, refund, cancel,
 * gateway config change). Payloads are redacted of secrets before persistence.
 */
@Entity()
@Index(["action"])
@Index(["paymentTransactionId"])
export class PaymentAuditLog extends VendureEntity {
  constructor(input?: DeepPartial<PaymentAuditLog>) {
    super(input);
  }

  @Column()
  action: string;

  /** Optional link to the subject transaction (null for gateway-level events). */
  @EntityId({ nullable: true })
  paymentTransactionId: ID | null;

  /** Actor: admin user id, "bank-callback", "reconciliation-job", "system". */
  @Column({ nullable: true })
  actor: string;

  @Column({ nullable: true })
  sourceIp: string;

  @Column("jsonb", { nullable: true })
  payload: Record<string, unknown> | null;
}
