import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { INSTRUCTIONS_SHEET_NAME, TEMPLATE_SHEET_NAME } from '../constants';
import { TransactionalConnection, ProductVariant, RequestContext, TranslatorService } from '@vendure/core';

const COLUMNS = [
    { header: 'productName', key: 'productName', width: 30, required: true, note: 'Display name of the product' },
    {
        header: 'slug',
        key: 'slug',
        width: 30,
        required: false,
        // eslint-disable-next-line max-len
        note: 'URL-friendly identifier (e.g. my-product). OPTIONAL — if left empty it is auto-generated from productName + SKU (e.g. "apple-iphone-15-pro-max-st1234"). Must be lowercase, numbers, hyphens only.',
    },
    { header: 'description', key: 'description', width: 40, required: false, note: 'Full HTML or plain-text product description' },
    { header: 'sku', key: 'sku', width: 20, required: true, note: 'Stock Keeping Unit – must be unique per variant' },
    { header: 'variantName', key: 'variantName', width: 25, required: false, note: 'Variant label (e.g. "Red / XL"). Leave blank for single-variant products.' },
    { header: 'price', key: 'price', width: 15, required: true, note: 'Price in standard currency unit (e.g. 100.00 or 100)' },
    { header: 'stock', key: 'stock', width: 12, required: false, note: 'Available stock quantity (integer)' },
    { header: 'categories', key: 'categories', width: 30, required: false, note: 'Comma-separated category slugs (e.g. "electronics,gadgets")' },
    { header: 'collections', key: 'collections', width: 30, required: false, note: 'Comma-separated collection slugs' },
    { header: 'facets', key: 'facets', width: 30, required: false, note: 'Comma-separated facet values in format "facet:value" (e.g. "color:red,size:xl")' },
    { header: 'enabled', key: 'enabled', width: 12, required: false, note: 'TRUE or FALSE. Defaults to TRUE.' },
    { header: 'featuredAsset', key: 'featuredAsset', width: 25, required: false, note: 'File name of the featured image (must match uploaded image filename)' },
    { header: 'assetNames', key: 'assetNames', width: 40, required: false, note: 'Comma-separated additional asset filenames' },
    { header: 'seoTitle', key: 'seoTitle', width: 35, required: false, note: 'SEO meta title' },
    { header: 'seoDescription', key: 'seoDescription', width: 50, required: false, note: 'SEO meta description' },
    { header: 'customField_warranty', key: 'customField_warranty', width: 20, required: false, note: 'Custom field: warranty period' },
    { header: 'customField_brand', key: 'customField_brand', width: 20, required: false, note: 'Custom field: brand name' },
];

const EXAMPLE_ROWS = [
    {
        productName: 'Wireless Headphones Pro',
        slug: 'wireless-headphones-pro',
        description: '<p>Premium noise-cancelling wireless headphones with 30h battery life.</p>',
        sku: 'ST1234',
        variantName: 'Black',
        price: 199.99,
        stock: 50,
        categories: 'electronics,audio',
        collections: 'new-arrivals,bestsellers',
        facets: 'color:black,brand:sony',
        enabled: true,
        featuredAsset: 'ST1234.jpg',
        assetNames: 'ST1234_1.jpg,ST1234_2.jpg',
        seoTitle: 'Best Wireless Headphones | Homestore',
        seoDescription: 'Shop the best wireless noise-cancelling headphones with 30h battery.',
        customField_warranty: '2 years',
        customField_brand: 'Sony',
    },
    {
        productName: 'Wireless Headphones Pro',
        slug: 'wireless-headphones-pro',
        description: '',
        sku: 'ST1234-WHT',
        variantName: 'White',
        price: 199.99,
        stock: 30,
        categories: 'electronics,audio',
        collections: 'new-arrivals',
        facets: 'color:white,brand:sony',
        enabled: true,
        featuredAsset: 'ST1234-WHT.jpg',
        assetNames: '',
        seoTitle: '',
        seoDescription: '',
        customField_warranty: '2 years',
        customField_brand: 'Sony',
    },
    {
        productName: 'USB-C Cable 2m',
        slug: '',  // intentionally blank — slug will be auto-generated as "usb-c-cable-2m-cable-002"
        description: 'Fast charging USB-C to USB-C cable, 2 meters.',
        sku: 'CABLE-002',
        variantName: '',
        price: 14.99,
        stock: 200,
        categories: 'accessories',
        collections: '',
        facets: 'material:nylon',
        enabled: true,
        featuredAsset: 'CABLE-002.jpg',
        assetNames: '',
        seoTitle: '',
        seoDescription: '',
        customField_warranty: '1 year',
        customField_brand: 'Generic',
    },
];

@Injectable()
export class ExcelTemplateService {
    constructor(
        private connection: TransactionalConnection,
        private translator: TranslatorService,
    ) {}

