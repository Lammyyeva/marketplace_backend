import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { TransactionalConnection, Promotion } from "@vendure/core";

@Injectable()
@EventSubscriber()
export class PromotionSubscriber
  implements EntitySubscriberInterface<Promotion>, OnApplicationBootstrap
{
  constructor(private connection: TransactionalConnection) {}

  onApplicationBootstrap() {
    this.connection.rawConnection.subscribers.push(this);
  }

  listenTo() {
    return Promotion;
  }

  beforeInsert(event: InsertEvent<Promotion>) {
    const entity = event.entity as any;

    if (!entity.customFields) {
      entity.customFields = {};
    }

    if (!entity.customFields.internalPromoCode) {
      entity.customFields.internalPromoCode = this.generateCode(6);
    }
  }

  private generateCode(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
