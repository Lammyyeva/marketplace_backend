import { DeepPartial, EntityId, ID, VendureEntity } from "@vendure/core";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PaymentStatus, StatusChangeSource } from "../types";
import { PaymentTransaction } from "./payment-transaction.entity";

/** Immutable append-only log of every status transition (the status timeline). */
@Entity()
@Index(["paymentTransactionId"])
export class PaymentStatusHistory extends VendureEntity {
  constructor(input?: DeepPartial<PaymentStatusHistory>) {
    super(input);
  }

  @EntityId({ nullable: false })
  paymentTransactionId: ID;

  @ManyToOne(() => PaymentTransaction)
  @JoinColumn({ name: "paymentTransactionId" })
  paymentTransaction: PaymentTransaction;

  @Column({ type: "varchar", nullable: true })
  oldStatus: PaymentStatus | null;

  @Column({ type: "varchar" })
  newStatus: PaymentStatus;

  @Column({ type: "varchar" })
  source: StatusChangeSource;

  @Column({ nullable: true })
  notes: string;
}
