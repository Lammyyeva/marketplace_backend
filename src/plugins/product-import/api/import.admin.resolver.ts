import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Allow, Ctx, Permission, RequestContext, Transaction } from '@vendure/core';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ImportService } from '../services/import.service';
import { ImportHistoryService } from '../services/import-history.service';
import { ExcelTemplateService } from '../services/excel-template.service';
import { AssetMappingService } from '../services/asset-mapping.service';
import { ImportMode } from '../types';

@Resolver()
export class ImportAdminResolver {
    constructor(
        private importService: ImportService,
        private importHistoryService: ImportHistoryService,
        private excelTemplateService: ExcelTemplateService,
        private assetMappingService: AssetMappingService,
    ) {}

    @Query()
    @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
    async importJobs(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.importHistoryService.findAll(ctx, args.options);
    }

    @Query()
    @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
    async importJob(@Ctx() ctx: RequestContext, @Args() args: { id: string }) {
        return this.importHistoryService.findOne(ctx, args.id);
    }

    @Query()
    @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
    async importJobLogs(
        @Ctx() ctx: RequestContext,
        @Args() args: { jobId: string; take?: number; skip?: number },
    ) {
        return this.importHistoryService.getLogs(ctx, args.jobId, args.take, args.skip);
    }

    @Query()
    @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
    async importErrorReport(@Ctx() ctx: RequestContext, @Args() args: { jobId: string }) {
        return this.importHistoryService.getErrorReport(ctx, args.jobId);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
    async uploadProductExcel(
        @Ctx() ctx: RequestContext,
        @Args() args: { mode?: ImportMode; dryRun?: boolean },
    ) {
        // File upload is handled via REST endpoint at /import/upload-excel
        // This mutation stub is preserved for GraphQL schema completeness.
        // Actual upload goes through the ImportController REST endpoint.
        throw new Error('Use the REST endpoint POST /import/upload-excel for file uploads.');
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
    async uploadProductImages(@Ctx() ctx: RequestContext) {
        throw new Error('Use the REST endpoint POST /import/upload-images for file uploads.');
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
    async cancelImportJob(@Ctx() ctx: RequestContext, @Args() args: { id: string }) {
        return this.importHistoryService.cancelJob(ctx, args.id);
    }
}
