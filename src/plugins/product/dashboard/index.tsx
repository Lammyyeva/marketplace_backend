import { defineDashboardExtension } from "@vendure/dashboard";
import "./label/label-picker.css";
import { CategoryPicker } from "./category/category-picker";
import { LabelPicker, LabelPickerFormInput } from "./label/label-picker";
import { DeliveryMethodPicker } from "./delivery/delivery-method-picker";
import en from "./translations/en.json";
import ru from "./translations/ru.json";
import tk from "./translations/tk.json";

export default defineDashboardExtension({
  translations: { en, ru, tk },
  customFormComponents: {
    // Registering components for use in custom fields
    customFields: [
      { id: "category-picker", component: CategoryPicker },
      { id: "label-picker", component: LabelPicker },
      { id: "label-picker-form-input", component: LabelPickerFormInput },
      { id: "delivery-method-picker", component: DeliveryMethodPicker },
    ],
    // Registering components for use in configurable operations (e.g. Collection Filters)
    // If this key is not supported, it might be 'arguments' or similar.
    // But 'customFields' is the primary one that was working.
    // Let's assume global registration by ID works if passed here, or simply try to put it here.
  },
});
