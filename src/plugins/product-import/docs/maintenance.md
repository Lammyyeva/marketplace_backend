# Maintenance Guide

> Keeping the import system healthy, updated, and performant over time

---

## Table of Contents

- [Routine Maintenance Tasks](#routine-maintenance-tasks)
- [Updating the Plugin](#updating-the-plugin)
- [Database Maintenance](#database-maintenance)
- [Queue Maintenance](#queue-maintenance)
- [Temp File Cleanup](#temp-file-cleanup)
- [Log Rotation](#log-rotation)
- [Health Checks](#health-checks)
- [Dependency Updates](#dependency-updates)

---

## Routine Maintenance Tasks

### Daily

- [ ] Check worker process is running (`pm2 status`)
- [ ] Review failed import jobs from the previous day
- [ ] Monitor disk space for temp uploads (`df -h /tmp`)

### Weekly

- [ ] Review import error rates (query `import_job` table)
- [ ] Clear orphaned temp files
- [ ] Check PostgreSQL table bloat on `import_log`

### Monthly

- [ ] Delete import logs older than 90 days
- [ ] Archive old import job records to CSV
- [ ] Update dependencies (`npm outdated`)
- [ ] Review `BATCH_SIZE` against import performance metrics
- [ ] Verify backup restoration procedure

---

## Updating the Plugin

### Patch Updates (No Schema Changes)

1. Pull latest code
2. Run `npm install` to pick up dependency updates
3. Run `npm run build:server && npm run build:dashboard`
4. Restart processes: `pm2 restart all`

### Updates with Database Changes

If the plugin update includes new columns or tables:

1. Pull latest code
2. Run `npm install`
3. Generate migration (if not included):
   ```bash
   npm run migration:generate
   ```
4. Review the generated migration file
5. Run migration on a **staging environment first**
6. Run migration on production:
   ```bash
   npm run migration:run
   ```
7. Build and restart

### Rolling Back

```bash
# Revert last migration
npm run migration:revert

# Restore previous plugin version via git
git checkout <previous-commit> -- src/plugins/product-import/

# Rebuild
npm run build
pm2 restart all
```

---

## Database Maintenance

### Vacuum and Analyze

The `import_log` table receives heavy write traffic during large imports. Schedule regular VACUUM:

```sql
-- Manual vacuum (safe during normal operation)
VACUUM ANALYZE import_log;
VACUUM ANALYZE import_job;
```

### Table Size Monitoring

```sql
SELECT
    relname AS table_name,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
    pg_size_pretty(pg_relation_size(relid)) AS table_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS index_size
FROM pg_catalog.pg_statio_user_tables
WHERE relname IN ('import_job', 'import_log')
ORDER BY pg_total_relation_size(relid) DESC;
```

### Index Health

```sql
-- Check index usage
SELECT
    indexrelname AS index_name,
    idx_scan AS scans,
    idx_tup_read AS rows_read,
    idx_tup_fetch AS rows_fetched
FROM pg_stat_user_indexes
WHERE relname IN ('import_job', 'import_log')
ORDER BY idx_scan DESC;
```

### Cleanup Old Records

```sql
-- Safe cleanup: only removes terminal-state jobs older than 90 days
-- import_log rows cascade-delete automatically
DELETE FROM import_job
WHERE created_at < NOW() - INTERVAL '90 days'
  AND status IN ('COMPLETED', 'FAILED', 'CANCELLED');

-- After large deletes, reclaim disk space
VACUUM FULL import_log;
VACUUM FULL import_job;
```

> **Warning:** `VACUUM FULL` acquires an exclusive lock and blocks all reads/writes. Run it during a maintenance window.

---

## Queue Maintenance

### Checking Queue Depth

Since Vendure uses the database as the job queue backend, check the queue depth with:

```sql
-- Jobs waiting to be processed
SELECT COUNT(*) AS pending_jobs
FROM vendure_job_record
WHERE queue_name = 'product-import-job'
  AND state = 'PENDING';
```

### Clearing Stuck Jobs

If a job is stuck in `PENDING` for more than 30 minutes (worker likely crashed):

```sql
-- Reset stuck jobs to allow re-processing
UPDATE vendure_job_record
SET state = 'PENDING'
WHERE queue_name = 'product-import-job'
  AND state = 'RUNNING'
  AND started_at < NOW() - INTERVAL '30 minutes';
```

Then restart the worker: `pm2 restart vendure-worker`

### Clearing Failed Queue Entries

```sql
-- Remove failed queue entries older than 7 days
DELETE FROM vendure_job_record
WHERE queue_name IN ('product-import-job', 'image-import-job')
  AND state = 'FAILED'
  AND created_at < NOW() - INTERVAL '7 days';
```

---

## Temp File Cleanup

The import system writes uploaded Excel files and extracted ZIP contents to `os.tmpdir()`. These are cleaned up after successful processing, but failed jobs or crashed workers may leave orphaned files.

### Manual Cleanup

```bash
# Find old import temp directories
find /tmp -name "pi-upload-*" -type d -mtime +1 -exec rm -rf {} +
find /tmp -name "product-import-*" -type d -mtime +1 -exec rm -rf {} +
find /tmp -name "img-import-*" -type d -mtime +1 -exec rm -rf {} +
find /tmp -name "import-images-*" -type d -mtime +1 -exec rm -rf {} +

# macOS (/private/tmp)
find /private/tmp -name "pi-upload-*" -type d -mtime +1 -exec rm -rf {} +
```

### Automated Cleanup (Cron)

```bash
# crontab -e
# Run temp cleanup every 6 hours
0 */6 * * * find /tmp -name "pi-upload-*" -mtime +0 -exec rm -rf {} + 2>/dev/null
0 */6 * * * find /tmp -name "product-import-*" -mtime +0 -exec rm -rf {} + 2>/dev/null
0 */6 * * * find /tmp -name "import-images-*" -mtime +0 -exec rm -rf {} + 2>/dev/null
```

### Disk Space Alert

```bash
# Check if /tmp is above 80% full and alert
#!/bin/bash
USAGE=$(df /tmp | awk 'NR==2 {print $5}' | tr -d '%')
if [ "$USAGE" -gt 80 ]; then
    echo "ALERT: /tmp disk usage is ${USAGE}%" | mail -s "Disk Alert" ops@yourstore.com
fi
```

---

## Log Rotation

### Application Logs (PM2)

```bash
# Install log rotation module
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 100M     # Rotate when file reaches 100 MB
pm2 set pm2-logrotate:retain 14         # Keep 14 rotated files
pm2 set pm2-logrotate:compress true     # gzip rotated files
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'  # Daily rotation

# Verify configuration
pm2 get pm2-logrotate
```

### System Logs (logrotate)

```conf
# /etc/logrotate.d/vendure
/app/homestore-backend/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## Health Checks

### Worker Process Health

```bash
#!/bin/bash
# health-check.sh
set -e

# Check PM2 processes
if ! pm2 describe vendure-worker > /dev/null 2>&1; then
    echo "CRITICAL: vendure-worker process not found"
    exit 2
fi

STATUS=$(pm2 describe vendure-worker | grep "status" | awk '{print $4}')
if [ "$STATUS" != "online" ]; then
    echo "CRITICAL: vendure-worker status is $STATUS"
    exit 2
fi

echo "OK: vendure-worker is online"
exit 0
```

### Import Pipeline Health

```bash
# Check for jobs stuck in PROCESSING > 1 hour
STUCK=$(psql -d vendure -t -c "
SELECT COUNT(*) FROM import_job
WHERE status = 'PROCESSING'
  AND started_at < NOW() - INTERVAL '1 hour';
" | xargs)

if [ "$STUCK" -gt 0 ]; then
    echo "WARNING: $STUCK import job(s) stuck in PROCESSING state"
fi
```

### API Health

```bash
# Verify the template endpoint is reachable
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" \
  http://localhost:3000/import/template \
  -H "Authorization: Bearer $HEALTH_TOKEN")

if [ "$HTTP_STATUS" != "200" ]; then
    echo "CRITICAL: /import/template returned HTTP $HTTP_STATUS"
    exit 2
fi

echo "OK: Import API is responding"
```

---

## Dependency Updates

### Check for Updates

```bash
npm outdated
```

Key dependencies to monitor:

| Package | Reason |
|---|---|
| `exceljs` | Excel compatibility improvements |
| `adm-zip` | Security patches |
| `@vendure/core` | Vendure service API changes |
| `typeorm` | Query fixes, PostgreSQL compatibility |
| `@nestjs/*` | Security, performance |

### Safe Update Process

```bash
# 1. Check breaking changes in changelogs before updating

# 2. Update specific package
npm install exceljs@latest

# 3. Run TypeScript check
npx tsc --noEmit

# 4. Test import flow
npm run dev
# Upload a small test Excel file → verify import completes

# 5. Commit updated package.json and package-lock.json
git add package.json package-lock.json
git commit -m "chore: update exceljs to vX.Y.Z"
```

### Vendure Core Updates

When updating `@vendure/core`, check for:
- `ProductService` API changes (method signatures)
- `ProductVariantService` API changes
- `AssetService.create()` signature changes
- `JobQueueService` API changes
- `RequestContext` changes

Run `npx tsc --noEmit` after any Vendure update to catch type errors.
