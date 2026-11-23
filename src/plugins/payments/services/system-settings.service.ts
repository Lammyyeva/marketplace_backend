import { Injectable } from "@nestjs/common";
import { RequestContext, TransactionalConnection } from "@vendure/core";
import { SystemSettings } from "../entities/system-settings.entity";

/**
 * Accessor for the singleton SystemSettings row. Lazily creates the record on
 * first access so a fresh install defaults to online payments enabled.
 */
@Injectable()
export class SystemSettingsService {
  constructor(private connection: TransactionalConnection) {}

  async get(ctx: RequestContext): Promise<SystemSettings> {
    const repo = this.connection.getRepository(ctx, SystemSettings);
    let settings = await repo.findOne({ where: {}, order: { createdAt: "ASC" } });
    if (!settings) {
      settings = await repo.save(new SystemSettings({ onlinePaymentEnabled: true }));
    }
    return settings;
  }

  async isOnlinePaymentEnabled(ctx: RequestContext): Promise<boolean> {
    return (await this.get(ctx)).onlinePaymentEnabled;
  }

  async setOnlinePaymentEnabled(ctx: RequestContext, enabled: boolean): Promise<SystemSettings> {
    const repo = this.connection.getRepository(ctx, SystemSettings);
    const settings = await this.get(ctx);
    settings.onlinePaymentEnabled = enabled;
    return repo.save(settings);
  }
}
