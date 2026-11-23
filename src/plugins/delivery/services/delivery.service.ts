import { Injectable } from "@nestjs/common";
import {
  assertFound,
  ID,
  ListQueryBuilder,
  Order,
  OrderService,
  PaginatedList,
  RequestContext,
  ShippingMethod,
  TransactionalConnection,
  TranslatableSaver,
  TranslatorService,
  ChannelService,
} from "@vendure/core";
import { Day, DayType } from "../entities/day.entity";
import { DeliveryMethod } from "../entities/delivery-method.entity";
import { DayTranslation } from "../entities/day-translation.entity";
import { DeliveryMethodTranslation } from "../entities/delivery-method-translation.entity";
import { In } from "typeorm";
import { addDays } from "date-fns";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { DeliveryCredentialGroup } from "../types";

@Injectable()
export class DeliveryService {
  constructor(
    private connection: TransactionalConnection,
    private translatableSaver: TranslatableSaver,
    private translator: TranslatorService,
    private listQueryBuilder: ListQueryBuilder,
    private orderService: OrderService,
    private channelService: ChannelService,
  ) {}
  private static readonly defaultLabels: Record<string, string[]> = {
    tm: ["Şu gün", "Ertir", "Birigün"],
    ru: ["Сегодня", "Завтра", "Послезавтра"],
    en: ["Today", "Tomorrow", "Day after tomorrow"],
  };

  private static readonly expressLabels: Record<string, string> = {
    tm: "Ekspress",
    ru: "Экспресс",
    en: "Express",
  };

  async findAllDays(
    ctx: RequestContext,
    options?: any,
  ): Promise<PaginatedList<Day>> {
    const qb = this.listQueryBuilder.build(Day, options, {
      relations: [
        "translations",
        "deliveryMethods",
        "deliveryMethods.translations",
      ],
      ctx,
    });

    return qb.getManyAndCount().then(async ([items, totalItems]) => {
      const translatedItems = await Promise.all(
        items.map(async (item) => {
          const translated = this.translator.translate(item, ctx);
          (translated as any).date = this.calculateDateForDay(translated);
          if (translated.deliveryMethods) {
            translated.deliveryMethods = translated.deliveryMethods.map((m) =>
              this.translator.translate(m, ctx),
            );
          }
          return translated;
        }),
      );
      return {
        items: translatedItems,
        totalItems,
      };
    });
  }

  async findOneDay(ctx: RequestContext, id: ID): Promise<Day | null> {
    const day = await this.connection.getRepository(ctx, Day).findOne({
      where: { id },
      relations: [
        "translations",
        "deliveryMethods",
        "deliveryMethods.translations",
      ],
    });

    if (!day) return null;
    const translated = this.translator.translate(day, ctx);
    (translated as any).date = this.calculateDateForDay(translated);
    if (translated.deliveryMethods) {
      translated.deliveryMethods = translated.deliveryMethods.map((m) =>
        this.translator.translate(m, ctx),
      );
    }
    return translated;
  }

  async findDeliveryMethods(
    ctx: RequestContext,
    options?: any,
  ): Promise<PaginatedList<DeliveryMethod>> {
    const qb = this.listQueryBuilder.build(DeliveryMethod, options, {
      relations: ["translations", "days", "days.translations"],
      ctx,
    });

    return qb.getManyAndCount().then(async ([items, totalItems]) => {
      const translatedItems = await Promise.all(
        items.map(async (item) => {
          const translated = this.translator.translate(item, ctx);
          if (translated.days) {
            translated.days = translated.days.map((d) =>
              this.translator.translate(d, ctx),
            );
          }
          return translated;
        }),
      );
      return {
        items: translatedItems,
        totalItems,
      };
    });
  }

  async findOneMethod(
    ctx: RequestContext,
    id: ID,
  ): Promise<DeliveryMethod | null> {
    const method = await this.connection
      .getRepository(ctx, DeliveryMethod)
      .findOne({
        relations: ["translations", "days", "days.translations"],
        where: { id },
      });
    if (!method) return null;

    const translated = this.translator.translate(method, ctx);
    if (translated.days) {
      translated.days = translated.days.map((d) =>
        this.translator.translate(d, ctx),
      );
    }
    return translated;
  }

  async createDay(ctx: RequestContext, input: any): Promise<Day> {
    const day = await this.translatableSaver.create({
      ctx,
      input,
      entityType: Day,
      translationType: DayTranslation,
    });

    return assertFound(this.findOneDay(ctx, day.id));
  }

  async updateDay(ctx: RequestContext, input: any): Promise<Day> {
    const day = await this.translatableSaver.update({
      ctx,
      input,
      entityType: Day,
      translationType: DayTranslation,
    });

    return assertFound(this.findOneDay(ctx, day.id));
  }

  async deleteDay(ctx: RequestContext, id: ID): Promise<boolean> {
    const day = await this.connection.getEntityOrThrow(ctx, Day, id);
    await this.connection.getRepository(ctx, Day).softRemove(day);
    return true;
  }

