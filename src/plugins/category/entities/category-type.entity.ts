import {
  Asset,
  DeepPartial,
  EntityId,
  VendureEntity,
  Translation,
  LocaleString,
  Translatable,
  HasCustomFields,
  ID,
} from "@vendure/core";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Category } from "./category.entity";
import { CategoryTypeTranslation } from "./category-type-translation.entity";

export class CategoryTypeCustomFields {}

@Entity()
export class CategoryType
  extends VendureEntity
  implements Translatable, HasCustomFields
{
  //implement customfields
  constructor(input?: DeepPartial<CategoryType>) {
    super(input);
  }

  name: LocaleString;

  @Column({ default: false })
  enabled: boolean;

  @Column({ default: 0 })
  sort: number;

  @Column({ unique: true })
  slug: string;

  @EntityId({ nullable: true })
  iconAssetId: ID;

  @ManyToOne(() => Asset)
  @JoinColumn({ name: "iconAssetId" })
  iconAsset: Asset;

  @EntityId({ nullable: true })
  imageAssetId: ID;

  @ManyToOne(() => Asset)
  @JoinColumn({ name: "imageAssetId" })
  imageAsset: Asset;

  @OneToMany(() => Category, (category) => category.categoryType)
  categories: Category[];

  @OneToMany(() => CategoryTypeTranslation, (translation) => translation.base, {
    eager: true,
    cascade: true,
  })
  translations: Array<Translation<CategoryTypeTranslation>>;

  @Column(() => CategoryTypeCustomFields)
  customFields: CategoryTypeCustomFields;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
