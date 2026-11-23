import { Injectable } from "@nestjs/common";
import { SmartVistaBaseProvider } from "./smartvista-base.provider";

/**
 * Senagat Bank (Türkmenistan) — SmartVista EPG. The REST base path differs per
 * deployment and is set on the PaymentGateway.configuration, so no code override
 * is needed; everything is inherited from the base provider.
 */
@Injectable()
export class SenagatProvider extends SmartVistaBaseProvider {
  readonly code = "SENAGATBANK";
}
