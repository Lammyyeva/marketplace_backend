import {
  DeepPartial,
  HasCustomFields,
  LocaleString,
  Translatable,
  Translation,
  VendureEntity,
} from "@vendure/core";
import { Column, DeleteDateColumn, Entity, ManyToMany, OneToMany } from "typeorm";

import { DeliveryMethodTranslation } from "./delivery-method-translation.entity";
import { Day } from "./day.entity";

export enum DeliveryMethodType {
  "express" = "express",
  "default" = "default",
  "pickUp" = "pickUp",
  "interval" = "interval",
}

export class DeliveryMethodCustomFields {}

@Entity()
export class DeliveryMethod
  extends VendureEntity
  implements Translatable, HasCustomFields
{
  constructor(input?: DeepPartial<DeliveryMethod>) {
    super(input);
  }

  @Column()
  code: string;

  name: LocaleString;

  @Column({
    type: "varchar",
    default: DeliveryMethodType.default,
  })
  type: DeliveryMethodType;

  description: LocaleString;

  @Column({ default: false })
  enabled: boolean;

  @Column({ default: false })
  isDisabled: boolean;

  @Column({ default: 0 })
  sort: number;

  @Column({ type: "time" })
  from: string;

  @Column({ type: "time" })
  to: string;

  @Column({ type: "time" })
  closeTime: string;

  @Column({ default: 0 })
  maxCost: number;

  @Column({ default: 0 })
  minCost: number;

  @Column({ default: 0 })
  limitPrice: number;

  @Column({ default: true })
  showTime: boolean;

  @ManyToMany(() => Day, (day) => day.deliveryMethods)
  days: Day[];

  @Column((type) => DeliveryMethodCustomFields)
  customFields: DeliveryMethodCustomFields;

  @OneToMany(
    (type) => DeliveryMethodTranslation,
    (translation) => translation.base,
    { eager: true },
  )
  translations: Array<Translation<DeliveryMethod>>;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
