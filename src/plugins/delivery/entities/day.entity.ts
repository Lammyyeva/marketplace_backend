import {
  DeepPartial,
  HasCustomFields,
  LocaleString,
  Translatable,
  Translation,
  VendureEntity,
} from "@vendure/core";
import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

import { DayTranslation } from "./day-translation.entity";
import { DeliveryMethod } from "./delivery-method.entity";

export enum DayType {
  "express" = "express",
  "default" = "default",
}

export class DayCustomFields {}

@Entity()
export class Day
  extends VendureEntity
  implements Translatable, HasCustomFields
{
  constructor(input?: DeepPartial<Day>) {
    super(input);
  }

  @Column()
  code: string;

  @Column({
    type: "varchar",
    default: DayType.default,
  })
  type: DayType;

  @Column({ default: false })
  enabled: boolean;

  @Column({ default: 0 })
  sort: number;

  @Column({ default: 0 })
  dayOffset: number;

  date: string | null;

  @Column((type) => DayCustomFields)
  customFields: DayCustomFields;

  name: LocaleString;

  @ManyToMany(() => DeliveryMethod, (deliveryMethod) => deliveryMethod.days)
  @JoinTable()
  deliveryMethods: DeliveryMethod[];

  @OneToMany((type) => DayTranslation, (translation) => translation.base, {
    eager: true,
  })
  translations: Array<Translation<Day>>;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
