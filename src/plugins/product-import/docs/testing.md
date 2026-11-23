# Testing Guide

> Unit testing, integration testing, E2E testing, and performance benchmarking

---

## Table of Contents

- [Test Setup](#test-setup)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Mock Data Generation](#mock-data-generation)
- [Performance Testing](#performance-testing)
- [CI Configuration](#ci-configuration)

---

## Test Setup

### Prerequisites

```bash
# Install test dependencies
npm install --save-dev \
  jest \
  ts-jest \
  @types/jest \
  @nestjs/testing \
  supertest \
  @types/supertest
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: 'src',
    testRegex: '.*\\.spec\\.ts$',
    transform: { '^.+\\.(t|j)s$': 'ts-jest' },
    moduleFileExtensions: ['js', 'json', 'ts'],
    collectCoverageFrom: ['plugins/product-import/**/*.ts'],
    coverageDirectory: '../coverage',
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
};
```

### Test Database

Integration tests require a real PostgreSQL instance. Use Docker:

```bash
# Start a test database (separate from dev DB)
docker run -d \
  --name vendure-test-db \
  -e POSTGRES_DB=vendure_test \
  -e POSTGRES_USER=test \
  -e POSTGRES_PASSWORD=test \
  -p 5433:5432 \
  postgres:15
```

Set the connection in your test environment:

```bash
# .env.test
DB_HOST=localhost
DB_PORT=5433
DB_NAME=vendure_test
DB_USER=test
DB_PASSWORD=test
```

---

## Unit Testing

Unit tests isolate individual services using mocked dependencies.

### ExcelParserService Tests

```typescript
// src/plugins/product-import/services/__tests__/excel-parser.service.spec.ts
import { Test } from '@nestjs/testing';
import { ExcelParserService } from '../excel-parser.service';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('ExcelParserService', () => {
    let service: ExcelParserService;
    let tmpFile: string;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [ExcelParserService],
        }).compile();
        service = module.get(ExcelParserService);
    });

    beforeEach(() => {
        tmpFile = path.join(os.tmpdir(), `test-${Date.now()}.xlsx`);
    });

    afterEach(() => {
        if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    });

    async function createTestExcel(rows: Record<string, any>[]): Promise<string> {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Products');

        // Add required header rows (row 1 = headers, row 2 = hints)
        ws.addRow(['productName', 'slug', 'sku', 'price', 'stock', 'enabled', 'description']);
        ws.addRow(['Required', 'Required', 'Required', 'Required (cents)', 'Optional', 'Optional', 'Optional']);

        for (const row of rows) {
            ws.addRow([
                row.productName,
                row.slug,
                row.sku,
                row.price,
                row.stock ?? '',
                row.enabled ?? '',
                row.description ?? '',
            ]);
        }

        await wb.xlsx.writeFile(tmpFile);
        return tmpFile;
    }

    it('parses a valid Excel file', async () => {
        const filePath = await createTestExcel([
            { productName: 'Test Product', slug: 'test-product', sku: 'SKU001', price: 1999, stock: 10 },
        ]);

        const result = await service.parse(filePath);

        expect(result.rows).toHaveLength(1);
        expect(result.rows[0]).toMatchObject({
            productName: 'Test Product',
            slug: 'test-product',
            sku: 'SKU001',
            price: 1999,
            stock: 10,
        });
        expect(result.errors).toHaveLength(0);
    });

    it('normalizes SKU to uppercase', async () => {
        const filePath = await createTestExcel([
            { productName: 'Test', slug: 'test', sku: 'st1234', price: 100 },
        ]);

        const result = await service.parse(filePath);
        expect(result.rows[0].sku).toBe('ST1234');
    });

    it('rejects negative prices', async () => {
        const filePath = await createTestExcel([
            { productName: 'Test', slug: 'test', sku: 'SKU001', price: -100 },
        ]);

        const result = await service.parse(filePath);
        expect(result.rows[0].errors?.some(e => e.includes('price'))).toBe(true);
    });

    it('rejects invalid slug characters', async () => {
        const filePath = await createTestExcel([
            { productName: 'Test', slug: 'Test Product!', sku: 'SKU001', price: 100 },
        ]);

        const result = await service.parse(filePath);
        expect(result.rows[0].errors?.some(e => e.includes('slug'))).toBe(true);
    });

    it('skips fully empty rows', async () => {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Products');
        ws.addRow(['productName', 'slug', 'sku', 'price']);
        ws.addRow(['Hints']);
        ws.addRow(['Test', 'test', 'SKU001', 1000]);
        ws.addRow(['', '', '', '']); // empty row
        ws.addRow(['Test 2', 'test-2', 'SKU002', 2000]);
        await wb.xlsx.writeFile(tmpFile);

        const result = await service.parse(tmpFile);
        expect(result.rows).toHaveLength(2);
    });

    it('parses custom fields', async () => {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Products');
        ws.addRow(['productName', 'slug', 'sku', 'price', 'customField_material']);
        ws.addRow(['Hints']);
        ws.addRow(['Test', 'test', 'SKU001', 100, 'Cotton']);
        await wb.xlsx.writeFile(tmpFile);

        const result = await service.parse(tmpFile);
        expect(result.rows[0].customFields?.material).toBe('Cotton');
    });

    it('throws on missing required headers', async () => {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Products');
        ws.addRow(['productName', 'price']); // missing slug and sku
        ws.addRow(['Hints']);
        ws.addRow(['Test', 100]);
        await wb.xlsx.writeFile(tmpFile);

        await expect(service.parse(tmpFile)).rejects.toThrow(/missing required header/i);
    });
});
```

### AssetMappingService Tests

```typescript
// src/plugins/product-import/services/__tests__/asset-mapping.service.spec.ts
import { AssetMappingService } from '../asset-mapping.service';

describe('AssetMappingService.mapImagesToSkus', () => {
    let service: AssetMappingService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AssetMappingService,
                { provide: 'ASSET_SERVICE', useValue: {} },
            ],
        }).compile();
        service = module.get(AssetMappingService);
    });

    it('maps SKU.jpg as featured image (index 0)', () => {
        const result = service.mapImagesToSkus(['/tmp/ST1234.jpg']);
        expect(result.get('ST1234')).toEqual([{ filePath: '/tmp/ST1234.jpg', index: 0 }]);
    });

    it('maps SKU_1.jpg as gallery image (index 1)', () => {
        const result = service.mapImagesToSkus(['/tmp/ST1234_1.jpg']);
        expect(result.get('ST1234')).toEqual([{ filePath: '/tmp/ST1234_1.jpg', index: 1 }]);
    });

    it('groups multiple images by SKU', () => {
        const result = service.mapImagesToSkus([
            '/tmp/SKU001.jpg',
            '/tmp/SKU001_1.jpg',
            '/tmp/SKU001_2.jpg',
        ]);
        expect(result.get('SKU001')).toHaveLength(3);
    });

    it('is case-insensitive for SKU matching', () => {
        const result = service.mapImagesToSkus(['/tmp/st1234.jpg']);
        expect(result.has('ST1234')).toBe(true);
    });

    it('ignores unsupported extensions', () => {
        const result = service.mapImagesToSkus(['/tmp/SKU001.txt', '/tmp/SKU001.pdf']);
        expect(result.size).toBe(0);
    });

    it('returns empty map for empty input', () => {
        const result = service.mapImagesToSkus([]);
        expect(result.size).toBe(0);
    });
});
```

### ExcelTemplateService Tests

```typescript
// src/plugins/product-import/services/__tests__/excel-template.service.spec.ts
import { ExcelTemplateService } from '../excel-template.service';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

describe('ExcelTemplateService', () => {
    let service: ExcelTemplateService;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [ExcelTemplateService],
        }).compile();
        service = module.get(ExcelTemplateService);
    });

    it('generates a valid XLSX buffer', async () => {
        const buffer = await service.generate();
        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.length).toBeGreaterThan(0);
    });

    it('generated template is readable by ExcelJS', async () => {
        const buffer = await service.generate();
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buffer);

        const ws = wb.getWorksheet('Products');
        expect(ws).toBeDefined();
    });

    it('template includes required columns', async () => {
        const buffer = await service.generate();
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buffer);

        const ws = wb.getWorksheet('Products')!;
        const headerRow = ws.getRow(1);
        const headers = headerRow.values as string[];

        expect(headers).toContain('productName');
        expect(headers).toContain('slug');
        expect(headers).toContain('sku');
        expect(headers).toContain('price');
    });

    it('template has an Instructions sheet', async () => {
        const buffer = await service.generate();
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buffer);

        expect(wb.getWorksheet('Instructions')).toBeDefined();
    });
});
```

---

## Integration Testing

Integration tests verify that services work together with a real database.

### Test Module Setup

```typescript
// src/plugins/product-import/__tests__/test-utils.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportJob } from '../entities/import-job.entity';
import { ImportLog } from '../entities/import-log.entity';

export async function createTestModule(providers: any[]): Promise<TestingModule> {
    return Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST ?? 'localhost',
                port: parseInt(process.env.DB_PORT ?? '5433'),
                database: process.env.DB_NAME ?? 'vendure_test',
                username: process.env.DB_USER ?? 'test',
                password: process.env.DB_PASSWORD ?? 'test',
                entities: [ImportJob, ImportLog],
                synchronize: true, // OK for test DB only
            }),
            TypeOrmModule.forFeature([ImportJob, ImportLog]),
        ],
        providers,
    }).compile();
}
```

### ImportService Integration Tests

```typescript
// src/plugins/product-import/__tests__/import.service.integration.spec.ts
import { ImportService } from '../services/import.service';
import { ImportJob } from '../entities/import-job.entity';
import { ImportJobStatus, ImportMode } from '../types';
import { createTestModule } from './test-utils';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ImportService (integration)', () => {
    let service: ImportService;
    let repo: Repository<ImportJob>;

    beforeAll(async () => {
        const module = await createTestModule([ImportService /* ... other deps */]);
        service = module.get(ImportService);
        repo = module.get(getRepositoryToken(ImportJob));
    });

    afterEach(async () => {
        await repo.delete({});
    });

    it('creates an ImportJob record on enqueue', async () => {
        // Arrange: mock context
        const ctx = buildMockRequestContext();

        // Act
        const job = await service.enqueueProductImport(ctx, {
            filePath: '/tmp/test.xlsx',
            fileName: 'test.xlsx',
            mode: ImportMode.UPSERT,
            dryRun: false,
        });

        // Assert
        expect(job.id).toBeDefined();
        expect(job.status).toBe(ImportJobStatus.PENDING);

        const saved = await repo.findOne({ where: { id: job.id } });
        expect(saved).not.toBeNull();
        expect(saved!.fileName).toBe('test.xlsx');
    });

    it('lists import jobs sorted by createdAt desc', async () => {
        // Create 3 jobs with different timestamps
        const ctx = buildMockRequestContext();
        await repo.save(repo.create({ fileName: 'a.xlsx', status: ImportJobStatus.COMPLETED }));
        await repo.save(repo.create({ fileName: 'b.xlsx', status: ImportJobStatus.FAILED }));

        const jobs = await service.getImportJobs(ctx);
        expect(jobs[0].createdAt.getTime()).toBeGreaterThanOrEqual(jobs[1].createdAt.getTime());
    });
});

function buildMockRequestContext() {
    return {
        activeUserId: 'ADMIN_1',
        channel: { token: '__default_channel__' },
        languageCode: 'en',
    } as any;
}
```

---

## E2E Testing

E2E tests exercise the full HTTP layer with a running Vendure instance.

### Setup

```typescript
// src/plugins/product-import/__tests__/e2e/setup.ts
import { bootstrapServer } from '@vendure/testing';
import { config } from '../../test-vendure-config';

let server: any;
let adminClient: any;

export async function startTestServer() {
    ({ server, adminClient } = await bootstrapServer({ config }));
    return { server, adminClient };
}

export async function stopTestServer() {
    await server.destroy();
}
```

### REST Endpoint Tests

```typescript
// src/plugins/product-import/__tests__/e2e/import-controller.e2e.spec.ts
import * as request from 'supertest';
import * as path from 'path';
import { startTestServer, stopTestServer } from './setup';

describe('ImportController (e2e)', () => {
    let app: any;
    let authToken: string;

    beforeAll(async () => {
        const { server } = await startTestServer();
        app = server.app.getHttpServer();
        authToken = await getAdminToken(app);
    });

    afterAll(() => stopTestServer());

    describe('GET /import/template', () => {
        it('returns an xlsx file', async () => {
            const res = await request(app)
                .get('/import/template')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.headers['content-type']).toContain('spreadsheetml');
            expect(res.headers['content-disposition']).toContain('product-import-template.xlsx');
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('returns 401 without auth', async () => {
            await request(app).get('/import/template').expect(401);
        });
    });

    describe('POST /import/upload-excel', () => {
        it('accepts a valid xlsx and returns an import job', async () => {
            const res = await request(app)
                .post('/import/upload-excel')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', path.join(__dirname, 'fixtures/valid-products.xlsx'))
                .field('mode', 'UPSERT')
                .field('dryRun', 'true')
                .expect(200);

            expect(res.body.jobId).toBeDefined();
            expect(res.body.status).toBe('PENDING');
        });

        it('rejects non-excel files', async () => {
            await request(app)
                .post('/import/upload-excel')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', path.join(__dirname, 'fixtures/not-excel.csv'))
                .field('mode', 'UPSERT')
                .expect(400);
        });

        it('returns 401 without auth', async () => {
            await request(app)
                .post('/import/upload-excel')
                .attach('file', path.join(__dirname, 'fixtures/valid-products.xlsx'))
                .expect(401);
        });
    });

    describe('GET /import/jobs/:id', () => {
        it('returns job status', async () => {
            // First, upload a file to get a job ID
            const uploadRes = await request(app)
                .post('/import/upload-excel')
                .set('Authorization', `Bearer ${authToken}`)
                .attach('file', path.join(__dirname, 'fixtures/valid-products.xlsx'))
                .field('mode', 'UPSERT')
                .field('dryRun', 'true');

            const { jobId } = uploadRes.body;

            const res = await request(app)
                .get(`/import/jobs/${jobId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(res.body.id).toBe(jobId);
            expect(['PENDING', 'PROCESSING', 'COMPLETED']).toContain(res.body.status);
        });

        it('returns 404 for unknown job', async () => {
            await request(app)
                .get('/import/jobs/nonexistent-id')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
    });
});

