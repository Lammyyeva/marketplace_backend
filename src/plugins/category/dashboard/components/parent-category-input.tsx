import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  GET_CATEGORIES,
  GET_CATEGORY_TYPES,
  GET_CATEGORY_TREE,
} from "../../api/category.queries";
import { Button, Input, api } from "@vendure/dashboard";
import { Search, X, Check, Save } from "lucide-react";

export function ParentCategoryInput({
  value,
  onChange,
  currentCategoryId,
  parentName,
  initialTypeId,
}: {
  value: string | null;
  onChange: (val: string | null, name: string, categoryTypeId?: string) => void;
  currentCategoryId?: string;
  parentName?: string;
  initialTypeId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [localValue, setLocalValue] = useState<string | null>(value);
  const [localName, setLocalName] = useState<string>(parentName || "");
  const [selectedType, setSelectedType] = useState<string | undefined>(
    initialTypeId,
  );

  useEffect(() => {
    if (isOpen && initialTypeId && !selectedType && !categoryTypes.length) {
      setSelectedType(initialTypeId);
    }
  }, [isOpen, initialTypeId]);

  const { data: typesData } = useQuery({
    queryKey: ["category-types-parent-modal"],
    queryFn: () => api.query(GET_CATEGORY_TYPES),
    enabled: isOpen,
  });

  const categoryTypes = typesData?.categoryTypes?.items || [];

  // Select the first type by default if none is selected
  useEffect(() => {
    if (isOpen && !selectedType && categoryTypes.length > 0) {
      setSelectedType(initialTypeId || categoryTypes[0].id);
    }
  }, [isOpen, selectedType, categoryTypes, initialTypeId]);

  const { data } = useQuery({
    queryKey: ["category-tree-modal", selectedType],
    queryFn: () =>
      api.query(GET_CATEGORY_TREE, { categoryTypeId: selectedType }),
    enabled: isOpen && !!selectedType,
  });

  const categories = data?.categoryTree || [];

  const flatTree = useMemo(() => {
    const flatten = (items: any[], depth = 0): any[] => {
      let list: any[] = [];
      for (const item of items) {
        if (item.id === currentCategoryId) continue;
        list.push({ ...item, depth });
        if (item.children) {
          list = [...list, ...flatten(item.children, depth + 1)];
        }
      }
      return list;
    };

    let result = flatten(categories);

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(lowerSearch));
    }

    return result;
  }, [categories, currentCategoryId, searchTerm]);

  const handleOpen = () => {
    setLocalValue(value);
    setLocalName(parentName || "");
    setSelectedType(initialTypeId || categoryTypes[0]?.id);
    setIsOpen(true);
  };

  const handleSave = () => {
    onChange(localValue, localName, selectedType);
    setIsOpen(false);
  };

  const displayValue = value ? parentName : "Select category";

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleOpen}
          className="min-w-[200px] justify-start text-left font-bold bg-slate-50 dark:bg-slate-500/5 border-slate-200 dark:border-slate-200/10 text-slate-900 dark:text-slate-200"
        >
          {displayValue}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => onChange(null, "")}
          >
            <X className="w-4 h-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-all"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-200/10 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200/10">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200">Saýlaň</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 dark:text-slate-200 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type Selection */}
            <div className="px-4 pt-4 pb-2 border-b border-slate-200 dark:border-slate-200/10 bg-slate-50 dark:bg-slate-900/50">
              <div className="mb-2 text-sm font-bold text-slate-900 dark:text-slate-200">
                Category Type
              </div>
              <div className="flex flex-wrap gap-4">
                {categoryTypes.map((type: any) => (
                  <label
                    key={type.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category-type"
                      value={type.id}
                      checked={selectedType === type.id}
                      onChange={() => {
                        setSelectedType(type.id);
                        setLocalValue(null);
                        setLocalName("");
                      }}
                      className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                    <span
                      className={`text-sm ${selectedType === type.id ? "font-bold text-cyan-500" : "font-bold text-slate-900 dark:text-slate-200"}`}
                    >
                      {type.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-200/10 bg-slate-50 dark:bg-slate-900/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Gözleg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white dark:bg-slate-800/50 w-full border-slate-200 dark:border-slate-200/10 text-slate-900 dark:text-slate-200 font-bold"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 min-h-[200px]">
              {flatTree.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  Kategoriýa tapylmady
                </div>
              ) : (
                flatTree.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-md cursor-pointer transition-colors"
                    style={{ paddingLeft: `${cat.depth * 28 + 8}px` }}
                  >
                    <input
                      type="radio"
                      name="parent-category"
                      value={cat.id}
                      checked={localValue === cat.id}
                      onChange={() => {
                        setLocalValue(cat.id);
                        setLocalName(cat.name);
                      }}
                      className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                    <span
                      className={`text-sm ${localValue === cat.id ? "font-bold text-cyan-500" : "font-bold text-slate-900 dark:text-slate-200"}`}
                    >
                      {cat.name}
                    </span>
                  </label>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-200/10 flex justify-end bg-slate-50 dark:bg-slate-900/50 rounded-b-lg">
              <Button
                type="button"
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Saýlaň
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
