import { defineDashboardExtension } from "@vendure/dashboard";
import { UsersIcon } from "lucide-react";
import { WorkerListPage } from "./pages/worker-list.page";
import { WorkerDetailPage } from "./pages/worker-detail.page";
import { CourierSelector } from "./components/courier-selector";
import "./components/courier-selector.css";
import en from "./translations/en.json";
import ru from "./translations/ru.json";
import tk from "./translations/tk.json";

export default defineDashboardExtension({
  translations: { en, ru, tk },
  routes: [
    {
      path: "/catalog/workers",
      component: (route) => <WorkerListPage route={route} />,
      navMenuItem: {
        id: "workers",
        title: "Workers",
        icon: UsersIcon,
        sectionId: "catalog",
        order: 800,
      },
    },
    {
      path: "/catalog/workers/$id",
      component: (route) => <WorkerDetailPage route={route} />,
    },
  ],
  customFormComponents: {
    customFields: [
      { id: "courier-selector", component: CourierSelector },
    ],
  },
});
