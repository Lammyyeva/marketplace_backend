import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  api,
  DashboardFormComponentProps,
  Button,
  Input,
} from "@vendure/dashboard";
import { Search, X, Save } from "lucide-react";
import {
  GET_CATEGORY_TYPES,
  GET_CATEGORY_TREE,
  GET_CATEGORIES_BY_IDS,
} from "../../../category/api/category.queries";
import "./category-picker.css";

export interface CategoryPickerProps extends DashboardFormComponentProps {
  multiple?: boolean;
}

export function CategoryPicker({
  value,
  onChange,
  disabled,
  multiple = true,
}: CategoryPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([]);

  const selectedIds = useMemo(() => {
    if (!value) return [];
    if (multiple) {
      return Array.isArray(value)
        ? value.map((v: any) => (typeof v === "string" ? v : v?.id || v))
        : [];
    } else {
      const id = typeof value === "string" ? value : value?.id;
      return id ? [id] : [];
    }
  }, [value, multiple]);

  useEffect(() => {
    if (isOpen) {
      setLocalSelectedIds(selectedIds);
    }
  }, [isOpen, selectedIds]);

  const { data: typesData, isLoading: typesLoading } = useQuery<any>({
    queryKey: ["categoryTypes"],
    queryFn: () => api.query(GET_CATEGORY_TYPES),
    enabled: isOpen,
  });

  const categoryTypes = typesData?.categoryTypes?.items || [];

  const { data: selectedDetailsData } = useQuery<any>({
    queryKey: ["selectedCategoriesDetails", selectedIds.join(",")],
    queryFn: () => api.query(GET_CATEGORIES_BY_IDS, { ids: selectedIds }),
    enabled: selectedIds.length > 0 && !selectedType,
    staleTime: Infinity,
  });

  const selectedCategories = selectedDetailsData?.categories?.items || [];

  useEffect(() => {
    if (isOpen && !selectedType && selectedCategories.length > 0) {
      const firstType = selectedCategories[0].categoryType?.id;
      if (firstType) {
        setSelectedType(firstType);
      }
    } else if (isOpen && !selectedType && categoryTypes.length > 0) {
      setSelectedType(categoryTypes[0].id);
    }
  }, [isOpen, selectedCategories, selectedType, categoryTypes]);

  const { data: treeData, isLoading: treeLoading } = useQuery<any>({
    queryKey: ["categoryTree", selectedType],
    queryFn: () =>
      api.query(GET_CATEGORY_TREE, { categoryTypeId: selectedType }),
    enabled: isOpen && !!selectedType,
    retry: 1,
  });

  const rootCategories = treeData?.categoryTree || [];

  const categoryMap = useMemo(() => {
    const map = new Map<string, any>();

    function traverse(nodes: any[], parent?: any) {
      for (const node of nodes) {
        const entry = {
          ...node,
          parent: parent ? { id: parent.id, name: parent.name } : null,
        };
        map.set(String(node.id), entry);
        if (node.children && node.children.length > 0) {
          traverse(node.children, node);
        }
      }
    }

    traverse(rootCategories);
    return map;
  }, [rootCategories]);

  const getAllChildIds = (id: string): string[] => {
    const ids = [id];
    const category = categoryMap.get(id);
    if (category?.children) {
      category.children.forEach((child: any) => {
        ids.push(...getAllChildIds(String(child.id)));
      });
    }
    return Array.from(new Set(ids));
  };

  const getAllParentIds = (id: string): string[] => {
    const parentIds: string[] = [];
    let currentCategory = categoryMap.get(id);
    while (currentCategory?.parent) {
      const parentId = String(currentCategory.parent.id);
      parentIds.push(parentId);
      currentCategory = categoryMap.get(parentId);
    }
    return parentIds;
  };

  const handleCheck = (category: any, isChecked: boolean) => {
    const id = String(category.id);
    if (!multiple) {
      setLocalSelectedIds(isChecked ? [id] : []);
      return;
    }

    const childIds = getAllChildIds(id);
    const parentIds = getAllParentIds(id);
    let updatedIds: string[];
    if (isChecked) {
      updatedIds = Array.from(
        new Set([...localSelectedIds, ...childIds, ...parentIds]),
      );
    } else {
      updatedIds = localSelectedIds.filter(
        (val) => !childIds.includes(String(val)),
      );
    }
    setLocalSelectedIds(updatedIds);
  };

  const handleSave = () => {
    if (multiple) {
      onChange(localSelectedIds);
    } else {
      onChange(localSelectedIds.length > 0 ? localSelectedIds[0] : null);
    }
    setIsOpen(false);
  };

  const displayValue = useMemo(() => {
    if (selectedIds.length === 0) return "Select category";
    if (multiple) return `${selectedIds.length} categories selected`;

    // In single mode, try to find the category name
    const id = selectedIds[0];
    const category =
      categoryMap.get(id) ||
      selectedCategories.find((c: any) => String(c.id) === id);
    return category?.name || "Category selected";
  }, [selectedIds, multiple, categoryMap, selectedCategories]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
          disabled={disabled}
          className="min-w-[200px] justify-start text-left font-normal bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-200/10 text-slate-800 dark:text-slate-200"
        >
          {displayValue}
        </Button>
        {selectedIds.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => onChange(multiple ? [] : null)}
            disabled={disabled}
          >
            <X className="w-4 h-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-200/10 rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-200/10">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Saýlaň</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-600 dark:text-slate-200 hover:text-slate-800 dark:hover:text-slate-300 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type Selection */}
            <div className="px-4 pt-4 pb-2 border-b border-slate-200 dark:border-slate-200/10 bg-slate-50 dark:bg-slate-900/50">
              <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
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
                      name="category-type-picker"
                      value={type.id}
                      checked={selectedType === type.id}
                      onChange={() => setSelectedType(type.id)}
                      className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                    <span
                      className={`text-sm ${selectedType === type.id ? "font-medium text-teal-600 dark:text-cyan-400" : "text-slate-700 dark:text-slate-200"}`}
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
                  className="pl-9 bg-white dark:bg-slate-800/50 w-full border border-slate-300 dark:border-slate-200/10 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 min-h-[200px]">
              {treeLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Loading categories...
                </div>
              ) : rootCategories.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  Kategoriýa tapylmady
                </div>
              ) : (
                <div className="space-y-1">
                  {rootCategories
                    .filter(
                      (cat) =>
                        cat.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        cat.children?.some((c: any) =>
                          c.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                        ),
                    )
                    .map((category) => (
                      <CategoryItem
                        key={category.id}
                        category={category}
                        categoryMap={categoryMap}
                        expanded={true}
                        selectedIds={localSelectedIds}
                        onCheck={handleCheck}
                        searchTerm={searchTerm}
                        multiple={multiple}
                      />
                    ))}
                </div>
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

function CategoryItem({
  category,
  categoryMap,
  expanded,
  selectedIds,
  onCheck,
  searchTerm,
  multiple,
}: {
  category: any;
  categoryMap: Map<string, any>;
  expanded: boolean;
  selectedIds: string[];
  onCheck: (category: any, checked: boolean) => void;
  searchTerm: string;
  multiple?: boolean;
}) {
  const id = String(category.id);
  const fullCategory = categoryMap.get(id) || category;
  const hasChildren = fullCategory.children && fullCategory.children.length > 0;
  const isSelected = selectedIds.includes(id);

  // Determine if this item or any child matches search
  const matchesSearch = category.name
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
  const hasMatchingChild = fullCategory.children?.some(
    (c: any) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categoryMap
        .get(String(c.id))
        ?.children?.some((cc: any) =>
          cc.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
  );

  if (searchTerm && !matchesSearch && !hasMatchingChild) return null;

  return (
    <div className="category-item">
      <label className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-md cursor-pointer transition-colors">
        <div
          style={{ marginLeft: `${(category.depth || 0) * 20}px` }}
          className="flex items-center gap-3"
        >
          <input
            type={multiple ? "checkbox" : "radio"}
            checked={isSelected}
            onChange={(e) => onCheck(category, e.target.checked)}
            className={`w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500 ${multiple ? "rounded" : "rounded-full"}`}
          />
          <span
            className={`text-sm ${isSelected ? "font-medium text-teal-600 dark:text-cyan-400" : "text-slate-700 dark:text-slate-200"}`}
          >
            {category.name}
          </span>
        </div>
      </label>

      {hasChildren && expanded && (
        <div className="ml-4">
          {fullCategory.children.map((child: any) => (
            <CategoryItem
              key={child.id}
              category={{ ...child, depth: (category.depth || 0) + 1 }}
              categoryMap={categoryMap}
              expanded={true}
              selectedIds={selectedIds}
              onCheck={onCheck}
              searchTerm={searchTerm}
              multiple={multiple}
            />
          ))}
        </div>
      )}
    </div>
  );
}
