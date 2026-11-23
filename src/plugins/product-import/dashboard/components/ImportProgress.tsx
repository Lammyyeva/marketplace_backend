import { CheckCircle2, XCircle, Clock, AlertTriangle, Loader2, Ban } from 'lucide-react';

interface ImportJob {
    id: string;
    status: string;
    mode: string;
    fileName: string;
    totalRows: number;
    successCount: number;
    failedCount: number;
    warningCount: number;
    skippedCount: number;
    progress: number;
    dryRun: boolean;
    startedAt?: string;
    completedAt?: string;
    durationMs?: number;
    errorMessage?: string;
}

export function ImportProgress({ job }: { job: ImportJob }) {
    const statusConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
        PENDING: {
            icon: <Clock className="w-5 h-5" />,
            color: 'text-amber-400',
            label: 'Queued',
        },
        PROCESSING: {
            icon: <Loader2 className="w-5 h-5 animate-spin" />,
            color: 'text-cyan-400',
            label: 'Processing',
        },
        COMPLETED: {
            icon: <CheckCircle2 className="w-5 h-5" />,
            color: 'text-emerald-400',
            label: 'Completed',
        },
        FAILED: {
            icon: <XCircle className="w-5 h-5" />,
            color: 'text-rose-400',
            label: 'Failed',
        },
        CANCELLED: {
            icon: <Ban className="w-5 h-5" />,
            color: 'text-slate-400',
            label: 'Cancelled',
        },
    };

    const config = statusConfig[job.status] ?? statusConfig['PENDING'];

    return (
        <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-200 truncate max-w-sm">
                        {job.fileName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Mode: <span className="font-medium text-slate-300">{job.mode}</span>
                        {job.dryRun && (
                            <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-amber-500/20 text-amber-400 font-bold uppercase">
                                Dry Run
                            </span>
                        )}
                    </p>
                </div>
                <div className={`flex items-center gap-1.5 text-sm font-semibold ${config.color}`}>
                    {config.icon}
                    {config.label}
                </div>
            </div>

            {/* Progress bar */}
            <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span>{job.progress}% complete</span>
                    <span>{job.totalRows > 0 ? `${job.totalRows} rows` : 'Calculating…'}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${
                            job.status === 'FAILED' ? 'bg-rose-500' :
                            job.status === 'COMPLETED' ? 'bg-emerald-500' :
                            'bg-cyan-500'
                        }`}
                        style={{ width: `${job.progress}%` }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: 'Success', value: job.successCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                    { label: 'Failed', value: job.failedCount, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
                    { label: 'Warnings', value: job.warningCount, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                    { label: 'Skipped', value: job.skippedCount, color: 'text-slate-400', bg: 'bg-slate-700/40 border-slate-600/30' },
                ].map((stat) => (
                    <div key={stat.label} className={`rounded-lg border px-3 py-2 ${stat.bg}`}>
                        <p className={`text-lg font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Duration */}
            {job.durationMs != null && (
                <p className="text-xs text-slate-500">
                    Duration: <span className="text-slate-300">{(job.durationMs / 1000).toFixed(1)}s</span>
                </p>
            )}

            {/* Error message */}
            {job.errorMessage && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3">
                    <p className="text-xs text-rose-400">{job.errorMessage}</p>
                </div>
            )}
        </div>
    );
}
