# Performance Guide

> Scaling the import system for catalogs of any size

---

## Table of Contents

- [Batch Processing](#batch-processing)
- [Memory Optimization](#memory-optimization)
- [Database Performance](#database-performance)
- [Queue Concurrency](#queue-concurrency)
- [Image Processing at Scale](#image-processing-at-scale)
- [Recommendations by Scale](#recommendations-by-scale)
- [Benchmarks](#benchmarks)
- [Configuration Tuning](#configuration-tuning)

---

## Batch Processing

The import pipeline processes rows in configurable batches (default: 50 rows per batch).

### How Batching Works

```
Total rows: 10,000
Batch size: 50
Number of batches: 200

Batch 1:   rows 1–50    → process → write 50 ImportLog records → update progress (0.5%)
Batch 2:   rows 51–100  → process → write 50 ImportLog records → update progress (1%)
...
Batch 200: rows 9951–10000 → process → update progress (100%)
```

### Tuning Batch Size

Edit `src/plugins/product-import/constants.ts`:

```typescript
export const BATCH_SIZE = 50; // default
```

| Scale | Recommended BATCH_SIZE | Rationale |
|---|---|---|
| < 1,000 rows | 50 | Smooth progress updates |
| 1,000–10,000 rows | 100 | Fewer DB round-trips |
| 10,000–100,000 rows | 200 | Balance throughput vs. lock duration |
| > 100,000 rows | 500 | Maximize throughput; progress updates less frequent |

> **Caution:** Very large batches hold PostgreSQL write locks longer. Monitor for lock contention if the storefront is live during import.

---

## Memory Optimization

### Excel File Parsing

ExcelJS reads cells row-by-row internally. The entire workbook is not kept in memory simultaneously. For a 100 MB file with 100,000 rows:

- Peak memory during parse: ~150 MB
- Baseline memory after parse: ~50 MB (just the processed rows array)

If memory is constrained, process rows immediately as they are read rather than collecting into an array. This would require refactoring `ExcelParserService` to use ExcelJS's streaming interface.

### Image Processing

Images are processed one at a time via `AssetService.create()`. Each image's `ReadStream` is opened, piped, and closed before the next begins. Peak memory per image is bounded by the image file size (typically < 5 MB).

### Temp File Management

All uploaded files are written to OS temp directories (`os.tmpdir()`). The plugin cleans up after processing:

```typescript
// In processImportJob():
finally {
  if (data.filePath && fs.existsSync(data.filePath)) {
    fs.unlinkSync(data.filePath);
  }
}
```

Ensure the temp directory has sufficient space for concurrent uploads:

```bash
# Check available space
df -h /tmp

# On macOS, /tmp is symlinked to /private/tmp
# Minimum recommended: 10× largest expected file size
```

---

## Database Performance

### Indexes

The migration creates three indexes that cover the most common query patterns:

```sql
-- Filter by job status (dashboard history list)
CREATE INDEX "IDX_import_job_status" ON "import_job" ("status");

-- Sort by creation date (history list default sort)
CREATE INDEX "IDX_import_job_created_at" ON "import_job" ("created_at");

-- Join from import_log to import_job (log queries)
CREATE INDEX "IDX_import_log_job_id" ON "import_log" ("job_id");
```

### Write Amplification

For a 10,000-row import:
- 10,000 `ImportLog` inserts
- ~200 `ImportJob` progress updates (one per batch)
- Up to 10,000 `product` and `product_variant` inserts (CREATE mode)

**Recommendation:** Import during off-peak hours. If the storefront is live, ensure PostgreSQL `max_connections` is set appropriately and consider a read replica for storefront queries.

### Connection Pool

Vendure uses TypeORM's built-in connection pool. For large imports, ensure the pool is sized appropriately:

```typescript
// vendure-config.ts
dbConnectionOptions: {
  type: 'postgres',
  extra: {
    max: 20,        // Maximum pool connections
    min: 5,         // Minimum pool connections
    idleTimeoutMillis: 30000,
  },
}
```

### Bulk Insert Optimization (Future Enhancement)

The current implementation uses `ProductService.create()` per row, which performs individual inserts. For very large catalogs, consider a direct bulk-insert path that bypasses Vendure service layer and writes directly to the database, then fires post-insert events.

---

## Queue Concurrency

### Default: Single-Worker Processing

With one worker process, jobs are processed sequentially. A 100,000-row import blocks the queue until complete.

### Scaling: Multiple Worker Processes

Run multiple worker processes to process multiple import jobs in parallel:

```javascript
// ecosystem.config.js (PM2)
{
  name: 'vendure-worker',
  script: './dist/index-worker.js',
  instances: 4,  // 4 worker processes
}
```

> **Note:** Multiple workers process **different jobs** in parallel, not different batches of the same job. A single job is processed by one worker at a time.

### Separate Import Queue (Future Enhancement)

For isolated scaling, configure a dedicated job queue for imports with its own worker pool:

```typescript
// Not yet implemented — future enhancement
DefaultJobQueuePlugin.init({
  useDatabaseForBuffer: true,
  workerIdleInterval: 200,
})
```

---

## Image Processing at Scale

### Sequential vs Parallel

The current implementation uploads images **sequentially** via `AssetService.create()`. For 10,000 images:

```
Sequential: 10,000 images × 200ms/image = 2,000 seconds (~33 minutes)
Parallel:   10,000 images ÷ 10 concurrent × 200ms = 200 seconds
```

### Parallel Upload (Future Enhancement)

To parallelize image uploads, process them in chunks:

```typescript
// Process images in parallel batches of 10
async function uploadImagesParallel(ctx, images, concurrency = 10) {
  const results = [];
  for (let i = 0; i < images.length; i += concurrency) {
    const batch = images.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(img => this.uploadImageAsAsset(ctx, img.filePath))
    );
    results.push(...batchResults);
  }
  return results;
}
```

### Image Optimization Before Import

Pre-process images before uploading to reduce file size and upload time:

```bash
# Resize and compress using ImageMagick
find ./images -name "*.jpg" -exec mogrify \
  -resize 2000x2000\> \
  -quality 85 \
  -strip {} \;

# Batch convert PNG to WebP using cwebp
find ./images -name "*.png" -exec sh -c \
  'cwebp -q 85 "$1" -o "${1%.png}.webp"' _ {} \;
```

---

## Recommendations by Scale

### Up to 1,000 Rows

- Default settings work fine
- Batch size: 50
- Single worker process
- Dry run validation before first import

### 1,000 – 10,000 Rows

- Increase batch size to 100–200
- Run imports during off-peak hours
- Monitor PostgreSQL query time
- Pre-validate with Dry Run

```typescript
// constants.ts
export const BATCH_SIZE = 100;
```

### 10,000 – 100,000 Rows

- Batch size: 200–500
- 2+ worker processes
- Ensure temp disk space ≥ 2 GB
- Set Node.js max memory:

```bash
# ecosystem.config.js
node_args: '--max-old-space-size=4096'
```

- Pre-test with a 1,000-row sample
- Monitor PostgreSQL `pg_stat_activity` during import
- Consider scheduling via cron (off-hours)

### 100,000+ Rows (Enterprise)

Additional architectural changes recommended:

1. **Direct bulk insert:** Bypass Vendure service layer for initial product creation; fire events post-insert
2. **Parallel workers:** 4+ worker processes, each handling a segment of rows
3. **Chunked file upload:** Split the Excel file into chunks of 20,000 rows each
4. **Dedicated import database schema:** Separate PostgreSQL schema to isolate write load
5. **Read replica for storefront:** Route storefront queries to a read replica during import

```sql
-- PostgreSQL tuning for large imports
SET work_mem = '256MB';           -- Allow more memory for sort operations
SET maintenance_work_mem = '1GB'; -- Faster index builds
SET synchronous_commit = 'off';   -- Async commit for non-critical writes (import logs)
```

---

## Benchmarks

Reference benchmarks on a standard VPS (4 vCPU, 8 GB RAM, PostgreSQL 15, SSD storage):

| Rows | Mode | Duration | Avg per Row | Memory Peak |
|---|---|---|---|---|
| 100 | UPSERT | ~2s | 20ms | 80 MB |
| 1,000 | UPSERT | ~20s | 20ms | 100 MB |
| 10,000 | UPSERT | ~3.5 min | 21ms | 150 MB |
| 50,000 | CREATE | ~15 min | 18ms | 200 MB |
| 100,000 | CREATE | ~35 min | 21ms | 250 MB |

> Benchmarks assume a warm PostgreSQL connection pool and no concurrent load. Actual performance varies with database hardware, network latency, and existing catalog size (index scan time grows with table size).

---

## Configuration Tuning

### `constants.ts` Reference

```typescript
// Rows processed per DB transaction batch
export const BATCH_SIZE = 50;

// Maximum Excel file size accepted by REST controller
export const MAX_FILE_SIZE_MB = 100;

// Supported image file extensions for mapping
export const SUPPORTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Supported Excel file extensions
export const SUPPORTED_EXCEL_TYPES = ['.xlsx', '.xls'];
```

### Node.js Memory

```bash
# .env or ecosystem.config.js
NODE_OPTIONS="--max-old-space-size=4096"
```

### PostgreSQL Connection Pool

```typescript
// vendure-config.ts
dbConnectionOptions: {
  extra: {
    max: 20,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  }
}
```

### Nginx Upload Limits

```nginx
# /etc/nginx/sites-available/vendure
client_max_body_size 500m;
proxy_read_timeout 600s;
proxy_send_timeout 600s;
```
