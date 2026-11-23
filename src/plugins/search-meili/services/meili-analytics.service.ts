import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_KEYS } from '../constants';


export interface SearchTermStat {
  term: string;
  count: number;
}

export interface MeiliAnalyticsData {
  totalSearchRequests: number;
  topSearchTerms: SearchTermStat[];
  emptyResultTerms: SearchTermStat[];
  failedSyncCount: number;
  lastSyncTime: string | null;
}

@Injectable()
export class MeiliAnalyticsService {
  private readonly logger = new Logger(MeiliAnalyticsService.name);
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      lazyConnect: true,
    });
    this.redis.on('error', (err) => {
      this.logger.warn(`Redis analytics connection error: ${err.message}`);
    });
  }

  async recordSearch(term: string, resultCount: number): Promise<void> {
    if (!term?.trim()) return;
    const normalizedTerm = term.toLowerCase().trim();
    try {
      await Promise.all([
        this.redis.incr(REDIS_KEYS.TOTAL_SEARCHES),
        this.redis.zincrby(REDIS_KEYS.TOP_TERMS, 1, normalizedTerm),
        resultCount === 0
          ? this.redis.zincrby(REDIS_KEYS.EMPTY_TERMS, 1, normalizedTerm)
          : Promise.resolve(),
      ]);
    } catch (error) {
      this.logger.warn(`Analytics record failed: ${(error as any).message}`);
    }
  }

  async getTopTerms(limit = 20): Promise<SearchTermStat[]> {
    try {
      const results = await this.redis.zrevrange(REDIS_KEYS.TOP_TERMS, 0, limit - 1, 'WITHSCORES');
      return this.parseZrangeWithScores(results);
    } catch {
      return [];
    }
  }

  async getEmptyTerms(limit = 20): Promise<SearchTermStat[]> {
    try {
      const results = await this.redis.zrevrange(REDIS_KEYS.EMPTY_TERMS, 0, limit - 1, 'WITHSCORES');
      return this.parseZrangeWithScores(results);
    } catch {
      return [];
    }
  }

  async getTotalSearchCount(): Promise<number> {
    try {
      const val = await this.redis.get(REDIS_KEYS.TOTAL_SEARCHES);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  }

  async recordSyncFailed(): Promise<void> {
    try {
      await this.redis.incr(REDIS_KEYS.SYNC_FAILED);
    } catch {
      // silent
    }
  }

  async recordSyncSuccess(): Promise<void> {
    try {
      await this.redis.set(REDIS_KEYS.SYNC_LAST, new Date().toISOString());
      await this.redis.set(REDIS_KEYS.SYNC_FAILED, '0');
    } catch {
      // silent
    }
  }

  async getFailedSyncCount(): Promise<number> {
    try {
      const val = await this.redis.get(REDIS_KEYS.SYNC_FAILED);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  }

  async getLastSyncTime(): Promise<string | null> {
    try {
      return await this.redis.get(REDIS_KEYS.SYNC_LAST);
    } catch {
      return null;
    }
  }

  async getAllAnalytics(): Promise<MeiliAnalyticsData> {
    const [total, topTerms, emptyTerms, failedSync, lastSync] = await Promise.all([
      this.getTotalSearchCount(),
      this.getTopTerms(20),
      this.getEmptyTerms(20),
      this.getFailedSyncCount(),
      this.getLastSyncTime(),
    ]);

    return {
      totalSearchRequests: total,
      topSearchTerms: topTerms,
      emptyResultTerms: emptyTerms,
      failedSyncCount: failedSync,
      lastSyncTime: lastSync,
    };
  }

  async resetAnalytics(): Promise<void> {
    try {
      await this.redis.del(
        REDIS_KEYS.TOTAL_SEARCHES,
        REDIS_KEYS.TOP_TERMS,
        REDIS_KEYS.EMPTY_TERMS,
        REDIS_KEYS.SYNC_FAILED,
      );
    } catch (error) {
      this.logger.warn(`Analytics reset failed: ${(error as any).message}`);
    }
  }

  // ─── Cross-process coordination ─────────────────────────────────────────────

  /**
   * Set by server at startup when Meilisearch index appears empty.
   * Read by MeiliQueueService (server) to decide whether to enqueue initial sync.
   */
  async setNeedsInitialSync(needed: boolean): Promise<void> {
    try {
      if (needed) {
        await this.redis.set(REDIS_KEYS.NEEDS_INITIAL_SYNC, '1', 'EX', 3600); // 1 h TTL
      } else {
        await this.redis.del(REDIS_KEYS.NEEDS_INITIAL_SYNC);
      }
    } catch {
      // non-fatal
    }
  }

  async needsInitialSync(): Promise<boolean> {
    try {
      const val = await this.redis.get(REDIS_KEYS.NEEDS_INITIAL_SYNC);
      return val === '1';
    } catch {
      return false;
    }
  }

  private parseZrangeWithScores(results: string[]): SearchTermStat[] {
    const stats: SearchTermStat[] = [];
    for (let i = 0; i < results.length; i += 2) {
      stats.push({ term: results[i], count: parseFloat(results[i + 1]) });
    }
    return stats;
  }
}
