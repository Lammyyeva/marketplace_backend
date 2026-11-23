import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@vendure/dashboard';
import { GET_ALL_SEASONS, GET_PRODUCT_SEASONS, ASSIGN_PRODUCTS, REMOVE_PRODUCTS } from '../queries';
import { toast } from 'sonner';
import './season-picker.css';

export function ProductSeasonSelector({ context }: { context: any }) {
    const productId = context.entity?.id;
    const queryClient = useQueryClient();

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const { data: seasonsData, isLoading: isLoadingAll } = useQuery<any>({
        queryKey: ['allSeasons'],
        queryFn: () => api.query(GET_ALL_SEASONS),
    });

    const { data: productSeasonsData, isLoading: isLoadingProduct, error: productError } = useQuery<any>({
        queryKey: ['productSeasons', productId],
        queryFn: () => api.query(GET_PRODUCT_SEASONS, { productId }),
        enabled: !!productId,
    });

    useEffect(() => {
        if (productSeasonsData?.productSeasons) {
            setSelectedIds(new Set(productSeasonsData.productSeasons.map((s: any) => String(s.id))));
        }
    }, [productSeasonsData]);

    const { mutate: assignToSeason, isPending: isAssigning } = useMutation({
        mutationFn: (seasonId: string) =>
            api.mutate(ASSIGN_PRODUCTS, { seasonId, productIds: [productId] }),
        onSuccess: () => {
            toast.success('Product assigned to season');
            queryClient.invalidateQueries({ queryKey: ['productSeasons', productId] });
            queryClient.invalidateQueries({ queryKey: ['DetailPage'] });
        },
        onError: (err: any, seasonId: string) => {
            setSelectedIds(prev => {
                const next = new Set(prev);
                next.delete(seasonId);
                return next;
            });
            toast.error(err.message ?? 'Failed to assign season');
        },
    });

    const { mutate: removeFromSeason, isPending: isRemoving } = useMutation({
        mutationFn: (seasonId: string) =>
            api.mutate(REMOVE_PRODUCTS, { seasonId, productIds: [productId] }),
        onSuccess: () => {
            toast.success('Product removed from season');
            queryClient.invalidateQueries({ queryKey: ['productSeasons', productId] });
            queryClient.invalidateQueries({ queryKey: ['DetailPage'] });
        },
        onError: (err: any, seasonId: string) => {
            setSelectedIds(prev => {
                const next = new Set(prev);
                next.add(seasonId);
                return next;
            });
            toast.error(err.message ?? 'Failed to remove season');
        },
    });

    const isDisabled = isAssigning || isRemoving || !productId;

    const toggle = (seasonId: string) => {
        if (isDisabled) return;
        const sid = String(seasonId);
        if (selectedIds.has(sid)) {
            setSelectedIds(prev => { const n = new Set(prev); n.delete(sid); return n; });
            removeFromSeason(seasonId);
        } else {
            setSelectedIds(prev => new Set([...prev, sid]));
            assignToSeason(seasonId);
        }
    };

    if (isLoadingAll || isLoadingProduct) {
        return <div className="season-picker-loading">Loading seasons...</div>;
    }

    if (productError) {
        return <div className="p-2 text-xs text-red-500 font-medium">Error loading product seasons: {productError.message}</div>;
    }

    const seasons: Array<{ id: string; name: string; isActive: boolean }> =
        seasonsData?.seasons?.items ?? [];

    if (seasons.length === 0) {
        return <div className="season-picker-empty">No seasons defined yet.</div>;
    }

    return (
        <div className="season-picker-container">
            <div className="season-picker-header">Select product season</div>
            <div className="seasons-list-horizontal">
                {seasons.map(season => {
                    const isSelected = selectedIds.has(String(season.id));
                    return (
                        <div
                            key={season.id}
                            className={`season-checkbox-item${isDisabled ? ' disabled' : ''}`}
                            onClick={() => toggle(season.id)}
                        >
                            <div className={`season-checkbox-custom${isSelected ? ' checked' : ''}`}>
                                {isSelected && (
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                            <span className="season-label-text">
                                {season.name}
                                {!season.isActive && (
                                    <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.5 }}>
                                        (inactive)
                                    </span>
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
