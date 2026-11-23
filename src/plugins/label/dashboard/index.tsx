// src/plugins/label/dashboard/index.tsx
import { defineDashboardExtension } from "@vendure/dashboard";
import { Tag } from "lucide-react";
import { LabelListPage } from "./pages/label-list.page";
import { LabelDetailPage } from "./pages/label-detail.page";
import { ColorInput } from "./components/color-input";
import { AssetIdInput } from "./components/asset-id-input";
import en from "./translations/en.json";
import ru from "./translations/ru.json";
import tk from "./translations/tk.json";

export default defineDashboardExtension({
  translations: { en, ru, tk },
  routes: [
    {
      path: "/catalog/labels",
      component: (route) => <LabelListPage route={route} />,
      navMenuItem: {
        id: "labels",
        title: "Labels",
        icon: Tag,
        sectionId: "catalog",
        order: 600,
      },
    },
    {
      path: "/catalog/labels/$id",
      component: (route) => <LabelDetailPage route={route} />,
    },
  ],
  detailForms: [
    {
      pageId: "label-detail",
      inputs: [
        {
          blockId: "main-form",
          field: "color",
          component: ColorInput,
        },
        {
          blockId: "main-form",
          field: "featuredAssetId",
          component: AssetIdInput,
        },
      ],
    },
  ],
});
