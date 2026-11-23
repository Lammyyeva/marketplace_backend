# Troubleshooting Guide

> Diagnose and resolve common issues with the Product Import Plugin

---

## Table of Contents

- [Startup Errors](#startup-errors)
- [Upload Errors](#upload-errors)
- [Import Processing Errors](#import-processing-errors)
- [Image Upload Errors](#image-upload-errors)
- [Queue Issues](#queue-issues)
- [Database Issues](#database-issues)
- [Dashboard Issues](#dashboard-issues)
- [Performance Issues](#performance-issues)
- [Error Code Reference](#error-code-reference)

---

## Startup Errors

### `DataTypeNotSupportedError: Data type "Object" in "ImportLog.sku"`

**Symptom:** Server crashes on startup, cannot connect to database.

**Root Cause:** TypeORM cannot infer a PostgreSQL column type from a TypeScript union type like `string | null` or `number | null`. It sees the type as `Object` which has no PostgreSQL equivalent.

**Fix:** Ensure all nullable columns in entity files have an explicit `type` in the `@Column` decorator:

```typescript
// ❌ Wrong — TypeORM infers "Object"
@Column({ nullable: true })
sku: string | null;

// ✅ Correct — explicit type
@Column({ nullable: true, type: 'varchar' })
sku: string | null;

// ❌ Wrong
@Column({ nullable: true })
durationMs: number | null;

// ✅ Correct
@Column({ nullable: true, type: 'int' })
durationMs: number | null;
```

**Prevention:** Always specify `type` in `@Column()` when the TypeScript type is a union.

---

### `Error: Cannot find module 'exceljs'`

**Symptom:** Import fails at startup with module not found.

**Fix:**
```bash
npm install exceljs adm-zip @nestjs/platform-express multer
npm install --save-dev @types/adm-zip @types/multer
```

---

### `Error: ProductImportPlugin is not a valid plugin`

**Symptom:** Vendure fails to bootstrap with a plugin validation error.

**Fix:** Ensure the plugin is instantiated with `.init({})`:

```typescript
// ❌ Wrong
ProductImportPlugin,

// ✅ Correct
ProductImportPlugin.init({}),
```

---

### `[ImportService] Queue initialization failed`

**Symptom:** Worker log shows queue init error.

**Root Cause:** `DefaultJobQueuePlugin` is not registered or registered after `ProductImportPlugin`.

**Fix:** Ensure `DefaultJobQueuePlugin` comes before `ProductImportPlugin` in the `plugins` array:

```typescript
plugins: [
  DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),  // ← must be first
  // ...
  ProductImportPlugin.init({}),
]
```

---

## Upload Errors

### `413 Request Entity Too Large`

**Symptom:** File upload returns HTTP 413.

**Root Cause:** Nginx (or another reverse proxy) is rejecting the upload before it reaches Node.js.

**Fix:**
```nginx
# /etc/nginx/sites-available/vendure
server {
    client_max_body_size 200m;  # ← increase as needed
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
}
```

Reload Nginx: `sudo nginx -s reload`

---

### `Unsupported file type: .csv`

**Symptom:** Upload rejected with unsupported type error.

**Root Cause:** File was saved as CSV, not XLSX.

**Fix:** Open the file in Excel, go to **File → Save As**, select **Excel Workbook (.xlsx)**.

---

### `No file uploaded`

**Symptom:** API returns 400 with "No file uploaded".

**Root Cause:** The `file` form field is missing from the request.

**Fix (cURL):**
```bash
# Ensure -F 'file=@...' is present and path is correct
curl -X POST http://localhost:3000/import/upload-excel \
  -H 'Authorization: Bearer TOKEN' \
  -F 'file=@/absolute/path/to/products.xlsx' \
  -F 'mode=UPSERT'
```

**Fix (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);  // ← field name must be 'file'
```

---

### `Failed to parse Excel file`

**Symptom:** Import job created but immediately fails; `errorMessage` = "Failed to parse Excel file: ..."

**Possible causes:**
1. File is actually a CSV renamed to `.xlsx`
2. File is password-protected
3. File is corrupt

**Diagnostic:**
```bash
# Check actual file type
file products.xlsx
# Should output: Microsoft Excel 2007+ document
# If it says "CSV text" or similar, the file is wrong format
```

**Fix:** Open in Excel → Save As → Excel Workbook (.xlsx) without password protection.

---

### `Invalid template format: missing required header columns`

**Symptom:** Import fails immediately with template format error.

**Root Cause:** The column headers have been removed, renamed, or the wrong sheet is the first sheet.

**Fix:** 
1. Download a fresh template from **Catalog → Import Products → Download Template**
2. Copy your data into the new template
3. Do not rename or delete header columns

---

## Import Processing Errors

### Row-Level: `slug contains invalid characters`

**Symptom:** Specific rows fail with slug validation error.

**Fix:** 
- Remove spaces: `"My Product"` → `"my-product"`
- Remove special characters: `"product!"` → `"product"`
- Remove uppercase: `"MyProduct"` → `"my-product"`
- Remove underscores: `"my_product"` → `"my-product"`

---

### Row-Level: `productName is required`

**Symptom:** Rows fail with required field error.

**Common causes:**
- Row is an empty row (skip it) — the parser should skip fully empty rows, but partially empty rows may trigger this
- Cell is blank but row is not empty (has whitespace or formatting)

**Fix:** 
1. Click the cell in Excel
2. Press Delete to clear all content
3. If the issue persists, copy the data to a new blank Excel file

---

### Row-Level: `price cannot be negative`

**Symptom:** Price validation error.

**Fix:** Ensure price is entered in the smallest currency unit (cents) as a positive integer:
- $19.99 → enter `1999`
- $0 → enter `0`
- Never enter negative values

---

### All Rows Skipped in UPDATE Mode

**Symptom:** Import completes but all rows show SKIPPED status.

**Root Cause:** UPDATE mode only updates rows where the SKU already exists. If no SKUs match, all rows are skipped.

**Fix:** 
- Verify the SKUs in your Excel file match exactly what's in the database (case is normalized to uppercase, so `st1234` matches `ST1234`)
- Use UPSERT mode if you're unsure which SKUs exist

---

### Import Stuck at PROCESSING

**Symptom:** ImportJob.status stays at PROCESSING for more than expected time.

**Possible causes:**
1. Worker process is not running
2. Redis connection lost (if using Redis for job queue)
3. Database deadlock on a specific row
4. Node.js process out of memory

**Diagnostic:**
```bash
# Check worker process
pm2 status
pm2 logs vendure-worker --lines 50

# Check PostgreSQL for long-running queries
psql -c "SELECT pid, duration, query FROM pg_stat_activity WHERE state = 'active' ORDER BY duration DESC LIMIT 10;"

# Check Node.js memory
pm2 show vendure-worker | grep memory
```

**Fix:**
```bash
# Restart worker (safe — job will resume from queue)
pm2 restart vendure-worker

# If job is stuck in PROCESSING after restart, cancel it via GraphQL:
mutation { cancelImportJob(id: "JOB_ID") { status } }
```

---

## Image Upload Errors

### Images Not Mapping (All Unmatched)

**Symptom:** Upload succeeds but `matched: 0`, `unmatched: N`.

**Checklist:**
1. Are filenames exactly `{SKU}.jpg` (no extra text)?
2. Are SKUs in the database? (The system must find a matching variant SKU)
3. Is the file extension supported? (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`)
4. Are there spaces in the filename?

**Diagnostic:**
```bash
# List your file names
ls -1 ./images/

# Check if SKU exists in DB
psql -d vendure -c "SELECT sku FROM product_variant WHERE sku ILIKE '%ST1234%';"
```

---

### `Failed to extract ZIP`

**Symptom:** ZIP upload completes but no images are processed.

**Possible causes:**
- ZIP file is corrupt
- ZIP uses unsupported compression method (rare)
- ZIP is password-protected

**Fix:**
```bash
# Test ZIP integrity
unzip -t product-images.zip

# Re-create ZIP
zip -r product-images-new.zip ./images/
```

---

### Images Uploaded but Not Linked to Products

**Symptom:** Assets appear in the Vendure asset library, but products/variants don't show them.

**Root Cause:** The SKU matching step failed silently (variant not found in DB).

**Fix:** 
1. Import the Excel file first to create the products/variants
2. Then upload the images — the SKU will now match

**Order of operations:**
```
1. Import Excel → creates products with SKUs
2. Upload images → SKUs now match → images linked
```

---

## Queue Issues

### `[JobQueueService] Queue "product-import-job" not found`

**Symptom:** Worker error in logs.

**Root Cause:** Worker process started before `onApplicationBootstrap` completed.

**Fix:** The queue is initialized in `onApplicationBootstrap`. Ensure the worker process doesn't process jobs before the bootstrap lifecycle completes (this is handled automatically by Vendure's bootstrap sequence, but may fail if there's an error in `ImportService.init()`).

---

### Jobs Not Processing (Stuck in PENDING)

**Symptom:** ImportJob created, status stays PENDING indefinitely.

**Possible causes:**
1. Worker process not running
2. `DefaultJobQueuePlugin` not configured with `useDatabaseForBuffer: true`

**Fix:**
```bash
# Start worker
npm run dev:worker

# Or in production
pm2 start ecosystem.config.js --only vendure-worker
```

---

## Database Issues

### Migration Already Applied Error

**Symptom:** `npm run migration:run` fails with "table already exists".

**Fix:**
```bash
# Check migration history
psql -d vendure -c "SELECT name FROM typeorm_metadata ORDER BY id DESC LIMIT 10;"

# If migration is listed as applied but tables are missing, mark it:
psql -d vendure -c "INSERT INTO typeorm_metadata (type, name) VALUES ('MIGRATION', 'ProductImport1778000000000');"
```

---

### `violates foreign key constraint "FK_import_log_job"`

**Symptom:** ImportLog insert fails with FK violation.

**Root Cause:** ImportJob was deleted manually from the database while logs were being written.

**Fix:** Do not manually delete `import_job` records. Use the cancel mutation instead. If manual cleanup is needed, delete `import_log` rows first (they cascade on delete anyway).

---

## Dashboard Issues

### Import Progress Not Updating

**Symptom:** Progress bar stays at 0% even though the worker is running.

**Root Cause:** The dashboard polls `/import/jobs/:id` every 1.5 seconds. If the API is unreachable or returns an error, polling stops silently.

**Fix:** 
1. Open browser DevTools → Network tab
2. Look for failed requests to `/import/jobs/JOB_ID`
3. Check CORS configuration if running dashboard on different port
4. Check that auth session cookie is sent with requests (`credentials: 'include'`)

---

### "Import Products" Not Showing in Dashboard Nav

**Symptom:** The three import nav items are missing from the Catalog section.

**Root Cause:** Dashboard build does not include the plugin's UI.

**Fix:**
```bash
# Rebuild the dashboard
npm run build:dashboard

# Verify the dashboard location in plugin:
# dashboard: { location: './dashboard' }
```

---

## Performance Issues

### Import Takes Too Long

**Symptom:** 1,000 rows takes more than 5 minutes.

**Possible causes:**
1. Small batch size (too many progress-update DB writes)
2. Slow disk I/O (temp file on network drive)
3. PostgreSQL query plan not using indexes

**Fix:**
```typescript
// constants.ts — increase batch size
export const BATCH_SIZE = 200;
```

```bash
# Check PostgreSQL query plan
psql -d vendure -c "EXPLAIN ANALYZE SELECT * FROM product_variant WHERE sku = 'ST1234';"
# Should show Index Scan, not Seq Scan
```

### Node.js Out of Memory During Import

**Symptom:** Worker process crashes with `FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory`.

**Fix:**
```bash
# Increase Node.js heap size
NODE_OPTIONS="--max-old-space-size=4096" npm run start:worker

# Or in PM2:
# ecosystem.config.js
node_args: '--max-old-space-size=4096'
```

---

## Error Code Reference

| HTTP Code | GraphQL Code | Message | Fix |
|---|---|---|---|
| 400 | — | `No file uploaded` | Include `file` in FormData |
| 400 | — | `Unsupported file type` | Use `.xlsx` or `.xls` |
| 400 | — | `Invalid template format` | Download fresh template |
| 401 | `UNAUTHORIZED` | `Not authorized` | Re-authenticate |
| 403 | `FORBIDDEN` | `Not authorized to perform this action` | Check admin permissions |
| 404 | — | `Import job not found` | Verify job ID |
| 413 | — | `Request Entity Too Large` | Increase `client_max_body_size` in Nginx |
| 500 | `INTERNAL_SERVER_ERROR` | Server error | Check server logs |
