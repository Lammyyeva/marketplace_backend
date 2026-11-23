import { Controller, Get, Header, Res } from "@nestjs/common";
import { RequestContextService, TransactionalConnection } from "@vendure/core";
import { Response } from "express";
import { PaymentTransaction } from "../entities/payment-transaction.entity";
import { RECONCILABLE_PAYMENT_STATUSES } from "../types";
import { PaymentMetricsService } from "../services/payment-metrics.service";
import { In } from "typeorm";

/**
 * Observability surface:
 *   GET /payments/metrics  — Prometheus text exposition
 *   GET /payments/health   — liveness + a payment-monitoring readiness signal
 */
@Controller("payments")
export class PaymentMetricsController {
  constructor(
    private metrics: PaymentMetricsService,
    private connection: TransactionalConnection,
    private requestContextService: RequestContextService,
  ) {}

  @Get("metrics")
  @Header("Content-Type", "text/plain; version=0.0.4")
  expose(): string {
    return this.metrics.expose();
  }

  @Get("health")
  async health(@Res() res: Response) {
    const ctx = await this.requestContextService.create({ apiType: "admin" });
    // A growing backlog of open payments is the canary for stuck callbacks.
    const openCount = await this.connection
      .getRepository(ctx, PaymentTransaction)
      .count({ where: { status: In([...RECONCILABLE_PAYMENT_STATUSES]) } });
    const status = openCount < 1000 ? "ok" : "degraded";
    return res.status(status === "ok" ? 200 : 503).json({ status, openPayments: openCount });
  }
}
