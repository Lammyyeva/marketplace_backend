import { Injectable, Logger } from '@nestjs/common';
import {
    AssetService,
    Collection,
    CollectionService,
    Facet,
    FacetValue,
    FacetValueService,
    ID,
    JobQueue,
    JobQueueService,
    LanguageCode,
    ProductService,
    ProductVariantService,
    RequestContext,
    TransactionalConnection,
} from '@vendure/core';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { BATCH_SIZE, IMAGE_IMPORT_JOB_NAME, PRODUCT_IMPORT_JOB_NAME } from '../constants';
import { SlugService } from './slug.service';
import { ExcelReportService } from './excel-report.service';
import { ImportJob } from '../entities/import-job.entity';
import { ImportLog } from '../entities/import-log.entity';
import {
    ExcelProductRow,
    ImageImportJobData,
    ImageMappingResult,
    ImportLogStatus,
    ImportMode,
    ImportJobStatus,
    ImportRowResult,
    ProductImportJobData,
} from '../types';
import { ExcelParserService } from './excel-parser.service';
import { AssetMappingService } from './asset-mapping.service';
import { Category } from '../../category/entities/category.entity';

@Injectable()
export class ImportService {
    private readonly logger = new Logger(ImportService.name);
    private importQueue!: JobQueue<ProductImportJobData>;
    private imageQueue!: JobQueue<ImageImportJobData>;

    constructor(
        private connection: TransactionalConnection,
        private jobQueueService: JobQueueService,
        private excelParser: ExcelParserService,
        private assetMapping: AssetMappingService,
        private productService: ProductService,
        private productVariantService: ProductVariantService,
        private facetValueService: FacetValueService,
        private collectionService: CollectionService,
        private assetService: AssetService,
        private slugService: SlugService,
        private excelReport: ExcelReportService,
    ) {}

    async init() {
        this.importQueue = await this.jobQueueService.createQueue<ProductImportJobData>({
            name: PRODUCT_IMPORT_JOB_NAME,
            process: async (job) => {
                await this.processImportJob(job.data);
            },
        });

        this.imageQueue = await this.jobQueueService.createQueue<ImageImportJobData>({
            name: IMAGE_IMPORT_JOB_NAME,
            process: async (job) => {
                const ctx = await this.buildWorkerCtx(job.data.channelToken, (job.data as any).languageCode);
                await this.processImagesDirectly(ctx, job.data.filePaths, job.data.zipPath);
            },
        });
    }

    /**
     * Persist a new ImportJob record and enqueue background processing.
     */
    async enqueueProductImport(
        ctx: RequestContext,
        filePath: string,
        fileName: string,
        mode: ImportMode,
        dryRun: boolean,
    ): Promise<ImportJob> {
        const importJob = new ImportJob({
            status: ImportJobStatus.PENDING,
            mode,
            fileName,
            filePath,
            dryRun,
            initiatedBy: (ctx.activeUserId ?? 'unknown').toString(),
            totalRows: 0,
            successCount: 0,
            failedCount: 0,
            warningCount: 0,
            skippedCount: 0,
            progress: 0,
        });

        const saved = await this.connection.getRepository(ctx, ImportJob).save(importJob);

        await this.importQueue.add({
            filePath,
            fileName,
            mode,
            dryRun,
            jobEntityId: saved.id.toString(),
            channelToken: ctx.channel.token,
            languageCode: ctx.languageCode,
            initiatedBy: saved.initiatedBy,
        });

        return saved;
    }

