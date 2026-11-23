import { Injectable } from "@nestjs/common";
import { RequestContext, TransactionalConnection } from "@vendure/core";
import { Brackets } from "typeorm";
import { PaymentRefund } from "../entities/payment-refund.entity";
import { PaymentTransaction } from "../entities/payment-transaction.entity";
import { PaymentStatus, RefundStatus } from "../types";

export interface PaymentKpis {
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  refundAmount: number;
  netRevenue: number;
  conversionRate: number;
}

/** Aggregations powering the Reports & Analytics dashboard widgets. */
@Injectable()
export class PaymentReportService {
  constructor(private connection: TransactionalConnection) {}

  async kpis(ctx: RequestContext, dateFrom?: Date, dateTo?: Date): Promise<PaymentKpis> {
    const txRepo = this.connection.getRepository(ctx, PaymentTransaction);
    const range = (qb: any) => {
      if (dateFrom) qb.andWhere("t.createdAt >= :from", { from: dateFrom });
      if (dateTo) qb.andWhere("t.createdAt <= :to", { to: dateTo });
      return qb;
    };

    const total = await range(txRepo.createQueryBuilder("t")).getCount();
    const successful = await range(
      txRepo.createQueryBuilder("t").where("t.status = :s", { s: PaymentStatus.Paid }),
    ).getCount();
    const failed = await range(
      txRepo
        .createQueryBuilder("t")
        .where(
          new Brackets((qb) =>
            qb
              .where("t.status = :f", { f: PaymentStatus.Failed })
              .orWhere("t.status = :e", { e: PaymentStatus.Expired }),
          ),
        ),
    ).getCount();
    const pending = await range(
      txRepo.createQueryBuilder("t").where("t.status IN (:...p)", {
        p: [PaymentStatus.Pending, PaymentStatus.Processing, PaymentStatus.Authorized],
      }),
    ).getCount();

    const paidSumRow = (await range(
      txRepo
        .createQueryBuilder("t")
        .select("COALESCE(SUM(t.amount),0)", "sum")
        .where("t.status = :s", { s: PaymentStatus.Paid }),
    ).getRawOne()) as { sum: string } | undefined;
    const grossPaid = Number(paidSumRow?.sum ?? 0);

    const refundRow = await this.connection
      .getRepository(ctx, PaymentRefund)
      .createQueryBuilder("r")
      .select("COALESCE(SUM(r.amount),0)", "sum")
      .where("r.status = :s", { s: RefundStatus.Succeeded })
      .getRawOne<{ sum: string }>();
    const refundAmount = Number(refundRow?.sum ?? 0);

    return {
      totalPayments: total,
      successfulPayments: successful,
      failedPayments: failed,
      pendingPayments: pending,
      refundAmount,
      netRevenue: grossPaid - refundAmount,
      conversionRate: total > 0 ? successful / total : 0,
    };
  }

  /** Daily {date, count, amount} series for the "Daily payments" chart. */
  async dailySeries(ctx: RequestContext, dateFrom: Date, dateTo: Date) {
    return this.connection
      .getRepository(ctx, PaymentTransaction)
      .createQueryBuilder("t")
      .select("DATE(t.createdAt)", "date")
      .addSelect("COUNT(*)", "count")
      .addSelect("COALESCE(SUM(CASE WHEN t.status = :paid THEN t.amount ELSE 0 END),0)", "amount")
      .where("t.createdAt BETWEEN :from AND :to", { from: dateFrom, to: dateTo })
      .setParameter("paid", PaymentStatus.Paid)
      .groupBy("DATE(t.createdAt)")
      .orderBy("DATE(t.createdAt)", "ASC")
      .getRawMany();
  }
}
