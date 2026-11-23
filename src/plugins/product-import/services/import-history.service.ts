import { Injectable } from '@nestjs/common';
import { ID, ListQueryBuilder, ListQueryOptions, PaginatedList, RequestContext, TransactionalConnection } from '@vendure/core';
import { ImportJob } from '../entities/import-job.entity';
import { ImportLog } from '../entities/import-log.entity';
import { ImportJobStatus } from '../types';

@Injectable()
export class ImportHistoryService {
    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    async findAll(ctx: RequestContext, options?: ListQueryOptions<ImportJob>): Promise<PaginatedList<ImportJob>> {
        const [items, totalItems] = await this.listQueryBuilder
            .build(ImportJob, options, { ctx })
            .getManyAndCount();

        return { items, totalItems };
    }

    async findOne(ctx: RequestContext, id: ID): Promise<ImportJob | null> {
        return this.connection.getRepository(ctx, ImportJob).findOne({
            where: { id },
            relations: ['logs'],
            order: { createdAt: 'DESC' },
        });
    }

    async getLogs(ctx: RequestContext, jobId: ID, take = 500, skip = 0): Promise<ImportLog[]> {
        return this.connection.getRepository(ctx, ImportLog).find({
            where: { jobId },
            order: { rowNumber: 'ASC' },
            take,
            skip,
        });
    }

    async cancelJob(ctx: RequestContext, id: ID): Promise<ImportJob> {
        const job = await this.connection.getEntityOrThrow(ctx, ImportJob, id);
        if (job.status === ImportJobStatus.PROCESSING || job.status === ImportJobStatus.PENDING) {
            job.status = ImportJobStatus.CANCELLED;
            job.completedAt = new Date();
            await this.connection.getRepository(ctx, ImportJob).save(job);
        }
        return job;
    }

    /**
     * Fetch ALL logs for a job (used by the Excel report generator).
     */
    async findLogsForJob(ctx: RequestContext, jobId: ID): Promise<ImportLog[]> {
        return this.connection.getRepository(ctx, ImportLog).find({
            where: { jobId },
            order: { rowNumber: 'ASC' },
        });
    }

    async getErrorReport(ctx: RequestContext, jobId: ID): Promise<Array<{
        rowNumber: number;
        sku: string | null;
        error: string;
        suggestedFix: string | null;
    }>> {
        const logs = await this.connection.getRepository(ctx, ImportLog).find({
            where: { jobId, status: 'ERROR' as any },
            order: { rowNumber: 'ASC' },
        });

        return logs.map((log) => ({
            rowNumber: log.rowNumber,
            sku: log.sku,
            error: log.message,
            suggestedFix: log.suggestedFix,
        }));
    }
}
