import { defineDashboardExtension } from '@vendure/dashboard';
import { BarChart2, Settings2 } from 'lucide-react';
import { SearchMonitoringPage } from './pages/search-monitoring.page';
import { SearchSettingsPage } from './pages/search-settings.page';
import en from './translations/en.json';
import ru from './translations/ru.json';
import tk from './translations/tk.json';

export default defineDashboardExtension({
  translations: { en, ru, tk },
  routes: [
    {
      path: '/extensions/search-monitoring',
      component: (route: any) => <SearchMonitoringPage route={route} />,
      navMenuItem: {
        id: 'search-monitoring',
        title: 'Search Monitoring',
        icon: BarChart2,
        sectionId: 'settings',
        order: 900,
      },
    },
    {
      path: '/extensions/search-settings',
      component: (route: any) => <SearchSettingsPage route={route} />,
      navMenuItem: {
        id: 'search-settings',
        title: 'Search Settings',
        icon: Settings2,
        sectionId: 'settings',
        order: 901,
      },
    },
  ],
});
