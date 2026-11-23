import { Injectable, OnApplicationBootstrap, OnModuleInit } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import {
  JobQueue,
  JobQueueService,
  Logger,
  RequestContext,
  RequestContextService,
} from "@vendure/core";
import { loggerCtx, RECONCILIATION_CRON, RECONCILIATION_QUEUE } from "../constants";
import { TERMINAL_PAYMENT_STATUSES } from "../types";
import { PaymentAuditService } from "./payment-audit.service";
import { PaymentMetricsService } from "./payment-metrics.service";
import { PaymentService } from "./payment.service";

/**
 * Scheduled reconciliation. Every 5 minutes a lightweight @Cron trigger enqueues
 * a durable Vendure Job Queue job; the worker re-queries the bank for every
 * Pending/Processing/Authorized transaction and synchronises local state. Using
 * the job queue (rather than doing the work inline in the cron) buys retries,
 * back-pressure and horizontal scaling across worker instances.
 */
@Injectable()
export class PaymentReconciliationService implements OnModuleInit, OnApplicationBootstrap {
  private queue: JobQueue<Record<string, never>>;

  constructor(
    private jobQueueService: JobQueueService,
    private requestContextService: RequestContextService,
    private paymentService: PaymentService,
    private audit: PaymentAuditService,
    private metrics: PaymentMetricsService,
  ) {}

  async onModuleInit() {
    this.queue = await this.jobQueueService.createQueue({
      name: RECONCILIATION_QUEUE,
      process: async () => {
        const ctx = await this.createContext();
        await this.reconcileAll(ctx);
      },
    });
  }

  onApplicationBootstrap() {
    // Run once at boot so a worker restart doesn't leave stale pending payments.
    void this.enqueue();
  }

  @Cron(RECONCILIATION_CRON, { name: RECONCILIATION_QUEUE })
  async scheduledTrigger() {
    await this.enqueue();
  }

  private async enqueue() {
    if (!this.queue) return;
    await this.queue.add({}, { retries: 2 });
  }

  /** The actual reconciliation pass; isolated per-transaction so one bad row
   * never aborts the batch. Emits alerts + metrics on inconsistencies. */
  async reconcileAll(ctx: RequestContext): Promise<void> {
    const pending = await this.paymentService.findReconcilable(ctx);
    if (pending.length === 0) return;

    Logger.info(`Reconciling ${pending.length} open payment(s)`, loggerCtx);
    let synced = 0;
    let errors = 0;

    for (const tx of pending) {
      try {
        const before = tx.status;
        const after = await this.paymentService.syncTransaction(ctx, tx);
        if (after !== before) {
          synced++;
          // Inconsistency alert: bank reports settled/failed but our side lagged.
          await this.audit.log(ctx, {
            action: "reconciliation.drift_corrected",
            paymentTransactionId: tx.id,
            actor: "reconciliation-job",
            payload: { from: before, to: after, externalId: tx.externalTransactionId },
          });
          if (!TERMINAL_PAYMENT_STATUSES.has(before) && TERMINAL_PAYMENT_STATUSES.has(after)) {
            Logger.warn(
              `Reconciliation settled drifted tx ${tx.id} (${before} -> ${after})`,
              loggerCtx,
            );
          }
        }
      } catch (e) {
        errors++;
        this.metrics.reconciliationError();
        Logger.error(
          `Reconciliation failed for tx ${tx.id}: ${(e as Error).message}`,
          loggerCtx,
        );
        await this.audit.log(ctx, {
          action: "reconciliation.error",
          paymentTransactionId: tx.id,
          actor: "reconciliation-job",
          payload: { error: (e as Error).message },
        });
      }
    }
    Logger.info(`Reconciliation done: ${synced} updated, ${errors} error(s)`, loggerCtx);
  }

  private createContext(): Promise<RequestContext> {
    return this.requestContextService.create({ apiType: "admin" });
  }
}