async function getAdminToken(app: any): Promise<string> {
    const res = await request(app)
        .post('/admin-api')
        .send({
            query: `mutation {
                login(username: "superadmin", password: "superadmin") {
                    ... on CurrentUser { id }
                }
            }`,
        });
    return res.headers['vendure-auth-token'];
}
```

### GraphQL Tests

```typescript
// src/plugins/product-import/__tests__/e2e/import-graphql.e2e.spec.ts
import { startTestServer, stopTestServer } from './setup';

const IMPORT_JOBS_QUERY = `
    query ImportJobs {
        importJobs {
            id status mode fileName totalRows successCount failedCount
        }
    }
`;

const CANCEL_MUTATION = `
    mutation CancelImportJob($id: ID!) {
        cancelImportJob(id: $id) {
            id status
        }
    }
`;

describe('Import GraphQL API (e2e)', () => {
    let adminClient: any;

    beforeAll(async () => {
        ({ adminClient } = await startTestServer());
        await adminClient.asSuperAdmin();
    });

    afterAll(() => stopTestServer());

    it('importJobs returns an array', async () => {
        const { importJobs } = await adminClient.query(IMPORT_JOBS_QUERY);
        expect(Array.isArray(importJobs)).toBe(true);
    });

    it('cancelImportJob returns updated status', async () => {
        // Upload a job first via REST and capture the ID
        const jobId = await uploadAndGetJobId(adminClient);

        const { cancelImportJob } = await adminClient.query(CANCEL_MUTATION, { id: jobId });
        expect(cancelImportJob.status).toBe('CANCELLED');
    });
});
```

---

## Mock Data Generation

### Fixture Files

Place test Excel files in `src/plugins/product-import/__tests__/fixtures/`:

```bash
mkdir -p src/plugins/product-import/__tests__/fixtures
```

### Generate Test Excel Files

```typescript
// src/plugins/product-import/__tests__/fixtures/generate-fixtures.ts
import * as ExcelJS from 'exceljs';
import * as path from 'path';

