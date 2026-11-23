import {
  DeepPartial,
  HasCustomFields,
  LanguageCode,
  Translation,
  VendureEntity,
} from "@vendure/core";
import { Column, DeleteDateColumn, Entity, Index, ManyToOne } from "typeorm";
import { CategoryType } from "./category-type.entity";

export class CustomCategoryTypeTranslationFields {}
@Entity()
export class CategoryTypeTranslation
  extends VendureEntity
  implements Translation<CategoryType>, HasCustomFields
{
  //implement customtranslation fields
  constructor(input?: DeepPartial<Translation<CategoryTypeTranslation>>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column() name: string;

  @Index()
  @ManyToOne(() => CategoryType, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: CategoryType;

  @Column(() => CustomCategoryTypeTranslationFields)
  customFields: CustomCategoryTypeTranslationFields;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
