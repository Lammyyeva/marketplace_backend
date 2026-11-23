import "reflect-metadata";
import {
  generateMigration,
  runMigrations,
  revertLastMigration,
} from "@vendure/core";
import { config } from "./vendure-config";
import path from "path";

console.log("compile-migrations.ts started", { argv: process.argv.slice(2) });
const command = process.argv[2];

if (!command) {
  process.exit(1);
}

const migrationConfig = {
  ...config,
  dbConnectionOptions: {
    ...config.dbConnectionOptions,
    synchronize: false,
  },
};

if (command === "generate") {
  const migrationName = process.argv[3] || "v3-upgrade";
  generateMigration(migrationConfig, {
    name: migrationName,
    outputDir: path.join(__dirname, "migrations"),
  })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} else if (command === "run") {
  runMigrations(migrationConfig)
    .then(() => process.exit(0))
    .catch(async (err) => {
      console.error("=== MIGRATION ERROR ===");
      console.error(err);
      console.error(err instanceof Error ? err.stack : "no stack");
      try {
        const util = await import("util");
        console.error(util.inspect(err, { showHidden: true, depth: 10 }));
      } catch (inspectErr) {
        console.error("inspect failed", inspectErr);
      }
      try {
        console.error(JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
      } catch (jsonErr) {
        console.error("JSON stringify failed", jsonErr);
      }
      process.exit(1);
    });
} else if (command === "revert") {
  revertLastMigration(migrationConfig)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
