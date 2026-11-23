import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
    REPORT_SHEET_FAILED,
    REPORT_SHEET_SKIPPED,
    REPORT_SHEET_SUCCESS,
    REPORT_SHEET_SUMMARY,
    REPORT_SHEET_WARNINGS,
    REPORT_COLOR_ERROR_BG,
    REPORT_COLOR_ERROR_TEXT,
    REPORT_COLOR_WARN_BG,
    REPORT_COLOR_WARN_TEXT,
    REPORT_COLOR_SUCCESS_BG,
    REPORT_COLOR_SUCCESS_TEXT,
    REPORT_COLOR_SKIPPED_BG,
    REPORT_COLOR_SKIPPED_TEXT,
    REPORT_COLOR_HEADER_BG,
} from '../constants';
import { ImportLogStatus } from '../types';
import type { ImportJob } from '../entities/import-job.entity';
import type { ImportLog } from '../entities/import-log.entity';

// Column definition shared across all data sheets
const DATA_COLUMNS: Array<{ header: string; key: string; width: number }> = [
    { header: 'Row #',          key: 'rowNumber',    width: 8 },
    { header: 'SKU',            key: 'sku',          width: 18 },
    { header: 'Product Name',   key: 'productName',  width: 35 },
    { header: 'Slug',           key: 'slug',         width: 35 },
    { header: 'Status',         key: 'status',       width: 12 },
    { header: 'Message',        key: 'message',      width: 55 },
    { header: 'Suggested Fix',  key: 'suggestedFix', width: 45 },
    { header: 'Processed At',   key: 'processedAt',  width: 22 },
];

// Row-level colour palette
const STATUS_STYLE: Record<
    ImportLogStatus,
    { bgColor: string; textColor: string }
> = {
    [ImportLogStatus.ERROR]:   { bgColor: REPORT_COLOR_ERROR_BG,   textColor: REPORT_COLOR_ERROR_TEXT },
    [ImportLogStatus.WARNING]: { bgColor: REPORT_COLOR_WARN_BG,    textColor: REPORT_COLOR_WARN_TEXT },
    [ImportLogStatus.SUCCESS]: { bgColor: REPORT_COLOR_SUCCESS_BG, textColor: REPORT_COLOR_SUCCESS_TEXT },
    [ImportLogStatus.SKIPPED]: { bgColor: REPORT_COLOR_SKIPPED_BG, textColor: REPORT_COLOR_SKIPPED_TEXT },
};

/**
 * Generates a richly-formatted Excel (.xlsx) import results report.
 *
 * Sheets produced:
 *   1. Summary      – job metadata + statistics
 *   2. Failed Rows  – rows with ERROR status (red)
 *   3. Warnings     – rows with WARNING status (yellow)
 *   4. Successful Rows – rows with SUCCESS status (green)
 *   5. Skipped Rows – rows with SKIPPED status (grey)
 *
 * Features: frozen header row, auto-sized columns, colour-coded rows,
 * bold column headers with blue background, freeze pane on row 1.
 */
@Injectable()
export class ExcelReportService {
    private readonly logger = new Logger(ExcelReportService.name);

