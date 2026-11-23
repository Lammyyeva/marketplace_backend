import { useState } from 'react';
import {
    Button,
    DataTable,
    Page,
    PageLayout,
    PageBlock,
    PageTitle,
    PageActionBar,
    PageActionBarRight,
} from '@vendure/dashboard';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import {
    RefreshCw,
    CheckCircle2,
    XCircle,
    Clock,
    Loader2,
    Ban,
    ExternalLink,
    FileDown,
    FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';

const BASE_URL = '/import';

async function fetchJobs() {
    const res = await fetch(`${BASE_URL}/jobs`, { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to load import jobs');
    return res.json();
}

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
    PENDING: { icon: <Clock className="w-4 h-4" />, color: 'text-amber-400' },
    PROCESSING: { icon: <Loader2 className="w-4 h-4 animate-spin" />, color: 'text-cyan-400' },
    COMPLETED: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400' },
    FAILED: { icon: <XCircle className="w-4 h-4" />, color: 'text-rose-400' },
    CANCELLED: { icon: <Ban className="w-4 h-4" />, color: 'text-slate-900 dark:text-slate-400' },
};

export function ImportHistoryPage({ route }: { route: any }) {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ['import-jobs'],
        queryFn: fetchJobs,
        refetchInterval: 5000,
    });

    const jobs: any[] = (data as any)?.items ?? [];

    const handleDownloadJsonReport = (jobId: string) => {
        window.open(`${BASE_URL}/jobs/${jobId}/error-report`, '_blank');
    };

    const handleDownloadExcelReport = (jobId: string) => {
        window.open(`${BASE_URL}/jobs/${jobId}/error-report-excel`, '_blank');
    };

    if (error) {
        toast.error('Failed to load import history');
    }

    return (
        <Page pageId="import-history">
            <PageTitle>Import History</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <Button
                        variant="outline"
                        className="h-9 gap-2 text-xs border-slate-600"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['import-jobs'] })}
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh
                    </Button>
                </PageActionBarRight>
            </PageActionBar>

            <PageLayout>
                <PageBlock column="main" blockId="import-history-list">
                    <DataTable
                        data={jobs}
                        isLoading={isLoading}
                        className="border-none shadow-none rounded-none"
                        columns={[
                            {
                                id: 'status',
                                header: () => <span className="font-bold text-slate-900 dark:text-slate-200">Status</span>,
                                cell: ({ row }: any) => {
                                    const job = row.original;
                                    const cfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG['PENDING'];
                                    return (
                                        <div className={`flex items-center gap-1.5 text-xs font-semibold ${cfg.color}`}>
                                            {cfg.icon}
                                            {job.status}
                                        </div>
                                    );
                                },
                            },
                            {
                                id: 'fileName',
                                header: () => <span className="font-bold text-slate-900 dark:text-slate-200">File</span>,
                                cell: ({ row }: any) => (
                                    <span className="text-xs text-slate-900 dark:text-slate-300 font-mono font-bold truncate max-w-xs block">
                                        {row.original.fileName}
                                    </span>
                                ),
                            },
                            {
                                id: 'mode',
                                header: () => <span className="font-bold text-slate-900 dark:text-slate-200">Mode</span>,
                                cell: ({ row }: any) => (
                                    <span className="text-xs font-bold text-slate-900 dark:text-slate-300">
                                        {row.original.mode}
                                        {row.original.dryRun && (
                                            <span className="ml-1.5 px-1 py-0.5 text-[9px] rounded bg-amber-500/20 text-amber-400 font-bold uppercase">
                                                DRY
                                            </span>
                                        )}
                                    </span>
                                ),
                            },
                            {
                                id: 'rows',
                                header: () => <span className="font-bold text-slate-900 dark:text-slate-200">Rows</span>,
                                cell: ({ row }: any) => {
                                    const j = row.original;
                                    return (
                                        <div className="flex gap-3 text-xs font-bold">
                                            <span className="text-emerald-500 dark:text-emerald-400">✓ {j.successCount}</span>
                                            <span className="text-rose-500 dark:text-rose-400">✗ {j.failedCount}</span>
                                            <span className="text-slate-900 dark:text-slate-400">~ {j.skippedCount}</span>
                                        </div>
                                    );
                                },
                            },
                            {
                                id: 'progress',
                                header: () => <span className="font-bold text-slate-900 dark:text-slate-200">Progress</span>,
                                cell: ({ row }: any) => {
                                    const j = row.original;
                                    return (
                                        <div className="flex items-center gap-2 min-w-24">
                                            <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
                                                <div
                                                    className={`h-full rounded-full ${
                                                        j.status === 'FAILED' ? 'bg-rose-500' :
                                                        j.status === 'COMPLETED' ? 'bg-emerald-500' :
                                                        'bg-cyan-500'
                                                    }`}
                                                    style={{ width: `${j.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-slate-900 dark:text-slate-500 w-8 text-right tabular-nums font-bold">
                                                {j.progress}%
                                            </span>
                                        </div>
                                    );
                                },
                            },
                            {
                                id: 'duration',
                                header: () => <span className="font-bold text-slate-900 dark:text-slate-200">Duration</span>,
                                cell: ({ row }: any) => {
                                    const ms = row.original.durationMs;
                                    if (!ms) return <span className="text-xs text-slate-900 dark:text-slate-500 font-bold">—</span>;
                                    return (
                                        <span className="text-xs text-slate-900 dark:text-slate-300 tabular-nums font-bold">
                                            {ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`}
                                        </span>
                                    );
                                },
                            },
                            {
                                id: 'initiatedBy',
                                header: () => <span className="font-bold text-slate-900 dark:text-slate-200">User</span>,
                                cell: ({ row }: any) => (
                                    <span className="text-xs text-slate-900 dark:text-slate-400 font-bold">{row.original.initiatedBy}</span>
                                ),
                            },
                            {
                                id: 'createdAt',
                                header: () => <span className="font-bold text-slate-900 dark:text-slate-200">Date</span>,
                                cell: ({ row }: any) => (
                                    <span className="text-xs text-slate-900 dark:text-slate-400 font-bold">
                                        {new Date(row.original.createdAt).toLocaleString()}
                                    </span>
                                ),
                            },
                            {
                                id: 'actions',
                                header: '',
                                cell: ({ row }: any) => {
                                    const j = row.original;
                                    return (
                                        <div className="flex items-center gap-1 justify-end">
                                            <Link
                                                to={`/catalog/import-history/${j.id}`}
                                                className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                                                title="View details"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Link>
                                            {(j.status === 'COMPLETED' || j.status === 'FAILED') && (
                                                <>
                                                    <button
                                                        onClick={() => handleDownloadExcelReport(j.id)}
                                                        className="p-1.5 rounded hover:bg-emerald-800/40 text-emerald-500 hover:text-emerald-300 transition-colors"
                                                        title="Download Excel report (.xlsx) — colour-coded results with all rows"
                                                    >
                                                        <FileSpreadsheet className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownloadJsonReport(j.id)}
                                                        className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                                                        title="Download JSON error report"
                                                    >
                                                        <FileDown className="w-3.5 h-3.5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    );
                                },
                            },
                        ]}
                    />

                    {!isLoading && jobs.length === 0 && (
                        <div className="py-16 text-center text-slate-900 dark:text-slate-500 text-sm font-bold">
                            No import jobs found. Start by uploading a product Excel file.
                        </div>
                    )}
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
