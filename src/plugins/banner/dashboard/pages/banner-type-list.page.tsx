import {
  Button,
  ListPage,
  Page,
  PageLayout,
  PageBlock,
  PageTitle,
  PageActionBar,
  PageActionBarRight,
  api,
} from "@vendure/dashboard";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { GET_BANNER_TYPES } from "../../api/banner.queries";

export function BannerTypeListPage({ route }: { route: any }) {
  const { data, isLoading } = useQuery({
    queryKey: ["bannerTypes"],
    queryFn: () =>
      api.query(GET_BANNER_TYPES, {
        options: {
          sort: { sort: "ASC" },
        },
      }),
  });

  const bannerTypes = data?.bannerTypes?.items || [];

  return (
    <Page pageId="banner-type-list">
      <PageTitle>Banner Types</PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          <Button
            asChild
            className="bg-cyan-500 hover:bg-cyan-600 text-white rounded shadow-sm border-none px-4 h-9"
          >
            <Link to="./type/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Banner Type
            </Link>
          </Button>
        </PageActionBarRight>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="main" blockId="banner-type-list-main">
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-slate-900 dark:text-slate-200 font-bold">
                Loading banner types...
              </div>
            ) : bannerTypes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bannerTypes.map((type) => (
                  <div
                    key={type.id}
                    className="group relative bg-white dark:bg-slate-500/5 border border-slate-200 dark:border-slate-200/10 rounded-xl p-6 shadow-sm hover:border-cyan-500/30 transition-all cursor-default overflow-hidden flex flex-col justify-between h-32"
                  >
                    <Link
                      to={`./list/${type.id}`}
                      className="flex items-start justify-between cursor-pointer"
                    >
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors uppercase">
                        {type.name}
                      </h3>
                    </Link>
                    <Link
                      to={`/catalog/banners/type/${type.id}`}
                      className="absolute bottom-4 right-4 text-xs font-bold text-slate-900 dark:text-slate-200 hover:text-cyan-500 hover:underline z-10 transition-colors"
                    >
                      Edit type
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-slate-900 dark:text-slate-200 font-bold mb-2">
                  No banner types found
                </p>
                <p className="text-slate-900 dark:text-slate-200 text-sm max-w-sm font-bold">
                  Create a banner type to start organizing your banners into
                  different sections like "Main", "Market", etc.
                </p>
              </div>
            )}
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
