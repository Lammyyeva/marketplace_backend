import {
  ListPage,
  DetailPageButton,
  PageActionBarRight,
  Button,
} from "@vendure/dashboard";
import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { GET_WORKERS, DELETE_WORKER } from "../../api/worker.queries";
import { useWorkerTranslation } from "../hooks/use-worker-translation";

export function WorkerListPage({ route }: { route: any }) {
  const { t } = useWorkerTranslation();
  return (
    <ListPage
      pageId="worker-list"
      title={t("worker.workers")}
      listQuery={GET_WORKERS}
      deleteMutation={DELETE_WORKER}
      route={route}
      defaultColumnOrder={[
        "firstName",
        "phone",
        "erpCode",
        "enabled",
        "vehicle",
        "sort",
      ]}
      customizeColumns={{
        firstName: {
          header: t("worker.first-name"),
          sortable: true,
          filterable: true,
          cell: ({ row }) => (
            <DetailPageButton 
                id={row.original.id} 
                label={`${row.original.firstName} ${row.original.lastName}`} 
            />
          ),
        },
        phone: {
          header: t("worker.phone"),
          filterable: true,
        },
        erpCode: {
          header: t("worker.erp-code"),
          filterable: true,
        },
        enabled: {
          header: t("worker.enabled"),
          cell: ({ row }) => (
            <div
              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border inline-block ${row.original.enabled ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"}`}
            >
              {row.original.enabled ? t("worker.active") : t("worker.inactive")}
            </div>
          ),
          filterable: true,
        },
        vehicle: {
          header: t("worker.vehicle"),
          cell: ({ row }) => row.original.vehicle ? `${row.original.vehicle} (${row.original.vehiclePlate})` : "-",
        },
        sort: {
          header: t("worker.sort"),
          sortable: true,
        },
      }}
    >
      <PageActionBarRight>
        <Button asChild>
          <Link to="./new">
            <PlusIcon className="mr-2 h-4 w-4" />
            {t("worker.new-worker")}
          </Link>
        </Button>
      </PageActionBarRight>
    </ListPage>
  );
}
