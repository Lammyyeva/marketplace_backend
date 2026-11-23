import { useQuery } from "@tanstack/react-query";
import { api, graphql, Page, PageBlock, PageLayout, PageTitle } from "@vendure/dashboard";

/** Admin → Payments → Reports. KPI summary cards. */
const kpisDocument = graphql(`
  query PaymentReportKpis {
    paymentKpis {
      totalPayments
      successfulPayments
      failedPayments
      pendingPayments
      refundAmount
      netRevenue
      conversionRate
    }
  }
`);

function Card({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function ReportsPage() {
  const { data } = useQuery({
    queryKey: ["payment-report-kpis"],
    queryFn: () => api.query(kpisDocument, {}),
  });
  const k = data?.paymentKpis;
  const money = (v?: number) => (v == null ? "—" : (v / 100).toFixed(2));

  return (
    <Page pageId="payment-reports">
      <PageTitle>Reports</PageTitle>
      <PageLayout>
        <PageBlock column="main" title="Key metrics">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card label="Total payments" value={k?.totalPayments ?? 0} />
            <Card label="Successful" value={k?.successfulPayments ?? 0} />
            <Card label="Failed" value={k?.failedPayments ?? 0} />
            <Card label="Pending" value={k?.pendingPayments ?? 0} />
            <Card label="Refund amount" value={money(k?.refundAmount)} />
            <Card label="Net revenue" value={money(k?.netRevenue)} />
            <Card
              label="Conversion rate"
              value={k ? `${(k.conversionRate * 100).toFixed(1)}%` : "—"}
            />
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
