import {
    Button,
    Page,
    PageLayout,
    PageBlock,
    PageTitle,
    PageActionBar,
    PageActionBarRight,
} from '@vendure/dashboard';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, FileDown, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { ImportProgress } from '../components/ImportProgress';
import { ErrorViewer } from '../components/ErrorViewer';

const BASE_URL = '/import';

async function fetchJob(id: string) {
    const res = await fetch(`${BASE_URL}/jobs/${id}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Job not found');
    return res.json();
}

export function ImportDetailPage({ route }: { route: any }) {
    const { id } = (route?.params ?? {}) as { id: string };

    const { data: job, isLoading, refetch } = useQuery({
        queryKey: ['import-job', id],
        queryFn: () => fetchJob(id),
        refetchInterval: (data: any) =>
            data?.status === 'PROCESSING' || data?.status === 'PENDING' ? 2000 : false,
        enabled: !!id,
    });

    const logs: any[] = (job as any)?.logs ?? [];

    return (
        <Page pageId={`import-detail-${id}`}>
            <PageTitle>
                {(job as any)?.fileName ?? 'Import Job Detail'}
            </PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <Button asChild variant="outline" className="h-9 gap-2 text-xs border-slate-600">
                        <Link to="/catalog/import-history">
                            <ArrowLeft className="w-4 h-4" />
                            Back to History
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-9 gap-2 text-xs border-slate-600"
                        onClick={() => refetch()}
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh
                    </Button>
                    {job && ((job as any).status === 'COMPLETED' || (job as any).status === 'FAILED') && (
                        <>
                            <Button
                                variant="outline"
                                className="h-9 gap-2 text-xs border-emerald-600/50 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500"
                                onClick={() => window.open(`${BASE_URL}/jobs/${id}/error-report-excel`, '_blank')}
                                title="Download colour-coded Excel report with separate sheets per status"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                Excel Report
                            </Button>
                            <Button
                                variant="outline"
                                className="h-9 gap-2 text-xs border-slate-600"
                                onClick={() => window.open(`${BASE_URL}/jobs/${id}/error-report`, '_blank')}
                                title="Download JSON error report"
                            >
                                <FileDown className="w-4 h-4" />
                                JSON Report
                            </Button>
                        </>
                    )}
                </PageActionBarRight>
            </PageActionBar>

            <PageLayout>
                {isLoading ? (
                    <PageBlock column="main" blockId="loading">
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                        </div>
                    </PageBlock>
                ) : job ? (
                    <>
                        {/* Job meta */}
                        <PageBlock column="main" blockId="job-progress">
                            <div className="p-6">
                                <ImportProgress job={job as any} />
                            </div>
                        </PageBlock>

                        {/* Log viewer */}
                        {logs.length > 0 && (
                            <PageBlock column="main" blockId="job-logs">
                                <div className="p-6 space-y-4">
                                    <h3 className="text-sm font-bold text-slate-200">
                                        Import Log ({logs.length} entries)
                                    </h3>
                                    <ErrorViewer
                                        logs={logs}
                                        jobId={id}
                                        onDownloadExcelReport={
                                            (job as any).status === 'COMPLETED' || (job as any).status === 'FAILED'
                                                ? () => window.open(`${BASE_URL}/jobs/${id}/error-report-excel`, '_blank')
                                                : undefined
                                        }
                                        onDownloadReport={() =>
                                            window.open(`${BASE_URL}/jobs/${id}/error-report`, '_blank')
                                        }
                                    />
                                </div>
                            </PageBlock>
                        )}

                        {logs.length === 0 && (job as any).status !== 'PENDING' && (job as any).status !== 'PROCESSING' && (
                            <PageBlock column="main" blockId="no-logs">
                                <div className="py-10 text-center text-slate-500 text-sm">
                                    No log entries for this import job.
                                </div>
                            </PageBlock>
                        )}
                    </>
                ) : (
                    <PageBlock column="main" blockId="not-found">
                        <div className="py-20 text-center text-slate-400 text-sm">
                            Import job not found.
                        </div>
                    </PageBlock>
                )}

                {/* Sidebar meta */}
                {job && (
                    <PageBlock column="side" blockId="job-meta">
                        <div className="p-5 space-y-4 text-xs">
                            <h3 className="font-bold text-slate-300 uppercase tracking-wider">Details</h3>
                            <dl className="space-y-2">
                                {[
                                    ['Job ID', (job as any).id],
                                    ['File', (job as any).fileName],
                                    ['Mode', (job as any).mode],
                                    ['Dry Run', (job as any).dryRun ? 'Yes' : 'No'],
                                    ['Started By', (job as any).initiatedBy],
                                    ['Total Rows', (job as any).totalRows],
                                    ['Created', new Date((job as any).createdAt).toLocaleString()],
                                    ['Started', (job as any).startedAt ? new Date((job as any).startedAt).toLocaleString() : '—'],
                                    ['Completed', (job as any).completedAt ? new Date((job as any).completedAt).toLocaleString() : '—'],
                                    ['Duration', (job as any).durationMs ? `${((job as any).durationMs / 1000).toFixed(1)}s` : '—'],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex justify-between gap-4">
                                        <dt className="text-slate-500">{label}</dt>
                                        <dd className="text-slate-300 font-medium text-right truncate max-w-36">{String(value)}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </PageBlock>
                )}
            </PageLayout>
        </Page>
    );
}
