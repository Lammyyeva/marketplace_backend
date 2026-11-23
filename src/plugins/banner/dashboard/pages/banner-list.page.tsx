import { useAdminTranslation } from "../../../../common/dashboard/use-admin-translation";
import en from "../translations/en.json";
import ru from "../translations/ru.json";
import tk from "../translations/tk.json";
import {
  Button,
  DetailPageButton,
  ListPage,
  VendureImage,
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
  useUserSettings,
} from "@vendure/dashboard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, AnyRoute } from "@tanstack/react-router";
import {
  PlusIcon,
  MoreVerticalIcon,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { useState, useMemo } from "react";
import { GET_BANNERS, DELETE_BANNER } from "../../api/banner.queries";
import { toast } from "sonner";

export function BannerListPage({ route }: { route: AnyRoute }) {
  const { t } = useAdminTranslation({ en, ru, tk });
  const [searchTerm, setSearchTerm] = useState("");
  const [sorting, setSorting] = useState<any[]>([{ id: "sort", desc: false }]);

  const queryClient = useQueryClient();

  const sortParam = useMemo(() => {
    if (sorting.length === 0) return { sort: "ASC" };
    const { id, desc } = sorting[0];
    return { [id]: desc ? "DESC" : "ASC" };
  }, [sorting]);

  const params = route.useParams() as any;
  const typeId = params.typeId;

  const {
    settings: { contentLanguage },
  } = useUserSettings();

  const { data, isLoading } = useQuery({
    queryKey: ["banners", sortParam, searchTerm],
    queryFn: () =>
      api.query(GET_BANNERS, {
        options: {
          sort: sortParam,
          filter: {
            ...(searchTerm ? { name: { contains: searchTerm } } : {}),
            ...(typeId ? { typeId: { eq: typeId } } : {}),
          },
        },
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.mutate(DELETE_BANNER, { id }),
    onSuccess: () => {
      toast.success("Banner deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete banner: ${error.message}`);
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete banner "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const banners = data?.banners?.items || [];

  return (
    <Page pageId="banner-list">
      <PageTitle>{t("list.title")}</PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          <Button
            asChild
            className="bg-cyan-500 hover:bg-cyan-600 text-white rounded shadow-sm border-none px-4 h-9"
          >
            <Link to={`/catalog/banners/list/${typeId}/new`}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add
            </Link>
          </Button>
        </PageActionBarRight>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="main" blockId="banner-list-main">
          <div className="px-6 py-3 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search banners..."
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
            </div>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              data={banners}
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
                            {
                              id: "id",
                              desc: isCurrent ? !old[0].desc : false,
                            },
                          ];
                        })
                      }
                      className="flex items-center gap-1.5 hover:text-cyan-600 text-xs font-bold text-slate-900 dark:text-slate-200 group"
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
                  cell: ({ row }) => (
                      <span className="text-[11px] text-slate-900 dark:text-slate-200 font-bold tabular-nums">
                      {row.original.id}
                    </span>
                  ),
                },
                {
                  id: "asset",
                  header: "Image",
                  cell: ({ row }) => {
                    const assets = (row.original.assets as any[]) || [];
                    const displayImage =
                      assets.find(
                        (img) => img.languageCode === contentLanguage,
                      ) || assets[0];

                    return (
                      <div className="w-16 h-10 border border-slate-200 dark:border-slate-200/10 rounded overflow-hidden flex items-center justify-center">
                        {displayImage?.asset ? (
                          <VendureImage
                            asset={displayImage.asset}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-[9px] text-slate-200 italic whitespace-nowrap">
                            No image
                          </span>
                        )}
                      </div>
                    );
                  },
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
                      className="flex items-center gap-1.5 hover:text-cyan-600 text-xs font-bold text-slate-900 dark:text-slate-200 group"
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
                  cell: ({ row }) => (
                    <DetailPageButton
                      id={row.original.id}
                      label={row.original.name}
                      className="font-bold hover:text-cyan-600 transition-colors"
                    />
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
                  id: "redirect",
                  header: "Redirect",
                  cell: ({ row }) => (
                    <div
                      className="text-[10px] capitalize font-bold text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-200/20 bg-slate-100 dark:bg-slate-500/5 px-2 py-0.5 rounded inline-block"
                    >
                      {row.original.redirect || "-"}
                    </div>
                  ),
                },
                {
                  id: "counter",
                  header: "Counter",
                  cell: ({ row }) => (
                    <div
                      className="bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 font-bold min-w-[2rem] justify-center px-2 py-0.5 rounded flex items-center"
                    >
                      {row.original.counter || 0}
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
                      className="flex items-center gap-1.5 hover:text-cyan-600 text-xs font-bold text-slate-900 dark:text-slate-200 group"
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
                  id: "actions",
                  header: "Actions",
                  cell: ({ row }) => (
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              to={`/catalog/banners/list/${typeId}/${row.original.id}/assets`}
                              className="cursor-pointer"
                            >
                              Manage Images
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-rose-600 focus:text-rose-600 focus:bg-rose-500/10 cursor-pointer"
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
          </div>
          <div className="px-6 py-3 border-t text-xs text-slate-900 dark:text-slate-200 font-bold">
            {banners.length > 0
              ? `Found ${banners.length} items`
              : "No results found"}
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