const FIXTURES_DIR = __dirname;

async function generateValidProducts(rowCount = 10) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Products');

    ws.addRow(['productName', 'slug', 'sku', 'price', 'stock', 'enabled', 'description']);
    ws.addRow(['Required', 'Required', 'Required', 'Required (cents)', 'Optional', 'Optional', 'Optional']);

    for (let i = 1; i <= rowCount; i++) {
        ws.addRow([
            `Test Product ${i}`,
            `test-product-${i}`,
            `SKU${String(i).padStart(4, '0')}`,
            999 + i * 100,
            50,
            'TRUE',
            `Description for product ${i}`,
        ]);
    }

    await wb.xlsx.writeFile(path.join(FIXTURES_DIR, 'valid-products.xlsx'));
    console.log(`Generated valid-products.xlsx with ${rowCount} rows`);
}

async function generateInvalidProducts() {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Products');

    ws.addRow(['productName', 'slug', 'sku', 'price']);
    ws.addRow(['Hints']);
    ws.addRow(['', 'test-slug', 'SKU001', 100]);      // missing productName
    ws.addRow(['Valid Name', 'Invalid Slug!', 'SKU002', 100]); // invalid slug
    ws.addRow(['Valid Name', 'test-slug-3', 'SKU003', -100]);  // negative price

    await wb.xlsx.writeFile(path.join(FIXTURES_DIR, 'invalid-products.xlsx'));
    console.log('Generated invalid-products.xlsx');
}

