import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { TransactionalConnection } from "@vendure/core";
import * as fs from "fs";
import * as path from "path";
import { Label } from "../entities/label.entity";
import { LabelTranslation } from "../entities/label-translation.entity";

@Injectable()
export class LabelSeederService implements OnApplicationBootstrap {
  constructor(private connection: TransactionalConnection) {}

  // Runs automatically after the app fully boots
  async onApplicationBootstrap() {
    await this.seedIfNeeded();
  }

  private async seedIfNeeded() {
    const manager = this.connection.rawConnection.manager;

    // Guard: skip if data already exists
    const count = await manager.count(Label);
    if (count > 0) {
      console.log("[LabelSeeder] Labels already seeded, skipping.");
      return;
    }

    // Try multiple possible paths for the data file (dev vs production builds)
    const possiblePaths = [
      path.join(__dirname, "../../../../label-data.json"),
      path.join(__dirname, "../../../label-data.json"),
      path.join(process.cwd(), "label-data.json"),
    ];

    let dataPath: string | undefined;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        dataPath = p;
        break;
      }
    }

    if (!dataPath) {
      console.warn(
        `[LabelSeeder] Seed file not found in any expected location, skipping.`,
      );
      return;
    }

    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    console.log("[LabelSeeder] Seeding labels...");

    try {
      await this.connection.rawConnection.transaction(async (txManager) => {
        for (const labelData of data.labels) {
          await txManager.query(
            `INSERT INTO "label" ("id", "code", "color", "enabled", "sort", "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
             ON CONFLICT ("id") DO NOTHING`,
            [
              labelData.id,
              labelData.code,
              labelData.color,
              labelData.enabled,
              labelData.sort,
            ],
          );
        }

        for (const trans of data.translations) {
          await txManager.save(LabelTranslation, {
            languageCode: trans.languageCode,
            name: trans.name,
            base: { id: trans.baseId },
          });
        }

        await txManager.query(
          `SELECT setval(pg_get_serial_sequence('label', 'id'), coalesce(max(id), 1)) FROM label;`,
        );
        await txManager.query(
          `SELECT setval(pg_get_serial_sequence('label_translation', 'id'), coalesce(max(id), 1)) FROM label_translation;`,
        );
      });

      console.log("[LabelSeeder] Seeding completed successfully.");
    } catch (err) {
      // Log but don't crash the server
      console.error("[LabelSeeder] Seeding failed:", err);
    }
  }
}
