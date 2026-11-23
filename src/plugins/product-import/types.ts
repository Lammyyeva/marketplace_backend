export interface PluginInitOptions {}

export enum ImportJobStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}

export enum ImportMode {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    UPSERT = 'UPSERT',
}

export enum ImportLogStatus {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    SKIPPED = 'SKIPPED',
}

export interface ExcelProductRow {
    rowNumber: number;
    productName: string;
    /** Slug from Excel — empty string means auto-generate */
    slug: string;
    description: string;
    sku: string;
    variantName: string;
    price: number;
    stock: number;
    categories: string;
    collections: string;
    facets: string;
    enabled: boolean;
    featuredAsset: string;
    assetNames: string;
    seoTitle: string;
    seoDescription: string;
    customFields: Record<string, string>;
    /** Set to true when slug was auto-generated (not provided by user) */
    slugWasGenerated?: boolean;
    [key: string]: any;
}

/** One row in an Excel error/results report */
export interface ImportReportRow {
    rowNumber: number;
    sku: string;
    productName: string;
    slug: string;
    status: ImportLogStatus;
    message: string;
    suggestedFix: string;
    processedAt: string;
}

/** Summary statistics for an Excel report */
export interface ImportReportSummary {
    jobId: string;
    fileName: string;
    mode: string;
    dryRun: boolean;
    initiatedBy: string;
    startedAt: string;
    completedAt: string;
    durationMs: number | null;
    totalRows: number;
    successCount: number;
    failedCount: number;
    warningCount: number;
    skippedCount: number;
}

export interface ParsedExcelResult {
    rows: ExcelProductRow[];
    errors: Array<{ row: number; message: string }>;
    totalRows: number;
}

export interface ImageMappingResult {
    matched: number;
    unmatched: number;
    total: number;
    unmatchedFiles: string[];
    errors: string[];
}

export interface ProductImportJobData {
    filePath: string;
    fileName: string;
    mode: ImportMode;
    dryRun: boolean;
    jobEntityId: string;
    channelToken: string;
    languageCode: string;
    initiatedBy: string;
}

export interface ImageImportJobData {
    filePaths: string[];
    zipPath?: string;
    channelToken: string;
}

export interface ImportRowResult {
    rowNumber: number;
    sku: string;
    status: ImportLogStatus;
    message: string;
    suggestedFix?: string;
}
