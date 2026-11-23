# Admin User Guide

> Step-by-step instructions for importing products and images using the Vendure Dashboard

---

## Table of Contents

- [Getting Started](#getting-started)
- [Workflow 1: Import New Products](#workflow-1-import-new-products)
- [Workflow 2: Update Existing Products](#workflow-2-update-existing-products)
- [Workflow 3: Upsert (Create + Update)](#workflow-3-upsert-create--update)
- [Workflow 4: Validate Before Importing](#workflow-4-validate-before-importing-dry-run)
- [Workflow 5: Upload Images](#workflow-5-upload-images)
- [Viewing Import History](#viewing-import-history)
- [Reading Import Logs](#reading-import-logs)
- [Downloading Error Reports](#downloading-error-reports)
- [Fixing and Re-Importing](#fixing-and-re-importing)
- [Best Practices](#best-practices)
- [Common Mistakes](#common-mistakes)
- [Troubleshooting Tips](#troubleshooting-tips)

---

## Getting Started

### Accessing the Import Tools

The import tools are located under **Catalog** in the left navigation menu:

```
Catalog
├── Products
├── Collections
├── ...
├── ─────────────
├── Import Products    ← Upload and manage product Excel imports
├── Upload Images      ← Bulk image upload with auto SKU mapping
└── Import History     ← Audit trail of all import jobs
```

### Navigation Map

| Page | URL | Purpose |
|---|---|---|
| Import Products | `/catalog/import-products` | Upload Excel, configure mode, monitor progress |
| Upload Images | `/catalog/upload-images` | Upload images or ZIP archives |
| Import History | `/catalog/import-history` | View all past and running imports |
| Import Detail | `/catalog/import-history/:id` | Per-row logs for a specific import |

---

## Workflow 1: Import New Products

Use this workflow when you want to add products that **do not exist** in the catalog yet.

### Step 1 — Download the Template

1. Go to **Catalog → Import Products**
2. Click **Download Template** (top-right corner)
3. Open the downloaded file `product-import-template.xlsx` in Excel or LibreOffice

### Step 2 — Fill in Product Data

The template has two sheets:
- **Products** — this is where you enter your data (start from row 3)
- **Instructions** — read this for field descriptions and rules

**Required columns (blue headers):**
- `productName` — the display name
- `slug` — URL-friendly identifier (e.g. `wireless-headphones-pro`)
- `sku` — unique variant code (e.g. `ST1234`)
- `price` — price in smallest currency unit (e.g. `1999` = $19.99)

**Example for a simple single-variant product:**

| productName | slug | sku | price | stock | enabled |
|---|---|---|---|---|---|
| Wireless Speaker | wireless-speaker | WS-001 | 4999 | 100 | TRUE |

**Example for a product with two color variants:**

| productName | slug | sku | variantName | price | stock |
|---|---|---|---|---|---|
| Classic T-Shirt | classic-t-shirt | TS-BLK | Black | 1999 | 50 |
| Classic T-Shirt | classic-t-shirt | TS-WHT | White | 1999 | 60 |

> **Tip:** Products with multiple variants share the same `slug`. Fill `productName` and `description` on the first row only.

### Step 3 — Save the File

Save as **Excel Workbook (.xlsx)**. Do not save as CSV or other formats.

### Step 4 — Upload the File

1. Return to **Catalog → Import Products**
2. Drag your `.xlsx` file onto the upload zone, or click to browse
3. The file name and size appear when selected

### Step 5 — Select CREATE Mode

Click **CREATE** under Import Mode. In CREATE mode:
- ✅ New products and variants are created
- ⏭ Rows where the SKU already exists are **skipped** (not an error)

### Step 6 — Start Import

Click **Start Import**. The button changes to a spinner while the file is being processed.

### Step 7 — Monitor Progress

A progress card appears below the upload zone showing:
- Current status (Processing / Completed / Failed)
- Progress bar (updates every ~1.5 seconds)
- Counts: Success / Failed / Warnings / Skipped

```
Import Progress
─────────────────────────────────────────────
wireless-headphones.xlsx            PROCESSING
Mode: CREATE

████████████░░░░░░░░  60% complete    150 rows

 120 Success   |  3 Failed  |  0 Warnings  |  27 Skipped
```

### Step 8 — Review Results

When status shows **COMPLETED**, scroll down to see the Import Log. Any errors show in red. Click an error row to expand the detailed message and suggested fix.

---

## Workflow 2: Update Existing Products

Use this workflow to update prices, stock levels, descriptions, or other fields on products **that already exist**.

### Key Differences from CREATE

| Mode | New SKUs | Existing SKUs |
|---|---|---|
| CREATE | Created | Skipped |
| **UPDATE** | **Skipped** | **Updated** |
| UPSERT | Created | Updated |

### Steps

1. Prepare your Excel file with the columns you want to update
2. Fill in the `sku` column — this is the match key
3. Fill in only the columns you want to change (blank cells are handled gracefully)
4. Upload to **Catalog → Import Products**
5. Select **UPDATE** mode
6. Click **Start Import**

### What Gets Updated

When a SKU match is found, the following fields are updated:
- `price`
- `stock` (stock on hand)
- `description` (if filled)
- `enabled`
- `facets`
- `customFields.*`
- `variantName`

> **Note:** The product's `productName` and `slug` are updated when the product is found by the slug derived from the first matching row.

---

## Workflow 3: Upsert (Create + Update)

UPSERT is the most flexible mode — it creates new products and updates existing ones in a single pass.

### When to Use

- Periodic catalog synchronization from an ERP or PIM system
- Mixed files containing both new and existing SKUs
- When you don't know exactly which SKUs are new

### Steps

1. Prepare your Excel file normally (no need to separate new vs. existing)
2. Upload to **Catalog → Import Products**
3. Select **UPSERT** mode
4. Click **Start Import**

---

## Workflow 4: Validate Before Importing (Dry Run)

Dry Run lets you check your file for errors **without making any changes** to the database.

### When to Use

- Before a large import (10,000+ rows)
- After making manual edits to the Excel file
- When testing a new template or column mapping

### Steps

1. Upload your Excel file
2. Toggle **Dry Run** on (the toggle turns amber)
3. Click **Validate Only**

The system runs through every row and reports:
- Missing required fields
- Invalid slug format
- Negative prices
- Other validation issues

No products are created or updated.

### Interpreting Dry Run Results

| Status | Meaning |
|---|---|
| ✅ Success | Row would import successfully |
| ❌ Error | Row has a validation error — must fix before importing |
| ⚠️ Warning | Row has a potential issue but would still import |
| ⏭ Skipped | Row would be skipped (e.g. existing SKU in CREATE mode) |

Once all errors are fixed, re-upload the file in your chosen mode **without** Dry Run.

---

## Workflow 5: Upload Images

Use this workflow to bulk-upload product images and automatically map them to products by SKU.

### Image Naming Convention

Name your image files after the product or variant SKU:

```
ST1234.jpg      ← Featured image for SKU ST1234
ST1234_1.jpg    ← Gallery image 1 for SKU ST1234
ST1234_2.jpg    ← Gallery image 2 for SKU ST1234
ST1234_3.jpg    ← Gallery image 3 for SKU ST1234
```

The **first file (no suffix)** becomes the featured image. Files with `_1`, `_2`, `_3` suffixes become gallery images, in order.

### Step 1 — Prepare Images

1. Rename all image files to match SKU naming (case-insensitive)
2. Optionally compress images to reduce upload size
3. For large batches (100+ images), create a ZIP archive

### Step 2 — Upload

1. Go to **Catalog → Upload Images**
2. Drag and drop your images or ZIP file onto the upload zone
3. You can mix images and ZIP files in one upload
4. Click **Upload & Map Images**

### Step 3 — Review Mapping Result

After upload, a result summary is shown:

```
Upload Result
─────────────────────
✓ 847  Matched
⚠ 12   Unmatched
─ 859  Total
```

**Matched:** Images that were successfully linked to products  
**Unmatched:** Images where no product/variant SKU was found

Unmatched files are listed so you can review and rename them.

### ZIP File Tips

- Put all images directly in the ZIP root (not in subfolders), or the system will recursively find them
- Maximum ZIP file size: 500 MB (configured in Nginx/server)
- The ZIP is extracted to a temp directory, processed, and deleted

---

## Viewing Import History

Go to **Catalog → Import History** to see all past and running import jobs.

### History Table Columns

| Column | Description |
|---|---|
| Status | PENDING / PROCESSING / COMPLETED / FAILED / CANCELLED |
| File | Original filename of the uploaded Excel |
| Mode | CREATE / UPDATE / UPSERT |
| Rows | Success count / Failed count / Skipped count |
| Progress | Visual progress bar + percentage |
| Duration | How long the import took |
| User | Who triggered the import |
| Date | When the import was created |

The table auto-refreshes every 5 seconds while any job is in PROCESSING state.

### Status Icons

| Icon | Status | Meaning |
|---|---|---|
| 🕐 | PENDING | Job is queued, not yet started |
| ⟳ | PROCESSING | Currently running |
| ✅ | COMPLETED | Finished successfully |
| ❌ | FAILED | Fatal error during processing |
| 🚫 | CANCELLED | Manually cancelled |

---

## Reading Import Logs

Click the **↗** (detail) icon on any job to open the Import Detail page.

### Log Entry Fields

| Field | Description |
|---|---|
| Status badge | SUCCESS / ERROR / WARNING / SKIPPED |
| Row # | The row number in the original Excel file |
| SKU | The SKU from that row |
| Message | What happened (success message or error description) |
| Suggested Fix | Actionable advice for fixing the error |

### Filtering Logs

Use the filter buttons at the top of the log viewer:

```
[ALL]  [ERROR]  [WARNING]  [SKIPPED]
```

Click any status to show only entries of that type. The count badge shows how many entries exist per status.

### Expanding Log Entries

Click any log entry to expand it and see the full message and suggested fix:

```
▼ ERROR  |  Row 47  |  ST1234  |  slug "ST1234 Pro" contains invalid characters

   Full message: slug "ST1234 Pro" contains invalid characters
   (use lowercase letters, numbers, hyphens only)

   Fix: Change slug to "st1234-pro" and re-upload the file.
```

---

## Downloading Error Reports

Error reports provide a machine-readable JSON summary of all errors in an import job.

### From the Dashboard

1. Open any completed/failed import job from **Import History**
2. Click **Download Report** (top-right)
3. Save the `.json` file

### Via API

```bash
curl http://localhost:3000/import/jobs/JOB_ID/error-report \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -o error-report.json
```

### Report Format

```json
[
  {
    "rowNumber": 47,
    "sku": "ST1234",
    "error": "slug \"ST1234 Pro\" contains invalid characters (use lowercase letters, numbers, hyphens only)",
    "suggestedFix": "Change slug to \"st1234-pro\" and re-upload the file."
  },
  {
    "rowNumber": 82,
    "sku": null,
    "error": "productName is required",
    "suggestedFix": "Ensure productName is filled in for every row."
  }
]
```

---

## Fixing and Re-Importing

### Standard Fix Cycle

```
1. Download error report
2. Open original Excel file
3. Find rows by row number (use Excel's row numbers — add 2 for header rows)
4. Fix the issues using "suggestedFix" guidance
5. Save the file
6. Re-upload in the same mode
```

### Partial Re-Import

If most rows succeeded and only a few failed, you can:

1. Create a new Excel file with **only the failed rows**
2. Run a fresh import in the same mode
3. The successful rows won't be duplicated (UPSERT handles existing SKUs gracefully)

### Finding Rows in Excel

The `rowNumber` in the error report matches Excel's row numbers. Row 1 = headers, Row 2 = hints, so:
- Row 3 in the report = first data row in Excel
- Row 47 in the report = row 47 in Excel

Use **Ctrl+G** (Go To) in Excel and type `A47` to jump to a specific row.

---

## Best Practices

### Preparing Your Data

1. **Always use Dry Run first** for imports over 1,000 rows
2. **Test with 10–20 rows** before importing the full catalog
3. **Check slug uniqueness** — run a find-duplicate query on your data before importing
4. **Use consistent SKU formats** — establish a naming convention and stick to it
5. **Keep variants together** — sort your Excel so all variants of one product are consecutive rows

### Organizing Images

1. **Name images during photography**, not after — follow `SKU.jpg` convention from the start
2. **Use consistent file extensions** — prefer `.jpg` for photos, `.png` for graphics
3. **Optimize images before upload** — keep files under 2 MB each for fast loading
4. **Create a ZIP** for batches over 50 images — single upload is faster and more reliable

### Import Scheduling

1. **Import during off-peak hours** — large imports consume database write resources
2. **Monitor queue length** — avoid overlapping large imports
3. **Keep import logs** — download error reports and archive them

---

## Common Mistakes

| Mistake | What Happens | How to Avoid |
|---|---|---|
| Price entered as `19.99` instead of `1999` | Product created with price = $0.19 | Always use cents/pence |
| Same product with different slugs | Creates duplicate products | Keep slug identical for all variant rows |
| Uppercase slug | Validation error | Use only `lowercase-with-hyphens` |
| Import in CREATE mode with existing SKUs | All existing SKUs skipped | Use UPSERT for mixed files |
| Uploading CSV instead of XLSX | Parser error | Always save as `.xlsx` |
| Images named differently from SKUs | Images unmatched | Name files exactly `SKU.jpg` |
| Running two large imports simultaneously | Queue congestion, slow performance | Wait for first import to complete |
| Forgetting the `_` separator for gallery images | All images treated as featured | Use `SKU_1.jpg`, `SKU_2.jpg` |

---

## Troubleshooting Tips

### Import Stuck at PROCESSING

**Possible causes:**
- Worker process is not running
- Redis connection lost

**Fix:**
```bash
# Check worker is running
pm2 status

# Restart worker if needed
pm2 restart vendure-worker
```

### Upload Fails with "413 Request Entity Too Large"

**Cause:** Nginx upload size limit

**Fix (Nginx):**
```nginx
client_max_body_size 200m;
```

### Excel File Not Recognized

**Possible causes:**
- File saved as `.xls` (old format) — try re-saving as `.xlsx`
- File is actually a CSV renamed to `.xlsx`
- File is password-protected

**Fix:** Open the file in Excel, choose **Save As → Excel Workbook (.xlsx)**

### Images Not Mapping

**Checklist:**
- [ ] Image filename matches SKU exactly (case-insensitive)
- [ ] File extension is `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, or `.svg`
- [ ] SKU exists in the database
- [ ] No spaces or special characters in filename

### "Data type Object not supported" Error (on startup)

**Cause:** TypeORM cannot infer column type from a `string | null` TypeScript union.

**Fix:** Ensure all `@Column()` decorators on nullable fields have an explicit `type`:
```typescript
@Column({ nullable: true, type: 'varchar' })
sku: string | null;
```