    /**
     * Generate the report for the given job and write it to the system temp
     * directory.  Returns the absolute path of the saved .xlsx file.
     */
    async generateReport(job: ImportJob, logs: ImportLog[]): Promise<string> {
        const wb = new ExcelJS.Workbook();
        wb.creator = 'Homestore Import System';
        wb.created = new Date();
        wb.modified = new Date();

        // Build a lookup of SKU → productName from the logs' message text
        // (best effort — messages carry the product name in human-readable form)
        const skuNameMap = this.buildSkuNameMap(logs);

        // Partition logs by status
        const failed   = logs.filter((l) => l.status === ImportLogStatus.ERROR);
        const warnings = logs.filter((l) => l.status === ImportLogStatus.WARNING);
        const success  = logs.filter((l) => l.status === ImportLogStatus.SUCCESS);
        const skipped  = logs.filter((l) => l.status === ImportLogStatus.SKIPPED);

        this.buildSummarySheet(wb, job, { failed, warnings, success, skipped });
        this.buildDataSheet(wb, REPORT_SHEET_FAILED,   failed,   ImportLogStatus.ERROR,   skuNameMap);
        this.buildDataSheet(wb, REPORT_SHEET_WARNINGS, warnings, ImportLogStatus.WARNING,  skuNameMap);
        this.buildDataSheet(wb, REPORT_SHEET_SUCCESS,  success,  ImportLogStatus.SUCCESS,  skuNameMap);
        this.buildDataSheet(wb, REPORT_SHEET_SKIPPED,  skipped,  ImportLogStatus.SKIPPED,  skuNameMap);

        // Write to a temp file
        const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'import-report-'));
        const safeName = job.fileName.replace(/[^a-z0-9._-]/gi, '_').replace(/\.[^.]+$/, '');
        const outPath = path.join(outDir, `import-report-${safeName}-${job.id}.xlsx`);

        await wb.xlsx.writeFile(outPath);
        this.logger.log(`Excel report written to ${outPath}`);
        return outPath;
    }

    // ------------------------------------------------------------------
    // Summary sheet
    // ------------------------------------------------------------------

    private buildSummarySheet(
        wb: ExcelJS.Workbook,
        job: ImportJob,
        counts: {
            failed: ImportLog[];
            warnings: ImportLog[];
            success: ImportLog[];
            skipped: ImportLog[];
        },
    ) {
        const ws = wb.addWorksheet(REPORT_SHEET_SUMMARY);
        ws.getColumn(1).width = 28;
        ws.getColumn(2).width = 50;

        // Title
        const titleRow = ws.addRow(['IMPORT RESULTS REPORT']);
        titleRow.getCell(1).font = { bold: true, size: 18, color: { argb: 'FF1565C0' } };
        titleRow.height = 32;
        ws.addRow([]);

        // Metadata section
        const metaRows: [string, string | number | boolean | null][] = [
            ['Job ID',         job.id as string],
            ['File Name',      job.fileName],
            ['Import Mode',    job.mode],
            ['Dry Run',        job.dryRun ? 'Yes (no changes were saved)' : 'No'],
            ['Initiated By',   job.initiatedBy],
            ['Status',         job.status],
            ['Started At',     job.startedAt ? new Date(job.startedAt).toLocaleString() : '—'],
            ['Completed At',   job.completedAt ? new Date(job.completedAt).toLocaleString() : '—'],
            ['Duration',       job.durationMs != null ? `${(job.durationMs / 1000).toFixed(1)} seconds` : '—'],
        ];

        metaRows.forEach(([label, value]) => {
            const row = ws.addRow([label, value]);
            row.getCell(1).font = { bold: true, size: 10 };
            row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
            row.getCell(2).font = { size: 10 };
            row.height = 18;
        });

        ws.addRow([]);

        // Statistics section
        const statsHeader = ws.addRow(['STATISTICS', '']);
        statsHeader.getCell(1).font = { bold: true, size: 13, color: { argb: 'FF1565C0' } };
        statsHeader.height = 22;

        const total = (job.totalRows ?? 0);
        const statsRows: [string, number, string][] = [
            ['Total Rows',       total,                  ''],
            ['✅ Successful',    counts.success.length,  REPORT_COLOR_SUCCESS_BG],
            ['⚠️  Warnings',    counts.warnings.length,  REPORT_COLOR_WARN_BG],
            ['❌ Failed',        counts.failed.length,   REPORT_COLOR_ERROR_BG],
            ['⏭  Skipped',      counts.skipped.length,  REPORT_COLOR_SKIPPED_BG],
        ];

        statsRows.forEach(([label, value, bg]) => {
            const row = ws.addRow([label, value]);
            row.height = 20;
            row.getCell(1).font = { bold: true, size: 11 };
            row.getCell(2).font = { bold: true, size: 14 };
            row.getCell(2).alignment = { horizontal: 'left' };
            if (bg) {
                row.eachCell((cell) => {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
                });
            }
        });

        ws.addRow([]);

        // Success rate bar
        if (total > 0) {
            const rate = Math.round((counts.success.length / total) * 100);
            const rateRow = ws.addRow(['Success Rate', `${rate}%`]);
            rateRow.getCell(1).font = { bold: true, size: 11 };
            rateRow.getCell(2).font = { bold: true, size: 14,
                color: { argb: rate >= 90 ? REPORT_COLOR_SUCCESS_TEXT : rate >= 60 ? REPORT_COLOR_WARN_TEXT : REPORT_COLOR_ERROR_TEXT },
            };
            rateRow.height = 22;
        }
    }

    // ------------------------------------------------------------------
    // Data sheets (Failed / Warnings / Success / Skipped)
    // ------------------------------------------------------------------

    private buildDataSheet(
        wb: ExcelJS.Workbook,
        sheetName: string,
        logs: ImportLog[],
        status: ImportLogStatus,
        skuNameMap: Map<string, string>,
    ) {
        const ws = wb.addWorksheet(sheetName, {
            views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
        });

        // Set column widths
        DATA_COLUMNS.forEach((col, i) => {
            ws.getColumn(i + 1).width = col.width;
        });

        // Header row — blue background, white bold text
        const headerRow = ws.addRow(DATA_COLUMNS.map((c) => c.header));
        headerRow.height = 24;
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: REPORT_COLOR_HEADER_BG } };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
            cell.border = {
                bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                right:  { style: 'thin', color: { argb: 'FF3d85c8' } },
            };
        });

        if (logs.length === 0) {
            const emptyRow = ws.addRow(['No rows in this category.']);
            emptyRow.getCell(1).font = { italic: true, color: { argb: 'FF9E9E9E' } };
            return;
        }

        const style = STATUS_STYLE[status];

        logs.forEach((log, idx) => {
            const productName = log.sku ? (skuNameMap.get(log.sku) ?? '') : '';
            const slug        = this.extractSlugFromMessage(log.message);
            const processedAt = log.updatedAt
                ? new Date(log.updatedAt).toLocaleString()
                : new Date(log.createdAt).toLocaleString();

            const dataRow = ws.addRow([
                log.rowNumber,
                log.sku ?? '',
                productName,
                slug,
                log.status,
                log.message,
                log.suggestedFix ?? '',
                processedAt,
            ]);

            dataRow.height = 18;

            // Alternate background within the status colour for readability
            const bg = idx % 2 === 0 ? style.bgColor : this.lightenArgb(style.bgColor);

            dataRow.eachCell((cell, colNumber) => {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
                cell.font = { size: 10, color: { argb: style.textColor } };
                cell.alignment = { vertical: 'middle', wrapText: colNumber >= 6 };
                cell.border = {
                    bottom: { style: 'hair', color: { argb: 'FFE0E0E0' } },
                };
            });

            // Status cell: bold + centered
            dataRow.getCell(5).font = { bold: true, size: 10, color: { argb: style.textColor } };
            dataRow.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };

            // Row number: right-aligned
            dataRow.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' };
        });

        // Auto-size message column (cap at 80 chars per line)
        ws.getColumn(6).width = 55;
        ws.getColumn(7).width = 45;
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    /**
     * Build a best-effort map of SKU → product name by scanning log messages.
     * Log messages contain patterns like: `Created product/variant for SKU "ST1234"`
     * We can also use the SKU itself as a fallback identifier.
     */
    private buildSkuNameMap(logs: ImportLog[]): Map<string, string> {
        const map = new Map<string, string>();
        for (const log of logs) {
            if (!log.sku) continue;
            // Try to extract name from message patterns like 'for "ProductName" (SKU ...'
            const match = log.message.match(/for\s+"([^"]+)"/i);
            if (match) {
                map.set(log.sku, match[1]);
            } else if (!map.has(log.sku)) {
                map.set(log.sku, '');
            }
        }
        return map;
    }

    /**
     * Try to extract a slug from a log message.
     * Messages may contain: 'slug "my-slug"' or similar.
     */
    private extractSlugFromMessage(message: string): string {
        const match = message.match(/slug\s+"([^"]+)"/i);
        return match ? match[1] : '';
    }

    /**
     * Lighten an ARGB hex colour slightly for alternating row backgrounds.
     * Works by blending toward white (FFFFFFFF) at 50%.
     */
    private lightenArgb(argb: string): string {
        // e.g. 'FFFCE4EC' → parse RGB, average with 255
        if (argb.length !== 8) return argb;
        const a = argb.slice(0, 2);
        const r = Math.round((parseInt(argb.slice(2, 4), 16) + 255) / 2).toString(16).padStart(2, '0');
        const g = Math.round((parseInt(argb.slice(4, 6), 16) + 255) / 2).toString(16).padStart(2, '0');
        const b = Math.round((parseInt(argb.slice(6, 8), 16) + 255) / 2).toString(16).padStart(2, '0');
        return `${a}${r}${g}${b}`.toUpperCase();
    }
}
