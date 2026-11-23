import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { Worker } from "./entities/worker.entity";
import { WorkerService } from "./services/worker.service";
import { WorkerAdminResolver, WorkerOrderResolver } from "./api/worker-admin.resolver";
import { adminApiExtensions, shopApiExtensions } from "./api/api-extensions";

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [Worker],
  providers: [WorkerService],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [WorkerAdminResolver, WorkerOrderResolver],
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [WorkerOrderResolver],
  },
  dashboard: {
    location: "./dashboard",
  },
})
export class WorkerPlugin {}

