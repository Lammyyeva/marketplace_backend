// label-list.page.tsx
import {
  ListPage,
  DetailPageButton,
  PageActionBarRight,
  Button,
  VendureImage,
} from "@vendure/dashboard";
import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { GET_LABELS, DELETE_LABEL } from "../../api/label.queries";

export function LabelListPage({ route }: { route: any }) {
  return (
    <ListPage
      pageId="label-list-v2"
      title="Labels"
      listQuery={GET_LABELS}
      deleteMutation={DELETE_LABEL}
      route={route}
      defaultColumnOrder={[
        "id",
        "featuredAsset",
        "name",
        "code",
        "color",
        "enabled",
        "sort",
      ]}
      defaultVisibility={{
        translations: false,
      }}
      customizeColumns={{
        id: {
          header: () => <span className="font-bold text-slate-900 dark:text-slate-200">ID</span>,
        },
        featuredAsset: {
          enableSorting: false,
          header: () => <span className="font-bold text-slate-900 dark:text-slate-200">Image</span>,
          cell: ({ row }) => {
            const asset = row.original.featuredAsset;
            return (
              <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-200/20 overflow-hidden">
                {asset ? (
                  <VendureImage
                    asset={asset}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PlusIcon className="w-4 h-4 text-slate-200" />
                )}
              </div>
            );
          },
        },
        name: {
          header: () => <span className="font-bold text-slate-900 dark:text-slate-200">Name</span>,
          cell: ({ row }) => (
            <div className="flex flex-col">
              <DetailPageButton id={row.original.id} label={row.original.name} />
              {!row.original.enabled && (
                <span className="text-[10px] text-slate-900 dark:text-slate-200 uppercase font-bold mt-0.5">
                  Hidden
                </span>
              )}
            </div>
          ),
        },
        code: {
          header: () => <span className="font-bold text-slate-900 dark:text-slate-200">Code</span>,
          cell: ({ row }) => (
            <code className="text-[10px] font-bold font-mono bg-slate-100 dark:bg-slate-500/10 px-1.5 py-0.5 rounded text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-200/10 uppercase tracking-tight">
              {row.original.code || "no-code"}
            </code>
          ),
        },
        color: {
          header: () => <span className="font-bold text-slate-900 dark:text-slate-200">Color</span>,
          enableSorting: false,
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border shadow-sm ring-2 ring-white/10"
                style={{ backgroundColor: row.original.color }}
              />
              <span className="text-[10px] font-bold font-mono text-slate-900 dark:text-slate-200 uppercase tabular-nums">
                {row.original.color}
              </span>
            </div>
          ),
        },
        enabled: {
          header: () => <span className="font-bold text-slate-900 dark:text-slate-200">Enabled</span>,
          cell: ({ row }) => (
            <div
              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border inline-block ${row.original.enabled ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"}`}
            >
              {row.original.enabled ? "Enabled" : "Disabled"}
            </div>
          ),
        },
        sort: {
          header: () => <span className="font-bold text-slate-900 dark:text-slate-200">Sort Order</span>,
        },
      }}
    >
      <PageActionBarRight>
        <Button asChild>
          <Link to="./new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Label
          </Link>
        </Button>
      </PageActionBarRight>
    </ListPage>
  );
}
