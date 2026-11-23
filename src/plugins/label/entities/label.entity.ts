import {
  Asset,
  DeepPartial,
  EntityId,
  HasCustomFields,
  ID,
  LocaleString,
  Product,
  Translatable,
  VendureEntity,
} from "@vendure/core";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  JoinTable,
  DeleteDateColumn,
} from "typeorm";
import { LabelTranslation } from "./label-translation.entity";

export class LabelCustomFields {}

@Entity()
export class Label
  extends VendureEntity
  implements Translatable, HasCustomFields
{
  constructor(input?: DeepPartial<Label>) {
    super(input);
  }

  name: LocaleString;

  @Column({ unique: true })
  code: string;

  @Column()
  color: string;

  @Column({ default: false })
  enabled: boolean;

  @Column()
  sort: number;

  @EntityId({ nullable: true })
  featuredAssetId: ID;

  @OneToOne(() => Asset)
  @JoinColumn({ name: "featuredAssetId" })
  featuredAsset: Asset;

  @ManyToMany(() => Product)
  @JoinTable()
  products: Product[];

  @OneToMany(() => LabelTranslation, (translation) => translation.base, {
    eager: true,
    cascade: true,
  })
  translations: LabelTranslation[];

  @Column(() => LabelCustomFields)
  customFields: LabelCustomFields;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
