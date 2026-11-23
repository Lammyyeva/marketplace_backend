import {
  useDetailPage,
  Page,
  PageTitle,
  PageActionBar,
  PageActionBarRight,
  Button,
  PageLayout,
  PageBlock,
  FormFieldWrapper,
  TranslatableFormFieldWrapper,
  DetailFormGrid,
  NumberInput,
  TextInput,
  useUserSettings,
  SlugInput,
  Switch,
} from "@vendure/dashboard";
import { AnyRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { GET_LABEL, CREATE_LABEL, UPDATE_LABEL } from "../../api/label.queries";
import { ColorInput } from "../components/color-input";
import { AssetIdInput } from "../components/asset-id-input";
import { GetLabelQuery } from "../../../generated/generated-admin-types";

export function LabelDetailPage({ route }: { route: AnyRoute }) {
  const params = route.useParams();
  const navigate = useNavigate();
  const creatingNewEntity = params.id === "new";
  const userSettings = useUserSettings();
  const contentLanguage = userSettings?.settings?.contentLanguage ?? "tk";
  const { form, submitHandler, entity, isPending, resetForm } = useDetailPage<
    GetLabelQuery["label"]
  >({
    queryDocument: GET_LABEL,
    createDocument: CREATE_LABEL,
    updateDocument: UPDATE_LABEL,
    // Maps fetched entity → form state
    setValuesForUpdate: (label) => {
      const translations =
        label?.translations?.map((t: any) => ({
          id: t.id,
          languageCode: t.languageCode,
          name: t.name ?? "",
        })) ?? [];

      if (
        translations.length === 0 ||
        !translations.find((t) => t.languageCode === contentLanguage)
      ) {
        translations.push({
          languageCode: contentLanguage,
          name: "",
        });
      }

      return {
        id: label?.id ?? "",
        code: label?.code ?? "",
        color: label?.color ?? "",
        enabled: label?.enabled ?? false,
        sort: label?.sort ?? 0,
        featuredAssetId: (label as any)?.featuredAsset?.id ?? null,
        translations,
      };
    },
    params: { id: params.id },
    onSuccess: async (data: any) => {
      toast("Label saved successfully");
      resetForm();
      if (creatingNewEntity) {
        await navigate({ to: `../$id`, params: { id: data.id } });
      }
    },
    onError: (err) => {
      toast("Failed to save label", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  return (
    <Page pageId="label-detail" form={form} submitHandler={submitHandler}>
      <PageTitle>
        {creatingNewEntity ? "New Label" : (entity?.name ?? "Label")}
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
            {/* ✅ This is the key fix — TranslatableFormFieldWrapper
                            reads/writes to translations[currentLanguage].name
                            NOT to a top-level name field */}
            <TranslatableFormFieldWrapper
              control={form.control}
              name="name"
              label="Name"
              render={({ field }) => <TextInput {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="code"
              label="Code"
              render={({ field }) => (
                <SlugInput
                  {...field}
                  entityName="Label"
                  fieldName="code"
                  watchFieldName="name"
                  entityId={entity?.id}
                />
              )}
            />
          </DetailFormGrid>
          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="color"
              label="Color"
              render={({ field }) => (
                <ColorInput value={field.value} onChange={field.onChange} />
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="sort"
              label="Sort Order"
              render={({ field }) => <NumberInput {...field} />}
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
              />
            )}
          />
        </PageBlock>
        <PageBlock column="side" blockId="enabled-toggle">
          <FormFieldWrapper
            control={form.control}
            name="enabled"
            label="Enabled"
            render={({ field }) => (
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
