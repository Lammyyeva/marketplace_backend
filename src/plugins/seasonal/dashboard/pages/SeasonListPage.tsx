import {
    ListPage,
    PageActionBarRight,
    Button,
    DetailPageButton,
} from '@vendure/dashboard';
import { Link } from '@tanstack/react-router';
import { Plus, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { GET_ALL_SEASONS, DELETE_SEASON } from '../queries';

export function SeasonListPage({ route }: { route: any }) {
    return (
        <ListPage
            pageId="seasons-list"
            title="Seasons"
            listQuery={GET_ALL_SEASONS}
            deleteMutation={DELETE_SEASON}
            route={route}
            defaultColumnOrder={['id', 'name', 'dates', 'isActive']}
            customizeColumns={{
                id: {
                    header: () => <span className="font-bold text-slate-900 dark:text-slate-200 text-[10px]">ID</span>,
                },
                name: {
                    header: () => <span className="font-bold text-slate-900 dark:text-slate-200 text-[10px]">Name</span>,
                    cell: ({ row }: any) => (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="flex flex-col">
                                <DetailPageButton id={row.original.id} label={row.original.name} />
                                <div className="text-[10px] text-slate-500 font-mono">
                                    /{row.original.slug}
                                </div>
                            </div>
                        </div>
                    ),
                },
                dates: {
                    header: () => <span className="font-bold text-slate-900 dark:text-slate-200 text-[10px]">Period</span>,
                    cell: ({ row }: any) => (
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            {new Date(row.original.startDate).toLocaleDateString()} — {new Date(row.original.endDate).toLocaleDateString()}
                        </div>
                    ),
                },
                isActive: {
                    header: () => <span className="font-bold text-slate-900 dark:text-slate-200 text-[10px]">Status</span>,
                    cell: ({ row }: any) => {
                        const active = row.original.isActive;
                        return (
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase rounded p-1 inline-flex ${active ? 'text-emerald-500 bg-emerald-500/10' : 'text-slate-400 bg-slate-400/10'}`}>
                                {active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                {active ? 'Active' : 'Inactive'}
                            </div>
                        );
                    },
                },
            }}
        >
            <PageActionBarRight>
                <Link to="/catalog/seasons/new">
                    <Button variant="primary" className="h-9 gap-2 text-xs">
                        <Plus className="w-3.5 h-3.5" />
                        Create Season
                    </Button>
                </Link>
            </PageActionBarRight>
        </ListPage>
    );
}
