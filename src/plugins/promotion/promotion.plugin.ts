import {
  EventBus,
  LanguageCode,
  Logger,
  Order,
  OrderPlacedEvent,
  PluginCommonModule,
  Promotion,
  PromotionService,
  TransactionalConnection,
  Type,
  VendurePlugin,
} from "@vendure/core";

import { PROMOTION_PLUGIN_OPTIONS } from "./constants";
import { PluginInitOptions } from "./types";
import {
  containsVariantsCondition,
  limitPerOrderCondition,
  alwaysTrueCondition,
  eligibleSubtotalAmountCondition,
} from "./conditions";
import {
  buyXgetYAction,
  freeGiftAction,
  perVariantDiscountAction,
  facetBasedDiscountCustomAction,
  categoryBasedDiscountAction,
  globalItemPercentageDiscountAction,
} from "./actions";
import { ActiveSaleService } from "./services/active-sale.service";
import { PromotionStatusListener } from "./services/promotion-status.listener";
import { PromotionSubscriber } from "./services/promotion.subscriber";
import { shopApiExtensions, adminApiExtensions } from "./api/schema";
import { ProductVariantSaleResolver } from "./api/shop.resolver";
import { PromotionAdminResolver } from "./api/promotion-admin.resolver";
import { VariantSoldCountService } from "./services/variant-sold-count.service";
import { saleCollectionFilter } from "./api/sale-collection-filter";
import { PromotionCollectionSyncService } from "./services/promotion-collection-sync.service";
import { ActiveSaleSyncService } from "./services/active-sale-sync.service";
import { PromotionVariantSale } from "./entities/promotion-variant-sale.entity";
import { ActiveSaleLookup } from "./entities/active-sale-lookup.entity";
import { OnApplicationBootstrap } from "@nestjs/common";

export const customPromotionConditions = [
  alwaysTrueCondition,
  limitPerOrderCondition,
  containsVariantsCondition,
  eligibleSubtotalAmountCondition,
];

export const customPromotionActions = [
  buyXgetYAction,
  freeGiftAction,
  perVariantDiscountAction,
  facetBasedDiscountCustomAction,
  categoryBasedDiscountAction,
  globalItemPercentageDiscountAction,
];

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [PromotionVariantSale, ActiveSaleLookup],
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ProductVariantSaleResolver],
  },
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [PromotionAdminResolver],
  },
  providers: [
    ActiveSaleService,
    PromotionStatusListener,
    PromotionSubscriber,
    PromotionCollectionSyncService,
    ActiveSaleSyncService,
    VariantSoldCountService,
    {
      provide: PROMOTION_PLUGIN_OPTIONS,
      useFactory: () => PromotionPlugin.options,
    },
  ],
  configuration: (config) => {
    config.catalogOptions.collectionFilters.push(saleCollectionFilter);
    return config;
  },
  compatibility: "^3.0.0",
  dashboard: {
    location: "./dashboard",
  },
})
export class PromotionPlugin {
  static options: PluginInitOptions;

  static init(options: PluginInitOptions): Type<PromotionPlugin> {
    this.options = options;
    return PromotionPlugin;
  }
}
