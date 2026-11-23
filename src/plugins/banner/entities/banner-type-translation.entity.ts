import {
  DeepPartial,
  HasCustomFields,
  LanguageCode,
  Translation,
  VendureEntity,
} from "@vendure/core";
import { Column, DeleteDateColumn, Entity, Index, ManyToOne } from "typeorm";
import { BannerType } from "./banner-type.entity";

export class CustomBannerTypeFieldsTranslation {}

@Entity()
export class BannerTypeTranslation
  extends VendureEntity
  implements Translation<BannerType>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<BannerTypeTranslation>>) {
    super(input);
  }

  @Column("varchar")
  languageCode: LanguageCode;

  @Column()
  name: string;

  @Index()
  @ManyToOne(() => BannerType, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: BannerType;

  @Column(() => CustomBannerTypeFieldsTranslation)
  customFields: CustomBannerTypeFieldsTranslation;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
