import { LanguageCode } from "@vendure/common/lib/generated-types";
import { DeepPartial } from "@vendure/common/lib/shared-types";
import { HasCustomFields, Translation, VendureEntity } from "@vendure/core";
import { Column, Entity, Index, ManyToOne } from "typeorm";

import { Day } from "./day.entity";

export class DayCustomFieldsTranslation {}

@Entity()
export class DayTranslation
  extends VendureEntity
  implements Translation<Day>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<DayTranslation>>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column() name: string;

  @Index()
  @ManyToOne((type) => Day, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Day;

  @Column((type) => DayCustomFieldsTranslation)
  customFields: DayCustomFieldsTranslation;
}
