import {
  DeepPartial,
  HasCustomFields,
  ID,
  LocaleString,
  Translatable,
  Translation,
  VendureEntity,
} from "@vendure/core";
import { Column, DeleteDateColumn, Entity, OneToMany } from "typeorm";
import { BannerTypeTranslation } from "./banner-type-translation.entity";
import { Banner } from "./banner.entity";

export class BannerTypeCustomFields {}

@Entity()
export class BannerType
  extends VendureEntity
  implements Translatable, HasCustomFields
{
  constructor(input?: DeepPartial<BannerType>) {
    super(input);
  }

  name: LocaleString;

  @Column({ default: false })
  enabled: boolean;

  @Column({ default: 0 })
  counter: number;

  @Column({ default: 0 })
  sort: number;

  @Column(() => BannerTypeCustomFields)
  customFields: BannerTypeCustomFields;

  @OneToMany(() => Banner, (banner) => banner.type)
  banners: Banner[];

  @OneToMany(() => BannerTypeTranslation, (translation) => translation.base, {
    eager: true,
    cascade: true,
  })
  translations: Array<Translation<BannerTypeTranslation>>;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
