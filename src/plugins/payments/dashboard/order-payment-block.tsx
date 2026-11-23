import { useQuery } from "@tanstack/react-query";
import { api, graphql } from "@vendure/dashboard";

/**
 * Payment block injected into the Vendure Order detail page. Surfaces the
 * gateway, status, external id, date and refund info for the order's payment
 * transaction(s) so admins never need to open the database.
 */
const orderTransactionsDocument = graphql(`
  query OrderPaymentTransactions($orderId: ID!) {
    paymentTransactionsForOrder(orderId: $orderId) {
      id
      gatewayName
      status
      externalTransactionId
      amount
      currency
      refundedAmount
      createdAt
    }
  }
`);

export function OrderPaymentBlock({ context }: { context: { entity?: { id?: string } } }) {
  const orderId = context.entity?.id;
  const { data } = useQuery({
    queryKey: ["order-payment-transactions", orderId],
    queryFn: () => api.query(orderTransactionsDocument, { orderId: orderId as string }),
    enabled: !!orderId,
  });

  const txns = data?.paymentTransactionsForOrder ?? [];
  if (txns.length === 0) {
    return <p className="text-sm text-muted-foreground">No online payment transactions.</p>;
  }
  const money = (v: number, c: string) => `${(v / 100).toFixed(2)} ${c}`;

  return (
    <div className="space-y-3">
      {txns.map((t) => (
        <div key={String(t.id)} className="rounded-lg border p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Gateway</span>
            <span className="font-medium">{t.gatewayName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium">{t.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">External Transaction ID</span>
            <span className="font-medium">{t.externalTransactionId ?? "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">{money(t.amount, t.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Refunded</span>
            <span className="font-medium">{money(t.refundedAmount, t.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Date</span>
            <span className="font-medium">{new Date(t.createdAt).toLocaleString()}</span>
          </div>
          <a className="text-primary underline" href={`/payments/transaction?id=${t.id}`}>
            View transaction
          </a>
        </div>
      ))}
    </div>
  );
}
