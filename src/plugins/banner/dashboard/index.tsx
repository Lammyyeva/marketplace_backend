import { defineDashboardExtension } from "@vendure/dashboard";
import "../../../dashboard-ui/global.css";
import { Image } from "lucide-react";
import { BannerListPage } from "./pages/banner-list.page";
import { BannerDetailPage } from "./pages/banner-detail.page";
import { BannerTypeListPage } from "./pages/banner-type-list.page";
import { BannerTypeDetailPage } from "./pages/banner-type-detail.page";
import { BannerAssetManagementPage } from "./pages/banner-asset-management.page";
import en from "./translations/en.json";
import ru from "./translations/ru.json";
import tk from "./translations/tk.json";

export default defineDashboardExtension({
  translations: { en, ru, tk },
  routes: [
    {
      path: "/catalog/banners",
      component: (route) => <BannerTypeListPage route={route} />,
      navMenuItem: {
        id: "banner-nav-menu-item",
        title: "Banners",
        icon: Image,
        sectionId: "catalog",
        order: 850,
      },
    },
    {
      path: "/catalog/banners/type/$id",
      component: (route) => <BannerTypeDetailPage route={route} />,
    },
    {
      path: "/catalog/banners/list/$typeId",
      component: (route) => <BannerListPage route={route} />,
    },
    {
      path: "/catalog/banners/list/$typeId/$id",
      component: (route) => <BannerDetailPage route={route} />,
    },
    {
      path: "/catalog/banners/list/$typeId/$id/assets",
      component: (route) => <BannerAssetManagementPage route={route} />,
    },
  ],
});
