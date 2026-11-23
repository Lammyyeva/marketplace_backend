import { useCallback, useEffect, useState } from 'react';
import {
    Button,
    Page,
    PageLayout,
    PageBlock,
    PageTitle,
    PageActionBar,
    PageActionBarRight,
    DataTable,
    api,
    useDetailPage,
    useUserSettings,
    DetailFormGrid,
    FormFieldWrapper,
    TranslatableFormFieldWrapper,
    Input,
    Switch,
    SlugInput,
    VendureImage,
} from '@vendure/dashboard';
import { Plus, Save, ArrowLeft, Trash2, Calendar, Globe, X } from 'lucide-react';
import { Link, useNavigate, useParams } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { GET_SEASON, CREATE_SEASON, UPDATE_SEASON } from '../queries';

export function SeasonDetailPage({ route }: { route: any }) {
    const params = useParams({ strict: false }) as any;
    const id = params?.id || 'new';
    const isNew = !id || id === 'new';
    const navigate = useNavigate();
    const userSettings = useUserSettings();
    const contentLanguage = userSettings?.settings?.contentLanguage ?? 'tk';

    const mapSeasonToForm = useCallback(
        (season: any) => {
            if (!season) {
                return {
                    slug: '',
                    startDate: null,
                    endDate: null,
                    isActive: true,
                    translations: [
                        { languageCode: contentLanguage, name: '', description: '' },
                    ],
                };
            }

            return {
                id: season.id,
                slug: season.slug,
                startDate: season.startDate ? new Date(season.startDate).toISOString() : null,
                endDate: season.endDate ? new Date(season.endDate).toISOString() : null,
                isActive: season.isActive,
                translations: season.translations.map((t: any) => ({
                    id: t.id,
                    languageCode: t.languageCode,
                    name: t.name || '',
                    description: t.description || '',
                })),
            };
        },
        [contentLanguage]
    );

    const { form, submitHandler, entity, isPending, resetForm } = useDetailPage<any>({
        queryDocument: GET_SEASON,
        createDocument: CREATE_SEASON,
        updateDocument: UPDATE_SEASON,
        setValuesForUpdate: (season) => {
            const values = mapSeasonToForm(season);
            setTimeout(() => {
                if (!form.formState.isDirty) {
                    form.reset(values);
                }
            }, 0);
            return values;
        },
        defaultValues: mapSeasonToForm(null),
        params: { id },
        onSuccess: async (data: any) => {
            toast.success(isNew ? 'Season created successfully' : 'Season updated successfully');
            if (isNew) {
                await navigate({ to: `/catalog/seasons/$id`, params: { id: data.createSeason.id } });
            }
        },
        onError: (err: any) => {
            toast.error(err.message || 'An error occurred');
        },
    });

    useEffect(() => {
        if (isNew && !form.formState.isDirty) {
            form.reset(mapSeasonToForm(null));
        }
    }, [isNew, contentLanguage, form.reset, mapSeasonToForm]);

    return (
        <Page pageId="season-detail" form={form} submitHandler={submitHandler}>
            <div className="flex items-center gap-4 mb-4">
                <Link to="/catalog/seasons">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <PageTitle>
                    {isNew ? 'Create New Season' : (entity?.name ?? 'Edit Season')}
                </PageTitle>
            </div>

            <PageActionBar>
                <PageActionBarRight>
                    <Button
                        type="submit"
                        variant="primary"
                        className="h-9 gap-2"
                        disabled={!form.formState.isDirty || isPending}
                    >
                        <Save className="w-3.5 h-3.5" />
                        {isNew ? 'Create Season' : 'Save Changes'}
                    </Button>
                </PageActionBarRight>
            </PageActionBar>

            <PageLayout>
                <PageBlock column="main" blockId="season-main">
                    <DetailFormGrid>
                        <TranslatableFormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Season Name"
                            render={({ field }) => (
                                <Input {...field} placeholder="e.g. Summer Collection 2025" />
                            )}
                        />
                    </DetailFormGrid>

                    <DetailFormGrid>
                        <FormFieldWrapper
                            control={form.control}
                            name="slug"
                            label="Slug / URL Identifier"
                            render={({ field }) => (
                                <SlugInput
                                    {...field}
                                    entityName="Season"
                                    fieldName="slug"
                                    watchFieldName="name"
                                    entityId={id === 'new' ? undefined : id}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="isActive"
                            label="Enabled"
                            render={({ field }) => (
                                <div className="flex items-center h-10 mt-1">
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <span className="ml-3 text-sm text-slate-500">
                                        {field.value ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            )}
                        />
                    </DetailFormGrid>

                    <DetailFormGrid>
                        <FormFieldWrapper
                            control={form.control}
                            name="startDate"
                            label="Start Date"
                            render={({ field }) => (
                                <Input
                                    type="date"
                                    value={field.value ? field.value.split('T')[0] : ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        field.onChange(val ? new Date(val).toISOString() : null);
                                    }}
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
                                    value={field.value ? field.value.split('T')[0] : ''}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        field.onChange(val ? new Date(val).toISOString() : null);
                                    }}
                                />
                            )}
                        />
                    </DetailFormGrid>

                    <div className="mt-8">
                        <TranslatableFormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="w-full min-h-[120px] p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
                                    placeholder="Describe this seasonal campaign..."
                                />
                            )}
                        />
                    </div>
                </PageBlock>
             </PageLayout>
        </Page>
    );
}
