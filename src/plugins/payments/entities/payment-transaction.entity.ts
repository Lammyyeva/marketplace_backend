import { Customer, DeepPartial, EntityId, ID, Order, VendureEntity } from "@vendure/core";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { PaymentStatus } from "../types";
import { PaymentGateway } from "./payment-gateway.entity";
import { PaymentRefund } from "./payment-refund.entity";

/**
 * The authoritative record of one payment attempt against an order. Carries the
 * full request/response/callback payloads for audit and dispute handling.
 */
@Entity()
@Index(["status"])
@Index(["gatewayId", "status"])
export class PaymentTransaction extends VendureEntity {
  constructor(input?: DeepPartial<PaymentTransaction>) {
    super(input);
  }

  @EntityId({ nullable: false })
  orderId: ID;

  @ManyToOne(() => Order)
  @JoinColumn({ name: "orderId" })
  order: Order;

  @EntityId({ nullable: true })
  customerId: ID | null;

  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: "customerId" })
  customer: Customer | null;

  @EntityId({ nullable: false })
  gatewayId: ID;

  @ManyToOne(() => PaymentGateway)
  @JoinColumn({ name: "gatewayId" })
  gateway: PaymentGateway;

  /** Bank-generated id (SmartVista orderId/mdOrder). Indexed for callback lookup. */
  @Index()
  @Column({ type: "varchar", nullable: true })
  externalTransactionId: string | null;

  /** Idempotency key guaranteeing one transaction per logical order attempt. */
  @Index({ unique: true })
  @Column()
  idempotencyKey: string;

  /** Minor units (e.g. tenge). */
  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column({ type: "varchar", default: PaymentStatus.Pending })
  status: PaymentStatus;

  /** When the order auto-expires if still unpaid. */
  @Column({ type: "timestamp", nullable: true })
  expiresAt: Date | null;

  @Column("jsonb", { nullable: true })
  requestPayload: Record<string, unknown> | null;

  @Column("jsonb", { nullable: true })
  responsePayload: Record<string, unknown> | null;

  @Column("jsonb", { nullable: true })
  callbackPayload: Record<string, unknown> | null;

  @OneToMany(() => PaymentRefund, (r) => r.paymentTransaction)
  refunds: PaymentRefund[];

  /** Running total already refunded (minor units), for partial-refund accounting. */
  @Column({ default: 0 })
  refundedAmount: number;
}
