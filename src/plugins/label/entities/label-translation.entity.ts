import {
  DeepPartial,
  HasCustomFields,
  LanguageCode,
  Translation,
  VendureEntity,
} from "@vendure/core";
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Label } from "./label.entity";

export class CustomLabelFieldsTranslation {}

@Entity()
export class LabelTranslation
  extends VendureEntity
  implements Translation<Label>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<LabelTranslation>>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column() name: string;

  @Index()
  @ManyToOne(() => Label, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Label;

  @Column(() => CustomLabelFieldsTranslation)
  customFields: CustomLabelFieldsTranslation;
}
