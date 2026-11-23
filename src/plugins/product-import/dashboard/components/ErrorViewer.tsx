import { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@vendure/dashboard';

interface ErrorRow {
    rowNumber: number;
    sku?: string | null;
    error: string;
    suggestedFix?: string | null;
}

interface ImportLog {
    id: string;
    rowNumber: number;
    sku?: string | null;
    status: string;
    message: string;
    suggestedFix?: string | null;
}

interface ErrorViewerProps {
    logs?: ImportLog[];
    jobId?: string;
    onDownloadReport?: () => void;
    onDownloadExcelReport?: () => void;
}

const STATUS_COLORS: Record<string, string> = {
    ERROR: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    WARNING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    SUCCESS: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    SKIPPED: 'bg-slate-700 text-slate-400 border-slate-600',
};

export function ErrorViewer({ logs = [], jobId, onDownloadReport, onDownloadExcelReport }: ErrorViewerProps) {
    const [filter, setFilter] = useState<'ALL' | 'ERROR' | 'WARNING' | 'SKIPPED'>('ALL');
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const filtered = filter === 'ALL' ? logs : logs.filter((l) => l.status === filter);

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const counts = {
        ERROR: logs.filter((l) => l.status === 'ERROR').length,
        WARNING: logs.filter((l) => l.status === 'WARNING').length,
        SKIPPED: logs.filter((l) => l.status === 'SKIPPED').length,
    };

    return (
        <div className="space-y-4">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3">
                {(['ALL', 'ERROR', 'WARNING', 'SKIPPED'] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                            filter === status
                                ? 'bg-cyan-500 text-white border-cyan-500'
                                : 'bg-transparent border-slate-600 text-slate-400 hover:border-cyan-500/50'
                        }`}
                    >
                        {status}
                        {status !== 'ALL' && (
                            <span className="ml-1.5 opacity-70">
                                ({counts[status as keyof typeof counts]})
                            </span>
                        )}
                    </button>
                ))}

                <div className="ml-auto flex items-center gap-2">
                    {onDownloadExcelReport && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onDownloadExcelReport}
                            className="h-7 text-xs gap-1.5 border-emerald-600/50 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500"
                            title="Download full colour-coded Excel report (.xlsx) with separate sheets for errors, warnings, successes and skipped rows"
                        >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                            Excel Report
                        </Button>
                    )}
                    {onDownloadReport && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onDownloadReport}
                            className="h-7 text-xs gap-1.5"
                            title="Download JSON error report"
                        >
                            <Download className="w-3.5 h-3.5" />
                            JSON Report
                        </Button>
                    )}
                </div>
            </div>

            {/* Log list */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <AlertCircle className="w-8 h-8 mb-2" />
                    <p className="text-sm">No {filter !== 'ALL' ? filter.toLowerCase() + ' ' : ''}entries found.</p>
                </div>
            ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                    {filtered.map((log) => {
                        const isExpanded = expanded.has(log.id);
                        const colorClass = STATUS_COLORS[log.status] ?? STATUS_COLORS.ERROR;
                        return (
                            <div
                                key={log.id}
                                className={`rounded-lg border overflow-hidden ${colorClass.split(' ').slice(-1)[0]}`}
                            >
                                <button
                                    onClick={() => toggle(log.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className={`flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded border ${colorClass}`}>
                                        {log.status}
                                    </span>
                                    <span className="text-xs text-slate-400 flex-shrink-0 w-16">
                                        Row {log.rowNumber}
                                    </span>
                                    {log.sku && (
                                        <span className="text-xs font-mono text-slate-300 flex-shrink-0">
                                            {log.sku}
                                        </span>
                                    )}
                                    <span className="text-xs text-slate-300 flex-1 truncate">
                                        {log.message}
                                    </span>
                                    {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="px-4 pb-3 pt-1 border-t border-white/5 bg-black/20 space-y-2">
                                        <p className="text-xs text-slate-300">{log.message}</p>
                                        {log.suggestedFix && (
                                            <div className="flex gap-2">
                                                <span className="text-[10px] font-bold text-cyan-400 flex-shrink-0 mt-0.5">
                                                    Fix:
                                                </span>
                                                <p className="text-xs text-slate-400">{log.suggestedFix}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
