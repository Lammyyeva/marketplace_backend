# Configuration Reference

> Plugin options, queue settings, file upload limits, and environment-specific examples

---

## Table of Contents

- [Plugin Options](#plugin-options)
- [Queue Configuration](#queue-configuration)
- [File Upload Limits](#file-upload-limits)
- [Import Validation Settings](#import-validation-settings)
- [Image Processing Settings](#image-processing-settings)
- [Multi-Channel Configuration](#multi-channel-configuration)
- [Multi-Language Configuration](#multi-language-configuration)
- [Environment Examples](#environment-examples)

---

## Plugin Options

### Current Interface

The plugin currently accepts an empty options object:

```typescript
ProductImportPlugin.init({})
```

The plugin is designed for zero-configuration use — all defaults are production-ready out of the box.

### Extending Options

To customize behavior, update `types.ts` and the plugin's `init()` method:

```typescript
// types.ts
export interface ProductImportPluginOptions {
    /** Maximum file size for Excel uploads in bytes. Default: 100 MB */
    maxExcelFileSizeMb?: number;

    /** Maximum file size for image uploads in bytes. Default: 50 MB */
    maxImageFileSizeMb?: number;

    /** Number of Excel rows to process per batch. Default: 50 */
    batchSize?: number;

    /** Temp directory for uploaded files. Default: os.tmpdir() */
    uploadTempDir?: string;

    /** Maximum concurrent import jobs. Default: unlimited */
    maxConcurrentJobs?: number;

    /** Auto-delete temp files after processing. Default: true */
    cleanupTempFiles?: boolean;
}
```

```typescript
// product-import.plugin.ts
static options: ProductImportPluginOptions = {};

static init(options: ProductImportPluginOptions): typeof ProductImportPlugin {
    this.options = options;
    return this;
}
```

---

## Queue Configuration

### Vendure Job Queue Setup

The import plugin requires `DefaultJobQueuePlugin` to be registered **before** `ProductImportPlugin`:

```typescript
// vendure-config.ts
import { DefaultJobQueuePlugin } from '@vendure/core';
import { ProductImportPlugin } from './plugins/product-import/product-import.plugin';

export const config: VendureConfig = {
    plugins: [
        // ✅ Required: DefaultJobQueuePlugin must come first
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        ProductImportPlugin.init({}),
    ],
};
```

### Queue Names

The plugin registers two queues:

| Queue Name | Purpose | Constant |
|---|---|---|
| `product-import-job` | Processes Excel imports | `PRODUCT_IMPORT_JOB_NAME` |
| `image-import-job` | Processes image uploads | `IMAGE_IMPORT_JOB_NAME` |

### Queue Concurrency

Vendure's `DefaultJobQueuePlugin` processes jobs from all queues concurrently. To limit concurrency per queue, use the `concurrency` option (Vendure 3.x):

```typescript
DefaultJobQueuePlugin.init({
    useDatabaseForBuffer: true,
    // Process at most 2 import jobs at once
    // Note: This applies globally — configure per queue via worker config if needed
})
```

For fine-grained control, configure job queue workers separately in your worker process:

```typescript
// worker.ts
import { bootstrapWorker } from '@vendure/core';
import { config } from './vendure-config';

bootstrapWorker(config).catch(err => {
    console.error(err);
    process.exit(1);
});
```

### Redis Queue (Production Recommended)

For high-availability deployments, switch to BullMQ with Redis:

```bash
npm install @vendure/job-queue-plugin
```

```typescript
import { BullMQJobQueuePlugin } from '@vendure/job-queue-plugin/package/bullmq';

plugins: [
    BullMQJobQueuePlugin.init({
        connection: {
            host: process.env.REDIS_HOST ?? 'localhost',
            port: parseInt(process.env.REDIS_PORT ?? '6379'),
            password: process.env.REDIS_PASSWORD,
        },
    }),
    ProductImportPlugin.init({}),
]
```

---

## File Upload Limits

### Constants

Edit `src/plugins/product-import/constants.ts` to change upload limits:

```typescript
// constants.ts
export const BATCH_SIZE = 50;              // Rows per DB write batch
export const MAX_FILE_SIZE_MB = 100;       // Excel upload limit
export const MAX_IMAGE_FILE_SIZE_MB = 50;  // Per-image upload limit

export const SUPPORTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
export const SUPPORTED_EXCEL_TYPES = ['.xlsx', '.xls'];
```

### Controller Limits

The REST controller applies limits via Multer configuration:

```typescript
// import.controller.ts — Excel upload
const excelStorage = multer({
    storage: tmpStorage,
    limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (SUPPORTED_EXCEL_TYPES.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type: ${ext}`), false);
        }
    },
});
```

### Nginx Limits

The Nginx `client_max_body_size` must be set to at least the largest allowed upload:

```nginx
# Recommended: 200 MB to accommodate both upload types with headroom
client_max_body_size 200m;
proxy_read_timeout 300s;
proxy_send_timeout 300s;
```

### Limit Recommendations by Environment

| Environment | Excel Limit | Image Limit | Nginx Limit |
|---|---|---|---|
| Development | 100 MB | 50 MB | 200 MB |
| Staging | 100 MB | 50 MB | 200 MB |
| Production (small store) | 50 MB | 25 MB | 100 MB |
| Production (large catalog) | 200 MB | 100 MB | 500 MB |

---

## Import Validation Settings

### Batch Size

`BATCH_SIZE` in `constants.ts` controls how many rows are written per DB transaction:

```typescript
export const BATCH_SIZE = 50;
```

| Batch Size | Best For | Trade-offs |
|---|---|---|
| 25 | Low-memory environments | More DB round-trips, slower |
| 50 | Default — balanced | Good for most workloads |
| 100 | Fast SSD + high-memory | Fewer round-trips, higher memory |
| 200 | Bulk migrations, high-spec servers | Fastest, highest memory usage |

### Slug Validation Regex

Defined in `excel-parser.service.ts`:

```typescript
// Only lowercase alphanumeric and hyphens
const SLUG_REGEX = /^[a-z0-9-]+$/;
```

To allow underscores or dots, update the regex:

```typescript
// Allow underscores
const SLUG_REGEX = /^[a-z0-9_-]+$/;
```

### Price Validation

Prices are validated as non-negative integers (smallest currency unit):

```typescript
if (isNaN(price) || price < 0) {
    errors.push('price must be a non-negative integer (e.g., 1999 for $19.99)');
}
```

To support decimal input (and convert automatically):

```typescript
// Auto-convert decimal price to cents
const price = Math.round(parseFloat(rawPrice) * 100);
```

### Required Fields

Currently required: `productName`, `slug`, `sku`, `price`.

To change required fields, edit the validation block in `excel-parser.service.ts`:

```typescript
// Make slug optional (auto-generate from productName)
if (!row.productName) errors.push('productName is required');
if (!row.sku) errors.push('sku is required');
if (row.price === undefined) errors.push('price is required');

// Auto-generate slug if missing
if (!row.slug) {
    row.slug = row.productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}
```

---

## Image Processing Settings

### Filename Regex

The SKU extraction regex is defined in `asset-mapping.service.ts`:

```typescript
// Matches: SKU.jpg or SKU_N.jpg
const SKU_IMAGE_REGEX = /^(.+?)(?:_(\d+))?$/;
```

| Pattern | Extracted SKU | Image Index |
|---|---|---|
| `ST1234.jpg` | `ST1234` | Featured (0) |
| `ST1234_1.jpg` | `ST1234` | Gallery index 1 |
| `ST1234_2.jpg` | `ST1234` | Gallery index 2 |

To support a different naming convention (e.g., `SKU-N.jpg`):

```typescript
// Hyphen separator instead of underscore
const SKU_IMAGE_REGEX = /^(.+?)(?:-(\d+))?$/;
```

### Supported Image Types

```typescript
// constants.ts
export const SUPPORTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
```

To add `.avif` or `.tiff`:

```typescript
export const SUPPORTED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.tiff'];
```

### ZIP Extraction Directory

ZIP archives are extracted to the system temp directory:

```typescript
// asset-mapping.service.ts
const extractDir = fs.mkdtempSync(path.join(os.tmpdir(), 'import-images-'));
```

To use a custom location:

```typescript
const extractDir = fs.mkdtempSync(path.join(process.env.IMPORT_TEMP_DIR ?? os.tmpdir(), 'import-images-'));
```

---

## Multi-Channel Configuration

### Default Channel

The import controller creates a request context scoped to the default channel:

```typescript
const ctx = await this.requestContextService.create({
    apiType: 'admin',
    req: req as any,
});
```

Vendure's `requestContextService.create()` uses the channel from the request's `vendure-token` cookie or the `x-vendure-token` header.

### Targeting Specific Channels

To allow admins to specify a target channel for the import:

1. Add `channelToken` to the form data:
   ```javascript
   formData.append('channelToken', 'my-channel-token');
   ```

2. Update the controller to use it:
   ```typescript
   const channelToken = req.body.channelToken as string | undefined;
   const ctx = await this.requestContextService.create({
       apiType: 'admin',
       req: req as any,
       channelOrToken: channelToken ?? '__default_channel__',
   });
   ```

### Multi-Channel Import Considerations

- Products imported via a specific channel context are assigned to that channel
- Assets (images) are global across channels in Vendure — a single upload serves all channels
- Use different Vendure tokens to scope imports to different channels

---

## Multi-Language Configuration

### Language Code

The import context defaults to the channel's default language. To specify a language:

1. Add `languageCode` to the upload form:
   ```javascript
   formData.append('languageCode', 'de');
   ```

2. In the controller, pass it to context creation:
   ```typescript
   const languageCode = (req.body.languageCode as LanguageCode) ?? LanguageCode.en;
   ```

### Translatable Fields

Vendure's `ProductService.create()` and `ProductVariantService.create()` accept `translations` arrays. The current implementation creates products in the context language only.

To support multi-language import, add additional language columns to the Excel template:

| Column | Description |
|---|---|
| `productName` | Name in default language |
| `productName_de` | Name in German |
| `description` | Description in default language |
| `description_de` | Description in German |

Then map them in the parser:

```typescript
// In ExcelParserService
const translations = [
    { languageCode: LanguageCode.en, name: row.productName, slug: row.slug, description: row.description },
];

if (row['productName_de']) {
    translations.push({
        languageCode: LanguageCode.de,
        name: row['productName_de'],
        slug: row['slug_de'] ?? row.slug,
        description: row['description_de'] ?? '',
    });
}
```

---

## Environment Examples

### Development

```typescript
// vendure-config.ts
export const config: VendureConfig = {
    dbConnectionOptions: {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        database: 'vendure_dev',
        username: 'postgres',
        password: 'postgres',
        synchronize: false,  // Always use migrations
        logging: true,       // Log all SQL in dev
    },
    plugins: [
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        ProductImportPlugin.init({}),
    ],
};
```

**`constants.ts` for development:**
```typescript
export const BATCH_SIZE = 10;          // Small batches for easier debugging
export const MAX_FILE_SIZE_MB = 10;    // Small limit for dev testing
```

### Staging

```typescript
// vendure-config.ts
export const config: VendureConfig = {
    dbConnectionOptions: {
        type: 'postgres',
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT ?? '5432'),
        database: process.env.DB_NAME!,
        username: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        synchronize: false,
        logging: ['error', 'warn'],
    },
    plugins: [
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        ProductImportPlugin.init({}),
    ],
};
```

**`.env.staging`:**
```bash
DB_HOST=staging-db.internal
DB_PORT=5432
DB_NAME=vendure_staging
DB_USER=vendure_app
DB_PASSWORD=<staging-password>

# Upload limits
MAX_EXCEL_FILE_SIZE_MB=100
MAX_IMAGE_FILE_SIZE_MB=50

# Temp directory
IMPORT_TEMP_DIR=/var/app/import-temp
```

### Production

```typescript
// vendure-config.ts
export const config: VendureConfig = {
    dbConnectionOptions: {
        type: 'postgres',
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT ?? '5432'),
        database: process.env.DB_NAME!,
        username: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        synchronize: false,
        logging: ['error'],
        extra: {
            max: 20,                  // Connection pool size
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        },
    },
    plugins: [
        // Production: use Redis-backed queue for reliability
        BullMQJobQueuePlugin.init({
            connection: {
                host: process.env.REDIS_HOST!,
                port: parseInt(process.env.REDIS_PORT ?? '6379'),
                password: process.env.REDIS_PASSWORD,
                tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
            },
        }),
        ProductImportPlugin.init({}),
    ],
};
```

**`.env.production`:**
```bash
# Database
DB_HOST=prod-db.internal
DB_PORT=5432
DB_NAME=vendure_production
DB_USER=vendure_app
DB_PASSWORD=<prod-password>

