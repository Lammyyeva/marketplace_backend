import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { Logger, RequestContextService } from "@vendure/core";
import { Request, Response } from "express";
import { loggerCtx } from "../constants";
import { RawCallback } from "../types";
import { PaymentService } from "../services/payment.service";

/**
 * Public, unauthenticated edge for bank callbacks/returns:
 *   POST /payments/callback/:gatewayCode   — server-to-server notification
 *   GET  /payments/return/:gatewayCode      — browser return (success/failure)
 *
 * Security is enforced inside PaymentService.handleCallback (provider signature
 * /IP/timestamp validation + mandatory server-to-server re-verification), so a
 * spoofed callback can never settle an order. This endpoint should additionally
 * sit behind infra-level rate limiting (see ARCHITECTURE.md → Security).
 */
@Controller("payments")
export class PaymentCallbackController {
  constructor(
    private paymentService: PaymentService,
    private requestContextService: RequestContextService,
  ) {}

  @Post("callback/:gatewayCode")
  async callback(
    @Param("gatewayCode") gatewayCode: string,
    @Query() query: Record<string, string>,
    @Body() body: Record<string, string>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ctx = await this.requestContextService.create({ apiType: "admin" });
    const raw: RawCallback = {
      params: { ...query, ...body },
      rawBody: typeof req.body === "string" ? req.body : JSON.stringify(body ?? {}),
      headers: req.headers,
      sourceIp: this.clientIp(req),
    };
    try {
      const result = await this.paymentService.handleCallback(ctx, gatewayCode, raw);
      // Banks expect a 200 with a small ack body; non-200 triggers their retry.
      return res
        .status(result.accepted ? 200 : 400)
        .json({ accepted: result.accepted, status: result.status, reason: result.reason });
    } catch (e) {
      Logger.error(`Callback processing error: ${(e as Error).message}`, loggerCtx);
      return res.status(500).json({ accepted: false });
    }
  }

  /** Browser return: validate, then redirect to the storefront result page. */
  @Get("return/:gatewayCode")
  async browserReturn(
    @Param("gatewayCode") gatewayCode: string,
    @Query() query: Record<string, string>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ctx = await this.requestContextService.create({ apiType: "admin" });
    const raw: RawCallback = {
      params: query,
      rawBody: "",
      headers: req.headers,
      sourceIp: this.clientIp(req),
    };
    const result = await this.paymentService.handleCallback(ctx, gatewayCode, raw);
    const base = process.env.STOREFRONT_URL ?? "";
    const orderId = query.orderId ?? query.mdOrder ?? "";
    const page =
      result.status === "Paid"
        ? "success"
        : result.status === "Cancelled"
          ? "cancelled"
          : result.accepted && result.status
            ? "pending"
            : "failed";
    return res.redirect(`${base}/payment/${page}?txn=${encodeURIComponent(orderId)}`);
  }

  private clientIp(req: Request): string {
    const fwd = req.headers["x-forwarded-for"];
    if (typeof fwd === "string") return fwd.split(",")[0].trim();
    return req.ip ?? req.socket.remoteAddress ?? "";
  }
}
