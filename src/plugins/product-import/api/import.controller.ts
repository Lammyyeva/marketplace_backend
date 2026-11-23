import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Req,
    Res,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Ctx, RequestContext, RequestContextService, UserInputError, InternalServerError, EntityNotFoundError } from '@vendure/core';
import { Request, Response } from 'express';
import * as multer from 'multer';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { ImportService } from '../services/import.service';
import { ImportHistoryService } from '../services/import-history.service';
import { ExcelTemplateService } from '../services/excel-template.service';
import { AssetMappingService } from '../services/asset-mapping.service';
import { ExcelReportService } from '../services/excel-report.service';
import { ImportMode } from '../types';
import { SUPPORTED_EXCEL_TYPES, SUPPORTED_IMAGE_TYPES } from '../constants';

const tmpStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-upload-')); 
        cb(null, tmpDir);
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    },
});

@Controller('import')
export class ImportController {
    constructor(
        private importService: ImportService,
        private importHistoryService: ImportHistoryService,
        private excelTemplateService: ExcelTemplateService,
        private assetMappingService: AssetMappingService,
        private excelReportService: ExcelReportService,
        private requestContextService: RequestContextService,
    ) {}

    /**
     * GET /import/template
     * Download the XLSX import template
     */
    @Get('template')
    async downloadTemplate(@Res() res: Response) {
        const buffer = await this.excelTemplateService.generateTemplate();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="product-import-template.xlsx"');
        res.end(buffer);
    }

    /**
     * GET /import/export-products
     * Export all products to XLSX
     */
    @Get('export-products')
    async exportProducts(@Req() req: Request, @Res() res: Response) {
        const ctx = await this.requestContextService.create({
            apiType: 'admin',
            req: req as any,
        });
        const buffer = await this.excelTemplateService.exportProducts(ctx);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="products-export.xlsx"');
        res.end(buffer);
    }

    /**
     * POST /import/upload-excel
     * Upload an Excel file and start the import job
     * Body: multipart/form-data with field "file", plus optional "mode" and "dryRun"
     */
    @Post('upload-excel')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: tmpStorage,
            limits: { fileSize: 100 * 1024 * 1024 },
            fileFilter: (_req, file, cb) => {
                const ext = path.extname(file.originalname).toLowerCase();
                if (SUPPORTED_EXCEL_TYPES.includes(ext)) {
                    cb(null, true);
                } else {
                    cb(new Error(`Unsupported file type: ${ext}. Only .xlsx and .xls are allowed.`), false);
                }
            },
        }),
    )
    async uploadExcel(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: { mode?: string; dryRun?: string },
        @Req() req: Request,
    ) {
        if (!file) {
            throw new UserInputError('No file uploaded');
        }

        const ctx = await this.requestContextService.create({
            apiType: 'admin',
            req: req as any,
        });

        const mode = (body.mode as ImportMode) ?? ImportMode.UPSERT;
        const dryRun = body.dryRun === 'true';

        try {
            const importJob = await this.importService.enqueueProductImport(
                ctx,
                file.path,
                file.originalname,
                mode,
                dryRun,
            );

            return {
                success: true,
                jobId: importJob.id,
                message: dryRun
                    ? 'Dry run validation started. No changes will be persisted.'
                    : `Import job started in ${mode} mode.`,
            };
        } catch (err: any) {
            if (file.path && fs.existsSync(file.path)) {
                try { fs.unlinkSync(file.path); } catch (_) {}
            }
            throw new InternalServerError(err.message);
        }
    }

    /**
     * POST /import/upload-images
     * Upload multiple images or a ZIP file for automatic SKU mapping
     */
    @Post('upload-images')
    @UseInterceptors(
        FilesInterceptor('files', 10000, {
            storage: tmpStorage,
            limits: { fileSize: 50 * 1024 * 1024 },
        }),
    )
    async uploadImages(
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: Request,
    ) {
        if (!files || files.length === 0) {
            throw new UserInputError('No files uploaded');
        }

        const ctx = await this.requestContextService.create({
            apiType: 'admin',
            req: req as any,
        });

        const zipFiles = files.filter((f) => path.extname(f.originalname).toLowerCase() === '.zip');
        const imageFiles = files.filter((f) => {
            const ext = path.extname(f.originalname).toLowerCase();
            return SUPPORTED_IMAGE_TYPES.includes(ext);
        });

        const imagePaths = imageFiles.map((f) => f.path);
        const zipPath = zipFiles[0]?.path;

        try {
            const result = await this.importService.processImagesDirectly(ctx, imagePaths, zipPath);
            return { success: true, ...result };
        } catch (err: any) {
            throw new InternalServerError(err.message);
        } finally {
            [...imageFiles, ...zipFiles].forEach((f) => {
                if (f.path && fs.existsSync(f.path)) {
                    try { fs.unlinkSync(f.path); } catch (_) {}
                }
            });
        }
    }

    /**
     * GET /import/jobs
     * List all import jobs
     */
    @Get('jobs')
    async listJobs(@Req() req: Request) {
        const ctx = await this.requestContextService.create({ apiType: 'admin', req: req as any });
        return this.importHistoryService.findAll(ctx, { take: 50 });
    }

    /**
     * GET /import/jobs/:id
     * Get import job by ID
     */
    @Get('jobs/:id')
    async getJob(@Param('id') id: string, @Req() req: Request) {
        const ctx = await this.requestContextService.create({ apiType: 'admin', req: req as any });
        const job = await this.importHistoryService.findOne(ctx, id);
        if (!job) throw new EntityNotFoundError('ImportHistory', id);
        return job;
    }

    /**
     * GET /import/jobs/:id/error-report
     * Download error report as JSON
     */
    @Get('jobs/:id/error-report')
    async getErrorReport(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        const ctx = await this.requestContextService.create({ apiType: 'admin', req: req as any });
        const report = await this.importHistoryService.getErrorReport(ctx, id);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="error-report-${id}.json"`);
        res.end(JSON.stringify(report, null, 2));
    }

    /**
     * GET /import/jobs/:id/error-report-excel
     * Download the full multi-sheet Excel results report (.xlsx).
     * The report is pre-generated after job completion and stored at job.reportPath.
     * If it has been cleaned up (e.g. server restart), it is regenerated on-demand.
     */
    @Get('jobs/:id/error-report-excel')
    async getErrorReportExcel(@Param('id') id: string, @Req() req: Request, @Res() res: Response) {
        const ctx = await this.requestContextService.create({ apiType: 'admin', req: req as any });
        const job = await this.importHistoryService.findOne(ctx, id);

        if (!job) {
            throw new HttpException('Import job not found', HttpStatus.NOT_FOUND);
        }

        // Check if the pre-generated report file still exists on disk
        let reportPath: string | null = (job as any).reportPath ?? null;

        if (!reportPath || !fs.existsSync(reportPath)) {
            // Regenerate on-demand
            const logs = await this.importHistoryService.findLogsForJob(ctx, id);
            reportPath = await this.excelReportService.generateReport(job as any, logs as any);
        }

        const safeName = job.fileName.replace(/[^a-z0-9._-]/gi, '_').replace(/\.[^.]+$/, '');
        const downloadName = `import-report-${safeName}-${id}.xlsx`;

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);

        const stream = fs.createReadStream(reportPath);
        stream.pipe(res);
        stream.on('error', () => {
            res.status(500).end('Failed to read report file');
        });
    }
}
