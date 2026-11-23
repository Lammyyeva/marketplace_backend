import { Input } from "@vendure/dashboard";
import { DashboardFormComponent } from "@vendure/dashboard";

export const ColorInput: DashboardFormComponent = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="w-12 h-9 p-1 cursor-pointer"
      />
    </div>
  );
};
