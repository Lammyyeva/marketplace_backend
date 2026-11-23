import { defineDashboardExtension } from "@vendure/dashboard";
import { Tags } from "lucide-react";
import { CategoryListPage } from "./pages/category-list.page";
import { CategoryDetailPage } from "./pages/category-detail.page";
import { CategoryTypeListPage } from "./pages/category-type-list.page";
import { CategoryTypeDetailPage } from "./pages/category-type-detail.page";
import en from "./translations/en.json";
import ru from "./translations/ru.json";
import tk from "./translations/tk.json";

export default defineDashboardExtension({
  translations: { en, ru, tk },
  routes: [
    {
      path: "/catalog/categories",
      component: (route) => <CategoryListPage route={route} />,
      navMenuItem: {
        id: "categories",
        title: "Categories",
        icon: Tags,
        sectionId: "catalog",
        order: 700,
      },
    },
    {
      path: "/catalog/categories/$id",
      component: (route) => <CategoryDetailPage route={route} />,
    },
    {
      path: "/catalog/category-types",
      component: (route) => <CategoryTypeListPage route={route} />,
      navMenuItem: {
        id: "category-types",
        title: "Category Types",
        icon: Tags,
        sectionId: "catalog",
        order: 701,
      },
    },
    {
      path: "/catalog/category-types/$id",
      component: (route) => <CategoryTypeDetailPage route={route} />,
    },
  ],
});
