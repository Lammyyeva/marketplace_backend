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
  SlugInput,
  VendureImage,
  api,
  Switch,
} from "@vendure/dashboard";
import { X, Monitor } from "lucide-react";
import { AnyRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo } from "react";
import { useWatch } from "react-hook-form";
import {
  GET_BANNER,
  CREATE_BANNER,
  UPDATE_BANNER,
} from "../../api/banner.queries";
import { CategoryPicker } from "../../../product/dashboard/category/category-picker";
import { ModelPicker } from "../components/model-picker";
import { ProductPicker } from "../components/product-picker";
import { useQuery } from "@tanstack/react-query";
import { GET_ALL_PRODUCTS } from "../../api/banner.queries";
import { GetBannerQuery } from "../../../generated/generated-admin-types";

export function BannerDetailPage({ route }: { route: AnyRoute }) {
  const params = route.useParams() as any;
  const navigate = useNavigate();
  const creatingNewEntity = params.id === "new";
  const userSettings = useUserSettings();
  const contentLanguage = userSettings?.settings?.contentLanguage ?? "tk";

  const mapBannerToForm = useCallback(
    (banner: any) => {
      if (!banner)
        return {
          id: "",
          slug: "",
          sort: 0,
          enabled: true,
          typeId: params.typeId ?? "",
          redirect: "empty",
          link: "",
          backColor: "#000000",
          btnColor: "#000000",
          endDate: null,
          startDate: null,
          categoryId: null,
          modelId: null,
          productIds: [],
          productVariantIds: [],
          translations:
            contentLanguage === "tk"
              ? [{ languageCode: "tk", name: "" }]
              : [
                  {
                    languageCode: contentLanguage,
                    name: "",
                  },
                  {
                    languageCode: "tk",
                    name: "",
                  },
                ],
        };

      const translations =
        banner?.translations?.map((t: any) => ({
          id: t.id,
          languageCode: t.languageCode,
          name: t.name ?? "",
        })) ?? [];

      if (translations.length === 0) {
        translations.push({
          languageCode: "tk",
          name: "",
        });
        if (contentLanguage !== "tk") {
          translations.push({
            languageCode: contentLanguage,
            name: "",
          });
        }
      } else {
        if (!translations.find((t: any) => t.languageCode === "tk")) {
          translations.push({
            languageCode: "tk",
            name: "",
          });
        }
        if (
          contentLanguage !== "tk" &&
          !translations.find((t: any) => t.languageCode === contentLanguage)
        ) {
          translations.push({
            languageCode: contentLanguage,
            name: "",
          });
        }
      }

      return {
        id: banner.id ?? "",
        slug: banner.slug ?? "",
        sort: banner.sort ?? 0,
        enabled: banner.enabled ?? true,
        typeId: (
          banner.type?.id ??
          banner.typeId ??
          params.typeId ??
          ""
        ).toString(),
        redirect: (banner.redirect as string)?.trim().toLowerCase() || "empty",
        link: banner.link ?? "",
        backColor: banner.backColor || "#000000",
        btnColor: banner.btnColor || "#000000",
        endDate: banner.endDate ? new Date(banner.endDate).toISOString() : null,
        startDate: banner.startDate
          ? new Date(banner.startDate).toISOString()
          : null,
        categoryId:
          (banner.category?.id ?? banner.categoryId)?.toString() || null,
        modelId: (banner.model?.id ?? banner.modelId)?.toString() || null,
        productIds:
          (banner.products?.map((p: any) => p.id.toString()) ??
            banner.productIds?.map((id: any) => id.toString())) ||
          [],
        productVariantIds:
          (banner.variants?.map((v: any) => v.id.toString()) ??
            banner.productVariantIds?.map((id: any) => id.toString())) ||
          [],
        translations,
      };
    },
    [contentLanguage, params.typeId],
  );

  const { form, submitHandler, entity, isPending, resetForm } = useDetailPage<
    GetBannerQuery["banner"]
  >({
    queryDocument: GET_BANNER,
    createDocument: CREATE_BANNER,
    updateDocument: UPDATE_BANNER,
    setValuesForUpdate: (banner) => {
      const values = mapBannerToForm(banner);
      setTimeout(() => {
        if (!form.formState.isDirty) {
          form.reset(values);
        }
      }, 0);
      return values;
    },
    defaultValues: mapBannerToForm(null),
    transformCreateInput: (input) => ({
      ...input,
      typeId: params.typeId,
    }),
    params: { id: params.id },
    onSuccess: async (data: any) => {
      toast("Banner saved successfully");
      resetForm();
      if (creatingNewEntity) {
        await navigate({ to: `../$id`, params: { id: data.id } });
      }
    },
    onError: (err) => {
      toast("Failed to save banner", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
  });

  useEffect(() => {
    if (creatingNewEntity && !form.formState.isDirty) {
      form.reset(mapBannerToForm(null));
    }
  }, [
    creatingNewEntity,
    params.typeId,
    contentLanguage,
    form.reset,
    mapBannerToForm,
  ]);

  const redirectType = useWatch({
    control: form.control,
    name: "redirect",
  });

  const productIds = useWatch({
    control: form.control,
    name: "productIds",
  });

  const productVariantIds = useWatch({
    control: form.control,
    name: "productVariantIds",
  });

  const combinedIds = useMemo(
    () => [
      ...(productIds || []),
      ...(productVariantIds || []).map((id: string) => `v-${id}`),
    ],
    [productIds, productVariantIds],
  );

  const {
    data: productsData,
    error: productsError,
    isLoading: productsLoading,
  } = useQuery({
    queryKey: ["products-preview-mixed", combinedIds],
    queryFn: () =>
      api.query(GET_ALL_PRODUCTS, {
        options: {
          filter: {
            ids: productIds, // Parents we selected
          },
        },
      }),
    enabled: Array.isArray(productIds) && productIds.length > 0,
  });

  // We can't easily fetch variants standalone via GET_ALL_PRODUCTS unless we fetch their parents.
  // For simplicity of display, we'll only preview the parents for now,
  // or you could use a variants-specific query if one exists.
  const displayProducts = productsData?.getAllProducts?.items || [];

  return (
    <Page pageId="banner-detail" form={form} submitHandler={submitHandler}>
      <PageTitle>
        {creatingNewEntity ? "New Banner" : (entity?.name ?? "Banner")}
      </PageTitle>
      <PageActionBar>
        <PageActionBarRight>
          {!creatingNewEntity && (
            <Button variant="outline" asChild className="mr-2">
              <Link
                to={`/catalog/banners/list/${(entity?.type?.id ?? params.typeId ?? "").toString()}/${entity?.id}/assets`}
              >
                <Monitor className="mr-2 h-4 w-4" />
                Manage Images
              </Link>
            </Button>
          )}
          <Button type="submit" disabled={!form.formState.isDirty || isPending}>
            {creatingNewEntity ? "Create" : "Update"}
          </Button>
        </PageActionBarRight>
      </PageActionBar>
      <PageLayout>
        <PageBlock column="main" blockId="main-form">
          {/* Colors */}
          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="backColor"
              label="Background color"
              render={({ field }) => (
                <Input
                  {...field}
                  type="color"
                  className="h-10 w-20 p-1 border-none shadow-none bg-transparent cursor-pointer"
                />
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="btnColor"
              label="Button color"
              render={({ field }) => (
                <Input
                  {...field}
                  type="color"
                  className="h-10 w-20 p-1 border-none shadow-none bg-transparent cursor-pointer"
                />
              )}
            />
          </DetailFormGrid>

          {/* Name */}
          <DetailFormGrid>
            <TranslatableFormFieldWrapper
              control={form.control}
              name="name"
              label="Name"
              render={({ field }) => <Input {...field} />}
            />
          </DetailFormGrid>

          {/* Sort, Slug, Status */}
          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="sort"
              label="Sort"
              render={({ field }) => (
                <NumberInput {...field} className="bg-slate-50 dark:bg-slate-500/5 border-slate-200 dark:border-slate-200/10 text-slate-900 dark:text-slate-200 font-bold" />
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="slug"
              label="Slug"
              render={({ field }) => (
                <SlugInput
                  {...field}
                  entityName="Banner"
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
          </DetailFormGrid>

          {/* Start / End dates */}
          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="startDate"
              label="Start Date"
              render={({ field }) => (
                <Input
                  type="date"
                  value={field.value ? field.value.split("T")[0] : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) {
                      field.onChange(null);
                    } else {
                      const d = new Date(val);
                      if (!isNaN(d.getTime())) {
                        field.onChange(d.toISOString());
                      }
                    }
                  }}
                  className="bg-slate-50 dark:bg-slate-500/5 border-slate-200 dark:border-slate-200/10 text-slate-900 dark:text-slate-200 font-bold"
                />
              )}
            />
            <FormFieldWrapper
              control={form.control}
              name="endDate"
              label="End Date"
              render={({ field }) => (
                <Input
                  type="date"
                  value={field.value ? field.value.split("T")[0] : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) {
                      field.onChange(null);
                    } else {
                      const d = new Date(val);
                      if (!isNaN(d.getTime())) {
                        field.onChange(d.toISOString());
                      }
                    }
                  }}
                  className="bg-slate-50 dark:bg-slate-500/5 border-slate-200 dark:border-slate-200/10 text-slate-900 dark:text-slate-200 font-bold"
                />
              )}
            />
          </DetailFormGrid>

          {/* Redirect type selector */}
          <DetailFormGrid>
            <FormFieldWrapper
              control={form.control}
              name="redirect"
              label="Redirect"
              value="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-slate-50 dark:bg-slate-500/5 border-slate-200 dark:border-slate-200/10 text-slate-900 dark:text-slate-200 font-bold">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empty">Empty</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="model">Model</SelectItem>
                    <SelectItem value="products">Products</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </DetailFormGrid>

          {/* Redirect-specific fields */}
          <div className="space-y-6 mt-4 pb-6 border-b">
            {redirectType === "category" && (
              <FormFieldWrapper
                control={form.control}
                name="categoryId"
                label="Select category"
                render={({ field }) => (
                  <CategoryPicker
                    value={field.value}
                    onChange={field.onChange}
                    multiple={false}
                  />
                )}
              />
            )}

            {redirectType === "model" && (
              <FormFieldWrapper
                control={form.control}
                name="modelId"
                label="Select model"
                render={({ field }) => (
                  <ModelPicker value={field.value} onChange={field.onChange} />
                )}
              />
            )}

            {redirectType === "products" && (
              <div className="space-y-4">
                <FormFieldWrapper
                  control={form.control}
                  name="combinedProductSelection"
                  label=""
                  render={() => (
                    <ProductPicker
                      value={combinedIds}
                      onChange={(selected: {
                        productIds: string[];
                        variantIds: string[];
                      }) => {
                        form.setValue("productIds", selected.productIds, {
                          shouldDirty: true,
                        });
                        form.setValue(
                          "productVariantIds",
                          selected.variantIds,
                          { shouldDirty: true },
                        );
                      }}
                    />
                  )}
                />

                {displayProducts.length > 0 && (
                  <div className="mt-4 border border-slate-200 dark:border-slate-200/10 rounded-lg overflow-hidden bg-white dark:bg-slate-500/5">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 uppercase text-[10px] font-bold">
                        <tr>
                          <th className="px-4 py-2">Surat</th>
                          <th className="px-4 py-2">Ady</th>
                          <th className="px-4 py-2">Bahasy</th>
                          <th className="px-4 py-2">Mukdary</th>
                          <th className="px-4 py-2">SKU</th>
                          <th className="px-4 py-2 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-200/10">
                        {displayProducts.map((product: any) => (
                          <tr
                            key={product.id}
                            className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <div className="w-12 h-12 rounded border overflow-hidden bg-slate-800/50 flex items-center justify-center">
                                <VendureImage
                                  asset={product.featuredAsset}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-slate-200">
                              {product.name}
                            </td>
                            <td className="px-4 py-3 text-teal-600 font-bold tabular-nums">
                              {product.variants?.[0]?.priceWithTax
                                ? (
                                    product.variants[0].priceWithTax / 100
                                  ).toFixed(2)
                                : "-"}
                            </td>
                            <td className="px-4 py-3 text-slate-900 dark:text-slate-200 font-bold">
                              {product.variants?.[0]?.stockLevel ?? "-"}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-slate-900 dark:text-slate-200 font-bold">
                              {product.variants?.[0]?.sku ?? "-"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full"
                                onClick={() => {
                                  const currentIds = form.getValues(
                                    "productIds",
                                  ) as string[];
                                  form.setValue(
                                    "productIds",
                                    currentIds.filter(
                                      (id) => id !== product.id,
                                    ),
                                    { shouldDirty: true },
                                  );
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {redirectType === "url" && (
              <FormFieldWrapper
                control={form.control}
                name="link"
                label="Start https://..."
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="https://"
                    className="bg-slate-50 dark:bg-slate-500/5 border-slate-200 dark:border-slate-200/10 text-slate-900 dark:text-slate-200 font-bold"
                  />
                )}
              />
            )}
          </div>
        </PageBlock>
      </PageLayout>
    </Page>
  );
}
