import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    api,
    Input,
    Button,
    VendureImage,
    Checkbox,
} from '@vendure/dashboard';
import { Search, X, Check } from 'lucide-react';
import { SEARCH_PRODUCTS, GET_ALL_PRODUCTS } from '../queries';

function getPriceDisplay(priceWithTax: any): string {
    if (!priceWithTax) return '0.00';
    if (typeof priceWithTax === 'object') {
        if ('min' in priceWithTax) return (priceWithTax.min / 100).toFixed(2);
        if ('value' in priceWithTax) return (priceWithTax.value / 100).toFixed(2);
    }
    return (Number(priceWithTax) / 100).toFixed(2);
}

export interface ProductPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelected: (productIds: string[]) => void;
}

export function ProductPicker({ isOpen, onClose, onSelected }: ProductPickerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedTerm, setDebouncedTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 50;
    const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        if (isOpen) {
            setLocalSelectedIds(new Set());
            setSearchTerm('');
            setDebouncedTerm('');
            setPage(1);
        }
    }, [isOpen]);

    const activeTerm = debouncedTerm.trim() || undefined;

    const { data: productsData, isLoading } = useQuery<any>({
        queryKey: ['seasonalProductPicker', activeTerm, page],
        queryFn: async () => {
            if (activeTerm) {
                return api.query(SEARCH_PRODUCTS, {
                    input: {
                        term: activeTerm,
                        skip: (page - 1) * itemsPerPage,
                        take: itemsPerPage,
                        groupByProduct: true,
                    },
                });
            } else {
                return api.query(GET_ALL_PRODUCTS, {
                    options: {
                        skip: (page - 1) * itemsPerPage,
                        take: itemsPerPage,
                    },
                });
            }
        },
        enabled: isOpen,
    });

    const items = useMemo(() => {
        if (productsData?.search) {
            return productsData.search.items.map((item: any) => ({
                id: item.productId,
                name: item.productName,
                featuredAsset: item.productAsset,
                enabled: item.enabled,
                sku: item.sku,
                priceWithTax: typeof item.priceWithTax === 'number' 
                    ? item.priceWithTax 
                    : item.priceWithTax?.value || item.priceWithTax?.min || 0,
            }));
        }
        return productsData?.products?.items || [];
    }, [productsData]);

    const totalItems = productsData?.search?.totalItems ?? productsData?.products?.totalItems ?? 0;

    const toggleLocalProduct = useCallback((id: string) => {
        const strId = String(id);
        setLocalSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(strId)) {
                next.delete(strId);
            } else {
                next.add(strId);
            }
            return next;
        });
    }, []);

    const handleSave = () => {
        onSelected(Array.from(localSelectedIds));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm shadow-2xl">
            <div className="bg-slate-900 border border-slate-200/10 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col h-full max-h-[85vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-200/10">
                    <h2 className="text-xl font-bold text-slate-200">Select Products</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-4 border-b border-slate-200/10 bg-slate-900/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search products by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(1);
                            }}
                            className="pl-9 h-11 bg-slate-800 border-slate-700 text-slate-200"
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-2">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            No products found matching your search.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2">
                            {items.map((product: any) => {
                                const isSelected = localSelectedIds.has(String(product.id));
                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => toggleLocalProduct(product.id)}
                                        className={`flex items-center gap-4 p-3 rounded-lg border transition-all cursor-pointer ${
                                            isSelected 
                                                ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_-5px_rgba(6,182,212,0.3)]' 
                                                : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                                        }`}
                                    >
                                        <Checkbox checked={isSelected} onCheckedChange={() => toggleLocalProduct(product.id)} />
                                        <div className="w-12 h-12 rounded bg-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-700">
                                            {product.featuredAsset?.preview ? (
                                                <VendureImage url={product.featuredAsset.preview} className="w-full h-full object-cover" preset="tiny" />
                                            ) : (
                                                <span className="text-[10px] text-slate-600">No img</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-200 truncate">{product.name}</p>
                                            <p className="text-xs text-slate-500 font-mono">{product.sku}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-cyan-500">${getPriceDisplay(product.priceWithTax)}</p>
                                            {!product.enabled && (
                                                <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded tracking-wider font-bold">DISABLED</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-200/10 bg-slate-900 flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                        {localSelectedIds.size} products selected
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-slate-200">
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={localSelectedIds.size === 0}
                            className="bg-cyan-500 hover:bg-cyan-400 text-white min-w-[120px]"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Add Products
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
