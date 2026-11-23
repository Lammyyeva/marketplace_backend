import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

/**
 * Tracks how many units of a specific product variant have been sold
 * at the discounted price for a given promotion, scoped per channel.
 */
@Entity()
@Index(["promotionId", "variantId", "channelId"], { unique: true })
export class PromotionVariantSale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  promotionId: number;

  @Column()
  @Index()
  variantId: number;

  @Column()
  @Index()
  channelId: number;

  @Column({ default: 0 })
  sold: number;
}
