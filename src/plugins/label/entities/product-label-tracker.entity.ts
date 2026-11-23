import { DeepPartial, ID, VendureEntity, EntityId } from "@vendure/core";
import { Entity, Column, Index, Unique } from "typeorm";

@Entity()
@Unique(["productId", "labelId"])
export class ProductLabelTracker extends VendureEntity {
  constructor(input?: DeepPartial<ProductLabelTracker>) {
    super(input);
  }

  @EntityId({ nullable: false })
  @Index()
  productId: ID;

  @EntityId({ nullable: false })
  labelId: ID;

  @Column({ type: "timestamp", nullable: true })
  @Index()
  expiresAt: Date;
}
