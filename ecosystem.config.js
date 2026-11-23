/**
 * PM2 Ecosystem — Vendure backend
 *
 * Two separate processes so PM2 can independently restart each one.
 * Previously both ran via `concurrently` inside a single PM2 entry,
 * which meant a crashed worker was invisible to PM2.
 */
module.exports = {
  apps: [
    {
      name: "vendure-server",
      script: "node",
      args: "./dist/index.js",
      instances: 1,
      exec_mode: "fork",

      env: {
        NODE_ENV: "production",
        APP_ENV: "production",
      },

      error_file: "./logs/server-error.log",
      out_file: "./logs/server-out.log",

      autorestart: true,
      max_memory_restart: "1G",

      // Graceful shutdown: give in-flight requests time to finish
      kill_timeout: 10000,
      wait_ready: false,
    },

    {
      name: "vendure-worker",
      script: "node",
      args: "./dist/index-worker.js",
      instances: 1,
      exec_mode: "fork",

      env: {
        NODE_ENV: "production",
        APP_ENV: "production",
        // VENDURE_WORKER_CONTEXT is set programmatically in index-worker.ts
        // but setting it here as well ensures it's present before any module
        // is loaded (important for modules evaluated at import time).
        VENDURE_WORKER_CONTEXT: "true",
      },

      error_file: "./logs/worker-error.log",
      out_file: "./logs/worker-out.log",

      autorestart: true,
      max_memory_restart: "1G",

      kill_timeout: 30000, // worker needs more time to finish in-flight jobs
      wait_ready: false,
    },
  ],
};
