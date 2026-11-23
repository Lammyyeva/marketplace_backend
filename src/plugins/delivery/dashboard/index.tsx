import { defineDashboardExtension } from "@vendure/dashboard";
import { CalendarIcon, TruckIcon } from "lucide-react";
import { DayListPage } from "./pages/day-list.page";
import { DayDetailPage } from "./pages/day-detail.page";
import { DeliveryMethodListPage } from "./pages/delivery-method-list.page";
import { DeliveryMethodDetailPage } from "./pages/delivery-method-detail.page";
import en from "./translations/en.json";
import tk from "./translations/tk.json";
import ru from "./translations/ru.json";

export default defineDashboardExtension({
  translations: {
    en,
    tk,
    ru,
  },
  routes: [
    // Days management
    {
      path: "/settings/delivery-days",
      component: (route) => <DayListPage route={route} />,
      navMenuItem: {
        id: "delivery-days",
        title: "Delivery Days",
        icon: CalendarIcon,
        sectionId: "settings",
        order: 100,
      },
    },
    {
      path: "/settings/delivery-days/$id",
      component: (route) => <DayDetailPage route={route} />,
    },

    // Delivery Methods management
    {
      path: "/settings/delivery-methods",
      component: (route) => <DeliveryMethodListPage route={route} />,
      navMenuItem: {
        id: "delivery-methods",
        title: "Delivery Methods",
        icon: TruckIcon,
        sectionId: "settings",
        order: 101,
      },
    },
    {
      path: "/settings/delivery-methods/$id",
      component: (route) => <DeliveryMethodDetailPage route={route} />,
    },
  ],
});
