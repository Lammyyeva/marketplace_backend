import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { VendureEntity, ID } from '@vendure/core';

@Entity('bought_together')
@Index(['productId', 'relatedProductId', 'channelId'], { unique: true })
export class BoughtTogetherEntity extends VendureEntity {
  constructor(input?: Partial<BoughtTogetherEntity>) {
    super(input);
  }

  @Column()
  productId: number;

  @Column()
  relatedProductId: number;

  @Column()
  channelId: number;

  @Column({ default: 1 })
  count: number;
}