  async createDeliveryMethod(
    ctx: RequestContext,
    input: any,
  ): Promise<DeliveryMethod> {
    const method = await this.translatableSaver.create({
      ctx,
      input,
      entityType: DeliveryMethod,
      translationType: DeliveryMethodTranslation,
      beforeSave: async (m) => {
        if (input.dayIds?.length) {
          m.days = await this.connection
            .getRepository(ctx, Day)
            .find({ where: { id: In(input.dayIds) } });
        } else {
          m.days = [];
        }
      },
    });

    return assertFound(this.findOneMethod(ctx, method.id));
  }

  async updateDeliveryMethod(
    ctx: RequestContext,
    input: any,
  ): Promise<DeliveryMethod> {
    const method = await this.translatableSaver.update({
      ctx,
      input,
      entityType: DeliveryMethod,
      translationType: DeliveryMethodTranslation,
      beforeSave: async (m) => {
        if (input.dayIds !== undefined) {
          m.days = input.dayIds.length
            ? await this.connection
                .getRepository(ctx, Day)
                .find({ where: { id: In(input.dayIds) } })
            : [];
        }
      },
    });

    return assertFound(this.findOneMethod(ctx, method.id));
  }

  async deleteDeliveryMethod(ctx: RequestContext, id: ID): Promise<boolean> {
    const method = await this.connection.getEntityOrThrow(
      ctx,
      DeliveryMethod,
      id,
    );
    await this.connection.getRepository(ctx, DeliveryMethod).softRemove(method);
    return true;
  }

  async editButtonState(ctx: RequestContext, id: ID): Promise<DeliveryMethod> {
    const repo = this.connection.getRepository(ctx, DeliveryMethod);
    const method = await this.connection.getEntityOrThrow(
      ctx,
      DeliveryMethod,
      id,
    );

    method.enabled = !method.enabled;
    await repo.save(method);

    return assertFound(this.findOneMethod(ctx, id));
  }

  async resetAllCounts(ctx: RequestContext): Promise<void> {
    await this.connection
      .getRepository(ctx, DeliveryMethod)
      .update({}, { enabled: true });
  }

  private calculateDateForDay(day: Day): string | null {
    if (day.type === DayType.express) {
      return null;
    }

    const date = new Date();
    date.setDate(date.getDate() + (day.dayOffset ?? 0));
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async applyDeliveryMethod(
    ctx: RequestContext,
    orderId: ID,
    deliveryMethodId: ID,
  ): Promise<Order> {
    const order = await this.connection.getEntityOrThrow(ctx, Order, orderId, {
      relations: ["lines", "shippingLines", "promotions", "surcharges"],
    });

    order.customFields.deliveryMethod = await this.connection.getEntityOrThrow(
      ctx,
      DeliveryMethod,
      deliveryMethodId,
    );
    await this.connection.getRepository(ctx, Order).save(order);

    const sm = (
      await this.connection.getRepository(ctx, ShippingMethod).find()
    ).find(
      (s) =>
        s.calculator?.code === "delivery-shipping-calculator" && !s.deletedAt,
    );

    if (!sm)
      throw new Error(
        'Active shipping method not found for "delivery-shipping-calculator"',
      );

    const result = await this.orderService.setShippingMethod(ctx, orderId, [
      sm.id,
    ]);
    if (result && "id" in result) return result as Order;
    throw new Error(
      (result as any).message || "Failed to apply shipping method",
    );
  }

  async getDeliveryGroups(
    ctx: RequestContext,
    channelId: string,
  ): Promise<DeliveryCredentialGroup[]> {
    const channel = await this.channelService.findOne(ctx, channelId);
    const dayLimit = (channel?.customFields as any)?.dayLimit ?? 2;

    const { items: methods } = await this.findDeliveryMethods(ctx, {
      filter: { enabled: { eq: true } },
    });
    const nowInTm = toZonedTime(new Date(), "Asia/Ashgabat");
    const groups: DeliveryCredentialGroup[] = [];

    const expressMethods = methods.filter((m) => m.type === "express");
    if (expressMethods.length > 0) {
      groups.push({
        key: 4,
        day: this.getLabels("express", ctx.languageCode),
        type: "express",
        data: expressMethods,
        date: null,
      });
    }
    const defaultMethods = methods.filter((m) => m.type === "default");

    if (defaultMethods.length > 0) {
      for (let offset = 0; offset < dayLimit; offset++) {
        const isToday = offset === 0;
        const data = defaultMethods.map((method) => ({
          ...method,
          isDisabled: isToday ? method.isDisabled : false,
        }));

        const targetDate = addDays(nowInTm, offset);
        groups.push({
          key: offset + 1,
          day: this.getLabels(offset, ctx.languageCode),
          type: "default",
          date: formatInTimeZone(targetDate, "Asia/Ashgabat", "dd.MM.yyyy"),
          data,
        });
      }
    }

    return groups;
  }

  private getLabels(offset: number | "express", lang: string): string {
    if (offset === "express") {
      return DeliveryService.expressLabels[lang] ?? "Ekspress";
    }

    return (DeliveryService.defaultLabels[lang] ??
      DeliveryService.defaultLabels["tm"])[offset];
  }
}