# Redis (for BullMQ job queue)
REDIS_HOST=prod-redis.internal
REDIS_PORT=6379
REDIS_PASSWORD=<redis-password>
REDIS_TLS=true

# Upload config
IMPORT_TEMP_DIR=/var/app/import-temp

# App
NODE_ENV=production
APP_PORT=3000
```

**PM2 `ecosystem.config.js` (production):**
```javascript
module.exports = {
    apps: [
        {
            name: 'vendure-server',
            script: 'dist/index.js',
            env: { NODE_ENV: 'production', APP_PORT: 3000 },
            node_args: '--max-old-space-size=2048',
        },
        {
            name: 'vendure-worker',
            script: 'dist/index-worker.js',
            env: { NODE_ENV: 'production' },
            node_args: '--max-old-space-size=4096',
        },
    ],
};
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  vendure-server:
    build: .
    command: node dist/index.js
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=vendure
      - DB_USER=vendure
      - DB_PASSWORD=${DB_PASSWORD}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - IMPORT_TEMP_DIR=/tmp/import
    volumes:
      - import-temp:/tmp/import
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis

  vendure-worker:
    build: .
    command: node dist/index-worker.js
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=vendure
      - DB_USER=vendure
      - DB_PASSWORD=${DB_PASSWORD}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - IMPORT_TEMP_DIR=/tmp/import
    volumes:
      - import-temp:/tmp/import
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=vendure
      - POSTGRES_USER=vendure
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}

volumes:
  postgres-data:
  import-temp:
```
