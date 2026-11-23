import { LanguageCode, Translation, VendureEntity, DeepPartial } from '@vendure/core';
import { Column, Entity, ManyToOne } from 'typeorm';
import type { Season } from './season';

@Entity()
export class SeasonTranslation extends VendureEntity implements Translation<Season> {
    constructor(input?: DeepPartial<SeasonTranslation>) {
        super(input);
    }

    @Column('varchar')
    languageCode!: LanguageCode;

    @Column()
    name!: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @ManyToOne('Season', 'translations', { onDelete: 'CASCADE' })
    base!: Season;
}
