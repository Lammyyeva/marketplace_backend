import {
  Button,
  DetailFormGrid,
  FormFieldWrapper,
  Input,
  NumberInput,
  Page,
  PageActionBar,
  PageActionBarRight,
  PageBlock,
  PageLayout,
  PageTitle,
  TranslatableFormFieldWrapper,
  useDetailPage,
  useUserSettings,
  Switch,
} from "@vendure/dashboard";
import { AnyRoute, useNavigate } from "@tanstack/react-router";
import {
  GET_BANNER_TYPE,
  CREATE_BANNER_TYPE,
  UPDATE_BANNER_TYPE,
  DELETE_BANNER_TYPE,
} from "../../api/banner.queries";
import { toast } from "sonner";

export function BannerTypeDetailPage({ route }: { route: AnyRoute }) {
  const params = route.useParams() as any;
  const navigate = useNavigate();
  const creatingNewEntity = params.id === "new";
  const {
    settings: { contentLanguage },
  } = useUserSettings();

  const { form, submitHandler, deleteHandler, entity, isPending, resetForm } =
    useDetailPage({
      queryDocument: GET_BANNER_TYPE,
      createDocument: CREATE_BANNER_TYPE,
      updateDocument: UPDATE_BANNER_TYPE,
      deleteDocument: DELETE_BANNER_TYPE,
      setValuesForUpdate: (bannerType) => {
        const translations =
          bannerType?.translations?.map((t: any) => ({
            id: t.id,
            languageCode: t.languageCode,
            name: t.name ?? "",
          })) ?? [];

        if (
          translations.length === 0 ||
          !translations.find((t: any) => t.languageCode === contentLanguage)
        ) {
          translations.push({
            languageCode: contentLanguage,
            name: "",
          });
        }

        return {
          id: bannerType?.id ?? "",
          sort: bannerType?.sort ?? 0,
          enabled: bannerType?.enabled ?? true,
          translations,
        };
      },
      params: { id: params.id },
      onSuccess: async (data: any) => {
        toast("Banner Type saved successfully");
        resetForm();
        if (creatingNewEntity) {
          await navigate({ to: `/catalog/banners` });
        }
      },
      onError: (err) => {
        toast("Failed to save banner type", {
          description: err instanceof Error ? err.message : "Unknown error",
        });
      },
    });

  return (
    <Page pageId="banner-type-detail" form={form} submitHandler={submitHandler}>
      <PageTitle>
        {creatingNewEntity
          ? "Create Banner Type"
          : `Edit Banner Type: ${entity?.name || ""}`}
      </PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          {!creatingNewEntity && (
            <Button
              type="button"
              variant="destructive"
              className="mr-2"
              onClick={async () => {
                const confirmed = window.confirm(
                  "Are you sure you want to delete this banner type?",
                );
                if (confirmed) {
                  await deleteHandler();
                  navigate({ to: "/catalog/banners" });
                }
              }}
            >
              Delete
            </Button>
          )}
          <Button
            type="button"
            onClick={() => navigate({ to: "/catalog/banners" })}
            variant="outline"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!form.formState.isDirty || isPending}>
            Save
          </Button>
        </PageActionBarRight>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="main" blockId="banner-type-detail-main">
          <DetailFormGrid>
            <TranslatableFormFieldWrapper
              control={form.control}
              name="name"
              label="Name"
              render={({ field }) => <Input {...field} required />}
            />
            <FormFieldWrapper
              control={form.control}
              name="enabled"
              label="Enabled"
              render={({ field }) => (
                <div className="flex items-center h-10 mt-1">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </DetailFormGrid>
          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="sort"
              label="Sort Order"
              render={({ field }) => (
                <NumberInput
                  {...field}
                  placeholder="e.g. 1"
                  className="w-full text-sm bg-slate-500/5 border-slate-200/10 text-slate-200"
                />
              )}
            />
          </DetailFormGrid>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
