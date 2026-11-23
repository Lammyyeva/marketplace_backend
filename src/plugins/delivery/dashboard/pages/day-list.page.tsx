import {
  ListPage,
  DetailPageButton,
  PageActionBarRight,
  Button,
} from "@vendure/dashboard";
import { Link } from "@tanstack/react-router";
import { PlusIcon, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { GET_DAYS, DELETE_DAY } from "../../api/delivery.queries";
import { useDeliveryTranslation } from "../hooks/use-delivery-translation";

export function DayListPage({ route }: { route: any }) {
  const { t } = useDeliveryTranslation();
  return (
    <ListPage
      pageId="delivery-day-list"
      title={t("delivery.delivery-days")}
      listQuery={GET_DAYS}
      deleteMutation={DELETE_DAY}
      route={route}
      defaultColumnOrder={[
        "id",
        "name",
        "code",
        "enabled",
        "sort",
        "type",
        "dayOffset",
      ]}
      customizeColumns={{
        id: {
          header: t("delivery.id"),
          sortable: true,
          filterable: true,
        },
        name: {
          header: t("delivery.name"),
          sortable: true,
          filterable: true,
          cell: ({ row }) => (
            <DetailPageButton id={row.original.id} label={row.original.name} />
          ),
        },
        code: {
          header: t("delivery.code"),
          filterable: false,
        },
        enabled: {
          header: t("delivery.enabled"),
          cell: ({ row }) => (
            <div
              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border inline-block ${
                row.original.enabled
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-500 border-rose-500/20"
              }`}
            >
              {row.original.enabled
                ? t("delivery.active")
                : t("delivery.inactive")}
            </div>
          ),
        },
        sort: {
          header: ({ column }: any) => {
            const isSorted = column?.getIsSorted?.();
            return (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  column?.toggleSorting?.(isSorted === "asc");
                }}
                className="flex items-center gap-1.5 hover:text-cyan-600 text-xs font-semibold text-slate-200 group"
              >
                {isSorted ? (
                  isSorted === "desc" ? (
                    <ArrowDown className="w-3.5 h-3.5 text-cyan-600" />
                  ) : (
                    <ArrowUp className="w-3.5 h-3.5 text-cyan-600" />
                  )
                ) : (
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-200 opacity-40 group-hover:opacity-100" />
                )}
                Sort
              </button>
            );
          },
          sortable: true,
          filterable: true,
        },
        type: {
          header: t("delivery.type"),
        },
        dayOffset: {
          header: t("delivery.day-offset"),
          filterable: false,
        },
      }}
    >
      <PageActionBarRight>
        <Button asChild>
          <Link to="./new">
            <PlusIcon className="mr-2 h-4 w-4" />
            {t("delivery.new-day")}
          </Link>
        </Button>
      </PageActionBarRight>
    </ListPage>
  );
}
