import { useState } from 'react';
import {
    Button,
    Page,
    PageLayout,
    PageBlock,
    PageTitle,
} from '@vendure/dashboard';
import { ImagePlus, CheckCircle2, AlertCircle, XCircle, FileArchive } from 'lucide-react';
import { toast } from 'sonner';

const BASE_URL = '/import';

interface UploadResult {
    matched: number;
    unmatched: number;
    total: number;
    unmatchedFiles: string[];
    errors: string[];
}

export function UploadImagesPage({ route }: { route: any }) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<UploadResult | null>(null);

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        setSelectedFiles(Array.from(files));
        setResult(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error('Please select files first.');
            return;
        }

        setIsUploading(true);
        setResult(null);

        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append('files', file));

        try {
            const res = await fetch(`${BASE_URL}/upload-images`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message ?? 'Upload failed');
            setResult(data);
            toast.success(`Mapped ${data.matched} of ${data.total} images to products.`);
        } catch (err: any) {
            toast.error(err.message ?? 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const imageCount = selectedFiles.filter((f) => !f.name.endsWith('.zip')).length;
    const zipCount = selectedFiles.filter((f) => f.name.endsWith('.zip')).length;

    return (
        <Page pageId="upload-images">
            <PageTitle>Upload Images</PageTitle>
            <PageLayout>
                <PageBlock column="main" blockId="image-upload">
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-200">Bulk Image Upload & SKU Mapping</h2>
                            <p className="text-xs text-slate-900 dark:text-slate-400 font-bold">
                                Upload images or a ZIP archive. Images are automatically mapped to products/variants based on filename.
                            </p>
                        </div>

                        {/* Drop Zone */}
                        <div
                            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => !isUploading && document.getElementById('img-file-input')?.click()}
                            className={`
                                relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed
                                cursor-pointer transition-all duration-200 p-12 text-center select-none
                                ${isDragging ? 'border-cyan-500 bg-cyan-500/10 scale-[1.01]' : 'border-slate-200 dark:border-slate-600 hover:border-cyan-500/50 bg-slate-50 dark:bg-slate-800/20'}
                                ${isUploading ? 'pointer-events-none opacity-60' : ''}
                            `}
                        >
                            <input
                                id="img-file-input"
                                type="file"
                                accept="image/*,.zip"
                                multiple
                                onChange={(e) => handleFiles(e.target.files)}
                                className="hidden"
                            />

                            {selectedFiles.length > 0 ? (
                                <div className="space-y-3 text-center">
                                    <div className="flex items-center justify-center gap-4">
                                        {imageCount > 0 && (
                                            <div className="flex items-center gap-2 text-emerald-400">
                                                <ImagePlus className="w-6 h-6" />
                                                <span className="text-lg font-bold">{imageCount}</span>
                                                <span className="text-sm">images</span>
                                            </div>
                                        )}
                                        {zipCount > 0 && (
                                            <div className="flex items-center gap-2 text-cyan-400">
                                                <FileArchive className="w-6 h-6" />
                                                <span className="text-lg font-bold">{zipCount}</span>
                                                <span className="text-sm">ZIP archive{zipCount > 1 ? 's' : ''}</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-900 dark:text-slate-400 font-bold">
                                        {selectedFiles.reduce((sum, f) => sum + f.size, 0) > 1024 * 1024
                                            ? `${(selectedFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(1)} MB total`
                                            : `${Math.round(selectedFiles.reduce((sum, f) => sum + f.size, 0) / 1024)} KB total`}
                                        {' · '}Click to change selection
                                    </p>
                                </div>
                            ) : isUploading ? (
                                <div className="space-y-3">
                                    <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto" />
                                    <p className="text-sm text-slate-900 dark:text-slate-400 font-bold">Uploading and mapping images…</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <ImagePlus className="w-12 h-12 text-slate-900 dark:text-slate-500 mx-auto" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-200">
                                            Drop images or a ZIP file here
                                        </p>
                                        <p className="text-xs text-slate-900 dark:text-slate-400 mt-1 font-bold">
                                            Supports: JPG, PNG, GIF, WebP, SVG, ZIP · No size limit for ZIP
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleUpload}
                                disabled={selectedFiles.length === 0 || isUploading}
                                className="h-10 px-6 gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold disabled:opacity-40"
                            >
                                {isUploading && (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                Upload & Map Images
                            </Button>
                            {selectedFiles.length > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={() => { setSelectedFiles([]); setResult(null); }}
                                    className="h-10 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-400 font-bold"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>

                        {/* Result */}
                        {result && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">Upload Result</h3>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                                        <p className="text-2xl font-bold text-emerald-400">{result.matched}</p>
                                        <p className="text-xs text-slate-900 dark:text-slate-400 mt-0.5 font-bold">Matched</p>
                                    </div>
                                    <div className={`rounded-xl border p-4 text-center ${result.unmatched > 0 ? 'border-amber-500/20 bg-amber-500/10' : 'border-slate-700 bg-slate-800/30'}`}>
                                        <AlertCircle className={`w-6 h-6 mx-auto mb-1 ${result.unmatched > 0 ? 'text-amber-400' : 'text-slate-600'}`} />
                                        <p className={`text-2xl font-bold ${result.unmatched > 0 ? 'text-amber-400' : 'text-slate-500'}`}>{result.unmatched}</p>
                                        <p className="text-xs text-slate-900 dark:text-slate-400 mt-0.5 font-bold">Unmatched</p>
                                    </div>
                                    <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4 text-center">
                                        <ImagePlus className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                                        <p className="text-2xl font-bold text-slate-300">{result.total}</p>
                                        <p className="text-xs text-slate-900 dark:text-slate-400 mt-0.5 font-bold">Total</p>
                                    </div>
                                </div>

                                {result.unmatchedFiles.length > 0 && (
                                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
                                        <p className="text-xs font-bold text-amber-400">Unmatched Files</p>
                                        <p className="text-xs text-slate-900 dark:text-slate-400 font-bold">
                                            These files could not be matched to any product SKU:
                                        </p>
                                        <div className="max-h-40 overflow-y-auto space-y-1">
                                            {result.unmatchedFiles.map((f) => (
                                                <div key={f} className="flex items-center gap-2 text-xs text-slate-300">
                                                    <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                                                    <code className="font-mono">{f}</code>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </PageBlock>

                <PageBlock column="side" blockId="image-naming-guide">
                    <div className="p-5 space-y-4">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-wider">
                            Naming Convention
                        </h3>
                        <div className="space-y-3 text-xs text-slate-900 dark:text-slate-400 font-bold">
                            <p>Name your image files after the product/variant SKU:</p>
                            <div className="rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 space-y-2 font-mono text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-cyan-400">ST1234.jpg</span>
                                    <span className="text-slate-900 dark:text-slate-500">← featured</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-900 dark:text-slate-300">ST1234_1.jpg</span>
                                    <span className="text-slate-900 dark:text-slate-500">← gallery</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-900 dark:text-slate-300">ST1234_2.jpg</span>
                                    <span className="text-slate-900 dark:text-slate-500">← gallery</span>
                                </div>
                            </div>
                            <ul className="space-y-1.5">
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-0.5">•</span>
                                    First image (no suffix) = featured asset
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-0.5">•</span>
                                    Suffix _1, _2, … = gallery images
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-0.5">•</span>
                                    Matching is case-insensitive
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-cyan-500 mt-0.5">•</span>
                                    ZIP files are automatically extracted
                                </li>
                            </ul>
                        </div>
                    </div>
                </PageBlock>
            </PageLayout>
        </Page>
    );
}
