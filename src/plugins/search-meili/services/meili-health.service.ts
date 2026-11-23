import { Injectable, Logger } from '@nestjs/common';
import { MeiliClientService } from '../meili.client';
import { PRODUCT_INDEX, REDIS_KEYS } from '../constants';

export interface MeiliHealthResult {
  status: string;
  isHealthy: boolean;
  version: string | null;
  dbSizeBytes: number;
  lastUpdated: string;
}

export interface MeiliIndexStatsResult {
  indexName: string;
  documentCount: number;
  isIndexing: boolean;
  fieldDistribution: Record<string, number>;
}

export interface MeiliTaskSummary {
  totalTasks: number;
  pendingTasks: number;
  processingTasks: number;
  failedTasks: number;
  succeededTasks: number;
  enqueuedTasks: number;
  recentTasks: RecentTask[];
}

export interface RecentTask {
  uid: number;
  type: string;
  status: string;
  duration: string | null;
  enqueuedAt: string;
  startedAt: string | null;
  finishedAt: string | null;
}

@Injectable()
export class MeiliHealthService {
  private readonly logger = new Logger(MeiliHealthService.name);

  constructor(private readonly clientService: MeiliClientService) {}

  async getHealth(): Promise<MeiliHealthResult> {
    try {
      const client = this.clientService.getClient();
      const [health, version, stats] = await Promise.all([
        client.health().catch(() => ({ status: 'unavailable' })),
        client.getVersion().catch(() => null),
        client.getStats().catch(() => null),
      ]);

      return {
        status: (health as any).status || 'unavailable',
        isHealthy: (health as any).status === 'available',
        version: version ? `${(version as any).pkgVersion}` : null,
        dbSizeBytes: (stats as any)?.databaseSize || 0,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Health check failed: ${(error as any).message}`);
      return {
        status: 'error',
        isHealthy: false,
        version: null,
        dbSizeBytes: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  async getIndexStats(): Promise<MeiliIndexStatsResult> {
    try {
      const index = this.clientService.getClient().index(PRODUCT_INDEX);
      const stats = await index.getStats();
      return {
        indexName: PRODUCT_INDEX,
        documentCount: stats.numberOfDocuments,
        isIndexing: stats.isIndexing,
        fieldDistribution: stats.fieldDistribution || {},
      };
    } catch (error) {
      this.logger.warn(`Index stats failed: ${(error as any).message}`);
      return {
        indexName: PRODUCT_INDEX,
        documentCount: 0,
        isIndexing: false,
        fieldDistribution: {},
      };
    }
  }

  async getTaskSummary(): Promise<MeiliTaskSummary> {
    try {
      const client = this.clientService.getClient();
      // meilisearch v0.57+: getTasks moved to client.tasks.getTasks()
      const tasks = await client.tasks.getTasks({ limit: 50 });

      const items = tasks.results || [];
      const counts = {
        pending: 0,
        processing: 0,
        failed: 0,
        succeeded: 0,
        enqueued: 0,
      };

      for (const t of items) {
        if (t.status === 'enqueued') counts.enqueued++;
        else if (t.status === 'processing') counts.processing++;
        else if (t.status === 'failed') counts.failed++;
        else if (t.status === 'succeeded') counts.succeeded++;
      }

      const recentTasks: RecentTask[] = items.slice(0, 20).map(t => ({
        uid: t.uid,
        type: t.type,
        status: t.status,
        duration: t.duration || null,
        enqueuedAt: t.enqueuedAt ? new Date(t.enqueuedAt).toISOString() : '',
        startedAt: t.startedAt ? new Date(t.startedAt).toISOString() : null,
        finishedAt: t.finishedAt ? new Date(t.finishedAt).toISOString() : null,
      }));

      return {
        totalTasks: items.length,
        pendingTasks: counts.pending,
        processingTasks: counts.processing,
        failedTasks: counts.failed,
        succeededTasks: counts.succeeded,
        enqueuedTasks: counts.enqueued,
        recentTasks,
      };
    } catch (error) {
      this.logger.warn(`Task summary failed: ${(error as any).message}`);
      return {
        totalTasks: 0,
        pendingTasks: 0,
        processingTasks: 0,
        failedTasks: 0,
        succeededTasks: 0,
        enqueuedTasks: 0,
        recentTasks: [],
      };
    }
  }
}