    async generateTemplate(): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Homestore';
        workbook.created = new Date();

        this.buildProductSheet(workbook);
        this.buildInstructionsSheet(workbook);

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    async exportProducts(ctx: RequestContext): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Homestore';
        workbook.created = new Date();

        const sheet = workbook.addWorksheet(TEMPLATE_SHEET_NAME, {
            views: [{ state: 'frozen', xSplit: 0, ySplit: 2 }],
        });

        // Header row styling
        const headerRow = sheet.addRow(COLUMNS.map((c) => c.header));
        headerRow.height = 28;
        headerRow.eachCell((cell, colNumber) => {
            const col = COLUMNS[colNumber - 1];
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: col?.required ? 'FF1565C0' : 'FF424242' },
            };
            cell.border = {
                bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                right: { style: 'thin', color: { argb: 'FF616161' } },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // Note row
        const noteRow = sheet.addRow(COLUMNS.map((c) => c.note));
        noteRow.height = 18;
        noteRow.eachCell((cell) => {
            cell.font = { italic: true, color: { argb: 'FF757575' }, size: 9 };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
            cell.alignment = { wrapText: true, vertical: 'middle' };
        });

        // Query all variants from database
        const variants = await this.connection.getRepository(ctx, ProductVariant).find({
            relations: [
                'product',
                'product.translations',
                'translations',
                'productVariantPrices',
                'featuredAsset',
                'assets',
                'product.customFields.categories',
                'product.customFields.categories.translations',
                'collections',
                'collections.translations',
                'facetValues',
                'facetValues.translations',
                'facetValues.facet',
                'facetValues.facet.translations',
                'stockLevels',
            ],
            order: { sku: 'ASC' },
        });

        // Populate rows
        variants.forEach((variant, index) => {
            const translatedProduct = this.translator.translate(variant.product, ctx);
            const translatedVariant = this.translator.translate(variant, ctx);

            // Fetch categories as comma-separated slugs
            const categories = variant.product.customFields?.categories
                ?.map((c) => c.slug)
                .filter(Boolean)
                .join(',') ?? '';

            // Fetch collections as comma-separated slugs
            const collections = variant.collections
                ?.map((col) => col.slug)
                .filter(Boolean)
                .join(',') ?? '';

            // Fetch facets as comma-separated facetCode:facetValueCode
            const facets = variant.facetValues
                ?.map((fv) => {
                    const translatedFv = this.translator.translate(fv, ctx);
                    const translatedFacet = this.translator.translate(fv.facet, ctx);
                    return `${translatedFacet.code}:${translatedFv.code}`;
                })
                .filter(Boolean)
                .join(',') ?? '';

            // Fetch stock sum
            const stock = variant.stockLevels?.reduce((sum, sl) => sum + sl.stockOnHand, 0) ?? 0;

            // Fetch additional asset names
            const assetNames = variant.assets
                ?.map((a) => a.asset?.name)
                .filter((name) => name !== variant.featuredAsset?.name)
                .join(',') ?? '';

            const rowData: Record<string, any> = {
                productName: translatedProduct.name,
                slug: translatedProduct.slug,
                description: translatedProduct.description,
                sku: variant.sku,
                variantName: translatedVariant.name,
                price: (variant.productVariantPrices?.[0]?.price ?? 0) / 100,
                stock,
                categories,
                collections,
                facets,
                enabled: variant.enabled ? 'TRUE' : 'FALSE',
                featuredAsset: variant.featuredAsset?.name ?? '',
                assetNames,
                seoTitle: (variant.product.customFields as any)?.seoTitle ?? '',
                seoDescription: (variant.product.customFields as any)?.seoDescription ?? '',
                customField_warranty: (variant.product.customFields as any)?.warranty ?? '',
                customField_brand: (variant.product.customFields as any)?.brand ?? '',
            };

            const dataRow = sheet.addRow(COLUMNS.map((c) => rowData[c.key] ?? ''));
            dataRow.height = 20;
            dataRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: index % 2 === 0 ? 'FFFFFFFF' : 'FFF9F9F9' },
                };
                cell.border = {
                    bottom: { style: 'hair', color: { argb: 'FFE0E0E0' } },
                };
                cell.alignment = { vertical: 'middle' };
            });
        });

        // Column widths
        COLUMNS.forEach((col, i) => {
            sheet.getColumn(i + 1).width = col.width;
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }


    private buildProductSheet(workbook: ExcelJS.Workbook) {
        const sheet = workbook.addWorksheet(TEMPLATE_SHEET_NAME, {
            views: [{ state: 'frozen', xSplit: 0, ySplit: 2 }],
        });

        // Header row styling
        const headerRow = sheet.addRow(COLUMNS.map((c) => c.header));
        headerRow.height = 28;
        headerRow.eachCell((cell, colNumber) => {
            const col = COLUMNS[colNumber - 1];
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: col?.required ? 'FF1565C0' : 'FF424242' },
            };
            cell.border = {
                bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                right: { style: 'thin', color: { argb: 'FF616161' } },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // Note row
        const noteRow = sheet.addRow(COLUMNS.map((c) => c.note));
        noteRow.height = 18;
        noteRow.eachCell((cell) => {
            cell.font = { italic: true, color: { argb: 'FF757575' }, size: 9 };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
            cell.alignment = { wrapText: true, vertical: 'middle' };
        });

        // Add data validation for boolean columns
        const enabledColIndex = COLUMNS.findIndex((c) => c.key === 'enabled') + 1;
        if (enabledColIndex > 0) {
            const colLetter = this.colLetter(enabledColIndex);
            sheet.getColumn(enabledColIndex).eachCell({ includeEmpty: false }, (cell, rowNumber) => {
                if (rowNumber <= 2) return;
                sheet.getCell(`${colLetter}${rowNumber}`).dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formulae: ['"TRUE,FALSE"'],
                };
            });
        }

        // Example rows
        EXAMPLE_ROWS.forEach((row, index) => {
            const dataRow = sheet.addRow(COLUMNS.map((c) => (row as any)[c.key] ?? ''));
            dataRow.height = 20;
            dataRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: index % 2 === 0 ? 'FFFFFFFF' : 'FFF9F9F9' },
                };
                cell.border = {
                    bottom: { style: 'hair', color: { argb: 'FFE0E0E0' } },
                };
                cell.alignment = { vertical: 'middle' };
            });
        });

        // Column widths
        COLUMNS.forEach((col, i) => {
            sheet.getColumn(i + 1).width = col.width;
        });
    }

    private buildInstructionsSheet(workbook: ExcelJS.Workbook) {
        const sheet = workbook.addWorksheet(INSTRUCTIONS_SHEET_NAME);
        sheet.getColumn(1).width = 20;
        sheet.getColumn(2).width = 70;

        const title = sheet.addRow(['IMPORT INSTRUCTIONS', '']);
        title.getCell(1).font = { bold: true, size: 16, color: { argb: 'FF1565C0' } };
        sheet.addRow([]);

        const sections: Array<[string, string]> = [
            ['Mode: CREATE', 'Only creates new products. Skips rows where SKU already exists.'],
            ['Mode: UPDATE', 'Only updates existing products. Skips rows where SKU does not exist.'],
            ['Mode: UPSERT', 'Creates new products OR updates existing ones based on SKU match.'],
            ['', ''],
            ['Required Fields', 'productName, sku, price  (slug is OPTIONAL)'],
            // eslint-disable-next-line max-len
            ['Auto Slug', 'If the slug column is left blank the system auto-generates one from productName + SKU. Example: "Apple iPhone 15 Pro Max" + "ST1234" → "apple-iphone-15-pro-max-st1234". Duplicates resolved by appending a numeric suffix.'],
            ['Slug Rules', 'If you provide a slug: use lowercase letters, numbers and hyphens only. No spaces or special characters.'],
            ['SKU Uniqueness', 'Each variant must have a unique SKU. The system matches on SKU first, then slug.'],
            ['Price Format', 'Enter price in standard currency unit. Example: 100.00 or 100'],
            ['Boolean Fields', 'Use TRUE or FALSE (case-insensitive). Defaults to TRUE if blank.'],
            ['', ''],
            ['Categories', 'Enter comma-separated category slugs. e.g. "electronics,audio"'],
            ['Collections', 'Enter comma-separated collection slugs.'],
            ['Facets', 'Enter as "facet:value" pairs, comma-separated. e.g. "color:red,size:xl"'],
            ['', ''],
            ['Assets / Images', 'Use the Upload Images page to bulk-upload images.'],
            ['', 'Image files should be named after the SKU. e.g. ST1234.jpg'],
            ['', 'Additional images: ST1234_1.jpg, ST1234_2.jpg, etc.'],
            ['', ''],
            ['Custom Fields', 'Add columns prefixed with "customField_" for any custom fields.'],
            ['', 'e.g. column "customField_warranty" maps to customFields.warranty'],
            ['', ''],
            ['Blue Headers', 'Required fields (blue background)'],
            ['Gray Headers', 'Optional fields (gray background)'],
        ];

        sections.forEach(([label, value]) => {
            const row = sheet.addRow([label, value]);
            if (label) {
                row.getCell(1).font = { bold: true, size: 10 };
                row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
            }
            row.getCell(2).font = { size: 10 };
            row.height = 18;
        });
    }

    private colLetter(col: number): string {
        let letter = '';
        while (col > 0) {
            const remainder = (col - 1) % 26;
            letter = String.fromCharCode(65 + remainder) + letter;
            col = Math.floor((col - 1) / 26);
        }
        return letter;
    }
}