    /**
     * Background worker entry point: parse Excel, process rows in batches.
     */
    private async processImportJob(data: ProductImportJobData): Promise<void> {
        const ctx = await this.buildWorkerCtx(data.channelToken, data.languageCode);
        const jobRepo = this.connection.rawConnection.getRepository(ImportJob);
        const logRepo = this.connection.rawConnection.getRepository(ImportLog);

        const jobEntity = await jobRepo.findOne({ where: { id: data.jobEntityId as any } });
        if (!jobEntity) {
            this.logger.error(`ImportJob ${data.jobEntityId} not found`);
            return;
        }

        jobEntity.status = ImportJobStatus.PROCESSING;
        jobEntity.startedAt = new Date();
        await jobRepo.save(jobEntity);

        try {
            const { rows, errors: parseErrors, totalRows } = await this.excelParser.parseFile(data.filePath);

            jobEntity.totalRows = totalRows;
            await jobRepo.save(jobEntity);

            // Log parse-level errors
            if (parseErrors.length > 0) {
                const parseLogs = parseErrors.map((e) =>
                    logRepo.create({
                        rowNumber: e.row,
                        status: ImportLogStatus.ERROR,
                        message: e.message,
                        suggestedFix: 'Correct the cell value and re-upload.',
                        jobId: jobEntity.id,
                    }),
                );
                await logRepo.save(parseLogs);
            }

            if (data.dryRun) {
                jobEntity.status = ImportJobStatus.COMPLETED;
                jobEntity.failedCount = parseErrors.length;
                jobEntity.successCount = rows.length - parseErrors.length;
                jobEntity.completedAt = new Date();
                jobEntity.durationMs = Date.now() - jobEntity.startedAt!.getTime();
                await jobRepo.save(jobEntity);
                return;
            }

            let success = 0;
            let failed = parseErrors.length;
            let warnings = 0;
            let skipped = 0;

            for (let i = 0; i < rows.length; i += BATCH_SIZE) {
                const batch = rows.slice(i, i + BATCH_SIZE);
                const batchResults = await this.processBatch(ctx, batch, data.mode);

                const batchLogs: Partial<ImportLog>[] = [];
                for (const result of batchResults) {
                    batchLogs.push({
                        rowNumber: result.rowNumber,
                        sku: result.sku,
                        status: result.status,
                        message: result.message,
                        suggestedFix: result.suggestedFix ?? null,
                        jobId: jobEntity.id,
                    });

                    if (result.status === ImportLogStatus.SUCCESS) success++;
                    else if (result.status === ImportLogStatus.ERROR) failed++;
                    else if (result.status === ImportLogStatus.WARNING) warnings++;
                    else if (result.status === ImportLogStatus.SKIPPED) skipped++;
                }

                if (batchLogs.length > 0) {
                    await logRepo.save(batchLogs);
                }

                const processedSoFar = Math.min(i + BATCH_SIZE, rows.length);
                jobEntity.progress = Math.round((processedSoFar / rows.length) * 100);
                jobEntity.successCount = success;
                jobEntity.failedCount = failed;
                jobEntity.warningCount = warnings;
                jobEntity.skippedCount = skipped;
                await jobRepo.save(jobEntity);
            }

            jobEntity.status = ImportJobStatus.COMPLETED;
            jobEntity.completedAt = new Date();
            jobEntity.durationMs = Date.now() - jobEntity.startedAt!.getTime();
            jobEntity.progress = 100;
            await jobRepo.save(jobEntity);
        } catch (err: any) {
            this.logger.error(`Import job ${data.jobEntityId} failed: ${err.message}`);
            jobEntity.status = ImportJobStatus.FAILED;
            jobEntity.errorMessage = err.message;
            jobEntity.completedAt = new Date();
            jobEntity.durationMs = jobEntity.startedAt
                ? Date.now() - jobEntity.startedAt.getTime()
                : null;
            await jobRepo.save(jobEntity);
        } finally {
            // Clean up temp Excel file
            if (data.filePath && fs.existsSync(data.filePath)) {
                try { fs.unlinkSync(data.filePath); } catch (_) { }
            }

            // Generate Excel report for completed / failed jobs (non-dry-run)
            if (!data.dryRun && (jobEntity.status === ImportJobStatus.COMPLETED || jobEntity.status === ImportJobStatus.FAILED)) {
                try {
                    const allLogs = await logRepo.find({ where: { jobId: jobEntity.id as any } });
                    const reportPath = await this.excelReport.generateReport(jobEntity, allLogs);
                    jobEntity.reportPath = reportPath;
                    await jobRepo.save(jobEntity);
                    this.logger.log(`Report saved at ${reportPath}`);
                } catch (reportErr: any) {
                    this.logger.warn(`Failed to generate Excel report: ${reportErr.message}`);
                }
            }
        }
    }

    private async processBatch(
        ctx: RequestContext,
        rows: ExcelProductRow[],
        mode: ImportMode,
    ): Promise<ImportRowResult[]> {
        const results: ImportRowResult[] = [];

        for (const row of rows) {
            try {
                const result = await this.processRow(ctx, row, mode);
                results.push(result);
            } catch (err: any) {
                results.push({
                    rowNumber: row.rowNumber,
                    sku: row.sku,
                    status: ImportLogStatus.ERROR,
                    message: err.message ?? 'Unknown error',
                    suggestedFix: 'Check the row data and retry.',
                });
            }
        }

        return results;
    }

