import { defineDashboardExtension } from "@vendure/dashboard";
import { PerVariantDiscountFormInput } from "./components/per-variant-discount-form-input";
import { FacetDiscountFormInput } from "./components/facet-discount-form-input";
import { CategoryDiscountFormInput } from "./components/category-discount-form-input";
import en from "./translations/en.json";
import ru from "./translations/ru.json";
import tk from "./translations/tk.json";

export default defineDashboardExtension({
  translations: { en, ru, tk },
  customFormComponents: {
    customFields: [
      {
        id: "per-variant-discount-form-input",
        component: PerVariantDiscountFormInput,
      },
      {
        id: "facet-discount-form-input",
        component: FacetDiscountFormInput,
      },
      {
        id: "category-discount-form-input",
        component: CategoryDiscountFormInput,
      },
    ],
  },
});
