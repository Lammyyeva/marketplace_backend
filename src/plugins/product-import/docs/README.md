# Vendure Product Import Plugin

> Enterprise-grade Excel product import and bulk image mapping for Vendure 3.x

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation Index](#documentation-index)
- [Architecture Overview](#architecture-overview)
- [Plugin Lifecycle](#plugin-lifecycle)
- [Supported Workflows](#supported-workflows)

---

## Overview

The **Product Import Plugin** provides a complete bulk-import pipeline for the Vendure headless commerce platform. It enables administrators to import thousands of products and variants from Microsoft Excel files, automatically map product images by SKU filename convention, track every import operation with detailed logs, and recover gracefully from partial failures — all without touching application code or the Vendure Admin CLI.

The system is designed for enterprise catalogs: it handles 100 k+ rows through batched database writes and Vendure's built-in job queue, streams large XLSX files to avoid memory exhaustion, and keeps a permanent audit trail of every import operation.

---

## Features

| Category | Capability |
|---|---|
| **Excel Import** | Upload `.xlsx` / `.xls` files up to 100 MB |
| **Import Modes** | `CREATE`, `UPDATE`, `UPSERT` |
| **Dry Run** | Full validation without database writes |
| **Image Mapping** | Automatic SKU → image matching from ZIP or individual files |
| **Background Jobs** | Non-blocking queue processing via Vendure Job Queue |
| **Progress Tracking** | Real-time progress polling from the dashboard |
| **Import History** | Permanent per-job audit log with per-row status |
| **Excel Error Reports** | Colour-coded multi-sheet `.xlsx` report + JSON error report |
| **Auto Slug Generation** | Slug optional — auto-generated from product name + SKU with collision handling |
| **Template Generator** | Dynamic XLSX template with hints, dropdowns, and examples |
| **Admin Dashboard** | Four new dashboard pages with drag-and-drop UI |
| **REST Endpoints** | Multipart file upload endpoints alongside GraphQL |
| **Facet Mapping** | Resolve `facet:value` pairs to existing FacetValues |
| **Collection Mapping** | Resolve collection slugs during import |
| **Custom Fields** | Map `customField_*` columns to Vendure custom fields |
| **SEO Fields** | Import `metaTitle` / `metaDescription` per product |

---

## Quick Start

### 1. Install dependencies

```bash
npm install exceljs adm-zip @nestjs/platform-express multer
npm install --save-dev @types/adm-zip @types/multer
```

### 2. Register plugin

```typescript
// src/vendure-config.ts
import { ProductImportPlugin } from './plugins/product-import/product-import.plugin';

export const config: VendureConfig = {
  plugins: [
    // ... other plugins
    ProductImportPlugin.init({}),
  ],
};
```

### 3. Run migration

```bash
npm run migration:run
```

### 4. Start server

```bash
npm run dev
```

### 5. Open Dashboard

Navigate to **Catalog → Import Products** in the Vendure Admin Dashboard.

---

## Documentation Index

| Document | Audience | Description |
|---|---|---|
| [Installation Guide](./installation.md) | Developer | Full setup, prerequisites, env vars |
| [Configuration Reference](./configuration.md) | Developer | All plugin options with examples |
| [Admin User Guide](./admin-guide.md) | Admin / Operator | Step-by-step import walkthroughs |
| [Excel Template Reference](./excel-template.md) | Admin / Developer | Every column documented |
| [Slug Generation Guide](./slug-generation.md) | Developer | Auto-generation, collision handling, Unicode |
| [Import Reports Guide](./import-reports.md) | Admin / Developer | Excel + JSON reports, how to act on them |
| [Image Mapping Guide](./image-mapping.md) | Admin / Developer | Filename conventions, ZIP handling |
| [API Reference](./api-reference.md) | Developer | GraphQL + REST endpoints |
| [Architecture Guide](./architecture.md) | Developer | Services, queue, pipeline diagrams |
| [Database Reference](./database.md) | Developer / DBA | Entities, ER diagram, indexes |
| [Performance Guide](./performance.md) | Developer / DevOps | Scaling to 100 k+ rows |
| [Security Guide](./security.md) | Developer / Security | File validation, access control |
| [DevOps Guide](./devops.md) | DevOps | Docker, Kubernetes, Nginx, PM2 |
| [Troubleshooting Guide](./troubleshooting.md) | Developer / Support | Common errors and solutions |
| [Testing Guide](./testing.md) | Developer | Unit, integration, E2E testing |
| [Maintenance Guide](./maintenance.md) | DevOps / Developer | Updates, cleanup, monitoring |

---

## Architecture Overview

```mermaid
graph TB
    subgraph Admin Dashboard
        UI1[Import Products Page]
        UI2[Upload Images Page]
        UI3[Import History Page]
        UI4[Import Detail Page]
    end

    subgraph REST API - /import
        C1[POST /upload-excel]
        C2[POST /upload-images]
        C3[GET /template]
        C4[GET /jobs/:id]
        C5[GET /jobs/:id/error-report]
    end

    subgraph GraphQL Admin API
        GQL1[importJobs query]
        GQL2[importJob query]
        GQL3[cancelImportJob mutation]
    end

    subgraph Plugin Services
        SVC1[ImportService]
        SVC2[ExcelParserService]
        SVC3[ExcelTemplateService]
        SVC4[AssetMappingService]
        SVC5[ImportHistoryService]
    end

    subgraph Vendure Job Queue
        JQ1[product-import-job]
        JQ2[image-import-job]
    end

    subgraph Vendure Core Services
        VS1[ProductService]
        VS2[ProductVariantService]
        VS3[AssetService]
        VS4[FacetValueService]
        VS5[CollectionService]
    end

    subgraph Database
        DB1[(import_job)]
        DB2[(import_log)]
        DB3[(product)]
        DB4[(product_variant)]
    end

    UI1 --> C1
    UI2 --> C2
    UI3 --> GQL1
    UI4 --> C4

    C1 --> SVC1
    C2 --> SVC4
    C3 --> SVC3

    SVC1 --> JQ1
    JQ1 --> SVC2
    JQ1 --> VS1
    JQ1 --> VS2
    JQ1 --> DB1
    JQ1 --> DB2

    SVC4 --> VS3
    SVC5 --> DB1
    SVC5 --> DB2

    VS1 --> DB3
    VS2 --> DB4
```

---

## Plugin Lifecycle

```mermaid
sequenceDiagram
    participant App as Vendure Bootstrap
    participant Plugin as ProductImportPlugin
    participant ImportSvc as ImportService
    participant JobQueue as JobQueueService
    participant Worker as Worker Process

    App->>Plugin: onApplicationBootstrap()
    Plugin->>ImportSvc: init()
    ImportSvc->>JobQueue: createQueue('product-import-job')
    ImportSvc->>JobQueue: createQueue('image-import-job')
    JobQueue-->>ImportSvc: Queue instances ready
    ImportSvc-->>Plugin: Queues initialized
    Plugin-->>App: Ready

    Note over Worker: Worker process registers<br/>same queue processors
    Worker->>JobQueue: Subscribe to 'product-import-job'
    Worker->>JobQueue: Subscribe to 'image-import-job'
```

---

## Supported Workflows

### Workflow 1 — New Catalog Import

```
Download Template → Fill Data → Upload Excel (CREATE mode) → Monitor Progress → Review Logs
```

### Workflow 2 — Price / Stock Update

```
Export current SKUs → Update price/stock columns → Upload Excel (UPDATE mode) → Verify changes
```

### Workflow 3 — Upsert Mixed Catalog

```
Prepare Excel with new + existing SKUs → Upload (UPSERT mode) → New rows created, existing updated
```

### Workflow 4 — Bulk Image Upload

```
Name images after SKU → Zip all images → Upload ZIP → System maps images to products automatically
```

### Workflow 5 — Validate Before Import

```
Prepare Excel → Upload with Dry Run enabled → Review validation errors → Fix issues → Re-upload
```

### Workflow 6 — Incremental Updates

```
Export changed SKUs → Update fields → Upload (UPDATE mode) → Only modified records touched
```
