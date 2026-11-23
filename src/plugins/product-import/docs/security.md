# Security Guide

> File validation, access control, and secure handling of import data

---

## Table of Contents

- [File Upload Security](#file-upload-security)
- [Access Control](#access-control)
- [Temp File Handling](#temp-file-handling)
- [Input Validation](#input-validation)
- [Rate Limiting](#rate-limiting)
- [Queue Isolation](#queue-isolation)
- [Logging and Audit Trail](#logging-and-audit-trail)
- [Security Hardening Checklist](#security-hardening-checklist)

---

## File Upload Security

### Allowed File Types

The REST controller enforces strict file type validation via Multer's `fileFilter`:

```typescript
// Only .xlsx and .xls are accepted
fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (SUPPORTED_EXCEL_TYPES.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Unsupported file type: ${ext}`), false);
    }
}
```

**Excel uploads accept:** `.xlsx`, `.xls` only  
**Image uploads accept:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.zip`

### File Size Limits

```typescript
// Excel upload: 100 MB hard limit
limits: { fileSize: 100 * 1024 * 1024 }

// Image upload: 50 MB per file
limits: { fileSize: 50 * 1024 * 1024 }
```

> The Nginx `client_max_body_size` must match or exceed these limits. The more restrictive limit wins.

### MIME Type Note

Multer validates file extension from the filename, not the Content-Type header. This is intentional — the Content-Type can be spoofed by the client, while extension validation combined with ExcelJS's attempt to parse the file provides defense in depth.

For production environments requiring strict MIME validation, add:

```typescript
import { fromBuffer } from 'file-type';

// After file is written to disk:
const fileBuffer = fs.readFileSync(file.path);
const type = await fromBuffer(fileBuffer);
if (!type || !['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(type.mime)) {
    fs.unlinkSync(file.path);
    throw new Error('File content does not match declared type');
}
```

### Path Traversal Prevention

Multer's disk storage uses auto-generated temp directory names via `fs.mkdtempSync()`:

```typescript
destination: (_req, _file, cb) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-upload-'));
    cb(null, tmpDir);
}
```

This generates paths like `/tmp/pi-upload-A3k2fB/`, which are:
- Unique per upload
- Placed under the system temp directory (never user-controlled)
- Automatically cleaned up after processing

---

## Access Control

### Admin-Only Endpoints

All import endpoints require a valid admin session. The GraphQL resolvers use:

```typescript
@Allow(Permission.SuperAdmin, Permission.UpdateCatalog)
async importJobs() { ... }
```

The REST controller uses Vendure's `RequestContextService`:

```typescript
const ctx = await this.requestContextService.create({
    apiType: 'admin',
    req: req as any,
});
```

This ensures unauthenticated requests are rejected by Vendure's middleware before reaching the controller.

### Permission Requirements

| Action | Required Permission |
|---|---|
| Download template | `UpdateCatalog` or `SuperAdmin` |
| Upload Excel | `UpdateCatalog` or `SuperAdmin` |
| Upload images | `UpdateCatalog` or `SuperAdmin` |
| View import history | `UpdateCatalog` or `SuperAdmin` |
| Cancel import job | `UpdateCatalog` or `SuperAdmin` |

### No Shop API Exposure

The import plugin only registers `adminApiExtensions`. No import functionality is exposed through the Shop API. The REST controller at `/import/*` should be protected at the Nginx level to only allow requests that originate from authenticated admin sessions.

---

## Temp File Handling

### Upload Lifecycle

```
Client upload → Multer writes to /tmp/pi-upload-XXXX/ → Parser reads file
→ Job enqueued with filePath → Worker processes file → File deleted
```

Temp files are deleted:
- On successful import completion (`finally` block in `processImportJob`)
- Manually via cleanup cron (for files orphaned by crashes)

### Securing the Temp Directory

```bash
# Ensure temp dir is only accessible by the app user
chmod 700 /tmp/pi-upload-*

# Alternatively, use a dedicated temp directory outside /tmp
# and set appropriate permissions
mkdir -p /var/app/import-temp
chown vendure:vendure /var/app/import-temp
chmod 700 /var/app/import-temp
```

Update `constants.ts` to use this directory if needed:

```typescript
// services/import.service.ts
const tmpDir = fs.mkdtempSync(path.join('/var/app/import-temp', 'pi-upload-'));
```

### File Exposure Risk

The `filePath` column in `import_job` stores the temp path. This is:
- Only visible to admin users via the GraphQL API (not exposed in responses by default)
- The temp file is deleted after processing, making the stored path stale

---

## Input Validation

### Excel Data Validation

All data from the Excel file is treated as untrusted:

| Field | Sanitization |
|---|---|
| `productName` | `.trim()` |
| `slug` | Optional. `.trim().toLowerCase()`. When provided, validated against `[a-z0-9-]+`. When empty, auto-generated via `slugify(productName + sku)` + DB uniqueness check. |
| `sku` | `.trim().toUpperCase()` |
| `price` | Parsed to number, clamped to ≥ 0 |
| `stock` | Parsed to integer, clamped to ≥ 0 |
| `enabled` | Strict boolean parsing with safe defaults |
| `description` | Passed as-is (Vendure sanitizes on output) |
| Custom fields | Converted to string via `String()` |

### SQL Injection Prevention

All database queries use TypeORM parameterized queries. The import service never constructs raw SQL. Example:

```typescript
// ✅ Safe — parameterized
this.connection.getRepository(ctx, ImportJob).findOne({ where: { id } });

// ✅ Safe — TypeORM handles escaping
this.productVariantService.findAll(ctx, {
    filter: { sku: { eq: row.sku } }
});
```

### XSS Prevention

Product descriptions from the Excel file may contain HTML. Vendure passes this through to the storefront without sanitization at the API layer. Ensure the storefront renders HTML using a safe renderer (e.g., `DOMPurify` or `sanitize-html`).

---

## Rate Limiting

### Nginx Rate Limiting

Apply rate limits to upload endpoints to prevent abuse:

```nginx
# Define rate limit zone: 10 requests per minute per IP
limit_req_zone $binary_remote_addr zone=import_upload:10m rate=10r/m;

server {
    location /import/upload-excel {
        limit_req zone=import_upload burst=5 nodelay;
        limit_req_status 429;
        proxy_pass http://vendure_backend;
    }

    location /import/upload-images {
        limit_req zone=import_upload burst=5 nodelay;
        limit_req_status 429;
        proxy_pass http://vendure_backend;
    }
}
```

### Application-Level Limits

For additional protection, implement a concurrency check:

```typescript
// Before enqueuing, check if user already has an active import
const activeJobs = await this.connection.getRepository(ctx, ImportJob).find({
    where: {
        initiatedBy: ctx.activeUserId!.toString(),
        status: In([ImportJobStatus.PENDING, ImportJobStatus.PROCESSING]),
    },
});

if (activeJobs.length > 0) {
    throw new Error('You already have an active import. Please wait for it to complete.');
}
```

---

## Queue Isolation

### Database-Backed Queue

Using `DefaultJobQueuePlugin` with `useDatabaseForBuffer: true` means:
- Jobs are stored in PostgreSQL, not in-memory
- The queue is isolated to the `vendure_job_record` table
- Job data is serialized as JSON — no code execution from queue payloads

### Job Data Sanitization

The `ProductImportJobData` payload contains only scalar values:

```typescript
interface ProductImportJobData {
    filePath: string;       // OS temp path — validated on write
    fileName: string;       // Original filename — display only
    mode: ImportMode;       // Enum — validated by TypeScript
    dryRun: boolean;
    jobEntityId: string;    // DB entity ID
    channelToken: string;   // Vendure channel token
    languageCode: string;   // Vendure LanguageCode
    initiatedBy: string;    // User ID
}
```

No executable code, functions, or complex objects are passed through the queue.

---

## Logging and Audit Trail

### What is Logged

Every import operation creates a permanent `ImportJob` record and per-row `ImportLog` records. This provides:

- **Who** triggered the import (`initiatedBy` = admin user ID)
- **What** was imported (`fileName`, `mode`, `dryRun`)
- **When** it happened (`createdAt`, `startedAt`, `completedAt`)
- **Outcome** of every row (`ImportLog` with status, SKU, message)
- **Errors** with full context for investigation

### Sensitive Data in Logs

The import logs contain product data (SKUs, prices, descriptions). Ensure:
- PostgreSQL access is restricted to the application user and DBAs
- Backups of import logs are encrypted
- Log retention policies comply with your data regulations

### Audit Query Examples

```sql
-- All imports by a specific admin in the last 30 days
SELECT * FROM import_job
WHERE initiated_by = 'ADMIN_USER_ID'
  AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Products created via import (cross-reference)
-- Note: This requires cross-referencing product.created_at
-- with import_job.started_at/completed_at
```

---

## Security Hardening Checklist

### File Upload

- [ ] `client_max_body_size` set in Nginx (200 MB maximum)
- [ ] File extension whitelist enforced in controller
- [ ] File size limits enforced in Multer
- [ ] Temp directory uses `mkdtempSync` (random path)
- [ ] Temp files deleted after processing

### Access Control

- [ ] All endpoints require admin authentication
- [ ] No import routes exposed on Shop API
- [ ] Rate limiting applied to upload endpoints

### Data Handling

- [ ] Slug/SKU sanitization applied before DB write
- [ ] Price/stock values validated as non-negative numbers
- [ ] Custom fields converted to strings
- [ ] HTML in descriptions rendered safely on storefront

### Infrastructure

- [ ] PostgreSQL access restricted to app user
- [ ] `import_job.file_path` not returned in API responses (stale temp path)
- [ ] Import logs covered by backup encryption
- [ ] Log retention policy defined and automated
