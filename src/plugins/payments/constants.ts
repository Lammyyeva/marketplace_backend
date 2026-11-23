/**
 * Dependency-injection tokens and shared constants for the Payments plugin.
 *
 * All three supported banks (Halkbank, Turkmenturk, Rysgal) speak the BPC
 * SmartVista E-commerce Payment Gateway (EPG) REST protocol. Adding a new bank
 * is therefore a configuration + thin-subclass exercise, not a rewrite.
 */
export const PAYMENTS_PLUGIN_OPTIONS = Symbol("PAYMENTS_PLUGIN_OPTIONS");

/** Injection token for the array of registered provider strategy classes. */
export const PAYMENT_PROVIDER_STRATEGIES = Symbol("PAYMENT_PROVIDER_STRATEGIES");

/** Logger context label used across the plugin for structured logging. */
export const loggerCtx = "PaymentsPlugin";

/** Vendure Job Queue name used by the reconciliation worker. */
export const RECONCILIATION_QUEUE = "payment-reconciliation";

/** Default order expiration window (minutes) if a gateway does not override. */
export const DEFAULT_EXPIRATION_MINUTES = 15;

/** Reconciliation cadence. The brief requires every 5 minutes. */
export const RECONCILIATION_CRON = "0 */5 * * * *";

/** Window (ms) within which a callback timestamp is considered fresh. */
export const CALLBACK_TIMESTAMP_TOLERANCE_MS = 5 * 60 * 1000;
