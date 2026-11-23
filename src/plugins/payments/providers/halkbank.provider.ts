import { Injectable } from "@nestjs/common";
import { SmartVistaBaseProvider } from "./smartvista-base.provider";

/**
 * Halkbank (Türkmenistan) — standard SmartVista EPG deployment on the
 * `/payment/rest/` base path. No protocol quirks, so the entire integration is
 * just the code identifier; everything else is inherited from the base provider.
 */
@Injectable()
export class HalkbankProvider extends SmartVistaBaseProvider {
  readonly code = "HALKBANK";
}
