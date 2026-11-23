import {
  RequestContext,
  VerificationTokenStrategy,
  Injector,
  CacheService,
} from "@vendure/core";
import { randomInt } from "crypto";

export class OtpVerificationTokenStrategy implements VerificationTokenStrategy {
  private cacheService: CacheService;

  init(injector: Injector) {
    this.cacheService = injector.get(CacheService);
  }

  async generateVerificationToken(_ctx: RequestContext): Promise<string> {
    const otp = randomInt(1000, 10000).toString();
    const cacheKey = `otp-timestamp:${otp}`;
    await this.cacheService.set(cacheKey, Date.now(), {
      ttl: Number(process.env.OTP_TTL),
    });
    return otp;
  }

  async verifyVerificationToken(
    _ctx: RequestContext,
    token: string,
  ): Promise<boolean> {
    const cacheKey = `otp-timestamp:${token}`;
    const timestamp = await this.cacheService.get(cacheKey);

    if (!timestamp) {
      return false;
    }

    await this.cacheService.delete(cacheKey);
    return true;
  }
}
