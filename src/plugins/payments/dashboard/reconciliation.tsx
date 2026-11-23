import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, Button, graphql, Page, PageBlock, PageLayout, PageTitle } from "@vendure/dashboard";

/**
 * Admin → Payments → Reconciliation. Shows counts by status and offers the
 * Sync Now (full pass), Verify Payment and Retry Verification actions.
 */
const kpisDocument = graphql(`
  query ReconciliationKpis {
    paymentKpis {
      totalPayments
      successfulPayments
      failedPayments
      pendingPayments
    }
  }
`);
const reconcileDocument = graphql(`
  mutation ReconcilePayments {
    reconcilePayments
  }
`);
const verifyDocument = graphql(`
  mutation VerifyPayment($transactionId: ID!) {
    verifyPayment(transactionId: $transactionId)
  }
`);

function Stat({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-2xl font-semibold">{value ?? 0}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function ReconciliationPage() {
  const queryClient = useQueryClient();
  const [txnId, setTxnId] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ["reconciliation-kpis"],
    queryFn: () => api.query(kpisDocument, {}),
  });
  const k = data?.paymentKpis;

  const syncNow = useMutation({
    mutationFn: () => api.mutate(reconcileDocument),
    onSuccess: () => {
      setMessage("Reconciliation pass started/completed.");
      void queryClient.invalidateQueries({ queryKey: ["reconciliation-kpis"] });
    },
  });
  const verify = useMutation({
    mutationFn: (vars: { transactionId: string }) => api.mutate(verifyDocument, vars),
    onSuccess: (res: any) => setMessage(`Verified — status: ${res?.verifyPayment}`),
    onError: (e: any) => setMessage(`Verify failed: ${e?.message ?? "error"}`),
  });

  return (
    <Page pageId="payment-reconciliation">
      <PageTitle>Reconciliation</PageTitle>
      <PageLayout>
        <PageBlock column="main" title="Open & settled payments">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label="Pending" value={k?.pendingPayments} />
            <Stat label="Failed" value={k?.failedPayments} />
            <Stat label="Paid" value={k?.successfulPayments} />
            <Stat label="Total" value={k?.totalPayments} />
          </div>
        </PageBlock>

        <PageBlock column="main" title="Actions">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => syncNow.mutate()} disabled={syncNow.isPending}>
              {syncNow.isPending ? "Syncing…" : "Sync Now"}
            </Button>
            <input
              className="rounded border px-2 py-1 text-sm"
              placeholder="Transaction ID"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
            />
            <Button
              variant="secondary"
              disabled={!txnId || verify.isPending}
              onClick={() => verify.mutate({ transactionId: txnId })}
            >
              Verify Payment
            </Button>
            <Button
              variant="outline"
              disabled={!txnId || verify.isPending}
              onClick={() => verify.mutate({ transactionId: txnId })}
            >
              Retry Verification
            </Button>
          </div>
          {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
