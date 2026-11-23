import React, { useState, useEffect } from "react";
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
  useDetailPage,
} from "@vendure/dashboard";
import { AnyRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { GET_WORKER, CREATE_WORKER, UPDATE_WORKER } from "../../api/worker.queries";
import { useWorkerTranslation } from "../hooks/use-worker-translation";

export function WorkerDetailPage({ route }: { route: AnyRoute }) {
  const { t } = useWorkerTranslation();
  const params = route.useParams() as any;
  const navigate = useNavigate();
  const creatingNewEntity = params.id === "new";

  const { form, submitHandler, entity, isPending, resetForm } = useDetailPage({
    queryDocument: GET_WORKER,
    createDocument: CREATE_WORKER,
    updateDocument: UPDATE_WORKER,
    setValuesForUpdate: (worker) => {
      return {
        id: worker?.id ?? "",
        firstName: worker?.firstName ?? "",
        lastName: worker?.lastName ?? "",
        username: worker?.username ?? "",
        phone: worker?.phone ?? "",
        erpCode: worker?.erpCode ?? "",
        note: worker?.note ?? "",
        sort: worker?.sort ?? 0,
        enabled: worker?.enabled ?? true,
        role: worker?.role ?? "Courier",
        vehicle: worker?.vehicle ?? "",
        vehiclePlate: worker?.vehiclePlate ?? "",
        address: worker?.address ?? "",
        externalCode: worker?.externalCode ?? "",
        password: "",
      };
    },
    params: { id: params.id },
    onSuccess: async (data: any) => {
      toast(t("worker.save-success"));
      resetForm();
      if (creatingNewEntity) {
        await navigate({ to: `../$id`, params: { id: (data as any).id } });
      }
    },
    onError: (err) => {
      toast(t("worker.save-error"), {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  useEffect(() => {
    if (creatingNewEntity && !form.getValues("role")) {
      form.setValue("role", "Courier");
    }
  }, [creatingNewEntity, form]);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <Page pageId="worker-detail" form={form} submitHandler={submitHandler}>
      <PageTitle>
        {creatingNewEntity
          ? t("worker.new-worker")
          : `${entity?.firstName} ${entity?.lastName}`}
      </PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          <div className="flex items-center gap-4 mr-4">
            <FormFieldWrapper
              control={form.control}
              name="enabled"
              label={t("worker.enabled")}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          </div>
          <Button type="submit" disabled={!form.formState.isDirty || isPending}>
            {t("worker.save")}
          </Button>
        </PageActionBarRight>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="main" blockId="main-form">
          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="username"
              label={t("worker.username")}
              render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="password"
              label={t("worker.password")}
              render={({ field }) => (
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder={creatingNewEntity ? "" : "Leave blank to keep current"}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="firstName"
              label={t("worker.first-name")}
              render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="lastName"
              label={t("worker.last-name")}
              render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="phone"
              label={t("worker.phone")}
              render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="sort"
              label={t("worker.sort")}
              render={({ field }) => <NumberInput {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="note"
              label={t("worker.note")}
              render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="vehicle"
              label={t("worker.vehicle")}
              render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="vehiclePlate"
              label={t("worker.vehicle-plate")}
              render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="address"
              label={t("worker.address")}
              render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="role"
              label={t("worker.role")}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value && typeof field.value === 'string' ? field.value : "Courier"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("worker.role")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Courier">{t("worker.courier")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="erpCode"
              label={t("worker.erp-code")}
              render={({ field }) => <Input {...field} />}
            />
            <FormFieldWrapper
              control={form.control}
              name="externalCode"
              label={t("worker.external-code")}
              render={({ field }) => <Input {...field} />}
            />
          </DetailFormGrid>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
