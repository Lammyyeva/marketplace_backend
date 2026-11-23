import {
  Button,
  Page,
  PageBlock,
  PageLayout,
  PageTitle,
  PageActionBar,
  PageActionBarRight,
  VendureImage,
  api,
  useUserSettings,
  AssetPickerDialog,
} from "@vendure/dashboard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnyRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Upload, Trash2, ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  GET_BANNER,
  UPSERT_BANNER_ASSET,
  REMOVE_BANNER_ASSET,
} from "../../api/banner.queries";
import { GetBannerQuery } from "../../../generated/generated-admin-types";

const LANGUAGES = [
  { code: "tk", label: "Türkmençe" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
] as const;

export function BannerAssetManagementPage({ route }: { route: AnyRoute }) {
  const params = route.useParams() as any;
  const bannerId = params.id;
  const typeId = params.typeId;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["banner-images", bannerId],
    queryFn: () => api.query<GetBannerQuery>(GET_BANNER, { id: bannerId }),
    enabled: !!bannerId,
  });

  const banner = (data as any)?.banner;
  const assets = (banner?.assets as any[]) || [];

  const upsertMutation = useMutation({
    mutationFn: (input: {
      bannerId: string;
      languageCode: string;
      assetId: string;
    }) => api.mutate(UPSERT_BANNER_ASSET, { input }),
    onSuccess: () => {
      toast.success("Image updated successfully");
      queryClient.invalidateQueries({ queryKey: ["banner-images", bannerId] });
    },
    onError: (err: any) => {
      toast.error(`Failed to update image: ${err.message}`);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (input: { bannerId: string; languageCode: string }) =>
      api.mutate(REMOVE_BANNER_ASSET, { input }),
    onSuccess: () => {
      toast.success("Image removed successfully");
      queryClient.invalidateQueries({ queryKey: ["banner-images", bannerId] });
    },
    onError: (err: any) => {
      toast.error(`Failed to remove image: ${err.message}`);
    },
  });

  const getAssetForLang = (langCode: string) =>
    assets.find((a) => a.languageCode === langCode);

  return (
    <Page pageId="banner-asset-management">
      <PageTitle>
        {banner?.name ? `Images — ${banner.name}` : "Banner Images"}
      </PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          <Button variant="outline" asChild>
            <Link to={`/catalog/banners/list/${typeId}/${bannerId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Banner
            </Link>
          </Button>
        </PageActionBarRight>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="main" blockId="asset-management-main">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-slate-200">
              Loading...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              {LANGUAGES.map(({ code, label }) => {
                const asset = getAssetForLang(code);
                return (
                  <LanguageImageCard
                    key={code}
                    languageCode={code}
                    label={label}
                    image={asset}
                    bannerId={bannerId}
                    onUpsert={(assetId: string) =>
                      upsertMutation.mutate({
                        bannerId,
                        languageCode: code,
                        assetId,
                      })
                    }
                    onRemove={() =>
                      removeMutation.mutate({
                        bannerId,
                        languageCode: code,
                      })
                    }
                    isUpsertPending={upsertMutation.isPending}
                    isRemovePending={removeMutation.isPending}
                  />
                );
              })}
            </div>
          )}
        </PageBlock>
      </PageLayout>
    </Page>
  );
}

function LanguageImageCard({
  languageCode,
  label,
  image,
  bannerId,
  onUpsert,
  onRemove,
  isUpsertPending,
  isRemovePending,
}: {
  languageCode: string;
  label: string;
  image: any;
  bannerId: string;
  onUpsert: (assetId: string) => void;
  onRemove: () => void;
  isUpsertPending: boolean;
  isRemovePending: boolean;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="border border-slate-200/10 rounded-xl bg-slate-500/5 shadow-sm overflow-hidden">
      <AssetPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(assets) => {
          if (assets.length > 0) {
            onUpsert(assets[0].id);
          }
          setPickerOpen(false);
        }}
      />
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-200/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 font-bold text-xs uppercase">
            {languageCode}
          </span>
          <span className="font-semibold text-sm text-slate-300">{label}</span>
        </div>
        {image && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
            onClick={onRemove}
            disabled={isRemovePending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Image area */}
      <div className="p-4">
        {image?.asset ? (
          <div className="relative group">
            <div className="aspect-[16/9] bg-slate-900/50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200/10">
              <VendureImage
                asset={image.asset}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setPickerOpen(true)}
                disabled={isUpsertPending}
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Replace
              </Button>
            </div>
          </div>
        ) : (
          <div
            className="aspect-[16/9] bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-200/10 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-500/10 transition-colors"
            onClick={() => setPickerOpen(true)}
          >
            <ImageIcon className="h-8 w-8 text-slate-300 mb-2" />
            <span className="text-xs text-slate-200 font-medium">
              Click to add image
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
