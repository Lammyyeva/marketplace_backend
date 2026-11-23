import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, Button, graphql, Page, PageBlock, PageLayout, PageTitle } from "@vendure/dashboard";
import { GatewayForm, GatewayRow } from "./gateway-form";

/**
 * Admin → Payments → Gateway Settings. Global online-payment master switch plus
 * per-gateway enable/disable and a connection test.
 */
const gatewaysDocument = graphql(`
  query PaymentGatewaysAdmin {
    systemPaymentSettings {
      onlinePaymentEnabled
    }
    paymentGateways {
      id
      code
      name
      enabled
      displayOrder
      configuration
    }
  }
`);
const setOnlineDocument = graphql(`
  mutation SetOnlinePaymentEnabled($enabled: Boolean!) {
    setOnlinePaymentEnabled(enabled: $enabled) {
      onlinePaymentEnabled
    }
  }
`);
const setEnabledDocument = graphql(`
  mutation SetGatewayEnabled($code: String!, $enabled: Boolean!) {
    setPaymentGatewayEnabled(code: $code, enabled: $enabled) {
      id
      enabled
    }
  }
`);
const testDocument = graphql(`
  mutation TestGateway($code: String!) {
    testPaymentGatewayConnection(code: $code) {
      ok
      message
    }
  }
`);

export function GatewaySettingsPage() {
  const queryClient = useQueryClient();
  const [testResult, setTestResult] = useState<Record<string, string>>({});
  // `undefined` = form closed; `null` = creating; a row = editing that gateway.
  const [formFor, setFormFor] = useState<GatewayRow | null | undefined>(undefined);

  const { data } = useQuery({
    queryKey: ["payment-gateways-admin"],
    queryFn: () => api.query(gatewaysDocument, {}),
  });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["payment-gateways-admin"] });

  const setOnline = useMutation({
    mutationFn: (vars: { enabled: boolean }) => api.mutate(setOnlineDocument, vars),
    onSuccess: invalidate,
  });
  const setEnabled = useMutation({
    mutationFn: (vars: { code: string; enabled: boolean }) => api.mutate(setEnabledDocument, vars),
    onSuccess: invalidate,
  });
  const test = useMutation({
    mutationFn: (vars: { code: string }) => api.mutate(testDocument, vars),
    onSuccess: (res: any, vars: { code: string }) =>
      setTestResult((p) => ({
        ...p,
        [vars.code]: res?.testPaymentGatewayConnection?.message ?? "—",
      })),
  });

  const online = data?.systemPaymentSettings?.onlinePaymentEnabled ?? false;
  const gateways = data?.paymentGateways ?? [];

  return (
    <Page pageId="payment-gateway-settings">
      <PageTitle>Gateway Settings</PageTitle>
      <PageLayout>
        <PageBlock column="main" title="Online payments">
          <div className="flex items-center gap-3">
            <span className={online ? "text-green-600" : "text-amber-600"}>
              {online ? "Enabled globally" : "Disabled globally"}
            </span>
            <Button variant="secondary" onClick={() => setOnline.mutate({ enabled: !online })}>
              Turn {online ? "OFF" : "ON"}
            </Button>
          </div>
        </PageBlock>

        {formFor !== undefined && (
          <PageBlock column="main" title={formFor ? "Edit gateway" : "Add gateway"}>
            <GatewayForm
              editing={formFor}
              onClose={() => setFormFor(undefined)}
              onSaved={() => {
                setFormFor(undefined);
                invalidate();
              }}
            />
          </PageBlock>
        )}

        <PageBlock column="main" title="Gateways">
          <div className="mb-3">
            <Button size="sm" onClick={() => setFormFor(null)}>
              + New gateway
            </Button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2">Order</th>
                <th>Name</th>
                <th>Code</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gateways.map((g) => (
                <tr key={String(g.id)} className="border-t">
                  <td className="py-2">{g.displayOrder}</td>
                  <td>{g.name}</td>
                  <td>{g.code}</td>
                  <td>{g.enabled ? "Enabled" : "Disabled"}</td>
                  <td className="flex gap-2 py-2">
                    <Button size="sm" variant="secondary" onClick={() => setFormFor(g as GatewayRow)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEnabled.mutate({ code: g.code, enabled: !g.enabled })}
                    >
                      {g.enabled ? "Disable" : "Enable"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => test.mutate({ code: g.code })}>
                      Test connection
                    </Button>
                    {testResult[g.code] && (
                      <span className="self-center text-xs text-muted-foreground">
                        {testResult[g.code]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
