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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  TranslatableFormFieldWrapper,
  useDetailPage,
  useUserSettings,
  graphql,
  api,
  SlugInput,
} from "@vendure/dashboard";
import { useQuery } from "@tanstack/react-query"; // ✅ correct useQuery
import { AnyRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  GET_CATEGORY,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  GET_CATEGORY_TYPES,
} from "../../api/category.queries";
//import { useQuery } from "@apollo/client";
import { AssetIdInput } from "../components/asset-id-input";
import { ParentCategoryInput } from "../components/parent-category-input";
import { GetCategoryQuery } from "../../../generated/generated-admin-types";

export function CategoryDetailPage({ route }: { route: AnyRoute }) {
  const params = route.useParams();
  const navigate = useNavigate();
  const creatingNewEntity = params.id === "new";
  const userSettings = useUserSettings();
  const contentLanguage = userSettings?.settings?.contentLanguage ?? "tk";

  const { data: typeData } = useQuery({
    queryKey: ["category-types"],
    queryFn: () => api.query(GET_CATEGORY_TYPES),
  });

  const { form, submitHandler, entity, isPending, resetForm } = useDetailPage<
    GetCategoryQuery["category"]
  >({
    queryDocument: GET_CATEGORY,
    createDocument: CREATE_CATEGORY,
    updateDocument: UPDATE_CATEGORY,
    setValuesForUpdate: (category) => {
      const translations =
        category?.translations?.map((t: any) => ({
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
        id: category?.id ?? "",
        slug: category?.slug ?? "",
        sort: category?.sort ?? 0,
        enabled: category?.enabled ?? true,
        categoryTypeId:
          category?.categoryType?.id ??
          (typeData?.categoryTypes?.items?.[0]?.id || ""),
        featuredAssetId: category?.featuredAsset?.id ?? null,
        iconAssetId: category?.iconAsset?.id ?? null,
        parentId: category?.parent?.id ?? null,
        parentName: category?.parent?.name ?? "",
        translations,
      };
    },
    params: { id: params.id },
    onSuccess: async (data: any) => {
      toast("Category saved successfully");
      resetForm();
      if (creatingNewEntity) {
        await navigate({ to: `../$id`, params: { id: data.id } });
      }
    },
    onError: (err) => {
      toast("Failed to save category", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  return (
    <Page pageId="category-detail" form={form} submitHandler={submitHandler}>
      <PageTitle>
        {creatingNewEntity ? "New Category" : (entity?.name ?? "Category")}
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
                  entityName="Category"
                  fieldName="slug"
                  watchFieldName="name"
                  entityId={entity?.id}
                />
              )}
            />
          </DetailFormGrid>
          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="categoryTypeId"
              label="Category Type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeData?.categoryTypes?.items?.map((t: any) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="parentId"
              label="Categories"
              render={({ field }) => (
                <ParentCategoryInput
                  value={field.value}
                  onChange={(val, name, typeId) => {
                    field.onChange(val);
                    form.setValue("parentName", name, { shouldDirty: true });
                    if (typeId && form.getValues("categoryTypeId") !== typeId) {
                      form.setValue("categoryTypeId", typeId, {
                        shouldDirty: true,
                      });
                    }
                  }}
                  currentCategoryId={entity?.id}
                  parentName={form.watch("parentName")}
                  initialTypeId={form.watch("categoryTypeId")}
                />
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="sort"
              label="Sort Order"
              render={({ field }) => <NumberInput {...field} />}
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
          <FormFieldWrapper
            control={form.control}
            name="featuredAssetId"
            label="Image"
            render={({ field }) => (
              <AssetIdInput
                value={field.value}
                onChange={field.onChange}
                entity={entity}
                assetField="featuredAsset"
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
