import { DeepPartial, Translatable, VendureEntity } from '@vendure/core';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, DeleteDateColumn } from 'typeorm';
import type { SeasonTranslation } from './season-translation';
import { Product } from '@vendure/core';

@Entity()
export class Season extends VendureEntity implements Translatable {
    constructor(input?: DeepPartial<Season>) {
        super(input);
    }

    @Column()
    slug!: string;

    @Column()
    startDate!: Date;

    @Column()
    endDate!: Date;

    @Column({ default: true })
    isActive!: boolean;

    @OneToMany('SeasonTranslation', 'base', { cascade: true })
    translations!: SeasonTranslation[];

    @ManyToMany(() => Product)
    @JoinTable({ name: 'season_product' })
    products!: Product[];

    @DeleteDateColumn()
    deletedAt: Date | null;
}
