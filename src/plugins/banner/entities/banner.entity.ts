import {
  DeepPartial,
  FacetValue,
  HasCustomFields,
  ID,
  VendureEntity,
  EntityId,
  Translation,
  LocaleString,
  Translatable,
  Product,
  ProductVariant,
} from "@vendure/core";
import { Category } from "../../category/entities/category.entity";
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from "typeorm";
import { BannerTranslation } from "./banner-translation.entity";
import { BannerType } from "./banner-type.entity";
import { BannerAsset } from "./banner-asset.entity";

export class BannerCustomFields {}

@Entity()
export class Banner
  extends VendureEntity
  implements Translatable, HasCustomFields
{
  constructor(input?: DeepPartial<Banner>) {
    super(input);
  }

  name: LocaleString;

  @Column()
  slug: string;

  @Column()
  redirect: string;

  @Column({ nullable: true })
  link: string;

  @Column({ default: false })
  enabled: boolean;

  @Column({ default: 0 })
  sort: number;

  @Column({ default: 0 })
  counter: number;

  @EntityId({ nullable: true })
  categoryId: ID;

  @ManyToOne(() => Category)
  @JoinColumn({ name: "categoryId" })
  category: Category;

  @EntityId()
  typeId: ID;

  @ManyToOne(() => BannerType, (type) => type.banners)
  @JoinColumn({ name: "typeId" })
  type: BannerType;

  @EntityId({ nullable: true })
  modelId: ID;

  @ManyToOne(() => FacetValue)
  @JoinColumn({ name: "modelId" })
  model: FacetValue;

  @Column({ nullable: true, default: "#000000" })
  backColor: string = "#000000";

  @Column({ nullable: true, default: "#000000" })
  btnColor: string = "#000000";

  @Column({ type: "timestamp" })
  startDate: Date;

  @Column({ type: "timestamp" })
  endDate: Date;

  @OneToMany(() => BannerTranslation, (translation) => translation.base, {
    eager: true,
    cascade: true,
  })
  translations: Array<Translation<BannerTranslation>>;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @ManyToMany(() => ProductVariant)
  @JoinTable()
  variants: ProductVariant[];

  @Column(() => BannerCustomFields)
  customFields: BannerCustomFields;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => BannerAsset, (bannerAsset) => bannerAsset.banner)
  assets: BannerAsset[];
}
