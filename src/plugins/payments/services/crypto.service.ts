import { Inject, Injectable } from "@nestjs/common";
import { Logger } from "@vendure/core";
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  timingSafeEqual,
} from "crypto";
import { loggerCtx, PAYMENTS_PLUGIN_OPTIONS } from "../constants";
import { PaymentsPluginOptions } from "../types";

export interface EncryptedEnvelope {
  v: 1;
  iv: string;
  tag: string;
  data: string;
}

/**
 * AES-256-GCM authenticated encryption for credentials at rest.
 *
 * The 32-byte master key is read from an environment variable (never committed,
 * never stored in the DB). GCM provides confidentiality + integrity, so any
 * tampering with a stored ciphertext fails decryption rather than silently
 * yielding garbage.
 */
@Injectable()
export class CryptoService {
  private readonly key: Buffer;

  constructor(
    @Inject(PAYMENTS_PLUGIN_OPTIONS) private options: PaymentsPluginOptions,
  ) {
    const envVar = options.encryptionKeyEnvVar ?? "PAYMENTS_ENCRYPTION_KEY";
    const raw = process.env[envVar];
    if (!raw) {
      throw new Error(
        `Payments encryption key missing: set the ${envVar} environment variable ` +
          `to a 32-byte key (hex or base64).`,
      );
    }
    this.key = this.normaliseKey(raw);
    if (this.key.length !== 32) {
      throw new Error(`${envVar} must decode to exactly 32 bytes (got ${this.key.length}).`);
    }
  }

  encrypt(plain: string): EncryptedEnvelope {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
      v: 1,
      iv: iv.toString("base64"),
      tag: tag.toString("base64"),
      data: data.toString("base64"),
    };
  }

  decrypt(envelope: EncryptedEnvelope): string {
    try {
      const decipher = createDecipheriv(
        "aes-256-gcm",
        this.key,
        Buffer.from(envelope.iv, "base64"),
      );
      decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
      return Buffer.concat([
        decipher.update(Buffer.from(envelope.data, "base64")),
        decipher.final(),
      ]).toString("utf8");
    } catch (e) {
      Logger.error(`Credential decryption failed: ${(e as Error).message}`, loggerCtx);
      throw new Error("Failed to decrypt gateway credentials (key rotated or data tampered).");
    }
  }

  /** Encrypt an object of secrets (e.g. { userName, password }). */
  encryptObject(obj: Record<string, string>): EncryptedEnvelope {
    return this.encrypt(JSON.stringify(obj));
  }

  decryptObject<T = Record<string, string>>(envelope: EncryptedEnvelope): T {
    return JSON.parse(this.decrypt(envelope)) as T;
  }

  /** Constant-time string comparison for tokens/signatures. */
  safeEqual(a: string, b: string): boolean {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    return ba.length === bb.length && timingSafeEqual(ba, bb);
  }

  private normaliseKey(raw: string): Buffer {
    if (/^[0-9a-fA-F]{64}$/.test(raw)) return Buffer.from(raw, "hex");
    return Buffer.from(raw, "base64");
  }
}
