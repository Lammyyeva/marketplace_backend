export const PRODUCT_IMPORT_PLUGIN_OPTIONS = 'PRODUCT_IMPORT_PLUGIN_OPTIONS';
export const PRODUCT_IMPORT_JOB_NAME = 'product-import-job';
export const IMAGE_IMPORT_JOB_NAME = 'image-import-job';
export const BATCH_SIZE = 50;
export const MAX_FILE_SIZE_MB = 100;
export const SUPPORTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
export const SUPPORTED_EXCEL_TYPES = ['.xlsx', '.xls'];
export const TEMPLATE_SHEET_NAME = 'Products';
export const INSTRUCTIONS_SHEET_NAME = 'Instructions';

/** Maximum slug length before truncation */
export const MAX_SLUG_LENGTH = 200;

/** Sheet names in the generated error report workbook */
export const REPORT_SHEET_SUMMARY = 'Summary';
export const REPORT_SHEET_FAILED = 'Failed Rows';
export const REPORT_SHEET_WARNINGS = 'Warnings';
export const REPORT_SHEET_SUCCESS = 'Successful Rows';
export const REPORT_SHEET_SKIPPED = 'Skipped Rows';

/** ARGB fill colours used in the error report */
export const REPORT_COLOR_ERROR_BG = 'FFFCE4EC';    // light red
export const REPORT_COLOR_ERROR_TEXT = 'FFC62828';
export const REPORT_COLOR_WARN_BG = 'FFFFF8E1';     // light yellow
export const REPORT_COLOR_WARN_TEXT = 'FFF57F17';
export const REPORT_COLOR_SUCCESS_BG = 'FFE8F5E9';  // light green
export const REPORT_COLOR_SUCCESS_TEXT = 'FF2E7D32';
export const REPORT_COLOR_SKIPPED_BG = 'FFF5F5F5';  // light grey
export const REPORT_COLOR_SKIPPED_TEXT = 'FF616161';
export const REPORT_COLOR_HEADER_BG = 'FF1565C0';   // blue header
