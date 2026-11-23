import { CrudPermissionDefinition } from "@vendure/core";

/**
 * Custom permission gating the Payments admin module. Registered on the config's
 * `authOptions.customPermissions`, it exposes Create/Read/Update/Delete toggles
 * in Role management and can be assigned to finance/ops roles only.
 */
export const paymentPermission = new CrudPermissionDefinition("Payment");
