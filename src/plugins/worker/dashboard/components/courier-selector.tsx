import React, { useState } from "react";
import {
  Button,
  DashboardFormComponentProps,
  Input,
  api,
} from "@vendure/dashboard";
import {
  useQuery as useTanstackQuery,
  useMutation as useTanstackMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Search, UserCheck, UserX, Truck, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import { GET_WORKERS, ASSIGN_COURIER_TO_ORDER, UNASSIGN_COURIER_FROM_ORDER } from "../../api/worker.queries";
import "./courier-selector.css";

export function CourierSelector(props: DashboardFormComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fallback to get order ID from URL if not in props
  const urlMatch = window.location.pathname.match(/\/orders\/(\d+)/);
  const orderId = props.entity?.id || (urlMatch ? urlMatch[1] : null);
  
  const currentCourierId = props.value;
  const queryClient = useQueryClient();

  const { data: workersData, isLoading } = useTanstackQuery({
    queryKey: ["couriers"],
    queryFn: () =>
      api.query(GET_WORKERS, {
        options: {
          filter: {
            role: { eq: "Courier" },
            enabled: { eq: true },
          },
        },
      }),
  });

  const assignMutation = useTanstackMutation({
    mutationFn: (courierId: string) =>
      api.mutate(ASSIGN_COURIER_TO_ORDER, { orderId, courierId }),
    onSuccess: (data) => {
      const courier = (data as any).assignCourierToOrder?.courier;
      toast.success(`Assigned to ${courier?.firstName} ${courier?.lastName}`);
      props.onChange(courier?.id);
      queryClient.invalidateQueries();
      setIsOpen(false);
    },
    onError: (err: any) => {
      toast.error("Failed to assign courier", { description: err.message });
    }
  });

  const unassignMutation = useTanstackMutation({
    mutationFn: () => api.mutate(UNASSIGN_COURIER_FROM_ORDER, { orderId }),
    onSuccess: () => {
      toast.success("Courier unassigned");
      props.onChange(null);
      queryClient.invalidateQueries();
    },
    onError: (err: any) => {
      toast.error("Failed to unassign courier", { description: err.message });
    }
  });

  const couriers = workersData?.workers?.items ?? [];
  const filteredCouriers = couriers.filter((c: any) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.vehicle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.vehiclePlate?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCourier = couriers.find((c: any) => c.id === currentCourierId);

  return (
    <div className="courier-selector-root">
      {selectedCourier ? (
        <div className="selected-courier-card">
          <div className="courier-info">
            <div className="courier-avatar">
              <UserCheck className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="courier-details">
              <span className="courier-name">
                {selectedCourier.firstName} {selectedCourier.lastName}
              </span>
              <span className="courier-vehicle">
                <Truck className="w-3 h-3 inline mr-1" />
                {selectedCourier.vehicle} ({selectedCourier.vehiclePlate})
              </span>
              <span className="courier-phone">
                {selectedCourier.phone}
              </span>
            </div>
          </div>
          <div className="courier-actions">
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
              Change
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-500"
              onClick={() => unassignMutation.mutate()}
              disabled={unassignMutation.isPending}
            >
              <UserX className="w-4 h-4 mr-1" />
              Unassign
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground border-dashed h-12"
          onClick={() => setIsOpen(true)}
        >
          <Truck className="mr-2 h-4 w-4" />
          Assign Courier...
        </Button>
      )}

      {/* Custom Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-200/10 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/5 dark:bg-slate-800/20">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Select Courier</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col flex-1 overflow-hidden">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-200" />
                <Input
                  placeholder="Search by name, vehicle or plate..."
                   className="pl-10 bg-white dark:bg-transparent border-slate-200 dark:border-slate-200/20 text-slate-900 dark:text-slate-200 font-bold"
                  value={searchTerm}
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="py-20 text-center text-slate-900 dark:text-slate-200 font-bold">
                    Loading couriers...
                  </div>
                ) : filteredCouriers.length === 0 ? (
                  <div className="py-20 text-center text-slate-200 italic">
                    No active couriers found.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredCouriers.map((courier: any) => {
                      const isCurrent = courier.id === currentCourierId;
                      return (
                        <div
                          key={courier.id}
                          className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                            isCurrent
                              ? "bg-cyan-500/5 border-cyan-500/30 ring-1 ring-cyan-500/20"
                              : "hover:bg-slate-100 dark:hover:bg-slate-500/5 border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                              isCurrent ? "bg-cyan-500/10 text-cyan-500" : "bg-slate-100 dark:bg-slate-500/10 text-slate-900 dark:text-slate-200"
                            }`}>
                              <Truck className="w-4.5 h-4.5" />
                            </div>
                            <div>
                              <div className="font-bold text-sm">
                                {courier.firstName} {courier.lastName}
                              </div>
                              <div className="text-[11px] text-slate-900 dark:text-slate-200 flex items-center gap-2 mt-0.5 font-bold">
                                <span>{courier.vehicle}</span>
                                <span className="opacity-30">•</span>
                                <span className="font-mono">{courier.vehiclePlate}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 pr-2">
                              <div className="w-1 h-1 rounded-full bg-emerald-500" />
                              <span className="text-[10px] font-bold uppercase text-emerald-500 tracking-wider">
                                Active
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant={isCurrent ? "ghost" : "outline"}
                              className={isCurrent ? "text-cyan-500" : "border-slate-200/20"}
                              disabled={assignMutation.isPending || isCurrent}
                              onClick={() => assignMutation.mutate(courier.id)}
                            >
                              {isCurrent ? "Selected" : "Assign"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
