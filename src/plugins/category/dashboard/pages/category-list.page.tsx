import { useAdminTranslation } from "../../../../common/dashboard/use-admin-translation";
import en from "../translations/en.json";
import ru from "../translations/ru.json";
import tk from "../translations/tk.json";
import {
  Button,
  DetailPageButton,
  ListPage,
  VendureImage,
  Card,
  RadioGroup,
  RadioGroupItem,
  Label,
  DataTable,
  Page,
  PageLayout,
  PageBlock,
  PageTitle,
  PageActionBar,
  PageActionBarRight,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  api,
  graphql,
} from "@vendure/dashboard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  PlusIcon,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  MoreVerticalIcon,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import {
  GET_CATEGORIES,
  GET_CATEGORY_TYPES,
  DELETE_CATEGORY,
  GET_CATEGORY_TREE,
} from "../../api/category.queries";
import { toast } from "sonner";

export function CategoryListPage({ route }: { route: any }) {
  const { t } = useAdminTranslation({ en, ru, tk });
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<any[]>([{ id: "sort", desc: false }]);

  const queryClient = useQueryClient();

  const { data: typesData } = useQuery({
    queryKey: ["category-types"],
    queryFn: () => api.query(GET_CATEGORY_TYPES),
  });
  const types = (typesData as any)?.categoryTypes?.items || [];

  useEffect(() => {
    if (!selectedTypeId && types.length > 0) {
      setSelectedTypeId(types[0].id);
    }
  }, [types, selectedTypeId]);

  const sortParam = useMemo(() => {
    if (sorting.length === 0) return { sort: "ASC" };
    const { id, desc } = sorting[0];
    return { [id]: desc ? "DESC" : "ASC" };
  }, [sorting]);

  // Fetch category tree for the selected type
  const { data: treeData, isLoading } = useQuery({
    queryKey: ["category-tree", selectedTypeId],
    queryFn: () =>
      api.query(GET_CATEGORY_TREE, {
        categoryTypeId: selectedTypeId,
      }),
    enabled: !!selectedTypeId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.mutate(DELETE_CATEGORY, { id }),
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const allCategories = (treeData as any)?.categoryTree || [];

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // Flatten tree logic for DataTable
  const visibleItems = useMemo(() => {
    const flatten = (items: any[], depth = 0): any[] => {
      let list: any[] = [];
      for (const item of items) {
        const isExpanded = expandedIds.has(item.id);
        const hasChildren = (item.children?.length ?? 0) > 0;

        list.push({ ...item, depth, isHeader: false });

        if (isExpanded && hasChildren) {
          list.push({
            id: `header-${item.id}`,
            parentId: item.id,
            depth: depth + 1,
            isHeader: true,
            name: "Sub-Categories Header",
          });
          list = [...list, ...flatten(item.children, depth + 1)];
        }
      }
      return list;
    };

    if (searchTerm) {
      // Fallback for search: flatten everything and filter
      const flattenAll = (items: any[]): any[] => {
        let list: any[] = [];
        for (const item of items) {
          list.push({ ...item, depth: 0, isHeader: false });
          if (item.children) list = [...list, ...flattenAll(item.children)];
        }
        return list;
      };
      return flattenAll(allCategories as any[]).filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return flatten(allCategories as any[], 0);
  }, [allCategories, expandedIds, searchTerm]);

  return (
    <Page pageId="category-list">
      <PageTitle>{t("list.title")}</PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          <Button
            asChild
            className="bg-cyan-500 hover:bg-cyan-600 text-white rounded shadow-sm border-none px-4 h-9"
          >
            <Link to="./new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add
            </Link>
          </Button>
        </PageActionBarRight>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="main" blockId="category-list-main">
          {/* Filters Bar */}
          <div className="px-6 py-3 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              <RadioGroup
                value={selectedTypeId || ""}
                onValueChange={setSelectedTypeId}
                className="flex flex-wrap gap-4"
              >
                {types.map((type) => (
                  <div key={type.id} className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={type.id}
                      id={type.id}
                      className="text-cyan-500 border-cyan-500 h-4 w-4"
                    />
                    <Label
                      htmlFor={type.id}
                      className="cursor-pointer text-sm font-bold text-slate-900 dark:text-slate-200"
                    >
                      {type.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 py-1.5 text-xs border rounded-md w-64 bg-transparent focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                />
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-200">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-900 dark:text-slate-200 font-bold">Enabled</span>
                <select className="text-xs border rounded px-2 py-1 outline-none text-slate-900 dark:text-slate-200 font-bold bg-transparent border-slate-200 dark:border-slate-700">
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Enabled</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Disabled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="overflow-x-auto">
            <DataTable
              data={visibleItems}
              isLoading={isLoading}
              className="border-none shadow-none rounded-none"
              setTableOptions={(options) => ({
                ...options,
                state: {
                  ...options.state,
                  sorting,
                },
                onSortingChange: setSorting,
                enableMultiSort: false,
                manualSorting: true,
                meta: {
                  getRowClassName: (row: any) =>
                    row.original.isHeader
                      ? "bg-slate-100/50 dark:bg-slate-50/5 border-y border-slate-200 dark:border-slate-200/10"
                      : "",
                },
              })}
              columns={[
                {
                  id: "id",
                  header: ({ column }: any) => (
                    <button
                      onClick={(e) => {
                        setSorting((old) => {
                          const isCurrent = old[0]?.id === "id";
                          return [
                            {
                              id: "id",
                              desc: isCurrent ? !old[0].desc : false,
                            },
                          ];
                        });
                      }}
                      className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors text-xs font-bold text-slate-900 dark:text-slate-200 group w-full justify-start py-2 px-1"
                    >
                      {sorting[0]?.id === "id" ? (
                        sorting[0].desc ? (
                          <ArrowDown className="w-3.5 h-3.5 text-cyan-600" />
                        ) : (
                          <ArrowUp className="w-3.5 h-3.5 text-cyan-600" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-200 opacity-40 group-hover:opacity-100" />
                      )}
                      ID
                    </button>
                  ),
                  enableSorting: true,
                  cell: ({ row }) => {
                    const original = row.original as any;
                    if (original.isHeader) {
                      return (
                        <span
                          style={{
                            marginLeft: `${original.depth * 1.5 + 1.75}rem`,
                          }}
                          className="text-[10px] font-bold text-slate-900 dark:text-slate-200 tracking-widest uppercase"
                        >
                          ID
                        </span>
                      );
                    }
                    const hasChildren = (original.children?.length ?? 0) > 0;
                    const isExpanded = expandedIds.has(original.id);
                    return (
                      <div
                        style={{ marginLeft: `${original.depth * 1.5}rem` }}
                        className="flex items-center space-x-2"
                      >
                        {hasChildren ? (
                          <button
                            onClick={(e) => toggleExpand(original.id, e)}
                            className="p-1 hover:bg-slate-500/10 rounded transition-colors text-slate-900 dark:text-slate-200"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        ) : (
                          <div className="w-5.5" />
                        )}
                        <span className="text-[11px] text-slate-900 dark:text-slate-200 font-bold tabular-nums">
                          {original.id}
                        </span>
                      </div>
                    );
                  },
                },
                {
                  id: "featuredAsset",
                  header: "Image",
                  cell: ({ row }) => {
                    const original = row.original as any;
                    if (original.isHeader) {
                      return (
                        <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200 tracking-widest uppercase">
                          Image
                        </span>
                      );
                    }
                    return (
                      <div className="w-24 h-12 flex items-center justify-center rounded overflow-hidden border border-slate-200/10 my-1">
                        <VendureImage
                          asset={original.featuredAsset}
                          className="object-contain max-h-full max-w-full"
                        />
                      </div>
                    );
                  },
                },
                {
                  id: "cat_icon_display", // Renamed to avoid reserved ID styling
                  header: () => (
                    <div className="text-center font-bold uppercase tracking-widest text-[10px] text-slate-900 dark:text-slate-200 py-2">
                      Icon
                    </div>
                  ),
                  cell: ({ row }) => {
                    const original = row.original as any;
                    if (original.isHeader) {
                      return (
                        <div className="text-center font-bold text-slate-900 dark:text-slate-200 tracking-widest uppercase text-[10px]">
                          Icon
                        </div>
                      );
                    }
                    return (
                      <div className="flex items-center justify-center">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200/10 overflow-hidden my-0.5">
                          <VendureImage
                            asset={original.iconAsset}
                            className="object-contain h-6 w-6"
                          />
                        </div>
                      </div>
                    );
                  },
                },

                {
                  id: "name",
                  header: ({ column }: any) => (
                    <button
                      onClick={(e) => {
                        setSorting((old) => {
                          const isCurrent = old[0]?.id === "name";
                          return [
                            {
                              id: "name",
                              desc: isCurrent ? !old[0].desc : false,
                            },
                          ];
                        });
                      }}
                      className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors text-xs font-bold text-slate-900 dark:text-slate-200 group w-full justify-start py-2 px-1"
                    >
                      {sorting[0]?.id === "name" ? (
                        sorting[0].desc ? (
                          <ArrowDown className="w-3.5 h-3.5 text-cyan-600" />
                        ) : (
                          <ArrowUp className="w-3.5 h-3.5 text-cyan-600" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-200 opacity-40 group-hover:opacity-100" />
                      )}
                      Name
                    </button>
                  ),
                  enableSorting: true,
                  cell: ({ row }) => {
                    if (row.original.isHeader) {
                      return (
                        <span
                          style={{
                            marginLeft: `${row.original.depth * 1.5}rem`,
                          }}
                          className="text-[10px] font-bold text-slate-900 dark:text-slate-200 tracking-widest uppercase"
                        >
                          Name
                        </span>
                      );
                    }
                    return (
                      <div
                        style={{ marginLeft: `${row.original.depth * 1.5}rem` }}
                        className="flex items-center py-2"
                      >
                        {row.original.depth > 0 && (
                          <div className="w-4 h-px bg-slate-200 dark:bg-slate-200/20 mr-2" />
                        )}
                        <DetailPageButton
                          id={row.original.id}
                          label={row.original.name}
                          className="font-bold hover:text-cyan-600 transition-colors"
                        />
                      </div>
                    );
                  },
                },
                {
                  id: "type",
                  header: "Type",
                  cell: ({ row }) => {
                    const original = row.original as any;
                    if (original.isHeader) {
                      return (
                        <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200 tracking-widest uppercase">
                          Type
                        </span>
                      );
                    }
                    return (
                      <span className="text-xs text-slate-900 dark:text-slate-200 font-bold">
                        {(row.original as any).categoryType?.name || "-"}
                      </span>
                    );
                  },
                },
                {
                  id: "sort",
                  header: ({ column }: any) => (
                    <button
                      onClick={(e) => {
                        setSorting((old) => {
                          const isCurrent = old[0]?.id === "sort";
                          return [
                            {
                              id: "sort",
                              desc: isCurrent ? !old[0].desc : false,
                            },
                          ];
                        });
                      }}
                      className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors text-xs font-bold text-slate-900 dark:text-slate-200 group w-full justify-start py-2 px-1"
                    >
                      {sorting[0]?.id === "sort" ? (
                        sorting[0].desc ? (
                          <ArrowDown className="w-3.5 h-3.5 text-cyan-600" />
                        ) : (
                          <ArrowUp className="w-3.5 h-3.5 text-cyan-600" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-200 opacity-40 group-hover:opacity-100" />
                      )}
                      Sort Order
                    </button>
                  ),
                  enableSorting: true,
                  cell: ({ row }) => {
                    if (row.original.isHeader) {
                      return (
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-200 tracking-tight">
                          Sort Order
                        </span>
                      );
                    }
                    return (
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                        {row.original.sort}
                      </span>
                    );
                  },
                },
                {
                  id: "status",
                  header: "Enabled",
                  cell: ({ row }) => {
                    const original = row.original as any;
                    if (original.isHeader) {
                      return (
                        <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200 tracking-widest uppercase">
                          Enabled
                        </span>
                      );
                    }
                    return (
                      <div
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border inline-block ${original.enabled ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"}`}
                      >
                        {original.enabled ? "Enabled" : "Disabled"}
                      </div>
                    );
                  },
                },
                {
                  id: "slug",
                  header: "Slug",
                  cell: ({ row }) => {
                    const original = row.original as any;
                    if (original.isHeader) {
                      return (
                        <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200 tracking-widest uppercase">
                          Slug
                        </span>
                      );
                    }
                    return (
                      <span className="text-[11px] text-slate-900 dark:text-slate-200 font-mono font-bold italic">
                        {original.slug}
                      </span>
                    );
                  },
                },
                {
                  id: "actions",
                  header: "Actions",
                  cell: ({ row }) => {
                    const original = row.original as any;
                    if (original.isHeader) {
                      return (
                        <div className="text-right font-bold text-slate-900 dark:text-slate-200 tracking-widest uppercase text-[10px] pr-4">
                          Actions
                        </div>
                      );
                    }
                    return (
                      <div className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreVerticalIcon className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-rose-600 focus:text-rose-600 focus:bg-rose-500/10 cursor-pointer"
                              onClick={() =>
                                handleDelete(original.id, original.name)
                              }
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  },
                },
              ]}
            />
          </div>
          {/* Found Items Footer */}
          <div className="px-6 py-3 border-t text-xs text-slate-900 dark:text-slate-200 font-bold">
            {(visibleItems as any[]).length > 0
              ? `Found ${(visibleItems as any[]).length} items out of ${(allCategories as any[]).length} total`
              : "No results found"}
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
