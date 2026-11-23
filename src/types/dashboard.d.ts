declare module "@vendure/dashboard" {
  export const graphql: any;
  export const defineDashboardExtension: (config: any) => any;
  export type DashboardFormComponentProps<T = any> = {
    value: T;
    onChange: (value: T) => void;
    disabled?: boolean;
    readonly?: boolean;
    [key: string]: any;
  };
  export type DashboardFormComponent<T = any> = React.ComponentType<
    DashboardFormComponentProps<T>
  >;

  // Project convention is the direct `api.mutate(document, variables)` call
  // (matching every existing dashboard page); types are loose because the precise
  // variable/result types come from gql-tada in the vite build.
  export const api: {
    query: <T = any>(document: any, variables?: any) => Promise<T>;
    mutate: <T = any>(document: any, variables?: any) => Promise<T>;
  };
  export const useUserSettings: any;
  export const DashboardPlugin: any;
  export const useIsMobile: any;
  export const usePage: any;
  export const usePageBlock: any;
  export const useServerConfig: any;
  export const useAuth: any;
  export const useChannel: any;
  export const usePermissions: any;
  export const useTheme: any;
  export const useDisplayLocale: any;
  export const useUiLanguageLoader: any;
  export const useAlerts: any;
  export const useCustomFieldConfig: any;
  export const useDataTableContext: any;
  export const useDynamicTranslations: any;
  export const useExtendedDetailQuery: any;
  export const useExtendedListQuery: any;
  export const useFacetValueBrowser: any;
  export const useGroupedPermissions: any;
  export const useJobQueuePolling: any;
  export const useLocalFormat: any;
  export const usePaginatedList: any;
  export const useSavedViews: any;
  export const useWidgetDimensions: any;
  export const useWidgetFilters: any;
  export const toast: any;

  // Components
  export const Page: any;
  export const PageTitle: any;
  export const PageActionBar: any;
  export const PageActionBarRight: any;
  export const PageLayout: any;
  export const PageBlock: any;
  export const Button: any;
  export const Input: any;
  export const TextInput: any;
  export const NumberInput: any;
  export const PasswordInput: any;
  export const Switch: any;
  export const DetailFormGrid: any;
  export const FormFieldWrapper: any;
  export const TranslatableFormFieldWrapper: any;
  export const SlugInput: any;
  export const VendureImage: any;
  export const Select: any;
  export const SelectContent: any;
  export const SelectItem: any;
  export const SelectTrigger: any;
  export const SelectValue: any;
  export const Checkbox: any;
  export const Badge: any;
  export const Json: any;
  export const JsonViewer: any;
  export const Money: any;
  export const ListPage: any;
  export const DetailPageButton: any;
  export const AssetPickerDialog: any;
  export const assetFragment: any;
  export const Textarea: any;
  export const MultiSelect: any;
  export const DataTable: any;
  export const DropdownMenu: any;
  export const DropdownMenuTrigger: any;
  export const DropdownMenuContent: any;
  export const DropdownMenuItem: any;
  export const DropdownMenuSeparator: any;
  export const DropdownMenuLabel: any;
  export const DropdownMenuCheckboxItem: any;
  export const DropdownMenuRadioGroup: any;
  export const DropdownMenuRadioItem: any;
  export const DropdownMenuSub: any;
  export const DropdownMenuSubTrigger: any;
  export const DropdownMenuSubContent: any;
  export const DropdownMenuShortcut: any;
  export const Popover: any;
  export const PopoverTrigger: any;
  export const PopoverContent: any;
  export const Card: any;
  export const CardHeader: any;
  export const CardTitle: any;
  export const CardDescription: any;
  export const CardContent: any;
  export const CardFooter: any;
  export const RadioGroup: any;
  export const RadioGroupItem: any;
  export const Label: any;
  export const useMutation: any;
  export const useQueryClient: any;
  export const useQuery: any;

  // Routing & Hooks
  export const DashboardRouteDefinition: any;
  export const detailPageRouteLoader: any;
  export const useDetailPage: <T = any>(config: any) => any;

  // Add more as needed
}

declare module "@vendure/dashboard/plugin" {
  export const DashboardPlugin: any;
}

declare module "@vendure/dashboard/*" {
  const content: any;
  export default content;
}
