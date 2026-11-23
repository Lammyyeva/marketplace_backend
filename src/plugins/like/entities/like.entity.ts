import {
  DeepPartial,
  VendureEntity,
  User,
  ProductVariant,
  EntityId,
  ID,
} from "@vendure/core";
import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";

@Entity()
@Unique("UQ_like_user_variant", ["userId", "productVariantId"])
export class Like extends VendureEntity {
  constructor(input?: DeepPartial<Like>) {
    super(input);
  }

  @Column({ default: false })
  isLike: boolean;

  @EntityId({ nullable: false })
  userId: ID;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @EntityId({ nullable: false })
  productVariantId: ID;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: "productVariantId" })
  productVariant: ProductVariant;
}
