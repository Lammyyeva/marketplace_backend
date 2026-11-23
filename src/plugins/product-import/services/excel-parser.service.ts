import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { ExcelProductRow, ParsedExcelResult } from '../types';
import { TEMPLATE_SHEET_NAME } from '../constants';
import { SlugService } from './slug.service';

@Injectable()
export class ExcelParserService {
    private readonly logger = new Logger(ExcelParserService.name);

    constructor(private slugService: SlugService) {}

    async parseFile(filePath: string): Promise<ParsedExcelResult> {
        const rows: ExcelProductRow[] = [];
        const errors: Array<{ row: number; message: string }> = [];

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const workbook = new ExcelJS.Workbook();

        try {
            await workbook.xlsx.readFile(filePath);
        } catch (err: any) {
            throw new Error(`Failed to parse Excel file: ${err.message}`);
        }

        const sheet = workbook.getWorksheet(TEMPLATE_SHEET_NAME) ?? workbook.worksheets[0];
        if (!sheet) {
            throw new Error('No worksheet found in the uploaded file.');
        }

        // Row 1 = headers, Row 2 = notes/hints → data starts at row 3
        const headerRow = sheet.getRow(1);
        const headers: string[] = [];
        headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            headers[colNumber - 1] = String(cell.value ?? '').trim();
        });

        // 'slug' is now optional — only 'sku' and 'productName' are mandatory headers
        if (headers.length === 0 || !headers.includes('sku') || !headers.includes('productName')) {
            throw new Error(
                'Invalid template format: missing required header columns (productName, sku). Please use the provided template.',
            );
        }

        const firstDataRow = this.detectFirstDataRow(sheet, headers);

        sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber < firstDataRow) return;

            // Skip fully empty rows
            const cellValues = (row as any).values as any[];
            const nonEmpty = cellValues.filter((v) => v !== null && v !== undefined && v !== '');
            if (nonEmpty.length === 0) return;

            const record: Record<string, any> = { rowNumber };
            headers.forEach((header, index) => {
                if (!header) return;
                let value = row.getCell(index + 1).value;
                // Unwrap rich text
                if (value && typeof value === 'object' && 'richText' in (value as any)) {
                    value = (value as ExcelJS.CellRichTextValue).richText.map((r) => r.text).join('');
                }
                // Unwrap formula result
                if (value && typeof value === 'object' && 'result' in (value as any)) {
                    value = (value as ExcelJS.CellFormulaValue).result;
                }
                record[header] = value ?? '';
            });

            const parsed = this.mapRecord(record, rowNumber);
            const validationErrors = this.validateRow(parsed, rowNumber);
            if (validationErrors.length > 0) {
                errors.push(...validationErrors.map((msg) => ({ row: rowNumber, message: msg })));
            }

            rows.push(parsed);
        });

        this.logger.log(`Parsed ${rows.length} rows from ${filePath}, ${errors.length} validation errors`);

        return { rows, errors, totalRows: rows.length };
    }

    private detectFirstDataRow(sheet: ExcelJS.Worksheet, headers: string[]): number {
        // Row 2 is our instruction row — skip it; data starts at 3
        const row2 = sheet.getRow(2);
        const row2Val = String(row2.getCell(1).value ?? '').trim().toLowerCase();
        const isInstruction = row2Val.includes('display name') || row2Val.includes('url-friendly') || row2Val.includes('note');
        return isInstruction ? 3 : 2;
    }

    private mapRecord(record: Record<string, any>, rowNumber: number): ExcelProductRow {
        const customFields: Record<string, string> = {};

        Object.entries(record).forEach(([key, value]) => {
            if (key.startsWith('customField_')) {
                const fieldName = key.replace('customField_', '');
                customFields[fieldName] = String(value ?? '');
            }
        });

        const price = this.parseNumber(record['price']);
        const stock = this.parseNumber(record['stock']);

        const productName = String(record['productName'] ?? '').trim();
        const sku         = String(record['sku'] ?? '').trim().toUpperCase();
        const rawSlug     = String(record['slug'] ?? '').trim().toLowerCase();

        // Auto-generate slug when the column is blank
        let slug = rawSlug;
        let slugWasGenerated = false;
        if (!slug) {
            slug = this.slugService.generateSlug(productName, sku);
            slugWasGenerated = true;
        }

        return {
            rowNumber,
            productName,
            slug,
            slugWasGenerated,
            description: String(record['description'] ?? '').trim(),
            sku,
            variantName: String(record['variantName'] ?? '').trim(),
            price: isNaN(price) ? 0 : Math.round(price * 100),
            stock: isNaN(stock) ? 0 : Math.max(0, Math.floor(stock)),
            categories: String(record['categories'] ?? '').trim(),
            collections: String(record['collections'] ?? '').trim(),
            facets: String(record['facets'] ?? '').trim(),
            enabled: this.parseBoolean(record['enabled']),
            featuredAsset: String(record['featuredAsset'] ?? '').trim(),
            assetNames: String(record['assetNames'] ?? '').trim(),
            seoTitle: String(record['seoTitle'] ?? '').trim(),
            seoDescription: String(record['seoDescription'] ?? '').trim(),
            customFields,
        };
    }

    private validateRow(row: ExcelProductRow, rowNumber: number): string[] {
        const errors: string[] = [];

        if (!row.productName) errors.push(`Row ${rowNumber}: productName is required`);
        if (!row.sku) errors.push(`Row ${rowNumber}: sku is required`);
        // slug is optional — it will be auto-generated in the import service if empty
        if (row.price < 0) errors.push(`Row ${rowNumber}: price cannot be negative`);

        // Only validate format if slug was explicitly provided by the user
        if (row.slug && !row.slugWasGenerated) {
            const slugError = this.validateSlugFormat(row.slug);
            if (slugError) errors.push(`Row ${rowNumber}: ${slugError}`);
        }

        return errors;
    }

    private validateSlugFormat(slug: string): string | null {
        if (!/^[a-z0-9-]+$/.test(slug)) {
            return `slug "${slug}" contains invalid characters (use lowercase letters, numbers and hyphens only)`;
        }
        if (slug.length > 250) {
            return `slug is too long (max 250 characters)`;
        }
        return null;
    }

    private parseNumber(value: any): number {
        if (value === null || value === undefined || value === '') return NaN;
        return Number(value);
    }

    private parseBoolean(value: any): boolean {
        if (value === null || value === undefined || value === '') return true;
        if (typeof value === 'boolean') return value;
        const str = String(value).trim().toLowerCase();
        if (str === 'false' || str === '0' || str === 'no') return false;
        return true;
    }
}
