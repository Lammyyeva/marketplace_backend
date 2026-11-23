import { api, Button, graphql, Input } from "@vendure/dashboard";
import { useQuery } from "@tanstack/react-query";
import { Search, Trash2, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const SEARCH_FACET_VALUES = graphql(`
  query SearchFacetValues($term: String) {
    facetValues(options: { filter: { name: { contains: $term } }, take: 10 }) {
      items {
        id
        name
        facet {
          id
          name
        }
      }
    }
  }
`);

export interface FacetDiscountEntry {
  facetValueId: string;
  facetValueName?: string;
  discount: number;
}

export const FacetDiscountFormInput = ({ value, onChange }) => {
  const [entries, setEntries] = useState<FacetDiscountEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Load saved data on first mount.
  // value is a JSON string when persisted by Vendure; parse it into entries state.
  useEffect(() => {
    if (hasInitialized.current) return;
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;
      if (Array.isArray(parsed) && parsed.length > 0) {
        setEntries(parsed);
      }
    } catch {
      // stay empty if value is not valid JSON yet
    }
    hasInitialized.current = true;
  }, []);

  const { data: searchData, isLoading: isSearching } = useQuery({
    queryKey: ["searchFacetValues", searchTerm],
    queryFn: () => api.query(SEARCH_FACET_VALUES, { term: searchTerm }),
    enabled: searchTerm.length > 1,
  });

  const updateEntries = (newEntries: FacetDiscountEntry[]) => {
    setEntries(newEntries);
    onChange(JSON.stringify(newEntries));
  };

  const addFacetValue = (fv: any) => {
    if (entries.some((e) => String(e.facetValueId) === String(fv.id))) {
      setDropdownOpen(false);
      setSearchTerm("");
      return;
    }
    const newEntry: FacetDiscountEntry = {
      facetValueId: fv.id,
      facetValueName: `${fv.facet.name} / ${fv.name}`,
      discount: 10,
    };
    updateEntries([...entries, newEntry]);
    setDropdownOpen(false);
    // setSearchTerm("");
  };

  const removeEntry = (index: number) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    updateEntries(newEntries);
  };

  const updateDiscount = (index: number, val: number) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], discount: val };
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
              placeholder="Search model facets to add..."
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

          {isDropdownOpen && searchTerm.length > 1 && (
            <div className="absolute z-[100] w-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-200/10 rounded-md shadow-xl max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-center text-sm text-gray-400 animate-pulse">
                  Searching facets...
                </div>
              ) : (searchData as any)?.facetValues?.items?.length ? (
                (searchData as any).facetValues.items.map((fv: any) => (
                  <button
                    key={fv.id}
                    type="button"
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800/50 border-b border-slate-200 dark:border-slate-200/10 last:border-none flex flex-col items-start"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addFacetValue(fv);
                    }}
                  >
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-200 leading-tight">
                      {fv.name}
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5">
                      in {fv.facet.name}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-sm text-gray-400">
                  No facet value found
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
              <th className="px-4 py-3 min-w-[300px]">Facet Value</th>
              <th className="px-4 py-3 text-center w-40 border-l border-slate-200 dark:border-slate-200/10">
                Discount %
              </th>
              <th className="px-4 py-3 text-right w-16 border-l border-slate-200 dark:border-slate-200/10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:border-slate-200/10">
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-12 text-center text-gray-400 text-sm italic"
                >
                  Search facets above to add model-based discounts.
                </td>
              </tr>
            ) : (
              entries.map((entry, idx) => {
                return (
                  <tr
                    key={String(entry.facetValueId)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {entry.facetValueName || `ID: ${entry.facetValueId}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-l border-slate-200 dark:border-slate-200/10">
                      <div className="relative flex items-center justify-center">
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={entry.discount}
                          onChange={(e: any) =>
                            updateDiscount(idx, parseInt(e.target.value) || 0)
                          }
                          className="text-center w-24 h-8 pr-6 text-sm"
                        />
                        <span className="absolute right-7 text-[10px] font-bold text-slate-900 dark:text-slate-200 pointer-events-none">
                          %
                        </span>
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
