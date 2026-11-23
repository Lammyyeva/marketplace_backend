import { Injectable } from "@nestjs/common";
import { CacheService, Logger } from "@vendure/core";
import { createHmac, randomInt, timingSafeEqual } from "crypto";

const loggerCtx = "OtpService";

/**
 * Stored (never plaintext) OTP record. The code itself is kept only as an
 * HMAC-SHA256 digest; `expiresAt` lets us preserve the original expiry when we
 * re-write the record to bump the attempt counter (Vendure's CacheService.set
 * resets the TTL, so we recompute the remaining TTL ourselves).
 */
interface OtpRecord {
  hash: string;
  expiresAt: number;
  attempts: number;
}

export interface OtpVerifyResult {
  ok: boolean;
  reason?: "expired" | "mismatch" | "locked";
}

/**
 * Shared OTP service used by both the phone and (future) email recovery flows.
 *
 * Security properties:
 *  - Codes are stored only as HMAC-SHA256 digests (peppered with SECRET_KEY).
 *  - Single-use: a successful verification deletes the record.
 *  - 5-minute expiry (configurable via OTP_TTL_MS).
 *  - Brute-force protection: max N wrong attempts then the record is purged.
 *  - Rate limiting: max M generations per identifier per rolling window.
 *  - Constant-time comparison to avoid timing oracles.
 *  - Audit logging of every generate / verify / lockout (identifier masked).
 */
@Injectable()
export class OtpService {
  private readonly ttlMs = Number(process.env.OTP_TTL_MS) || 5 * 60 * 1000;
  private readonly maxAttempts = Number(process.env.OTP_MAX_ATTEMPTS) || 5;
  private readonly maxSends = Number(process.env.OTP_MAX_SENDS) || 5;
  private readonly rateWindowMs =
    Number(process.env.OTP_RATE_WINDOW_MS) || 15 * 60 * 1000;
  private readonly pepper = process.env.SECRET_KEY || "otp-pepper";

  constructor(private cacheService: CacheService) {}

  private recordKey(scope: string, identifier: string) {
    return `otp:${scope}:${identifier}`;
  }
  private rateKey(scope: string, identifier: string) {
    return `otp:rate:${scope}:${identifier}`;
  }

  private hashCode(code: string): string {
    return createHmac("sha256", this.pepper).update(code).digest("hex");
  }

  private mask(identifier: string): string {
    if (identifier.length <= 4) return "***";
    return `${identifier.slice(0, 2)}***${identifier.slice(-2)}`;
  }

  /**
   * Generates a fresh 4-digit OTP for the given identifier, enforcing the
   * per-identifier send rate limit. Returns the plaintext code (to be sent via
   * the SMS/email channel) or `null` when the rate limit has been exceeded.
   */
  async generate(scope: string, identifier: string): Promise<string | null> {
    const rateKey = this.rateKey(scope, identifier);
    const sends = Number((await this.cacheService.get<number>(rateKey)) ?? 0);
    if (sends >= this.maxSends) {
      Logger.warn(
        `OTP send rate limit hit for ${this.mask(identifier)} (${scope})`,
        loggerCtx,
      );
      return null;
    }
    await this.cacheService.set(rateKey, sends + 1, { ttl: this.rateWindowMs });

    const code = randomInt(0, 10000).toString().padStart(4, "0");
    const record: OtpRecord = {
      hash: this.hashCode(code),
      expiresAt: Date.now() + this.ttlMs,
      attempts: 0,
    };
    await this.cacheService.set(this.recordKey(scope, identifier), record, {
      ttl: this.ttlMs,
    });

    Logger.info(`OTP generated for ${this.mask(identifier)} (${scope})`, loggerCtx);
    return code;
  }

  /**
   * Verifies a submitted code. Enforces single-use, expiry, and brute-force
   * lockout. On success the record is consumed (deleted).
   */
  async verify(
    scope: string,
    identifier: string,
    code: string,
  ): Promise<OtpVerifyResult> {
    const key = this.recordKey(scope, identifier);
    const record = await this.cacheService.get<OtpRecord>(key);

    if (!record) {
      Logger.info(
        `OTP verify failed (no/expired record) for ${this.mask(identifier)} (${scope})`,
        loggerCtx,
      );
      return { ok: false, reason: "expired" };
    }

    const remaining = record.expiresAt - Date.now();
    if (remaining <= 0) {
      await this.cacheService.delete(key);
      return { ok: false, reason: "expired" };
    }

    if (record.attempts >= this.maxAttempts) {
      await this.cacheService.delete(key);
      Logger.warn(
        `OTP locked (too many attempts) for ${this.mask(identifier)} (${scope})`,
        loggerCtx,
      );
      return { ok: false, reason: "locked" };
    }

    const submitted = Buffer.from(this.hashCode(code));
    const expected = Buffer.from(record.hash);
    const matches =
      submitted.length === expected.length &&
      timingSafeEqual(submitted, expected);

    if (!matches) {
      const updated: OtpRecord = { ...record, attempts: record.attempts + 1 };
      // Preserve the original expiry window (do not extend on a wrong guess).
      await this.cacheService.set(key, updated, { ttl: remaining });
      Logger.info(
        `OTP mismatch (attempt ${updated.attempts}/${this.maxAttempts}) for ${this.mask(
          identifier,
        )} (${scope})`,
        loggerCtx,
      );
      return { ok: false, reason: "mismatch" };
    }

    // Success → single-use consumption.
    await this.cacheService.delete(key);
    await this.cacheService.delete(this.rateKey(scope, identifier));
    Logger.info(`OTP verified for ${this.mask(identifier)} (${scope})`, loggerCtx);
    return { ok: true };
  }
}
