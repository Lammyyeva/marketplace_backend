import { DeepPartial, ID, VendureEntity } from '@vendure/core';
import { Column, Entity, OneToMany } from 'typeorm';
import { ImportJobStatus, ImportMode } from '../types';
import { ImportLog } from './import-log.entity';

@Entity()
export class ImportJob extends VendureEntity {
    constructor(input?: DeepPartial<ImportJob>) {
        super(input);
    }

    @Column({ type: 'varchar', default: ImportJobStatus.PENDING })
    status: ImportJobStatus;

    @Column({ type: 'varchar', default: ImportMode.UPSERT })
    mode: ImportMode;

    @Column()
    fileName: string;

    @Column({ nullable: true, type: 'text' })
    filePath: string;

    @Column({ default: 0 })
    totalRows: number;

    @Column({ default: 0 })
    successCount: number;

    @Column({ default: 0 })
    failedCount: number;

    @Column({ default: 0 })
    warningCount: number;

    @Column({ default: 0 })
    skippedCount: number;

    @Column({ default: 0 })
    progress: number;

    @Column({ nullable: true, type: 'timestamp' })
    startedAt: Date | null;

    @Column({ nullable: true, type: 'timestamp' })
    completedAt: Date | null;

    @Column({ nullable: true, type: 'int' })
    durationMs: number | null;

    @Column()
    initiatedBy: string;

    @Column({ default: false })
    dryRun: boolean;

    @Column({ nullable: true, type: 'text' })
    errorMessage: string | null;

    /**
     * Filesystem path to the generated Excel error/results report (.xlsx).
     * Null until the import job completes and the report is generated.
     */
    @Column({ nullable: true, type: 'text' })
    reportPath: string | null;

    @OneToMany(() => ImportLog, (log) => log.job, { cascade: true })
    logs: ImportLog[];
}
