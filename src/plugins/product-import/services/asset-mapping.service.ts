import { Injectable, Logger } from '@nestjs/common';
import { AssetService, RequestContext } from '@vendure/core';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import AdmZip from 'adm-zip';
import { ImageMappingResult } from '../types';
import { SUPPORTED_IMAGE_TYPES } from '../constants';

export interface MappedImage {
    sku: string;
    isFeatured: boolean;
    filePath: string;
    fileName: string;
    assetId?: string;
}

@Injectable()
export class AssetMappingService {
    private readonly logger = new Logger(AssetMappingService.name);

    constructor(private assetService: AssetService) {}

    /**
     * Extract images from a ZIP file into a temp directory and return file paths.
     */
    extractZip(zipFilePath: string): string[] {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'import-images-'));
        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(tmpDir, true);

        const files: string[] = [];
        this.collectFiles(tmpDir, files);
        return files;
    }

    /**
     * Map image file paths to SKUs using filename conventions.
     * - ST1234.jpg → SKU=ST1234, featured=true
     * - ST1234_1.jpg → SKU=ST1234, featured=false
     * - ST1234_2.jpg → SKU=ST1234, featured=false
     */
    mapImagesToSkus(filePaths: string[]): Map<string, MappedImage[]> {
        const skuMap = new Map<string, MappedImage[]>();

        for (const filePath of filePaths) {
            const fileName = path.basename(filePath);
            const ext = path.extname(fileName).toLowerCase();

            if (!SUPPORTED_IMAGE_TYPES.includes(ext)) {
                this.logger.warn(`Skipping unsupported file type: ${fileName}`);
                continue;
            }

            const baseName = path.basename(fileName, ext);
            // Match SKU_N pattern (e.g. ST1234_1) or plain SKU (ST1234)
            const match = baseName.match(/^(.+?)(?:_(\d+))?$/);
            if (!match) continue;

            const sku = match[1].toUpperCase();
            const suffix = match[2];
            const isFeatured = suffix === undefined;

            const mapped: MappedImage = { sku, isFeatured, filePath, fileName };

            if (!skuMap.has(sku)) {
                skuMap.set(sku, []);
            }
            const images = skuMap.get(sku)!;

            // Sort: featured image first, then by suffix index
            if (isFeatured) {
                images.unshift(mapped);
            } else {
                images.push(mapped);
            }
        }

        return skuMap;
    }

    /**
     * Upload a single image file via AssetService and return the asset ID.
     */
    async uploadImageAsAsset(ctx: RequestContext, filePath: string): Promise<string | null> {
        try {
            const fileName = path.basename(filePath);
            const mimeType = this.getMimeType(fileName);
            const fileStream = fs.createReadStream(filePath);
            const stat = fs.statSync(filePath);

            const asset = await this.assetService.create(ctx, {
                file: {
                    createReadStream: () => fileStream,
                    filename: fileName,
                    mimetype: mimeType,
                    encoding: '7bit',
                } as any,
                tags: ['imported'],
            });

            return (asset as any).id?.toString() ?? null;
        } catch (err: any) {
            this.logger.error(`Failed to upload asset ${filePath}: ${err.message}`);
            return null;
        }
    }

    /**
     * Process all images: upload them and return a mapping of SKU → asset IDs.
     */
    async processImages(
        ctx: RequestContext,
        filePaths: string[],
        zipPath?: string,
    ): Promise<{ result: ImageMappingResult; skuAssetMap: Map<string, { featuredId: string | null; galleryIds: string[] }> }> {
        let allFiles = [...filePaths];

        if (zipPath && fs.existsSync(zipPath)) {
            try {
                const extracted = this.extractZip(zipPath);
                allFiles = [...allFiles, ...extracted];
            } catch (err: any) {
                this.logger.error(`Failed to extract ZIP: ${err.message}`);
            }
        }

        const skuMap = this.mapImagesToSkus(allFiles);
        const skuAssetMap = new Map<string, { featuredId: string | null; galleryIds: string[] }>();
        let matched = 0;
        const unmatchedFiles: string[] = [];

        for (const [sku, images] of skuMap.entries()) {
            const featuredId = images[0]?.isFeatured
                ? await this.uploadImageAsAsset(ctx, images[0].filePath)
                : null;
            const galleryIds: string[] = [];

            for (let i = featuredId ? 1 : 0; i < images.length; i++) {
                const id = await this.uploadImageAsAsset(ctx, images[i].filePath);
                if (id) galleryIds.push(id);
            }

            skuAssetMap.set(sku, { featuredId, galleryIds });
            matched += images.length;
        }

        // Find unmatched files (files that don't map to any known SKU path)
        for (const filePath of allFiles) {
            const ext = path.extname(filePath).toLowerCase();
            if (!SUPPORTED_IMAGE_TYPES.includes(ext)) {
                unmatchedFiles.push(path.basename(filePath));
            }
        }

        return {
            result: {
                matched,
                unmatched: unmatchedFiles.length,
                total: allFiles.length,
                unmatchedFiles,
                errors: [],
            },
            skuAssetMap,
        };
    }

    private collectFiles(dir: string, result: string[]) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                this.collectFiles(fullPath, result);
            } else {
                result.push(fullPath);
            }
        }
    }

    private getMimeType(fileName: string): string {
        const ext = path.extname(fileName).toLowerCase();
        const map: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
        };
        return map[ext] ?? 'application/octet-stream';
    }
}
