# Installation Guide

> Complete setup guide for the Product Import Plugin

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Dependency Installation](#dependency-installation)
- [Plugin Registration](#plugin-registration)
- [Database Migration](#database-migration)
- [Environment Variables](#environment-variables)
- [Build Steps](#build-steps)
- [Verifying Installation](#verifying-installation)
- [Production Deployment](#production-deployment)
- [Uninstallation](#uninstallation)

---

## Prerequisites

### Runtime Requirements

| Requirement | Minimum | Recommended |
|---|---|---|
| **Node.js** | 18.x | 20.x LTS |
| **Vendure** | 3.0.0 | 3.6.x |
| **PostgreSQL** | 13 | 15+ |
| **Redis** | 6.x | 7.x |
| **TypeORM** | 0.3.x | 0.3.28+ |
| **Disk Space** | 1 GB temp | 10 GB+ for large catalogs |
| **RAM** | 512 MB | 2 GB+ for 100k-row imports |

### Vendure Plugins Required

The following Vendure plugins must be registered **before** the Product Import Plugin:

```typescript
DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
AssetServerPlugin.init({ ... }),
```

> **Important:** `DefaultJobQueuePlugin` must use `useDatabaseForBuffer: true` to ensure import jobs survive server restarts.

---

## Dependency Installation

Install all required runtime and development packages:

```bash
# Runtime dependencies
npm install exceljs adm-zip @nestjs/platform-express multer slugify

# Type definitions
npm install --save-dev @types/adm-zip @types/multer
```

### Package Descriptions

| Package | Version | Purpose |
|---|---|---|
| `exceljs` | ^4.x | Excel file parsing, template generation, and report generation |
| `adm-zip` | ^0.5.x | ZIP archive extraction for bulk image uploads |
| `@nestjs/platform-express` | ^11.x | File upload interceptors (multer integration) |
| `multer` | ^1.x | Multipart form-data / file upload handling |
| `slugify` | ^1.x | SEO-safe slug generation with Unicode normalisation |

### Verify Installation

```bash
node -e "require('exceljs'); require('adm-zip'); require('slugify'); console.log('OK')"
```

---

## Plugin Registration

Add the plugin to your Vendure configuration file:

```typescript
// src/vendure-config.ts
import { VendureConfig } from '@vendure/core';
import { DefaultJobQueuePlugin } from '@vendure/core';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { ProductImportPlugin } from './plugins/product-import/product-import.plugin';
import path from 'path';

export const config: VendureConfig = {
  // ... other config

  plugins: [
    // Required: must come before ProductImportPlugin
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),

    AssetServerPlugin.init({
      route: 'assets',
      assetUploadDir: path.join(__dirname, '../static/assets'),
    }),

    // Product Import Plugin
    ProductImportPlugin.init({}),
  ],
};
```

### Plugin Order

The plugin order in the `plugins` array matters. Follow this order:

```
1. DefaultJobQueuePlugin       ← must be first (job queue)
2. AssetServerPlugin           ← must precede import plugin (asset uploads)
3. ...other plugins...
4. ProductImportPlugin         ← last in plugin list
```

---

## Database Migration

The plugin adds two new tables: `import_job` and `import_log`.

### Run Migration

```bash
npm run migration:run
```

### Verify Tables

Connect to your PostgreSQL database and verify:

```sql
\dt import_*

-- Expected output:
--  public | import_job | table | vendure
--  public | import_log | table | vendure

-- Check indexes:
\di IDX_import_*
--  IDX_import_job_created_at
--  IDX_import_job_status
--  IDX_import_log_job_id
```

### Manual Migration (if needed)

If the migration runner fails, apply SQL manually:

```sql
CREATE TABLE "import_job" (
    "id" character varying NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    "status" character varying NOT NULL DEFAULT 'PENDING',
    "mode" character varying NOT NULL DEFAULT 'UPSERT',
    "file_name" character varying NOT NULL,
    "file_path" text,
    "total_rows" integer NOT NULL DEFAULT 0,
    "success_count" integer NOT NULL DEFAULT 0,
    "failed_count" integer NOT NULL DEFAULT 0,
    "warning_count" integer NOT NULL DEFAULT 0,
    "skipped_count" integer NOT NULL DEFAULT 0,
    "progress" integer NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP,
    "completed_at" TIMESTAMP,
    "duration_ms" integer,
    "initiated_by" character varying NOT NULL,
    "dry_run" boolean NOT NULL DEFAULT false,
    "error_message" text,
    CONSTRAINT "PK_import_job" PRIMARY KEY ("id")
);

CREATE TABLE "import_log" (
    "id" character varying NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    "row_number" integer NOT NULL DEFAULT 0,
    "sku" character varying,
    "status" character varying NOT NULL DEFAULT 'ERROR',
    "message" text NOT NULL,
    "suggested_fix" text,
    "job_id" character varying NOT NULL,
    CONSTRAINT "PK_import_log" PRIMARY KEY ("id"),
    CONSTRAINT "FK_import_log_job"
        FOREIGN KEY ("job_id") REFERENCES "import_job"("id") ON DELETE CASCADE
);

CREATE INDEX "IDX_import_log_job_id"  ON "import_log"  ("job_id");
CREATE INDEX "IDX_import_job_status"  ON "import_job"  ("status");
CREATE INDEX "IDX_import_job_created_at" ON "import_job" ("created_at");
```

---

## Environment Variables

The plugin itself does not require additional environment variables. However, the underlying Vendure services it depends on do:

```bash
# .env

# --- Database (required) ---
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vendure
DB_USERNAME=vendure
DB_PASSWORD=secret
DB_SCHEMA=public

# --- Redis (required for job queue) ---
REDIS_HOST=localhost
REDIS_PORT=6379

# --- Asset server (required for image upload) ---
# Set in vendure-config.ts via AssetServerPlugin.init()

# --- File upload limits (optional, set in OS/Nginx) ---
# These control Node.js / Nginx upload limits:
# node: handled by multer limits in ImportController
# nginx: client_max_body_size 200m;

# --- Optional: S3 storage for assets ---
# MINIO_ENDPOINT=http://localhost:9000
# MINIO_BUCKET=vendure-assets
# MINIO_ACCESS_KEY=admin
# MINIO_SECRET_KEY=password
```

---

## Build Steps

### Development

```bash
# Start server + worker concurrently (hot reload)
npm run dev
```

### Production Build

```bash
# 1. Compile TypeScript
npm run build:server

# 2. Build admin dashboard (includes plugin UI)
npm run build:dashboard

# 3. Start production server
npm run start
```

### Dashboard Build Note

The plugin's dashboard UI is automatically included in the Vite dashboard build via the `dashboard: { location: './dashboard' }` directive in the plugin class. No additional build configuration is needed.

---

## Verifying Installation

After starting the server, verify the plugin loaded correctly:

### 1. Check server logs

```
[server] info - [InstanceLoader] PluginModule dependencies initialized
[server] info - [ProductImportPlugin] Queues initialized: product-import-job, image-import-job
```

### 2. Test template endpoint

```bash
curl -I http://localhost:3000/import/template
# Expected: HTTP/1.1 200 OK
# Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

### 3. Test GraphQL schema

```bash
curl -X POST http://localhost:3000/admin-api \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{"query":"{ importJobs { totalItems } }"}'
# Expected: {"data":{"importJobs":{"totalItems":0}}}
```

### 4. Check dashboard navigation

Open the admin dashboard. You should see three new items under **Catalog**:
- Import Products
- Upload Images
- Import History

---

## Production Deployment

### Checklist

- [ ] `DefaultJobQueuePlugin` configured with `useDatabaseForBuffer: true`
- [ ] Migration applied to production database
- [ ] Worker process running (`npm run start:worker`)
- [ ] Nginx configured with `client_max_body_size 200m`
- [ ] Temp directory has sufficient disk space (≥ 10 GB recommended)
- [ ] Redis persistent (AOF enabled) to survive queue restarts
- [ ] Log rotation configured for application logs

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/vendure
server {
    listen 443 ssl;
    server_name api.yourstore.com;

    # Required: increase upload size limit
    client_max_body_size 200m;

    # Increase timeouts for large file uploads
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
    proxy_connect_timeout 75s;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Process Management (PM2)

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'vendure-server',
      script: './dist/index.js',
      instances: 1,
      env_production: { NODE_ENV: 'production', APP_ENV: 'production' },
      max_memory_restart: '2G',
      error_file: './logs/server-error.log',
      out_file: './logs/server-out.log',
    },
    {
      name: 'vendure-worker',
      script: './dist/index-worker.js',
      instances: 2,         // run 2 worker processes for parallel job processing
      env_production: { NODE_ENV: 'production', APP_ENV: 'production' },
      max_memory_restart: '1G',
      error_file: './logs/worker-error.log',
      out_file: './logs/worker-out.log',
    },
  ],
};
```

---

## Uninstallation

To remove the plugin:

1. Remove from `vendure-config.ts`
2. Remove the import statement
3. Run a down migration:

```bash
# Revert the product-import migration
npm run migration:revert
```

4. Uninstall packages:

```bash
npm uninstall exceljs adm-zip @nestjs/platform-express multer
npm uninstall --save-dev @types/adm-zip @types/multer
```
