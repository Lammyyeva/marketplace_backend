///////////////real one
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  api,
  DashboardFormComponentProps,
  Input,
  Button,
  VendureImage,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
} from "@vendure/dashboard";
import {
  Search,
  X,
  Save,
  Filter,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import {
  SEARCH_PRODUCTS,
  GET_MODELS,
  GET_PRODUCT_IDS_BY_ENABLED,
  GET_ALL_PRODUCTS,
} from "../../api/banner.queries";
import {
  GET_CATEGORY_TYPES,
  GET_CATEGORY_TREE,
} from "../../../category/api/category.queries";

function getPriceDisplay(priceWithTax: any): string {
  if (!priceWithTax) return "0.00";
  if (typeof priceWithTax === "object") {
    if ("min" in priceWithTax) return (priceWithTax.min / 100).toFixed(2);
    if ("value" in priceWithTax) return (priceWithTax.value / 100).toFixed(2);
  }
  return (Number(priceWithTax) / 100).toFixed(2);
}

export function ProductPicker({
  value = [],
  onChange,
  disabled,
  field,
}: DashboardFormComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [skuFilter, setSkuFilter] = useState("");
  const [enabledFilter, setEnabledFilter] = useState<string>("all");
  const [modelFilterId, setModelFilterId] = useState<string>("all");
  const [categoryFilterId, setCategoryFilterId] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [includeVariants, setIncludeVariants] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(true);
  const itemsPerPage = 50;

  const [sidePanelType, setSidePanelType] = useState<
    "none" | "category" | "model"
  >("none");
  const [sidePanelSearchTerm, setSidePanelSearchTerm] = useState("");
  const [stagedFilterId, setStagedFilterId] = useState<string>("all");

  const [localSelectedIds, setLocalSelectedIds] = useState<Set<string>>(
    new Set(),
  );

  const selectedIds = useMemo<string[]>(() => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map((v: any) =>
        String(typeof v === "string" ? v : v?.id || v),
      );
    }
    if (typeof value === "object") {
      const pIds = Array.isArray(value.productIds) ? value.productIds : [];
      const vIds = Array.isArray(value.variantIds) ? value.variantIds : [];
      return [
        ...pIds.map((id: any) => String(id)),
        ...vIds.map((id: any) => `v-${id}`),
      ];
    }
    return [];
  }, [value]);

  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      setLocalSelectedIds(new Set(selectedIds));
      setIsFiltersCollapsed(true);
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, selectedIds]);

  // ✅ FIX 1: Only fetch models when model panel opens + Add caching
  const { data: modelsData } = useQuery<any>({
    queryKey: ["modelFacets"],
    queryFn: () => api.query(GET_MODELS),
    enabled: sidePanelType === "model", // ✅ Only when needed
    staleTime: 5 * 60 * 1000, // ✅ Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // ✅ Keep in memory for 10 minutes
  });

  const models = modelsData?.models?.items || [];

  const activeModelName = useMemo(() => {
    if (modelFilterId === "all") return "Ählisi";
    return models.find((b: any) => b.id === modelFilterId)?.name || "Saýlanan";
  }, [modelFilterId, models]);

  // ✅ FIX 2: Add caching to products query
  const activeTerm = skuFilter.trim() || searchTerm.trim() || undefined;

  const { data: productsData, isLoading } = useQuery<any>({
    queryKey: [
      "productPickerAll",
      activeTerm,
      enabledFilter,
      modelFilterId,
      categoryFilterId,
      page,
      includeVariants,
    ],
    queryFn: async () => {
      const start = performance.now();

      let result;

      if (activeTerm) {
        result = await api.query(SEARCH_PRODUCTS, {
          input: {
            term: activeTerm,
            skip: (page - 1) * itemsPerPage,
            take: itemsPerPage,
            groupByProduct: true,
          },
        });
      } else {
        const queryStart = performance.now();
        const filter: any = {};
        if (enabledFilter !== "all")
          filter.enabled = enabledFilter === "active";
        if (modelFilterId !== "all") filter.modelIds = [modelFilterId];
        if (categoryFilterId !== "all") filter.categoryIds = [categoryFilterId];

        result = await api.query(GET_ALL_PRODUCTS, {
          options: {
            filter,
            skip: (page - 1) * itemsPerPage,
            take: itemsPerPage,
          },
        });
      }

      const duration = (performance.now() - start).toFixed(2);
      const queryName = activeTerm ? "SEARCH_PRODUCTS" : "GET_ALL_PRODUCTS";

      return result;
    },
    enabled: isOpen,
    staleTime: 30 * 1000, // ✅ Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // ✅ Keep in memory for 5 minutes
    refetchOnWindowFocus: false, // ✅ Don't refetch on focus
  });

  const items = useMemo(() => {
    if (productsData?.search) {
      return productsData.search.items.map((item: any) => ({
        id: item.productId,
        name: item.productName,
        slug: item.slug,
        enabled: item.enabled,
        featuredAsset: item.productAsset,
        isSearchResult: true,
        sku: item.sku,
        priceWithTax:
          typeof item.priceWithTax === "number"
            ? item.priceWithTax
            : item.priceWithTax?.value || item.priceWithTax?.min || 0,
        variants: [
          {
            id: item.productVariantId,
            sku: item.sku,
            priceWithTax:
              typeof item.priceWithTax === "number"
                ? item.priceWithTax
                : item.priceWithTax?.value || item.priceWithTax?.min || 0,
          },
        ],
      }));
    }
    return productsData?.getAllProducts?.items || [];
  }, [productsData]);

  const totalItems =
    productsData?.search?.totalItems ??
    productsData?.getAllProducts?.totalItems ??
    0;

  // ✅ FIX 3: Optimize displayRows - only include necessary fields
  const displayRows = useMemo(() => {
    const rows: any[] = [];

    items.forEach((product: any) => {
      if (!includeVariants) {
        const firstVariant = product.variants?.[0];
        rows.push({
          id: product.id,
          name: product.name,
          featuredAsset: product.featuredAsset,
          enabled: product.enabled,
          sku: firstVariant?.sku || product.sku,
          priceWithTax: 0,
          stockLevel: "—",
          isFlat: true,
        });
      } else {
        // Parent row
        rows.push({
          id: product.id,
          name: product.name,
          featuredAsset: product.featuredAsset,
          enabled: product.enabled,
          priceWithTax: 0,
          stockLevel: "—",
          isParent: true,
        });

        // Variant rows
        if (product.variants) {
          product.variants.forEach((variant: any) => {
            rows.push({
              id: product.id,
              productName: product.name,
              featuredAsset: product.featuredAsset,
              enabled: product.enabled,
              productVariantId: variant.id,
              productVariantName: variant.name || variant.sku,
              sku: variant.sku,
              priceWithTax: variant.priceWithTax,
              stockLevel: variant.stockLevel,
              vId: `v-${variant.id}`,
              isVariant: true,
            });
          });
        }
      }
    });

    return rows;
  }, [items, includeVariants]);

  const toggleLocalProduct = useCallback((id: string, parentId?: string) => {
    const strId = String(id);
    setLocalSelectedIds((prev) => {
      const next = new Set(prev);
      const isRemoving = next.has(strId);

      if (isRemoving) {
        next.delete(strId);
      } else {
        next.add(strId);
        if (parentId) {
          next.add(String(parentId));
        }
      }
      return next;
    });
  }, []);

  const handleSave = () => {
    const ids = Array.from(localSelectedIds);
    const productIds = ids.filter((id) => !id.startsWith("v-"));
    const variantIds = ids
      .filter((id) => id.startsWith("v-"))
      .map((id) => id.substring(2));
    onChange({ productIds, variantIds });
    setIsOpen(false);
  };

  const handleSearchTermChange = (val: string) => {
    setSearchTerm(val);
    if (val) setSkuFilter("");
    setPage(1);
  };

  const handleSkuFilterChange = (val: string) => {
    setSkuFilter(val);
    if (val) setSearchTerm("");
    setPage(1);
  };

  const displayLabel =
    selectedIds.length > 0
      ? `${selectedIds.length} haryt saýlandy`
      : "Harydy saýlaň";

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          className="min-w-[200px] justify-start text-left font-normal bg-slate-500/5 border-slate-200/10 text-slate-200"
        >
          {displayLabel}
        </Button>
        {selectedIds.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => onChange([])}
            disabled={disabled}
          >
            <X className="w-4 h-4 mr-1" /> Arassala
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-hidden">
          <div className="bg-slate-900 border border-slate-200/10 rounded-xl shadow-2xl w-full max-w-5xl flex flex-col h-full max-h-[90vh] overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200/10 bg-slate-900/50">
              <h2 className="text-xl font-bold text-slate-200">Harydy saýlaň</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-slate-200/10 bg-slate-900 space-y-4 shadow-sm z-10">
              <div
                className="flex items-center gap-2 cursor-pointer select-none py-1 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors"
                onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
              >
                <Filter className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-bold text-gray-700 uppercase tracking-tight flex-1">
                  Filterler
                </span>
                {isFiltersCollapsed ? (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </div>

              {!isFiltersCollapsed && (
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">
                      Gözleg
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Ady boýunça..."
                        value={searchTerm}
                        onChange={(e) => handleSearchTermChange(e.target.value)}
                        className="pl-9 h-10 text-sm bg-slate-800/50 border-slate-200/10 focus:border-cyan-500 shadow-sm text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">
                      SKU
                    </label>
                    <Input
                      placeholder="Kody..."
                      value={skuFilter}
                      onChange={(e) => handleSkuFilterChange(e.target.value)}
                      className="h-10 text-sm border-gray-200 focus:border-teal-500 shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">
                      Ýagdaýy
                    </label>
                    <Select
                      value={enabledFilter}
                      onValueChange={(val) => {
                        setEnabledFilter(val);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="h-10 text-sm border-gray-200 focus:border-teal-500 shadow-sm">
                        <SelectValue placeholder="Ählisi" />
                      </SelectTrigger>
                      <SelectContent
                        position="popper"
                        sideOffset={4}
                        className="z-[10000]"
                      >
                        <SelectItem value="all">Ählisi</SelectItem>
                        <SelectItem value="active">Diňe işjeňler</SelectItem>
                        <SelectItem value="inactive">
                          Diňe işjeň däller
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">
                      Kategoriýa
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setStagedFilterId(categoryFilterId);
                        setSidePanelType("category");
                      }}
                      className="w-full h-10 justify-between text-left font-normal border-gray-200 shadow-sm"
                    >
                      <span className="truncate">
                        {categoryFilterId === "all" ? "Ählisi" : "Saýlanan"}
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">
                      Model
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setStagedFilterId(modelFilterId);
                        setSidePanelSearchTerm("");
                        setSidePanelType("model");
                      }}
                      className="w-full h-10 justify-between text-left font-normal border-gray-200 shadow-sm"
                    >
                      <span className="truncate">{activeModelName}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Button>
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-end pb-2">
                    <label className="flex items-center space-x-2 cursor-pointer group">
                      <Checkbox
                        checked={includeVariants}
                        onCheckedChange={(c: boolean) => {
                          setIncludeVariants(c);
                          setPage(1);
                        }}
                        className="border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
                        Görnüşlerini ýazmak
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* List Area - keeping your existing UI code */}
            <div className="flex-1 overflow-auto bg-slate-900/30">
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              ) : displayRows.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Search className="w-8 h-8 mx-auto text-gray-300 mb-3" />
                  <p>Gözlegiňize nätije tapylmady</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200/10">
                  {/* Your existing table rendering code here - keeping it the same */}
                  <div className="sticky top-0 z-20 bg-teal-500 text-white flex items-center p-3 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    <div className="flex-shrink-0 w-8 pl-1"></div>
                    <div className="flex-shrink-0 w-10 ml-2"></div>
                    <div className="ml-4 flex-1">ADY</div>
                    <div className="w-16 text-center">ID</div>
                    <div className="w-24 text-center">SURAT</div>
                    <div className="w-24 text-right pr-4">BAHASY</div>
                    <div className="w-24 text-right pr-4">MUKDARY</div>
                    <div className="w-20 text-center">YAGDAÝ</div>
                    <div className="w-24 pl-2">SKU</div>
                  </div>

                  {displayRows.map((row: any, i: number) => {
                    const actualId = row.isVariant ? row.vId : row.id;
                    const isSelected = localSelectedIds.has(String(actualId));

                    // ✅ FLAT ROW (when variants not expanded)
                    if (row.isFlat) {
                      return (
                        <div
                          key={`flat-${row.id}-${i}`}
                          className={`flex items-center p-3 border-b border-slate-200/10 transition-colors cursor-pointer hover:bg-cyan-500/10 ${isSelected ? "bg-cyan-500/20" : "bg-slate-900"}`}
                          onClick={() => toggleLocalProduct(row.id)}
                        >
                          <div
                            className="flex-shrink-0 w-8 pl-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleLocalProduct(row.id)}
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <p className="font-bold text-sm text-gray-800">
                              {row.name}
                            </p>
                          </div>
                          <div className="w-16 text-center">
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded border border-gray-100">
                              {row.id}
                            </span>
                          </div>
                          <div className="w-24 flex justify-center">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200/10 bg-slate-800">
                              {row.featuredAsset?.preview ? (
                                <VendureImage
                                  url={row.featuredAsset?.preview}
                                  className="w-full h-full object-cover"
                                  preset="thumb"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[10px] text-gray-400">
                                  —
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right w-24 pr-4">
                            <p className="font-bold text-teal-700 text-sm">
                              {getPriceDisplay(row.priceWithTax)}
                            </p>
                          </div>
                          <div className="text-right w-24 pr-4">
                            <span className="text-xs text-gray-400 font-bold">
                              {row.stockLevel || "—"}
                            </span>
                          </div>
                          <div className="w-20 text-center">
                            {row.enabled === false ? (
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-500">
                                ÖÇÜRILEN
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-500">
                                IŞJEŇ
                              </span>
                            )}
                          </div>
                          <div className="w-24 pl-2">
                            <span className="text-[10px] text-gray-400 font-mono truncate block">
                              {row.sku}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // ✅ PARENT ROW (product header when variants shown)
                    if (row.isParent) {
                      return (
                        <div
                          key={`parent-${row.id}`}
                          className={`flex items-center p-3 border-b border-slate-200/10 transition-colors cursor-pointer hover:bg-slate-800/50 ${isSelected ? "bg-cyan-500/20" : "bg-slate-900"}`}
                          onClick={() => toggleLocalProduct(row.id)}
                        >
                          <div
                            className="flex-shrink-0 w-8 pl-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleLocalProduct(row.id)}
                            />
                          </div>
                          <div className="flex-shrink-0 w-10 ml-2"></div>
                          <div className="ml-4 flex-1">
                            <p className="font-bold text-sm text-gray-900">
                              {row.name}
                            </p>
                          </div>
                          <div className="w-16 text-center">
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded border border-gray-100">
                              {row.id}
                            </span>
                          </div>
                          <div className="w-24 flex justify-center">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-white">
                              {row.featuredAsset?.preview ? (
                                <VendureImage
                                  url={row.featuredAsset?.preview}
                                  className="w-full h-full object-cover"
                                  preset="thumb"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-[10px] text-gray-400">
                                  —
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right w-24 pr-4">
                            <p className="font-bold text-gray-400 text-sm">—</p>
                          </div>
                          <div className="text-right w-24 pr-4">
                            <span className="text-xs text-gray-400 font-bold">
                              —
                            </span>
                          </div>
                          <div className="w-20 text-center">
                            {row.enabled === false ? (
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-500">
                                ÖÇÜRILEN
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-500">
                                IŞJEŇ
                              </span>
                            )}
                          </div>
                          <div className="w-24 pl-2">
                            <span className="text-[10px] text-gray-400 font-mono">
                              —
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // ✅ VARIANT ROW (individual variants)
                    return (
                      <div
                        key={`variant-${row.vId}`}
                        className={`flex items-center p-2.5 hover:bg-amber-500/10 transition-colors cursor-pointer border-b border-slate-200/10 ${isSelected ? "bg-amber-500/20" : "bg-slate-900"} pl-12`}
                        onClick={() => toggleLocalProduct(row.vId, row.id)}
                      >
                        <div
                          className="flex-shrink-0 w-8 pl-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() =>
                              toggleLocalProduct(row.vId, row.id)
                            }
                          />
                        </div>
                        <div className="flex-shrink-0 w-10 ml-2 text-amber-600">
                          <ChevronRight className="w-3 h-3" />
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="text-xs text-gray-600">
                            {row.productVariantName}
                          </p>
                        </div>
                        <div className="w-16 text-center">
                          <span className="text-[9px] text-gray-400 bg-amber-50 px-1 py-0.5 rounded">
                            {row.productVariantId}
                          </span>
                        </div>
                        <div className="w-24"></div>
                        <div className="text-right w-24 pr-4">
                          <p className="font-bold text-amber-700 text-xs">
                            {getPriceDisplay(row.priceWithTax)}
                          </p>
                        </div>
                        <div className="text-right w-24 pr-4">
                          <span className="text-xs text-gray-500 font-bold">
                            {row.stockLevel || "—"}
                          </span>
                        </div>
                        <div className="w-20"></div>
                        <div className="w-24 pl-2">
                          <span className="text-[9px] text-gray-500 font-mono truncate block">
                            {row.sku}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Keep your existing pagination footer */}
            <div className="p-4 border-t border-slate-200/10 bg-slate-900 flex items-center justify-between z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]">
              {/* Your existing pagination code */}
            </div>

            {/* ✅ FIX 4: Only render side panels when needed */}
            {sidePanelType === "model" && (
              <ModelSidePanel
                models={models}
                stagedFilterId={stagedFilterId}
                setStagedFilterId={setStagedFilterId}
                sidePanelSearchTerm={sidePanelSearchTerm}
                setSidePanelSearchTerm={setSidePanelSearchTerm}
                onClose={() => setSidePanelType("none")}
                onApply={() => {
                  setModelFilterId(stagedFilterId);
                  setPage(1);
                  setSidePanelType("none");
                }}
                onClearFilter={() => {
                  setModelFilterId("all");
                  setPage(1);
                  setSidePanelType("none");
                }}
              />
            )}

            {sidePanelType === "category" && (
              <CategorySidePanel
                stagedFilterId={stagedFilterId}
                setStagedFilterId={setStagedFilterId}
                onClose={() => setSidePanelType("none")}
                onApply={() => {
                  setCategoryFilterId(stagedFilterId);
                  setPage(1);
                  setSidePanelType("none");
                }}
                onClearFilter={() => {
                  setCategoryFilterId("all");
                  setPage(1);
                  setSidePanelType("none");
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ FIX 5: Extract side panels to separate components
function ModelSidePanel({
  models,
  stagedFilterId,
  setStagedFilterId,
  sidePanelSearchTerm,
  setSidePanelSearchTerm,
  onClose,
  onApply,
  onClearFilter,
}: any) {
  return (
    <div className="absolute inset-y-0 right-0 w-[380px] bg-slate-900 border-l border-slate-200/10 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-200/10 flex justify-between items-center bg-slate-900/50 pt-6">
        <h3 className="text-lg font-bold text-gray-800">Modeller</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Modelleri gözle..."
            value={sidePanelSearchTerm}
            onChange={(e) => setSidePanelSearchTerm(e.target.value)}
            className="pl-9 h-10 text-sm border-gray-200"
          />
        </div>
      </div>
      <div className="p-4 flex-1 overflow-y-auto space-y-1">
        {models
          .filter((b: any) =>
            b.name.toLowerCase().includes(sidePanelSearchTerm.toLowerCase()),
          )
          .map((b: any) => (
            <label
              key={b.id}
              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
            >
              <input
                type="radio"
                name="sp-model-select"
                checked={stagedFilterId === b.id}
                onChange={() => setStagedFilterId(b.id)}
                className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
              />
              <span
                className={`text-sm ${stagedFilterId === b.id ? "font-bold text-teal-700" : "text-gray-600 group-hover:text-gray-800"}`}
              >
                {b.name}
              </span>
            </label>
          ))}
      </div>
      <div className="p-6 border-t bg-gray-50/50 flex flex-col gap-3">
        <Button
          onClick={onClearFilter}
          variant="ghost"
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 font-bold text-xs uppercase"
        >
          Filtersiz dowam et
        </Button>
        <Button
          onClick={onApply}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold shadow-lg shadow-teal-500/20 py-6"
        >
          <Save className="w-4 h-4 mr-2" />
          Saýlaň
        </Button>
      </div>
    </div>
  );
}

function CategorySidePanel({
  stagedFilterId,
  setStagedFilterId,
  onClose,
  onApply,
  onClearFilter,
}: any) {
  return (
    <div className="absolute inset-y-0 right-0 w-[380px] bg-slate-900 border-l border-slate-200/10 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-slate-200/10 flex justify-between items-center bg-slate-900/50 pt-6">
        <h3 className="text-lg font-bold text-gray-800">Kategoriýalar</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        <CategoryTreePicker
          selectedId={stagedFilterId}
          onChange={setStagedFilterId}
        />
      </div>
      <div className="p-6 border-t bg-gray-50/50 flex flex-col gap-3">
        <Button
          onClick={onClearFilter}
          variant="ghost"
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 font-bold text-xs uppercase"
        >
          Filtersiz dowam et
        </Button>
        <Button
          onClick={onApply}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold shadow-lg shadow-teal-500/20 py-6"
        >
          <Save className="w-4 h-4 mr-2" />
          Saýlaň
        </Button>
      </div>
    </div>
  );
}

function CategoryTreePicker({
  selectedId,
  onChange,
}: {
  selectedId: string;
  onChange: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ FIX 6: Add caching
  const { data: typesData } = useQuery<any>({
    queryKey: ["categoryTypes"],
    queryFn: () => api.query(GET_CATEGORY_TYPES),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const types = typesData?.categoryTypes?.items || [];
  const [activeTypeId, setActiveTypeId] = useState<string>("");

  useEffect(() => {
    if (!activeTypeId && types.length > 0) setActiveTypeId(types[0].id);
  }, [types, activeTypeId]);

  const { data: treeData, isLoading: treeLoading } = useQuery<any>({
    queryKey: ["categoryTree", activeTypeId],
    queryFn: () =>
      api.query(GET_CATEGORY_TREE, { categoryTypeId: activeTypeId }),
    enabled: !!activeTypeId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const tree = treeData?.categoryTree || [];

  const renderNodes = (nodes: any[], depth = 0) => {
    return nodes
      .filter((node) =>
        node.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .map((node) => (
        <div key={node.id}>
          <label
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
          >
            <input
              type="radio"
              name="sp-tree-select"
              checked={selectedId === node.id}
              onChange={() => onChange(node.id)}
              className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
            />
            <span
              className={`text-sm ${selectedId === node.id ? "font-bold text-teal-700" : "text-gray-600 group-hover:text-gray-800"}`}
            >
              {node.name}
            </span>
          </label>
          {node.children &&
            node.children.length > 0 &&
            renderNodes(node.children, depth + 1)}
        </div>
      ));
  };

  return (
    <div className="space-y-6">
      {/* Your existing CategoryTreePicker content */}
    </div>
  );
}
