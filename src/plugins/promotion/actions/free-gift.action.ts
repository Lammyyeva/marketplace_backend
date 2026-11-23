import {
  ID,
  idsAreEqual,
  Injector,
  isGraphQlErrorResult,
  LanguageCode,
  Logger,
  OrderLine,
  OrderService,
  PromotionOrderAction,
  RequestContext,
} from "@vendure/core";

const loggerCtx = "FreeGiftAction";
let orderService: OrderService;

export const freeGiftAction = new PromotionOrderAction({
  code: "free_gift",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "Add a free gift product to the order",
    },
  ],
  args: {
    productVariantIds: {
      type: "ID",
      list: true,
      ui: { component: "product-selector-form-input" },
      label: [
        { languageCode: LanguageCode.en, value: "Gift product variants" },
      ],
      description: [
        {
          languageCode: LanguageCode.en,
          value: "The product variants to add as free gifts.",
        },
      ],
    },
    maxQtyPerOrder: {
      type: "int",
      defaultValue: 1,
      label: [{ languageCode: LanguageCode.en, value: "Gift units per order" }],
      description: [
        {
          languageCode: LanguageCode.en,
          value: "How many units of the gift to add per order.",
        },
      ],
    },
  },

  init(injector: Injector) {
    orderService = injector.get(OrderService);
  },

  execute(ctx: RequestContext, order, args, state, promotion) {
    const giftIds = (args.productVariantIds ?? []) as ID[];
    const maxQtyPerOrder = args.maxQtyPerOrder ?? 1;

    let totalDiscount = 0;
    let unitsDiscountedCount = 0;

    for (const line of order.lines) {
      if (
        giftIds.length > 0 &&
        !giftIds.some((id) => idsAreEqual(id, line.productVariant.id))
      ) {
        continue;
      }

      const unitPrice = ctx.channel.pricesIncludeTax
        ? line.unitPriceWithTax
        : line.unitPrice;

      let unitsToDiscount = line.quantity;

      // Apply Per-Order Cap
      if (maxQtyPerOrder > 0) {
        const remainingLimit = Math.max(
          0,
          maxQtyPerOrder - unitsDiscountedCount,
        );
        unitsToDiscount = Math.min(unitsToDiscount, remainingLimit);
      }

      if (unitsToDiscount > 0) {
        totalDiscount += -(unitPrice * unitsToDiscount);
        unitsDiscountedCount += unitsToDiscount;
      }

      if (maxQtyPerOrder > 0 && unitsDiscountedCount >= maxQtyPerOrder) {
        break;
      }
    }

    return totalDiscount;
  },

  async onActivate(ctx: RequestContext, order, args, promotion) {
    const giftIds = (args.productVariantIds ?? []) as ID[];
    const maxQtyPerOrder = args.maxQtyPerOrder ?? 1;

    const unitsToAdd = maxQtyPerOrder;

    if (unitsToAdd <= 0) return;

    for (const variantId of giftIds) {
      const existingLine = order.lines.find((line) =>
        idsAreEqual(line.productVariant.id, variantId),
      );
      if (existingLine) {
        Logger.verbose(
          `Gift variant ${variantId} already in order ${order.id} — skipping`,
          loggerCtx,
        );
        continue;
      }

      try {
        const result = await orderService.addItemToOrder(
          ctx,
          order.id,
          variantId,
          unitsToAdd,
        );
        if (isGraphQlErrorResult(result)) {
          Logger.error(
            `Failed to add gift ${variantId} to order ${order.id}: ${(result as any).message}`,
            loggerCtx,
          );
        } else {
          Logger.verbose(
            `Added ${unitsToAdd} unit(s) of gift ${variantId} to order ${order.id}`,
            loggerCtx,
          );
        }
      } catch (e: any) {
        Logger.error(
          `Exception adding gift ${variantId} to order ${order.id}: ${e.message}`,
          loggerCtx,
        );
      }
    }
  },

  async onDeactivate(ctx: RequestContext, order, args) {
    const giftIds = (args.productVariantIds ?? []) as ID[];
    const giftLines: OrderLine[] = order.lines.filter((line) =>
      giftIds.some((id) => idsAreEqual(id, line.productVariant.id)),
    );

    if (giftLines.length === 0) {
      Logger.verbose(`No gift lines in order ${order.id} to remove`, loggerCtx);
      return;
    }

    for (const line of giftLines) {
      try {
        const result = await orderService.removeItemFromOrder(
          ctx,
          order.id,
          line.id,
        );
        if (isGraphQlErrorResult(result)) {
          Logger.error(
            `Failed to remove gift line ${line.id}: ${(result as any).message}`,
            loggerCtx,
          );
        } else {
          Logger.verbose(
            `Gift line ${line.id} removed from order ${order.id}`,
            loggerCtx,
          );
        }
      } catch (e: any) {
        Logger.error(
          `Exception removing gift line ${line.id}: ${e.message}`,
          loggerCtx,
        );
      }
    }
  },
});
