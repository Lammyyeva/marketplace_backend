# Payments Admin Dashboard module

This folder contains the React dashboard extension for the Payments admin module
(deliverable: Admin Panel → Payments, with Transactions / Refunds / Gateways /
Reconciliation / Reports / Audit Logs).

## Status

The backend exposes **everything the UI needs** via the Admin GraphQL API, all
gated by the custom `Payment` permission:

| Submenu | Backing operation(s) |
|---|---|
| Transactions | `paymentTransactions(filter)`, `paymentTransaction(id)` |
| Refunds | `refundPaymentTransaction`, `paymentTransaction.refunds` |
| Gateways | `paymentGateways`, `createPaymentGateway`, `updatePaymentGateway` |
| Reconciliation | `runPaymentReconciliation` |
| Reports | `paymentKpis(dateFrom, dateTo)` + chart series |
| Audit Logs | (add an `paymentAuditLogs` query mirroring `paymentTransactions`) |

`index.tsx` registers the nav section + Transactions page; `transactions-page.tsx`
implements filters, search, sort, pagination and CSV export against the API.

## Enabling

The dashboard `routes`/`navMenuItem` API is version-sensitive across
`@vendure/dashboard` releases. Before enabling:

1. Confirm the route/nav shape in `index.tsx` matches your installed
   `@vendure/dashboard` version (compare with `../../promotion/dashboard`).
2. Add to `payments.plugin.ts` (inside `@VendurePlugin({ ... })`):

   ```ts
   dashboard: { location: "./dashboard" },
   ```

3. Build the dashboard. If the build complains about the routes API, adjust to
   the version's documented shape — the page components themselves are plain
   React + `fetch("/admin-api")` and are portable.

## Remaining pages

`RefundsPage`, `GatewaysPage`, `ReconciliationPage`, `ReportsPage` (KPI cards +
charts) and `AuditLogsPage` follow the exact structure of `transactions-page.tsx`
— swap the query/columns. Charts can use any chart lib; feed them
`paymentKpis` and the daily/gateway series from `PaymentReportService`.
