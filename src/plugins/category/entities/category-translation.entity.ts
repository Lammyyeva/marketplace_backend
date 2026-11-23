import {
  DeepPartial,
  HasCustomFields,
  LanguageCode,
  Translation,
  VendureEntity,
} from "@vendure/core";
import { Column, DeleteDateColumn, Entity, Index, ManyToOne } from "typeorm";
import { Category } from "./category.entity";

export class CustomCategoryFieldsTranslation {}
@Entity()
export class CategoryTranslation
  extends VendureEntity
  implements Translation<Category>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<CategoryTranslation>>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column() name: string;

  @Index()
  @ManyToOne(() => Category, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Category;

  @Column(() => CustomCategoryFieldsTranslation)
  customFields: CustomCategoryFieldsTranslation;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
