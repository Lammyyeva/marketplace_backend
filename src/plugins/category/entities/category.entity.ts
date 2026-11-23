import {
  Asset,
  DeepPartial,
  FacetValue,
  HasCustomFields,
  ID,
  VendureEntity,
  EntityId,
  Translation,
  LocaleString,
  Translatable,
} from "@vendure/core";
import { Banner } from "../../banner/entities/banner.entity";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  Tree,
  TreeChildren,
  TreeParent,
  DeleteDateColumn,
} from "typeorm";

import { CategoryType } from "./category-type.entity";
import { CategoryTranslation } from "./category-translation.entity";

export class CategoryCustomFields {}

@Entity()
@Tree("materialized-path")
export class Category
  extends VendureEntity
  implements Translatable, HasCustomFields
{
  constructor(input?: DeepPartial<Category>) {
    super(input);
  }

  name: LocaleString;

  @Column()
  slug: string;

  @Column({ default: 0 })
  sort: number;

  @Column({ default: false })
  enabled: boolean;

  @EntityId({ nullable: false })
  categoryTypeId: ID;

  @ManyToOne(() => CategoryType, (ct) => ct.categories, { nullable: true }) //temporarrily
  @JoinColumn({ name: "categoryTypeId" })
  categoryType: CategoryType;

  @EntityId({ nullable: true })
  featuredAssetId: ID;

  @OneToOne(() => Asset)
  @JoinColumn({ name: "featuredAssetId" })
  featuredAsset: Asset;

  @EntityId({ nullable: true })
  iconAssetId: ID;

  @OneToOne(() => Asset)
  @JoinColumn({ name: "iconAssetId" })
  iconAsset: Asset;

  @TreeChildren()
  children: Category[];

  @EntityId({ nullable: true })
  parentId: ID;

  @TreeParent()
  parent: Category;

  @OneToMany(() => Banner, (banner) => banner.category)
  banners: Banner[];

  @ManyToMany(() => FacetValue)
  @JoinTable()
  models: FacetValue[];

  @OneToMany(() => CategoryTranslation, (translation) => translation.base, {
    eager: true,
    cascade: true,
  })
  translations: Array<Translation<CategoryTranslation>>;

  @Column(() => CategoryCustomFields)
  customFields: CategoryCustomFields;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
