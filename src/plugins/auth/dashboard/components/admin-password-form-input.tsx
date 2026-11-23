import { PasswordInput, DashboardFormComponentProps } from "@vendure/dashboard";

export function AdminPasswordFormInput(props: DashboardFormComponentProps) {
  return (
    <PasswordInput
      value={props.value || ''}
      onChange={e => props.onChange((e.target as HTMLInputElement).value)}
      disabled={props.disabled}
      autoComplete="new-password"
    />
  );
}
