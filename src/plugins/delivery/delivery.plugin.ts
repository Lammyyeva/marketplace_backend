import { PluginCommonModule, Type, VendurePlugin } from "@vendure/core";
import { ScheduleModule } from "@nestjs/schedule";

import { DELIVERY_PLUGIN_OPTIONS } from "../../apps/server/src/shared/constants";
import { PluginInitOptions } from "./types";
import { Day } from "./entities/day.entity";
import { DayTranslation } from "./entities/day-translation.entity";
import { DeliveryMethod } from "./entities/delivery-method.entity";
import { DeliveryMethodTranslation } from "./entities/delivery-method-translation.entity";
import { adminApiExtensions, shopApiExtensions } from "./api/api-extension";
import { AdminResolver } from "./api/delivery-admin.resolver";
import {
  ShopResolver,
  OrderDeliveryResolver,
} from "./api/delivery-shop.resolver";
import { DeliveryService } from "./services/delivery.service";
import { DeliveryStatusService } from "./services/delivery-status.service";
import { deliveryEligibilityChecker } from "./config/delivery-shipping-checker";
import { deliveryShippingCalculator } from "./config/delivery-shipping-calculator";

@VendurePlugin({
  imports: [PluginCommonModule, ScheduleModule.forRoot()],
  providers: [
    {
      provide: DELIVERY_PLUGIN_OPTIONS,
      useFactory: () => DeliveryPlugin.options,
    },
    DeliveryService,
    DeliveryStatusService,
  ],
  adminApiExtensions: {
    schema: adminApiExtensions,
    resolvers: [AdminResolver, OrderDeliveryResolver],
  },
  shopApiExtensions: {
    schema: shopApiExtensions,
    resolvers: [ShopResolver, OrderDeliveryResolver],
  },
  configuration: (config) => {
    config.shippingOptions.shippingEligibilityCheckers.push(
      deliveryEligibilityChecker,
    );
    config.shippingOptions.shippingCalculators.push(deliveryShippingCalculator);
    return config;
  },
  compatibility: "^3.0.0",
  entities: [Day, DayTranslation, DeliveryMethod, DeliveryMethodTranslation],
  dashboard: {
    location: "./dashboard",
  },
})
export class DeliveryPlugin {
  static options: PluginInitOptions;

  static init(options: PluginInitOptions): Type<DeliveryPlugin> {
    this.options = options;
    return DeliveryPlugin;
  }
}
