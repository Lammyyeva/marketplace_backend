// typescript// src/plugins/delivery/config/delivery-shipping-calculator.ts
// import { ShippingCalculator, LanguageCode } from '@vendure/core';
// import { DataSource } from 'typeorm';
// import { DeliveryMethod } from '../entities/delivery-method.entity';

// export const deliveryShippingCalculator = new ShippingCalculator({
//   code: 'delivery-shipping-calculator',
//   description: [
//     { languageCode: LanguageCode.en, value: 'Dynamic Delivery Calculator' },
//   ],
//   args: {},

//   calculate: async (ctx, order, args, { injector }) => {
//     // Get the chosen delivery method ID from order custom fields
//     const deliveryMethodId = order.customFields?.deliveryMethodId;

//     if (!deliveryMethodId) {
//       // No delivery method chosen yet — return 0
//       return {
//         price: 0,
//         priceIncludesTax: false,
//         taxRate: 0,
//       };
//     }

//     // Fetch the DeliveryMethod from DB to get its price
//     const dataSource = injector.get(DataSource);
//     const method = await dataSource
//       .getRepository(DeliveryMethod)
//       .findOne({ where: { id: deliveryMethodId } });

//     if (!method) {
//       return { price: 0, priceIncludesTax: false, taxRate: 0 };
//     }

//     // Use minCost as the delivery price
//     // (or your own logic: free if order > 150 TMT etc.)
//     const orderSubtotal = order.subTotal;
//     const isFreeDelivery = method.maxCost === 0 && orderSubtotal >= 15000; // 150 TMT in smallest unit

//     return {
//       price: isFreeDelivery ? 0 : method.minCost * 100, // convert to smallest currency unit
//       priceIncludesTax: false,
//       taxRate: 0,
//       metadata: {
//         deliveryMethodName: method.code,
//         originalPrice: method.minCost,
//         isFreeDelivery,
//       },
//     };
//   },
// });

// Step 3: Create a Single ShippingEligibilityChecker
// typescript// src/plugins/delivery/config/delivery-shipping-checker.ts
// import { ShippingEligibilityChecker, LanguageCode } from '@vendure/core';

// export const deliveryShippingChecker = new ShippingEligibilityChecker({
//   code: 'delivery-shipping-checker',
//   description: [
//     { languageCode: LanguageCode.en, value: 'Delivery Plugin Checker' },
//   ],
//   args: {},

//   // Always eligible — your DeliveryPlugin handles
//   // the real availability logic (time, limit etc.)
//   check: (ctx, order) => {
//     return true;
//   },
// });

// Step 4: Register in VendureConfig
// typescript// vendure-config.ts
// import { deliveryShippingCalculator } from './plugins/delivery/config/delivery-shipping-calculator';
// import { deliveryShippingChecker } from './plugins/delivery/config/delivery-shipping-checker';

// export const config: VendureConfig = {
//   shippingOptions: {
//     shippingEligibilityCheckers: [
//       defaultShippingEligibilityChecker,
//       deliveryShippingChecker,       // ← add this
//     ],
//     shippingCalculators: [
//       defaultShippingCalculator,
//       deliveryShippingCalculator,    // ← add this
//     ],
//   },
// };
// ```

// ---

// ## Step 5: Create ONE ShippingMethod in Admin UI

// Go to **Admin UI → Shipping → New Shipping Method** and create just one:
// ```
// Name: "Delivery"
// Checker: delivery - shipping - checker
// Calculator: delivery - shipping - calculator
// This single Vendure ShippingMethod acts as the price bridge between your plugin and Vendure's order total.

// Step 6: Extend Shop API — Set Delivery on Order
// Add a mutation that sets both the Vendure ShippingMethod AND your custom delivery details in one call:
// typescript// api-extensions.ts — add to shopApiExtensions
// extend type Mutation {
//   setOrderDeliveryMethod(input: SetOrderDeliveryMethodInput!): Order!
// }

// input SetOrderDeliveryMethodInput {
//   deliveryMethodId: ID!      # your DeliveryMethod entity ID
//   deliveryDate: String       # "26.02.2026"
//   deliveryTimeSlot: String   # "09:00-12:00"
//   deliveryDayType: String    # "express" | "today" | "tomorrow"
// }
// typescript// shop.resolver.ts
// import {
//   Args, Mutation, Query, Resolver
// } from '@nestjs/graphql';
// import {
//   Allow, Ctx, Permission,
//   RequestContext, OrderService,
//   ActiveOrderService, Transaction,
// } from '@vendure/core';
// import { DeliveryService } from '../services/delivery.service';

// @Resolver()
// export class ShopResolver {
//   constructor(
//     private deliveryService: DeliveryService,
//     private orderService: OrderService,
//     private activeOrderService: ActiveOrderService,
//   ) { }

//   // ... your existing queries ...

//   @Transaction()
//   @Mutation()
//   @Allow(Permission.Public)
//   async setOrderDeliveryMethod(
//     @Ctx() ctx: RequestContext,
//     @Args('input') input: {
//       deliveryMethodId: string;
//       deliveryDate?: string;
//       deliveryTimeSlot?: string;
//       deliveryDayType?: string;
//     },
//   ) {
//     // 1. Get the active order
//     const order = await this.activeOrderService.getActiveOrder(ctx, undefined);
//     if (!order) throw new Error('No active order found');

//     // 2. Verify the chosen DeliveryMethod exists and is available
//     const method = await this.deliveryService.findOneMethod(ctx, input.deliveryMethodId);
//     if (!method) throw new Error('Delivery method not found');
//     if (!method.enabled) throw new Error('Delivery method is not available');

//     // 3. Save delivery details to order custom fields
//     await this.orderService.updateCustomFields(ctx, order.id, {
//       deliveryMethodId: input.deliveryMethodId,
//       deliveryDate: input.deliveryDate,
//       deliveryTimeSlot: input.deliveryTimeSlot,
//       deliveryDayType: input.deliveryDayType,
//     });

//     // 4. Set the single Vendure ShippingMethod on the order
//     // This triggers the calculator which reads deliveryMethodId
//     // and returns the correct price
//     const DELIVERY_SHIPPING_METHOD_ID = '1'; // the ID of the ShippingMethod you created in Admin UI
//     await this.orderService.setShippingMethod(ctx, order.id, [DELIVERY_SHIPPING_METHOD_ID]);

//     // 5. Return updated order with new total
//     return this.orderService.findOne(ctx, order.id);
//   }
// }
