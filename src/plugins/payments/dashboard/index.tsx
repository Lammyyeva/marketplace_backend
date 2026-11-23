import { defineDashboardExtension } from "@vendure/dashboard";
import { CreditCard } from "lucide-react";

import { PaymentAuditLogsList } from "./audit-logs-list";
import { GatewaySettingsPage } from "./gateways";
import { OrderPaymentBlock } from "./order-payment-block";
import { ReconciliationPage } from "./reconciliation";
import { ReportsPage } from "./reports";
import { PaymentTransactionDetailPage } from "./transaction-detail";
import { PaymentTransactionsList } from "./transactions-list";

/**
 * Payments admin dashboard module. Adds the "Payments" nav section with
 * Transactions / Refunds / Reconciliation / Gateway Settings / Reports / Audit
 * Logs, the transaction detail view, and a Payment block on the Order page.
 *
 * All data comes from the plugin's Admin GraphQL API, gated by the custom
 * `Payment` permission.
 */
export default defineDashboardExtension({
  navSections: [
    {
      id: "payments",
      title: "Payments",
      icon: CreditCard,
      order: 350,
    },
  ],
  routes: [
    {
      path: "/payments/transactions",
      component: (route) => <PaymentTransactionsList route={route} />,
      navMenuItem: { sectionId: "payments", id: "payment-transactions", title: "Transactions" },
    },
    {
      // Detail view (not in nav); linked from the Transactions list via ?id=.
      path: "/payments/transaction",
      component: () => <PaymentTransactionDetailPage />,
    },
    {
      path: "/payments/reconciliation",
      component: () => <ReconciliationPage />,
      navMenuItem: { sectionId: "payments", id: "payment-reconciliation", title: "Reconciliation" },
    },
    {
      path: "/payments/gateways",
      component: () => <GatewaySettingsPage />,
      navMenuItem: { sectionId: "payments", id: "payment-gateways", title: "Gateway Settings" },
    },
    {
      path: "/payments/reports",
      component: () => <ReportsPage />,
      navMenuItem: { sectionId: "payments", id: "payment-reports", title: "Reports" },
    },
    {
      path: "/payments/audit-logs",
      component: (route) => <PaymentAuditLogsList route={route} />,
      navMenuItem: { sectionId: "payments", id: "payment-audit-logs", title: "Audit Logs" },
    },
  ],
  pageBlocks: [
    {
      id: "order-payment",
      title: "Payment",
      location: {
        pageId: "order-detail",
        position: { blockId: "order-table", order: "after" },
        column: "side",
      },
      component: OrderPaymentBlock,
    },
  ],
});
