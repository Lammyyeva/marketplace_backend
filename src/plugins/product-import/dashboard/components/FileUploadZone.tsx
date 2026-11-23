import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, X, File, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileUploadZoneProps {
    accept: string;
    label: string;
    description?: string;
    onFileSelected: (file: File) => void;
    maxSizeMb?: number;
    multiple?: boolean;
    onMultipleFiles?: (files: File[]) => void;
    isLoading?: boolean;
    selectedFile?: File | null;
}

export function FileUploadZone({
    accept,
    label,
    description,
    onFileSelected,
    maxSizeMb = 100,
    multiple = false,
    onMultipleFiles,
    isLoading = false,
    selectedFile,
}: FileUploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const validate = (files: File[]): string | null => {
        for (const file of files) {
            if (file.size > maxSizeMb * 1024 * 1024) {
                return `File "${file.name}" exceeds the ${maxSizeMb}MB size limit.`;
            }
        }
        return null;
    };

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const arr = Array.from(files);
        const validationError = validate(arr);
        if (validationError) {
            setError(validationError);
            return;
        }
        setError(null);
        if (multiple && onMultipleFiles) {
            onMultipleFiles(arr);
        } else {
            onFileSelected(arr[0]);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        e.target.value = '';
    };

    return (
        <div className="space-y-2">
            <div
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !isLoading && inputRef.current?.click()}
                className={`
                    relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed
                    cursor-pointer transition-all duration-200 p-10 text-center select-none
                    ${isDragging ? 'border-cyan-500 bg-cyan-500/10 scale-[1.01]' : 'border-slate-600 hover:border-cyan-500/60 hover:bg-slate-800/30'}
                    ${isLoading ? 'pointer-events-none opacity-60' : ''}
                    ${selectedFile ? 'border-emerald-500/50 bg-emerald-500/5' : ''}
                `}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleChange}
                    className="hidden"
                />

                {selectedFile ? (
                    <div className="flex flex-col items-center gap-3">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        <div>
                            <p className="text-sm font-semibold text-emerald-400">{selectedFile.name}</p>
                            <p className="text-xs text-slate-400 mt-1">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>
                        <p className="text-xs text-slate-500">Click to change file</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                        <p className="text-sm text-slate-400">Processing…</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <Upload className="w-12 h-12 text-slate-500" />
                        <div>
                            <p className="text-sm font-semibold text-slate-200">{label}</p>
                            {description && (
                                <p className="text-xs text-slate-400 mt-1 max-w-xs">{description}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-2">
                                Drag & drop or click to browse · Max {maxSizeMb}MB
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 text-rose-400 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}
        </div>
    );
}
