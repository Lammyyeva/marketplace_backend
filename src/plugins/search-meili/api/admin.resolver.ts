import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { Allow, Ctx, Permission, Logger, RequestContext } from '@vendure/core';
import { MeiliInitialSyncService } from '../sync/initial-sync.service';
import { MeiliQueueService } from '../sync/meili-queue.service';
import { MeiliHealthService } from '../services/meili-health.service';
import { MeiliAnalyticsService } from '../services/meili-analytics.service';
import { MeiliSettingsService } from '../services/meili-settings.service';

@Resolver()
export class AdminSearchResolver {
  constructor(
    private readonly syncService: MeiliInitialSyncService,
    private readonly queueService: MeiliQueueService,
    private readonly healthService: MeiliHealthService,
    private readonly analyticsService: MeiliAnalyticsService,
    private readonly settingsService: MeiliSettingsService,
  ) {}

  @Query()
  @Allow(Permission.ReadCatalog)
  async meiliMonitoring() {
    const [health, indexStats, taskStats, analytics] = await Promise.all([
      this.healthService.getHealth(),
      this.healthService.getIndexStats(),
      this.healthService.getTaskSummary(),
      this.analyticsService.getAllAnalytics(),
    ]);

    const syncProgress = this.syncService.getSyncProgress();

    return {
      health: {
        status: health.status,
        isHealthy: health.isHealthy,
        version: health.version,
        dbSizeBytes: health.dbSizeBytes,
        lastUpdated: health.lastUpdated,
      },
      indexStats: {
        indexName: indexStats.indexName,
        documentCount: indexStats.documentCount,
        isIndexing: indexStats.isIndexing,
      },
      taskStats: {
        totalTasks: taskStats.totalTasks,
        pendingTasks: taskStats.pendingTasks,
        processingTasks: taskStats.processingTasks,
        failedTasks: taskStats.failedTasks,
        succeededTasks: taskStats.succeededTasks,
        enqueuedTasks: taskStats.enqueuedTasks,
        recentTasks: taskStats.recentTasks,
      },
      analytics: {
        totalSearchRequests: analytics.totalSearchRequests,
        topSearchTerms: analytics.topSearchTerms,
        emptyResultTerms: analytics.emptyResultTerms,
        failedSyncCount: analytics.failedSyncCount,
        lastSyncTime: analytics.lastSyncTime,
      },
      syncProgress: {
        total: syncProgress.total,
        indexed: syncProgress.indexed,
        failed: syncProgress.failed,
        inProgress: syncProgress.inProgress,
        startedAt: syncProgress.startedAt,
        completedAt: syncProgress.completedAt,
        lastError: syncProgress.lastError,
      },
    };
  }

  @Query()
  @Allow(Permission.ReadCatalog)
  async meiliSettings() {
    const settings = await this.settingsService.getIndexSettings();
    return {
      searchableAttributes: settings.searchableAttributes,
      filterableAttributes: settings.filterableAttributes,
      sortableAttributes: settings.sortableAttributes,
      synonyms: JSON.stringify(settings.synonyms),
      stopWords: settings.stopWords,
      rankingRules: settings.rankingRules,
      typoToleranceEnabled: settings.typoTolerance.enabled,
      typoOneTypo: settings.typoTolerance.minWordSizeForTypos.oneTypo,
      typoTwoTypos: settings.typoTolerance.minWordSizeForTypos.twoTypos,
    };
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async syncMeilisearchNow(@Ctx() ctx: RequestContext): Promise<boolean> {
    Logger.info('syncMeilisearchNow resolver called', 'SearchMeiliPlugin');
    // Enqueue via job queue
    await this.queueService.enqueueFullSync().catch(err => {
      Logger.error(`Meili full sync enqueue failed: ${err?.message ?? String(err)}`, 'SearchMeiliPlugin', err?.stack);
    });
    return true;
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async runMeiliInitialSync(): Promise<boolean> {
    const current = this.syncService.getSyncProgress();
    Logger.info(
      `[MeiliSync] runMeiliInitialSync triggered — inProgress=${current.inProgress}, ` +
      `indexed=${current.indexed}/${current.total}`,
      'SearchMeiliPlugin'
    );
    await this.queueService.enqueueFullSync().catch((err: any) => {
      Logger.error(`[MeiliSync] Failed to enqueue full-sync: ${err?.message}`, 'SearchMeiliPlugin', err?.stack);
    });
    return true;
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async meiliForceSync(): Promise<boolean> {
    const current = this.syncService.getSyncProgress();
    Logger.info(
      `[MeiliSync] meiliForceSync triggered — inProgress=${current.inProgress}, ` +
      `indexed=${current.indexed}/${current.total}`,
      'SearchMeiliPlugin'
    );
    await this.queueService.enqueueFullSync().catch((err: any) => {
      Logger.error(`[MeiliSync] Failed to enqueue force-sync: ${err?.message}`, 'SearchMeiliPlugin', err?.stack);
    });
    return true;
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async meiliRunSyncInline(): Promise<boolean> {
    const current = this.syncService.getSyncProgress();
    Logger.warn(
      `[MeiliSync] meiliRunSyncInline triggered — IN-PROCESS sync (bypasses worker). ` +
      `inProgress=${current.inProgress}, indexed=${current.indexed}/${current.total}`,
      'SearchMeiliPlugin'
    );
    if (current.inProgress) {
      Logger.warn('[MeiliSync] Sync already running — refusing to start a second one', 'SearchMeiliPlugin');
      return false;
    }
    setImmediate(() => {
      this.syncService.runFullSync().catch((err: any) => {
        Logger.error(
          `[MeiliSync] Inline sync FAILED: ${err?.message}`,
          'SearchMeiliPlugin',
          err?.stack,
        );
      });
    });
    return true;
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async meiliClearIndex(): Promise<boolean> {
    Logger.info('[MeiliSync] meiliClearIndex triggered', 'SearchMeiliPlugin');
    await this.syncService.clearIndex();
    return true;
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async updateMeiliSettings(@Args('input') input: any) {
    const synonymsObj = input.synonyms ? JSON.parse(input.synonyms) : undefined;
    const updated = await this.settingsService.updateSettings({
      ...input,
      synonyms: synonymsObj,
    });
    return {
      searchableAttributes: updated.searchableAttributes,
      filterableAttributes: updated.filterableAttributes,
      sortableAttributes: updated.sortableAttributes,
      synonyms: JSON.stringify(updated.synonyms),
      stopWords: updated.stopWords,
      rankingRules: updated.rankingRules,
      typoToleranceEnabled: updated.typoTolerance.enabled,
      typoOneTypo: updated.typoTolerance.minWordSizeForTypos.oneTypo,
      typoTwoTypos: updated.typoTolerance.minWordSizeForTypos.twoTypos,
    };
  }

  @Mutation()
  @Allow(Permission.UpdateCatalog)
  async meiliResetAnalytics(): Promise<boolean> {
    await this.analyticsService.resetAnalytics();
    return true;
  }
}
