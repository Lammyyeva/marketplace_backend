import { Injectable } from "@nestjs/common";
import { PaymentStatus } from "../types";
import { SmartVistaBaseProvider } from "./smartvista-base.provider";

/**
 * Rysgal Bank — SmartVista EPG. Demonstrates the one place a bank may legitimately
 * need custom code: a deployment that does NOT distinguish the ACS/3DS in-progress
 * state (orderStatus 5) and instead reports it as 0. We override the single status
 * mapping hook; the ~200 lines of transport/refund/callback logic stay shared.
 */
@Injectable()
export class RysgalProvider extends SmartVistaBaseProvider {
  readonly code = "RYSGAL";

  protected mapOrderStatus(orderStatus: number | undefined): PaymentStatus {
    if (orderStatus === 5) {
      // Rysgal collapses "auth initiated via ACS" into the unpaid/pending bucket.
      return PaymentStatus.Pending;
    }
    return super.mapOrderStatus(orderStatus);
  }
}
