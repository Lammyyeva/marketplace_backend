import { Type } from "@nestjs/common";
import { PluginCommonModule, VendurePlugin } from "@vendure/core";

import {
  PAYMENT_PROVIDER_STRATEGIES,
  PAYMENTS_PLUGIN_OPTIONS,
} from "./constants";
import { adminApiExtensions, shopApiExtensions } from "./api/api-extensions";
import {
  PaymentAdminResolver,
  PaymentTransactionEntityResolver,
} from "./api/payment-admin.resolver";
import { PaymentCallbackController } from "./api/payment-callback.controller";
import { PaymentMetricsController } from "./api/payment-metrics.controller";
import { PaymentShopResolver } from "./api/payment-shop.resolver";
import { PaymentAuditLog } from "./entities/payment-audit-log.entity";
import { PaymentGateway } from "./entities/payment-gateway.entity";
import { PaymentRefund } from "./entities/payment-refund.entity";
import { PaymentStatusHistory } from "./entities/payment-status-history.entity";
import { PaymentTransaction } from "./entities/payment-transaction.entity";
import { SystemSettings } from "./entities/system-settings.entity";
import { paymentPermission } from "./permissions";
import { HalkbankProvider } from "./providers/halkbank.provider";
import { PaymentProviderFactory } from "./providers/payment-provider.factory";
import { RysgalProvider } from "./providers/rysgal.provider";
import { SenagatProvider } from "./providers/senagat.provider";
import { CryptoService } from "./services/crypto.service";
import { PaymentAuditService } from "./services/payment-audit.service";
import { PaymentGatewayService } from "./services/payment-gateway.service";
import { PaymentMetricsService } from "./services/payment-metrics.service";
import { PaymentReconciliationService } from "./services/payment-reconciliation.service";
import { PaymentQueryService } from "./services/payment-query.service";
import { PaymentReportService } from "./services/payment-report.service";
import { PaymentService } from "./services/payment.service";
import { SystemSettingsService } from "./services/system-settings.service";
import { PaymentsPluginOptions } from "./types";

/**
 * Enterprise online-payments plugin for Vendure.
 *
 * Strategy + Factory + DI: every bank is a `PaymentProviderInterface` strategy,
 * resolved at runtime by `PaymentProviderFactory` via the
 * `PAYMENT_PROVIDER_STRATEGIES` multi-provider token. Adding a bank = add a thin
 * subclass + push it into that token's factory array; nothing else changes.
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [
    PaymentGateway,
    PaymentTransaction,
    PaymentRefund,
    PaymentStatusHistory,
    PaymentAuditLog,
    SystemSettings,
  ],
  controllers: [PaymentCallbackController, PaymentMetricsController],
  providers: [
    // Bank strategies
    HalkbankProvider,
    RysgalProvider,
    SenagatProvider,
    // Strategy registry consumed by the factory (extension point for new banks)
    {
      provide: PAYMENT_PROVIDER_STRATEGIES,
      useFactory: (h: HalkbankProvider, r: RysgalProvider, s: SenagatProvider) => [h, r, s],
      inject: [HalkbankProvider, RysgalProvider, SenagatProvider],
    },
    PaymentProviderFactory,
    // Core services
    CryptoService,
    SystemSettingsService,
    PaymentGatewayService,
    PaymentQueryService,
    PaymentAuditService,
    PaymentMetricsService,
    PaymentReportService,
    PaymentService,
    PaymentReconciliationService,
    // Plugin options
    {
      provide: PAYMENTS_PLUGIN_OPTIONS,
      useFactory: () => PaymentsPlugin.options,
    },
  ],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [PaymentShopResolver],
  },
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [PaymentAdminResolver, PaymentTransactionEntityResolver],
  },
  configuration: (config) => {
    config.authOptions.customPermissions.push(paymentPermission);
    return config;
  },
  compatibility: "^3.0.0",
  dashboard: {
    location: "./dashboard",
  },
})
export class PaymentsPlugin {
  static options: PaymentsPluginOptions = {};

  static init(options: PaymentsPluginOptions): Type<PaymentsPlugin> {
    this.options = options;
    return PaymentsPlugin;
  }
}
