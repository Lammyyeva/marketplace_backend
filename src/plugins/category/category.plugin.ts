import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { PluginInitOptions } from "./types";
import { Category } from "./entities/category.entity";
import { CategoryType } from "./entities/category-type.entity";
import { shopApiExtensions, adminApiExtensions } from "./api/api-extensions";
import {
  CategoryEntityResolver,
  CategoryTypeEntityResolver,
  // FacetValueEntityResolver,
} from "./api/category-entity.resolver";
import { CategoryAdminResolver } from "./api/category-admin.resolver";
import { CategoryShopResolver } from "./api/category-shop.resolver";
import { CategoryService } from "./services/category.service";
import { CategoryTranslation } from "./entities/category-translation.entity";
import { CategoryTypeTranslation } from "./entities/category-type-translation.entity";
import { CATEGORY_PLUGIN_OPTIONS } from "../../apps/server/src/shared/constants";

@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [
    {
      provide: CATEGORY_PLUGIN_OPTIONS,
      useFactory: () => CategoryPlugin.options,
    },
    CategoryService,
  ],
  configuration: (config) => {
    return config;
  },
  compatibility: "^3.0.0",
  entities: [
    Category,
    CategoryType,
    CategoryTranslation,
    CategoryTypeTranslation,
  ],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [
      CategoryEntityResolver,
      CategoryTypeEntityResolver,
      //FacetValueEntityResolver,
      CategoryShopResolver,
    ],
  },
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [
      CategoryEntityResolver,
      CategoryTypeEntityResolver,
      // FacetValueEntityResolver,
      CategoryAdminResolver,
    ],
  },
  dashboard: {
    location: "./dashboard",
  },
})
export class CategoryPlugin {
  static options: PluginInitOptions;

  static init(options: PluginInitOptions): Type<CategoryPlugin> {
    this.options = options;
    return CategoryPlugin;
  }
}
