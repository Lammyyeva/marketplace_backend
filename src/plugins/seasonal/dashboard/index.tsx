import { defineDashboardExtension } from '@vendure/dashboard';
import { CalendarRange } from 'lucide-react';
import { SeasonListPage } from './pages/SeasonListPage';
import { SeasonDetailPage } from './pages/SeasonDetailPage';
import { ProductSeasonSelector } from './components/ProductSeasonSelector';
import { gql } from 'graphql-tag';

export default defineDashboardExtension({
    routes: [
        {
            path: '/catalog/seasons',
            component: (route) => <SeasonListPage route={route} />,
            navMenuItem: {
                id: 'seasons',
                title: 'Seasons',
                icon: CalendarRange,
                sectionId: 'catalog',
                order: 100,
            },
        },
        {
            path: '/catalog/seasons/$id',
            component: (route) => <SeasonDetailPage route={route} />,
        },
    ],
    detailPageExtensions: [
        {
            pageId: 'product-detail',
            extendDetailDocument: gql`
                fragment ProductSeasonExtension on Product {
                    seasons {
                        id
                        name
                        isActive
                    }
                }
            `,
        }
    ],
    pageBlocks: [
        {
            id: 'product-seasons-block',
            title: 'Seasons',
            location: {
                pageId: 'product-detail',
                column: 'side',
                position: { blockId: 'facet-values', order: 'after' },
            },
            component: (props) => <ProductSeasonSelector context={props.context} />,
        },
    ],
});
