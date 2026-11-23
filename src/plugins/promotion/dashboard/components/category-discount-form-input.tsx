import {
  api,
  Button,
  DashboardFormComponent,
  graphql,
  Input,
} from "@vendure/dashboard";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronRight,
  Layers,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";

/**
 * Queries
 */
const GET_ALL_CATEGORY_TYPES = graphql(`
  query GetAllCategoryTypesInModal {
    categoryTypes(options: { take: 100 }) {
      items {
        id
        name
        slug
      }
    }
  }
`);

const GET_CATEGORY_TREE = graphql(`
  query GetCategoryTreeInModal($typeId: ID) {
    categoryTree(categoryTypeId: $typeId) {
      id
      name
      slug
      children {
        id
        name
        slug
        children {
          id
          name
          slug
          children {
            id
            name
            slug
          }
        }
      }
    }
  }
`);

export interface CategoryDiscountEntry {
  categoryId: string;
  categoryName?: string;
  discount: number;
}

export const CategoryDiscountFormInput: DashboardFormComponent = ({
  value,
  onChange,
}) => {
  const [entries, setEntries] = useState<CategoryDiscountEntry[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTypeId, setActiveTypeId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const hasInitialized = useRef(false);

  // Load saved data on first mount.
  // value is a JSON string when persisted by Vendure; parse it into entries state.
  useEffect(() => {
    if (hasInitialized.current) return;
    try {
      const parsed = typeof value === "string" ? JSON.parse(value || "[]") : value;
      if (Array.isArray(parsed) && parsed.length > 0) {
        setEntries(parsed);
      }
    } catch {
      // stay empty if value is not valid JSON yet
    }
    hasInitialized.current = true;
  }, []);

  const updateEntries = (newEntries: CategoryDiscountEntry[]) => {
    setEntries(newEntries);
    onChange(JSON.stringify(newEntries));
  };

  const addCategory = (cat: any, typeName: string) => {
    if (entries.some((e) => String(e.categoryId) === String(cat.id))) return;
    const newEntry: CategoryDiscountEntry = {
      categoryId: cat.id,
      categoryName: `${typeName} / ${cat.name}`,
      discount: 10,
    };
    updateEntries([...entries, newEntry]);
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

  /**
   * Selection Modal Components
   */
  const { data: typesData } = useQuery({
    queryKey: ["allCategoryTypesModal"],
    queryFn: () => api.query(GET_ALL_CATEGORY_TYPES, {}),
    enabled: isModalOpen,
  });

  const categoryTypes = useMemo(
    () => (typesData as any)?.categoryTypes?.items || [],
    [typesData],
  );

  useEffect(() => {
    if (isModalOpen && !activeTypeId && categoryTypes.length > 0) {
      setActiveTypeId(categoryTypes[0].id);
    }
  }, [isModalOpen, categoryTypes, activeTypeId]);

  const { data: treeData, isLoading: isLoadingTree } = useQuery({
    queryKey: ["categoryTreeModal", activeTypeId],
    queryFn: () => api.query(GET_CATEGORY_TREE, { typeId: activeTypeId }),
    enabled: !!activeTypeId && isModalOpen,
  });

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) newExpanded.delete(nodeId);
    else newExpanded.add(nodeId);
    setExpandedNodes(newExpanded);
  };

  const activeTypeName =
    categoryTypes.find((t: any) => t.id === activeTypeId)?.name || "";

  // Recursive Tree Fragment
  const RenderTree = ({
    nodes,
    level = 0,
  }: {
    nodes: any[];
    level?: number;
  }) => {
    if (!nodes || nodes.length === 0) return null;

    return (
      <div
        className={`${level > 0 ? "ml-5 mt-1 border-l pl-2 border-slate-200/10" : "space-y-1"}`}
      >
        {nodes.map((node) => {
          const hasChildren = node.children && node.children.length > 0;
          const isOpen = expandedNodes.has(node.id);
          const isSelected = entries.some(
            (e) => String(e.categoryId) === String(node.id),
          );

          return (
            <div key={node.id} className="group">
              <div
                className={`flex items-center justify-between p-1.5 rounded-md hover:bg-cyan-500/10 transition-colors ${
                  isSelected ? "bg-cyan-500/20 text-cyan-400" : ""
                }`}
              >
                <div
                  className="flex items-center flex-1 cursor-default min-w-0"
                  onClick={() => hasChildren && toggleNode(node.id)}
                >
                  {hasChildren ? (
                    isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                    )
                  ) : (
                    <div className="w-3.5 h-3.5 mr-2 shrink-0" />
                  )}
                  <span
                    className={`text-[13px] truncate ${isSelected ? "font-bold" : "text-slate-900 dark:text-slate-200"}`}
                  >
                    {node.name}
                  </span>
                </div>

                <div className="ml-2 flex-shrink-0">
                  {isSelected ? (
                    <div className="text-[10px] bg-teal-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                      ADDED
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addCategory(node, activeTypeName)}
                      className="opacity-0 group-hover:opacity-100 text-teal-600 hover:text-teal-800 p-1 flex items-center gap-1 text-[11px] font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" /> ADD
                    </button>
                  )}
                </div>
              </div>
              {hasChildren && isOpen && (
                <RenderTree nodes={node.children} level={level + 1} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-200/10 bg-white dark:bg-slate-900 shadow-sm overflow-hidden min-h-[120px]">
      {/* Promotion Action Main Form */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-200/10 flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Category Discount Rules
        </h3>
        <Button
          type="button"
          size="small"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5" />
          Manage Categories
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider border-b border-slate-200 dark:border-slate-200/10">
              <th className="px-4 py-3 min-w-[300px]">Target Category</th>
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
                  No rules yet. Click "Manage Categories" to select targets.
                </td>
              </tr>
            ) : (
              entries.map((entry, idx) => (
                <tr
                  key={String(entry.categoryId)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                      {entry.categoryName || `ID: ${entry.categoryId}`}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Hierarchical Selection Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-10">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-200/10 rounded-xl shadow-2xl w-full max-w-5xl h-full flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-200/10 flex justify-between items-center bg-cyan-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold leading-none">
                    Select Promotion Categories
                  </h2>
                  <p className="text-teal-50 text-[11px] mt-1 uppercase tracking-wider font-medium">
                    Browse & Multi-select Targets
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-teal-50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body: Sidebar + Tree View */}
            <div className="flex-1 flex overflow-hidden">
              {/* Type Sidebar */}
              <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-200/10 overflow-y-auto p-4 flex flex-col gap-1">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-200 uppercase tracking-widest px-2 mb-2">
                  Category Types
                </p>
                {categoryTypes.map((type: any) => (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => setActiveTypeId(type.id)}
                    className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeTypeId === type.id
                        ? "bg-white dark:bg-slate-800 shadow-sm ring-1 ring-cyan-500/10 text-cyan-500 dark:text-cyan-400"
                        : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>

              {/* Hierarchical content */}
              <div className="flex-1 overflow-y-auto p-8 relative">
                {isLoadingTree ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-sm text-slate-200">
                        Loading Tree Structure...
                      </p>
                    </div>
                  </div>
                ) : (treeData as any)?.categoryTree?.length ? (
                  <div className="max-w-2xl mx-auto">
                    <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-200 mb-6 border-b border-slate-200 dark:border-slate-200/10 pb-4">
                      <span className="text-teal-600"> {activeTypeName}</span>{" "}
                      Hierarchical Tree
                    </h4>
                    <RenderTree nodes={(treeData as any).categoryTree} />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300">
                    <p>Select a category type to browse its tree</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-200/10 flex justify-between items-center">
              <div className="text-sm text-slate-900 dark:text-slate-200">
                <span className="font-bold text-teal-600">
                  {entries.length}
                </span>{" "}
                categories targeted in this promotion
              </div>
              <Button
                type="button"
                variant="primary"
                onClick={() => setModalOpen(false)}
              >
                Done Selection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
