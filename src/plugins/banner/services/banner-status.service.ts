import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Logger, RequestContext, TransactionalConnection } from "@vendure/core";
import { Banner } from "../entities/banner.entity";

@Injectable()
export class BannerStatusService implements OnApplicationBootstrap {
  constructor(private connection: TransactionalConnection) {}

  onApplicationBootstrap() {
    void this.syncBannerStatuses();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    Logger.info(
      "Running scheduled banner status sync (Daily at Midnight)",
      "BannerStatusService",
    );
    await this.syncBannerStatuses();
  }

  private async syncBannerStatuses() {
    const now = new Date();
    const ctx = RequestContext.empty();

    //enable banners
    const enableResult = await this.connection
      .getRepository(ctx, Banner)
      .createQueryBuilder("banner")
      .update(Banner)
      .set({ enabled: true })
      .where("startDate <= :now AND endDate >= :now", { now })
      .andWhere("enabled = :enabled", { enabled: false })
      .execute();

    if (enableResult.affected && enableResult.affected > 0) {
    }

    // Disable banners
    const disableResult = await this.connection
      .getRepository(ctx, Banner)
      .createQueryBuilder("banner")
      .update(Banner)
      .set({ enabled: false })
      .where("(startDate > :now OR endDate < :now)", { now })
      .andWhere("enabled = :enabled", { enabled: true })
      .execute();

    if (disableResult.affected && disableResult.affected > 0) {
    }
  }
}
