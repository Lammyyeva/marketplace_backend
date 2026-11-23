# API Reference

> REST and GraphQL API documentation for the Product Import Plugin

---

## Table of Contents

- [Authentication](#authentication)
- [REST Endpoints](#rest-endpoints)
  - [GET /import/template](#get-importtemplate)
  - [POST /import/upload-excel](#post-importupload-excel)
  - [POST /import/upload-images](#post-importupload-images)
  - [GET /import/jobs](#get-importjobs)
  - [GET /import/jobs/:id](#get-importjobsid)
  - [GET /import/jobs/:id/error-report](#get-importjobsiderror-report)
  - [GET /import/jobs/:id/error-report-excel](#get-importjobsiderror-report-excel)
- [GraphQL Queries](#graphql-queries)
  - [importJobs](#importjobs-query)
  - [importJob](#importjob-query)
  - [importJobLogs](#importjoblogs-query)
  - [importErrorReport](#importerrorreport-query)
- [GraphQL Mutations](#graphql-mutations)
  - [cancelImportJob](#cancelimportjob-mutation)
- [GraphQL Types](#graphql-types)
- [Error Responses](#error-responses)

---

## Authentication

All endpoints require admin authentication via bearer token.

### Obtaining a Token

```graphql
mutation {
  login(username: "admin", password: "YOUR_PASSWORD") {
    ... on CurrentUser {
      id
      identifier
    }
  }
}
```

The token is returned as a cookie (`vendure-auth-token`) or via the `vendure-auth-token` response header depending on your `tokenMethod` configuration.

### Using the Token

```bash
# Bearer token in header
curl -H 'Authorization: Bearer YOUR_TOKEN' http://localhost:3000/import/template

# Cookie (automatically sent by browser)
curl -b 'vendure-auth-token=YOUR_TOKEN' http://localhost:3000/import/template
```

---

## REST Endpoints

### `GET /import/template`

Download the XLSX product import template.

**Request**
```http
GET /import/template HTTP/1.1
Authorization: Bearer YOUR_TOKEN
```

**Response**
```http
HTTP/1.1 200 OK
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="product-import-template.xlsx"

[binary XLSX data]
```

**cURL Example**
```bash
curl -O -J http://localhost:3000/import/template \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

### `POST /import/upload-excel`

Upload an Excel file and start a background import job.

**Request**
```http
POST /import/upload-excel HTTP/1.1
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data; boundary=----FormBoundary

------FormBoundary
Content-Disposition: form-data; name="file"; filename="products.xlsx"
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

[binary file data]
------FormBoundary
Content-Disposition: form-data; name="mode"

UPSERT
------FormBoundary
Content-Disposition: form-data; name="dryRun"

false
------FormBoundary--
```

**Form Fields**

| Field | Type | Required | Values | Default |
|---|---|---|---|---|
| `file` | File | ✅ Yes | `.xlsx`, `.xls` | — |
| `mode` | String | No | `CREATE`, `UPDATE`, `UPSERT` | `UPSERT` |
| `dryRun` | String | No | `true`, `false` | `false` |

**Response — 200 OK**
```json
{
  "success": true,
  "jobId": "1234567890abcdef",
  "message": "Import job started in UPSERT mode."
}
```

**Response — Dry Run**
```json
{
  "success": true,
  "jobId": "1234567890abcdef",
  "message": "Dry run validation started. No changes will be persisted."
}
```

**Response — 400 Bad Request**
```json
{
  "statusCode": 400,
  "message": "No file uploaded"
}
```

**Response — 400 Unsupported File Type**
```json
{
  "statusCode": 400,
  "message": "Unsupported file type: .csv. Only .xlsx and .xls are allowed."
}
```

**cURL Example**
```bash
curl -X POST http://localhost:3000/import/upload-excel \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'file=@/path/to/products.xlsx' \
  -F 'mode=UPSERT' \
  -F 'dryRun=false'
```

**JavaScript (fetch) Example**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('mode', 'UPSERT');
formData.append('dryRun', 'false');

const response = await fetch('/import/upload-excel', {
  method: 'POST',
  credentials: 'include',
  body: formData,
});

const { jobId } = await response.json();
```

---

### `POST /import/upload-images`

Upload multiple images or a ZIP archive for automatic SKU-based mapping.

**Request**
```http
POST /import/upload-images HTTP/1.1
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data; boundary=----FormBoundary

[multiple files with field name "files"]
```

**Form Fields**

| Field | Type | Required | Notes |
|---|---|---|---|
| `files` | File[] | ✅ Yes | Images (`.jpg`, `.png`, `.gif`, `.webp`, `.svg`) or `.zip` |

**Response — 200 OK**
```json
{
  "success": true,
  "matched": 847,
  "unmatched": 12,
  "total": 859,
  "unmatchedFiles": [
    "IMG_001.jpg",
    "IMG_002.jpg",
    "banner-hero.png"
  ],
  "errors": []
}
```

**cURL Example**
```bash
# Upload multiple images
curl -X POST http://localhost:3000/import/upload-images \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'files=@ST1234.jpg' \
  -F 'files=@ST1234_1.jpg' \
  -F 'files=@CABLE-002.png'

# Upload a ZIP archive
curl -X POST http://localhost:3000/import/upload-images \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -F 'files=@product-images.zip'
```

---

### `GET /import/jobs`

List all import jobs (most recent first, up to 50).

**Request**
```http
GET /import/jobs HTTP/1.1
Authorization: Bearer YOUR_TOKEN
```

**Response — 200 OK**
```json
{
  "items": [
    {
      "id": "abc123",
      "createdAt": "2026-05-09T14:30:00.000Z",
      "updatedAt": "2026-05-09T14:32:15.000Z",
      "status": "COMPLETED",
      "mode": "UPSERT",
      "fileName": "products-may-2026.xlsx",
      "totalRows": 250,
      "successCount": 248,
      "failedCount": 2,
      "warningCount": 0,
      "skippedCount": 0,
      "progress": 100,
      "startedAt": "2026-05-09T14:30:05.000Z",
      "completedAt": "2026-05-09T14:32:15.000Z",
      "durationMs": 130000,
      "initiatedBy": "1",
      "dryRun": false,
      "errorMessage": null
    }
  ],
  "totalItems": 1
}
```

---

### `GET /import/jobs/:id`

Get full details of a single import job, including all logs.

**Request**
```http
GET /import/jobs/abc123 HTTP/1.1
Authorization: Bearer YOUR_TOKEN
```

**Response — 200 OK**
```json
{
  "id": "abc123",
  "status": "COMPLETED",
  "mode": "UPSERT",
  "fileName": "products.xlsx",
  "totalRows": 10,
  "successCount": 9,
  "failedCount": 1,
  "progress": 100,
  "durationMs": 4200,
  "initiatedBy": "1",
  "dryRun": false,
  "logs": [
    {
      "id": "log001",
      "rowNumber": 3,
      "sku": "ST1234",
      "status": "SUCCESS",
      "message": "Created product/variant for SKU \"ST1234\"",
      "suggestedFix": null
    },
    {
      "id": "log002",
      "rowNumber": 8,
      "sku": "INVALID SKU!",
      "status": "ERROR",
      "message": "slug \"invalid sku!\" contains invalid characters",
      "suggestedFix": "Change slug to use only lowercase letters, numbers, and hyphens."
    }
  ]
}
```

**Response — 404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Import job not found"
}
```

---

### `GET /import/jobs/:id/error-report`

Download error rows as a JSON file attachment (errors only).

**Request**
```http
GET /import/jobs/abc123/error-report HTTP/1.1
Authorization: Bearer YOUR_TOKEN
```

**Response — 200 OK**
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Disposition: attachment; filename="error-report-abc123.json"

[
  {
    "rowNumber": 8,
    "sku": "INVALID SKU!",
    "error": "slug \"invalid sku!\" contains invalid characters",
    "suggestedFix": "Change slug to use only lowercase letters, numbers, and hyphens."
  }
]
```

---

### `GET /import/jobs/:id/error-report-excel`

Download the full import results as a multi-sheet colour-coded Excel workbook (.xlsx). This is the recommended report format for non-technical users.

**Sheets produced:**

| Sheet | Content | Row Colour |
|---|---|---|
| Summary | Job metadata + statistics (success rate, duration, counts) | — |
| Failed Rows | All ERROR rows | 🔴 Red |
| Warnings | All WARNING rows | 🟡 Yellow |
| Successful Rows | All SUCCESS rows | 🟢 Green |
| Skipped Rows | All SKIPPED rows | ⚪ Grey |

**Each data sheet includes:**
- Row number, SKU, product name, slug, status, message, suggested fix, processed timestamp
- Frozen header row
- Auto-sized columns
- Alternating row shading within each status colour

The report is pre-generated when the job completes and stored on disk. If the file is no longer on disk (e.g. after a server restart), it is regenerated on-demand from the stored log records.

**Request**
```http
GET /import/jobs/abc123/error-report-excel HTTP/1.1
Authorization: Bearer YOUR_TOKEN
```

**Response — 200 OK**
```http
HTTP/1.1 200 OK
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="import-report-products-abc123.xlsx"

<binary XLSX data>
```

**JavaScript example**
```javascript
// Trigger download from browser
window.open(`/import/jobs/${jobId}/error-report-excel`, '_blank');
```

---

## GraphQL Queries

All GraphQL queries require the `Authorization` header or session cookie and are available at `/admin-api`.

### `importJobs` Query

List all import jobs with pagination and filtering.

```graphql
query GetImportJobs($options: ImportJobListOptions) {
  importJobs(options: $options) {
    totalItems
    items {
      id
      createdAt
      updatedAt
      status
      mode
      fileName
      totalRows
      successCount
      failedCount
      warningCount
      skippedCount
      progress
      startedAt
      completedAt
      durationMs
      initiatedBy
      dryRun
      errorMessage
    }
  }
}
```

**Variables:**
```json
{
  "options": {
    "take": 20,
    "skip": 0,
    "sort": { "createdAt": "DESC" },
    "filter": { "status": { "eq": "COMPLETED" } }
  }
}
```

**Response:**
```json
{
  "data": {
    "importJobs": {
      "totalItems": 5,
      "items": [
        {
          "id": "abc123",
          "status": "COMPLETED",
          "mode": "UPSERT",
          "fileName": "products.xlsx",
          "totalRows": 250,
          "successCount": 248,
          "failedCount": 2,
          "progress": 100,
          "durationMs": 130000
        }
      ]
    }
  }
}
```

---

### `importJob` Query

Get a single import job by ID.

```graphql
query GetImportJob($id: ID!) {
  importJob(id: $id) {
    id
    status
    mode
    fileName
    totalRows
    successCount
    failedCount
    warningCount
    skippedCount
    progress
    durationMs
    errorMessage
    dryRun
    logs {
      id
      rowNumber
      sku
      status
      message
      suggestedFix
    }
  }
}
```

---

### `importJobLogs` Query

Get paginated logs for a specific job (useful for large imports with many log entries).

```graphql
query GetImportJobLogs($jobId: ID!, $take: Int, $skip: Int) {
  importJobLogs(jobId: $jobId, take: $take, skip: $skip) {
    id
    rowNumber
    sku
    status
    message
    suggestedFix
  }
}
```

**Variables:**
```json
{
  "jobId": "abc123",
  "take": 100,
  "skip": 0
}
```

---

### `importErrorReport` Query

Get only the ERROR rows for a job (equivalent to the REST error-report endpoint but via GraphQL).

```graphql
query GetImportErrorReport($jobId: ID!) {
  importErrorReport(jobId: $jobId) {
    rowNumber
    sku
    error
    suggestedFix
  }
}
```

---

## GraphQL Mutations

### `cancelImportJob` Mutation

Cancel a PENDING or PROCESSING import job.

```graphql
mutation CancelImportJob($id: ID!) {
  cancelImportJob(id: $id) {
    id
    status
    completedAt
  }
}
```

**Variables:**
```json
{ "id": "abc123" }
```

**Response:**
```json
{
  "data": {
    "cancelImportJob": {
      "id": "abc123",
      "status": "CANCELLED",
      "completedAt": "2026-05-09T14:35:00.000Z"
    }
  }
}
```

> **Note:** Jobs that are already COMPLETED or FAILED cannot be cancelled. The mutation will return the job unchanged.

---

## GraphQL Types

### `ImportJob`

```graphql
type ImportJob implements Node {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  status: ImportJobStatus!
  mode: ImportMode!
  fileName: String!
  totalRows: Int!
  successCount: Int!
  failedCount: Int!
  warningCount: Int!
  skippedCount: Int!
  progress: Int!            # 0–100
  startedAt: DateTime
  completedAt: DateTime
  durationMs: Int           # milliseconds
  initiatedBy: String!      # admin user ID
  dryRun: Boolean!
  errorMessage: String      # set only on FAILED jobs
  logs: [ImportLog!]!
}
```

### `ImportLog`

```graphql
type ImportLog implements Node {
  id: ID!
  createdAt: DateTime!
  updatedAt: DateTime!
  rowNumber: Int!
  sku: String
  status: ImportLogStatus!
  message: String!
  suggestedFix: String
}
```

### `ImageUploadResult`

```graphql
type ImageUploadResult {
  matched: Int!
  unmatched: Int!
  total: Int!
  unmatchedFiles: [String!]!
  errors: [String!]!
}
```

### `ImportErrorRow`

```graphql
type ImportErrorRow {
  rowNumber: Int!
  sku: String
  error: String!
  suggestedFix: String
}
```

### Enums

```graphql
enum ImportJobStatus {
  PENDING     # Queued, not started
  PROCESSING  # Currently running
  COMPLETED   # Finished (with or without errors)
  FAILED      # Fatal error, import aborted
  CANCELLED   # Manually cancelled
}

enum ImportMode {
  CREATE   # Only create new products; skip existing SKUs
  UPDATE   # Only update existing products; skip unknown SKUs
  UPSERT   # Create new + update existing
}

enum ImportLogStatus {
  SUCCESS  # Row processed successfully
  ERROR    # Row failed validation or processing
  WARNING  # Row processed with non-fatal issues
  SKIPPED  # Row intentionally skipped (e.g. existing SKU in CREATE mode)
}
```

---

## Error Responses

### HTTP Status Codes

| Code | Meaning | When |
|---|---|---|
| `200` | OK | Request succeeded |
| `400` | Bad Request | Missing file, unsupported type, invalid parameters |
| `401` | Unauthorized | Missing or invalid auth token |
| `403` | Forbidden | Valid token but insufficient permissions |
| `404` | Not Found | Job ID does not exist |
| `413` | Payload Too Large | File exceeds Nginx/server upload limit |
| `500` | Internal Server Error | Unexpected server error |

### GraphQL Error Format

```json
{
  "errors": [
    {
      "message": "You are not currently authorized to perform this action!",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ],
  "data": null
}
```

### Common Error Messages

| Error | Cause | Fix |
|---|---|---|
| `No file uploaded` | `file` field missing from form | Ensure `file` is included in FormData |
| `Unsupported file type: .csv` | Wrong file format | Use `.xlsx` or `.xls` |
| `Invalid template format: missing required header` | Wrong column headers | Use the downloaded template |
| `Import job not found` | Invalid job ID | Check job ID from the upload response |
| `You are not currently authorized` | Token missing or expired | Re-authenticate and retry |

---

## Polling for Job Status

Since import jobs run asynchronously, poll the job endpoint until completion:

```javascript
async function pollImportJob(jobId, onUpdate, intervalMs = 1500) {
  const poll = async () => {
    const res = await fetch(`/import/jobs/${jobId}`, { credentials: 'include' });
    const job = await res.json();
    onUpdate(job);

    if (job.status === 'PROCESSING' || job.status === 'PENDING') {
      setTimeout(poll, intervalMs);
    }
  };
  await poll();
}

// Usage
pollImportJob(jobId, (job) => {
  console.log(`Progress: ${job.progress}% — ${job.status}`);
  if (job.status === 'COMPLETED') {
    console.log(`Done! Success: ${job.successCount}, Failed: ${job.failedCount}`);
  }
});
```

**Recommended poll interval:** 1500ms during processing, no polling once COMPLETED/FAILED/CANCELLED.
