import { AnyRoute } from "@tanstack/react-router";
import { graphql, ListPage } from "@vendure/dashboard";

/**
 * Admin → Payments → Transactions.
 *
 * Uses the dashboard's <ListPage>, which derives columns from the selected
 * fields and provides search, column sorting, filtering and pagination for free
 * against the standard `paymentTransactions(options)` PaginatedList query.
 */
const paymentTransactionListDocument = graphql(`
  query PaymentTransactionList($options: PaymentTransactionListOptions) {
    paymentTransactions(options: $options) {
      items {
        id
        createdAt
        orderCode
        customerEmail
        gatewayCode
        externalTransactionId
        amount
        currency
        status
      }
      totalItems
    }
  }
`);

export function PaymentTransactionsList({ route }: { route: AnyRoute }) {
  return (
    <ListPage
      pageId="payment-transactions-list"
      title="Transactions"
      listQuery={paymentTransactionListDocument}
      route={route}
      customizeColumns={{
        id: {
          header: "Transaction",
          cell: ({ row }) => (
            <a
              className="text-primary underline"
              href={`/payments/transaction?id=${row.original.id}`}
            >
              {String(row.original.id)}
            </a>
          ),
        },
      }}
    />
  );
}
