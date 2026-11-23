import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
  TransactionalConnection,
  AnonymousSession,
  AuthenticatedSession,
  Logger,
} from "@vendure/core";
import { LessThan } from "typeorm";

@Injectable()
export class AnonymousSessionCleanupService implements OnApplicationBootstrap {
  // Delete sessions older than 2 hours
  private readonly SESSION_LIFETIME_MS = 2 * 60 * 60 * 1000;

  constructor(private readonly privateconnection: TransactionalConnection) {}

  onApplicationBootstrap() {
    // Run cleanup immediately on startup to ensure consistency
    void this.cleanupSessions();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    Logger.info(
      "Running scheduled session cleanup (Hourly)",
      "AnonymousSessionCleanupService",
    );
    await this.cleanupSessions();
  }

  private async cleanupSessions() {
    const cutoffDate = new Date(Date.now() - this.SESSION_LIFETIME_MS);

    try {
      const result = await this.privateconnection.rawConnection
        .getRepository(AnonymousSession)
        .delete({
          createdAt: LessThan(cutoffDate),
        });

      if (result.affected && result.affected > 0) {
        Logger.info(
          `Cleaned up ${result.affected} anonymous sessions`,
          "AnonymousSessionCleanupService",
        );
      }

      // Clean up expired authenticated sessions
      const authResult = await this.privateconnection.rawConnection
        .getRepository(AuthenticatedSession)
        .delete({
          expires: LessThan(new Date()),
        });

      if (authResult.affected && authResult.affected > 0) {
        Logger.info(
          `Cleaned up ${authResult.affected} expired authenticated sessions`,
          "AnonymousSessionCleanupService",
        );
      }
    } catch (error: any) {
      Logger.error(
        `Error during session cleanup: ${error.message}`,
        "AnonymousSessionCleanupService",
      );
    }
  }
}
