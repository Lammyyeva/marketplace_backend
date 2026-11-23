import { useState, useCallback } from 'react';
import {
    Button,
    Page,
    PageLayout,
    PageBlock,
    PageTitle,
    PageActionBar,
    PageActionBarRight,
    api,
} from '@vendure/dashboard';
import { gql } from '@apollo/client';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Download, FileSpreadsheet, History, Play, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploadZone } from '../components/FileUploadZone';
import { ImportProgress } from '../components/ImportProgress';
import { ErrorViewer } from '../components/ErrorViewer';

type ImportMode = 'CREATE' | 'UPDATE' | 'UPSERT';

const BASE_URL = '/import';

const SYNC_MEILI = gql`
    mutation ExecuteSearchSync {
        syncMeilisearchNow
    }
`;

async function pollJob(jobId: string, onUpdate: (job: any) => void) {
    const poll = async () => {
        try {
            const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
                credentials: 'include',
            });
            if (!res.ok) return;
            const job = await res.json();
            onUpdate(job);
            if (job.status === 'PROCESSING' || job.status === 'PENDING') {
                setTimeout(poll, 1500);
            }
        } catch (_) {}
    };
    poll();
}

export function ImportProductsPage({ route }: { route: any }) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [mode, setMode] = useState<ImportMode>('UPSERT');
    const [dryRun, setDryRun] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [currentJob, setCurrentJob] = useState<any | null>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const queryClient = useQueryClient();

    const handleMeiliSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch('/meili/sync', {
                method: 'POST',
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success('Meilisearch sync started successfully!');
            } else {
                throw new Error(data.message || 'Sync failed');
            }
        } catch (err: any) {
            console.error('Meilisearch sync error:', err);
            toast.error(`Meilisearch sync failed: ${err.message}`);
        } finally {
            setIsSyncing(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const res = await fetch(`${BASE_URL}/template`, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to download template');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'product-import-template.xlsx';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err: any) {
            toast.error(`Failed to download template: ${err.message}`);
        }
    };

    const handleExportCatalog = async () => {
        toast.promise(
            (async () => {
                const res = await fetch(`${BASE_URL}/export-products`, { credentials: 'include' });
                if (!res.ok) throw new Error('Failed to export catalog');
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'products-export.xlsx';
                a.click();
                URL.revokeObjectURL(url);
            })(),
            {
                loading: 'Exporting catalog... Please wait.',
                success: 'Catalog exported successfully!',
                error: (err: any) => `Failed to export catalog: ${err.message}`,
            }
        );
    };

    const fetchLogs = async (jobId: string) => {
        try {
            const res = await fetch(`${BASE_URL}/jobs/${jobId}`, { credentials: 'include' });
            const job = await res.json();
            setLogs(job.logs ?? []);
        } catch (_) {}
    };

    const handleImport = async () => {
        if (!selectedFile) {
            toast.error('Please select an Excel file first.');
            return;
        }

        setIsUploading(true);
        setCurrentJob(null);
        setLogs([]);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('mode', mode);
        formData.append('dryRun', String(dryRun));

        try {
            const res = await fetch(`${BASE_URL}/upload-excel`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message ?? 'Upload failed');
            }

            toast.success(data.message ?? 'Import started!');
            queryClient.invalidateQueries({ queryKey: ['import-jobs'] });

            pollJob(data.jobId, (job) => {
                setCurrentJob(job);
                if (job.status === 'COMPLETED' || job.status === 'FAILED') {
                    fetchLogs(data.jobId);
                    queryClient.invalidateQueries({ queryKey: ['import-jobs'] });
                }
            });
        } catch (err: any) {
            toast.error(err.message ?? 'Import failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Page pageId="import-products">
            <PageTitle>Import Products</PageTitle>
            <PageActionBar>
                <PageActionBarRight>
                    <Button
                        variant="outline"
                        className="h-9 gap-2 text-xs border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-200 font-bold"
                        onClick={handleDownloadTemplate}
                    >
                        <Download className="w-4 h-4" />
                        Download Template
                    </Button>
                    <Button
                        variant="outline"
                        className="h-9 gap-2 text-xs border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-200 font-bold"
                        onClick={handleExportCatalog}
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        Export Catalog
                    </Button>
                    <Button asChild variant="outline" className="h-9 gap-2 text-xs border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-200 font-bold">
                        <Link to="/catalog/import-history">
                            <History className="w-4 h-4" />
                            History
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        className="h-9 gap-2 text-xs border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-200 font-bold"
                        onClick={handleMeiliSync}
                        disabled={isSyncing}
                    >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        Sync Search Index
                    </Button>
                </PageActionBarRight>
            </PageActionBar>

            <PageLayout>
                <PageBlock column="main" blockId="import-upload">
                    <div className="p-6 space-y-8">
                        {/* Upload area */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-200">
                                <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                                Step 1 — Select your Excel file
                            </div>
                            <FileUploadZone
                                accept=".xlsx,.xls"
                                label="Drop your Excel file here or click to browse"
                                description="Supported formats: .xlsx, .xls · Maximum 100MB"
                                onFileSelected={setSelectedFile}
                                maxSizeMb={100}
                                selectedFile={selectedFile}
                                isLoading={isUploading}
                            />
                        </div>

                        {/* Options */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-200">
                                <Play className="w-5 h-5 text-cyan-400" />
                                Step 2 — Configure import options
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Mode selector */}
                                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3">
                                    <label className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                                        Import Mode
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['CREATE', 'UPDATE', 'UPSERT'] as ImportMode[]).map((m) => (
                                            <button
                                                key={m}
                                                onClick={() => setMode(m)}
                                                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                                                    mode === m
                                                        ? 'bg-cyan-500 text-white border-cyan-500'
                                                        : 'bg-transparent border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-400 hover:border-cyan-500/50 font-bold'
                                                }`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-900 dark:text-slate-500 font-bold">
                                        {mode === 'CREATE' && 'Only creates new products. Skips existing SKUs.'}
                                        {mode === 'UPDATE' && 'Only updates existing products. Skips unknown SKUs.'}
                                        {mode === 'UPSERT' && 'Creates new products and updates existing ones.'}
                                    </p>
                                </div>

                                {/* Dry run toggle */}
                                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3">
                                    <label className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                                        Dry Run (Preview)
                                    </label>
                                    <button
                                        onClick={() => setDryRun(!dryRun)}
                                        className={`flex items-center gap-3 w-full p-3 rounded-lg border transition-all ${
                                            dryRun
                                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                                                : 'bg-slate-200/30 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 font-bold'
                                        }`}
                                    >
                                        <div className={`w-9 h-5 rounded-full flex items-center transition-all px-0.5 ${dryRun ? 'bg-amber-500 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'}`}>
                                            <div className="w-4 h-4 rounded-full bg-white shadow" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-semibold">
                                                {dryRun ? 'Dry Run Enabled' : 'Dry Run Disabled'}
                                            </p>
                                            <p className="text-[10px] opacity-70">
                                                {dryRun
                                                    ? 'Validates data without making changes'
                                                    : 'Changes will be persisted to database'}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Import button */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleImport}
                                disabled={!selectedFile || isUploading}
                                className={`h-11 px-8 gap-2 font-semibold ${
                                    dryRun
                                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                        : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                                } disabled:opacity-40`}
                            >
                                {isUploading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : dryRun ? (
                                    <Eye className="w-4 h-4" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                                {dryRun ? 'Validate Only' : 'Start Import'}
                            </Button>

                            {selectedFile && !isUploading && (
                                <Button
                                    variant="outline"
                                    onClick={() => { setSelectedFile(null); setCurrentJob(null); setLogs([]); }}
                                    className="h-11 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-400 font-bold"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </PageBlock>

                {/* Progress */}
                {currentJob && (
                    <PageBlock column="main" blockId="import-progress">
                        <div className="p-6 space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Import Progress</h3>
                            <ImportProgress job={currentJob} />
                        </div>
                    </PageBlock>
                )}

                {/* Logs */}
                {logs.length > 0 && (
                    <PageBlock column="main" blockId="import-logs">
                        <div className="p-6 space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Import Log</h3>
                            <ErrorViewer
                                logs={logs}
                                jobId={currentJob?.id}
                                onDownloadExcelReport={
                                    currentJob?.id && (currentJob.status === 'COMPLETED' || currentJob.status === 'FAILED')
                                        ? () => window.open(`${BASE_URL}/jobs/${currentJob.id}/error-report-excel`, '_blank')
                                        : undefined
                                }
                                onDownloadReport={
                                    currentJob?.id
                                        ? () => window.open(`${BASE_URL}/jobs/${currentJob.id}/error-report`, '_blank')
                                        : undefined
                                }
                            />
                        </div>
                    </PageBlock>
                )}

                {/* Instructions sidebar */}
                <PageBlock column="side" blockId="import-instructions">
                    <div className="p-5 space-y-4">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                            How to Import
                        </h3>
                        <ol className="space-y-3 text-xs text-slate-900 dark:text-slate-400 font-bold">
                            {[
                                'Download the Excel template using the button above.',
                                'Fill in your product data following the column headers and example rows.',
                                'Upload the completed Excel file.',
                                'Choose CREATE, UPDATE, or UPSERT mode.',
                                'Optionally enable Dry Run to validate without saving.',
                                'Click "Start Import" and monitor progress.',
                                'Review the import log for any errors.',
                            ].map((step, i) => (
                                <li key={i} className="flex gap-2.5">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                    {step}
                                </li>
                            ))}
                        </ol>

                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                            <p className="text-[10px] font-bold text-slate-900 dark:text-slate-400 uppercase tracking-wider">
                                Image Mapping
                            </p>
                            <div className="text-xs text-slate-900 dark:text-slate-500 space-y-1 font-bold">
                                <p>Name images after SKU:</p>
                                <code className="block bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-cyan-700 dark:text-cyan-400 text-[11px] font-bold">
                                    ST1234.jpg ← featured<br />
                                    ST1234_1.jpg<br />
                                    ST1234_2.jpg
                                </code>
                            </div>
                        </div>
                    </div>
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
