import { Injectable } from "@nestjs/common";

type Labels = Record<string, string>;

/**
 * Lightweight Prometheus-compatible counter registry. Kept dependency-free so
 * the plugin works whether or not `prom-client` is installed; when it is, swap
 * the internals for prom-client Counters and expose them on the shared registry.
 * Metrics required by the brief:
 *   payment_success_total · payment_failed_total
 *   payment_refund_total  · reconciliation_errors_total
 */
@Injectable()
export class PaymentMetricsService {
  private counters = new Map<string, number>();

  inc(metric: string, labels: Labels = {}, by = 1): void {
    const key = this.key(metric, labels);
    this.counters.set(key, (this.counters.get(key) ?? 0) + by);
  }

  paymentSucceeded(gateway: string) {
    this.inc("payment_success_total", { gateway });
  }
  paymentFailed(gateway: string, reason = "unknown") {
    this.inc("payment_failed_total", { gateway, reason });
  }
  paymentRefunded(gateway: string) {
    this.inc("payment_refund_total", { gateway });
  }
  reconciliationError(gateway = "all") {
    this.inc("reconciliation_errors_total", { gateway });
  }

  /** Render the registry in Prometheus text exposition format. */
  expose(): string {
    const lines: string[] = [];
    for (const [key, value] of this.counters.entries()) {
      lines.push(`${key} ${value}`);
    }
    return lines.join("\n") + "\n";
  }

  private key(metric: string, labels: Labels): string {
    const l = Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .join(",");
    return l ? `${metric}{${l}}` : metric;
  }
}
