import { useState, useRef, useEffect } from "react";
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
  Textarea,
  TranslatableFormFieldWrapper,
  useDetailPage,
  useUserSettings,
  api,
  MultiSelect,
} from "@vendure/dashboard";
import { AnyRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import {
  GET_DELIVERY_METHOD,
  CREATE_DELIVERY_METHOD,
  UPDATE_DELIVERY_METHOD,
  GET_DAYS,
} from "../../api/delivery.queries";
import { useDeliveryTranslation } from "../hooks/use-delivery-translation";

function CustomTimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [h, m] = (value || "00:00").split(":");

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0"),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newH: string, newM: string) => {
    onChange(`${newH}:${newM}`);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative flex items-center">
        <Input
          type="text"
          value={value}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          className="w-full pr-10 cursor-pointer bg-slate-500/5 border-slate-200/10 text-slate-200"
          placeholder="HH:mm"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 h-full px-3 hover:bg-transparent"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Clock className="w-4 h-4 text-slate-200" />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-48 bg-slate-900 border border-slate-200/10 rounded-md shadow-lg flex h-64 overflow-hidden">
          {/* Hours Column */}
          <div className="flex-1 overflow-y-auto border-r border-slate-700 scrollbar-hide py-1">
            <div className="text-center text-[10px] text-slate-200 uppercase font-bold py-1 bg-slate-800 mb-1">
              Hour
            </div>
            {hours.map((hour) => (
              <div
                key={hour}
                onClick={() => handleSelect(hour, m)}
                className={`px-4 py-2 text-sm text-center cursor-pointer hover:bg-blue-50/10 transition-colors ${
                  h === hour
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-slate-200"
                }`}
              >
                {hour}
              </div>
            ))}
          </div>
          {/* Minutes Column */}
          <div className="flex-1 overflow-y-auto scrollbar-hide py-1">
            <div className="text-center text-[10px] text-slate-200 uppercase font-bold py-1 bg-slate-800 mb-1">
              Min
            </div>
            {minutes.map((min) => (
              <div
                key={min}
                onClick={() => handleSelect(h, min)}
                className={`px-4 py-2 text-sm text-center cursor-pointer hover:bg-blue-50/10 transition-colors ${
                  m === min
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-slate-200"
                }`}
              >
                {min}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DeliveryMethodDetailPage({ route }: { route: AnyRoute }) {
  const { t } = useDeliveryTranslation();
  const params = route.useParams();
  const navigate = useNavigate();
  const creatingNewEntity = params.id === "new";
  const {
    settings: { contentLanguage },
  } = useUserSettings();

  const { data: daysData } = useQuery({
    queryKey: ["days"],
    queryFn: () => api.query(GET_DAYS),
  });

  const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
    queryDocument: GET_DELIVERY_METHOD,
    createDocument: CREATE_DELIVERY_METHOD,
    updateDocument: UPDATE_DELIVERY_METHOD,
    setValuesForUpdate: (dm) => {
      const translations =
        dm?.translations?.map((t: any) => ({
          id: t.id,
          languageCode: t.languageCode,
          name: t.name ?? "",
          description: t.description ?? "",
        })) ?? [];

      if (
        translations.length === 0 ||
        !translations.find((t: any) => t.languageCode === contentLanguage)
      ) {
        translations.push({
          languageCode: contentLanguage,
          name: "",
          description: "",
        });
      }

      return {
        id: dm?.id ?? "",
        code: dm?.code ?? "",
        type: dm?.type || "default",
        enabled: dm?.enabled ?? true,
        isDisabled: dm?.isDisabled ?? false,
        sort: dm?.sort ?? 0,
        showTime: dm?.showTime ?? false,
        from: dm?.from?.slice(0, 5) || "09:00",
        to: dm?.to?.slice(0, 5) || "18:00",
        closeTime: dm?.closeTime?.slice(0, 5) || "17:00",
        minCost: dm?.minCost ?? 0,
        maxCost: dm?.maxCost ?? 0,
        limitPrice: dm?.limitPrice ?? 0,
        dayIds: dm?.days?.map((d: any) => d.id) ?? [],
        translations,
      };
    },
    params: { id: params.id },
    onSuccess: async (data: any) => {
      toast(t("delivery.save-success"));
      resetForm();
      if (creatingNewEntity) {
        await navigate({ to: `../$id`, params: { id: (data as any).id } });
      }
    },
    onError: (err) => {
      toast(t("delivery.save-error"), {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  return (
    <Page
      pageId="delivery-method-detail"
      form={form}
      submitHandler={submitHandler}
    >
      <PageTitle>
        {creatingNewEntity
          ? t("delivery.new-delivery-method")
          : (entity?.name ?? t("delivery.delivery-method"))}
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
                <Input {...field} placeholder="e.g. express-09-11" />
              )}
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
                    <SelectItem value="pickUp">
                      {t("delivery.pick-up")}
                    </SelectItem>
                    <SelectItem value="interval">
                      {t("delivery.interval")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </DetailFormGrid>

          <DetailFormGrid>
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
              name="isDisabled"
              label="Is Disabled (Cron)"
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
              name="showTime"
              label={t("delivery.show-time")}
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
              name="closeTime"
              label={t("delivery.close-time")}
              render={({ field }) => (
                <CustomTimePicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="from"
              label={t("delivery.from-time")}
              render={({ field }) => (
                <CustomTimePicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="to"
              label={t("delivery.to-time")}
              render={({ field }) => (
                <CustomTimePicker
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </DetailFormGrid>

          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="minCost"
              label={t("delivery.min-cost")}
              render={({ field }) => <NumberInput {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="maxCost"
              label={t("delivery.max-cost")}
              render={({ field }) => <NumberInput {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="limitPrice"
              label={t("delivery.limit-price")}
              render={({ field }) => <NumberInput {...field} />}
            />
          </DetailFormGrid>

          <div className="mt-8">
            <FormFieldWrapper
              control={form.control}
              name="dayIds"
              label={t("delivery.associated-days")}
              render={({ field }) => (
                <MultiSelect
                  value={field.value}
                  onChange={field.onChange}
                  multiple={true}
                  items={
                    daysData?.days?.items?.map((d: any) => ({
                      value: d.id,
                      label: d.name,
                    })) ?? []
                  }
                />
              )}
            />
          </div>

          <div className="mt-8 space-y-4">
            <TranslatableFormFieldWrapper
              control={form.control}
              name="name"
              label={t("delivery.name")}
              render={({ field }) => <Input {...field} />}
            />
            <TranslatableFormFieldWrapper
              control={form.control}
              name="description"
              label={t("delivery.description")}
              render={({ field }) => <Textarea {...field} />}
            />
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
