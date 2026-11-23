import { bootstrapWorker, TransactionalConnection, RequestContext, LanguageCode } from "@vendure/core";
import { config } from "../vendure-config";
import * as fs from "fs";
import * as path from "path";
import { Label } from "../plugins/label/entities/label.entity";
import { LabelTranslation } from "../plugins/label/entities/label-translation.entity";
import { LabelPlugin } from "../plugins/label/label.plugin";

async function seedLabels() {
  console.log("Starting label seeding...");
  
  // Use worker bootstrap to avoid starting the API server and background tasks
  const seedConfig = {
    ...config,
    dbConnectionOptions: {
      ...config.dbConnectionOptions,
      synchronize: false,
    },
  };

  const worker = await bootstrapWorker(seedConfig as any);
  const connection = worker.app.get(TransactionalConnection);

  const dataPath = path.join(__dirname, "../../label-data.json");
  if (!fs.existsSync(dataPath)) {
    console.error(`Seed data file not found at ${dataPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  // Create a default RequestContext
  const ctx = new RequestContext({
    apiType: "admin",
    isAuthorized: true,
    authorizedAsOwnerOnly: false,
    channel: {} as any,
    languageCode: LanguageCode.tk,
  });

  try {
    await connection.rawConnection.transaction(async (manager) => {
      console.log("Cleaning up existing static translations (if any)...");
      const labelIds = data.labels.map((l: any) => l.id);

      // We use raw queries or manager to handle exact IDs and sequence resets in Postgres
      for (const labelData of data.labels) {
        console.log(`Processing label: ${labelData.code} (ID: ${labelData.id})`);

        // Check if label exists
        const existing = await manager.findOne(Label, { where: { id: labelData.id } });
        if (existing) {
          console.log(`Label with ID ${labelData.id} already exists. Updating...`);
          await manager.update(Label, labelData.id, {
            code: labelData.code,
            color: labelData.color,
            enabled: labelData.enabled,
            sort: labelData.sort,
          });
        } else {
          await manager.query(
            `INSERT INTO "label" ("id", "code", "color", "enabled", "sort", "createdAt", "updatedAt") 
             VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
            [labelData.id, labelData.code, labelData.color, labelData.enabled, labelData.sort]
          );
        }
      }

      for (const trans of data.translations) {
        const existingTrans = await manager.findOne(LabelTranslation, {
          where: {
            base: { id: trans.baseId } as any,
            languageCode: trans.languageCode
          }
        });

        if (existingTrans) {
          await manager.update(LabelTranslation, existingTrans.id, { name: trans.name });
        } else {
          await manager.save(LabelTranslation, {
            languageCode: trans.languageCode,
            name: trans.name,
            base: { id: trans.baseId } as any,
          });
        }
      }

      // Reset sequence for Postgres to avoid ID conflicts in future auto-increments
      console.log("Resetting PostgreSQL sequences...");
      await manager.query(`SELECT setval(pg_get_serial_sequence('label', 'id'), coalesce(max(id), 1)) FROM label;`);
      await manager.query(`SELECT setval(pg_get_serial_sequence('label_translation', 'id'), coalesce(max(id), 1)) FROM label_translation;`);
    });

    console.log("Seeding completed successfully.");
  } catch (err) {
    console.error("Error during seeding:", err);
  } finally {
    await worker.app.close();
    process.exit(0);
  }
}

seedLabels();
