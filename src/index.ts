import "reflect-metadata";
import { bootstrap, runMigrations } from "@vendure/core";
import { config } from "./vendure-config";

import path from "path";
import express from "express";

runMigrations(config)
  .then(async () => {
    const server = await bootstrap(config);

    // 👇 docs folder serve edýäris
    server.use(
      "/docs",
      express.static(path.join(__dirname, "../docs"), {
        index: ["index.html"],
      }),
    );
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