    private async processRow(
        ctx: RequestContext,
        row: ExcelProductRow,
        mode: ImportMode,
    ): Promise<ImportRowResult> {
        if (!row.sku || !row.productName) {
            return {
                rowNumber: row.rowNumber,
                sku: row.sku,
                status: ImportLogStatus.ERROR,
                message: 'Missing required fields: productName or sku',
                suggestedFix: 'Ensure productName and sku are filled in.',
            };
        }

        const existingVariants = await this.productVariantService.findAll(ctx, {
            filter: { sku: { eq: row.sku } },
            take: 1,
        });
        const existingVariant = existingVariants.items[0] ?? null;

        if (existingVariant && mode === ImportMode.CREATE) {
            return {
                rowNumber: row.rowNumber,
                sku: row.sku,
                status: ImportLogStatus.SKIPPED,
                message: `SKU "${row.sku}" already exists. Skipped in CREATE mode.`,
            };
        }

        if (!existingVariant && mode === ImportMode.UPDATE) {
            return {
                rowNumber: row.rowNumber,
                sku: row.sku,
                status: ImportLogStatus.SKIPPED,
                message: `SKU "${row.sku}" not found. Skipped in UPDATE mode.`,
            };
        }

        const collectionIds = await this.resolveCollectionIds(ctx, row);
        const facetValueIds = await this.resolveFacetValueIds(ctx, row.facets);
        const categoryIds = await this.resolveCategoryIds(ctx, row.categories);

        if (existingVariant) {
            await this.updateVariant(ctx, existingVariant.id, row, collectionIds, facetValueIds);
            
            // Also update the parent product custom fields with resolved categories
            const fullVariant = await this.productVariantService.findOne(ctx, existingVariant.id);
            const productId = (fullVariant as any)?.productId;
            if (productId) {
                await this.productService.update(ctx, {
                    id: productId,
                    customFields: {
                        ...row.customFields,
                        categoriesIds: categoryIds,
                        categories: categoryIds.map((id) => ({ id })),
                    } as any,
                });
            }

            const collectionNote = collectionIds.length
                ? ` — assigned to ${collectionIds.length} collection(s)`
                : '';
            return {
                rowNumber: row.rowNumber,
                sku: row.sku,
                status: ImportLogStatus.SUCCESS,
                message: `Updated variant for "${row.productName}" (SKU "${row.sku}") with slug "${row.slug}"${collectionNote}`,
            };
        } else {
            await this.createOrUpdateProduct(ctx, row, collectionIds, facetValueIds, categoryIds);
            const slugNote = row.slugWasGenerated ? ` [auto-generated slug: "${row.slug}"]` : '';
            const collectionNote = collectionIds.length
                ? ` — assigned to ${collectionIds.length} collection(s)`
                : '';
            return {
                rowNumber: row.rowNumber,
                sku: row.sku,
                status: ImportLogStatus.SUCCESS,
                message: `Created product/variant for "${row.productName}" (SKU "${row.sku}") with slug "${row.slug}"${slugNote}${collectionNote}`,
            };
        }
    }

