# DevOps Guide

> Production deployment, infrastructure, monitoring, and operations

---

## Table of Contents

- [Docker](#docker)
- [Docker Compose](#docker-compose)
- [Kubernetes](#kubernetes)
- [Nginx Configuration](#nginx-configuration)
- [PM2 Configuration](#pm2-configuration)
- [Redis Configuration](#redis-configuration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring](#monitoring)
- [Logging](#logging)
- [Backup Recommendations](#backup-recommendations)

---

## Docker

### Dockerfile

The project's existing `Dockerfile` handles the plugin without changes. Ensure the build copies the dashboard output:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build:server
RUN npm run build:dashboard

# Production image
FROM node:20-alpine
WORKDIR /app

# Copy compiled server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copy static dashboard build
COPY --from=builder /app/dist/dashboard ./dist/dashboard

# Create temp directory for file uploads
RUN mkdir -p /tmp/product-import && chmod 777 /tmp/product-import

EXPOSE 3000
CMD ["node", "./dist/index.js"]
```

### Build and Push

```bash
# Build
docker build -t yourregistry/homestore-backend:latest .

# Push
docker push yourregistry/homestore-backend:latest
```

---

## Docker Compose

```yaml
# docker-compose.yml
version: '3.9'

services:
  server:
    image: yourregistry/homestore-backend:latest
    command: ["node", "./dist/index.js"]
    environment:
      APP_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: vendure
      DB_USERNAME: vendure
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
    ports:
      - "3000:3000"
    volumes:
      # Persist uploaded assets
      - assets:/app/static/assets
      # Temp upload dir (shared with worker for ZIP extraction)
      - uploads_tmp:/tmp
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  worker:
    image: yourregistry/homestore-backend:latest
    command: ["node", "./dist/index-worker.js"]
    environment:
      APP_ENV: production
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: vendure
      DB_USERNAME: vendure
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      # Increase memory for large imports
      NODE_OPTIONS: "--max-old-space-size=2048"
    volumes:
      - assets:/app/static/assets
      - uploads_tmp:/tmp
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    # Scale to 2 worker instances for parallel job processing
    deploy:
      replicas: 2

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: vendure
      POSTGRES_USER: vendure
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U vendure"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru
    volumes:
      - redisdata:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - server

volumes:
  pgdata:
  redisdata:
  assets:
  uploads_tmp:
```

---

## Kubernetes

### Deployment

```yaml
# k8s/vendure-server.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vendure-server
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vendure-server
  template:
    metadata:
      labels:
        app: vendure-server
    spec:
      containers:
        - name: server
          image: yourregistry/homestore-backend:latest
          command: ["node", "./dist/index.js"]
          ports:
            - containerPort: 3000
          env:
            - name: APP_ENV
              value: "production"
            - name: DB_HOST
              valueFrom:
                secretKeyRef:
                  name: vendure-secrets
                  key: db-host
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: vendure-secrets
                  key: db-password
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "1Gi"
              cpu: "1000m"
          volumeMounts:
            - name: assets
              mountPath: /app/static/assets
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: assets
          persistentVolumeClaim:
            claimName: vendure-assets-pvc
        - name: tmp
          emptyDir:
            sizeLimit: 10Gi  # Allow up to 10 GB for import temp files
---
# k8s/vendure-worker.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vendure-worker
spec:
  replicas: 2   # 2 workers for parallel import processing
  selector:
    matchLabels:
      app: vendure-worker
  template:
    metadata:
      labels:
        app: vendure-worker
    spec:
      containers:
        - name: worker
          image: yourregistry/homestore-backend:latest
          command: ["node", "./dist/index-worker.js"]
          env:
            - name: APP_ENV
              value: "production"
            - name: NODE_OPTIONS
              value: "--max-old-space-size=2048"
          resources:
            requests:
              memory: "1Gi"
              cpu: "500m"
            limits:
              memory: "3Gi"
              cpu: "2000m"
          volumeMounts:
            - name: assets
              mountPath: /app/static/assets
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: assets
          persistentVolumeClaim:
            claimName: vendure-assets-pvc
        - name: tmp
          emptyDir:
            sizeLimit: 10Gi
```

### Persistent Volume for Assets

```yaml
# k8s/assets-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: vendure-assets-pvc
spec:
  accessModes:
    - ReadWriteMany   # Required: both server and worker need write access
  resources:
    requests:
      storage: 100Gi
  storageClassName: nfs  # Use NFS or similar for ReadWriteMany
```

### Ingress (with upload size override)

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: vendure-ingress
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "200m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "300"
spec:
  rules:
    - host: api.yourstore.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: vendure-server
                port:
                  number: 3000
```

---

## Nginx Configuration

```nginx
# /etc/nginx/sites-available/vendure
upstream vendure_backend {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name api.yourstore.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourstore.com;

    ssl_certificate     /etc/ssl/certs/yourstore.crt;
    ssl_certificate_key /etc/ssl/private/yourstore.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # ─── Upload settings for Product Import Plugin ───────────────────
    client_max_body_size    200m;   # Allow up to 200 MB file uploads
    client_body_timeout     120s;   # Allow slow uploads
    proxy_read_timeout      300s;   # Allow slow server responses (large import jobs)
    proxy_send_timeout      300s;
    proxy_connect_timeout    75s;
    # ─────────────────────────────────────────────────────────────────

    # Buffer settings for large responses
    proxy_buffering         on;
    proxy_buffer_size       16k;
    proxy_buffers           8 16k;
    proxy_busy_buffers_size 32k;

    location / {
        proxy_pass          http://vendure_backend;
        proxy_http_version  1.1;
        proxy_set_header    Upgrade           $http_upgrade;
        proxy_set_header    Connection        'upgrade';
        proxy_set_header    Host              $host;
        proxy_set_header    X-Real-IP         $remote_addr;
        proxy_set_header    X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto $scheme;
        proxy_cache_bypass  $http_upgrade;
    }

    # Serve static assets with caching
    location /assets/ {
        proxy_pass        http://vendure_backend;
        proxy_cache_valid 200 1d;
        add_header        Cache-Control "public, max-age=86400";
    }

    # Gzip for API responses
    gzip            on;
    gzip_types      application/json text/plain;
    gzip_min_length 1024;
}
```

---

## PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'vendure-server',
      script: './dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        APP_ENV: 'production',
      },
      node_args: '--max-old-space-size=2048',
      max_memory_restart: '2G',
      error_file: './logs/server-error.log',
      out_file: './logs/server-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      restart_delay: 3000,
    },
    {
      name: 'vendure-worker',
      script: './dist/index-worker.js',
      instances: 2,               // 2 workers for parallel import processing
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        APP_ENV: 'production',
      },
      node_args: '--max-old-space-size=3072',  // Workers need more memory for large imports
      max_memory_restart: '3G',
      error_file: './logs/worker-error.log',
      out_file: './logs/worker-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
      restart_delay: 5000,
      // Auto-restart on crash, with backoff
      autorestart: true,
      min_uptime: '10s',
      max_restarts: 10,
    },
  ],
};
```

**Start:**
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

## Redis Configuration

```conf
# /etc/redis/redis.conf

# Persistence (important for job queue durability)
appendonly yes
appendfsync everysec

# Memory management
maxmemory 1gb
maxmemory-policy allkeys-lru

# Connection timeout
timeout 300

# Logging
loglevel notice
logfile /var/log/redis/redis.log
```

**Verify Redis:**
```bash
redis-cli ping
# Expected: PONG

redis-cli info replication
# Check: role:master
```

---

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t ${{ secrets.REGISTRY }}/homestore-backend:${{ github.sha }} .

      - name: Push image
        run: |
          echo ${{ secrets.REGISTRY_PASSWORD }} | docker login ${{ secrets.REGISTRY }} -u ${{ secrets.REGISTRY_USERNAME }} --password-stdin
          docker push ${{ secrets.REGISTRY }}/homestore-backend:${{ github.sha }}

      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app/homestore-backend
            docker pull ${{ secrets.REGISTRY }}/homestore-backend:${{ github.sha }}
            
            # Run migrations before restarting
            docker run --rm \
              --env-file .env.production \
              ${{ secrets.REGISTRY }}/homestore-backend:${{ github.sha }} \
              node -e "require('./dist/compile-migrations').run()"
            
            # Update docker-compose to new image
            sed -i "s|image: .*homestore-backend:.*|image: ${{ secrets.REGISTRY }}/homestore-backend:${{ github.sha }}|g" docker-compose.yml
            docker compose up -d --no-deps server worker
```

---

## Monitoring

### Health Check Endpoint

The import plugin does not add a dedicated health check, but you can probe the template endpoint:

```bash
curl -f http://localhost:3000/import/template \
  -H 'Authorization: Bearer HEALTH_CHECK_TOKEN' \
  --max-time 5 --output /dev/null --silent
echo "Exit code: $?"
# 0 = healthy, non-zero = unhealthy
```

### Key Metrics to Monitor

| Metric | Tool | Alert Threshold |
|---|---|---|
| Import job queue depth | Custom query | > 10 pending jobs |
| Failed import jobs (last 24h) | Custom query | > 0 |
| Worker process memory | PM2 / Kubernetes | > 80% of limit |
| Temp disk usage | Node exporter | > 70% |
| PostgreSQL active connections | pg_stat_activity | > 80% of max_connections |
| Import duration (P95) | Application logs | > 10 min per 1k rows |

### PostgreSQL Monitoring Queries

```sql
-- Jobs currently processing
SELECT id, file_name, progress, started_at,
       EXTRACT(EPOCH FROM (NOW() - started_at)) AS duration_seconds
FROM import_job
WHERE status = 'PROCESSING';

-- Failed imports in last 24 hours
SELECT COUNT(*) AS failed_imports
FROM import_job
WHERE status = 'FAILED'
  AND created_at > NOW() - INTERVAL '24 hours';

-- Average import duration by mode
SELECT mode,
       AVG(duration_ms) / 1000.0 AS avg_duration_seconds,
       COUNT(*) AS total_jobs
FROM import_job
WHERE status = 'COMPLETED'
  AND duration_ms IS NOT NULL
GROUP BY mode;
```

---

## Logging

### Log Format

Vendure uses the NestJS logger. Import-related log messages are prefixed:

```
[ImportService]          ← Main orchestrator logs
[ExcelParserService]     ← Parser warnings
[AssetMappingService]    ← Image mapping logs
[ImportHistoryService]   ← Query service logs
```

### Key Log Events

| Event | Level | Message Example |
|---|---|---|
| Job started | INFO | `Import job abc123 started processing` |
| Batch complete | DEBUG | `Batch 5/200 complete: 50 rows processed` |
| Row error | WARN | `Row 47: SKU ST1234 - slug validation failed` |
| Job complete | INFO | `Import job abc123 completed: 248 success, 2 failed` |
| Fatal error | ERROR | `Import job abc123 failed: Cannot read file` |
| Asset upload fail | ERROR | `Failed to upload asset ST1234.jpg: ENOENT` |

### Log Rotation (PM2)

```bash
# Install PM2 log rotation
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'  # Daily at midnight
```

---

## Backup Recommendations

### Database

```bash
# Daily backup of import tables
pg_dump vendure \
  --table=import_job \
  --table=import_log \
  --format=custom \
  --file="/backups/import-$(date +%Y%m%d).dump"

# Full database backup
pg_dump vendure --format=custom --file="/backups/vendure-$(date +%Y%m%d).dump"
```

### Asset Storage

```bash
# Sync assets to S3
aws s3 sync /app/static/assets s3://your-bucket/assets/ \
  --delete \
  --storage-class STANDARD_IA

# Or use rclone for any S3-compatible storage
rclone sync /app/static/assets remote:bucket/assets
```

### Import Log Retention

Old import logs can accumulate over time. Implement a periodic cleanup:

```sql
-- Delete import jobs older than 90 days (logs cascade-delete)
DELETE FROM import_job
WHERE created_at < NOW() - INTERVAL '90 days'
  AND status IN ('COMPLETED', 'FAILED', 'CANCELLED');
```

Schedule as a cron job:

```bash
# crontab -e
# Run cleanup every Sunday at 2 AM
0 2 * * 0 psql -d vendure -c "DELETE FROM import_job WHERE created_at < NOW() - INTERVAL '90 days' AND status IN ('COMPLETED', 'FAILED', 'CANCELLED');"
```
