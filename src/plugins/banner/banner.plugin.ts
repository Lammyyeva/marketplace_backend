import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { ScheduleModule } from "@nestjs/schedule";

import { PluginInitOptions } from "./types";
import { Banner } from "./entities/banner.entity";
import { BannerAsset } from "./entities/banner-asset.entity";
import { adminApiExtensions, commonApiExtensions } from "./api/api-extensions";
import { BANNER_PLUGIN_OPTIONS } from "../../apps/server/src/shared/constants";
import {
  BannerEntityResolver,
  BannerTypeEntityResolver,
} from "./api/banner-entity.resolver";
import { BannerAdminResolver } from "./api/banner-admin.resolver";
import { BannerShopResolver } from "./api/banner-shop.resolver";
import { BannerService } from "./services/banner.service";
import { BannerStatusService } from "./services/banner-status.service";
import { BannerTranslation } from "./entities/banner-translation.entity";
import { BannerType } from "./entities/banner-type.entity";
import { BannerTypeTranslation } from "./entities/banner-type-translation.entity";

@VendurePlugin({
  imports: [PluginCommonModule, ScheduleModule.forRoot()],
  providers: [
    { provide: BANNER_PLUGIN_OPTIONS, useFactory: () => BannerPlugin.options },
    BannerService,
    BannerStatusService,
  ],
  configuration: (config) => {
    // Plugin-specific configuration
    // such as custom fields, custom permissions,
    // strategies etc. can be configured here by
    // modifying the `config` object.
    return config;
  },
  compatibility: "^3.0.0",
  entities: [
    Banner,
    BannerAsset,
    BannerTranslation,
    BannerType,
    BannerTypeTranslation,
  ],
  shopApiExtensions: {
    schema: commonApiExtensions,
    resolvers: [
      BannerEntityResolver,
      BannerShopResolver,
      BannerTypeEntityResolver,
    ],
  },
  adminApiExtensions: {
    schema: adminApiExtensions, //needs for common api extentions
    resolvers: [
      BannerEntityResolver,
      BannerAdminResolver,
      BannerTypeEntityResolver,
    ],
  },
  dashboard: {
    location: "./dashboard",
  },
})
export class BannerPlugin {
  static options: PluginInitOptions;

  static init(options: PluginInitOptions): Type<BannerPlugin> {
    this.options = options;
    return BannerPlugin;
  }
}