async function generateLargeProducts(rowCount = 1000) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Products');

    ws.addRow(['productName', 'slug', 'sku', 'price', 'stock']);
    ws.addRow(['Hints']);

    for (let i = 1; i <= rowCount; i++) {
        ws.addRow([
            `Bulk Product ${i}`,
            `bulk-product-${i}`,
            `BULK${String(i).padStart(6, '0')}`,
            Math.floor(Math.random() * 10000) + 100,
            Math.floor(Math.random() * 500),
        ]);
    }

    await wb.xlsx.writeFile(path.join(FIXTURES_DIR, 'large-products-1000.xlsx'));
    console.log(`Generated large-products-1000.xlsx with ${rowCount} rows`);
}

// Run all generators
(async () => {
    await generateValidProducts();
    await generateInvalidProducts();
    await generateLargeProducts();
})();
```

Run once to create fixtures:

```bash
npx ts-node src/plugins/product-import/__tests__/fixtures/generate-fixtures.ts
```

### Mock RequestContext

```typescript
// src/plugins/product-import/__tests__/mock-context.ts
import { RequestContext, LanguageCode } from '@vendure/core';

export function buildMockCtx(overrides: Partial<RequestContext> = {}): RequestContext {
    return {
        activeUserId: 'ADMIN_1',
        channel: {
            id: '1',
            token: '__default_channel__',
            defaultLanguageCode: LanguageCode.en,
        },
        languageCode: LanguageCode.en,
        apiType: 'admin',
        isAuthorized: true,
        ...overrides,
    } as unknown as RequestContext;
}
```

### Mock Services

```typescript
// src/plugins/product-import/__tests__/mock-services.ts
export const mockProductService = {
    findOneBySlug: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ id: 'PRODUCT_1' }),
    update: jest.fn().mockResolvedValue({ id: 'PRODUCT_1' }),
};

