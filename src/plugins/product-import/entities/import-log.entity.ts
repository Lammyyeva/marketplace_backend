import { DeepPartial, EntityId, ID, VendureEntity } from '@vendure/core';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ImportLogStatus } from '../types';
import { ImportJob } from './import-job.entity';

@Entity()
export class ImportLog extends VendureEntity {
    constructor(input?: DeepPartial<ImportLog>) {
        super(input);
    }

    @Column({ default: 0 })
    rowNumber: number;

    @Column({ nullable: true, type: 'varchar' })
    sku: string | null;

    @Column({ type: 'varchar', default: ImportLogStatus.ERROR })
    status: ImportLogStatus;

    @Column({ type: 'text' })
    message: string;

    @Column({ nullable: true, type: 'text' })
    suggestedFix: string | null;

    @EntityId()
    jobId: ID;

    @ManyToOne(() => ImportJob, (job) => job.logs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'jobId' })
    job: ImportJob;
}
