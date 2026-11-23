import { DeepPartial, EntityId, ID, VendureEntity } from "@vendure/core";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { RefundStatus } from "../types";
import { PaymentTransaction } from "./payment-transaction.entity";

/** A single full or partial refund issued against a settled transaction. */
@Entity()
export class PaymentRefund extends VendureEntity {
  constructor(input?: DeepPartial<PaymentRefund>) {
    super(input);
  }

  @EntityId({ nullable: false })
  paymentTransactionId: ID;

  @ManyToOne(() => PaymentTransaction, (t) => t.refunds)
  @JoinColumn({ name: "paymentTransactionId" })
  paymentTransaction: PaymentTransaction;

  /** Minor units. */
  @Column()
  amount: number;

  @Column({ nullable: true })
  reason: string;

  @Column({ type: "varchar", default: RefundStatus.Pending })
  status: RefundStatus;

  @Column({ nullable: true })
  externalRefundId: string;

  /** Admin/user who initiated the refund, for the audit trail. */
  @Column({ nullable: true })
  initiatedBy: string;

  @Column("jsonb", { nullable: true })
  responsePayload: Record<string, unknown> | null;
}
