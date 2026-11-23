import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Logger, RequestContext, TransactionalConnection } from "@vendure/core";
import { DeliveryMethod } from "../entities/delivery-method.entity";

@Injectable()
export class DeliveryStatusService implements OnApplicationBootstrap {
  constructor(private connection: TransactionalConnection) {}
  private resetDate: string | null = null;

  onApplicationBootstrap() {
    void this.handleCloseTimeCron();
    void this.runMissedMidnightCron();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCloseTimeCron() {
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0];
    const ctx = RequestContext.empty();

    // disable methods whose closeTime has passed today
    const result = await this.connection
      .getRepository(ctx, DeliveryMethod)
      .createQueryBuilder("method")
      .update(DeliveryMethod)
      .set({ isDisabled: true })
      .where("closeTime <= :currentTime", { currentTime })
      .andWhere("isDisabled = :isDisabled", { isDisabled: false })
      .execute();

    if (result.affected && result.affected > 0) {
      Logger.info(
        `Auto-disabled (soft) ${result.affected} delivery methods due to closeTime`,
        "DeliveryStatusService",
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyResetCron() {
    this.resetAllMethod();
    this.resetDate = new Date().toDateString();
  }

  async resetAllMethod() {
    const ctx = RequestContext.empty();
    // Re-enable all delivery methods at midnight
    const result = await this.connection
      .getRepository(ctx, DeliveryMethod)
      .createQueryBuilder("method")
      .update(DeliveryMethod)
      .set({ isDisabled: false })
      .where("isDisabled = :isDisabled", { isDisabled: true })
      .execute();

    if (result.affected && result.affected > 0) {
      Logger.info(
        `Re-enabled (soft) ${result.affected} delivery methods for the new day`,
        "DeliveryStatusService",
      );
    }
  }

  async runMissedMidnightCron() {
    const today = new Date().toDateString();
    if (this.resetDate === today) return;

    this.resetAllMethod();
  }
}
