# ── Build stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install ALL dependencies (including devDeps: TypeScript, concurrently, etc.)
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Compile TypeScript → dist/
RUN npm run build:server

# Strip devDependencies for the runtime layer
RUN npm prune --production

# ── Runtime stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /usr/src/app

# Copy compiled output and pruned node_modules from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/static ./static
COPY --from=builder /usr/src/app/docs ./docs

RUN mkdir -p ./logs

ENV NODE_ENV=production
ENV APP_ENV=production

# Server and worker are started separately (e.g. via docker-compose or PM2).
# Default CMD starts the server; override with "node dist/index-worker.js" for worker.
CMD ["node", "dist/index.js"]
