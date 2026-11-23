import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('search_meili_config')
export class SearchMeiliConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ default: true })
  autoSync: boolean;

  @Column({ default: 100 })
  batchSize: number;

  @Column({ default: '' })
  indexPrefix: string;
}
