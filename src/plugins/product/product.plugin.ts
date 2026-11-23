import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { PluginInitOptions } from "./types";
import {
  productAdminApiExtensions,
  productShopApiExtensions,
} from "./api/api-extensions";
import {
  ProductEntityResolver,
  SearchResultEntityResolver,
} from "./api/product-entity.resolver";
import { ProductVariantEntityResolver } from "./api/product-variant-entity.resolver";
import { SearchIndexSubscriber } from "./search-index.subscriber";
import { ProductAdminResolver } from "./api/product-admin.resolver";
import { ProductShopResolver } from "./api/product-shop.resolver";
import { recommendedCollectionFilter } from "./api/recommended-collection-filter";
import { ProductService } from "./services/product.service";
import { OrderLinesCacheService } from "./services/order-lines-cache.service";
import { PRODUCT_PLUGIN_OPTIONS } from "../../apps/server/src/shared/constants";
import { ProductSearchStatEntity } from "./entities/product-search-stat.entity";
import { BoughtTogetherEntity } from "./entities/bought-together.entity";
import { BoughtTogetherService } from "./services/bought-together.service";
import { BoughtTogetherResolver } from "./api/bought-together.resolver";
import { PromotionPlugin } from "../promotion/promotion.plugin";
import { SearchMeiliPlugin } from "../search-meili/search-meili.plugin";

@VendurePlugin({
  imports: [PluginCommonModule, PromotionPlugin, SearchMeiliPlugin],
  providers: [
    {
      provide: PRODUCT_PLUGIN_OPTIONS,
      useFactory: () => ProductPlugin.options,
    },
    SearchIndexSubscriber,
    ProductService,
    OrderLinesCacheService,
    BoughtTogetherService,
  ],
  configuration: (config) => {
    config.apiOptions.middleware.push({
      route: "/dashboard/extensions/product",
      handler: (req: any, res: any, next: any) => next(),
    });
    config.catalogOptions.collectionFilters.push(recommendedCollectionFilter);
    return config;
  },
  compatibility: "^3.0.0",
  entities: [ProductSearchStatEntity, BoughtTogetherEntity],
  shopApiExtensions: {
    schema: productShopApiExtensions,
    resolvers: [
      ProductEntityResolver,
      SearchResultEntityResolver,
      ProductVariantEntityResolver,
      ProductShopResolver,
      BoughtTogetherResolver,
    ],
  },
  adminApiExtensions: {
    schema: productAdminApiExtensions,
    resolvers: [
      ProductEntityResolver,
      ProductVariantEntityResolver,
      ProductAdminResolver,
    ],
  },
  dashboard: {
    location: "./dashboard",
  },
})
export class ProductPlugin {
  // static ui = {
  //   extensionPath: path.join(__dirname, 'dashboard'),
  //   ngModules: [],
  // };
  static options: PluginInitOptions;

  static init(options: PluginInitOptions): Type<ProductPlugin> {
    this.options = options;
    return ProductPlugin;
  }
}
