import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const MeilisearchLib = require('meilisearch');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MeiliClient = any;

const HEALTH_CHECK_INTERVAL_MS = 30_000; // refresh health every 30s

@Injectable()
export class MeiliClientService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(MeiliClientService.name);
  private client: MeiliClient;
  private healthy = false;
  private healthInterval: ReturnType<typeof setInterval> | null = null;

  private readonly host: string;
  private readonly apiKey: string | undefined;

  constructor() {
    this.host = process.env.MEILI_HOST || 'http://localhost:7700';
    this.apiKey = process.env.MEILI_MASTER_KEY;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.client = new MeilisearchLib.Meilisearch({ host: this.host, apiKey: this.apiKey });
  }

  async onApplicationBootstrap() {
    this.logger.log(`Connecting to Meilisearch at ${this.host}...`);
    await this.waitForHealthy(3, 5000);

    // Periodic health refresh so isHealthy() stays accurate after transient failures
    this.healthInterval = setInterval(() => {
      this.checkHealth().catch(() => {});
    }, HEALTH_CHECK_INTERVAL_MS);
  }

  onApplicationShutdown() {
    if (this.healthInterval) {
      clearInterval(this.healthInterval);
      this.healthInterval = null;
    }
  }

  getClient(): MeiliClient {
    return this.client;
  }

  isHealthy(): boolean {
    return this.healthy;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const result = await this.client.health();
      this.healthy = (result as any).status === 'available';
      if (this.healthy) {
        this.logger.debug('Meilisearch health check: available');
      }
      return this.healthy;
    } catch {
      if (this.healthy) {
        this.logger.warn('Meilisearch became unavailable');
      }
      this.healthy = false;
      return false;
    }
  }

  private async waitForHealthy(maxRetries: number, intervalMs: number): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const ok = await this.checkHealth();
      if (ok) {
        this.logger.log(`Meilisearch connected at ${this.host}`);
        return;
      }
      this.logger.warn(
        `Meilisearch not ready (attempt ${attempt}/${maxRetries}), retrying in ${intervalMs / 1000}s...`,
      );
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, intervalMs));
      }
    }
    // Do NOT throw — allow the server to start even if Meilisearch is down.
    // Indexing will fail naturally and job queue will retry.
    this.logger.error(
      `Meilisearch unreachable after ${maxRetries} attempts. ` +
        `Search will be degraded until Meilisearch recovers. ` +
        `Health check runs every ${HEALTH_CHECK_INTERVAL_MS / 1000}s.`,
    );
  }
}
