import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity('product_search_stats')
export class ProductSearchStatEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    productId: number;

    @Column()
    productName: string;

    @Column({ default: 0 })
    votes: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}