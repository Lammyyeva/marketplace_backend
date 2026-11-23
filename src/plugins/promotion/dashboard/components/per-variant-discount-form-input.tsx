import {
  api,
  Button,
  DashboardFormComponent,
  graphql,
  Input,
} from "@vendure/dashboard";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Trash2, X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";

const SEARCH_VARIANTS = graphql(`
  query SearchVariants($term: String) {
    productVariants(
      options: { filter: { name: { contains: $term } }, take: 10 }
    ) {
      items {
        id
        name
        sku
        product {
          name
        }
      }
    }
  }
`);

const GET_VARIANT_SOLD_COUNTS = graphql(`
  query GetVariantSoldCounts($promotionId: ID!, $variantIds: [ID!]!) {
    variantSoldCountsForPromotion(
      promotionId: $promotionId
      variantIds: $variantIds
    ) {
      variantId
      soldCount
      remaining
      isExhausted
    }
  }
`);

interface VariantDiscountEntry {
  variantId: string;
  variantName?: string;
  variantSku?: string;
  discount: number;
  maxQtyPerOrder: number;
  totalUnitsLimit: number;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {}
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded">
          <p className="font-medium text-sm">
            Wariant arzanladyş kartini ýükläp bolmady
          </p>
          <p className="text-xs opacity-80 mt-1">
            Vendure v3-däki editor gapma-garşylygy sebäpli ýalňyşlyk ýüze çykdy.
            Sahypany täzeläp görüň.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const PerVariantDiscountFormInputInternal: DashboardFormComponent = ({
  value,
  onChange,
}) => {
  // Use error level to ensure it's not filtered out during crashes
  const [entries, setEntries] = useState<VariantDiscountEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [promotionId, setPromotionId] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Resolve promotionId from URL: /promotions/30
    const parts = window.location.pathname.split("/");
    const lastPart = parts[parts.length - 1];
    if (lastPart && !isNaN(Number(lastPart))) {
      setPromotionId(lastPart);
    }
  }, []);

  // Load saved data from the value prop when it arrives.
  useEffect(() => {
    if (hasInitialized.current) return;
    if (!value || value === "[]") return;

    // Handle case where value is already a parsed array/object
    if (Array.isArray(value)) {
      if (value.length > 0) {
        setEntries(value);
        hasInitialized.current = true;
      }
      return;
    }

    // Handle case where value is a JSON string
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
          hasInitialized.current = true;
        }
      } catch {
        // malformed JSON
      }
    }
  }, [value]);

  const { data: searchData, isLoading: isSearching } = useQuery({
    queryKey: ["searchVariants", searchTerm],
    queryFn: () => api.query(SEARCH_VARIANTS, { term: searchTerm }),
    enabled: searchTerm.length > 2,
  });

  const variantIds = entries.map((e) => String(e.variantId));
  const { data: soldCountsData, isLoading: isSoldLoading } = useQuery({
    queryKey: ["variantSoldCounts", promotionId, variantIds],
    queryFn: () =>
      api.query(GET_VARIANT_SOLD_COUNTS, {
        promotionId: promotionId!,
        variantIds,
      }),
    enabled: !!promotionId && variantIds.length > 0,
  });

  const soldMap = new Map<string, any>(
    (soldCountsData as any)?.variantSoldCountsForPromotion?.map((s: any) => [
      String(s.variantId),
      s,
    ]) || [],
  );

  const updateEntries = (newEntries: VariantDiscountEntry[]) => {
    setEntries(newEntries);
    onChange(JSON.stringify(newEntries));
  };

  const addVariant = (variant: any) => {
    if (entries.some((e) => String(e.variantId) === String(variant.id))) {
      setDropdownOpen(false);
      setSearchTerm("");
      return;
    }
    const newEntry: VariantDiscountEntry = {
      variantId: variant.id,
      variantName: `${variant.product.name} - ${variant.name}`,
      variantSku: variant.sku,
      discount: 10,
      maxQtyPerOrder: 0,
      totalUnitsLimit: 0,
    };
    updateEntries([...entries, newEntry]);
    setDropdownOpen(false);
    setSearchTerm("");
  };

  const removeEntry = (index: number) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    updateEntries(newEntries);
  };

  const updateEntryField = (
    index: number,
    field: keyof VariantDiscountEntry,
    val: any,
  ) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: val };
    updateEntries(newEntries);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-200/10 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header / Search */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-200/10 relative">
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-200" />
            <Input
              placeholder="Search variants to add..."
              value={searchTerm}
              onChange={(e: any) => {
                setSearchTerm(e.target.value);
                setDropdownOpen(true);
              }}
              onFocus={() => setDropdownOpen(true)}
              className="pl-9 pr-10 w-full"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4 text-slate-400 dark:text-slate-200" />
              </button>
            )}
          </div>

          {isDropdownOpen && searchTerm.length > 2 && (
            <div className="absolute z-[100] w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-200/10 rounded-md shadow-xl max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-center text-sm text-slate-500 dark:text-slate-200 animate-pulse">
                  Gözlenilýär...
                </div>
              ) : (searchData as any)?.productVariants?.items?.length ? (
                (searchData as any).productVariants.items.map((v: any) => (
                  <button
                    key={v.id}
                    type="button"
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-200 dark:border-slate-200/10 last:border-none flex flex-col items-start"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addVariant(v);
                    }}
                  >
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-200 leading-tight">
                      {v.product?.name || "Product"} - {v.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono mt-0.5">
                      {v.sku}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-sm text-slate-500 dark:text-slate-200">
                  Netije tapylmady
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-200/10">
              <th className="px-4 py-3 min-w-[300px]">Product Variant</th>
              <th className="px-4 py-3 text-center w-32 border-l border-slate-200 dark:border-slate-200/10">
                Discount %
              </th>
              <th className="px-4 py-3 text-center w-32 border-l border-slate-200 dark:border-slate-200/10">Max Qty</th>
              <th className="px-4 py-3 text-center w-32 border-l border-slate-200 dark:border-slate-200/10">
                Total Limit
              </th>
              <th className="px-4 py-3 text-center w-32 border-l border-slate-200 dark:border-slate-200/10">Sold</th>
              <th className="px-4 py-3 text-right w-16 border-l border-slate-200 dark:border-slate-200/10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:border-slate-200/10 italic">
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-slate-500 dark:text-slate-200 text-sm"
                >
                  Goşmak üçin ýokardaky gözlegden peýdalanyň.
                </td>
              </tr>
            ) : (
              entries.map((entry, idx) => (
                <tr
                  key={String(entry.variantId)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {entry.variantName || `ID: ${entry.variantId}`}
                      </span>
                      <span className="text-xs text-gray-500 font-mono mt-0.5">
                        {entry.variantSku || "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-l border-slate-200 dark:border-slate-200/10">
                    <div className="relative flex items-center justify-center">
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        value={entry.discount}
                        onChange={(e: any) =>
                          updateEntryField(
                            idx,
                            "discount",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="text-center w-20 h-8 pr-6 text-sm"
                      />
                      <span className="absolute right-5 text-[10px] font-bold text-slate-900 dark:text-slate-200 pointer-events-none">
                        %
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-l border-slate-200 dark:border-slate-200/10">
                    <div className="flex justify-center">
                      <Input
                        type="number"
                        min="0"
                        placeholder="∞"
                        value={
                          entry.maxQtyPerOrder === 0 ? "" : entry.maxQtyPerOrder
                        }
                        onChange={(e: any) =>
                          updateEntryField(
                            idx,
                            "maxQtyPerOrder",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="text-center w-20 h-8 text-sm"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 border-l border-slate-200 dark:border-slate-200/10">
                    <div className="flex justify-center">
                      <Input
                        type="number"
                        min="0"
                        placeholder="∞"
                        value={
                          entry.totalUnitsLimit === 0
                            ? ""
                            : entry.totalUnitsLimit
                        }
                        onChange={(e: any) =>
                          updateEntryField(
                            idx,
                            "totalUnitsLimit",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="text-center w-20 h-8 text-sm"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 border-l border-slate-200 dark:border-slate-200/10">
                    <div className="flex justify-center flex-col items-center">
                      {!promotionId ? (
                        <span className="text-slate-400 dark:text-slate-200 text-xs">—</span>
                      ) : isSoldLoading && entries.length > 0 ? (
                        <div className="w-8 h-4 bg-gray-100 animate-pulse rounded" />
                      ) : (
                        <span
                          className={`text-sm font-medium ${
                            soldMap.get(String(entry.variantId))?.isExhausted
                              ? "text-red-500 font-bold"
                              : "text-slate-900 dark:text-slate-200"
                          }`}
                        >
                          {soldMap.get(String(entry.variantId))?.soldCount ?? 0}
                          {entry.totalUnitsLimit > 0 && (
                            <span className="text-slate-400 font-normal">
                              /{entry.totalUnitsLimit}
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right border-l border-slate-200 dark:border-slate-200/10">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeEntry(idx)}
                      className="p-1.5 h-auto text-slate-400 dark:text-slate-200 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const PerVariantDiscountFormInput: DashboardFormComponent = (props) => (
  <ErrorBoundary>
    <PerVariantDiscountFormInputInternal {...props} />
  </ErrorBoundary>
);
