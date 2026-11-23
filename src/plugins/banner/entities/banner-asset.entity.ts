import {
  Asset,
  DeepPartial,
  LanguageCode,
  VendureEntity,
  ID,
  EntityId,
} from "@vendure/core";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Banner } from "./banner.entity";

@Entity()
@Index(["bannerId", "languageCode"], { unique: true })
export class BannerAsset extends VendureEntity {
  constructor(input?: DeepPartial<BannerAsset>) {
    super(input);
  }

  @Column("varchar")
  languageCode: LanguageCode;

  @EntityId({ nullable: true })
  assetId: ID;

  @ManyToOne(() => Asset)
  @JoinColumn({ name: "assetId" })
  asset: Asset;

  @EntityId()
  bannerId: ID;

  @ManyToOne(() => Banner, (banner) => banner.assets, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "bannerId" })
  banner: Banner;
}
