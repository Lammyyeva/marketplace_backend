import { LanguageCode } from "@vendure/common/lib/generated-types";
import { DeepPartial } from "@vendure/common/lib/shared-types";
import { HasCustomFields, Translation, VendureEntity } from "@vendure/core";
import { Column, Entity, Index, ManyToOne } from "typeorm";

import { DeliveryMethod } from "./delivery-method.entity";

export class DeliveryMethodCustomFieldsTranslation {}

@Entity()
export class DeliveryMethodTranslation
  extends VendureEntity
  implements Translation<DeliveryMethod>, HasCustomFields
{
  constructor(input?: DeepPartial<Translation<DeliveryMethodTranslation>>) {
    super(input);
  }

  @Column("varchar") languageCode: LanguageCode;

  @Column() name: string;

  @Column() description: string;

  @Index()
  @ManyToOne((type) => DeliveryMethod, (base) => base.translations, {
    onDelete: "CASCADE",
  })
  base: DeliveryMethod;

  @Column((type) => DeliveryMethodCustomFieldsTranslation)
  customFields: DeliveryMethodCustomFieldsTranslation;
}
