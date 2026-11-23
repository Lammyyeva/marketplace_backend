# Architecture Guide

> Deep-dive into the backend architecture, services, pipeline flow, and design decisions

---

## Table of Contents

- [Module Structure](#module-structure)
- [Service Layer](#service-layer)
- [REST Controller Layer](#rest-controller-layer)
- [GraphQL Resolver Layer](#graphql-resolver-layer)
- [Job Queue Architecture](#job-queue-architecture)
- [Import Pipeline](#import-pipeline)
- [Image Processing Pipeline](#image-processing-pipeline)
- [Validation Flow](#validation-flow)
- [Transaction Flow](#transaction-flow)
- [Error Handling Flow](#error-handling-flow)
- [Design Decisions](#design-decisions)

---

## Module Structure

```
product-import/
├── product-import.plugin.ts    ← @VendurePlugin + OnApplicationBootstrap
├── constants.ts                ← Shared constants (batch size, limits, job names)
├── types.ts                    ← Enums and interfaces (no classes)
│
├── entities/
│   ├── import-job.entity.ts    ← TypeORM entity: one per import operation
│   └── import-log.entity.ts    ← TypeORM entity: one per row processed
│
├── services/
│   ├── import.service.ts          ← Orchestrator: enqueue + process jobs
│   ├── excel-parser.service.ts    ← Parse .xlsx into ExcelProductRow[]
│   ├── excel-template.service.ts  ← Generate .xlsx template with styling
│   ├── asset-mapping.service.ts   ← Map SKU filenames to Vendure assets
│   └── import-history.service.ts  ← Query/cancel/report import jobs
│
├── api/
│   ├── api-extensions.ts          ← GraphQL schema additions (gql`...`)
│   ├── import.admin.resolver.ts   ← @Resolver for admin-api GraphQL
│   └── import.controller.ts       ← @Controller for REST /import/* routes
│
└── dashboard/
    ├── index.tsx                  ← defineDashboardExtension + nav items
    ├── pages/
    │   ├── ImportProductsPage.tsx
    │   ├── UploadImagesPage.tsx
    │   ├── ImportHistoryPage.tsx
    │   └── ImportDetailPage.tsx
    └── components/
        ├── FileUploadZone.tsx
        ├── ImportProgress.tsx
        └── ErrorViewer.tsx
```

---

## Service Layer

### `ImportService`

The central orchestrator. Responsibilities:

1. **Queue initialization** — Creates two job queues on bootstrap:
   - `product-import-job`: processes Excel files
   - `image-import-job`: processes image batches

2. **Job creation** — `enqueueProductImport()` saves an `ImportJob` entity and adds the job to the queue

3. **Background processing** — `processImportJob()` is the queue handler:
   - Parses the Excel file
   - Updates job progress in real-time
   - Processes rows in configurable batches
   - Writes per-row `ImportLog` records
   - Cleans up temp files on completion

4. **File utilities** — `saveUploadedFile()` streams multipart uploads to a temp path

**Key method signatures:**
```typescript
init(): Promise<void>
enqueueProductImport(ctx, filePath, fileName, mode, dryRun): Promise<ImportJob>
processImagesDirectly(ctx, filePaths, zipPath?): Promise<ImageMappingResult>
saveUploadedFile(stream, originalName): Promise<string>
```

---

### `ExcelParserService`

Stateless service that reads an `.xlsx` file using ExcelJS and returns structured data.

**Responsibilities:**
- Detect the correct data start row (skips instruction row 2)
- Unwrap ExcelJS rich-text and formula values
- Map column headers to typed `ExcelProductRow` objects
- Collect `customField_*` columns into a nested object
- Validate each row (required fields, slug format, price range)

**Key method:**
```typescript
parseFile(filePath: string): Promise<ParsedExcelResult>
```

**Output shape:**
```typescript
interface ParsedExcelResult {
  rows: ExcelProductRow[];
  errors: Array<{ row: number; message: string }>;
  totalRows: number;
}
```

---

### `ExcelTemplateService`

Generates a styled XLSX workbook with two sheets:
- **Products** — data entry sheet with frozen header row, blue/gray color-coded columns, data validation dropdowns, and three example rows
- **Instructions** — human-readable field guide with mode explanations

**Key method:**
```typescript
generateTemplate(): Promise<Buffer>
```

---

### `AssetMappingService`

Handles all image processing:

1. **ZIP extraction** — Uses `adm-zip` to recursively extract images to a temp directory
2. **Filename parsing** — Regex extracts SKU and gallery index from each filename
3. **SKU→image mapping** — Returns `Map<sku, MappedImage[]>` ordered by featured first
4. **Asset upload** — Calls `AssetService.create()` for each image file
5. **Result aggregation** — Counts matched/unmatched files, returns `ImageMappingResult`

**Key method:**
```typescript
processImages(ctx, filePaths, zipPath?):
  Promise<{ result: ImageMappingResult; skuAssetMap: Map<string, {...}> }>
```

---

### `ImportHistoryService`

Read-only query service for the import audit log:

```typescript
findAll(ctx, options?): Promise<PaginatedList<ImportJob>>
findOne(ctx, id): Promise<ImportJob | null>
getLogs(ctx, jobId, take, skip): Promise<ImportLog[]>
cancelJob(ctx, id): Promise<ImportJob>
getErrorReport(ctx, jobId): Promise<ErrorRow[]>
```

---

## REST Controller Layer

`ImportController` exposes multipart file upload endpoints that the GraphQL layer cannot handle efficiently for large files (GraphQL's `Upload` scalar buffers entire files in memory).

**Design choice:** Use REST for file uploads, GraphQL for data queries. This allows:
- Multer disk storage (files written to disk, not buffered in RAM)
- Streaming large files without memory spikes
- Standard HTTP progress tracking on the client

```typescript
@Controller('import')
export class ImportController {
  @Get('template')     downloadTemplate()
  @Post('upload-excel') uploadExcel(@UploadedFile() file)
  @Post('upload-images') uploadImages(@UploadedFiles() files)
  @Get('jobs')          listJobs()
  @Get('jobs/:id')      getJob()
  @Get('jobs/:id/error-report') getErrorReport()
}
```

---

## GraphQL Resolver Layer

`ImportAdminResolver` handles queries and mutations via the Vendure admin GraphQL API. File upload mutations (`uploadProductExcel`, `uploadProductImages`) throw an explanatory error redirecting callers to the REST endpoints.

```typescript
@Resolver()
export class ImportAdminResolver {
  @Query() importJobs()
  @Query() importJob()
  @Query() importJobLogs()
  @Query() importErrorReport()
  @Mutation() cancelImportJob()
}
```

---

## Job Queue Architecture

```mermaid
sequenceDiagram
    participant HTTP as HTTP Request
    participant Ctrl as ImportController
    participant Svc as ImportService
    participant DB as import_job table
    participant Queue as JobQueue (DB-backed)
    participant Worker as Worker Process
    participant Vendure as Vendure Services

    HTTP->>Ctrl: POST /import/upload-excel
    Ctrl->>Svc: enqueueProductImport(ctx, filePath, ...)
    Svc->>DB: INSERT ImportJob (status=PENDING)
    Svc->>Queue: queue.add(jobData)
    Queue-->>DB: Store job payload
    Svc-->>Ctrl: Return ImportJob entity
    Ctrl-->>HTTP: { jobId: "abc123" }

    Note over Worker: Picks up job from queue
    Worker->>Svc: processImportJob(data)
    Svc->>DB: UPDATE status=PROCESSING
    Svc->>Svc: parseFile(filePath)
    loop For each batch of 50 rows
        Svc->>Vendure: ProductService.create/update
        Svc->>DB: INSERT ImportLog[] (batch)
        Svc->>DB: UPDATE ImportJob.progress
    end
    Svc->>DB: UPDATE status=COMPLETED
```

### Queue Configuration

The plugin uses Vendure's `DefaultJobQueuePlugin` which stores jobs in PostgreSQL. This means:

- **Jobs survive server restarts** — no job loss if the server crashes mid-import
- **No additional infrastructure** — no Redis or BullMQ needed for the queue itself
- **Single-node concurrency** — jobs processed one at a time per worker process
- **Multi-worker scaling** — run multiple worker processes for parallel job processing

---

## Import Pipeline

```mermaid
flowchart TD
    A[Excel File Received] --> B[Save to temp dir]
    B --> C[Create ImportJob in DB - PENDING]
    C --> D[Add to product-import-job queue]
    D --> E[Worker picks up job]
    E --> F[Update ImportJob - PROCESSING]
    F --> G[ExcelParserService.parseFile]
    G --> H{Parse errors?}
    H -- Yes --> I[Write ERROR logs to ImportLog]
    H -- No --> J[Continue]
    I --> J
    J --> K{dryRun?}
    K -- Yes --> L[Mark COMPLETED, no DB writes]
    K -- No --> M[Process rows in batches of 50]
    M --> N[For each row: processRow]
    N --> O{Mode?}
    O -- CREATE --> P{SKU exists?}
    P -- Yes --> Q[Log SKIPPED]
    P -- No --> R[Create product + variant]
    O -- UPDATE --> S{SKU exists?}
    S -- No --> T[Log SKIPPED]
    S -- Yes --> U[Update variant fields]
    O -- UPSERT --> V{SKU exists?}
    V -- Yes --> U
    V -- No --> R
    R --> W[Write SUCCESS log]
    U --> W
    Q --> W
    W --> X[Update progress %]
    X --> Y{More batches?}
    Y -- Yes --> M
    Y -- No --> Z[Mark COMPLETED]
    Z --> AA[Delete temp file]
```

---

## Image Processing Pipeline

```mermaid
flowchart TD
    A[Files received via multipart] --> B{Is ZIP?}
    B -- Yes --> C[adm-zip extract to temp dir]
    B -- No --> D[Use raw file paths]
    C --> D
    D --> E[Collect all file paths recursively]
    E --> F[Filter: supported image types only]
    F --> G[Parse filename: extract SKU + index]
    G --> H[Group by SKU into Map]
    H --> I[Sort: featured first, then by index]
    I --> J[For each SKU group]
    J --> K[Upload featured via AssetService]
    K --> L[Upload gallery images via AssetService]
    L --> M[Store asset IDs in skuAssetMap]
    M --> N{More SKU groups?}
    N -- Yes --> J
    N -- No --> O[Build ImageMappingResult]
    O --> P[Return: matched/unmatched counts]
    P --> Q[Clean up temp dirs]
```

---

## Validation Flow

```mermaid
flowchart LR
    A[Raw Excel Row] --> B[mapRecord: type coercion]
    B --> C[validateRow: field checks]
    C --> D{Errors?}
    D -- Yes --> E[Push to parseErrors array]
    D -- No --> F[Add to rows array]
    E --> G[Continue to next row]
    F --> G
    G --> H{End of sheet?}
    H -- No --> A
    H -- Yes --> I[Return ParsedExcelResult]
    I --> J[Log parse errors to ImportLog]
    J --> K[Process valid rows]
```

**Validation checks (per row):**

| Check | Field | Error Message |
|---|---|---|
| Required | `productName` | `productName is required` |
| Required | `sku` | `sku is required` |
| Required | `slug` | `slug is required` |
| Format | `slug` | `slug contains invalid characters` |
| Range | `price` | `price cannot be negative` |

---

## Transaction Flow

Each row is processed in a try/catch. Rows are independent — a failure on row 47 does not roll back rows 1–46.

```mermaid
sequenceDiagram
    participant W as Worker
    participant PS as ProductService
    participant PVS as ProductVariantService
    participant DB as PostgreSQL

    W->>PS: findOneBySlug(ctx, slug)
    DB-->>PS: Product or null

    alt Product not found
        W->>PS: create(ctx, input)
        PS->>DB: BEGIN TRANSACTION
        PS->>DB: INSERT product
        PS->>DB: INSERT product_translation
        PS->>DB: COMMIT
        DB-->>PS: Product entity
    end

    W->>PVS: create(ctx, [variantInput])
    PVS->>DB: BEGIN TRANSACTION
    PVS->>DB: INSERT product_variant
    PVS->>DB: INSERT product_variant_translation
    PVS->>DB: INSERT stock_level
    PVS->>DB: COMMIT
    DB-->>PVS: ProductVariant entity

    W->>DB: INSERT import_log (SUCCESS)
```

> Vendure's `ProductService` and `ProductVariantService` handle their own transactions internally. The import service does not wrap them in an outer transaction to avoid long-running locks on large imports.

---

## Error Handling Flow

```mermaid
flowchart TD
    A[processRow called] --> B{try block}
    B --> C[Validate row fields]
    C --> D{Validation error?}
    D -- Yes --> E[Return ERROR result]
    D -- No --> F[Query existing variant by SKU]
    F --> G{Mode check}
    G --> H[Create or update]
    H --> I{Vendure service throws?}
    I -- Yes --> J[catch block]
    J --> K[Return ERROR result with error.message]
    I -- No --> L[Return SUCCESS result]
    E --> M[Write ImportLog]
    K --> M
    L --> M
    M --> N{More rows in batch?}
    N -- Yes --> A
    N -- No --> O[Update ImportJob counts]
```

**Error isolation guarantees:**
- A single row failure never aborts the entire import
- Each row's outcome is independently recorded in `ImportLog`
- The `ImportJob` reflects final aggregate counts after all rows are processed
- Fatal errors (e.g., file not found, DB connection lost) set `ImportJob.status = FAILED` and record the error message

---

## Design Decisions

### Why REST for file uploads, not GraphQL?

GraphQL's `Upload` scalar (from `graphql-upload`) buffers the entire file in memory before the resolver receives it. For a 50 MB Excel file with 100,000 rows this would exhaust Node.js heap. Using `@nestjs/platform-express` with Multer disk storage writes directly to the filesystem, keeping memory usage flat regardless of file size.

### Why not stream-parse Excel on the fly?

ExcelJS's streaming reader (`workbook.xlsx.createInputStream`) has limited API coverage — it cannot seek backwards to read headers after reading rows. The two-pass approach (read headers → read data) requires a seekable stream. Since files are written to disk anyway (via Multer), full-file parsing is used instead. For very large files (>100k rows), this is acceptable because ExcelJS reads one row at a time internally.

### Why batch size of 50?

50 rows per batch is a balance between:
- **Database round-trips:** Fewer batches = fewer progress-update writes
- **Transaction size:** Each row is independently committed — a batch of 50 keeps individual transaction time under 500ms
- **Progress granularity:** 50-row batches give smooth progress updates on files up to ~1000 rows

For large catalogs (100k+ rows), increase `BATCH_SIZE` to 200 in `constants.ts`.

### Why Vendure Job Queue over BullMQ?

`DefaultJobQueuePlugin` is already present in this project and stores jobs in PostgreSQL. Adding BullMQ would introduce a second infrastructure dependency (Redis) purely for job queuing. Since Redis is already used for caching, BullMQ is a viable upgrade path — but the built-in queue is sufficient for typical catalog sizes.

### Why per-row ImportLog (not aggregate)?

Per-row logs enable:
- Targeted retry (re-import only failed rows)
- Downloadable error reports with row numbers
- Granular audit trail for compliance
- Efficient filtering in the dashboard (show only ERROR rows)

The tradeoff is write amplification — a 100k-row import creates 100k `import_log` records. Mitigate with a periodic cleanup job (see [Maintenance Guide](./maintenance.md)).