    private async createOrUpdateProduct(
        ctx: RequestContext,
        row: ExcelProductRow,
        collectionIds: ID[],
        facetValueIds: ID[],
        categoryIds: string[],
    ): Promise<void> {
        // Try to find product by slug (using the already-resolved slug from the row)
        const existingProduct = await this.productService.findOneBySlug(ctx, row.slug);

        let productId: ID;
        if (existingProduct) {
            productId = existingProduct.id;

            // For existing products, preserve the current slug unless the user
            // explicitly provided a new one (i.e. it was not auto-generated).
            const slugForUpdate = row.slugWasGenerated
                ? existingProduct.translations?.[0]?.slug ?? row.slug  // keep existing
                : await this.slugService.ensureUniqueSlug(ctx, row.slug, existingProduct.id.toString());


            await this.productService.update(ctx, {
                id: productId,
                enabled: row.enabled,
                facetValueIds,
                customFields: {
                    ...row.customFields,
                    categoriesIds: categoryIds,
                    categories: categoryIds.map((id) => ({ id })),
                } as any,
                translations: [
                    {
                        languageCode: ctx.languageCode,
                        name: row.productName,
                        slug: slugForUpdate,
                        description: row.description,
                        customFields: {
                            metaTitle: row.seoTitle || undefined,
                            metaDescription: row.seoDescription || undefined,
                        } as any,
                    },
                ],
            });
        } else {
            // New product — guarantee slug uniqueness
            const uniqueSlug = await this.slugService.ensureUniqueSlug(ctx, row.slug);

            const created = await this.productService.create(ctx, {
                enabled: row.enabled,
                facetValueIds,
                customFields: {
                    ...row.customFields,
                    categoriesIds: categoryIds,
                    categories: categoryIds.map((id) => ({ id })),
                } as any,
                translations: [
                    {
                        languageCode: ctx.languageCode,
                        name: row.productName,
                        slug: uniqueSlug,
                        description: row.description,
                        customFields: {
                            metaTitle: row.seoTitle || undefined,
                            metaDescription: row.seoDescription || undefined,
                        } as any,
                    },
                ],
            });
            productId = created.id;
            // Update row.slug so the log message reflects the actual stored slug
            row.slug = uniqueSlug;
        }

        const variantName = row.variantName || row.productName;
        const createdVariants = await this.productVariantService.create(ctx, [
            {
                productId,
                sku: row.sku,
                price: row.price,
                stockOnHand: row.stock,
                trackInventory: 'TRUE' as any,
                taxCategoryId: await this.getDefaultTaxCategoryId(ctx),
                facetValueIds,
                customFields: row.customFields as any,
                translations: [
                    {
                        languageCode: ctx.languageCode,
                        name: variantName,
                    },
                ],
            },
        ]);

        // Assign the new variant(s) to every resolved collection
        const variantIds = createdVariants.map((v) => v.id);
        await this.assignVariantsToCollections(ctx, variantIds, collectionIds);
    }

    private async updateVariant(
        ctx: RequestContext,
        variantId: ID,
        row: ExcelProductRow,
        collectionIds: ID[],
        facetValueIds: ID[],
    ): Promise<void> {
        await this.productVariantService.update(ctx, [
            {
                id: variantId,
                sku: row.sku,
                price: row.price,
                stockOnHand: row.stock,
                facetValueIds,
                customFields: row.customFields as any,
                translations: [
                    {
                        languageCode: ctx.languageCode,
                        name: row.variantName || row.productName,
                    },
                ],
            },
        ]);

        // Also update the product-level fields (name, description, facets) on update
        const variants = await this.productVariantService.findAll(ctx, {
            filter: { sku: { eq: row.sku } },
            take: 1,
        });
        const variant = variants.items[0];
        if (variant?.productId) {
            try {
                await this.productService.update(ctx, {
                    id: variant.productId,
                    enabled: row.enabled,
                    facetValueIds,
                    customFields: row.customFields as any,
                    translations: [
                        {
                            languageCode: ctx.languageCode,
                            name: row.productName,
                            description: row.description,
                            customFields: {
                                metaTitle: row.seoTitle || undefined,
                                metaDescription: row.seoDescription || undefined,
                            } as any,
                        },
                    ],
                });
            } catch (_) {
                // Non-fatal — variant update already succeeded
            }
        }

        // Assign to collections (add missing; existing are preserved via ON CONFLICT DO NOTHING)
        await this.assignVariantsToCollections(ctx, [variantId], collectionIds);
    }

