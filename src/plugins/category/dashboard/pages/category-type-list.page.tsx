import {
  Button,
  ListPage,
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
} from "@vendure/dashboard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  PlusIcon,
  MoreVerticalIcon,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import React, { useState } from "react";
import {
  GET_CATEGORY_TYPES,
  DELETE_CATEGORY_TYPE,
} from "../../api/category.queries";
import { toast } from "sonner";

export function CategoryTypeListPage({ route }: { route: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<any[]>([{ id: "sort", desc: false }]);
  const queryClient = useQueryClient();

  const sortParam = React.useMemo(() => {
    if (sorting.length === 0) return { sort: "ASC" };
    const { id, desc } = sorting[0];
    return { [id]: desc ? "DESC" : "ASC" };
  }, [sorting]);

  const { data, isLoading } = useQuery({
    queryKey: ["category-types", searchTerm, sortParam],
    queryFn: () =>
      api.query(GET_CATEGORY_TYPES, {
        options: {
          sort: sortParam as any,
          filter: searchTerm ? { name: { contains: searchTerm } } : {},
        },
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.mutate(DELETE_CATEGORY_TYPE, { id }),
    onSuccess: () => {
      toast.success("Category Type deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["category-types"] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete category type: ${error.message}`);
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(`Are you sure you want to delete category type "${name}"?`)
    ) {
      deleteMutation.mutate(id);
    }
  };

  const items = data?.categoryTypes?.items || [];

  return (
    <Page pageId="category-type-list">
      <PageTitle>Category Types</PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          <Button asChild className="bg-cyan-500 hover:bg-cyan-600">
            <Link to="/catalog/category-types/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add
            </Link>
          </Button>
        </PageActionBarRight>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="main" blockId="category-type-list-main">
          <div className="px-6 py-3 border-b flex justify-end">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-4 py-1.5 text-xs border border-slate-200/10 rounded-md w-64 bg-transparent focus:ring-1 focus:ring-cyan-500 outline-none"
            />
          </div>
          <DataTable
            data={items}
            isLoading={isLoading}
            setTableOptions={(options) => ({
              ...options,
              state: {
                ...options.state,
                sorting,
              },
              onSortingChange: setSorting,
              enableMultiSort: false,
              manualSorting: true,
            })}
            columns={[
              {
                accessorKey: "id",
                header: ({ column }: any) => (
                  <button
                    onClick={() =>
                      setSorting((old) => {
                        const isCurrent = old[0]?.id === "id";
                        return [
                          { id: "id", desc: isCurrent ? !old[0].desc : false },
                        ];
                      })
                    }
                    className="flex items-center gap-1.5 hover:text-cyan-500 text-xs font-bold text-slate-900 dark:text-slate-200 group"
                  >
                    {sorting[0]?.id === "id" ? (
                      sorting[0].desc ? (
                        <ArrowDown className="w-3.5 h-3.5 text-cyan-500" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5 text-cyan-500" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-200 opacity-40 group-hover:opacity-100" />
                    )}
                    ID
                  </button>
                ),
                enableSorting: true,
                cell: ({ row }) => (
                  <span className="text-[11px] text-slate-900 dark:text-slate-200 font-bold tabular-nums">
                    {row.original.id}
                  </span>
                ),
              },
              {
                id: "icon",
                header: "Icon",
                cell: ({ row }) => (
                  row.original.iconAsset ? (
                    <img
                      src={row.original.iconAsset.preview + "?preset=tiny"}
                      className="w-8 h-8 object-cover rounded border"
                      alt="icon"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-200/5 rounded border border-slate-200 dark:border-slate-200/10 flex items-center justify-center text-[10px] text-slate-400 dark:text-slate-200/40">
                      None
                    </div>
                  )
                ),
              },
              {
                accessorKey: "name",
                header: ({ column }: any) => (
                  <button
                    onClick={() =>
                      setSorting((old) => {
                        const isCurrent = old[0]?.id === "name";
                        return [
                          {
                            id: "name",
                            desc: isCurrent ? !old[0].desc : false,
                          },
                        ];
                      })
                    }
                    className="flex items-center gap-1.5 hover:text-cyan-500 text-xs font-bold text-slate-900 dark:text-slate-200 group"
                  >
                    {sorting[0]?.id === "name" ? (
                      sorting[0].desc ? (
                        <ArrowDown className="w-3.5 h-3.5 text-cyan-500" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5 text-cyan-500" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-200 opacity-40 group-hover:opacity-100" />
                    )}
                    Name
                  </button>
                ),
                enableSorting: true,
                cell: ({ row }) => (
                  <Link
                    to={`/catalog/category-types/${row.original.id}`}
                    className="font-bold hover:text-cyan-500 transition-colors"
                  >
                    {row.original.name}
                  </Link>
                ),
              },
              {
                id: "slug",
                header: "Slug",
                cell: ({ row }) => (
                  <span className="text-[11px] text-slate-900 dark:text-slate-200 font-mono font-bold italic">
                    {row.original.slug}
                  </span>
                ),
              },
              {
                id: "enabled",
                header: "Enabled",
                cell: ({ row }) => (
                  <div
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border inline-block ${row.original.enabled ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"}`}
                  >
                    {row.original.enabled ? "Enabled" : "Disabled"}
                  </div>
                ),
              },
              {
                accessorKey: "sort",
                header: ({ column }: any) => (
                  <button
                    onClick={() =>
                      setSorting((old) => {
                        const isCurrent = old[0]?.id === "sort";
                        return [
                          {
                            id: "sort",
                            desc: isCurrent ? !old[0].desc : false,
                          },
                        ];
                      })
                    }
                    className="flex items-center gap-1.5 hover:text-cyan-500 text-xs font-bold text-slate-900 dark:text-slate-200 group"
                  >
                    {sorting[0]?.id === "sort" ? (
                      sorting[0].desc ? (
                        <ArrowDown className="w-3.5 h-3.5 text-cyan-500" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5 text-cyan-500" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-200 opacity-40 group-hover:opacity-100" />
                    )}
                    Sort
                  </button>
                ),
                enableSorting: true,
                cell: ({ row }) => (
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                    {row.original.sort}
                  </span>
                ),
              },
              {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-rose-600 cursor-pointer"
                          onClick={() =>
                            handleDelete(row.original.id, row.original.name)
                          }
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ),
              },
            ]}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
