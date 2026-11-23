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
  TranslatableFormFieldWrapper,
  useDetailPage,
  useUserSettings,
  Switch,
} from "@vendure/dashboard";
import { AnyRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { GET_DAY, CREATE_DAY, UPDATE_DAY } from "../../api/delivery.queries";
import { useDeliveryTranslation } from "../hooks/use-delivery-translation";

export function DayDetailPage({ route }: { route: AnyRoute }) {
  const { t } = useDeliveryTranslation();
  const params = route.useParams();
  const navigate = useNavigate();
  const creatingNewEntity = params.id === "new";
  const {
    settings: { contentLanguage },
  } = useUserSettings();

  const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
    queryDocument: GET_DAY,
    createDocument: CREATE_DAY,
    updateDocument: UPDATE_DAY,
    setValuesForUpdate: (day) => {
      const translations =
        day?.translations?.map((t: any) => ({
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
        id: day?.id ?? "",
        enabled: day?.enabled ?? true,
        sort: day?.sort ?? 0,
        code: day?.code ?? "",
        type: day?.type ?? "default",
        dayOffset: day?.dayOffset ?? 0,
        translations,
      };
    },
    params: { id: params.id },
    onSuccess: async (data: any) => {
      toast(t("delivery.day-save-success"));
      resetForm();
      if (creatingNewEntity) {
        await navigate({ to: `../$id`, params: { id: (data as any).id } });
      }
    },
    onError: (err) => {
      toast(t("delivery.day-save-error"), {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  return (
    <Page pageId="day-detail" form={form} submitHandler={submitHandler}>
      <PageTitle>
        {creatingNewEntity
          ? t("delivery.new-day")
          : (entity?.name ?? t("delivery.day"))}
      </PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          <Button type="submit" disabled={!form.formState.isDirty || isPending}>
            {creatingNewEntity ? t("delivery.create") : t("delivery.update")}
          </Button>
        </PageActionBarRight>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="main" blockId="main-form">
          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="code"
              label={t("delivery.code")}
              render={({ field }) => (
                <Input {...field} placeholder="e.g. shu-gun" />
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="enabled"
              label={t("delivery.enabled")}
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
              render={({ field }) => <NumberInput {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="type"
              label={t("delivery.type")}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("delivery.select-type")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">
                      {t("delivery.default")}
                    </SelectItem>
                    <SelectItem value="express">
                      {t("delivery.express")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="dayOffset"
              label={t("delivery.day-offset")}
              render={({ field }) => <NumberInput {...field} />}
            />
          </DetailFormGrid>

          <TranslatableFormFieldWrapper
            control={form.control}
            name="name"
            label={t("delivery.name")}
            render={({ field }) => <Input {...field} />}
          />
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
