import {
  Page,
  PageLayout,
  PageBlock,
  PageTitle,
  PageActionBar,
  PageActionBarRight,
  Button,
  api,
} from '@vendure/dashboard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BarChart2,
  RefreshCw,
  Trash2,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Search,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  GET_MEILI_MONITORING,
  RUN_MEILI_INITIAL_SYNC,
  MEILI_FORCE_SYNC,
  MEILI_RUN_SYNC_INLINE,
  MEILI_CLEAR_INDEX,
  MEILI_RESET_ANALYTICS,
} from '../queries/search-admin.queries';
import { useAdminTranslation } from '../../../../common/dashboard/use-admin-translation';
import en from '../translations/en.json';
import ru from '../translations/ru.json';
import tk from '../translations/tk.json';

export function SearchMonitoringPage({ route }: { route: any }) {
  const queryClient = useQueryClient();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { t } = useAdminTranslation({ en, ru, tk });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['meili-monitoring'],
    queryFn: () => api.query(GET_MEILI_MONITORING),
    refetchInterval: autoRefresh ? 30000 : false,
  });

  const monitoring = (data as any)?.meiliMonitoring;

  const reindexMutation = useMutation({
    mutationFn: () => api.mutate(RUN_MEILI_INITIAL_SYNC),
    onSuccess: () => {
      toast.success('Reindex started in background');
      queryClient.invalidateQueries({ queryKey: ['meili-monitoring'] });
    },
    onError: (e: any) => toast.error(`Reindex failed: ${e.message}`),
  });

  const forceSyncMutation = useMutation({
    mutationFn: () => api.mutate(MEILI_FORCE_SYNC),
    onSuccess: () => {
      toast.success('Force sync enqueued (via worker queue)');
      queryClient.invalidateQueries({ queryKey: ['meili-monitoring'] });
    },
    onError: (e: any) => toast.error(`Force sync failed: ${e.message}`),
  });

  // Fallback: runs the sync IN-PROCESS on the server, bypassing the worker
  // queue. Use when "Force Sync" appears to do nothing (e.g. worker not
  // consuming jobs).
  const inlineSyncMutation = useMutation({
    mutationFn: () => api.mutate(MEILI_RUN_SYNC_INLINE),
    onSuccess: (res: any) => {
      if (res?.meiliRunSyncInline === false) {
        toast.error('A sync is already running — wait for it to finish');
      } else {
        toast.success('In-process sync started — watch the server logs');
      }
      queryClient.invalidateQueries({ queryKey: ['meili-monitoring'] });
    },
    onError: (e: any) => toast.error(`Inline sync failed: ${e.message}`),
  });

  const clearIndexMutation = useMutation({
    mutationFn: () => api.mutate(MEILI_CLEAR_INDEX),
    onSuccess: () => {
      toast.success('Index cleared');
      queryClient.invalidateQueries({ queryKey: ['meili-monitoring'] });
    },
    onError: (e: any) => toast.error(`Clear failed: ${e.message}`),
  });

  const resetAnalyticsMutation = useMutation({
    mutationFn: () => api.mutate(MEILI_RESET_ANALYTICS),
    onSuccess: () => {
      toast.success('Analytics reset');
      queryClient.invalidateQueries({ queryKey: ['meili-monitoring'] });
    },
  });

  const handleClearIndex = () => {
    if (window.confirm('Are you sure? This will delete ALL indexed products from Meilisearch.')) {
      clearIndexMutation.mutate();
    }
  };

  const health = monitoring?.health;
  const indexStats = monitoring?.indexStats;
  const taskStats = monitoring?.taskStats;
  const analytics = monitoring?.analytics;
  const syncProgress = monitoring?.syncProgress;

  const isHealthy = health?.isHealthy;
  const dbSizeMB = health?.dbSizeBytes ? (health.dbSizeBytes / 1024 / 1024).toFixed(2) : '0';

  return (
    <Page pageId="search-monitoring">
      <PageTitle>{t("search-monitoring.title")}</PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={e => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              Auto-refresh (30s)
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="h-8 gap-1.5 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t("search-monitoring.actions.refresh")}
            </Button>
            <Button
              size="sm"
              onClick={() => reindexMutation.mutate()}
              disabled={reindexMutation.isPending || syncProgress?.inProgress}
              className="h-8 gap-1.5 text-xs bg-cyan-500 hover:bg-cyan-600 text-white border-none"
            >
              <Database className="h-3.5 w-3.5" />
              {t("search-monitoring.actions.reindexAll")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => forceSyncMutation.mutate()}
              disabled={forceSyncMutation.isPending}
              className="h-8 gap-1.5 text-xs"
              title="Enqueue a full reindex via the worker job queue"
            >
              <Zap className="h-3.5 w-3.5" />
              {t("search-monitoring.actions.forceSync")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => inlineSyncMutation.mutate()}
              disabled={inlineSyncMutation.isPending || syncProgress?.inProgress}
              className="h-8 gap-1.5 text-xs border-amber-400 text-amber-700 hover:bg-amber-50"
              title="Fallback: run the sync directly on the server process (bypasses worker queue)"
            >
              <Activity className="h-3.5 w-3.5" />
              {t("search-monitoring.actions.syncInline")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClearIndex}
              disabled={clearIndexMutation.isPending}
              className="h-8 gap-1.5 text-xs text-rose-600 border-rose-300 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("search-monitoring.actions.clearIndex")}
            </Button>
          </div>
        </PageActionBarRight>
      </PageActionBar>

      <PageLayout>
        {/* Important explainer — prevents confusion with Vendure's standard
            "Rebuild Search Index" button which only updates the unused
            SQL search_index_item table. */}
        <PageBlock column="main" blockId="meili-explainer">
          <div className="px-6 py-4 flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-100">
              <strong>To reindex Meilisearch, use the buttons on THIS page</strong>{' '}
              (Reindex All / Force Sync / Sync Now). The standard Vendure
              admin <em>“Rebuild Search Index”</em> button only updates the
              internal SQL <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">search_index_item</code>{' '}
              table and does <strong>not</strong> touch Meilisearch — clicking it
              will appear to succeed but the index document count below will not
              change.
            </div>
          </div>
        </PageBlock>

        {/* Status Bar */}
        <PageBlock column="main" blockId="meili-status">
          <div className="px-6 py-4 flex items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                isHealthy
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
              }`}>
                {isHealthy ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                Meilisearch {isHealthy ? 'Online' : 'Offline'}
              </div>
              {health?.version && (
                <span className="text-xs text-slate-500">v{health.version}</span>
              )}
              {syncProgress?.inProgress && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 text-sm font-semibold">
                  <Activity className="h-4 w-4 animate-pulse" />
                  Syncing... ({syncProgress.indexed}/{syncProgress.total})
                </div>
              )}
            </div>
            <span className="text-xs text-slate-400">
              {health?.lastUpdated && `Last checked: ${new Date(health.lastUpdated).toLocaleTimeString()}`}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6">
            <MetricCard
              icon={<Database className="h-5 w-5 text-cyan-500" />}
              label="Indexed Products"
              value={indexStats?.documentCount?.toLocaleString() ?? '—'}
              sub={indexStats?.isIndexing ? 'Indexing...' : 'documents'}
            />
            <MetricCard
              icon={<Search className="h-5 w-5 text-violet-500" />}
              label="Total Searches"
              value={analytics?.totalSearchRequests?.toLocaleString() ?? '0'}
              sub="all time"
            />
            <MetricCard
              icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
              label="Failed Syncs"
              value={analytics?.failedSyncCount ?? '0'}
              sub="since reset"
            />
            <MetricCard
              icon={<Clock className="h-5 w-5 text-blue-500" />}
              label="Last Sync"
              value={analytics?.lastSyncTime
                ? new Date(analytics.lastSyncTime).toLocaleDateString()
                : 'Never'}
              sub={analytics?.lastSyncTime
                ? new Date(analytics.lastSyncTime).toLocaleTimeString()
                : ''}
            />
            <MetricCard
              icon={<Activity className="h-5 w-5 text-emerald-500" />}
              label="DB Size"
              value={`${dbSizeMB} MB`}
              sub="on disk"
            />
            <MetricCard
              icon={<Zap className="h-5 w-5 text-orange-500" />}
              label="Queue Pending"
              value={taskStats?.enqueuedTasks ?? '0'}
              sub={`${taskStats?.processingTasks ?? 0} processing`}
            />
          </div>
        </PageBlock>

        {/* Sync Progress */}
        {syncProgress?.inProgress && (
          <PageBlock column="main" blockId="meili-sync-progress">
            <div className="px-6 py-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-3">Sync Progress</h3>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
                <div
                  className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${syncProgress.total > 0 ? (syncProgress.indexed / syncProgress.total) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{syncProgress.indexed} indexed</span>
                <span>{syncProgress.failed} failed</span>
                <span>{syncProgress.total} total</span>
              </div>
            </div>
          </PageBlock>
        )}

        {/* Top Searched Keywords + Empty Results */}
        <PageBlock column="main" blockId="meili-analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-x divide-slate-200 dark:divide-slate-700/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Top Searched Keywords</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resetAnalyticsMutation.mutate()}
                  className="h-7 text-xs text-slate-400 hover:text-rose-500"
                >
                  Reset
                </Button>
              </div>
              <TermsTable
                terms={analytics?.topSearchTerms || []}
                emptyText="No search data yet"
                color="cyan"
              />
            </div>
            <div className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-4">Empty Result Keywords</h3>
              <TermsTable
                terms={analytics?.emptyResultTerms || []}
                emptyText="No empty results yet"
                color="rose"
              />
            </div>
          </div>
        </PageBlock>

        {/* Task Queue */}
        <PageBlock column="main" blockId="meili-tasks">
          <div className="px-6 py-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-4">Recent Tasks</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700/50">
                    {['UID', 'Type', 'Status', 'Duration', 'Enqueued At'].map(h => (
                      <th key={h} className="text-left py-2 px-3 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(taskStats?.recentTasks || []).map((task: any) => (
                    <tr key={task.uid} className="border-b border-slate-100 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-2 px-3 font-mono text-slate-900 dark:text-slate-200">{task.uid}</td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{task.type}</td>
                      <td className="py-2 px-3">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400 font-mono">
                        {task.duration || '—'}
                      </td>
                      <td className="py-2 px-3 text-slate-500">
                        {task.enqueuedAt ? new Date(task.enqueuedAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                  {!taskStats?.recentTasks?.length && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        No recent tasks
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}

function MetricCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
        {value}
      </div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  );
}

function TermsTable({ terms, emptyText, color }: { terms: { term: string; count: number }[]; emptyText: string; color: 'cyan' | 'rose' }) {
  if (!terms.length) {
    return <p className="text-xs text-slate-400 py-4">{emptyText}</p>;
  }
  const max = terms[0]?.count || 1;
  return (
    <div className="space-y-1.5">
      {terms.slice(0, 10).map(({ term, count }) => (
        <div key={term} className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between mb-0.5">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{term}</span>
              <span className="text-xs text-slate-400 ml-2">{count}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1">
              <div
                className={`h-1 rounded-full ${color === 'cyan' ? 'bg-cyan-500' : 'bg-rose-500'}`}
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    succeeded: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    failed: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    processing: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    enqueued: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };
  return (
    <span className={`px-1.5 py-0.5 text-[10px] font-bold uppercase rounded border ${styles[status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
      {status}
    </span>
  );
}
