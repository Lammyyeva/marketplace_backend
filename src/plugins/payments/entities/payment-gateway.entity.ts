import { DeepPartial, VendureEntity } from "@vendure/core";
import { Column, Entity, Index } from "typeorm";

/**
 * A configured bank integration (one row per merchant×bank).
 *
 * `credentials` is stored as an AES-256-GCM ciphertext envelope — secrets are
 * never persisted in plaintext. `configuration` holds non-secret tunables
 * (endpoints, timeout, callback URLs, expiration, IP whitelist).
 */
@Entity()
export class PaymentGateway extends VendureEntity {
  constructor(input?: DeepPartial<PaymentGateway>) {
    super(input);
  }

  @Column()
  name: string;

  /** Stable machine code, e.g. "halkbank" — maps to a provider strategy. */
  @Index({ unique: true })
  @Column()
  code: string;

  @Column({ default: false })
  enabled: boolean;

  /** Ascending sort key for checkout/admin display. Lower shows first. */
  @Column({ default: 0 })
  displayOrder: number;

  /** Encrypted envelope: { iv, tag, ciphertext } produced by CryptoService. */
  @Column("jsonb")
  credentials: Record<string, unknown>;

  /** Non-secret config (baseUrl, basePath, timeoutMs, returnUrl, ipWhitelist…). */
  @Column("jsonb", { default: {} })
  configuration: Record<string, unknown>;
}