export const mockProductVariantService = {
    findAll: jest.fn().mockResolvedValue({ items: [], totalItems: 0 }),
    create: jest.fn().mockResolvedValue([{ id: 'VARIANT_1', sku: 'SKU001' }]),
    update: jest.fn().mockResolvedValue([{ id: 'VARIANT_1', sku: 'SKU001' }]),
};

export const mockAssetService = {
    create: jest.fn().mockResolvedValue({ id: 'ASSET_1', name: 'test.jpg' }),
};

export const mockFacetValueService = {
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ id: 'FV_1' }),
};
```

---

## Performance Testing

### Benchmark Script

```typescript
// src/plugins/product-import/__tests__/performance/import-benchmark.ts
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { ExcelParserService } from '../../services/excel-parser.service';

const ROW_COUNTS = [100, 1000, 5000, 10000];

async function generateTestFile(rowCount: number): Promise<string> {
    const tmpFile = path.join(os.tmpdir(), `perf-test-${rowCount}.xlsx`);
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Products');

    ws.addRow(['productName', 'slug', 'sku', 'price', 'stock', 'description']);
    ws.addRow(['Hints']);

    for (let i = 1; i <= rowCount; i++) {
        ws.addRow([
            `Product ${i}`,
            `product-${i}`,
            `SKU${String(i).padStart(6, '0')}`,
            1000 + i,
            100,
            `This is a description for product number ${i} with some realistic text content.`,
        ]);
    }

    await wb.xlsx.writeFile(tmpFile);
    return tmpFile;
}