    /**
     * Resolve collection IDs from an Excel row.
     * Merges both `categories` and `collections` columns, supports comma and
     * pipe separators, and looks up each entry by slug then by name.
     */
    private async resolveCollectionIds(ctx: RequestContext, row: ExcelProductRow): Promise<ID[]> {
        // Merge categories + collections columns; support both , and | separators
        const combined = [row.categories ?? '', row.collections ?? '']
            .join(',')
            .split(/[,|]/)
            .map((s) => s.trim())
            .filter(Boolean);

        if (combined.length === 0) return [];

        // Deduplicate (case-insensitive)
        const unique = [...new Map(combined.map((s) => [s.toLowerCase(), s])).values()];

        const ids: ID[] = [];
        const missing: string[] = [];

        for (const token of unique) {
            try {
                // 1) Try exact slug match
                const bySlug = await this.collectionService.findAll(ctx, {
                    filter: { slug: { eq: token } },
                    take: 1,
                });
                if (bySlug.items[0]) {
                    ids.push(bySlug.items[0].id);
                    continue;
                }

                // 2) Try case-insensitive name match
                const byName = await this.collectionService.findAll(ctx, {
                    filter: { name: { eq: token } },
                    take: 1,
                });
                if (byName.items[0]) {
                    ids.push(byName.items[0].id);
                    continue;
                }

                // 3) Try lowercase name
                const lowerToken = token.toLowerCase();
                const byNameLower = await this.collectionService.findAll(ctx, {
                    filter: { name: { eq: lowerToken } },
                    take: 1,
                });
                if (byNameLower.items[0]) {
                    ids.push(byNameLower.items[0].id);
                    continue;
                }

                missing.push(token);
            } catch (_) {
                missing.push(token);
            }
        }

        if (missing.length > 0) {
            this.logger.warn(`[Import] Collections not found (skipped): ${missing.map((m) => `"${m}"`).join(', ')}`);
        }

        if (ids.length > 0) {
            this.logger.log(`[Import] Resolved ${ids.length} collection(s): [${ids.join(', ')}]`);
        }

        return ids;
    }

    private async resolveCategoryIds(ctx: RequestContext, categoriesStr: string): Promise<string[]> {
        if (!categoriesStr) return [];
        const slugs = categoriesStr.split(',').map((s) => s.trim()).filter(Boolean);
        const ids: string[] = [];
        const categoryRepo = this.connection.getRepository(ctx, Category);
        for (const slug of slugs) {
            try {
                const match = await categoryRepo.findOne({
                    where: { slug },
                });
                if (match) {
                    ids.push(match.id.toString());
                } else {
                    this.logger.warn(`Category slug "${slug}" not found in database.`);
                }
            } catch (err: any) {
                this.logger.error(`Error resolving category slug "${slug}": ${err.message}`);
            }
        }
        return ids;
    }

    /**
     * Insert (variantId, collectionId) pairs into the Vendure junction table.
     * Uses ON CONFLICT DO NOTHING so it is fully idempotent — safe to call for
     * both create and update flows.
     */
    private async assignVariantsToCollections(
        ctx: RequestContext,
        variantIds: ID[],
        collectionIds: ID[],
    ): Promise<void> {
        if (variantIds.length === 0 || collectionIds.length === 0) return;

        let assigned = 0;
        for (const variantId of variantIds) {
            for (const collectionId of collectionIds) {
                try {
                    await this.connection.rawConnection.query(
                        `INSERT INTO collection_product_variants_product_variant
                            ("collectionId", "productVariantId")
                         VALUES ($1, $2)
                         ON CONFLICT DO NOTHING`,
                        [collectionId, variantId],
                    );
                    assigned++;
                } catch (err: any) {
                    this.logger.warn(
                        `[Import] Failed to assign variant ${variantId} to collection ${collectionId}: ${err?.message}`,
                    );
                }
            }
        }

        if (assigned > 0) {
            this.logger.log(
                `[Import] Assigned ${variantIds.length} variant(s) to ${collectionIds.length} collection(s) (${assigned} relations written)`,
            );
        }
    }

    private async resolveFacetValueIds(ctx: RequestContext, facetsStr: string): Promise<ID[]> {
        if (!facetsStr) return [];
        const pairs = facetsStr.split(',').map((s) => s.trim()).filter(Boolean);
        const ids: ID[] = [];
        for (const pair of pairs) {
            const [facetCode, valueCode] = pair.split(':').map((s) => s.trim());
            if (!facetCode || !valueCode) continue;
            try {
                const result = await this.facetValueService.findAll(ctx, ctx.languageCode);
                const match = (Array.isArray(result) ? result : (result as any).items ?? []).find(
                    (fv) =>
                        (fv as any).facet?.code?.toLowerCase() === facetCode.toLowerCase() &&
                        (fv as any).code?.toLowerCase() === valueCode.toLowerCase(),
                );
                if (match) ids.push(match.id);
            } catch (_) { }
        }
        return ids;
    }

    private async getDefaultTaxCategoryId(ctx: RequestContext): Promise<ID> {
        const { TaxCategory } = await import('@vendure/core');
        const repo = this.connection.getRepository(ctx, TaxCategory);
        const cat = await repo.findOne({ where: {} });
        if (cat) return cat.id;
        const allCategories = await repo.find();
        return allCategories[0]?.id ?? (1 as ID);
    }

