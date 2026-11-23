import { PluginCommonModule, VendurePlugin } from "@vendure/core";
import { Label } from "./entities/label.entity";
import { LabelTranslation } from "./entities/label-translation.entity";
import { shopApiExtensions, adminApiExtensions } from "./api/api-extensions";
import { LabelEntityResolver } from "./api/label-entity.resolver";
import { LabelShopResolver } from "./api/label-shop.resolver";
import { LabelAdminResolver } from "./api/label-admin.resolver";
import { LabelService } from "./services/label.service";
import { labelCollectionFilter } from "./api/label-collection-filter";
import { ProductLabelTracker } from "./entities/product-label-tracker.entity";
import { LabelTrackerService } from "./services/label-tracker.service";
import { LabelSeederService } from "./services/label-seeder.service";
import { ScheduleModule } from "@nestjs/schedule";

@VendurePlugin({
  imports: [PluginCommonModule, ScheduleModule.forRoot()],
  providers: [LabelService, LabelTrackerService, LabelSeederService],
  entities: [Label, LabelTranslation, ProductLabelTracker],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [LabelEntityResolver, LabelShopResolver],
  },
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [LabelEntityResolver, LabelAdminResolver],
  },
  dashboard: {
    location: "./dashboard", // determine if it is needed or not, it might not be needed
  },
  configuration: (config) => {
    config.catalogOptions.collectionFilters.push(labelCollectionFilter);
    return config;
  },
})
export class LabelPlugin {}
