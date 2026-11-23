import {
  DeepPartial,
  HasCustomFields,
  LanguageCode,
  Translation,
  VendureEntity,
} from "@vendure/core";
import { Column, DeleteDateColumn, Entity, Index, ManyToOne } from "typeorm";
import { Banner } from "./banner.entity";

export class CustomBannerFieldsTranslation {}

@Entity()
export class BannerTranslation
  extends VendureEntity
  implements Translation<Banner>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<BannerTranslation>>) {
    super(input);
  }

  @Column("varchar")
  languageCode: LanguageCode;

  @Column()
  name: string;

  @Index()
  @ManyToOne(() => Banner, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Banner;

  @Column(() => CustomBannerFieldsTranslation)
  customFields: CustomBannerFieldsTranslation;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
