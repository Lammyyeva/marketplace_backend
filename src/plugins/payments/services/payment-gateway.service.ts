import { Inject, Injectable } from "@nestjs/common";
import { ID, RequestContext, TransactionalConnection } from "@vendure/core";
import {
  DEFAULT_EXPIRATION_MINUTES,
  PAYMENTS_PLUGIN_OPTIONS,
} from "../constants";
import { PaymentGateway } from "../entities/payment-gateway.entity";
import { PaymentsPluginOptions, ResolvedGatewayConfig } from "../types";
import { CryptoService, EncryptedEnvelope } from "./crypto.service";

/**
 * Owns the PaymentGateway lifecycle and the decryption boundary: it is the ONLY
 * place that turns a persisted (encrypted) gateway row into a usable
 * ResolvedGatewayConfig. Secrets exist decrypted only inside the returned
 * in-memory object, never logged, never persisted.
 */
@Injectable()
export class PaymentGatewayService {
  constructor(
    private connection: TransactionalConnection,
    private crypto: CryptoService,
    @Inject(PAYMENTS_PLUGIN_OPTIONS) private options: PaymentsPluginOptions,
  ) {}

  findAll(ctx: RequestContext) {
    return this.connection
      .getRepository(ctx, PaymentGateway)
      .find({ order: { displayOrder: "ASC", name: "ASC" } });
  }

  findEnabled(ctx: RequestContext) {
    return this.connection.getRepository(ctx, PaymentGateway).find({
      where: { enabled: true },
      order: { displayOrder: "ASC", name: "ASC" },
    });
  }

  async findByCode(ctx: RequestContext, code: string): Promise<PaymentGateway | null> {
    return this.connection
      .getRepository(ctx, PaymentGateway)
      .findOne({ where: { code } });
  }

  /** Create a gateway, encrypting credentials before they touch the DB. */
  async create(
    ctx: RequestContext,
    input: {
      name: string;
      code: string;
      enabled?: boolean;
      displayOrder?: number;
      credentials: Record<string, string>;
      configuration?: Record<string, unknown>;
    },
  ): Promise<PaymentGateway> {
    const repo = this.connection.getRepository(ctx, PaymentGateway);
    const gateway = new PaymentGateway({
      name: input.name,
      code: input.code,
      enabled: input.enabled ?? false,
      displayOrder: input.displayOrder ?? 0,
      credentials: this.crypto.encryptObject(input.credentials) as any,
      configuration: (input.configuration ?? {}) as any,
    });
    return repo.save(gateway);
  }

  /** Update config and/or rotate credentials (re-encrypting on change). */
  async update(
    ctx: RequestContext,
    id: ID,
    input: {
      name?: string;
      enabled?: boolean;
      displayOrder?: number;
      credentials?: Record<string, string>;
      configuration?: Record<string, unknown>;
    },
  ): Promise<PaymentGateway> {
    const repo = this.connection.getRepository(ctx, PaymentGateway);
    const gateway = await this.connection.getEntityOrThrow(ctx, PaymentGateway, id);
    if (input.name !== undefined) gateway.name = input.name;
    if (input.enabled !== undefined) gateway.enabled = input.enabled;
    if (input.displayOrder !== undefined) gateway.displayOrder = input.displayOrder;
    if (input.configuration !== undefined) {
      gateway.configuration = { ...gateway.configuration, ...input.configuration };
    }
    if (input.credentials !== undefined) {
      gateway.credentials = this.crypto.encryptObject(
        input.credentials,
      ) as unknown as Record<string, unknown>;
    }
    return repo.save(gateway);
  }

  /** Toggle a gateway on/off by code (individual enable/disable). */
  async setEnabled(ctx: RequestContext, code: string, enabled: boolean): Promise<PaymentGateway> {
    const repo = this.connection.getRepository(ctx, PaymentGateway);
    const gateway = await this.findByCode(ctx, code);
    if (!gateway) throw new Error(`Unknown gateway "${code}"`);
    gateway.enabled = enabled;
    return repo.save(gateway);
  }

  /** Apply a new display order from an ordered list of gateway codes. */
  async reorder(ctx: RequestContext, orderedCodes: string[]): Promise<PaymentGateway[]> {
    const repo = this.connection.getRepository(ctx, PaymentGateway);
    const gateways = await repo.find();
    const byCode = new Map(gateways.map((g) => [g.code, g]));
    orderedCodes.forEach((code, index) => {
      const g = byCode.get(code);
      if (g) g.displayOrder = index;
    });
    await repo.save([...byCode.values()]);
    return this.findAll(ctx);
  }

  /** Decrypt + merge config into the runtime shape handed to provider strategies. */
  resolveConfig(gateway: PaymentGateway): ResolvedGatewayConfig {
    const secrets = this.crypto.decryptObject<{ userName: string; password: string; callbackSecret?: string }>(
      gateway.credentials as unknown as EncryptedEnvelope,
    );
    const cfg = gateway.configuration ?? {};
    return {
      gatewayId: String(gateway.id),
      code: gateway.code,
      name: gateway.name,
      baseUrl: String(cfg.baseUrl ?? ""),
      basePath: String(cfg.basePath ?? "/payment/rest/"),
      userName: secrets.userName,
      password: secrets.password,
      callbackSecret: secrets.callbackSecret,
      defaultCurrencyCode: String(cfg.defaultCurrencyCode ?? "934"),
      ipWhitelist: Array.isArray(cfg.ipWhitelist) ? (cfg.ipWhitelist as string[]) : [],
      twoPhase: Boolean(cfg.twoPhase ?? false),
      timeoutMs: Number(cfg.timeoutMs ?? 15000),
      expirationMinutes: Number(
        cfg.expirationMinutes ??
          this.options.defaultExpirationMinutes ??
          DEFAULT_EXPIRATION_MINUTES,
      ),
      returnUrl: String(cfg.returnUrl ?? ""),
      extra: (cfg.extra as Record<string, unknown>) ?? {},
    };
  }
}
