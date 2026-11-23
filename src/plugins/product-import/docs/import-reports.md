# Import Reports

> Downloading, reading, and acting on Excel and JSON import reports

---

## Table of Contents

- [Overview](#overview)
- [Excel Report (.xlsx)](#excel-report-xlsx)
- [JSON Error Report](#json-error-report)
- [Downloading Reports](#downloading-reports)
- [Report Lifecycle](#report-lifecycle)
- [Acting on Report Data](#acting-on-report-data)

---

## Overview

Every completed import job (non-dry-run) produces two downloadable reports:

| Report Type | Format | Best For |
|---|---|---|
| Excel Report | `.xlsx` (multi-sheet) | Operations teams, non-technical users |
| JSON Error Report | `.json` | Automated processing, developer debugging |

Reports are accessible from:
- **Import History** page — green spreadsheet icon (Excel) or download icon (JSON)
- **Import Detail** page — buttons in the action bar and within the log viewer
- **REST API** — `GET /import/jobs/:id/error-report-excel` and `GET /import/jobs/:id/error-report`

---

## Excel Report (.xlsx)

### Sheets

The workbook contains five sheets:

#### Sheet 1: Summary

| Section | Content |
|---|---|
| Header | Job ID, file name, import mode, dry-run flag |
| Metadata | Initiated by, status, started at, completed at, duration |
| Statistics | Total rows, ✅ successful, ⚠️ warnings, ❌ failed, ⏭ skipped |
| Success Rate | Percentage with colour indicator (green/yellow/red) |

#### Sheet 2: Failed Rows 🔴

All rows with `ERROR` status. Red background.

#### Sheet 3: Warnings 🟡

All rows with `WARNING` status. Yellow background.

#### Sheet 4: Successful Rows 🟢

All rows with `SUCCESS` status. Green background.

#### Sheet 5: Skipped Rows ⚪

All rows with `SKIPPED` status (SKU exists in CREATE mode, or SKU missing in UPDATE mode). Grey background.

### Columns (sheets 2–5)

| Column | Description |
|---|---|
| Row # | Source Excel row number (matches your original file) |
| SKU | Product variant SKU |
| Product Name | Product name extracted from log messages |
| Slug | Slug used (or auto-generated) for this product |
| Status | ERROR / WARNING / SUCCESS / SKIPPED |
| Message | Full human-readable outcome description |
| Suggested Fix | Actionable guidance for resolving the issue |
| Processed At | Timestamp when the row was processed |

### Formatting

- **Blue header row** with white text — frozen so it stays visible while scrolling
- **Colour-coded rows**: red/yellow/green/grey background per status
- **Alternating row shading** within each colour for easier row tracking
- **Auto-sized columns** set for comfortable reading without manual resizing
- **Wrapped text** in Message and Suggested Fix columns

### Example: Summary Sheet

```
IMPORT RESULTS REPORT

Job ID          abc123xyz
File Name       products-2024-q4.xlsx
Import Mode     UPSERT
Dry Run         No
Initiated By    ADMIN_1
Status          COMPLETED
Started At      12/1/2024, 14:32:05
Completed At    12/1/2024, 14:34:18
Duration        133.0 seconds

STATISTICS
Total Rows      1,234
✅ Successful   1,190
⚠️  Warnings      24
❌ Failed          15
⏭  Skipped          5

Success Rate    96%
```

---

## JSON Error Report

The JSON report contains **only ERROR rows** (not warnings, successes, or skipped rows). It is intended for programmatic processing.

```json
[
  {
    "rowNumber": 8,
    "sku": "BAD-SKU",
    "error": "slug \"my product!\" contains invalid characters",
    "suggestedFix": "Change slug to use only lowercase letters, numbers, and hyphens."
  },
  {
    "rowNumber": 42,
    "sku": null,
    "error": "Row 42: productName is required",
    "suggestedFix": "Correct the cell value and re-upload."
  }
]
```

---

## Downloading Reports

### From the Dashboard

**Import History page:**

Each completed job row shows two action buttons:

| Button | Icon | Report type |
|---|---|---|
| Excel Report | 🟢 spreadsheet icon | `.xlsx` multi-sheet colour report |
| JSON Report | ⬇ download icon | JSON errors-only |

**Import Detail page:**

Two buttons appear in the action bar when status is `COMPLETED` or `FAILED`:
- **Excel Report** — green bordered button
- **JSON Report** — grey bordered button

The **log viewer** within the detail page also shows both download buttons in the top-right.

### Via REST API

```bash
# Excel report
curl -O -J \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/import/jobs/JOB_ID/error-report-excel"

# JSON error report
curl \
  -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/import/jobs/JOB_ID/error-report" \
  > errors.json
```

### Via JavaScript (browser)

```javascript
// Excel — triggers a browser file download
window.open(`/import/jobs/${jobId}/error-report-excel`, '_blank');

// JSON
const res = await fetch(`/import/jobs/${jobId}/error-report`, {
    credentials: 'include',
});
const errors = await res.json();
```

---

## Report Lifecycle

```
Job completes (COMPLETED or FAILED)
    ↓
ExcelReportService.generateReport() called
    ↓
Report written to /tmp/import-report-XXXX/<filename>.xlsx
    ↓
reportPath stored in import_job.reportPath column
    ↓
Admin requests download
    ↓
Controller checks: does file exist at reportPath?
  ├── Yes → stream the file
  └── No  → regenerate from stored ImportLog records, stream
```

### Report persistence

Reports are stored in the system temp directory and may be cleaned up by the OS or by maintenance cron jobs. The `import_job.reportPath` column stores the path, but:

- After a server restart or temp directory cleanup, the file may be gone
- The REST endpoint **automatically regenerates** the report on-demand if the file is missing
- Regenerated reports are identical because all log data is preserved in the `import_log` table

### Dry-run jobs

Reports are **not** generated for dry-run imports (since no data was saved and the logs only reflect validation results, not actual processing outcomes).

---

## Acting on Report Data

### Fixing failed rows

1. Open the Excel report and go to the **Failed Rows** sheet
2. Read the **Message** column for the specific error
3. Read the **Suggested Fix** column for actionable guidance
4. Correct the cell in your original Excel file
5. Re-upload **only** the failed rows using `UPSERT` mode to avoid duplicating successes

### Common fix patterns

| Error Message | Fix |
|---|---|
| `productName is required` | Fill in the product name cell |
| `sku is required` | Fill in the SKU cell |
| `slug contains invalid characters` | Remove special characters from the slug, or leave it blank to auto-generate |
| `price cannot be negative` | Enter a positive integer (price in cents) |
| `SKU already exists. Skipped in CREATE mode` | Switch to UPSERT mode, or remove the row |
| `Failed to parse Excel file` | Check the file isn't password-protected or corrupted |

### Using the Skipped Rows sheet

Rows in **Skipped Rows** are not errors — they are intentional skips based on your import mode:
- In **CREATE** mode: SKU already exists → skipped (use UPSERT to update these too)
- In **UPDATE** mode: SKU not found → skipped (create them first with CREATE mode)

### Automating report processing

```typescript
// Fetch the JSON error report and process programmatically
const res = await fetch(`/import/jobs/${jobId}/error-report`, {
    credentials: 'include',
});
const errors: Array<{ rowNumber: number; sku: string; error: string }> = await res.json();

// Build a set of failed row numbers for re-upload filtering
const failedRows = new Set(errors.map((e) => e.rowNumber));
```
