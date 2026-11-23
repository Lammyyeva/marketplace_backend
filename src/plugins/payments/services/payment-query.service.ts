import { Injectable } from "@nestjs/common";
import {
  ID,
  ListQueryBuilder,
  ListQueryOptions,
  PaginatedList,
  RequestContext,
  TransactionalConnection,
} from "@vendure/core";
import { PaymentAuditLog } from "../entities/payment-audit-log.entity";
import { PaymentRefund } from "../entities/payment-refund.entity";
import { PaymentStatusHistory } from "../entities/payment-status-history.entity";
import { PaymentTransaction } from "../entities/payment-transaction.entity";

/**
 * Read-side service powering the Admin list/detail views. Uses Vendure's
 * ListQueryBuilder so the dashboard's <ListPage> gets first-class
 * filter/sort/pagination for free (the standard `options` contract).
 */
@Injectable()
export class PaymentQueryService {
  constructor(
    private connection: TransactionalConnection,
    private listQueryBuilder: ListQueryBuilder,
  ) {}

  transactions(
    ctx: RequestContext,
    options?: ListQueryOptions<PaymentTransaction>,
  ): Promise<PaginatedList<PaymentTransaction>> {
    return this.listQueryBuilder
      .build(PaymentTransaction, options, { ctx, relations: ["gateway"] })
      .getManyAndCount()
      .then(([items, totalItems]) => ({ items, totalItems }));
  }

  transaction(ctx: RequestContext, id: ID): Promise<PaymentTransaction | null> {
    return this.connection
      .getRepository(ctx, PaymentTransaction)
      .findOne({ where: { id }, relations: ["gateway"] });
  }

  transactionsForOrder(ctx: RequestContext, orderId: ID): Promise<PaymentTransaction[]> {
    return this.connection
      .getRepository(ctx, PaymentTransaction)
      .find({ where: { orderId }, relations: ["gateway"], order: { createdAt: "DESC" } });
  }

  history(ctx: RequestContext, transactionId: ID): Promise<PaymentStatusHistory[]> {
    return this.connection
      .getRepository(ctx, PaymentStatusHistory)
      .find({ where: { paymentTransactionId: transactionId }, order: { createdAt: "ASC" } });
  }

  refunds(
    ctx: RequestContext,
    options?: ListQueryOptions<PaymentRefund>,
  ): Promise<PaginatedList<PaymentRefund>> {
    return this.listQueryBuilder
      .build(PaymentRefund, options, { ctx })
      .getManyAndCount()
      .then(([items, totalItems]) => ({ items, totalItems }));
  }

  refundsForTransaction(ctx: RequestContext, transactionId: ID): Promise<PaymentRefund[]> {
    return this.connection
      .getRepository(ctx, PaymentRefund)
      .find({ where: { paymentTransactionId: transactionId }, order: { createdAt: "ASC" } });
  }

  auditLogs(
    ctx: RequestContext,
    options?: ListQueryOptions<PaymentAuditLog>,
  ): Promise<PaginatedList<PaymentAuditLog>> {
    return this.listQueryBuilder
      .build(PaymentAuditLog, options, { ctx })
      .getManyAndCount()
      .then(([items, totalItems]) => ({ items, totalItems }));
  }
}
