import {
  Button,
  DetailFormGrid,
  FormFieldWrapper,
  Input,
  Page,
  PageActionBar,
  PageActionBarRight,
  PageBlock,
  PageLayout,
  PageTitle,
  TranslatableFormFieldWrapper,
  useDetailPage,
  useUserSettings,
  SlugInput,
  NumberInput,
  Switch,
} from "@vendure/dashboard";
import { AssetIdInput } from "../components/asset-id-input";
import { AnyRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  GET_CATEGORY_TYPE,
  CREATE_CATEGORY_TYPE,
  UPDATE_CATEGORY_TYPE,
} from "../../api/category.queries";

export function CategoryTypeDetailPage({ route }: { route: AnyRoute }) {
  const params = (route?.useParams() || {}) as any;

  const navigate = useNavigate();
  const creatingNewEntity = params.id === "new";

  const userSettings = useUserSettings();
  const contentLanguage = userSettings?.settings?.contentLanguage || "en";

  const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
    queryDocument: GET_CATEGORY_TYPE,
    createDocument: CREATE_CATEGORY_TYPE,
    updateDocument: UPDATE_CATEGORY_TYPE,
    entityField: "categoryType",
    entityName: "CategoryType",
    setValuesForUpdate: (type) => {
      const translations =
        type?.translations?.map((t: any) => ({
          id: t.id,
          languageCode: t.languageCode,
          name: t.name ?? "",
        })) ?? [];

      if (!translations.find((t: any) => t.languageCode === contentLanguage)) {
        translations.push({
          languageCode: contentLanguage,
          name: "",
        });
      }

      return {
        id: type?.id ?? "",
        slug: type?.slug ?? "",
        sort: type?.sort ?? 0,
        enabled: type?.enabled ?? true,
        iconAssetId: type?.iconAsset?.id ?? null,
        imageAssetId: type?.imageAsset?.id ?? null,
        translations,
      };
    },
    params: { id: params.id },
    onSuccess: async (data: any) => {
      toast.success("Category Type saved successfully");
      resetForm();
      if (creatingNewEntity) {
        await navigate({ to: `/catalog/category-types/${data.id}` });
      }
    },
    onError: (err) => {
      toast.error("Failed to save category type", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  return (
    <Page
      pageId="category-type-detail"
      form={form}
      submitHandler={submitHandler}
    >
      <PageTitle>
        {creatingNewEntity
          ? "New Category Type"
          : (entity?.name ?? "Category Type")}
      </PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          <Button type="submit" disabled={!form.formState.isDirty || isPending}>
            {creatingNewEntity ? "Create" : "Update"}
          </Button>
        </PageActionBarRight>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="main" blockId="main-form">
          <DetailFormGrid>
            <TranslatableFormFieldWrapper
              control={form.control}
              name="name"
              label="Name"
              render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="slug"
              label="Slug"
              render={({ field }) => (
                <SlugInput
                  {...field}
                  entityName="CategoryType"
                  fieldName="slug"
                  watchFieldName="name"
                  entityId={entity?.id}
                />
              )}
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
            <FormFieldWrapper
              control={form.control}
              name="sort"
              label="Sort"
              render={({ field }) => (
                <NumberInput {...field} className="bg-slate-50 dark:bg-slate-500/5 border-slate-200 dark:border-slate-200/10 text-slate-900 dark:text-slate-200 font-bold" />
              )}
            />
          </DetailFormGrid>
          <FormFieldWrapper
            control={form.control}
            name="imageAssetId"
            label="Image"
            render={({ field }) => (
              <AssetIdInput
                value={field.value}
                onChange={field.onChange}
                entity={entity}
                assetField="imageAsset"
              />
            )}
          />
          <FormFieldWrapper
            control={form.control}
            name="iconAssetId"
            label="Icon"
            render={({ field }) => (
              <AssetIdInput
                value={field.value}
                onChange={field.onChange}
                entity={entity}
                assetField="iconAsset"
              />
            )}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
