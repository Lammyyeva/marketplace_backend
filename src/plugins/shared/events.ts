import { RequestContext, VendureEvent } from "@vendure/core";

export class EmailVerificationEvent extends VendureEvent {
  constructor(
    public ctx: RequestContext,
    public email: string,
    public otp: string,
  ) {
    super();
  }
}
