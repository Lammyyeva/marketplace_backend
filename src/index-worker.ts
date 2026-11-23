import { bootstrapWorker } from "@vendure/core";
import { config } from "./vendure-config";

// Signal to all plugins that this is the worker process.
// Used by MeiliSyncListener and MeiliInitialSyncService to skip
// direct event-driven sync (which must only run in the server).
process.env.VENDURE_WORKER_CONTEXT = "true";

bootstrapWorker(config)
  .then((worker) => worker.startJobQueue())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
