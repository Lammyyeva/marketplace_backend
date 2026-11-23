import {
  ListPage,
  DetailPageButton,
  PageActionBarRight,
  Button,
} from "@vendure/dashboard";
import { Link } from "@tanstack/react-router";
import { PlusIcon, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
  GET_DELIVERY_METHODS,
  DELETE_DELIVERY_METHOD,
  TOGGLE_DELIVERY_METHOD,
} from "../../api/delivery.queries";
import { useDeliveryTranslation } from "../hooks/use-delivery-translation";

export function DeliveryMethodListPage({ route }: { route: any }) {
  const { t } = useDeliveryTranslation();
  return (
    <ListPage
      pageId="delivery-method-list"
      title={t("delivery.delivery-methods")}
      listQuery={GET_DELIVERY_METHODS}
      deleteMutation={DELETE_DELIVERY_METHOD}
      route={route}
      defaultColumnOrder={[
        "id",
        "name",
        "code",
        "enabled",
        "sort",
        "type",
        "from",
        "to",
        "showTime",
        "currentCount",
        "description",
      ]}
      customizeColumns={{
        id: {
          header: t("delivery.id"),
        },
        name: {
          header: t("delivery.name"),
          cell: ({ row }) => (
            <DetailPageButton id={row.original.id} label={row.original.name} />
          ),
        },
        code: {
          header: t("delivery.code"),
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
        type: {
          header: t("delivery.type"),
          cell: ({ row }) => t(`delivery.${row.original.type}`),
        },
        from: {
          header: t("delivery.from"),
        },
        to: {
          header: t("delivery.to"),
        },
        showTime: {
          header: t("delivery.show-time"),
          cell: ({ row }) => (
            <div
              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border inline-block ${
                row.original.showTime
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-500 border-rose-500/20"
              }`}
            >
              {row.original.showTime
                ? t("delivery.active")
                : t("delivery.inactive")}
            </div>
          ),
        },
        currentCount: {
          header: t("delivery.current-count"),
        },
        description: {
          header: t("delivery.description"),
        },
        minCost: {
          header: t("delivery.min-cost"),
        },
        maxCost: {
          header: t("delivery.max-cost"),
        },
        limitPrice: {
          header: t("delivery.limit-price"),
        },
        limit: {
          header: t("delivery.limit"),
        },
        closeTime: {
          header: t("delivery.close-time"),
        },
      }}
    >
      <PageActionBarRight>
        <Button asChild>
          <Link to="./new">
            <PlusIcon className="mr-2 h-4 w-4" />
            {t("delivery.new-delivery-method")}
          </Link>
        </Button>
      </PageActionBarRight>
    </ListPage>
  );
}
