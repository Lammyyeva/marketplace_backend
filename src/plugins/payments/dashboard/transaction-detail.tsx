import { useQuery } from "@tanstack/react-query";
import { api, graphql, Json, Page, PageBlock, PageLayout, PageTitle } from "@vendure/dashboard";

/**
 * Admin → Payments → Transaction detail.
 *
 * Shows General / Payment / Technical (request/response/callback payloads) info
 * and the full status Timeline. The transaction id is read from the `?id=` query
 * param (the Transactions list links here).
 */
const paymentTransactionDocument = graphql(`
  query PaymentTransactionDetail($id: ID!) {
    paymentTransaction(id: $id) {
      id
      createdAt
      orderCode
      orderId
      customerEmail
      gatewayCode
      gatewayName
      externalTransactionId
      amount
      currency
      status
      refundedAmount
      requestPayload
      responsePayload
      callbackPayload
      history {
        id
        oldStatus
        newStatus
        source
        notes
        createdAt
      }
      refunds {
        id
        amount
        status
        reason
        createdAt
      }
    }
  }
`);

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value ?? "—"}</span>
    </div>
  );
}

export function PaymentTransactionDetailPage() {
  const id =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("id")
      : null;

  const { data, isLoading } = useQuery({
    queryKey: ["paymentTransaction", id],
    queryFn: () => api.query(paymentTransactionDocument, { id: id as string }),
    enabled: !!id,
  });

  const tx = data?.paymentTransaction;
  const money = (v?: number, c?: string) => (v == null ? "—" : `${(v / 100).toFixed(2)} ${c ?? ""}`);

  return (
    <Page pageId="payment-transaction-detail">
      <PageTitle>Transaction {tx?.externalTransactionId ?? id}</PageTitle>
      <PageLayout>
        {isLoading && <PageBlock column="main">Loading…</PageBlock>}
        {!isLoading && !tx && <PageBlock column="main">Transaction not found.</PageBlock>}
        {tx && (
          <>
            <PageBlock column="main" title="General Information">
              <Row label="Transaction ID" value={String(tx.id)} />
              <Row label="Order Code" value={tx.orderCode} />
              <Row label="Customer" value={tx.customerEmail} />
              <Row label="Gateway" value={`${tx.gatewayName} (${tx.gatewayCode})`} />
            </PageBlock>

            <PageBlock column="main" title="Payment Information">
              <Row label="Amount" value={money(tx.amount, tx.currency)} />
              <Row label="Currency" value={tx.currency} />
              <Row label="Status" value={tx.status} />
              <Row label="Refunded" value={money(tx.refundedAmount, tx.currency)} />
              <Row label="External Transaction ID" value={tx.externalTransactionId} />
            </PageBlock>

            <PageBlock column="main" title="Timeline">
              <ol className="space-y-2">
                {tx.history.map((h) => (
                  <li key={String(h.id)} className="text-sm">
                    <span className="font-medium">{h.newStatus}</span>
                    {h.oldStatus ? ` (from ${h.oldStatus})` : ""} · {h.source} ·{" "}
                    {new Date(h.createdAt).toLocaleString()}
                    {h.notes ? ` — ${h.notes}` : ""}
                  </li>
                ))}
              </ol>
            </PageBlock>

            <PageBlock column="side" title="Technical · Request">
              <Json value={tx.requestPayload} />
            </PageBlock>
            <PageBlock column="side" title="Technical · Response">
              <Json value={tx.responsePayload} />
            </PageBlock>
            <PageBlock column="side" title="Technical · Callback">
              <Json value={tx.callbackPayload} />
            </PageBlock>
          </>
        )}
      </PageLayout>
    </Page>
  );
}
