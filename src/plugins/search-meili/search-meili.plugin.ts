import { VendurePlugin, PluginCommonModule, Logger } from '@vendure/core';
import gql from 'graphql-tag';
import { MeiliSyncListener } from './sync/event.listener';
import { MeiliInitialSyncService } from './sync/initial-sync.service';
import { MeiliQueueService } from './sync/meili-queue.service';
import { ReindexWatcherService } from './sync/reindex-watcher.service';
import { AdminSearchResolver } from './api/admin.resolver';
import { MeiliController } from './api/meili.controller';
import { MeiliClientService } from './meili.client';
import { MeiliHealthService } from './services/meili-health.service';
import { MeiliAnalyticsService } from './services/meili-analytics.service';
import { MeiliSettingsService } from './services/meili-settings.service';
import { SearchMeiliConfig } from './entities/search-meili-config.entity';
import { MeiliSearchStrategy } from './meili-search-strategy';

const adminSchema = gql`
  type MeiliHealthStatus {
    status: String!
    isHealthy: Boolean!
    version: String
    dbSizeBytes: Float!
    lastUpdated: String!
  }

  type MeiliIndexStats {
    indexName: String!
    documentCount: Int!
    isIndexing: Boolean!
  }

  type MeiliRecentTask {
    uid: Int!
    type: String!
    status: String!
    duration: String
    enqueuedAt: String!
    startedAt: String
    finishedAt: String
  }

  type MeiliTaskStats {
    totalTasks: Int!
    pendingTasks: Int!
    processingTasks: Int!
    failedTasks: Int!
    succeededTasks: Int!
    enqueuedTasks: Int!
    recentTasks: [MeiliRecentTask!]!
  }

  type SearchTermStat {
    term: String!
    count: Float!
  }

  type MeiliAnalytics {
    totalSearchRequests: Float!
    topSearchTerms: [SearchTermStat!]!
    emptyResultTerms: [SearchTermStat!]!
    failedSyncCount: Float!
    lastSyncTime: String
  }

  type MeiliSyncProgress {
    total: Int!
    indexed: Int!
    failed: Int!
    inProgress: Boolean!
    startedAt: String
    completedAt: String
    lastError: String
  }

  type MeiliMonitoringResult {
    health: MeiliHealthStatus!
    indexStats: MeiliIndexStats!
    taskStats: MeiliTaskStats!
    analytics: MeiliAnalytics!
    syncProgress: MeiliSyncProgress!
  }

  type MeiliSettingsResult {
    searchableAttributes: [String!]!
    filterableAttributes: [String!]!
    sortableAttributes: [String!]!
    synonyms: String!
    stopWords: [String!]!
    rankingRules: [String!]!
    typoToleranceEnabled: Boolean!
    typoOneTypo: Int!
    typoTwoTypos: Int!
  }

  input MeiliSettingsInput {
    searchableAttributes: [String!]
    filterableAttributes: [String!]
    sortableAttributes: [String!]
    synonyms: String
    stopWords: [String!]
    rankingRules: [String!]
    typoToleranceEnabled: Boolean
    typoOneTypo: Int
    typoTwoTypos: Int
  }

  extend type Query {
    meiliMonitoring: MeiliMonitoringResult!
    meiliSettings: MeiliSettingsResult!
  }

  extend type Mutation {
    runMeiliInitialSync: Boolean!
    meiliForceSync: Boolean!
    "Run a full reindex inline on the server process (bypassing the worker job queue). Returns immediately; sync runs in the background. Use as a fallback when worker queue is not delivering jobs."
    meiliRunSyncInline: Boolean!
    meiliClearIndex: Boolean!
    updateMeiliSettings(input: MeiliSettingsInput!): MeiliSettingsResult!
    meiliResetAnalytics: Boolean!
    syncMeilisearchNow: Boolean!
  }
`;

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [SearchMeiliConfig],
  providers: [
    MeiliClientService,
    MeiliAnalyticsService,
    MeiliInitialSyncService,
    MeiliQueueService,
    MeiliSyncListener,
    MeiliHealthService,
    MeiliSettingsService,
    ReindexWatcherService,
  ],
  exports: [MeiliAnalyticsService],
  controllers: [MeiliController],
  adminApiExtensions: {
    schema: adminSchema,
    resolvers: [AdminSearchResolver],
  },
  dashboard: {
    location: './dashboard',
  },
  compatibility: '^3.0.0',
})
export class SearchMeiliPlugin {
  constructor() {
    Logger.info('SearchMeiliPlugin initialized', 'SearchMeiliPlugin');
  }
}
