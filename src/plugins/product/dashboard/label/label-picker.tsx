// src/plugins/product/dashboard/label-picker.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api, DashboardFormComponentProps, graphql } from "@vendure/dashboard";
import "./label-picker.css";

const GET_LABELS = graphql(`
  query GetLabels {
    labels {
      items {
        id
        name
        color
      }
    }
  }
`);

// Simple translation map for the component's internal title
const TRANSLATIONS = {
  en: "Select product label",
  tk: "Haryt etiketkasyny saýlaň",
};

interface Label {
  id: string;
  name: string;
  color: string;
}

// Internal shared component
function LabelPickerInternal({
  selectedIds,
  onChange,
  disabled,
  title,
  multiSelect = true,
}: {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled: boolean;
  title: string;
  multiSelect?: boolean;
}) {
  const { data, isLoading, error } = useQuery<any>({
    queryKey: ["labels"],
    queryFn: () => api.query(GET_LABELS),
  });

  const labels: Label[] = data?.labels?.items || [];

  const toggleLabel = (labelId: string) => {
    if (disabled) return;
    let updatedIds: string[];

    // Ensure we work with string IDs for consistency
    const idStr = String(labelId);

    if (multiSelect) {
      if (selectedIds.includes(idStr)) {
        updatedIds = selectedIds.filter((id) => id !== idStr);
      } else {
        updatedIds = [...selectedIds, idStr];
      }
    } else {
      // Single select mode: Toggle behavior (unselect if already selected)
      if (selectedIds.includes(idStr)) {
        updatedIds = [];
      } else {
        updatedIds = [idStr];
      }
    }
    onChange(updatedIds);
  };

  if (isLoading)
    return <div className="label-picker-loading">Loading labels...</div>;
  if (error)
    return (
      <div className="label-picker-error">
        Error loading labels: {(error as any).message}
      </div>
    );
  if (labels.length === 0)
    return (
      <div className="label-picker-empty">
        No labels found. Create some labels first.
      </div>
    );

  return (
    <div className="label-picker-container">
      <div className="label-picker-header">{title}</div>
      <div className="labels-list-horizontal">
        {labels.map((label) => {
          // Convert both to string for robust comparison
          const isSelected = selectedIds.some(
            (id) => String(id) === String(label.id),
          );
          return (
            <div
              key={label.id}
              className="label-checkbox-item"
              onClick={() => toggleLabel(label.id)}
            >
              <div className={`checkbox-custom ${isSelected ? "checked" : ""}`}>
                {isSelected && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <span className="label-text">{label.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Version 1: Standard Array Input (For Product Page Custom Fields)
export function LabelPicker(props: DashboardFormComponentProps) {
  const { value, onChange, disabled } = props;
  const currentLanguage = window.location.search.includes("lang=tk")
    ? "tk"
    : "en";
  const title =
    TRANSLATIONS[currentLanguage as keyof typeof TRANSLATIONS] ||
    TRANSLATIONS.en;

  const selectedIds = React.useMemo(() => {
    if (!value) return [];
    const arr = Array.isArray(value) ? value : [value];
    return arr
      .map((v: any) => {
        if (typeof v === "string") return v;
        if (typeof v === "number") return String(v);
        return String(v?.id || v);
      })
      .filter((id) => id !== "undefined" && id !== "null");
  }, [value]);

  return (
    <LabelPickerInternal
      selectedIds={selectedIds}
      onChange={onChange}
      disabled={disabled || false}
      title={title}
      multiSelect={true}
    />
  );
}

// Version 2: Single ID String Input (For Collection Filter Arguments)
export function LabelPickerFormInput(props: DashboardFormComponentProps) {
  const { value, onChange, disabled } = props;

  const currentLanguage = window.location.search.includes("lang=tk")
    ? "tk"
    : "en";
  const title =
    TRANSLATIONS[currentLanguage as keyof typeof TRANSLATIONS] ||
    TRANSLATIONS.en;

  const selectedIds = React.useMemo(() => {
    if (value === undefined || value === null || value === "") return [];

    // Handle stringified array or single value
    if (typeof value === "string" && value.startsWith("[")) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
          ? parsed.map((v) => String(v?.id || v))
          : [String(value)];
      } catch {
        return [String(value)];
      }
    }

    return [String(value?.id || value)];
  }, [value]);

  const handleChange = (newIds: string[]) => {
    const selectedId = newIds[0] || "";
    onChange(selectedId);
  };

  return (
    <LabelPickerInternal
      selectedIds={selectedIds}
      onChange={handleChange}
      disabled={disabled || false}
      title={title}
      multiSelect={false}
    />
  );
}