    private async buildWorkerCtx(channelToken: string, languageCode: string): Promise<RequestContext> {
        const { Channel } = await import('@vendure/core');
        const channelRepo = this.connection.rawConnection.getRepository(Channel);
        const channel = await channelRepo.findOne({
            where: { token: channelToken },
            relations: ['defaultTaxZone', 'defaultShippingZone'],
        });

        return RequestContext.deserialize({
            _channel: channel ?? { token: channelToken },
            _languageCode: languageCode ?? (languageCode as any) ?? LanguageCode.en,
            _isAuthorized: true,
            _authorizedAsOwnerOnly: false,
        } as any);
    }

    async saveUploadedFile(stream: NodeJS.ReadableStream, originalName: string): Promise<string> {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'product-import-'));
        const ext = path.extname(originalName) || '.xlsx';
        const tmpPath = path.join(tmpDir, `upload${ext}`);

        return new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(tmpPath);
            stream.pipe(writeStream);
            writeStream.on('finish', () => resolve(tmpPath));
            writeStream.on('error', reject);
            (stream as any).on?.('error', reject);
        });
    }

    async saveImageFile(stream: NodeJS.ReadableStream, originalName: string): Promise<string> {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'img-import-'));
        const tmpPath = path.join(tmpDir, originalName);

        return new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(tmpPath);
            stream.pipe(writeStream);
            writeStream.on('finish', () => resolve(tmpPath));
            writeStream.on('error', reject);
        });
    }

    async processImagesDirectly(
        ctx: RequestContext,
        filePaths: string[],
        zipPath?: string,
    ): Promise<ImageMappingResult> {
        const { result, skuAssetMap } = await this.assetMapping.processImages(ctx, filePaths, zipPath);

        if (result.matched > 0) {
            await this.applyAssetMapping(ctx, skuAssetMap);
        }

        return result;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UPDATED: Link uploaded assets to BOTH variant AND product
    // ─────────────────────────────────────────────────────────────────────────
    private async applyAssetMapping(
        ctx: RequestContext,
        skuAssetMap: Map<string, { featuredId: string | null; galleryIds: string[] }>,
    ) {
        for (const [sku, assets] of skuAssetMap.entries()) {
            try {
                const variants = await this.productVariantService.findAll(ctx, {
                    filter: { sku: { eq: sku } },
                    take: 1,
                });
                const variant = variants.items[0];

                if (!variant) {
                    this.logger.warn(`No variant found for SKU: ${sku} during image mapping.`);
                    continue;
                }

                const assetIds = [
                    ...(assets.featuredId ? [assets.featuredId] : []),
                    ...assets.galleryIds,
                ];

                // ── Variant: gets ALL its images (featured + gallery) ─────────
                await this.productVariantService.update(ctx, [{
                    id: variant.id,
                    featuredAssetId: assets.featuredId || undefined,
                    assetIds,                                         // ← unchanged
                }]);

                // ── Product: gets ONLY featured images from variants ──────────
                const fullVariant = await this.productVariantService.findOne(ctx, variant.id);
                const productId = (fullVariant as any)?.productId;
                if (!productId) continue;

                const product = await this.productService.findOne(ctx, productId);
                if (!product) continue;

                const productUpdateInput: any = { id: productId };

                // Set product featuredAsset only if not already set
                if (!product.featuredAsset && assets.featuredId) {
                    productUpdateInput.featuredAssetId = assets.featuredId;
                }

                // ✅ CHANGE: only collect featuredIds from variants — not galleryIds
                if (assets.featuredId) {
                    const existingProductAssetIds =
                        product.assets?.map((a) => String(a.id)) ?? [];

                    const mergedAssetIds = [
                        ...new Set([
                            ...existingProductAssetIds,
                            assets.featuredId,          // ← only featuredId, not galleryIds
                        ]),
                    ];

                    if (mergedAssetIds.length > existingProductAssetIds.length) {
                        productUpdateInput.assetIds = mergedAssetIds;
                    }
                }

                if (productUpdateInput.featuredAssetId || productUpdateInput.assetIds) {
                    await this.productService.update(ctx, productUpdateInput);
                }

            } catch (err: any) {
                this.logger.error(`Failed to apply assets to SKU ${sku}: ${err.message}`);
            }
        }
    }
}