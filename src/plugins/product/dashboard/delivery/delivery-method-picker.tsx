import React, { useState, useEffect, useRef } from "react";
import { DashboardFormComponentProps } from "@vendure/dashboard";
import {
  useQuery as useTanstackQuery,
  useMutation as useTanstackMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { api } from "@vendure/dashboard";
import {
  GET_ORDER_DELIVERY_GROUPS,
  APPLY_DELIVERY_METHOD,
} from "./delivery.queries";
import "./delivery-method-picker.css";

export function DeliveryMethodPicker(props: DashboardFormComponentProps) {
  const match = window.location.pathname.match(/\/orders\/draft\/([^/]+)/);
  const orderId = props.entity?.id || (match ? match[1] : null);
  const rootRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const [selectedSelection, setSelectedSelection] = useState<{
    key: number | null;
    id: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInteractedRef = useRef(false);

  const { data: daysData, isLoading: daysLoading } = useTanstackQuery({
    queryKey: ["orderDeliveryGroups", orderId],
    queryFn: () => api.query(GET_ORDER_DELIVERY_GROUPS, { id: orderId! }),
    enabled: !!orderId,
  });

  const applyDeliveryMethodMutation = useTanstackMutation({
    mutationFn: (variables: { orderId: string; deliveryMethodId: string }) =>
      api.mutate(APPLY_DELIVERY_METHOD, variables),
  });

  // Restore selection on load - carefully!
  useEffect(() => {
    const savedId = props.value?.id ?? null;
    if (!daysData?.order?.deliveryGroups) return;

    // If user already interacted, don't override their tab choice unless the actual savedId changed externally
    if (hasInteractedRef.current && selectedSelection?.id === savedId) {
      return;
    }

    if (savedId) {
      const days = daysData.order.deliveryGroups as any[];
      const tabIndex = days.findIndex((day: any) =>
        day.data?.some((m: any) => m.id === savedId),
      );
      if (tabIndex !== -1) {
        setActiveTab(tabIndex);
        setSelectedSelection({ key: days[tabIndex].key, id: savedId });
      } else {
        setSelectedSelection({ key: null, id: savedId });
      }
    } else {
      setSelectedSelection(null);
    }
  }, [props.value?.id, daysData]);

  // Hide external dashboard elements that are redundant by walking up the DOM
  useEffect(() => {
    const hideElements = () => {
      if (!rootRef.current) return;

      // 1. Find the immediate custom field label
      let parent = rootRef.current.parentElement;
      while (parent) {
        // Hide label if found in the same control
        const label = parent.querySelector("label.clr-control-label");
        if (label) {
          (label as HTMLElement).style.setProperty(
            "display",
            "none",
            "important",
          );
        }

        // Look for the "Custom fields" header and the Save button in the container
        const h3s = Array.from(parent.querySelectorAll("h3"));
        const customFieldsHeader = h3s.find(
          (h) => h.textContent?.trim() === "Custom fields",
        );
        if (customFieldsHeader)
          (customFieldsHeader as HTMLElement).style.setProperty(
            "display",
            "none",
            "important",
          );

        const buttons = Array.from(parent.querySelectorAll("button"));
        const saveButton = buttons.find((b) =>
          b.textContent?.toLowerCase().includes("set custom fields"),
        );
        if (saveButton)
          (saveButton as HTMLElement).style.setProperty(
            "display",
            "none",
            "important",
          );

        // Support for the specific classes too just in case
        const header = parent.querySelector("h3"); // Fallback to first h3 if text matches fail but structure is known
        if (header && !customFieldsHeader)
          (header as HTMLElement).style.setProperty(
            "display",
            "none",
            "important",
          );

        const button = parent.querySelector("button.btn-primary");
        if (button && !saveButton)
          (button as HTMLElement).style.setProperty(
            "display",
            "none",
            "important",
          );
        // Keep walking up a few levels to ensure we hit the container
        if (parent.classList.contains("vdr-custom-fields-controls")) break;
        parent = parent.parentElement;
      }
    };

    hideElements();
    // Retry a few times as Angular might re-render parts of the form
    const timers = [
      setTimeout(hideElements, 100),
      setTimeout(hideElements, 500),
      setTimeout(hideElements, 1000),
      setTimeout(hideElements, 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [daysData, saving, activeTab]); // Re-run on various state changes to stay hidden

  const handleTabClick = (index: number) => {
    hasInteractedRef.current = true;
    setActiveTab(index);
  };

  const handleCardClick = (method: any, dayKey: number, isClosed: boolean) => {
    if (saving || isClosed) return;
    hasInteractedRef.current = true;
    setSaveError(null);
    setJustSaved(false);
    setSelectedSelection({ key: dayKey, id: method.id });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!orderId) {
        setSaveError("Could not determine order ID.");
        return;
      }

      try {
        setSaving(true);
        await applyDeliveryMethodMutation.mutateAsync({
          orderId,
          deliveryMethodId: method.id,
        });

        // Invalidate all queries to ensure the dashboard reflects the new shipping cost
        // Since we fixed the button type issue, this will no longer cause a refresh loop
        await queryClient.invalidateQueries();

        setJustSaved(true);
      } catch (e: any) {
        setSaveError("Failed to save.");
        setSelectedSelection(null);
      } finally {
        setSaving(false);
      }
    }, 50);
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    return time.slice(0, 5);
  };

  if (daysLoading) return <div className="no-methods">Loading...</div>;

  const days = ([...(daysData?.order?.deliveryGroups ?? [])] as any[]).sort(
    (a, b) => {
      if (a.type === "express" && b.type !== "express") return -1;
      if (a.type !== "express" && b.type === "express") return 1;
      return (a.key ?? 0) - (b.key ?? 0);
    },
  );

  const activeMethods = ([...(days[activeTab]?.data ?? [])] as any[]).sort(
    (a, b) => {
      const fromCompare = (a.from ?? "").localeCompare(b.from ?? "");
      if (fromCompare !== 0) return fromCompare;
      return (a.to ?? "").localeCompare(b.to ?? "");
    },
  );

  return (
    <div ref={rootRef} className="delivery-picker-root">
      <div className="delivery-picker-container">
        <div className="delivery-status-bar">
          {saving && <span className="status-saving">Saving...</span>}
          {!saving && saveError && (
            <span className="status-error">{saveError}</span>
          )}
        </div>

        <div className="delivery-tabs">
          {days.map((day: any, index: number) => {
            const isExpress = day.type === "express";

            return (
              <button
                key={day.key}
                type="button"
                className={`delivery-tab ${activeTab === index ? "active" : ""} ${isExpress ? "express-tab" : ""}`}
                onClick={() => handleTabClick(index)}
              >
                {day.day}
                {day.date && <span className="tab-date">{day.date}</span>}
              </button>
            );
          })}
        </div>

        <div className="delivery-methods-grid">
          {activeMethods.length === 0 ? (
            <div className="no-methods">No slots available.</div>
          ) : (
            activeMethods.map((method: any) => {
              const currentDayKey = days[activeTab]?.key;
              const isSelected =
                selectedSelection?.id === method.id &&
                selectedSelection?.key === currentDayKey;
              const timeRange = `${formatTime(method.from)} - ${formatTime(method.to)}`;

              // Check if method is disabled by admin override or due to time passed
              // Note: The new deliveryGroups resolver natively calculates and provides
              // the exact 'isDisabled' state per-day server-side!
              const isClosed = method.isDisabled === true;

              return (
                <div
                  key={method.id}
                  className={`method-chip ${isSelected ? "selected" : ""} ${saving ? "saving" : ""} ${isClosed ? "disabled" : ""}`}
                  onClick={() =>
                    handleCardClick(method, currentDayKey, isClosed)
                  }
                >
                  <div className="chip-radio">
                    <div className="chip-radio-inner" />
                  </div>
                  <div className="chip-info">
                    {method.showTime ? timeRange : method.name}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
