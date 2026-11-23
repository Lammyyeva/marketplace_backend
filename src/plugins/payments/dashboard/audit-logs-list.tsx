import { AnyRoute } from "@tanstack/react-router";
import { graphql, ListPage } from "@vendure/dashboard";

/**
 * Admin → Payments → Audit Logs. Searchable, append-only record of every
 * security/financial action and every bank API call (request/response/error).
 */
const paymentAuditLogListDocument = graphql(`
  query PaymentAuditLogList($options: PaymentAuditLogListOptions) {
    paymentAuditLogs(options: $options) {
      items {
        id
        createdAt
        action
        actor
        sourceIp
        paymentTransactionId
        payload
      }
      totalItems
    }
  }
`);

export function PaymentAuditLogsList({ route }: { route: AnyRoute }) {
  return (
    <ListPage
      pageId="payment-audit-logs-list"
      title="Audit Logs"
      listQuery={paymentAuditLogListDocument}
      route={route}
      onSearchTermChange={(term) => ({ action: { contains: term } })}
    />
  );
}
