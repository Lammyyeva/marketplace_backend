import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api, Button, graphql } from "@vendure/dashboard";

/**
 * Create / edit form for a PaymentGateway. All per-gateway settings
 * (endpoints, timeouts, currency, callback URL, IP whitelist) and the encrypted
 * credentials are managed here — no env vars, no DB access required.
 *
 * Credentials are write-only: on edit they are left blank and only re-sent if the
 * admin types new values (the API never returns the stored secrets).
 */
const createGatewayDocument = graphql(`
  mutation CreatePaymentGateway($input: CreatePaymentGatewayInput!) {
    createPaymentGateway(input: $input) { id code }
  }
`);
const updateGatewayDocument = graphql(`
  mutation UpdatePaymentGateway($input: UpdatePaymentGatewayInput!) {
    updatePaymentGateway(input: $input) { id code }
  }
`);

export interface GatewayRow {
  id: string;
  code: string;
  name: string;
  enabled: boolean;
  displayOrder: number;
  configuration?: Record<string, any> | null;
}

interface FormState {
  name: string;
  code: string;
  enabled: boolean;
  displayOrder: number;
  baseUrl: string;
  basePath: string;
  defaultCurrencyCode: string;
  returnUrl: string;
  timeoutMs: number;
  expirationMinutes: number;
  twoPhase: boolean;
  ipWhitelist: string;
  userName: string;
  password: string;
  callbackSecret: string;
}

function initialState(editing?: GatewayRow | null): FormState {
  const c = editing?.configuration ?? {};
  return {
    name: editing?.name ?? "",
    code: editing?.code ?? "",
    enabled: editing?.enabled ?? false,
    displayOrder: editing?.displayOrder ?? 0,
    baseUrl: c.baseUrl ?? "",
    basePath: c.basePath ?? "/payment/rest/",
    defaultCurrencyCode: c.defaultCurrencyCode ?? "934",
    returnUrl: c.returnUrl ?? "",
    timeoutMs: c.timeoutMs ?? 15000,
    expirationMinutes: c.expirationMinutes ?? 15,
    twoPhase: c.twoPhase ?? false,
    ipWhitelist: Array.isArray(c.ipWhitelist) ? c.ipWhitelist.join(", ") : "",
    userName: "",
    password: "",
    callbackSecret: "",
  };
}

const inputCls = "w-full rounded border px-2 py-1 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function GatewayForm({
  editing,
  onClose,
  onSaved,
}: {
  editing?: GatewayRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [s, setS] = useState<FormState>(() => initialState(editing));
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setS((p) => ({ ...p, [k]: v }));

  const buildConfiguration = () => ({
    baseUrl: s.baseUrl.trim(),
    basePath: s.basePath.trim(),
    defaultCurrencyCode: s.defaultCurrencyCode.trim(),
    returnUrl: s.returnUrl.trim(),
    timeoutMs: Number(s.timeoutMs),
    expirationMinutes: Number(s.expirationMinutes),
    twoPhase: s.twoPhase,
    ipWhitelist: s.ipWhitelist
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
  });

  const buildCredentials = () => {
    const creds: Record<string, string> = {};
    if (s.userName) creds.userName = s.userName;
    if (s.password) creds.password = s.password;
    if (s.callbackSecret) creds.callbackSecret = s.callbackSecret;
    return creds;
  };

  const save = useMutation({
    mutationFn: () => {
      if (editing) {
        const creds = buildCredentials();
        return api.mutate(updateGatewayDocument, {
          input: {
            id: editing.id,
            name: s.name,
            enabled: s.enabled,
            displayOrder: Number(s.displayOrder),
            configuration: buildConfiguration(),
            // Only rotate credentials if the admin entered new values.
            ...(Object.keys(creds).length ? { credentials: creds } : {}),
          },
        });
      }
      return api.mutate(createGatewayDocument, {
        input: {
          name: s.name,
          code: s.code.trim().toUpperCase(),
          enabled: s.enabled,
          displayOrder: Number(s.displayOrder),
          configuration: buildConfiguration(),
          credentials: buildCredentials(),
        },
      });
    },
    onSuccess: () => onSaved(),
    onError: (e: any) => setError(e?.message ?? "Save failed"),
  });

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">{editing ? `Edit ${editing.name}` : "New gateway"}</h3>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Name">
          <input className={inputCls} value={s.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Code (uppercase, e.g. HALKBANK)">
          <input
            className={inputCls}
            value={s.code}
            disabled={!!editing}
            onChange={(e) => set("code", e.target.value)}
          />
        </Field>
        <Field label="Base URL">
          <input className={inputCls} value={s.baseUrl} onChange={(e) => set("baseUrl", e.target.value)} />
        </Field>
        <Field label="Base path">
          <input className={inputCls} value={s.basePath} onChange={(e) => set("basePath", e.target.value)} />
        </Field>
        <Field label="Return URL">
          <input className={inputCls} value={s.returnUrl} onChange={(e) => set("returnUrl", e.target.value)} />
        </Field>
        <Field label="Currency (ISO 4217 numeric, 934 = TMT)">
          <input
            className={inputCls}
            value={s.defaultCurrencyCode}
            onChange={(e) => set("defaultCurrencyCode", e.target.value)}
          />
        </Field>
        <Field label="Timeout (ms)">
          <input
            type="number"
            className={inputCls}
            value={s.timeoutMs}
            onChange={(e) => set("timeoutMs", Number(e.target.value))}
          />
        </Field>
        <Field label="Expiration (minutes)">
          <input
            type="number"
            className={inputCls}
            value={s.expirationMinutes}
            onChange={(e) => set("expirationMinutes", Number(e.target.value))}
          />
        </Field>
        <Field label="Display order">
          <input
            type="number"
            className={inputCls}
            value={s.displayOrder}
            onChange={(e) => set("displayOrder", Number(e.target.value))}
          />
        </Field>
        <Field label="IP whitelist (comma-separated)">
          <input
            className={inputCls}
            value={s.ipWhitelist}
            onChange={(e) => set("ipWhitelist", e.target.value)}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={s.twoPhase} onChange={(e) => set("twoPhase", e.target.checked)} />
          Two-phase (preauth + capture)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={s.enabled} onChange={(e) => set("enabled", e.target.checked)} />
          Enabled
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Field label={editing ? "API user (leave blank to keep)" : "API user"}>
          <input
            className={inputCls}
            autoComplete="off"
            value={s.userName}
            onChange={(e) => set("userName", e.target.value)}
          />
        </Field>
        <Field label={editing ? "API password (leave blank to keep)" : "API password"}>
          <input
            type="password"
            className={inputCls}
            autoComplete="new-password"
            value={s.password}
            onChange={(e) => set("password", e.target.value)}
          />
        </Field>
        <Field label="Callback secret (optional)">
          <input
            type="password"
            className={inputCls}
            autoComplete="new-password"
            value={s.callbackSecret}
            onChange={(e) => set("callbackSecret", e.target.value)}
          />
        </Field>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <Button onClick={() => save.mutate()} disabled={save.isPending || !s.name || (!editing && !s.code)}>
          {save.isPending ? "Saving…" : editing ? "Save changes" : "Create gateway"}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
