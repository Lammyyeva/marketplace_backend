import { graphql } from '@vendure/dashboard';

export const GET_MEILI_MONITORING = graphql(`
  query GetMeiliMonitoring {
    meiliMonitoring {
      health {
        status
        isHealthy
        version
        dbSizeBytes
        lastUpdated
      }
      indexStats {
        indexName
        documentCount
        isIndexing
      }
      taskStats {
        totalTasks
        pendingTasks
        processingTasks
        failedTasks
        succeededTasks
        enqueuedTasks
        recentTasks {
          uid
          type
          status
          duration
          enqueuedAt
          startedAt
          finishedAt
        }
      }
      analytics {
        totalSearchRequests
        topSearchTerms {
          term
          count
        }
        emptyResultTerms {
          term
          count
        }
        failedSyncCount
        lastSyncTime
      }
      syncProgress {
        total
        indexed
        failed
        inProgress
        startedAt
        completedAt
      }
    }
  }
`);

export const GET_MEILI_SETTINGS = graphql(`
  query GetMeiliSettings {
    meiliSettings {
      searchableAttributes
      filterableAttributes
      sortableAttributes
      synonyms
      stopWords
      rankingRules
      typoToleranceEnabled
      typoOneTypo
      typoTwoTypos
    }
  }
`);

export const RUN_MEILI_INITIAL_SYNC = graphql(`
  mutation RunMeiliInitialSync {
    runMeiliInitialSync
  }
`);

export const MEILI_FORCE_SYNC = graphql(`
  mutation MeiliForceSync {
    meiliForceSync
  }
`);

export const MEILI_RUN_SYNC_INLINE = graphql(`
  mutation MeiliRunSyncInline {
    meiliRunSyncInline
  }
`);

export const MEILI_CLEAR_INDEX = graphql(`
  mutation MeiliClearIndex {
    meiliClearIndex
  }
`);

export const MEILI_RESET_ANALYTICS = graphql(`
  mutation MeiliResetAnalytics {
    meiliResetAnalytics
  }
`);

export const UPDATE_MEILI_SETTINGS = graphql(`
  mutation UpdateMeiliSettings($input: MeiliSettingsInput!) {
    updateMeiliSettings(input: $input) {
      searchableAttributes
      filterableAttributes
      sortableAttributes
      synonyms
      stopWords
      rankingRules
      typoToleranceEnabled
      typoOneTypo
      typoTwoTypos
    }
  }
`);