async function runBenchmark() {
    const parser = new ExcelParserService();

    console.log('Performance Benchmark — ExcelParserService\n');
    console.log('| Rows    | Parse Time (ms) | Rows/sec | Memory Delta |');
    console.log('|---------|-----------------|----------|--------------|');

    for (const rowCount of ROW_COUNTS) {
        const filePath = await generateTestFile(rowCount);

        const memBefore = process.memoryUsage().heapUsed;
        const start = performance.now();

        const result = await parser.parse(filePath);

        const elapsed = Math.round(performance.now() - start);
        const memDelta = Math.round((process.memoryUsage().heapUsed - memBefore) / 1024 / 1024);
        const rowsPerSec = Math.round(rowCount / (elapsed / 1000));

        console.log(
            `| ${String(rowCount).padEnd(7)} | ${String(elapsed).padEnd(15)} | ${String(rowsPerSec).padEnd(8)} | ${memDelta} MB         |`,
        );

        fs.unlinkSync(filePath);
    }
}

runBenchmark().catch(console.error);
```

Run the benchmark:

```bash
npx ts-node src/plugins/product-import/__tests__/performance/import-benchmark.ts
```

Expected output:

```
Performance Benchmark — ExcelParserService

| Rows    | Parse Time (ms) | Rows/sec | Memory Delta |
|---------|-----------------|----------|--------------|
| 100     | 45              | 2222     | 12 MB        |
| 1000    | 180             | 5555     | 18 MB        |
| 5000    | 820             | 6097     | 32 MB        |
| 10000   | 1650            | 6060     | 48 MB        |
```

### Load Testing (Upload Endpoint)

Use [k6](https://k6.io/) for HTTP load testing:

```javascript
// k6-import-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

export const options = {
    vus: 5,          // 5 concurrent users
    duration: '60s', // run for 60 seconds
    thresholds: {
        http_req_duration: ['p(95)<10000'], // 95th percentile under 10s
        http_req_failed: ['rate<0.05'],      // < 5% failures
    },
};

const TOKEN = __ENV.ADMIN_TOKEN;
const BASE_URL = __ENV.BASE_URL ?? 'http://localhost:3000';

export default function () {
    // Template download (lightweight — use to test GET performance)
    const res = http.get(`${BASE_URL}/import/template`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
    });

    check(res, {
        'template status 200': (r) => r.status === 200,
        'response time < 2s': (r) => r.timings.duration < 2000,
    });

    sleep(1);
}
```

Run load test:

```bash
k6 run -e ADMIN_TOKEN=your-token -e BASE_URL=http://localhost:3000 k6-import-test.js
```

---

## CI Configuration

### GitHub Actions

```yaml
# .github/workflows/test-import-plugin.yml
name: Product Import Plugin Tests

on:
  push:
    paths:
      - 'src/plugins/product-import/**'
  pull_request:
    paths:
      - 'src/plugins/product-import/**'

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx jest --testPathPattern='plugins/product-import.*spec' --coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: vendure_test
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5433:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    env:
      DB_HOST: localhost
      DB_PORT: 5433
      DB_NAME: vendure_test
      DB_USER: test
      DB_PASSWORD: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx jest --testPathPattern='integration' --runInBand

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit
```

### NPM Test Scripts

Add to `package.json`:

```json
{
    "scripts": {
        "test": "jest",
        "test:unit": "jest --testPathPattern='__tests__/.*\\.spec\\.ts$' --testPathIgnorePatterns='integration|e2e'",
        "test:integration": "jest --testPathPattern='integration' --runInBand",
        "test:e2e": "jest --testPathPattern='e2e' --runInBand",
        "test:coverage": "jest --coverage",
        "test:watch": "jest --watch",
        "benchmark": "ts-node src/plugins/product-import/__tests__/performance/import-benchmark.ts"
    }
}
```

### Coverage Targets

| Module | Target Coverage |
|---|---|
| `excel-parser.service.ts` | ≥ 90% |
| `asset-mapping.service.ts` | ≥ 85% |
| `excel-template.service.ts` | ≥ 80% |
| `import.service.ts` | ≥ 75% |
| `import.controller.ts` | ≥ 70% (E2E covers the rest) |
