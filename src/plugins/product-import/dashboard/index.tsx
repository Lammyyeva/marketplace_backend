import { defineDashboardExtension } from '@vendure/dashboard';
import { FileUp, History, ImagePlus, Upload } from 'lucide-react';
import { ImportProductsPage } from './pages/ImportProductsPage';
import { UploadImagesPage } from './pages/UploadImagesPage';
import { ImportHistoryPage } from './pages/ImportHistoryPage';
import { ImportDetailPage } from './pages/ImportDetailPage';
import en from './translations/en.json';
import ru from './translations/ru.json';
import tk from './translations/tk.json';

export default defineDashboardExtension({
    translations: { en, ru, tk },
    routes: [
        {
            path: '/catalog/import-products',
            component: (route) => <ImportProductsPage route={route} />,
            navMenuItem: {
                id: 'import-products',
                title: 'Import Products',
                icon: FileUp,
                sectionId: 'catalog',
                order: 900,
            },
        },
        {
            path: '/catalog/upload-images',
            component: (route) => <UploadImagesPage route={route} />,
            navMenuItem: {
                id: 'upload-images',
                title: 'Upload Images',
                icon: ImagePlus,
                sectionId: 'catalog',
                order: 901,
            },
        },
        {
            path: '/catalog/import-history',
            component: (route) => <ImportHistoryPage route={route} />,
            navMenuItem: {
                id: 'import-history',
                title: 'Import History',
                icon: History,
                sectionId: 'catalog',
                order: 902,
            },
        },
        {
            path: '/catalog/import-history/$id',
            component: (route) => <ImportDetailPage route={route} />,
        },
    ],
});
