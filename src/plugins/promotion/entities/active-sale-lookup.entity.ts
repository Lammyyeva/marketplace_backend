import {
  DeepPartial,
  VendureEntity,
  ProductVariant,
  Promotion,
} from "@vendure/core";
import { Column, Entity, ManyToOne, Index } from "typeorm";

@Entity()
export class ActiveSaleLookup extends VendureEntity {
  constructor(input?: DeepPartial<ActiveSaleLookup>) {
    super(input);
  }

  @Index()
  @Column()
  variantId: number;

  @ManyToOne((type) => ProductVariant, { onDelete: "CASCADE" })
  variant: ProductVariant;

  @Index()
  @Column()
  promotionId: number;

  @ManyToOne((type) => Promotion, { onDelete: "CASCADE" })
  promotion: Promotion;

  @Column({ type: "timestamp", nullable: true })
  expiresAt: Date | null;

  @Column({ default: false })
  isDiscount: boolean;
}
