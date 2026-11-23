// src/plugins/banner/dashboard/components/model-picker.tsx
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  api,
  DashboardFormComponentProps,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@vendure/dashboard";
import { GET_MODELS } from "../../api/banner.queries";

export function ModelPicker({
  value,
  onChange,
  disabled,
}: DashboardFormComponentProps) {
  const { data, isLoading } = useQuery<any>({
    queryKey: ["getModelsPicker"],
    queryFn: () => api.query(GET_MODELS),
  });

  const models = data?.models?.items || [];

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="bg-slate-500/5 border-slate-200/10 text-slate-200">
        <SelectValue
          placeholder={isLoading ? "Loading models..." : "Select model"}
        />
      </SelectTrigger>
      <SelectContent>
        {models.map((model: any) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
