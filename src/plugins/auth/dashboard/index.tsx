import { defineDashboardExtension } from "@vendure/dashboard";
import { AdminPasswordFormInput } from "./components/admin-password-form-input";

export default defineDashboardExtension({
  customFormComponents: {
    customFields: [
      {
        id: "admin-password-form-input",
        component: AdminPasswordFormInput,
      },
    ],
  },
});
