import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Money: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type ActiveOrderResult = NoActiveOrderError | Order;

export type AddItemInput = {
  productVariantId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type AddPaymentToOrderResult = IneligiblePaymentMethodError | NoActiveOrderError | Order | OrderPaymentStateError | OrderStateTransitionError | PaymentDeclinedError | PaymentFailedError;

export type Address = Node & {
  __typename?: 'Address';
  city?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  country: Country;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<AddressCustomFields>;
  defaultBillingAddress?: Maybe<Scalars['Boolean']['output']>;
  defaultShippingAddress?: Maybe<Scalars['Boolean']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  streetLine1: Scalars['String']['output'];
  streetLine2?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type AddressCustomFields = {
  __typename?: 'AddressCustomFields';
  building?: Maybe<Scalars['String']['output']>;
  floor?: Maybe<Scalars['String']['output']>;
  homeType?: Maybe<Scalars['String']['output']>;
  house?: Maybe<Scalars['String']['output']>;
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Adjustment = {
  __typename?: 'Adjustment';
  adjustmentSource: Scalars['String']['output'];
  amount: Scalars['Money']['output'];
  data?: Maybe<Scalars['JSON']['output']>;
  description: Scalars['String']['output'];
  type: AdjustmentType;
};

export enum AdjustmentType {
  DISTRIBUTED_ORDER_PROMOTION = 'DISTRIBUTED_ORDER_PROMOTION',
  OTHER = 'OTHER',
  PROMOTION = 'PROMOTION'
}

export type AdminFilteredProductFilterParameters = {
  categoryIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  isRecommended?: InputMaybe<Scalars['Boolean']['input']>;
  isSale?: InputMaybe<Scalars['Boolean']['input']>;
  isSeason?: InputMaybe<Scalars['Boolean']['input']>;
  labelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  max?: InputMaybe<Scalars['Float']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
  modelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  sku?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type AdminFilteredProductListOptions = {
  filter?: InputMaybe<AdminFilteredProductFilterParameters>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<FilteredProductSortParameters>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type AggregatedMetadata = {
  __typename?: 'AggregatedMetadata';
  categories: Array<Category>;
  labels: Array<Label>;
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  models: Array<FacetValue>;
};

/** Returned when attempting to set the Customer for an Order when already logged in. */
export type AlreadyLoggedInError = ErrorResult & {
  __typename?: 'AlreadyLoggedInError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type AppleAuthInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  token: Scalars['String']['input'];
};

export type ApplyCouponCodeResult = CouponCodeExpiredError | CouponCodeInvalidError | CouponCodeLimitError | Order;

export type Asset = Node & {
  __typename?: 'Asset';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  fileSize: Scalars['Int']['output'];
  focalPoint?: Maybe<Coordinate>;
  height: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  mimeType: Scalars['String']['output'];
  name: Scalars['String']['output'];
  preview: Scalars['String']['output'];
  source: Scalars['String']['output'];
  tags: Array<Tag>;
  translations: Array<AssetTranslation>;
  type: AssetType;
  updatedAt: Scalars['DateTime']['output'];
  width: Scalars['Int']['output'];
};

export type AssetList = PaginatedList & {
  __typename?: 'AssetList';
  items: Array<Asset>;
  totalItems: Scalars['Int']['output'];
};

export type AssetTranslation = {
  __typename?: 'AssetTranslation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum AssetType {
  BINARY = 'BINARY',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export type AuthDeletionResponse = {
  __typename?: 'AuthDeletionResponse';
  message?: Maybe<Scalars['String']['output']>;
  result: AuthDeletionResult;
};

export enum AuthDeletionResult {
  DELETED = 'DELETED',
  NOT_DELETED = 'NOT_DELETED'
}

export type AuthenticationInput = {
  apple?: InputMaybe<AppleAuthInput>;
  email?: InputMaybe<EmailAuthInput>;
  google?: InputMaybe<GoogleAuthInput>;
  native?: InputMaybe<NativeAuthInput>;
  phoneLogin?: InputMaybe<PhoneAuthInput>;
};

export type AuthenticationMethod = Node & {
  __typename?: 'AuthenticationMethod';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  strategy: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AuthenticationResult = CurrentUser | InvalidCredentialsError | NotVerifiedError;

export type Banner = Node & {
  __typename?: 'Banner';
  asset?: Maybe<Asset>;
  assets: Array<BannerAsset>;
  backColor?: Maybe<Scalars['String']['output']>;
  btnColor?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Category>;
  counter: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  enabled: Scalars['Boolean']['output'];
  endDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  link?: Maybe<Scalars['String']['output']>;
  model?: Maybe<FacetValue>;
  name: Scalars['String']['output'];
  products?: Maybe<Array<Product>>;
  redirect: RedirectTypes;
  slug: Scalars['String']['output'];
  sort: Scalars['Int']['output'];
  startDate: Scalars['DateTime']['output'];
  translations: Array<BannerTranslation>;
  type?: Maybe<BannerType>;
  updatedAt: Scalars['DateTime']['output'];
  variants?: Maybe<Array<ProductVariant>>;
};

export type BannerAsset = Node & {
  __typename?: 'BannerAsset';
  asset: Asset;
  banner: Banner;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  updatedAt: Scalars['DateTime']['output'];
};

export type BannerFilterParameter = {
  _and?: InputMaybe<Array<BannerFilterParameter>>;
  _or?: InputMaybe<Array<BannerFilterParameter>>;
  backColor?: InputMaybe<StringOperators>;
  btnColor?: InputMaybe<StringOperators>;
  counter?: InputMaybe<NumberOperators>;
  createdAt?: InputMaybe<DateOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  endDate?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  link?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  redirect?: InputMaybe<StringOperators>;
  slug?: InputMaybe<StringOperators>;
  sort?: InputMaybe<NumberOperators>;
  startDate?: InputMaybe<DateOperators>;
  typeId?: InputMaybe<IdOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type BannerList = PaginatedList & {
  __typename?: 'BannerList';
  items: Array<Banner>;
  totalItems: Scalars['Int']['output'];
};

export type BannerListOptions = {
  filter?: InputMaybe<BannerFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<BannerSortParameter>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type BannerSortParameter = {
  backColor?: InputMaybe<SortOrder>;
  btnColor?: InputMaybe<SortOrder>;
  counter?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  enabled?: InputMaybe<SortOrder>;
  endDate?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  link?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  sort?: InputMaybe<SortOrder>;
  startDate?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type BannerTranslation = {
  __typename?: 'BannerTranslation';
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
};

export type BannerType = Node & {
  __typename?: 'BannerType';
  banners: Array<Banner>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sort: Scalars['Int']['output'];
  translations: Array<BannerTypeTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};

export type BannerTypeFilterParameter = {
  _and?: InputMaybe<Array<BannerTypeFilterParameter>>;
  _or?: InputMaybe<Array<BannerTypeFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  sort?: InputMaybe<NumberOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type BannerTypeList = PaginatedList & {
  __typename?: 'BannerTypeList';
  items: Array<BannerType>;
  totalItems: Scalars['Int']['output'];
};

export type BannerTypeListOptions = {
  filter?: InputMaybe<BannerTypeFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<BannerTypeSortParameter>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type BannerTypeSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sort?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type BannerTypeTranslation = {
  __typename?: 'BannerTypeTranslation';
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
};

export type BaseResponse = {
  __typename?: 'BaseResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type BooleanCustomFieldConfig = CustomField & {
  __typename?: 'BooleanCustomFieldConfig';
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  deprecationReason?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nullable?: Maybe<Scalars['Boolean']['output']>;
  readonly?: Maybe<Scalars['Boolean']['output']>;
  requiresPermission?: Maybe<Array<Permission>>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

/** Operators for filtering on a list of Boolean fields */
export type BooleanListOperators = {
  inList: Scalars['Boolean']['input'];
};

/** Operators for filtering on a Boolean field */
export type BooleanOperators = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BooleanStructFieldConfig = StructField & {
  __typename?: 'BooleanStructFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type BoughtTogetherResult = {
  __typename?: 'BoughtTogetherResult';
  count: Scalars['Int']['output'];
  product: Product;
};

export type Category = Node & {
  __typename?: 'Category';
  banners: Array<Banner>;
  categoryType: CategoryType;
  children: Array<Category>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  enabled: Scalars['Boolean']['output'];
  featuredAsset?: Maybe<Asset>;
  iconAsset?: Maybe<Asset>;
  id: Scalars['ID']['output'];
  models: Array<FacetValue>;
  name: Scalars['String']['output'];
  parent?: Maybe<Category>;
  productsByLabel: Array<Product>;
  slug: Scalars['String']['output'];
  sort: Scalars['Int']['output'];
  translations: Array<CategoryTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};


export type CategoryProductsByLabelArgs = {
  labelId: Scalars['ID']['input'];
};

export type CategoryFilterParameter = {
  _and?: InputMaybe<Array<CategoryFilterParameter>>;
  _or?: InputMaybe<Array<CategoryFilterParameter>>;
  categoryTypeId?: InputMaybe<IdOperators>;
  createdAt?: InputMaybe<DateOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  parentId?: InputMaybe<IdOperators>;
  slug?: InputMaybe<StringOperators>;
  sort?: InputMaybe<NumberOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type CategoryList = PaginatedList & {
  __typename?: 'CategoryList';
  items: Array<Category>;
  totalItems: Scalars['Int']['output'];
};

export type CategoryListOptions = {
  filter?: InputMaybe<CategoryFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<CategorySortParameter>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategorySortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  sort?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type CategoryTranslation = {
  __typename?: 'CategoryTranslation';
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
};

export type CategoryTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  languageCode: LanguageCode;
  name: Scalars['String']['input'];
};

export type CategoryType = Node & {
  __typename?: 'CategoryType';
  categories: Array<Category>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  enabled: Scalars['Boolean']['output'];
  iconAsset?: Maybe<Asset>;
  id: Scalars['ID']['output'];
  imageAsset?: Maybe<Asset>;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  sort: Scalars['Int']['output'];
  translations: Array<CategoryTypeTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CategoryTypeFilterParameter = {
  _and?: InputMaybe<Array<CategoryTypeFilterParameter>>;
  _or?: InputMaybe<Array<CategoryTypeFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  slug?: InputMaybe<StringOperators>;
  sort?: InputMaybe<NumberOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type CategoryTypeList = PaginatedList & {
  __typename?: 'CategoryTypeList';
  items: Array<CategoryType>;
  totalItems: Scalars['Int']['output'];
};

export type CategoryTypeListOptions = {
  filter?: InputMaybe<CategoryTypeFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<CategoryTypeSortParameter>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CategoryTypeSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  enabled?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  sort?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type CategoryTypeTranslation = {
  __typename?: 'CategoryTypeTranslation';
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
};

export type CategoryTypeTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  languageCode: LanguageCode;
  name: Scalars['String']['input'];
};

export type Channel = Node & {
  __typename?: 'Channel';
  availableCurrencyCodes: Array<CurrencyCode>;
  availableLanguageCodes?: Maybe<Array<LanguageCode>>;
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  /** @deprecated Use defaultCurrencyCode instead */
  currencyCode: CurrencyCode;
  customFields?: Maybe<ChannelCustomFields>;
  defaultCurrencyCode: CurrencyCode;
  defaultLanguageCode: LanguageCode;
  defaultShippingZone?: Maybe<Zone>;
  defaultTaxZone?: Maybe<Zone>;
  id: Scalars['ID']['output'];
  /** Not yet used - will be implemented in a future release. */
  outOfStockThreshold?: Maybe<Scalars['Int']['output']>;
  pricesIncludeTax: Scalars['Boolean']['output'];
  seller?: Maybe<Seller>;
  token: Scalars['String']['output'];
  /** Not yet used - will be implemented in a future release. */
  trackInventory?: Maybe<Scalars['Boolean']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ChannelCustomFields = {
  __typename?: 'ChannelCustomFields';
  dayLimit?: Maybe<Scalars['Int']['output']>;
};

export type Collection = Node & {
  __typename?: 'Collection';
  assets: Array<Asset>;
  breadcrumbs: Array<CollectionBreadcrumb>;
  children?: Maybe<Array<Collection>>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  description: Scalars['String']['output'];
  featuredAsset?: Maybe<Asset>;
  filters: Array<ConfigurableOperation>;
  id: Scalars['ID']['output'];
  languageCode?: Maybe<LanguageCode>;
  name: Scalars['String']['output'];
  parent?: Maybe<Collection>;
  parentId: Scalars['ID']['output'];
  position: Scalars['Int']['output'];
  productVariantCount: Scalars['Int']['output'];
  productVariants: ProductVariantList;
  slug: Scalars['String']['output'];
  translations: Array<CollectionTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};


export type CollectionProductVariantsArgs = {
  options?: InputMaybe<ProductVariantListOptions>;
};

export type CollectionBreadcrumb = {
  __typename?: 'CollectionBreadcrumb';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

export type CollectionFilterParameter = {
  _and?: InputMaybe<Array<CollectionFilterParameter>>;
  _or?: InputMaybe<Array<CollectionFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  parentId?: InputMaybe<IdOperators>;
  position?: InputMaybe<NumberOperators>;
  productVariantCount?: InputMaybe<NumberOperators>;
  slug?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type CollectionList = PaginatedList & {
  __typename?: 'CollectionList';
  items: Array<Collection>;
  totalItems: Scalars['Int']['output'];
};

export type CollectionListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<CollectionFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<CollectionSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
  topLevelOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * Which Collections are present in the products returned
 * by the search, and in what quantity.
 */
export type CollectionResult = {
  __typename?: 'CollectionResult';
  collection: Collection;
  count: Scalars['Int']['output'];
};

export type CollectionSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  parentId?: InputMaybe<SortOrder>;
  position?: InputMaybe<SortOrder>;
  productVariantCount?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type CollectionTranslation = {
  __typename?: 'CollectionTranslation';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ConfigArg = {
  __typename?: 'ConfigArg';
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ConfigArgDefinition = {
  __typename?: 'ConfigArgDefinition';
  defaultValue?: Maybe<Scalars['JSON']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  list: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type ConfigArgInput = {
  name: Scalars['String']['input'];
  /** A JSON stringified representation of the actual value */
  value: Scalars['String']['input'];
};

export type ConfigurableOperation = {
  __typename?: 'ConfigurableOperation';
  args: Array<ConfigArg>;
  code: Scalars['String']['output'];
};

export type ConfigurableOperationDefinition = {
  __typename?: 'ConfigurableOperationDefinition';
  args: Array<ConfigArgDefinition>;
  code: Scalars['String']['output'];
  description: Scalars['String']['output'];
};

export type ConfigurableOperationInput = {
  arguments: Array<ConfigArgInput>;
  code: Scalars['String']['input'];
};

export type Coordinate = {
  __typename?: 'Coordinate';
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

/**
 * A Country of the world which your shop operates in.
 *
 * The `code` field is typically a 2-character ISO code such as "GB", "US", "DE" etc. This code is used in certain inputs such as
 * `UpdateAddressInput` and `CreateAddressInput` to specify the country.
 */
export type Country = Node & Region & {
  __typename?: 'Country';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  parent?: Maybe<Region>;
  parentId?: Maybe<Scalars['ID']['output']>;
  translations: Array<RegionTranslation>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CountryList = PaginatedList & {
  __typename?: 'CountryList';
  items: Array<Country>;
  totalItems: Scalars['Int']['output'];
};

/** Returned if the provided coupon code is invalid */
export type CouponCodeExpiredError = ErrorResult & {
  __typename?: 'CouponCodeExpiredError';
  couponCode: Scalars['String']['output'];
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/** Returned if the provided coupon code is invalid */
export type CouponCodeInvalidError = ErrorResult & {
  __typename?: 'CouponCodeInvalidError';
  couponCode: Scalars['String']['output'];
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/** Returned if the provided coupon code is invalid */
export type CouponCodeLimitError = ErrorResult & {
  __typename?: 'CouponCodeLimitError';
  couponCode: Scalars['String']['output'];
  errorCode: ErrorCode;
  limit: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

export type CreateAddressCustomFieldsInput = {
  building?: InputMaybe<Scalars['String']['input']>;
  floor?: InputMaybe<Scalars['String']['input']>;
  homeType?: InputMaybe<Scalars['String']['input']>;
  house?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Input used to create an Address.
 *
 * The countryCode must correspond to a `code` property of a Country that has been defined in the
 * Vendure server. The `code` property is typically a 2-character ISO code such as "GB", "US", "DE" etc.
 * If an invalid code is passed, the mutation will fail.
 */
export type CreateAddressInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  countryCode: Scalars['String']['input'];
  customFields?: InputMaybe<CreateAddressCustomFieldsInput>;
  defaultBillingAddress?: InputMaybe<Scalars['Boolean']['input']>;
  defaultShippingAddress?: InputMaybe<Scalars['Boolean']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  streetLine1: Scalars['String']['input'];
  streetLine2?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCategoryInput = {
  categoryTypeId: Scalars['ID']['input'];
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  featuredAssetId?: InputMaybe<Scalars['ID']['input']>;
  iconAssetId?: InputMaybe<Scalars['ID']['input']>;
  modelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  slug: Scalars['String']['input'];
  sort?: InputMaybe<Scalars['Int']['input']>;
  translations: Array<CategoryTranslationInput>;
};

export type CreateCategoryTypeInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled: Scalars['Boolean']['input'];
  iconAssetId?: InputMaybe<Scalars['ID']['input']>;
  imageAssetId?: InputMaybe<Scalars['ID']['input']>;
  slug: Scalars['String']['input'];
  sort: Scalars['Int']['input'];
  translations: Array<CategoryTypeTranslationInput>;
};

export type CreateCustomerCustomFieldsInput = {
  birthDate?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCustomerInput = {
  customFields?: InputMaybe<CreateCustomerCustomFieldsInput>;
  emailAddress: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateLabelInput = {
  code: Scalars['String']['input'];
  color: Scalars['String']['input'];
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled: Scalars['Boolean']['input'];
  featuredAssetId: Scalars['ID']['input'];
  sort: Scalars['Int']['input'];
  translations: Array<LabelTranslationInput>;
};

/**
 * @description
 * ISO 4217 currency code
 *
 * @docsCategory common
 */
export enum CurrencyCode {
  /** United Arab Emirates dirham */
  AED = 'AED',
  /** Afghan afghani */
  AFN = 'AFN',
  /** Albanian lek */
  ALL = 'ALL',
  /** Armenian dram */
  AMD = 'AMD',
  /** Netherlands Antillean guilder */
  ANG = 'ANG',
  /** Angolan kwanza */
  AOA = 'AOA',
  /** Argentine peso */
  ARS = 'ARS',
  /** Australian dollar */
  AUD = 'AUD',
  /** Aruban florin */
  AWG = 'AWG',
  /** Azerbaijani manat */
  AZN = 'AZN',
  /** Bosnia and Herzegovina convertible mark */
  BAM = 'BAM',
  /** Barbados dollar */
  BBD = 'BBD',
  /** Bangladeshi taka */
  BDT = 'BDT',
  /** Bulgarian lev */
  BGN = 'BGN',
  /** Bahraini dinar */
  BHD = 'BHD',
  /** Burundian franc */
  BIF = 'BIF',
  /** Bermudian dollar */
  BMD = 'BMD',
  /** Brunei dollar */
  BND = 'BND',
  /** Boliviano */
  BOB = 'BOB',
  /** Brazilian real */
  BRL = 'BRL',
  /** Bahamian dollar */
  BSD = 'BSD',
  /** Bhutanese ngultrum */
  BTN = 'BTN',
  /** Botswana pula */
  BWP = 'BWP',
  /** Belarusian ruble */
  BYN = 'BYN',
  /** Belize dollar */
  BZD = 'BZD',
  /** Canadian dollar */
  CAD = 'CAD',
  /** Congolese franc */
  CDF = 'CDF',
  /** Swiss franc */
  CHF = 'CHF',
  /** Chilean peso */
  CLP = 'CLP',
  /** Renminbi (Chinese) yuan */
  CNY = 'CNY',
  /** Colombian peso */
  COP = 'COP',
  /** Costa Rican colon */
  CRC = 'CRC',
  /** Cuban convertible peso */
  CUC = 'CUC',
  /** Cuban peso */
  CUP = 'CUP',
  /** Cape Verde escudo */
  CVE = 'CVE',
  /** Czech koruna */
  CZK = 'CZK',
  /** Djiboutian franc */
  DJF = 'DJF',
  /** Danish krone */
  DKK = 'DKK',
  /** Dominican peso */
  DOP = 'DOP',
  /** Algerian dinar */
  DZD = 'DZD',
  /** Egyptian pound */
  EGP = 'EGP',
  /** Eritrean nakfa */
  ERN = 'ERN',
  /** Ethiopian birr */
  ETB = 'ETB',
  /** Euro */
  EUR = 'EUR',
  /** Fiji dollar */
  FJD = 'FJD',
  /** Falkland Islands pound */
  FKP = 'FKP',
  /** Pound sterling */
  GBP = 'GBP',
  /** Georgian lari */
  GEL = 'GEL',
  /** Ghanaian cedi */
  GHS = 'GHS',
  /** Gibraltar pound */
  GIP = 'GIP',
  /** Gambian dalasi */
  GMD = 'GMD',
  /** Guinean franc */
  GNF = 'GNF',
  /** Guatemalan quetzal */
  GTQ = 'GTQ',
  /** Guyanese dollar */
  GYD = 'GYD',
  /** Hong Kong dollar */
  HKD = 'HKD',
  /** Honduran lempira */
  HNL = 'HNL',
  /** Croatian kuna */
  HRK = 'HRK',
  /** Haitian gourde */
  HTG = 'HTG',
  /** Hungarian forint */
  HUF = 'HUF',
  /** Indonesian rupiah */
  IDR = 'IDR',
  /** Israeli new shekel */
  ILS = 'ILS',
  /** Indian rupee */
  INR = 'INR',
  /** Iraqi dinar */
  IQD = 'IQD',
  /** Iranian rial */
  IRR = 'IRR',
  /** Icelandic króna */
  ISK = 'ISK',
  /** Jamaican dollar */
  JMD = 'JMD',
  /** Jordanian dinar */
  JOD = 'JOD',
  /** Japanese yen */
  JPY = 'JPY',
  /** Kenyan shilling */
  KES = 'KES',
  /** Kyrgyzstani som */
  KGS = 'KGS',
  /** Cambodian riel */
  KHR = 'KHR',
  /** Comoro franc */
  KMF = 'KMF',
  /** North Korean won */
  KPW = 'KPW',
  /** South Korean won */
  KRW = 'KRW',
  /** Kuwaiti dinar */
  KWD = 'KWD',
  /** Cayman Islands dollar */
  KYD = 'KYD',
  /** Kazakhstani tenge */
  KZT = 'KZT',
  /** Lao kip */
  LAK = 'LAK',
  /** Lebanese pound */
  LBP = 'LBP',
  /** Sri Lankan rupee */
  LKR = 'LKR',
  /** Liberian dollar */
  LRD = 'LRD',
  /** Lesotho loti */
  LSL = 'LSL',
  /** Libyan dinar */
  LYD = 'LYD',
  /** Moroccan dirham */
  MAD = 'MAD',
  /** Moldovan leu */
  MDL = 'MDL',
  /** Malagasy ariary */
  MGA = 'MGA',
  /** Macedonian denar */
  MKD = 'MKD',
  /** Myanmar kyat */
  MMK = 'MMK',
  /** Mongolian tögrög */
  MNT = 'MNT',
  /** Macanese pataca */
  MOP = 'MOP',
  /** Mauritanian ouguiya */
  MRU = 'MRU',
  /** Mauritian rupee */
  MUR = 'MUR',
  /** Maldivian rufiyaa */
  MVR = 'MVR',
  /** Malawian kwacha */
  MWK = 'MWK',
  /** Mexican peso */
  MXN = 'MXN',
  /** Malaysian ringgit */
  MYR = 'MYR',
  /** Mozambican metical */
  MZN = 'MZN',
  /** Namibian dollar */
  NAD = 'NAD',
  /** Nigerian naira */
  NGN = 'NGN',
  /** Nicaraguan córdoba */
  NIO = 'NIO',
  /** Norwegian krone */
  NOK = 'NOK',
  /** Nepalese rupee */
  NPR = 'NPR',
  /** New Zealand dollar */
  NZD = 'NZD',
  /** Omani rial */
  OMR = 'OMR',
  /** Panamanian balboa */
  PAB = 'PAB',
  /** Peruvian sol */
  PEN = 'PEN',
  /** Papua New Guinean kina */
  PGK = 'PGK',
  /** Philippine peso */
  PHP = 'PHP',
  /** Pakistani rupee */
  PKR = 'PKR',
  /** Polish złoty */
  PLN = 'PLN',
  /** Paraguayan guaraní */
  PYG = 'PYG',
  /** Qatari riyal */
  QAR = 'QAR',
  /** Romanian leu */
  RON = 'RON',
  /** Serbian dinar */
  RSD = 'RSD',
  /** Russian ruble */
  RUB = 'RUB',
  /** Rwandan franc */
  RWF = 'RWF',
  /** Saudi riyal */
  SAR = 'SAR',
  /** Solomon Islands dollar */
  SBD = 'SBD',
  /** Seychelles rupee */
  SCR = 'SCR',
  /** Sudanese pound */
  SDG = 'SDG',
  /** Swedish krona/kronor */
  SEK = 'SEK',
  /** Singapore dollar */
  SGD = 'SGD',
  /** Saint Helena pound */
  SHP = 'SHP',
  /** Sierra Leonean leone */
  SLL = 'SLL',
  /** Somali shilling */
  SOS = 'SOS',
  /** Surinamese dollar */
  SRD = 'SRD',
  /** South Sudanese pound */
  SSP = 'SSP',
  /** São Tomé and Príncipe dobra */
  STN = 'STN',
  /** Salvadoran colón */
  SVC = 'SVC',
  /** Syrian pound */
  SYP = 'SYP',
  /** Swazi lilangeni */
  SZL = 'SZL',
  /** Thai baht */
  THB = 'THB',
  /** Tajikistani somoni */
  TJS = 'TJS',
  /** Turkmenistan manat */
  TMT = 'TMT',
  /** Tunisian dinar */
  TND = 'TND',
  /** Tongan paʻanga */
  TOP = 'TOP',
  /** Turkish lira */
  TRY = 'TRY',
  /** Trinidad and Tobago dollar */
  TTD = 'TTD',
  /** New Taiwan dollar */
  TWD = 'TWD',
  /** Tanzanian shilling */
  TZS = 'TZS',
  /** Ukrainian hryvnia */
  UAH = 'UAH',
  /** Ugandan shilling */
  UGX = 'UGX',
  /** United States dollar */
  USD = 'USD',
  /** Uruguayan peso */
  UYU = 'UYU',
  /** Uzbekistan som */
  UZS = 'UZS',
  /** Venezuelan bolívar soberano */
  VES = 'VES',
  /** Vietnamese đồng */
  VND = 'VND',
  /** Vanuatu vatu */
  VUV = 'VUV',
  /** Samoan tala */
  WST = 'WST',
  /** CFA franc BEAC */
  XAF = 'XAF',
  /** East Caribbean dollar */
  XCD = 'XCD',
  /** CFA franc BCEAO */
  XOF = 'XOF',
  /** CFP franc (franc Pacifique) */
  XPF = 'XPF',
  /** Yemeni rial */
  YER = 'YER',
  /** South African rand */
  ZAR = 'ZAR',
  /** Zambian kwacha */
  ZMW = 'ZMW',
  /** Zimbabwean dollar */
  ZWL = 'ZWL'
}

export type CurrentUser = {
  __typename?: 'CurrentUser';
  accessToken?: Maybe<Scalars['String']['output']>;
  channels: Array<CurrentUserChannel>;
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
};

export type CurrentUserChannel = {
  __typename?: 'CurrentUserChannel';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  permissions: Array<Permission>;
  token: Scalars['String']['output'];
};

export type CustomField = {
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  deprecationReason?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nullable?: Maybe<Scalars['Boolean']['output']>;
  readonly?: Maybe<Scalars['Boolean']['output']>;
  requiresPermission?: Maybe<Array<Permission>>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type CustomFieldConfig = BooleanCustomFieldConfig | DateTimeCustomFieldConfig | FloatCustomFieldConfig | IntCustomFieldConfig | LocaleStringCustomFieldConfig | LocaleTextCustomFieldConfig | RelationCustomFieldConfig | StringCustomFieldConfig | StructCustomFieldConfig | TextCustomFieldConfig;

export type Customer = Node & {
  __typename?: 'Customer';
  addresses?: Maybe<Array<Address>>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<CustomerCustomFields>;
  emailAddress: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  orders: OrderList;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
};


export type CustomerOrdersArgs = {
  options?: InputMaybe<OrderListOptions>;
};

export type CustomerCustomFields = {
  __typename?: 'CustomerCustomFields';
  birthDate?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
};

export type CustomerFilterParameter = {
  _and?: InputMaybe<Array<CustomerFilterParameter>>;
  _or?: InputMaybe<Array<CustomerFilterParameter>>;
  birthDate?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  emailAddress?: InputMaybe<StringOperators>;
  firstName?: InputMaybe<StringOperators>;
  gender?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  lastName?: InputMaybe<StringOperators>;
  password?: InputMaybe<StringOperators>;
  phoneNumber?: InputMaybe<StringOperators>;
  region?: InputMaybe<StringOperators>;
  title?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type CustomerGroup = Node & {
  __typename?: 'CustomerGroup';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  customers: CustomerList;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};


export type CustomerGroupCustomersArgs = {
  options?: InputMaybe<CustomerListOptions>;
};

export type CustomerList = PaginatedList & {
  __typename?: 'CustomerList';
  items: Array<Customer>;
  totalItems: Scalars['Int']['output'];
};

export type CustomerListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<CustomerFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<CustomerSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CustomerSortParameter = {
  birthDate?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  emailAddress?: InputMaybe<SortOrder>;
  firstName?: InputMaybe<SortOrder>;
  gender?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  lastName?: InputMaybe<SortOrder>;
  password?: InputMaybe<SortOrder>;
  phoneNumber?: InputMaybe<SortOrder>;
  region?: InputMaybe<SortOrder>;
  title?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

/** Operators for filtering on a list of Date fields */
export type DateListOperators = {
  inList: Scalars['DateTime']['input'];
};

/** Operators for filtering on a DateTime field */
export type DateOperators = {
  after?: InputMaybe<Scalars['DateTime']['input']>;
  before?: InputMaybe<Scalars['DateTime']['input']>;
  between?: InputMaybe<DateRange>;
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DateRange = {
  end: Scalars['DateTime']['input'];
  start: Scalars['DateTime']['input'];
};

/**
 * Expects the same validation formats as the `<input type="datetime-local">` HTML element.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes
 */
export type DateTimeCustomFieldConfig = CustomField & {
  __typename?: 'DateTimeCustomFieldConfig';
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  deprecationReason?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  max?: Maybe<Scalars['String']['output']>;
  min?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  nullable?: Maybe<Scalars['Boolean']['output']>;
  readonly?: Maybe<Scalars['Boolean']['output']>;
  requiresPermission?: Maybe<Array<Permission>>;
  step?: Maybe<Scalars['Int']['output']>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

/**
 * Expects the same validation formats as the `<input type="datetime-local">` HTML element.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes
 */
export type DateTimeStructFieldConfig = StructField & {
  __typename?: 'DateTimeStructFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  max?: Maybe<Scalars['String']['output']>;
  min?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  step?: Maybe<Scalars['Int']['output']>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type Day = Node & {
  __typename?: 'Day';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  date?: Maybe<Scalars['String']['output']>;
  dayOffset?: Maybe<Scalars['Int']['output']>;
  deliveryMethods: Array<DeliveryMethod>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sort: Scalars['Int']['output'];
  translations: Array<DayTranslation>;
  type: DayType;
  updatedAt: Scalars['DateTime']['output'];
};

export type DayFilterParameter = {
  _and?: InputMaybe<Array<DayFilterParameter>>;
  _or?: InputMaybe<Array<DayFilterParameter>>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  date?: InputMaybe<StringOperators>;
  dayOffset?: InputMaybe<NumberOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  sort?: InputMaybe<NumberOperators>;
  type?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type DayList = PaginatedList & {
  __typename?: 'DayList';
  items: Array<Day>;
  totalItems: Scalars['Int']['output'];
};

export type DayListOptions = {
  filter?: InputMaybe<DayFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<DaySortParameter>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type DaySortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  date?: InputMaybe<SortOrder>;
  dayOffset?: InputMaybe<SortOrder>;
  enabled?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sort?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type DayTranslation = {
  __typename?: 'DayTranslation';
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
};

export enum DayType {
  default = 'default',
  express = 'express'
}

export type DeletionResponse = {
  __typename?: 'DeletionResponse';
  message?: Maybe<Scalars['String']['output']>;
  result: DeletionResult;
};

export enum DeletionResult {
  /** The entity was successfully deleted */
  DELETED = 'DELETED',
  /** Deletion did not take place, reason given in message */
  NOT_DELETED = 'NOT_DELETED'
}

export type DeliveryCredentialGroup = {
  __typename?: 'DeliveryCredentialGroup';
  data: Array<DeliveryMethod>;
  date?: Maybe<Scalars['String']['output']>;
  day: Scalars['String']['output'];
  key: Scalars['Int']['output'];
  type: Scalars['String']['output'];
};

export type DeliveryMethod = Node & {
  __typename?: 'DeliveryMethod';
  closeTime: Scalars['String']['output'];
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  days: Array<Day>;
  description: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  from: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isDisabled: Scalars['Boolean']['output'];
  limitPrice: Scalars['Int']['output'];
  maxCost: Scalars['Int']['output'];
  minCost: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  showTime: Scalars['Boolean']['output'];
  sort: Scalars['Int']['output'];
  to: Scalars['String']['output'];
  translations: Array<DeliveryMethodTranslation>;
  type: DeliveryMethodType;
  updatedAt: Scalars['DateTime']['output'];
};

export type DeliveryMethodFilterParameter = {
  _and?: InputMaybe<Array<DeliveryMethodFilterParameter>>;
  _or?: InputMaybe<Array<DeliveryMethodFilterParameter>>;
  closeTime?: InputMaybe<StringOperators>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  from?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  isDisabled?: InputMaybe<BooleanOperators>;
  limitPrice?: InputMaybe<NumberOperators>;
  maxCost?: InputMaybe<NumberOperators>;
  minCost?: InputMaybe<NumberOperators>;
  name?: InputMaybe<StringOperators>;
  showTime?: InputMaybe<BooleanOperators>;
  sort?: InputMaybe<NumberOperators>;
  to?: InputMaybe<StringOperators>;
  type?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type DeliveryMethodList = PaginatedList & {
  __typename?: 'DeliveryMethodList';
  items: Array<DeliveryMethod>;
  totalItems: Scalars['Int']['output'];
};

export type DeliveryMethodListOptions = {
  filter?: InputMaybe<DeliveryMethodFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<DeliveryMethodSortParameter>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type DeliveryMethodSortParameter = {
  closeTime?: InputMaybe<SortOrder>;
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  enabled?: InputMaybe<SortOrder>;
  from?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isDisabled?: InputMaybe<SortOrder>;
  limitPrice?: InputMaybe<SortOrder>;
  maxCost?: InputMaybe<SortOrder>;
  minCost?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  showTime?: InputMaybe<SortOrder>;
  sort?: InputMaybe<SortOrder>;
  to?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type DeliveryMethodTranslation = {
  __typename?: 'DeliveryMethodTranslation';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
};

export enum DeliveryMethodType {
  default = 'default',
  express = 'express',
  interval = 'interval',
  pickUp = 'pickUp'
}

export type Discount = {
  __typename?: 'Discount';
  adjustmentSource: Scalars['String']['output'];
  amount: Scalars['Money']['output'];
  amountWithTax: Scalars['Money']['output'];
  description: Scalars['String']['output'];
  type: AdjustmentType;
};

/** Returned when attempting to create a Customer with an email address already registered to an existing User. */
export type EmailAddressConflictError = ErrorResult & {
  __typename?: 'EmailAddressConflictError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type EmailAuthInput = {
  emailAddress: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export enum ErrorCode {
  ALREADY_LOGGED_IN_ERROR = 'ALREADY_LOGGED_IN_ERROR',
  COUPON_CODE_EXPIRED_ERROR = 'COUPON_CODE_EXPIRED_ERROR',
  COUPON_CODE_INVALID_ERROR = 'COUPON_CODE_INVALID_ERROR',
  COUPON_CODE_LIMIT_ERROR = 'COUPON_CODE_LIMIT_ERROR',
  EMAIL_ADDRESS_CONFLICT_ERROR = 'EMAIL_ADDRESS_CONFLICT_ERROR',
  GUEST_CHECKOUT_ERROR = 'GUEST_CHECKOUT_ERROR',
  IDENTIFIER_CHANGE_TOKEN_EXPIRED_ERROR = 'IDENTIFIER_CHANGE_TOKEN_EXPIRED_ERROR',
  IDENTIFIER_CHANGE_TOKEN_INVALID_ERROR = 'IDENTIFIER_CHANGE_TOKEN_INVALID_ERROR',
  INELIGIBLE_PAYMENT_METHOD_ERROR = 'INELIGIBLE_PAYMENT_METHOD_ERROR',
  INELIGIBLE_SHIPPING_METHOD_ERROR = 'INELIGIBLE_SHIPPING_METHOD_ERROR',
  INSUFFICIENT_STOCK_ERROR = 'INSUFFICIENT_STOCK_ERROR',
  INVALID_CREDENTIALS_ERROR = 'INVALID_CREDENTIALS_ERROR',
  MISSING_PASSWORD_ERROR = 'MISSING_PASSWORD_ERROR',
  NATIVE_AUTH_STRATEGY_ERROR = 'NATIVE_AUTH_STRATEGY_ERROR',
  NEGATIVE_QUANTITY_ERROR = 'NEGATIVE_QUANTITY_ERROR',
  NOT_VERIFIED_ERROR = 'NOT_VERIFIED_ERROR',
  NO_ACTIVE_ORDER_ERROR = 'NO_ACTIVE_ORDER_ERROR',
  ORDER_INTERCEPTOR_ERROR = 'ORDER_INTERCEPTOR_ERROR',
  ORDER_LIMIT_ERROR = 'ORDER_LIMIT_ERROR',
  ORDER_MODIFICATION_ERROR = 'ORDER_MODIFICATION_ERROR',
  ORDER_PAYMENT_STATE_ERROR = 'ORDER_PAYMENT_STATE_ERROR',
  ORDER_STATE_TRANSITION_ERROR = 'ORDER_STATE_TRANSITION_ERROR',
  PASSWORD_ALREADY_SET_ERROR = 'PASSWORD_ALREADY_SET_ERROR',
  PASSWORD_RESET_TOKEN_EXPIRED_ERROR = 'PASSWORD_RESET_TOKEN_EXPIRED_ERROR',
  PASSWORD_RESET_TOKEN_INVALID_ERROR = 'PASSWORD_RESET_TOKEN_INVALID_ERROR',
  PASSWORD_VALIDATION_ERROR = 'PASSWORD_VALIDATION_ERROR',
  PAYMENT_DECLINED_ERROR = 'PAYMENT_DECLINED_ERROR',
  PAYMENT_FAILED_ERROR = 'PAYMENT_FAILED_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VERIFICATION_TOKEN_EXPIRED_ERROR = 'VERIFICATION_TOKEN_EXPIRED_ERROR',
  VERIFICATION_TOKEN_INVALID_ERROR = 'VERIFICATION_TOKEN_INVALID_ERROR'
}

export type ErrorResult = {
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type Facet = Node & {
  __typename?: 'Facet';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  translations: Array<FacetTranslation>;
  updatedAt: Scalars['DateTime']['output'];
  /** Returns a paginated, sortable, filterable list of the Facet's values. Added in v2.1.0. */
  valueList: FacetValueList;
  values: Array<FacetValue>;
};


export type FacetValueListArgs = {
  options?: InputMaybe<FacetValueListOptions>;
};

export type FacetFilterParameter = {
  _and?: InputMaybe<Array<FacetFilterParameter>>;
  _or?: InputMaybe<Array<FacetFilterParameter>>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type FacetList = PaginatedList & {
  __typename?: 'FacetList';
  items: Array<Facet>;
  totalItems: Scalars['Int']['output'];
};

export type FacetListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<FacetFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<FacetSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type FacetSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type FacetTranslation = {
  __typename?: 'FacetTranslation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type FacetValue = Node & {
  __typename?: 'FacetValue';
  categoryIds: Array<Scalars['ID']['output']>;
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<FacetValueCustomFields>;
  facet: Facet;
  facetId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  translations: Array<FacetValueTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};

export type FacetValueCustomFields = {
  __typename?: 'FacetValueCustomFields';
  categories?: Maybe<Array<Category>>;
};

/**
 * Used to construct boolean expressions for filtering search results
 * by FacetValue ID. Examples:
 *
 * * ID=1 OR ID=2: `{ facetValueFilters: [{ or: [1,2] }] }`
 * * ID=1 AND ID=2: `{ facetValueFilters: [{ and: 1 }, { and: 2 }] }`
 * * ID=1 AND (ID=2 OR ID=3): `{ facetValueFilters: [{ and: 1 }, { or: [2,3] }] }`
 */
export type FacetValueFilterInput = {
  and?: InputMaybe<Scalars['ID']['input']>;
  or?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type FacetValueFilterParameter = {
  _and?: InputMaybe<Array<FacetValueFilterParameter>>;
  _or?: InputMaybe<Array<FacetValueFilterParameter>>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  facetId?: InputMaybe<IdOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type FacetValueList = PaginatedList & {
  __typename?: 'FacetValueList';
  items: Array<FacetValue>;
  totalItems: Scalars['Int']['output'];
};

export type FacetValueListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<FacetValueFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<FacetValueSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Which FacetValues are present in the products returned
 * by the search, and in what quantity.
 */
export type FacetValueResult = {
  __typename?: 'FacetValueResult';
  count: Scalars['Int']['output'];
  facetValue: FacetValue;
};

export type FacetValueSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  facetId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type FacetValueTranslation = {
  __typename?: 'FacetValueTranslation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type FilteredProductList = {
  __typename?: 'FilteredProductList';
  items: Array<Product>;
  totalItems: Scalars['Int']['output'];
};

export type FilteredProductSortParameters = {
  name?: InputMaybe<SortOrder>;
  price?: InputMaybe<SortOrder>;
};

export type FloatCustomFieldConfig = CustomField & {
  __typename?: 'FloatCustomFieldConfig';
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  deprecationReason?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  nullable?: Maybe<Scalars['Boolean']['output']>;
  readonly?: Maybe<Scalars['Boolean']['output']>;
  requiresPermission?: Maybe<Array<Permission>>;
  step?: Maybe<Scalars['Float']['output']>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type FloatStructFieldConfig = StructField & {
  __typename?: 'FloatStructFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  step?: Maybe<Scalars['Float']['output']>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type Fulfillment = Node & {
  __typename?: 'Fulfillment';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  lines: Array<FulfillmentLine>;
  method: Scalars['String']['output'];
  state: Scalars['String']['output'];
  /** @deprecated Use the `lines` field instead */
  summary: Array<FulfillmentLine>;
  trackingCode?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type FulfillmentLine = {
  __typename?: 'FulfillmentLine';
  fulfillment: Fulfillment;
  fulfillmentId: Scalars['ID']['output'];
  orderLine: OrderLine;
  orderLineId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
};

export enum GlobalFlag {
  FALSE = 'FALSE',
  INHERIT = 'INHERIT',
  TRUE = 'TRUE'
}

export type GoogleAuthInput = {
  token: Scalars['String']['input'];
};

/** Returned when attempting to set the Customer on a guest checkout when the configured GuestCheckoutStrategy does not allow it. */
export type GuestCheckoutError = ErrorResult & {
  __typename?: 'GuestCheckoutError';
  errorCode: ErrorCode;
  errorDetail: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type HistoryEntry = Node & {
  __typename?: 'HistoryEntry';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  data: Scalars['JSON']['output'];
  id: Scalars['ID']['output'];
  type: HistoryEntryType;
  updatedAt: Scalars['DateTime']['output'];
};

export type HistoryEntryFilterParameter = {
  _and?: InputMaybe<Array<HistoryEntryFilterParameter>>;
  _or?: InputMaybe<Array<HistoryEntryFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  type?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type HistoryEntryList = PaginatedList & {
  __typename?: 'HistoryEntryList';
  items: Array<HistoryEntry>;
  totalItems: Scalars['Int']['output'];
};

export type HistoryEntryListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<HistoryEntryFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<HistoryEntrySortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type HistoryEntrySortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export enum HistoryEntryType {
  CUSTOMER_ADDED_TO_GROUP = 'CUSTOMER_ADDED_TO_GROUP',
  CUSTOMER_ADDRESS_CREATED = 'CUSTOMER_ADDRESS_CREATED',
  CUSTOMER_ADDRESS_DELETED = 'CUSTOMER_ADDRESS_DELETED',
  CUSTOMER_ADDRESS_UPDATED = 'CUSTOMER_ADDRESS_UPDATED',
  CUSTOMER_DETAIL_UPDATED = 'CUSTOMER_DETAIL_UPDATED',
  CUSTOMER_EMAIL_UPDATE_REQUESTED = 'CUSTOMER_EMAIL_UPDATE_REQUESTED',
  CUSTOMER_EMAIL_UPDATE_VERIFIED = 'CUSTOMER_EMAIL_UPDATE_VERIFIED',
  CUSTOMER_NOTE = 'CUSTOMER_NOTE',
  CUSTOMER_PASSWORD_RESET_REQUESTED = 'CUSTOMER_PASSWORD_RESET_REQUESTED',
  CUSTOMER_PASSWORD_RESET_VERIFIED = 'CUSTOMER_PASSWORD_RESET_VERIFIED',
  CUSTOMER_PASSWORD_UPDATED = 'CUSTOMER_PASSWORD_UPDATED',
  CUSTOMER_REGISTERED = 'CUSTOMER_REGISTERED',
  CUSTOMER_REMOVED_FROM_GROUP = 'CUSTOMER_REMOVED_FROM_GROUP',
  CUSTOMER_VERIFIED = 'CUSTOMER_VERIFIED',
  ORDER_CANCELLATION = 'ORDER_CANCELLATION',
  ORDER_COUPON_APPLIED = 'ORDER_COUPON_APPLIED',
  ORDER_COUPON_REMOVED = 'ORDER_COUPON_REMOVED',
  ORDER_CURRENCY_UPDATED = 'ORDER_CURRENCY_UPDATED',
  ORDER_CUSTOMER_UPDATED = 'ORDER_CUSTOMER_UPDATED',
  ORDER_FULFILLMENT = 'ORDER_FULFILLMENT',
  ORDER_FULFILLMENT_TRANSITION = 'ORDER_FULFILLMENT_TRANSITION',
  ORDER_MODIFIED = 'ORDER_MODIFIED',
  ORDER_NOTE = 'ORDER_NOTE',
  ORDER_PAYMENT_TRANSITION = 'ORDER_PAYMENT_TRANSITION',
  ORDER_REFUND_TRANSITION = 'ORDER_REFUND_TRANSITION',
  ORDER_STATE_TRANSITION = 'ORDER_STATE_TRANSITION'
}

export type HomePageSection = {
  __typename?: 'HomePageSection';
  allBtn: Scalars['Boolean']['output'];
  products: Array<Product>;
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

/** Operators for filtering on a list of ID fields */
export type IdListOperators = {
  inList: Scalars['ID']['input'];
};

/** Operators for filtering on an ID field */
export type IdOperators = {
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEq?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

/**
 * Returned if the token used to change a Customer's email address is valid, but has
 * expired according to the `verificationTokenDuration` setting in the AuthOptions.
 */
export type IdentifierChangeTokenExpiredError = ErrorResult & {
  __typename?: 'IdentifierChangeTokenExpiredError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/**
 * Returned if the token used to change a Customer's email address is either
 * invalid or does not match any expected tokens.
 */
export type IdentifierChangeTokenInvalidError = ErrorResult & {
  __typename?: 'IdentifierChangeTokenInvalidError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/** Returned when attempting to add a Payment using a PaymentMethod for which the Order is not eligible. */
export type IneligiblePaymentMethodError = ErrorResult & {
  __typename?: 'IneligiblePaymentMethodError';
  eligibilityCheckerMessage?: Maybe<Scalars['String']['output']>;
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/** Returned when attempting to set a ShippingMethod for which the Order is not eligible */
export type IneligibleShippingMethodError = ErrorResult & {
  __typename?: 'IneligibleShippingMethodError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/** Returned when attempting to add more items to the Order than are available */
export type InsufficientStockError = ErrorResult & {
  __typename?: 'InsufficientStockError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
  order: Order;
  quantityAvailable: Scalars['Int']['output'];
};

export type IntCustomFieldConfig = CustomField & {
  __typename?: 'IntCustomFieldConfig';
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  deprecationReason?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  max?: Maybe<Scalars['Int']['output']>;
  min?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  nullable?: Maybe<Scalars['Boolean']['output']>;
  readonly?: Maybe<Scalars['Boolean']['output']>;
  requiresPermission?: Maybe<Array<Permission>>;
  step?: Maybe<Scalars['Int']['output']>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type IntStructFieldConfig = StructField & {
  __typename?: 'IntStructFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  max?: Maybe<Scalars['Int']['output']>;
  min?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  step?: Maybe<Scalars['Int']['output']>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

/** Returned if the user authentication credentials are not valid */
export type InvalidCredentialsError = ErrorResult & {
  __typename?: 'InvalidCredentialsError';
  authenticationError: Scalars['String']['output'];
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type Label = Node & {
  __typename?: 'Label';
  code: Scalars['String']['output'];
  color: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  enabled: Scalars['Boolean']['output'];
  featuredAsset?: Maybe<Asset>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  sort: Scalars['Int']['output'];
  translations: Array<LabelTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};

export type LabelFilterParameter = {
  _and?: InputMaybe<Array<LabelFilterParameter>>;
  _or?: InputMaybe<Array<LabelFilterParameter>>;
  code?: InputMaybe<StringOperators>;
  color?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  sort?: InputMaybe<NumberOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type LabelList = PaginatedList & {
  __typename?: 'LabelList';
  items: Array<Label>;
  totalItems: Scalars['Int']['output'];
};

export type LabelListOptions = {
  filter?: InputMaybe<LabelFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<LabelSortParameter>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type LabelSortParameter = {
  code?: InputMaybe<SortOrder>;
  color?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  enabled?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  sort?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type LabelTranslation = {
  __typename?: 'LabelTranslation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type LabelTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  languageCode: LanguageCode;
  name: Scalars['String']['input'];
};

/**
 * @description
 * Languages in the form of a ISO 639-1 language code with optional
 * region or script modifier (e.g. de_AT). The selection available is based
 * on the [Unicode CLDR summary list](https://unicode-org.github.io/cldr-staging/charts/37/summary/root.html)
 * and includes the major spoken languages of the world and any widely-used variants.
 *
 * @docsCategory common
 */
export enum LanguageCode {
  /** Afrikaans */
  af = 'af',
  /** Akan */
  ak = 'ak',
  /** Amharic */
  am = 'am',
  /** Arabic */
  ar = 'ar',
  /** Assamese */
  as = 'as',
  /** Azerbaijani */
  az = 'az',
  /** Belarusian */
  be = 'be',
  /** Bulgarian */
  bg = 'bg',
  /** Bambara */
  bm = 'bm',
  /** Bangla */
  bn = 'bn',
  /** Tibetan */
  bo = 'bo',
  /** Breton */
  br = 'br',
  /** Bosnian */
  bs = 'bs',
  /** Catalan */
  ca = 'ca',
  /** Chechen */
  ce = 'ce',
  /** Corsican */
  co = 'co',
  /** Czech */
  cs = 'cs',
  /** Church Slavic */
  cu = 'cu',
  /** Welsh */
  cy = 'cy',
  /** Danish */
  da = 'da',
  /** German */
  de = 'de',
  /** Austrian German */
  de_AT = 'de_AT',
  /** Swiss High German */
  de_CH = 'de_CH',
  /** Dzongkha */
  dz = 'dz',
  /** Ewe */
  ee = 'ee',
  /** Greek */
  el = 'el',
  /** English */
  en = 'en',
  /** Australian English */
  en_AU = 'en_AU',
  /** Canadian English */
  en_CA = 'en_CA',
  /** British English */
  en_GB = 'en_GB',
  /** American English */
  en_US = 'en_US',
  /** Esperanto */
  eo = 'eo',
  /** Spanish */
  es = 'es',
  /** European Spanish */
  es_ES = 'es_ES',
  /** Mexican Spanish */
  es_MX = 'es_MX',
  /** Estonian */
  et = 'et',
  /** Basque */
  eu = 'eu',
  /** Persian */
  fa = 'fa',
  /** Dari */
  fa_AF = 'fa_AF',
  /** Fulah */
  ff = 'ff',
  /** Finnish */
  fi = 'fi',
  /** Faroese */
  fo = 'fo',
  /** French */
  fr = 'fr',
  /** Canadian French */
  fr_CA = 'fr_CA',
  /** Swiss French */
  fr_CH = 'fr_CH',
  /** Western Frisian */
  fy = 'fy',
  /** Irish */
  ga = 'ga',
  /** Scottish Gaelic */
  gd = 'gd',
  /** Galician */
  gl = 'gl',
  /** Gujarati */
  gu = 'gu',
  /** Manx */
  gv = 'gv',
  /** Hausa */
  ha = 'ha',
  /** Hebrew */
  he = 'he',
  /** Hindi */
  hi = 'hi',
  /** Croatian */
  hr = 'hr',
  /** Haitian Creole */
  ht = 'ht',
  /** Hungarian */
  hu = 'hu',
  /** Armenian */
  hy = 'hy',
  /** Interlingua */
  ia = 'ia',
  /** Indonesian */
  id = 'id',
  /** Igbo */
  ig = 'ig',
  /** Sichuan Yi */
  ii = 'ii',
  /** Icelandic */
  is = 'is',
  /** Italian */
  it = 'it',
  /** Japanese */
  ja = 'ja',
  /** Javanese */
  jv = 'jv',
  /** Georgian */
  ka = 'ka',
  /** Kikuyu */
  ki = 'ki',
  /** Kazakh */
  kk = 'kk',
  /** Kalaallisut */
  kl = 'kl',
  /** Khmer */
  km = 'km',
  /** Kannada */
  kn = 'kn',
  /** Korean */
  ko = 'ko',
  /** Kashmiri */
  ks = 'ks',
  /** Kurdish */
  ku = 'ku',
  /** Cornish */
  kw = 'kw',
  /** Kyrgyz */
  ky = 'ky',
  /** Latin */
  la = 'la',
  /** Luxembourgish */
  lb = 'lb',
  /** Ganda */
  lg = 'lg',
  /** Lingala */
  ln = 'ln',
  /** Lao */
  lo = 'lo',
  /** Lithuanian */
  lt = 'lt',
  /** Luba-Katanga */
  lu = 'lu',
  /** Latvian */
  lv = 'lv',
  /** Malagasy */
  mg = 'mg',
  /** Maori */
  mi = 'mi',
  /** Macedonian */
  mk = 'mk',
  /** Malayalam */
  ml = 'ml',
  /** Mongolian */
  mn = 'mn',
  /** Marathi */
  mr = 'mr',
  /** Malay */
  ms = 'ms',
  /** Maltese */
  mt = 'mt',
  /** Burmese */
  my = 'my',
  /** Norwegian Bokmål */
  nb = 'nb',
  /** North Ndebele */
  nd = 'nd',
  /** Nepali */
  ne = 'ne',
  /** Dutch */
  nl = 'nl',
  /** Flemish */
  nl_BE = 'nl_BE',
  /** Norwegian Nynorsk */
  nn = 'nn',
  /** Nyanja */
  ny = 'ny',
  /** Oromo */
  om = 'om',
  /** Odia */
  or = 'or',
  /** Ossetic */
  os = 'os',
  /** Punjabi */
  pa = 'pa',
  /** Polish */
  pl = 'pl',
  /** Pashto */
  ps = 'ps',
  /** Portuguese */
  pt = 'pt',
  /** Brazilian Portuguese */
  pt_BR = 'pt_BR',
  /** European Portuguese */
  pt_PT = 'pt_PT',
  /** Quechua */
  qu = 'qu',
  /** Romansh */
  rm = 'rm',
  /** Rundi */
  rn = 'rn',
  /** Romanian */
  ro = 'ro',
  /** Moldavian */
  ro_MD = 'ro_MD',
  /** Russian */
  ru = 'ru',
  /** Kinyarwanda */
  rw = 'rw',
  /** Sanskrit */
  sa = 'sa',
  /** Sindhi */
  sd = 'sd',
  /** Northern Sami */
  se = 'se',
  /** Sango */
  sg = 'sg',
  /** Sinhala */
  si = 'si',
  /** Slovak */
  sk = 'sk',
  /** Slovenian */
  sl = 'sl',
  /** Samoan */
  sm = 'sm',
  /** Shona */
  sn = 'sn',
  /** Somali */
  so = 'so',
  /** Albanian */
  sq = 'sq',
  /** Serbian */
  sr = 'sr',
  /** Southern Sotho */
  st = 'st',
  /** Sundanese */
  su = 'su',
  /** Swedish */
  sv = 'sv',
  /** Swahili */
  sw = 'sw',
  /** Congo Swahili */
  sw_CD = 'sw_CD',
  /** Tamil */
  ta = 'ta',
  /** Telugu */
  te = 'te',
  /** Tajik */
  tg = 'tg',
  /** Thai */
  th = 'th',
  /** Tigrinya */
  ti = 'ti',
  /** Turkmen */
  tk = 'tk',
  /** Tongan */
  to = 'to',
  /** Turkish */
  tr = 'tr',
  /** Tatar */
  tt = 'tt',
  /** Uyghur */
  ug = 'ug',
  /** Ukrainian */
  uk = 'uk',
  /** Urdu */
  ur = 'ur',
  /** Uzbek */
  uz = 'uz',
  /** Vietnamese */
  vi = 'vi',
  /** Volapük */
  vo = 'vo',
  /** Wolof */
  wo = 'wo',
  /** Xhosa */
  xh = 'xh',
  /** Yiddish */
  yi = 'yi',
  /** Yoruba */
  yo = 'yo',
  /** Chinese */
  zh = 'zh',
  /** Simplified Chinese */
  zh_Hans = 'zh_Hans',
  /** Traditional Chinese */
  zh_Hant = 'zh_Hant',
  /** Zulu */
  zu = 'zu'
}

export type Like = {
  __typename?: 'Like';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isLike: Scalars['Boolean']['output'];
  productVariant: ProductVariant;
  updatedAt: Scalars['DateTime']['output'];
};

export type LikeResponse = {
  __typename?: 'LikeResponse';
  like?: Maybe<Like>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type LocaleStringCustomFieldConfig = CustomField & {
  __typename?: 'LocaleStringCustomFieldConfig';
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  deprecationReason?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Array<LocalizedString>>;
  length?: Maybe<Scalars['Int']['output']>;
  list: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nullable?: Maybe<Scalars['Boolean']['output']>;
  pattern?: Maybe<Scalars['String']['output']>;
  readonly?: Maybe<Scalars['Boolean']['output']>;
  requiresPermission?: Maybe<Array<Permission>>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type LocaleTextCustomFieldConfig = CustomField & {
  __typename?: 'LocaleTextCustomFieldConfig';
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  deprecationReason?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nullable?: Maybe<Scalars['Boolean']['output']>;
  readonly?: Maybe<Scalars['Boolean']['output']>;
  requiresPermission?: Maybe<Array<Permission>>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type LocalizedString = {
  __typename?: 'LocalizedString';
  languageCode: LanguageCode;
  value: Scalars['String']['output'];
};

export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR'
}

/** Returned when attempting to register or verify a customer account without a password, when one is required. */
export type MissingPasswordError = ErrorResult & {
  __typename?: 'MissingPasswordError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type Model = {
  __typename?: 'Model';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type ModelList = {
  __typename?: 'ModelList';
  items: Array<Model>;
  totalItems: Scalars['Int']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Adds an item to the Order. If custom fields are defined on the OrderLine entity, a third argument 'customFields' will be available. */
  addItemToOrder: UpdateOrderItemsResult;
  /** Adds mutliple items to the Order. Returns a list of errors for each item that failed to add. It will still add successful items. */
  addItemsToOrder: UpdateMultipleOrderItemsResult;
  /** Add a Payment to the Order */
  addPaymentToOrder: AddPaymentToOrderResult;
  /** Adjusts an OrderLine. If custom fields are defined on the OrderLine entity, a third argument 'customFields' of type `OrderLineCustomFieldsInput` will be available. */
  adjustOrderLine: UpdateOrderItemsResult;
  /** Applies the given coupon code to the active Order */
  applyCouponCode: ApplyCouponCodeResult;
  applyDeliveryMethod: Order;
  /** Authenticates the user using a named authentication strategy */
  authenticate: AuthenticationResult;
  /** Create a new Customer Address */
  createCustomerAddress: Address;
  /** Deletes the current customer account (soft delete) */
  deleteCustomerAccount: AuthDeletionResponse;
  /** Delete an existing Address */
  deleteCustomerAddress: Success;
  likeProductVariant: LikeResponse;
  /**
   * Authenticates the user using the native authentication strategy. This mutation is an alias for authenticate({ native: { ... }})
   *
   * The `rememberMe` option applies when using cookie-based sessions, and if `true` it will set the maxAge of the session cookie
   * to 1 year.
   */
  login: NativeAuthenticationResult;
  /** End the current authenticated session */
  logout: Success;
  /** Regenerate and send a verification token for a new Customer registration. Only applicable if `authOptions.requireVerification` is set to true. */
  refreshCustomerVerification: RefreshCustomerVerificationResult;
  /**
   * Register a Customer account with the given credentials. There are three possible registration flows:
   *
   * _If `authOptions.requireVerification` is set to `true`:_
   *
   * 1. **The Customer is registered _with_ a password**. A verificationToken will be created (and typically emailed to the Customer). That
   *    verificationToken would then be passed to the `verifyCustomerAccount` mutation _without_ a password. The Customer is then
   *    verified and authenticated in one step.
   * 2. **The Customer is registered _without_ a password**. A verificationToken will be created (and typically emailed to the Customer). That
   *    verificationToken would then be passed to the `verifyCustomerAccount` mutation _with_ the chosen password of the Customer. The Customer is then
   *    verified and authenticated in one step.
   *
   * _If `authOptions.requireVerification` is set to `false`:_
   *
   * 3. The Customer _must_ be registered _with_ a password. No further action is needed - the Customer is able to authenticate immediately.
   */
  registerCustomerAccount: RegisterCustomerAccountResult;
  /** Remove all OrderLine from the Order */
  removeAllOrderLines: RemoveOrderItemsResult;
  /** Removes the given coupon code from the active Order */
  removeCouponCode?: Maybe<Order>;
  /** Remove an OrderLine from the Order */
  removeOrderLine: RemoveOrderItemsResult;
  /** Requests a password reset email to be sent */
  requestPasswordReset?: Maybe<RequestPasswordResetResult>;
  /**
   * Request to update the emailAddress of the active Customer. If `authOptions.requireVerification` is enabled
   * (as is the default), then the `identifierChangeToken` will be assigned to the current User and
   * a IdentifierChangeRequestEvent will be raised. This can then be used e.g. by the EmailPlugin to email
   * that verification token to the Customer, which is then used to verify the change of email address.
   */
  requestUpdateCustomerEmailAddress: RequestUpdateCustomerEmailAddressResult;
  /** Resets a Customer's password based on the provided token */
  resetPassword: ResetPasswordResult;
  /** Sets the currency code for the active Order */
  setCurrencyCodeForOrder: UpdateOrderItemsResult;
  /** Set the Customer for the Order. Required only if the Customer is not currently logged in */
  setCustomerForOrder: SetCustomerForOrderResult;
  /** Sets the billing address for the active Order */
  setOrderBillingAddress: ActiveOrderResult;
  /** Allows any custom fields to be set for the active Order */
  setOrderCustomFields: ActiveOrderResult;
  /** Sets the shipping address for the active Order */
  setOrderShippingAddress: ActiveOrderResult;
  /**
   * Sets the shipping method by id, which can be obtained with the `eligibleShippingMethods` query.
   * An Order can have multiple shipping methods, in which case you can pass an array of ids. In this case,
   * you should configure a custom ShippingLineAssignmentStrategy in order to know which OrderLines each
   * shipping method will apply to.
   */
  setOrderShippingMethod: SetOrderShippingMethodResult;
  trackBannerClick: Scalars['Boolean']['output'];
  trackProductClick: TrackClickSuccess;
  /** Transitions an Order to a new state. Valid next states can be found by querying `nextOrderStates` */
  transitionOrderToState?: Maybe<TransitionOrderToStateResult>;
  /** Unsets the billing address for the active Order. Available since version 3.1.0 */
  unsetOrderBillingAddress: ActiveOrderResult;
  /** Unsets the shipping address for the active Order. Available since version 3.1.0 */
  unsetOrderShippingAddress: ActiveOrderResult;
  /** Update an existing Customer */
  updateCustomer: Customer;
  /** Update an existing Address */
  updateCustomerAddress: Address;
  /**
   * Confirm the update of the emailAddress with the provided token, which has been generated by the
   * `requestUpdateCustomerEmailAddress` mutation.
   */
  updateCustomerEmailAddress: UpdateCustomerEmailAddressResult;
  /** Update the password of the active Customer */
  updateCustomerPassword: UpdateCustomerPasswordResult;
  /**
   * Verify a Customer email address with the token sent to that address. Only applicable if `authOptions.requireVerification` is set to true.
   *
   * If the Customer was not registered with a password in the `registerCustomerAccount` mutation, the password _must_ be
   * provided here.
   */
  verifyCustomerAccount: VerifyCustomerAccountResult;
};


export type MutationAddItemToOrderArgs = {
  productVariantId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};


export type MutationAddItemsToOrderArgs = {
  inputs: Array<AddItemInput>;
};


export type MutationAddPaymentToOrderArgs = {
  input: PaymentInput;
};


export type MutationAdjustOrderLineArgs = {
  orderLineId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};


export type MutationApplyCouponCodeArgs = {
  couponCode: Scalars['String']['input'];
};


export type MutationApplyDeliveryMethodArgs = {
  deliveryMethodId: Scalars['ID']['input'];
  orderId: Scalars['ID']['input'];
};


export type MutationAuthenticateArgs = {
  input: AuthenticationInput;
  rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationCreateCustomerAddressArgs = {
  input: CreateAddressInput;
};


export type MutationDeleteCustomerAddressArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLikeProductVariantArgs = {
  productVariantId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
  username: Scalars['String']['input'];
};


export type MutationRefreshCustomerVerificationArgs = {
  emailAddress: Scalars['String']['input'];
};


export type MutationRegisterCustomerAccountArgs = {
  input: RegisterCustomerInput;
};


export type MutationRemoveCouponCodeArgs = {
  couponCode: Scalars['String']['input'];
};


export type MutationRemoveOrderLineArgs = {
  orderLineId: Scalars['ID']['input'];
};


export type MutationRequestPasswordResetArgs = {
  emailAddress: Scalars['String']['input'];
};


export type MutationRequestUpdateCustomerEmailAddressArgs = {
  newEmailAddress: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationSetCurrencyCodeForOrderArgs = {
  currencyCode: CurrencyCode;
};


export type MutationSetCustomerForOrderArgs = {
  input: CreateCustomerInput;
};


export type MutationSetOrderBillingAddressArgs = {
  input: CreateAddressInput;
};


export type MutationSetOrderCustomFieldsArgs = {
  input: UpdateOrderInput;
};


export type MutationSetOrderShippingAddressArgs = {
  input: CreateAddressInput;
};


export type MutationSetOrderShippingMethodArgs = {
  shippingMethodId: Array<Scalars['ID']['input']>;
};


export type MutationTrackBannerClickArgs = {
  id: Scalars['ID']['input'];
};


export type MutationTrackProductClickArgs = {
  productId: Scalars['ID']['input'];
  productName: Scalars['String']['input'];
};


export type MutationTransitionOrderToStateArgs = {
  state: Scalars['String']['input'];
};


export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerInput;
};


export type MutationUpdateCustomerAddressArgs = {
  input: UpdateAddressInput;
};


export type MutationUpdateCustomerEmailAddressArgs = {
  token: Scalars['String']['input'];
};


export type MutationUpdateCustomerPasswordArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};


export type MutationVerifyCustomerAccountArgs = {
  password?: InputMaybe<Scalars['String']['input']>;
  token: Scalars['String']['input'];
};

export type NativeAuthInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

/** Returned when attempting an operation that relies on the NativeAuthStrategy, if that strategy is not configured. */
export type NativeAuthStrategyError = ErrorResult & {
  __typename?: 'NativeAuthStrategyError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type NativeAuthenticationResult = CurrentUser | InvalidCredentialsError | NativeAuthStrategyError | NotVerifiedError;

/** Returned when attempting to set a negative OrderLine quantity. */
export type NegativeQuantityError = ErrorResult & {
  __typename?: 'NegativeQuantityError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/**
 * Returned when invoking a mutation which depends on there being an active Order on the
 * current session.
 */
export type NoActiveOrderError = ErrorResult & {
  __typename?: 'NoActiveOrderError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type Node = {
  id: Scalars['ID']['output'];
};

/**
 * Returned if `authOptions.requireVerification` is set to `true` (which is the default)
 * and an unverified user attempts to authenticate.
 */
export type NotVerifiedError = ErrorResult & {
  __typename?: 'NotVerifiedError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/** Operators for filtering on a list of Number fields */
export type NumberListOperators = {
  inList: Scalars['Float']['input'];
};

/** Operators for filtering on a Int or Float field */
export type NumberOperators = {
  between?: InputMaybe<NumberRange>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  gte?: InputMaybe<Scalars['Float']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  lte?: InputMaybe<Scalars['Float']['input']>;
};

export type NumberRange = {
  end: Scalars['Float']['input'];
  start: Scalars['Float']['input'];
};

export type Order = Node & {
  __typename?: 'Order';
  /** An order is active as long as the payment process has not been completed */
  active: Scalars['Boolean']['output'];
  billingAddress?: Maybe<OrderAddress>;
  /** A unique code for the Order */
  code: Scalars['String']['output'];
  /** An array of all coupon codes applied to the Order */
  couponCodes: Array<Scalars['String']['output']>;
  courier?: Maybe<Worker>;
  createdAt: Scalars['DateTime']['output'];
  currencyCode: CurrencyCode;
  customFields?: Maybe<OrderCustomFields>;
  customer?: Maybe<Customer>;
  deliveryGroups: Array<DeliveryCredentialGroup>;
  discounts: Array<Discount>;
  fulfillments?: Maybe<Array<Fulfillment>>;
  history: HistoryEntryList;
  id: Scalars['ID']['output'];
  lines: Array<OrderLine>;
  /**
   * The date & time that the Order was placed, i.e. the Customer
   * completed the checkout and the Order is no longer "active"
   */
  orderPlacedAt?: Maybe<Scalars['DateTime']['output']>;
  payments?: Maybe<Array<Payment>>;
  /** Promotions applied to the order. Only gets populated after the payment process has completed. */
  promotions: Array<Promotion>;
  shipping: Scalars['Money']['output'];
  shippingAddress?: Maybe<OrderAddress>;
  shippingLines: Array<ShippingLine>;
  shippingWithTax: Scalars['Money']['output'];
  state: Scalars['String']['output'];
  /**
   * The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
   * discounts which have been prorated (proportionally distributed) amongst the items of each OrderLine.
   * To get a total of all OrderLines which does not account for prorated discounts, use the
   * sum of `OrderLine.discountedLinePrice` values.
   */
  subTotal: Scalars['Money']['output'];
  /** Same as subTotal, but inclusive of tax */
  subTotalWithTax: Scalars['Money']['output'];
  /**
   * Surcharges are arbitrary modifications to the Order total which are neither
   * ProductVariants nor discounts resulting from applied Promotions. For example,
   * one-off discounts based on customer interaction, or surcharges based on payment
   * methods.
   */
  surcharges: Array<Surcharge>;
  /** A summary of the taxes being applied to this Order */
  taxSummary: Array<OrderTaxSummary>;
  /** Equal to subTotal plus shipping */
  total: Scalars['Money']['output'];
  totalQuantity: Scalars['Int']['output'];
  /** The final payable amount. Equal to subTotalWithTax plus shippingWithTax */
  totalWithTax: Scalars['Money']['output'];
  type: OrderType;
  updatedAt: Scalars['DateTime']['output'];
};


export type OrderHistoryArgs = {
  options?: InputMaybe<HistoryEntryListOptions>;
};

export type OrderAddress = {
  __typename?: 'OrderAddress';
  city?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  customFields?: Maybe<AddressCustomFields>;
  fullName?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  streetLine1?: Maybe<Scalars['String']['output']>;
  streetLine2?: Maybe<Scalars['String']['output']>;
};

export type OrderCustomFields = {
  __typename?: 'OrderCustomFields';
  assignedCourierId?: Maybe<Scalars['String']['output']>;
  deliveryMethod?: Maybe<DeliveryMethod>;
};

export type OrderFilterParameter = {
  _and?: InputMaybe<Array<OrderFilterParameter>>;
  _or?: InputMaybe<Array<OrderFilterParameter>>;
  active?: InputMaybe<BooleanOperators>;
  assignedCourierId?: InputMaybe<StringOperators>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  currencyCode?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  orderPlacedAt?: InputMaybe<DateOperators>;
  shipping?: InputMaybe<NumberOperators>;
  shippingWithTax?: InputMaybe<NumberOperators>;
  state?: InputMaybe<StringOperators>;
  subTotal?: InputMaybe<NumberOperators>;
  subTotalWithTax?: InputMaybe<NumberOperators>;
  total?: InputMaybe<NumberOperators>;
  totalQuantity?: InputMaybe<NumberOperators>;
  totalWithTax?: InputMaybe<NumberOperators>;
  type?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

/** Returned when an order operation is rejected by an OrderInterceptor method. */
export type OrderInterceptorError = ErrorResult & {
  __typename?: 'OrderInterceptorError';
  errorCode: ErrorCode;
  interceptorError: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

/** Returned when the maximum order size limit has been reached. */
export type OrderLimitError = ErrorResult & {
  __typename?: 'OrderLimitError';
  errorCode: ErrorCode;
  maxItems: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

export type OrderLine = Node & {
  __typename?: 'OrderLine';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  /** The price of the line including discounts, excluding tax */
  discountedLinePrice: Scalars['Money']['output'];
  /** The price of the line including discounts and tax */
  discountedLinePriceWithTax: Scalars['Money']['output'];
  /**
   * The price of a single unit including discounts, excluding tax.
   *
   * If Order-level discounts have been applied, this will not be the
   * actual taxable unit price (see `proratedUnitPrice`), but is generally the
   * correct price to display to customers to avoid confusion
   * about the internal handling of distributed Order-level discounts.
   */
  discountedUnitPrice: Scalars['Money']['output'];
  /** The price of a single unit including discounts and tax */
  discountedUnitPriceWithTax: Scalars['Money']['output'];
  discounts: Array<Discount>;
  featuredAsset?: Maybe<Asset>;
  fulfillmentLines?: Maybe<Array<FulfillmentLine>>;
  id: Scalars['ID']['output'];
  /** The total price of the line excluding tax and discounts. */
  linePrice: Scalars['Money']['output'];
  /** The total price of the line including tax but excluding discounts. */
  linePriceWithTax: Scalars['Money']['output'];
  /** The total tax on this line */
  lineTax: Scalars['Money']['output'];
  order: Order;
  /** The quantity at the time the Order was placed */
  orderPlacedQuantity: Scalars['Int']['output'];
  productVariant: ProductVariant;
  /**
   * The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
   * Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
   * and refund calculations.
   */
  proratedLinePrice: Scalars['Money']['output'];
  /** The proratedLinePrice including tax */
  proratedLinePriceWithTax: Scalars['Money']['output'];
  /**
   * The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
   * Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
   * and refund calculations.
   */
  proratedUnitPrice: Scalars['Money']['output'];
  /** The proratedUnitPrice including tax */
  proratedUnitPriceWithTax: Scalars['Money']['output'];
  /** The quantity of items purchased */
  quantity: Scalars['Int']['output'];
  taxLines: Array<TaxLine>;
  taxRate: Scalars['Float']['output'];
  /** The price of a single unit, excluding tax and discounts */
  unitPrice: Scalars['Money']['output'];
  /** Non-zero if the unitPrice has changed since it was initially added to Order */
  unitPriceChangeSinceAdded: Scalars['Money']['output'];
  /** The price of a single unit, including tax but excluding discounts */
  unitPriceWithTax: Scalars['Money']['output'];
  /** Non-zero if the unitPriceWithTax has changed since it was initially added to Order */
  unitPriceWithTaxChangeSinceAdded: Scalars['Money']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type OrderList = PaginatedList & {
  __typename?: 'OrderList';
  items: Array<Order>;
  totalItems: Scalars['Int']['output'];
};

export type OrderListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<OrderFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<OrderSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

/** Returned when attempting to modify the contents of an Order that is not in the `AddingItems` state. */
export type OrderModificationError = ErrorResult & {
  __typename?: 'OrderModificationError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/** Returned when attempting to add a Payment to an Order that is not in the `ArrangingPayment` state. */
export type OrderPaymentStateError = ErrorResult & {
  __typename?: 'OrderPaymentStateError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type OrderSortParameter = {
  assignedCourierId?: InputMaybe<SortOrder>;
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  deliveryMethod?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  orderPlacedAt?: InputMaybe<SortOrder>;
  shipping?: InputMaybe<SortOrder>;
  shippingWithTax?: InputMaybe<SortOrder>;
  state?: InputMaybe<SortOrder>;
  subTotal?: InputMaybe<SortOrder>;
  subTotalWithTax?: InputMaybe<SortOrder>;
  total?: InputMaybe<SortOrder>;
  totalQuantity?: InputMaybe<SortOrder>;
  totalWithTax?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

/** Returned if there is an error in transitioning the Order state */
export type OrderStateTransitionError = ErrorResult & {
  __typename?: 'OrderStateTransitionError';
  errorCode: ErrorCode;
  fromState: Scalars['String']['output'];
  message: Scalars['String']['output'];
  toState: Scalars['String']['output'];
  transitionError: Scalars['String']['output'];
};

/**
 * A summary of the taxes being applied to this order, grouped
 * by taxRate.
 */
export type OrderTaxSummary = {
  __typename?: 'OrderTaxSummary';
  /** A description of this tax */
  description: Scalars['String']['output'];
  /** The total net price of OrderLines to which this taxRate applies */
  taxBase: Scalars['Money']['output'];
  /** The taxRate as a percentage */
  taxRate: Scalars['Float']['output'];
  /** The total tax being applied to the Order at this taxRate */
  taxTotal: Scalars['Money']['output'];
};

export enum OrderType {
  Aggregate = 'Aggregate',
  Regular = 'Regular',
  Seller = 'Seller'
}

export type PaginatedList = {
  items: Array<Node>;
  totalItems: Scalars['Int']['output'];
};

/** Returned when attempting to verify a customer account with a password, when a password has already been set. */
export type PasswordAlreadySetError = ErrorResult & {
  __typename?: 'PasswordAlreadySetError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/**
 * Returned if the token used to reset a Customer's password is valid, but has
 * expired according to the `verificationTokenDuration` setting in the AuthOptions.
 */
export type PasswordResetTokenExpiredError = ErrorResult & {
  __typename?: 'PasswordResetTokenExpiredError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/**
 * Returned if the token used to reset a Customer's password is either
 * invalid or does not match any expected tokens.
 */
export type PasswordResetTokenInvalidError = ErrorResult & {
  __typename?: 'PasswordResetTokenInvalidError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/** Returned when attempting to register or verify a customer account where the given password fails password validation. */
export type PasswordValidationError = ErrorResult & {
  __typename?: 'PasswordValidationError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
  validationErrorMessage: Scalars['String']['output'];
};

export type Payment = Node & {
  __typename?: 'Payment';
  amount: Scalars['Money']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  method: Scalars['String']['output'];
  refunds: Array<Refund>;
  state: Scalars['String']['output'];
  transactionId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

/** Returned when a Payment is declined by the payment provider. */
export type PaymentDeclinedError = ErrorResult & {
  __typename?: 'PaymentDeclinedError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
  paymentErrorMessage: Scalars['String']['output'];
};

/** Returned when a Payment fails due to an error. */
export type PaymentFailedError = ErrorResult & {
  __typename?: 'PaymentFailedError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
  paymentErrorMessage: Scalars['String']['output'];
};

/** Passed as input to the `addPaymentToOrder` mutation. */
export type PaymentInput = {
  /**
   * This field should contain arbitrary data passed to the specified PaymentMethodHandler's `createPayment()` method
   * as the "metadata" argument. For example, it could contain an ID for the payment and other
   * data generated by the payment provider.
   */
  metadata: Scalars['JSON']['input'];
  /** This field should correspond to the `code` property of a PaymentMethod. */
  method: Scalars['String']['input'];
};

export type PaymentMethod = Node & {
  __typename?: 'PaymentMethod';
  checker?: Maybe<ConfigurableOperation>;
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  description: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  handler: ConfigurableOperation;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  translations: Array<PaymentMethodTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};

export type PaymentMethodQuote = {
  __typename?: 'PaymentMethodQuote';
  code: Scalars['String']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  description: Scalars['String']['output'];
  eligibilityMessage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isEligible: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type PaymentMethodTranslation = {
  __typename?: 'PaymentMethodTranslation';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/**
 * @description
 * Permissions for administrators and customers. Used to control access to
 * GraphQL resolvers via the {@link Allow} decorator.
 *
 * ## Understanding Permission.Owner
 *
 * `Permission.Owner` is a special permission which is used in some Vendure resolvers to indicate that that resolver should only
 * be accessible to the "owner" of that resource.
 *
 * For example, the Shop API `activeCustomer` query resolver should only return the Customer object for the "owner" of that Customer, i.e.
 * based on the activeUserId of the current session. As a result, the resolver code looks like this:
 *
 * @example
 * ```TypeScript
 * \@Query()
 * \@Allow(Permission.Owner)
 * async activeCustomer(\@Ctx() ctx: RequestContext): Promise<Customer | undefined> {
 *   const userId = ctx.activeUserId;
 *   if (userId) {
 *     return this.customerService.findOneByUserId(ctx, userId);
 *   }
 * }
 * ```
 *
 * Here we can see that the "ownership" must be enforced by custom logic inside the resolver. Since "ownership" cannot be defined generally
 * nor statically encoded at build-time, any resolvers using `Permission.Owner` **must** include logic to enforce that only the owner
 * of the resource has access. If not, then it is the equivalent of using `Permission.Public`.
 *
 *
 * @docsCategory common
 */
export enum Permission {
  /** Authenticated means simply that the user is logged in */
  Authenticated = 'Authenticated',
  /** Grants permission to create Administrator */
  CreateAdministrator = 'CreateAdministrator',
  /** Grants permission to create ApiKey */
  CreateApiKey = 'CreateApiKey',
  /** Grants permission to create Asset */
  CreateAsset = 'CreateAsset',
  /** Grants permission to create Products, Facets, Assets, Collections */
  CreateCatalog = 'CreateCatalog',
  /** Grants permission to create Channel */
  CreateChannel = 'CreateChannel',
  /** Grants permission to create Collection */
  CreateCollection = 'CreateCollection',
  /** Grants permission to create Country */
  CreateCountry = 'CreateCountry',
  /** Grants permission to create Customer */
  CreateCustomer = 'CreateCustomer',
  /** Grants permission to create CustomerGroup */
  CreateCustomerGroup = 'CreateCustomerGroup',
  /** Grants permission to create Facet */
  CreateFacet = 'CreateFacet',
  /** Grants permission to create Order */
  CreateOrder = 'CreateOrder',
  /** Grants permission to create PaymentMethod */
  CreatePaymentMethod = 'CreatePaymentMethod',
  /** Grants permission to create Product */
  CreateProduct = 'CreateProduct',
  /** Grants permission to create Promotion */
  CreatePromotion = 'CreatePromotion',
  /** Grants permission to create Seller */
  CreateSeller = 'CreateSeller',
  /** Grants permission to create PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  CreateSettings = 'CreateSettings',
  /** Grants permission to create ShippingMethod */
  CreateShippingMethod = 'CreateShippingMethod',
  /** Grants permission to create StockLocation */
  CreateStockLocation = 'CreateStockLocation',
  /** Grants permission to create System */
  CreateSystem = 'CreateSystem',
  /** Grants permission to create Tag */
  CreateTag = 'CreateTag',
  /** Grants permission to create TaxCategory */
  CreateTaxCategory = 'CreateTaxCategory',
  /** Grants permission to create TaxRate */
  CreateTaxRate = 'CreateTaxRate',
  /** Grants permission to create Zone */
  CreateZone = 'CreateZone',
  /** Grants permission to delete Administrator */
  DeleteAdministrator = 'DeleteAdministrator',
  /** Grants permission to delete ApiKey */
  DeleteApiKey = 'DeleteApiKey',
  /** Grants permission to delete Asset */
  DeleteAsset = 'DeleteAsset',
  /** Grants permission to delete Products, Facets, Assets, Collections */
  DeleteCatalog = 'DeleteCatalog',
  /** Grants permission to delete Channel */
  DeleteChannel = 'DeleteChannel',
  /** Grants permission to delete Collection */
  DeleteCollection = 'DeleteCollection',
  /** Grants permission to delete Country */
  DeleteCountry = 'DeleteCountry',
  /** Grants permission to delete Customer */
  DeleteCustomer = 'DeleteCustomer',
  /** Grants permission to delete CustomerGroup */
  DeleteCustomerGroup = 'DeleteCustomerGroup',
  /** Grants permission to delete Facet */
  DeleteFacet = 'DeleteFacet',
  /** Grants permission to delete Order */
  DeleteOrder = 'DeleteOrder',
  /** Grants permission to delete PaymentMethod */
  DeletePaymentMethod = 'DeletePaymentMethod',
  /** Grants permission to delete Product */
  DeleteProduct = 'DeleteProduct',
  /** Grants permission to delete Promotion */
  DeletePromotion = 'DeletePromotion',
  /** Grants permission to delete Seller */
  DeleteSeller = 'DeleteSeller',
  /** Grants permission to delete PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  DeleteSettings = 'DeleteSettings',
  /** Grants permission to delete ShippingMethod */
  DeleteShippingMethod = 'DeleteShippingMethod',
  /** Grants permission to delete StockLocation */
  DeleteStockLocation = 'DeleteStockLocation',
  /** Grants permission to delete System */
  DeleteSystem = 'DeleteSystem',
  /** Grants permission to delete Tag */
  DeleteTag = 'DeleteTag',
  /** Grants permission to delete TaxCategory */
  DeleteTaxCategory = 'DeleteTaxCategory',
  /** Grants permission to delete TaxRate */
  DeleteTaxRate = 'DeleteTaxRate',
  /** Grants permission to delete Zone */
  DeleteZone = 'DeleteZone',
  /** Owner means the user owns this entity, e.g. a Customer's own Order */
  Owner = 'Owner',
  /** Public means any unauthenticated user may perform the operation */
  Public = 'Public',
  /** Grants permission to read Administrator */
  ReadAdministrator = 'ReadAdministrator',
  /** Grants permission to read ApiKey */
  ReadApiKey = 'ReadApiKey',
  /** Grants permission to read Asset */
  ReadAsset = 'ReadAsset',
  /** Grants permission to read Products, Facets, Assets, Collections */
  ReadCatalog = 'ReadCatalog',
  /** Grants permission to read Channel */
  ReadChannel = 'ReadChannel',
  /** Grants permission to read Collection */
  ReadCollection = 'ReadCollection',
  /** Grants permission to read Country */
  ReadCountry = 'ReadCountry',
  /** Grants permission to read Customer */
  ReadCustomer = 'ReadCustomer',
  /** Grants permission to read CustomerGroup */
  ReadCustomerGroup = 'ReadCustomerGroup',
  /** Grants permission to read DashboardGlobalViews */
  ReadDashboardGlobalViews = 'ReadDashboardGlobalViews',
  /** Grants permission to read Facet */
  ReadFacet = 'ReadFacet',
  /** Grants permission to read Order */
  ReadOrder = 'ReadOrder',
  /** Grants permission to read PaymentMethod */
  ReadPaymentMethod = 'ReadPaymentMethod',
  /** Grants permission to read Product */
  ReadProduct = 'ReadProduct',
  /** Grants permission to read Promotion */
  ReadPromotion = 'ReadPromotion',
  /** Grants permission to read Seller */
  ReadSeller = 'ReadSeller',
  /** Grants permission to read PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  ReadSettings = 'ReadSettings',
  /** Grants permission to read ShippingMethod */
  ReadShippingMethod = 'ReadShippingMethod',
  /** Grants permission to read StockLocation */
  ReadStockLocation = 'ReadStockLocation',
  /** Grants permission to read System */
  ReadSystem = 'ReadSystem',
  /** Grants permission to read Tag */
  ReadTag = 'ReadTag',
  /** Grants permission to read TaxCategory */
  ReadTaxCategory = 'ReadTaxCategory',
  /** Grants permission to read TaxRate */
  ReadTaxRate = 'ReadTaxRate',
  /** Grants permission to read Zone */
  ReadZone = 'ReadZone',
  /** SuperAdmin has unrestricted access to all operations */
  SuperAdmin = 'SuperAdmin',
  /** Grants permission to update Administrator */
  UpdateAdministrator = 'UpdateAdministrator',
  /** Grants permission to update ApiKey */
  UpdateApiKey = 'UpdateApiKey',
  /** Grants permission to update Asset */
  UpdateAsset = 'UpdateAsset',
  /** Grants permission to update Products, Facets, Assets, Collections */
  UpdateCatalog = 'UpdateCatalog',
  /** Grants permission to update Channel */
  UpdateChannel = 'UpdateChannel',
  /** Grants permission to update Collection */
  UpdateCollection = 'UpdateCollection',
  /** Grants permission to update Country */
  UpdateCountry = 'UpdateCountry',
  /** Grants permission to update Customer */
  UpdateCustomer = 'UpdateCustomer',
  /** Grants permission to update CustomerGroup */
  UpdateCustomerGroup = 'UpdateCustomerGroup',
  /** Grants permission to update Facet */
  UpdateFacet = 'UpdateFacet',
  /** Grants permission to update GlobalSettings */
  UpdateGlobalSettings = 'UpdateGlobalSettings',
  /** Grants permission to update Order */
  UpdateOrder = 'UpdateOrder',
  /** Grants permission to update PaymentMethod */
  UpdatePaymentMethod = 'UpdatePaymentMethod',
  /** Grants permission to update Product */
  UpdateProduct = 'UpdateProduct',
  /** Grants permission to update Promotion */
  UpdatePromotion = 'UpdatePromotion',
  /** Grants permission to update Seller */
  UpdateSeller = 'UpdateSeller',
  /** Grants permission to update PaymentMethods, ShippingMethods, TaxCategories, TaxRates, Zones, Countries, System & GlobalSettings */
  UpdateSettings = 'UpdateSettings',
  /** Grants permission to update ShippingMethod */
  UpdateShippingMethod = 'UpdateShippingMethod',
  /** Grants permission to update StockLocation */
  UpdateStockLocation = 'UpdateStockLocation',
  /** Grants permission to update System */
  UpdateSystem = 'UpdateSystem',
  /** Grants permission to update Tag */
  UpdateTag = 'UpdateTag',
  /** Grants permission to update TaxCategory */
  UpdateTaxCategory = 'UpdateTaxCategory',
  /** Grants permission to update TaxRate */
  UpdateTaxRate = 'UpdateTaxRate',
  /** Grants permission to update Zone */
  UpdateZone = 'UpdateZone',
  /** Grants permission to write DashboardGlobalViews */
  WriteDashboardGlobalViews = 'WriteDashboardGlobalViews'
}

export type PhoneAuthInput = {
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

/** The price range where the result has more than one price */
export type PriceRange = {
  __typename?: 'PriceRange';
  max: Scalars['Money']['output'];
  min: Scalars['Money']['output'];
};

export type Product = Node & {
  __typename?: 'Product';
  activeOptionGroups: Array<ProductOptionGroup>;
  assets: Array<Asset>;
  categories: Array<Category>;
  category?: Maybe<Category>;
  collections: Array<Collection>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<ProductCustomFields>;
  description: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  facetValues: Array<FacetValue>;
  featuredAsset?: Maybe<Asset>;
  id: Scalars['ID']['output'];
  isSelected: Scalars['Boolean']['output'];
  labels: Array<Label>;
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  optionGroups: Array<ProductOptionGroup>;
  sale?: Maybe<SaleInfo>;
  selectedQuantity: Scalars['Int']['output'];
  slug: Scalars['String']['output'];
  translations: Array<ProductTranslation>;
  updatedAt: Scalars['DateTime']['output'];
  /** Returns a paginated, sortable, filterable list of ProductVariants */
  variantList: ProductVariantList;
  /** Returns all ProductVariants */
  variants: Array<ProductVariant>;
};


export type ProductVariantListArgs = {
  options?: InputMaybe<ProductVariantListOptions>;
};

export type ProductCustomFields = {
  __typename?: 'ProductCustomFields';
  categories?: Maybe<Array<Category>>;
  isRecommended?: Maybe<Scalars['Boolean']['output']>;
  labels?: Maybe<Array<Label>>;
};

export type ProductFilterParameter = {
  _and?: InputMaybe<Array<ProductFilterParameter>>;
  _or?: InputMaybe<Array<ProductFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  isRecommended?: InputMaybe<BooleanOperators>;
  isSelected?: InputMaybe<BooleanOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  selectedQuantity?: InputMaybe<NumberOperators>;
  slug?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type ProductList = PaginatedList & {
  __typename?: 'ProductList';
  items: Array<Product>;
  totalItems: Scalars['Int']['output'];
};

export type ProductListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<ProductFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<ProductSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductOption = Node & {
  __typename?: 'ProductOption';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  group: ProductOptionGroup;
  groupId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  translations: Array<ProductOptionTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductOptionGroup = Node & {
  __typename?: 'ProductOptionGroup';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  options: Array<ProductOption>;
  /** The number of products that use this option group */
  productCount: Scalars['Int']['output'];
  translations: Array<ProductOptionGroupTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductOptionGroupTranslation = {
  __typename?: 'ProductOptionGroupTranslation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductOptionTranslation = {
  __typename?: 'ProductOptionTranslation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  isRecommended?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  selectedQuantity?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ProductTranslation = {
  __typename?: 'ProductTranslation';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductVariant = Node & {
  __typename?: 'ProductVariant';
  assets: Array<Asset>;
  createdAt: Scalars['DateTime']['output'];
  currencyCode: CurrencyCode;
  customFields?: Maybe<Scalars['JSON']['output']>;
  facetValues: Array<FacetValue>;
  featuredAsset?: Maybe<Asset>;
  id: Scalars['ID']['output'];
  isLiked: Scalars['Boolean']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  options: Array<ProductOption>;
  price: Scalars['Money']['output'];
  priceWithTax: Scalars['Money']['output'];
  product: Product;
  productId: Scalars['ID']['output'];
  sale?: Maybe<SaleInfo>;
  sku: Scalars['String']['output'];
  stockLevel: Scalars['String']['output'];
  stockOnHand: Scalars['Int']['output'];
  taxCategory: TaxCategory;
  taxRateApplied: TaxRate;
  translations: Array<ProductVariantTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductVariantFilterParameter = {
  _and?: InputMaybe<Array<ProductVariantFilterParameter>>;
  _or?: InputMaybe<Array<ProductVariantFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  currencyCode?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  isLiked?: InputMaybe<BooleanOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  price?: InputMaybe<NumberOperators>;
  priceWithTax?: InputMaybe<NumberOperators>;
  productId?: InputMaybe<IdOperators>;
  sku?: InputMaybe<StringOperators>;
  stockLevel?: InputMaybe<StringOperators>;
  stockOnHand?: InputMaybe<NumberOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type ProductVariantList = PaginatedList & {
  __typename?: 'ProductVariantList';
  items: Array<ProductVariant>;
  totalItems: Scalars['Int']['output'];
};

export type ProductVariantListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<ProductVariantFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<ProductVariantSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductVariantSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  price?: InputMaybe<SortOrder>;
  priceWithTax?: InputMaybe<SortOrder>;
  productId?: InputMaybe<SortOrder>;
  sku?: InputMaybe<SortOrder>;
  stockLevel?: InputMaybe<SortOrder>;
  stockOnHand?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ProductVariantTranslation = {
  __typename?: 'ProductVariantTranslation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Promotion = Node & {
  __typename?: 'Promotion';
  actions: Array<ConfigurableOperation>;
  conditions: Array<ConfigurableOperation>;
  couponCode?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<PromotionCustomFields>;
  description: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  endsAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  perCustomerUsageLimit?: Maybe<Scalars['Int']['output']>;
  startsAt?: Maybe<Scalars['DateTime']['output']>;
  translations: Array<PromotionTranslation>;
  updatedAt: Scalars['DateTime']['output'];
  usageLimit?: Maybe<Scalars['Int']['output']>;
};

export type PromotionCustomFields = {
  __typename?: 'PromotionCustomFields';
  collectionType?: Maybe<Scalars['String']['output']>;
  internalPromoCode?: Maybe<Scalars['String']['output']>;
};

export type PromotionList = PaginatedList & {
  __typename?: 'PromotionList';
  items: Array<Promotion>;
  totalItems: Scalars['Int']['output'];
};

export type PromotionTranslation = {
  __typename?: 'PromotionTranslation';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Province = Node & Region & {
  __typename?: 'Province';
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  parent?: Maybe<Region>;
  parentId?: Maybe<Scalars['ID']['output']>;
  translations: Array<RegionTranslation>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProvinceList = PaginatedList & {
  __typename?: 'ProvinceList';
  items: Array<Province>;
  totalItems: Scalars['Int']['output'];
};

export type PublicPaymentMethod = {
  __typename?: 'PublicPaymentMethod';
  code: Scalars['String']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  translations: Array<PaymentMethodTranslation>;
};

export type PublicShippingMethod = {
  __typename?: 'PublicShippingMethod';
  code: Scalars['String']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  translations: Array<ShippingMethodTranslation>;
};

export type Query = {
  __typename?: 'Query';
  /** The active Channel */
  activeChannel: Channel;
  /** The active Customer */
  activeCustomer?: Maybe<Customer>;
  /**
   * The active Order. Will be `null` until an Order is created via `addItemToOrder`. Once an Order reaches the
   * state of `PaymentAuthorized` or `PaymentSettled`, then that Order is no longer considered "active" and this
   * query will once again return `null`.
   */
  activeOrder?: Maybe<Order>;
  /** Get active payment methods */
  activePaymentMethods: Array<Maybe<PublicPaymentMethod>>;
  activeSeasons: Array<Season>;
  /** Get active shipping methods */
  activeShippingMethods: Array<Maybe<PublicShippingMethod>>;
  /** An array of supported Countries */
  availableCountries: Array<Country>;
  banner?: Maybe<Banner>;
  bannerBySlug?: Maybe<Banner>;
  bannerType?: Maybe<BannerType>;
  bannerTypes: BannerTypeList;
  banners: BannerList;
  boughtTogether: Array<BoughtTogetherResult>;
  categories: CategoryList;
  category?: Maybe<Category>;
  categoryTree: Array<Category>;
  categoryType?: Maybe<CategoryType>;
  categoryTypes: CategoryTypeList;
  /** Returns a Collection either by its id or slug. If neither 'id' nor 'slug' is specified, an error will result. */
  collection?: Maybe<Collection>;
  /** A list of Collections available to the shop */
  collections: CollectionList;
  day?: Maybe<Day>;
  days: DayList;
  deliveryGroups: Array<DeliveryCredentialGroup>;
  deliveryMethod?: Maybe<DeliveryMethod>;
  deliveryMethods: DeliveryMethodList;
  /** Returns a list of payment methods and their eligibility based on the current active Order */
  eligiblePaymentMethods: Array<PaymentMethodQuote>;
  /** Returns a list of eligible shipping methods based on the current active Order */
  eligibleShippingMethods: Array<ShippingMethodQuote>;
  /** Returns a Facet by its id */
  facet?: Maybe<Facet>;
  /** A list of Facets available to the shop */
  facets: FacetList;
  getAllProducts: FilteredProductList;
  getFilters: AggregatedMetadata;
  getHomePageData: Array<HomePageSection>;
  label?: Maybe<Label>;
  labels: LabelList;
  /** Returns information about the current authenticated User */
  me?: Maybe<CurrentUser>;
  models: ModelList;
  myLikes: Array<Like>;
  /** Returns the possible next states that the activeOrder can transition to */
  nextOrderStates: Array<Scalars['String']['output']>;
  /**
   * Returns an Order based on the id. Note that in the Shop API, only orders belonging to the
   * currently-authenticated User may be queried.
   */
  order?: Maybe<Order>;
  /**
   * Returns an Order based on the order `code`. For guest Orders (i.e. Orders placed by non-authenticated Customers)
   * this query will only return the Order within 2 hours of the Order being placed. This allows an Order confirmation
   * screen to be shown immediately after completion of a guest checkout, yet prevents security risks of allowing
   * general anonymous access to Order data.
   */
  orderByCode?: Maybe<Order>;
  /** Get a Product either by id or slug. If neither 'id' nor 'slug' is specified, an error will result. */
  product?: Maybe<Product>;
  /** Get a list of Products */
  products: ProductList;
  /** Gets new refresh token */
  refreshToken: RefreshTokenResponse;
  /** Search Products based on the criteria set by the `SearchInput` */
  search: SearchResponse;
  seasonBySlug?: Maybe<Season>;
  testContext?: Maybe<Scalars['JSON']['output']>;
};


export type QueryBannerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBannerBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryBannerTypeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBannerTypesArgs = {
  options?: InputMaybe<BannerTypeListOptions>;
};


export type QueryBannersArgs = {
  options?: InputMaybe<BannerListOptions>;
};


export type QueryBoughtTogetherArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  productId: Scalars['ID']['input'];
};


export type QueryCategoriesArgs = {
  options?: InputMaybe<CategoryListOptions>;
};


export type QueryCategoryArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCategoryTreeArgs = {
  categoryTypeId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryCategoryTypeArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryCategoryTypesArgs = {
  options?: InputMaybe<CategoryTypeListOptions>;
};


export type QueryCollectionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCollectionsArgs = {
  options?: InputMaybe<CollectionListOptions>;
};


export type QueryDayArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDaysArgs = {
  options?: InputMaybe<DayListOptions>;
};


export type QueryDeliveryGroupsArgs = {
  channelId: Scalars['String']['input'];
};


export type QueryDeliveryMethodArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDeliveryMethodsArgs = {
  options?: InputMaybe<DeliveryMethodListOptions>;
};


export type QueryFacetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFacetsArgs = {
  options?: InputMaybe<FacetListOptions>;
};


export type QueryGetAllProductsArgs = {
  options?: InputMaybe<ShopFilteredProductListOptions>;
};


export type QueryGetFiltersArgs = {
  slug: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type QueryGetHomePageDataArgs = {
  options?: InputMaybe<ProductListOptions>;
};


export type QueryLabelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLabelsArgs = {
  options?: InputMaybe<LabelListOptions>;
};


export type QueryOrderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryOrderByCodeArgs = {
  code: Scalars['String']['input'];
};


export type QueryProductArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProductsArgs = {
  options?: InputMaybe<ProductListOptions>;
};


export type QueryRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type QuerySearchArgs = {
  input: SearchInput;
};


export type QuerySeasonBySlugArgs = {
  slug: Scalars['String']['input'];
};

export enum RedirectTypes {
  category = 'category',
  empty = 'empty',
  model = 'model',
  products = 'products',
  url = 'url'
}

export type RefreshCustomerVerificationResult = NativeAuthStrategyError | Success;

export type RefreshTokenResponse = {
  __typename?: 'RefreshTokenResponse';
  accessToken?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Refund = Node & {
  __typename?: 'Refund';
  adjustment: Scalars['Money']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  items: Scalars['Money']['output'];
  lines: Array<RefundLine>;
  metadata?: Maybe<Scalars['JSON']['output']>;
  method?: Maybe<Scalars['String']['output']>;
  paymentId: Scalars['ID']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  shipping: Scalars['Money']['output'];
  state: Scalars['String']['output'];
  total: Scalars['Money']['output'];
  transactionId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type RefundLine = {
  __typename?: 'RefundLine';
  orderLine: OrderLine;
  orderLineId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  refund: Refund;
  refundId: Scalars['ID']['output'];
};

export type Region = {
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  parent?: Maybe<Region>;
  parentId?: Maybe<Scalars['ID']['output']>;
  translations: Array<RegionTranslation>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RegionTranslation = {
  __typename?: 'RegionTranslation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RegisterCustomerAccountResult = MissingPasswordError | NativeAuthStrategyError | PasswordValidationError | Success;

export type RegisterCustomerCustomFieldsInput = {
  birthDate?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
};

export type RegisterCustomerInput = {
  customFields?: InputMaybe<RegisterCustomerCustomFieldsInput>;
  emailAddress: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type RelationCustomFieldConfig = CustomField & {
  __typename?: 'RelationCustomFieldConfig';
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  deprecationReason?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Array<LocalizedString>>;
  entity: Scalars['String']['output'];
  internal?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nullable?: Maybe<Scalars['Boolean']['output']>;
  readonly?: Maybe<Scalars['Boolean']['output']>;
  requiresPermission?: Maybe<Array<Permission>>;
  scalarFields: Array<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type RemoveOrderItemsResult = Order | OrderInterceptorError | OrderModificationError;

export type RequestPasswordResetResult = NativeAuthStrategyError | Success;

export type RequestUpdateCustomerEmailAddressResult = EmailAddressConflictError | InvalidCredentialsError | NativeAuthStrategyError | Success;

export type ResetPasswordResult = CurrentUser | NativeAuthStrategyError | NotVerifiedError | PasswordResetTokenExpiredError | PasswordResetTokenInvalidError | PasswordValidationError;

export type Role = Node & {
  __typename?: 'Role';
  channels: Array<Channel>;
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  permissions: Array<Permission>;
  updatedAt: Scalars['DateTime']['output'];
};

export type RoleList = PaginatedList & {
  __typename?: 'RoleList';
  items: Array<Role>;
  totalItems: Scalars['Int']['output'];
};

export type SaleInfo = {
  __typename?: 'SaleInfo';
  endDate?: Maybe<Scalars['DateTime']['output']>;
  limitCountOfEachOrder?: Maybe<Scalars['Int']['output']>;
  neverExpires: Scalars['Boolean']['output'];
  orderLimit?: Maybe<Scalars['Int']['output']>;
  price: Scalars['Int']['output'];
  saleId: Scalars['ID']['output'];
  salePercent: Scalars['Int']['output'];
  totalCountOfSalePrice?: Maybe<Scalars['Int']['output']>;
  type: Scalars['String']['output'];
};

export type SearchInput = {
  collectionId?: InputMaybe<Scalars['ID']['input']>;
  collectionIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  collectionSlug?: InputMaybe<Scalars['String']['input']>;
  collectionSlugs?: InputMaybe<Array<Scalars['String']['input']>>;
  facetValueFilters?: InputMaybe<Array<FacetValueFilterInput>>;
  groupByProduct?: InputMaybe<Scalars['Boolean']['input']>;
  inStock?: InputMaybe<Scalars['Boolean']['input']>;
  isRecommended?: InputMaybe<Scalars['Boolean']['input']>;
  isSale?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<SearchResultSortParameter>;
  take?: InputMaybe<Scalars['Int']['input']>;
  term?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type SearchReindexResponse = {
  __typename?: 'SearchReindexResponse';
  success: Scalars['Boolean']['output'];
};

export type SearchResponse = {
  __typename?: 'SearchResponse';
  collections: Array<CollectionResult>;
  facetValues: Array<FacetValueResult>;
  items: Array<SearchResult>;
  totalItems: Scalars['Int']['output'];
};

export type SearchResult = {
  __typename?: 'SearchResult';
  categories: Array<Category>;
  category?: Maybe<Category>;
  /** An array of ids of the Collections in which this result appears */
  collectionIds: Array<Scalars['ID']['output']>;
  currencyCode: CurrencyCode;
  description: Scalars['String']['output'];
  facetIds: Array<Scalars['ID']['output']>;
  facetValueIds: Array<Scalars['ID']['output']>;
  inStock: Scalars['Boolean']['output'];
  isLiked: Scalars['Boolean']['output'];
  isSelected: Scalars['Boolean']['output'];
  price: SearchResultPrice;
  priceWithTax: SearchResultPrice;
  productAsset?: Maybe<SearchResultAsset>;
  productId: Scalars['ID']['output'];
  productLabels: Array<Label>;
  productName: Scalars['String']['output'];
  productVariantAsset?: Maybe<SearchResultAsset>;
  productVariantId: Scalars['ID']['output'];
  productVariantName: Scalars['String']['output'];
  /** A relevance score for the result. Differs between database implementations */
  score: Scalars['Float']['output'];
  selectedQuantity: Scalars['Int']['output'];
  sku: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

export type SearchResultAsset = {
  __typename?: 'SearchResultAsset';
  focalPoint?: Maybe<Coordinate>;
  id: Scalars['ID']['output'];
  preview: Scalars['String']['output'];
};

/** The price of a search result product, either as a range or as a single price */
export type SearchResultPrice = PriceRange | SinglePrice;

export type SearchResultSortParameter = {
  name?: InputMaybe<SortOrder>;
  price?: InputMaybe<SortOrder>;
};

export type Season = Node & {
  __typename?: 'Season';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  endDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  products: ProductList;
  slug: Scalars['String']['output'];
  startDate: Scalars['DateTime']['output'];
  translations: Array<SeasonTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};


export type SeasonProductsArgs = {
  options?: InputMaybe<ProductListOptions>;
};

export type SeasonTranslation = Node & {
  __typename?: 'SeasonTranslation';
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Seller = Node & {
  __typename?: 'Seller';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SetCustomerForOrderResult = AlreadyLoggedInError | EmailAddressConflictError | GuestCheckoutError | NoActiveOrderError | Order;

export type SetOrderShippingMethodResult = IneligibleShippingMethodError | NoActiveOrderError | Order | OrderModificationError;

export type ShippingLine = {
  __typename?: 'ShippingLine';
  customFields?: Maybe<Scalars['JSON']['output']>;
  discountedPrice: Scalars['Money']['output'];
  discountedPriceWithTax: Scalars['Money']['output'];
  discounts: Array<Discount>;
  id: Scalars['ID']['output'];
  price: Scalars['Money']['output'];
  priceWithTax: Scalars['Money']['output'];
  shippingMethod: ShippingMethod;
};

export type ShippingMethod = Node & {
  __typename?: 'ShippingMethod';
  calculator: ConfigurableOperation;
  checker: ConfigurableOperation;
  code: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  description: Scalars['String']['output'];
  fulfillmentHandlerCode: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  translations: Array<ShippingMethodTranslation>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ShippingMethodList = PaginatedList & {
  __typename?: 'ShippingMethodList';
  items: Array<ShippingMethod>;
  totalItems: Scalars['Int']['output'];
};

export type ShippingMethodQuote = {
  __typename?: 'ShippingMethodQuote';
  code: Scalars['String']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** Any optional metadata returned by the ShippingCalculator in the ShippingCalculationResult */
  metadata?: Maybe<Scalars['JSON']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Money']['output'];
  priceWithTax: Scalars['Money']['output'];
};

export type ShippingMethodTranslation = {
  __typename?: 'ShippingMethodTranslation';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ShopFilteredProductFilterParameters = {
  categoryIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  /**
   * Whether only in-stock products are returned. Defaults to true on the
   * shop API so out-of-stock products are hidden from public listings.
   * Pass false explicitly to include products with zero or unknown stock
   * (e.g. admin previews).
   */
  inStock?: InputMaybe<Scalars['Boolean']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  isRecommended?: InputMaybe<Scalars['Boolean']['input']>;
  isSale?: InputMaybe<Scalars['Boolean']['input']>;
  isSeason?: InputMaybe<Scalars['Boolean']['input']>;
  labelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  max?: InputMaybe<Scalars['Float']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
  modelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  sku?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type ShopFilteredProductListOptions = {
  filter?: InputMaybe<ShopFilteredProductFilterParameters>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<FilteredProductSortParameters>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

/** The price value where the result has a single price */
export type SinglePrice = {
  __typename?: 'SinglePrice';
  value: Scalars['Money']['output'];
};

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type StringCustomFieldConfig = CustomField & {
  __typename?: 'StringCustomFieldConfig';
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  deprecationReason?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Array<LocalizedString>>;
  length?: Maybe<Scalars['Int']['output']>;
  list: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nullable?: Maybe<Scalars['Boolean']['output']>;
  options?: Maybe<Array<StringFieldOption>>;
  pattern?: Maybe<Scalars['String']['output']>;
  readonly?: Maybe<Scalars['Boolean']['output']>;
  requiresPermission?: Maybe<Array<Permission>>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type StringFieldOption = {
  __typename?: 'StringFieldOption';
  label?: Maybe<Array<LocalizedString>>;
  value: Scalars['String']['output'];
};

/** Operators for filtering on a list of String fields */
export type StringListOperators = {
  inList: Scalars['String']['input'];
};

/** Operators for filtering on a String field */
export type StringOperators = {
  contains?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notContains?: InputMaybe<Scalars['String']['input']>;
  notEq?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  regex?: InputMaybe<Scalars['String']['input']>;
};

export type StringStructFieldConfig = StructField & {
  __typename?: 'StringStructFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  label?: Maybe<Array<LocalizedString>>;
  length?: Maybe<Scalars['Int']['output']>;
  list: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  options?: Maybe<Array<StringFieldOption>>;
  pattern?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type StructCustomFieldConfig = CustomField & {
  __typename?: 'StructCustomFieldConfig';
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  deprecationReason?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Array<LocalizedString>>;
  fields: Array<StructFieldConfig>;
  internal?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nullable?: Maybe<Scalars['Boolean']['output']>;
  readonly?: Maybe<Scalars['Boolean']['output']>;
  requiresPermission?: Maybe<Array<Permission>>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type StructField = {
  description?: Maybe<Array<LocalizedString>>;
  label?: Maybe<Array<LocalizedString>>;
  list?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type StructFieldConfig = BooleanStructFieldConfig | DateTimeStructFieldConfig | FloatStructFieldConfig | IntStructFieldConfig | StringStructFieldConfig | TextStructFieldConfig;

/** Indicates that an operation succeeded, where we do not want to return any more specific information. */
export type Success = {
  __typename?: 'Success';
  success: Scalars['Boolean']['output'];
};

export type Surcharge = Node & {
  __typename?: 'Surcharge';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  price: Scalars['Money']['output'];
  priceWithTax: Scalars['Money']['output'];
  sku?: Maybe<Scalars['String']['output']>;
  taxLines: Array<TaxLine>;
  taxRate: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Tag = Node & {
  __typename?: 'Tag';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  value: Scalars['String']['output'];
};

export type TagList = PaginatedList & {
  __typename?: 'TagList';
  items: Array<Tag>;
  totalItems: Scalars['Int']['output'];
};

export type TaxCategory = Node & {
  __typename?: 'TaxCategory';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type TaxLine = {
  __typename?: 'TaxLine';
  description: Scalars['String']['output'];
  taxRate: Scalars['Float']['output'];
};

export type TaxRate = Node & {
  __typename?: 'TaxRate';
  category: TaxCategory;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  customerGroup?: Maybe<CustomerGroup>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  value: Scalars['Float']['output'];
  zone: Zone;
};

export type TaxRateList = PaginatedList & {
  __typename?: 'TaxRateList';
  items: Array<TaxRate>;
  totalItems: Scalars['Int']['output'];
};

export type TextCustomFieldConfig = CustomField & {
  __typename?: 'TextCustomFieldConfig';
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  deprecationReason?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Array<LocalizedString>>;
  internal?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nullable?: Maybe<Scalars['Boolean']['output']>;
  readonly?: Maybe<Scalars['Boolean']['output']>;
  requiresPermission?: Maybe<Array<Permission>>;
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type TextStructFieldConfig = StructField & {
  __typename?: 'TextStructFieldConfig';
  description?: Maybe<Array<LocalizedString>>;
  label?: Maybe<Array<LocalizedString>>;
  list: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
  ui?: Maybe<Scalars['JSON']['output']>;
};

export type TrackClickSuccess = {
  __typename?: 'TrackClickSuccess';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type TransitionOrderToStateResult = Order | OrderStateTransitionError;

export type UpdateAddressCustomFieldsInput = {
  building?: InputMaybe<Scalars['String']['input']>;
  floor?: InputMaybe<Scalars['String']['input']>;
  homeType?: InputMaybe<Scalars['String']['input']>;
  house?: InputMaybe<Scalars['String']['input']>;
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Input used to update an Address.
 *
 * The countryCode must correspond to a `code` property of a Country that has been defined in the
 * Vendure server. The `code` property is typically a 2-character ISO code such as "GB", "US", "DE" etc.
 * If an invalid code is passed, the mutation will fail.
 */
export type UpdateAddressInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  countryCode?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<UpdateAddressCustomFieldsInput>;
  defaultBillingAddress?: InputMaybe<Scalars['Boolean']['input']>;
  defaultShippingAddress?: InputMaybe<Scalars['Boolean']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  streetLine1?: InputMaybe<Scalars['String']['input']>;
  streetLine2?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryInput = {
  categoryTypeId?: InputMaybe<Scalars['ID']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  featuredAssetId?: InputMaybe<Scalars['ID']['input']>;
  iconAssetId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  modelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['Int']['input']>;
  translations?: InputMaybe<Array<CategoryTranslationInput>>;
};

export type UpdateCategoryTypeInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  iconAssetId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  imageAssetId?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['Int']['input']>;
  translations?: InputMaybe<Array<CategoryTypeTranslationInput>>;
};

export type UpdateCustomerCustomFieldsInput = {
  birthDate?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerEmailAddressResult = IdentifierChangeTokenExpiredError | IdentifierChangeTokenInvalidError | NativeAuthStrategyError | Success;

export type UpdateCustomerInput = {
  customFields?: InputMaybe<UpdateCustomerCustomFieldsInput>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerPasswordResult = InvalidCredentialsError | NativeAuthStrategyError | PasswordValidationError | Success;

export type UpdateLabelInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  featuredAssetId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  sort?: InputMaybe<Scalars['Int']['input']>;
  translations?: InputMaybe<Array<LabelTranslationInput>>;
};

/**
 * Returned when multiple items are added to an Order.
 * The errorResults array contains the errors that occurred for each item, if any.
 */
export type UpdateMultipleOrderItemsResult = {
  __typename?: 'UpdateMultipleOrderItemsResult';
  errorResults: Array<UpdateOrderItemErrorResult>;
  order: Order;
};

export type UpdateOrderCustomFieldsInput = {
  assignedCourierId?: InputMaybe<Scalars['String']['input']>;
  deliveryMethodId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateOrderInput = {
  customFields?: InputMaybe<UpdateOrderCustomFieldsInput>;
};

/** Union type of all possible errors that can occur when adding or removing items from an Order. */
export type UpdateOrderItemErrorResult = InsufficientStockError | NegativeQuantityError | OrderInterceptorError | OrderLimitError | OrderModificationError;

export type UpdateOrderItemsResult = InsufficientStockError | NegativeQuantityError | Order | OrderInterceptorError | OrderLimitError | OrderModificationError;

export type User = Node & {
  __typename?: 'User';
  authenticationMethods: Array<AuthenticationMethod>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  identifier: Scalars['String']['output'];
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  roles: Array<Role>;
  updatedAt: Scalars['DateTime']['output'];
  verified: Scalars['Boolean']['output'];
};

/**
 * Returned if the verification token (used to verify a Customer's email address) is valid, but has
 * expired according to the `verificationTokenDuration` setting in the AuthOptions.
 */
export type VerificationTokenExpiredError = ErrorResult & {
  __typename?: 'VerificationTokenExpiredError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/**
 * Returned if the verification token (used to verify a Customer's email address) is either
 * invalid or does not match any expected tokens.
 */
export type VerificationTokenInvalidError = ErrorResult & {
  __typename?: 'VerificationTokenInvalidError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type VerifyCustomerAccountResult = CurrentUser | MissingPasswordError | NativeAuthStrategyError | PasswordAlreadySetError | PasswordValidationError | VerificationTokenExpiredError | VerificationTokenInvalidError;

export type Worker = {
  __typename?: 'Worker';
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
  vehicle?: Maybe<Scalars['String']['output']>;
  vehiclePlate?: Maybe<Scalars['String']['output']>;
};

export type Zone = Node & {
  __typename?: 'Zone';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  members: Array<Region>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping of union types */
export type ResolversUnionTypes<_RefType extends Record<string, unknown>> = {
  ActiveOrderResult:
    | ( NoActiveOrderError )
    | ( Omit<Order, 'billingAddress' | 'customer' | 'fulfillments' | 'lines' | 'payments' | 'shippingAddress'> & { billingAddress?: Maybe<_RefType['OrderAddress']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, lines: Array<_RefType['OrderLine']>, payments?: Maybe<Array<_RefType['Payment']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
  ;
  AddPaymentToOrderResult:
    | ( IneligiblePaymentMethodError )
    | ( NoActiveOrderError )
    | ( Omit<Order, 'billingAddress' | 'customer' | 'fulfillments' | 'lines' | 'payments' | 'shippingAddress'> & { billingAddress?: Maybe<_RefType['OrderAddress']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, lines: Array<_RefType['OrderLine']>, payments?: Maybe<Array<_RefType['Payment']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( OrderPaymentStateError )
    | ( OrderStateTransitionError )
    | ( PaymentDeclinedError )
    | ( PaymentFailedError )
  ;
  ApplyCouponCodeResult:
    | ( CouponCodeExpiredError )
    | ( CouponCodeInvalidError )
    | ( CouponCodeLimitError )
    | ( Omit<Order, 'billingAddress' | 'customer' | 'fulfillments' | 'lines' | 'payments' | 'shippingAddress'> & { billingAddress?: Maybe<_RefType['OrderAddress']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, lines: Array<_RefType['OrderLine']>, payments?: Maybe<Array<_RefType['Payment']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
  ;
  AuthenticationResult:
    | ( CurrentUser )
    | ( InvalidCredentialsError )
    | ( NotVerifiedError )
  ;
  CustomFieldConfig:
    | ( BooleanCustomFieldConfig )
    | ( DateTimeCustomFieldConfig )
    | ( FloatCustomFieldConfig )
    | ( IntCustomFieldConfig )
    | ( LocaleStringCustomFieldConfig )
    | ( LocaleTextCustomFieldConfig )
    | ( RelationCustomFieldConfig )
    | ( StringCustomFieldConfig )
    | ( Omit<StructCustomFieldConfig, 'fields'> & { fields: Array<_RefType['StructFieldConfig']> } )
    | ( TextCustomFieldConfig )
  ;
  NativeAuthenticationResult:
    | ( CurrentUser )
    | ( InvalidCredentialsError )
    | ( NativeAuthStrategyError )
    | ( NotVerifiedError )
  ;
  RefreshCustomerVerificationResult:
    | ( NativeAuthStrategyError )
    | ( Success )
  ;
  RegisterCustomerAccountResult:
    | ( MissingPasswordError )
    | ( NativeAuthStrategyError )
    | ( PasswordValidationError )
    | ( Success )
  ;
  RemoveOrderItemsResult:
    | ( Omit<Order, 'billingAddress' | 'customer' | 'fulfillments' | 'lines' | 'payments' | 'shippingAddress'> & { billingAddress?: Maybe<_RefType['OrderAddress']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, lines: Array<_RefType['OrderLine']>, payments?: Maybe<Array<_RefType['Payment']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( OrderInterceptorError )
    | ( OrderModificationError )
  ;
  RequestPasswordResetResult:
    | ( NativeAuthStrategyError )
    | ( Success )
  ;
  RequestUpdateCustomerEmailAddressResult:
    | ( EmailAddressConflictError )
    | ( InvalidCredentialsError )
    | ( NativeAuthStrategyError )
    | ( Success )
  ;
  ResetPasswordResult:
    | ( CurrentUser )
    | ( NativeAuthStrategyError )
    | ( NotVerifiedError )
    | ( PasswordResetTokenExpiredError )
    | ( PasswordResetTokenInvalidError )
    | ( PasswordValidationError )
  ;
  SearchResultPrice:
    | ( PriceRange )
    | ( SinglePrice )
  ;
  SetCustomerForOrderResult:
    | ( AlreadyLoggedInError )
    | ( EmailAddressConflictError )
    | ( GuestCheckoutError )
    | ( NoActiveOrderError )
    | ( Omit<Order, 'billingAddress' | 'customer' | 'fulfillments' | 'lines' | 'payments' | 'shippingAddress'> & { billingAddress?: Maybe<_RefType['OrderAddress']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, lines: Array<_RefType['OrderLine']>, payments?: Maybe<Array<_RefType['Payment']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
  ;
  SetOrderShippingMethodResult:
    | ( IneligibleShippingMethodError )
    | ( NoActiveOrderError )
    | ( Omit<Order, 'billingAddress' | 'customer' | 'fulfillments' | 'lines' | 'payments' | 'shippingAddress'> & { billingAddress?: Maybe<_RefType['OrderAddress']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, lines: Array<_RefType['OrderLine']>, payments?: Maybe<Array<_RefType['Payment']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( OrderModificationError )
  ;
  StructFieldConfig:
    | ( BooleanStructFieldConfig )
    | ( DateTimeStructFieldConfig )
    | ( FloatStructFieldConfig )
    | ( IntStructFieldConfig )
    | ( StringStructFieldConfig )
    | ( TextStructFieldConfig )
  ;
  TransitionOrderToStateResult:
    | ( Omit<Order, 'billingAddress' | 'customer' | 'fulfillments' | 'lines' | 'payments' | 'shippingAddress'> & { billingAddress?: Maybe<_RefType['OrderAddress']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, lines: Array<_RefType['OrderLine']>, payments?: Maybe<Array<_RefType['Payment']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( OrderStateTransitionError )
  ;
  UpdateCustomerEmailAddressResult:
    | ( IdentifierChangeTokenExpiredError )
    | ( IdentifierChangeTokenInvalidError )
    | ( NativeAuthStrategyError )
    | ( Success )
  ;
  UpdateCustomerPasswordResult:
    | ( InvalidCredentialsError )
    | ( NativeAuthStrategyError )
    | ( PasswordValidationError )
    | ( Success )
  ;
  UpdateOrderItemErrorResult:
    | ( Omit<InsufficientStockError, 'order'> & { order: _RefType['Order'] } )
    | ( NegativeQuantityError )
    | ( OrderInterceptorError )
    | ( OrderLimitError )
    | ( OrderModificationError )
  ;
  UpdateOrderItemsResult:
    | ( Omit<InsufficientStockError, 'order'> & { order: _RefType['Order'] } )
    | ( NegativeQuantityError )
    | ( Omit<Order, 'billingAddress' | 'customer' | 'fulfillments' | 'lines' | 'payments' | 'shippingAddress'> & { billingAddress?: Maybe<_RefType['OrderAddress']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, lines: Array<_RefType['OrderLine']>, payments?: Maybe<Array<_RefType['Payment']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( OrderInterceptorError )
    | ( OrderLimitError )
    | ( OrderModificationError )
  ;
  VerifyCustomerAccountResult:
    | ( CurrentUser )
    | ( MissingPasswordError )
    | ( NativeAuthStrategyError )
    | ( PasswordAlreadySetError )
    | ( PasswordValidationError )
    | ( VerificationTokenExpiredError )
    | ( VerificationTokenInvalidError )
  ;
};

/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  CustomField:
    | ( BooleanCustomFieldConfig )
    | ( DateTimeCustomFieldConfig )
    | ( FloatCustomFieldConfig )
    | ( IntCustomFieldConfig )
    | ( LocaleStringCustomFieldConfig )
    | ( LocaleTextCustomFieldConfig )
    | ( RelationCustomFieldConfig )
    | ( StringCustomFieldConfig )
    | ( Omit<StructCustomFieldConfig, 'fields'> & { fields: Array<_RefType['StructFieldConfig']> } )
    | ( TextCustomFieldConfig )
  ;
  ErrorResult:
    | ( AlreadyLoggedInError )
    | ( CouponCodeExpiredError )
    | ( CouponCodeInvalidError )
    | ( CouponCodeLimitError )
    | ( EmailAddressConflictError )
    | ( GuestCheckoutError )
    | ( IdentifierChangeTokenExpiredError )
    | ( IdentifierChangeTokenInvalidError )
    | ( IneligiblePaymentMethodError )
    | ( IneligibleShippingMethodError )
    | ( Omit<InsufficientStockError, 'order'> & { order: _RefType['Order'] } )
    | ( InvalidCredentialsError )
    | ( MissingPasswordError )
    | ( NativeAuthStrategyError )
    | ( NegativeQuantityError )
    | ( NoActiveOrderError )
    | ( NotVerifiedError )
    | ( OrderInterceptorError )
    | ( OrderLimitError )
    | ( OrderModificationError )
    | ( OrderPaymentStateError )
    | ( OrderStateTransitionError )
    | ( PasswordAlreadySetError )
    | ( PasswordResetTokenExpiredError )
    | ( PasswordResetTokenInvalidError )
    | ( PasswordValidationError )
    | ( PaymentDeclinedError )
    | ( PaymentFailedError )
    | ( VerificationTokenExpiredError )
    | ( VerificationTokenInvalidError )
  ;
  Node:
    | ( Omit<Address, 'country'> & { country: _RefType['Country'] } )
    | ( Asset )
    | ( AuthenticationMethod )
    | ( Omit<Banner, 'assets' | 'category' | 'products' | 'type' | 'variants'> & { assets: Array<_RefType['BannerAsset']>, category?: Maybe<_RefType['Category']>, products?: Maybe<Array<_RefType['Product']>>, type?: Maybe<_RefType['BannerType']>, variants?: Maybe<Array<_RefType['ProductVariant']>> } )
    | ( Omit<BannerAsset, 'banner'> & { banner: _RefType['Banner'] } )
    | ( Omit<BannerType, 'banners'> & { banners: Array<_RefType['Banner']> } )
    | ( Omit<Category, 'banners' | 'categoryType' | 'children' | 'parent' | 'productsByLabel'> & { banners: Array<_RefType['Banner']>, categoryType: _RefType['CategoryType'], children: Array<_RefType['Category']>, parent?: Maybe<_RefType['Category']>, productsByLabel: Array<_RefType['Product']> } )
    | ( Omit<CategoryType, 'categories'> & { categories: Array<_RefType['Category']> } )
    | ( Omit<Channel, 'customFields' | 'defaultShippingZone' | 'defaultTaxZone'> & { customFields?: Maybe<_RefType['ChannelCustomFields']>, defaultShippingZone?: Maybe<_RefType['Zone']>, defaultTaxZone?: Maybe<_RefType['Zone']> } )
    | ( Omit<Collection, 'breadcrumbs' | 'children' | 'parent' | 'productVariants'> & { breadcrumbs: Array<_RefType['CollectionBreadcrumb']>, children?: Maybe<Array<_RefType['Collection']>>, parent?: Maybe<_RefType['Collection']>, productVariants: _RefType['ProductVariantList'] } )
    | ( Omit<Country, 'parent'> & { parent?: Maybe<_RefType['Region']> } )
    | ( Omit<Customer, 'addresses' | 'orders' | 'user'> & { addresses?: Maybe<Array<_RefType['Address']>>, orders: _RefType['OrderList'], user?: Maybe<_RefType['User']> } )
    | ( Omit<CustomerGroup, 'customers'> & { customers: _RefType['CustomerList'] } )
    | ( Day )
    | ( DeliveryMethod )
    | ( Facet )
    | ( FacetValue )
    | ( Omit<Fulfillment, 'lines' | 'summary'> & { lines: Array<_RefType['FulfillmentLine']>, summary: Array<_RefType['FulfillmentLine']> } )
    | ( HistoryEntry )
    | ( Label )
    | ( Omit<Order, 'billingAddress' | 'customer' | 'fulfillments' | 'lines' | 'payments' | 'shippingAddress'> & { billingAddress?: Maybe<_RefType['OrderAddress']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, lines: Array<_RefType['OrderLine']>, payments?: Maybe<Array<_RefType['Payment']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( Omit<OrderLine, 'fulfillmentLines' | 'order' | 'productVariant'> & { fulfillmentLines?: Maybe<Array<_RefType['FulfillmentLine']>>, order: _RefType['Order'], productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Payment, 'refunds'> & { refunds: Array<_RefType['Refund']> } )
    | ( PaymentMethod )
    | ( Omit<Product, 'categories' | 'category' | 'collections' | 'sale' | 'variantList' | 'variants'> & { categories: Array<_RefType['Category']>, category?: Maybe<_RefType['Category']>, collections: Array<_RefType['Collection']>, sale?: Maybe<_RefType['SaleInfo']>, variantList: _RefType['ProductVariantList'], variants: Array<_RefType['ProductVariant']> } )
    | ( ProductOption )
    | ( ProductOptionGroup )
    | ( Omit<ProductVariant, 'product' | 'sale' | 'taxRateApplied'> & { product: _RefType['Product'], sale?: Maybe<_RefType['SaleInfo']>, taxRateApplied: _RefType['TaxRate'] } )
    | ( Promotion )
    | ( Omit<Province, 'parent'> & { parent?: Maybe<_RefType['Region']> } )
    | ( Omit<Refund, 'lines'> & { lines: Array<_RefType['RefundLine']> } )
    | ( Omit<Role, 'channels'> & { channels: Array<_RefType['Channel']> } )
    | ( Omit<Season, 'products'> & { products: _RefType['ProductList'] } )
    | ( SeasonTranslation )
    | ( Seller )
    | ( ShippingMethod )
    | ( Surcharge )
    | ( Tag )
    | ( TaxCategory )
    | ( Omit<TaxRate, 'customerGroup' | 'zone'> & { customerGroup?: Maybe<_RefType['CustomerGroup']>, zone: _RefType['Zone'] } )
    | ( Omit<User, 'authenticationMethods' | 'roles'> & { authenticationMethods: Array<_RefType['AuthenticationMethod']>, roles: Array<_RefType['Role']> } )
    | ( Omit<Zone, 'members'> & { members: Array<_RefType['Region']> } )
  ;
  PaginatedList:
    | ( AssetList )
    | ( Omit<BannerList, 'items'> & { items: Array<_RefType['Banner']> } )
    | ( Omit<BannerTypeList, 'items'> & { items: Array<_RefType['BannerType']> } )
    | ( Omit<CategoryList, 'items'> & { items: Array<_RefType['Category']> } )
    | ( Omit<CategoryTypeList, 'items'> & { items: Array<_RefType['CategoryType']> } )
    | ( Omit<CollectionList, 'items'> & { items: Array<_RefType['Collection']> } )
    | ( Omit<CountryList, 'items'> & { items: Array<_RefType['Country']> } )
    | ( Omit<CustomerList, 'items'> & { items: Array<_RefType['Customer']> } )
    | ( DayList )
    | ( DeliveryMethodList )
    | ( FacetList )
    | ( FacetValueList )
    | ( HistoryEntryList )
    | ( LabelList )
    | ( Omit<OrderList, 'items'> & { items: Array<_RefType['Order']> } )
    | ( Omit<ProductList, 'items'> & { items: Array<_RefType['Product']> } )
    | ( Omit<ProductVariantList, 'items'> & { items: Array<_RefType['ProductVariant']> } )
    | ( PromotionList )
    | ( Omit<ProvinceList, 'items'> & { items: Array<_RefType['Province']> } )
    | ( Omit<RoleList, 'items'> & { items: Array<_RefType['Role']> } )
    | ( ShippingMethodList )
    | ( TagList )
    | ( Omit<TaxRateList, 'items'> & { items: Array<_RefType['TaxRate']> } )
  ;
  Region:
    | ( Omit<Country, 'parent'> & { parent?: Maybe<_RefType['Region']> } )
    | ( Omit<Province, 'parent'> & { parent?: Maybe<_RefType['Region']> } )
  ;
  StructField:
    | ( BooleanStructFieldConfig )
    | ( DateTimeStructFieldConfig )
    | ( FloatStructFieldConfig )
    | ( IntStructFieldConfig )
    | ( StringStructFieldConfig )
    | ( TextStructFieldConfig )
  ;
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  ActiveOrderResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ActiveOrderResult']>;
  AddItemInput: AddItemInput;
  AddPaymentToOrderResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['AddPaymentToOrderResult']>;
  Address: ResolverTypeWrapper<Omit<Address, 'country'> & { country: ResolversTypes['Country'] }>;
  AddressCustomFields: ResolverTypeWrapper<AddressCustomFields>;
  Adjustment: ResolverTypeWrapper<Adjustment>;
  AdjustmentType: AdjustmentType;
  AdminFilteredProductFilterParameters: AdminFilteredProductFilterParameters;
  AdminFilteredProductListOptions: AdminFilteredProductListOptions;
  AggregatedMetadata: ResolverTypeWrapper<Omit<AggregatedMetadata, 'categories'> & { categories: Array<ResolversTypes['Category']> }>;
  AlreadyLoggedInError: ResolverTypeWrapper<AlreadyLoggedInError>;
  AppleAuthInput: AppleAuthInput;
  ApplyCouponCodeResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ApplyCouponCodeResult']>;
  Asset: ResolverTypeWrapper<Asset>;
  AssetList: ResolverTypeWrapper<AssetList>;
  AssetTranslation: ResolverTypeWrapper<AssetTranslation>;
  AssetType: AssetType;
  AuthDeletionResponse: ResolverTypeWrapper<AuthDeletionResponse>;
  AuthDeletionResult: AuthDeletionResult;
  AuthenticationInput: AuthenticationInput;
  AuthenticationMethod: ResolverTypeWrapper<AuthenticationMethod>;
  AuthenticationResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['AuthenticationResult']>;
  Banner: ResolverTypeWrapper<Omit<Banner, 'assets' | 'category' | 'products' | 'type' | 'variants'> & { assets: Array<ResolversTypes['BannerAsset']>, category?: Maybe<ResolversTypes['Category']>, products?: Maybe<Array<ResolversTypes['Product']>>, type?: Maybe<ResolversTypes['BannerType']>, variants?: Maybe<Array<ResolversTypes['ProductVariant']>> }>;
  BannerAsset: ResolverTypeWrapper<Omit<BannerAsset, 'banner'> & { banner: ResolversTypes['Banner'] }>;
  BannerFilterParameter: BannerFilterParameter;
  BannerList: ResolverTypeWrapper<Omit<BannerList, 'items'> & { items: Array<ResolversTypes['Banner']> }>;
  BannerListOptions: BannerListOptions;
  BannerSortParameter: BannerSortParameter;
  BannerTranslation: ResolverTypeWrapper<BannerTranslation>;
  BannerType: ResolverTypeWrapper<Omit<BannerType, 'banners'> & { banners: Array<ResolversTypes['Banner']> }>;
  BannerTypeFilterParameter: BannerTypeFilterParameter;
  BannerTypeList: ResolverTypeWrapper<Omit<BannerTypeList, 'items'> & { items: Array<ResolversTypes['BannerType']> }>;
  BannerTypeListOptions: BannerTypeListOptions;
  BannerTypeSortParameter: BannerTypeSortParameter;
  BannerTypeTranslation: ResolverTypeWrapper<BannerTypeTranslation>;
  BaseResponse: ResolverTypeWrapper<BaseResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BooleanCustomFieldConfig: ResolverTypeWrapper<BooleanCustomFieldConfig>;
  BooleanListOperators: BooleanListOperators;
  BooleanOperators: BooleanOperators;
  BooleanStructFieldConfig: ResolverTypeWrapper<BooleanStructFieldConfig>;
  BoughtTogetherResult: ResolverTypeWrapper<Omit<BoughtTogetherResult, 'product'> & { product: ResolversTypes['Product'] }>;
  Category: ResolverTypeWrapper<Omit<Category, 'banners' | 'categoryType' | 'children' | 'parent' | 'productsByLabel'> & { banners: Array<ResolversTypes['Banner']>, categoryType: ResolversTypes['CategoryType'], children: Array<ResolversTypes['Category']>, parent?: Maybe<ResolversTypes['Category']>, productsByLabel: Array<ResolversTypes['Product']> }>;
  CategoryFilterParameter: CategoryFilterParameter;
  CategoryList: ResolverTypeWrapper<Omit<CategoryList, 'items'> & { items: Array<ResolversTypes['Category']> }>;
  CategoryListOptions: CategoryListOptions;
  CategorySortParameter: CategorySortParameter;
  CategoryTranslation: ResolverTypeWrapper<CategoryTranslation>;
  CategoryTranslationInput: CategoryTranslationInput;
  CategoryType: ResolverTypeWrapper<Omit<CategoryType, 'categories'> & { categories: Array<ResolversTypes['Category']> }>;
  CategoryTypeFilterParameter: CategoryTypeFilterParameter;
  CategoryTypeList: ResolverTypeWrapper<Omit<CategoryTypeList, 'items'> & { items: Array<ResolversTypes['CategoryType']> }>;
  CategoryTypeListOptions: CategoryTypeListOptions;
  CategoryTypeSortParameter: CategoryTypeSortParameter;
  CategoryTypeTranslation: ResolverTypeWrapper<CategoryTypeTranslation>;
  CategoryTypeTranslationInput: CategoryTypeTranslationInput;
  Channel: ResolverTypeWrapper<Omit<Channel, 'customFields' | 'defaultShippingZone' | 'defaultTaxZone'> & { customFields?: Maybe<ResolversTypes['ChannelCustomFields']>, defaultShippingZone?: Maybe<ResolversTypes['Zone']>, defaultTaxZone?: Maybe<ResolversTypes['Zone']> }>;
  ChannelCustomFields: ResolverTypeWrapper<ChannelCustomFields>;
  Collection: ResolverTypeWrapper<Omit<Collection, 'breadcrumbs' | 'children' | 'parent' | 'productVariants'> & { breadcrumbs: Array<ResolversTypes['CollectionBreadcrumb']>, children?: Maybe<Array<ResolversTypes['Collection']>>, parent?: Maybe<ResolversTypes['Collection']>, productVariants: ResolversTypes['ProductVariantList'] }>;
  CollectionBreadcrumb: ResolverTypeWrapper<CollectionBreadcrumb>;
  CollectionFilterParameter: CollectionFilterParameter;
  CollectionList: ResolverTypeWrapper<Omit<CollectionList, 'items'> & { items: Array<ResolversTypes['Collection']> }>;
  CollectionListOptions: CollectionListOptions;
  CollectionResult: ResolverTypeWrapper<Omit<CollectionResult, 'collection'> & { collection: ResolversTypes['Collection'] }>;
  CollectionSortParameter: CollectionSortParameter;
  CollectionTranslation: ResolverTypeWrapper<CollectionTranslation>;
  ConfigArg: ResolverTypeWrapper<ConfigArg>;
  ConfigArgDefinition: ResolverTypeWrapper<ConfigArgDefinition>;
  ConfigArgInput: ConfigArgInput;
  ConfigurableOperation: ResolverTypeWrapper<ConfigurableOperation>;
  ConfigurableOperationDefinition: ResolverTypeWrapper<ConfigurableOperationDefinition>;
  ConfigurableOperationInput: ConfigurableOperationInput;
  Coordinate: ResolverTypeWrapper<Coordinate>;
  Country: ResolverTypeWrapper<Omit<Country, 'parent'> & { parent?: Maybe<ResolversTypes['Region']> }>;
  CountryList: ResolverTypeWrapper<Omit<CountryList, 'items'> & { items: Array<ResolversTypes['Country']> }>;
  CouponCodeExpiredError: ResolverTypeWrapper<CouponCodeExpiredError>;
  CouponCodeInvalidError: ResolverTypeWrapper<CouponCodeInvalidError>;
  CouponCodeLimitError: ResolverTypeWrapper<CouponCodeLimitError>;
  CreateAddressCustomFieldsInput: CreateAddressCustomFieldsInput;
  CreateAddressInput: CreateAddressInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateCategoryTypeInput: CreateCategoryTypeInput;
  CreateCustomerCustomFieldsInput: CreateCustomerCustomFieldsInput;
  CreateCustomerInput: CreateCustomerInput;
  CreateLabelInput: CreateLabelInput;
  CurrencyCode: CurrencyCode;
  CurrentUser: ResolverTypeWrapper<CurrentUser>;
  CurrentUserChannel: ResolverTypeWrapper<CurrentUserChannel>;
  CustomField: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['CustomField']>;
  CustomFieldConfig: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CustomFieldConfig']>;
  Customer: ResolverTypeWrapper<Omit<Customer, 'addresses' | 'orders' | 'user'> & { addresses?: Maybe<Array<ResolversTypes['Address']>>, orders: ResolversTypes['OrderList'], user?: Maybe<ResolversTypes['User']> }>;
  CustomerCustomFields: ResolverTypeWrapper<CustomerCustomFields>;
  CustomerFilterParameter: CustomerFilterParameter;
  CustomerGroup: ResolverTypeWrapper<Omit<CustomerGroup, 'customers'> & { customers: ResolversTypes['CustomerList'] }>;
  CustomerList: ResolverTypeWrapper<Omit<CustomerList, 'items'> & { items: Array<ResolversTypes['Customer']> }>;
  CustomerListOptions: CustomerListOptions;
  CustomerSortParameter: CustomerSortParameter;
  DateListOperators: DateListOperators;
  DateOperators: DateOperators;
  DateRange: DateRange;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DateTimeCustomFieldConfig: ResolverTypeWrapper<DateTimeCustomFieldConfig>;
  DateTimeStructFieldConfig: ResolverTypeWrapper<DateTimeStructFieldConfig>;
  Day: ResolverTypeWrapper<Day>;
  DayFilterParameter: DayFilterParameter;
  DayList: ResolverTypeWrapper<DayList>;
  DayListOptions: DayListOptions;
  DaySortParameter: DaySortParameter;
  DayTranslation: ResolverTypeWrapper<DayTranslation>;
  DayType: DayType;
  DeletionResponse: ResolverTypeWrapper<DeletionResponse>;
  DeletionResult: DeletionResult;
  DeliveryCredentialGroup: ResolverTypeWrapper<DeliveryCredentialGroup>;
  DeliveryMethod: ResolverTypeWrapper<DeliveryMethod>;
  DeliveryMethodFilterParameter: DeliveryMethodFilterParameter;
  DeliveryMethodList: ResolverTypeWrapper<DeliveryMethodList>;
  DeliveryMethodListOptions: DeliveryMethodListOptions;
  DeliveryMethodSortParameter: DeliveryMethodSortParameter;
  DeliveryMethodTranslation: ResolverTypeWrapper<DeliveryMethodTranslation>;
  DeliveryMethodType: DeliveryMethodType;
  Discount: ResolverTypeWrapper<Discount>;
  EmailAddressConflictError: ResolverTypeWrapper<EmailAddressConflictError>;
  EmailAuthInput: EmailAuthInput;
  ErrorCode: ErrorCode;
  ErrorResult: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['ErrorResult']>;
  Facet: ResolverTypeWrapper<Facet>;
  FacetFilterParameter: FacetFilterParameter;
  FacetList: ResolverTypeWrapper<FacetList>;
  FacetListOptions: FacetListOptions;
  FacetSortParameter: FacetSortParameter;
  FacetTranslation: ResolverTypeWrapper<FacetTranslation>;
  FacetValue: ResolverTypeWrapper<FacetValue>;
  FacetValueCustomFields: ResolverTypeWrapper<Omit<FacetValueCustomFields, 'categories'> & { categories?: Maybe<Array<ResolversTypes['Category']>> }>;
  FacetValueFilterInput: FacetValueFilterInput;
  FacetValueFilterParameter: FacetValueFilterParameter;
  FacetValueList: ResolverTypeWrapper<FacetValueList>;
  FacetValueListOptions: FacetValueListOptions;
  FacetValueResult: ResolverTypeWrapper<FacetValueResult>;
  FacetValueSortParameter: FacetValueSortParameter;
  FacetValueTranslation: ResolverTypeWrapper<FacetValueTranslation>;
  FilteredProductList: ResolverTypeWrapper<Omit<FilteredProductList, 'items'> & { items: Array<ResolversTypes['Product']> }>;
  FilteredProductSortParameters: FilteredProductSortParameters;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FloatCustomFieldConfig: ResolverTypeWrapper<FloatCustomFieldConfig>;
  FloatStructFieldConfig: ResolverTypeWrapper<FloatStructFieldConfig>;
  Fulfillment: ResolverTypeWrapper<Omit<Fulfillment, 'lines' | 'summary'> & { lines: Array<ResolversTypes['FulfillmentLine']>, summary: Array<ResolversTypes['FulfillmentLine']> }>;
  FulfillmentLine: ResolverTypeWrapper<Omit<FulfillmentLine, 'fulfillment' | 'orderLine'> & { fulfillment: ResolversTypes['Fulfillment'], orderLine: ResolversTypes['OrderLine'] }>;
  GlobalFlag: GlobalFlag;
  GoogleAuthInput: GoogleAuthInput;
  GuestCheckoutError: ResolverTypeWrapper<GuestCheckoutError>;
  HistoryEntry: ResolverTypeWrapper<HistoryEntry>;
  HistoryEntryFilterParameter: HistoryEntryFilterParameter;
  HistoryEntryList: ResolverTypeWrapper<HistoryEntryList>;
  HistoryEntryListOptions: HistoryEntryListOptions;
  HistoryEntrySortParameter: HistoryEntrySortParameter;
  HistoryEntryType: HistoryEntryType;
  HomePageSection: ResolverTypeWrapper<Omit<HomePageSection, 'products'> & { products: Array<ResolversTypes['Product']> }>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IDListOperators: IdListOperators;
  IDOperators: IdOperators;
  IdentifierChangeTokenExpiredError: ResolverTypeWrapper<IdentifierChangeTokenExpiredError>;
  IdentifierChangeTokenInvalidError: ResolverTypeWrapper<IdentifierChangeTokenInvalidError>;
  IneligiblePaymentMethodError: ResolverTypeWrapper<IneligiblePaymentMethodError>;
  IneligibleShippingMethodError: ResolverTypeWrapper<IneligibleShippingMethodError>;
  InsufficientStockError: ResolverTypeWrapper<Omit<InsufficientStockError, 'order'> & { order: ResolversTypes['Order'] }>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IntCustomFieldConfig: ResolverTypeWrapper<IntCustomFieldConfig>;
  IntStructFieldConfig: ResolverTypeWrapper<IntStructFieldConfig>;
  InvalidCredentialsError: ResolverTypeWrapper<InvalidCredentialsError>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Label: ResolverTypeWrapper<Label>;
  LabelFilterParameter: LabelFilterParameter;
  LabelList: ResolverTypeWrapper<LabelList>;
  LabelListOptions: LabelListOptions;
  LabelSortParameter: LabelSortParameter;
  LabelTranslation: ResolverTypeWrapper<LabelTranslation>;
  LabelTranslationInput: LabelTranslationInput;
  LanguageCode: LanguageCode;
  Like: ResolverTypeWrapper<Omit<Like, 'productVariant'> & { productVariant: ResolversTypes['ProductVariant'] }>;
  LikeResponse: ResolverTypeWrapper<Omit<LikeResponse, 'like'> & { like?: Maybe<ResolversTypes['Like']> }>;
  LocaleStringCustomFieldConfig: ResolverTypeWrapper<LocaleStringCustomFieldConfig>;
  LocaleTextCustomFieldConfig: ResolverTypeWrapper<LocaleTextCustomFieldConfig>;
  LocalizedString: ResolverTypeWrapper<LocalizedString>;
  LogicalOperator: LogicalOperator;
  MissingPasswordError: ResolverTypeWrapper<MissingPasswordError>;
  Model: ResolverTypeWrapper<Model>;
  ModelList: ResolverTypeWrapper<ModelList>;
  Money: ResolverTypeWrapper<Scalars['Money']['output']>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  NativeAuthInput: NativeAuthInput;
  NativeAuthStrategyError: ResolverTypeWrapper<NativeAuthStrategyError>;
  NativeAuthenticationResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['NativeAuthenticationResult']>;
  NegativeQuantityError: ResolverTypeWrapper<NegativeQuantityError>;
  NoActiveOrderError: ResolverTypeWrapper<NoActiveOrderError>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  NotVerifiedError: ResolverTypeWrapper<NotVerifiedError>;
  NumberListOperators: NumberListOperators;
  NumberOperators: NumberOperators;
  NumberRange: NumberRange;
  Order: ResolverTypeWrapper<Omit<Order, 'billingAddress' | 'customer' | 'fulfillments' | 'lines' | 'payments' | 'shippingAddress'> & { billingAddress?: Maybe<ResolversTypes['OrderAddress']>, customer?: Maybe<ResolversTypes['Customer']>, fulfillments?: Maybe<Array<ResolversTypes['Fulfillment']>>, lines: Array<ResolversTypes['OrderLine']>, payments?: Maybe<Array<ResolversTypes['Payment']>>, shippingAddress?: Maybe<ResolversTypes['OrderAddress']> }>;
  OrderAddress: ResolverTypeWrapper<OrderAddress>;
  OrderCustomFields: ResolverTypeWrapper<OrderCustomFields>;
  OrderFilterParameter: OrderFilterParameter;
  OrderInterceptorError: ResolverTypeWrapper<OrderInterceptorError>;
  OrderLimitError: ResolverTypeWrapper<OrderLimitError>;
  OrderLine: ResolverTypeWrapper<Omit<OrderLine, 'fulfillmentLines' | 'order' | 'productVariant'> & { fulfillmentLines?: Maybe<Array<ResolversTypes['FulfillmentLine']>>, order: ResolversTypes['Order'], productVariant: ResolversTypes['ProductVariant'] }>;
  OrderList: ResolverTypeWrapper<Omit<OrderList, 'items'> & { items: Array<ResolversTypes['Order']> }>;
  OrderListOptions: OrderListOptions;
  OrderModificationError: ResolverTypeWrapper<OrderModificationError>;
  OrderPaymentStateError: ResolverTypeWrapper<OrderPaymentStateError>;
  OrderSortParameter: OrderSortParameter;
  OrderStateTransitionError: ResolverTypeWrapper<OrderStateTransitionError>;
  OrderTaxSummary: ResolverTypeWrapper<OrderTaxSummary>;
  OrderType: OrderType;
  PaginatedList: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['PaginatedList']>;
  PasswordAlreadySetError: ResolverTypeWrapper<PasswordAlreadySetError>;
  PasswordResetTokenExpiredError: ResolverTypeWrapper<PasswordResetTokenExpiredError>;
  PasswordResetTokenInvalidError: ResolverTypeWrapper<PasswordResetTokenInvalidError>;
  PasswordValidationError: ResolverTypeWrapper<PasswordValidationError>;
  Payment: ResolverTypeWrapper<Omit<Payment, 'refunds'> & { refunds: Array<ResolversTypes['Refund']> }>;
  PaymentDeclinedError: ResolverTypeWrapper<PaymentDeclinedError>;
  PaymentFailedError: ResolverTypeWrapper<PaymentFailedError>;
  PaymentInput: PaymentInput;
  PaymentMethod: ResolverTypeWrapper<PaymentMethod>;
  PaymentMethodQuote: ResolverTypeWrapper<PaymentMethodQuote>;
  PaymentMethodTranslation: ResolverTypeWrapper<PaymentMethodTranslation>;
  Permission: Permission;
  PhoneAuthInput: PhoneAuthInput;
  PriceRange: ResolverTypeWrapper<PriceRange>;
  Product: ResolverTypeWrapper<Omit<Product, 'categories' | 'category' | 'collections' | 'sale' | 'variantList' | 'variants'> & { categories: Array<ResolversTypes['Category']>, category?: Maybe<ResolversTypes['Category']>, collections: Array<ResolversTypes['Collection']>, sale?: Maybe<ResolversTypes['SaleInfo']>, variantList: ResolversTypes['ProductVariantList'], variants: Array<ResolversTypes['ProductVariant']> }>;
  ProductCustomFields: ResolverTypeWrapper<Omit<ProductCustomFields, 'categories'> & { categories?: Maybe<Array<ResolversTypes['Category']>> }>;
  ProductFilterParameter: ProductFilterParameter;
  ProductList: ResolverTypeWrapper<Omit<ProductList, 'items'> & { items: Array<ResolversTypes['Product']> }>;
  ProductListOptions: ProductListOptions;
  ProductOption: ResolverTypeWrapper<ProductOption>;
  ProductOptionGroup: ResolverTypeWrapper<ProductOptionGroup>;
  ProductOptionGroupTranslation: ResolverTypeWrapper<ProductOptionGroupTranslation>;
  ProductOptionTranslation: ResolverTypeWrapper<ProductOptionTranslation>;
  ProductSortParameter: ProductSortParameter;
  ProductTranslation: ResolverTypeWrapper<ProductTranslation>;
  ProductVariant: ResolverTypeWrapper<Omit<ProductVariant, 'product' | 'sale' | 'taxRateApplied'> & { product: ResolversTypes['Product'], sale?: Maybe<ResolversTypes['SaleInfo']>, taxRateApplied: ResolversTypes['TaxRate'] }>;
  ProductVariantFilterParameter: ProductVariantFilterParameter;
  ProductVariantList: ResolverTypeWrapper<Omit<ProductVariantList, 'items'> & { items: Array<ResolversTypes['ProductVariant']> }>;
  ProductVariantListOptions: ProductVariantListOptions;
  ProductVariantSortParameter: ProductVariantSortParameter;
  ProductVariantTranslation: ResolverTypeWrapper<ProductVariantTranslation>;
  Promotion: ResolverTypeWrapper<Promotion>;
  PromotionCustomFields: ResolverTypeWrapper<PromotionCustomFields>;
  PromotionList: ResolverTypeWrapper<PromotionList>;
  PromotionTranslation: ResolverTypeWrapper<PromotionTranslation>;
  Province: ResolverTypeWrapper<Omit<Province, 'parent'> & { parent?: Maybe<ResolversTypes['Region']> }>;
  ProvinceList: ResolverTypeWrapper<Omit<ProvinceList, 'items'> & { items: Array<ResolversTypes['Province']> }>;
  PublicPaymentMethod: ResolverTypeWrapper<PublicPaymentMethod>;
  PublicShippingMethod: ResolverTypeWrapper<PublicShippingMethod>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RedirectTypes: RedirectTypes;
  RefreshCustomerVerificationResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RefreshCustomerVerificationResult']>;
  RefreshTokenResponse: ResolverTypeWrapper<RefreshTokenResponse>;
  Refund: ResolverTypeWrapper<Omit<Refund, 'lines'> & { lines: Array<ResolversTypes['RefundLine']> }>;
  RefundLine: ResolverTypeWrapper<Omit<RefundLine, 'orderLine' | 'refund'> & { orderLine: ResolversTypes['OrderLine'], refund: ResolversTypes['Refund'] }>;
  Region: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Region']>;
  RegionTranslation: ResolverTypeWrapper<RegionTranslation>;
  RegisterCustomerAccountResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RegisterCustomerAccountResult']>;
  RegisterCustomerCustomFieldsInput: RegisterCustomerCustomFieldsInput;
  RegisterCustomerInput: RegisterCustomerInput;
  RelationCustomFieldConfig: ResolverTypeWrapper<RelationCustomFieldConfig>;
  RemoveOrderItemsResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RemoveOrderItemsResult']>;
  RequestPasswordResetResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RequestPasswordResetResult']>;
  RequestUpdateCustomerEmailAddressResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RequestUpdateCustomerEmailAddressResult']>;
  ResetPasswordResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ResetPasswordResult']>;
  Role: ResolverTypeWrapper<Omit<Role, 'channels'> & { channels: Array<ResolversTypes['Channel']> }>;
  RoleList: ResolverTypeWrapper<Omit<RoleList, 'items'> & { items: Array<ResolversTypes['Role']> }>;
  SaleInfo: ResolverTypeWrapper<SaleInfo>;
  SearchInput: SearchInput;
  SearchReindexResponse: ResolverTypeWrapper<SearchReindexResponse>;
  SearchResponse: ResolverTypeWrapper<Omit<SearchResponse, 'collections' | 'items'> & { collections: Array<ResolversTypes['CollectionResult']>, items: Array<ResolversTypes['SearchResult']> }>;
  SearchResult: ResolverTypeWrapper<Omit<SearchResult, 'categories' | 'category' | 'price' | 'priceWithTax'> & { categories: Array<ResolversTypes['Category']>, category?: Maybe<ResolversTypes['Category']>, price: ResolversTypes['SearchResultPrice'], priceWithTax: ResolversTypes['SearchResultPrice'] }>;
  SearchResultAsset: ResolverTypeWrapper<SearchResultAsset>;
  SearchResultPrice: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SearchResultPrice']>;
  SearchResultSortParameter: SearchResultSortParameter;
  Season: ResolverTypeWrapper<Omit<Season, 'products'> & { products: ResolversTypes['ProductList'] }>;
  SeasonTranslation: ResolverTypeWrapper<SeasonTranslation>;
  Seller: ResolverTypeWrapper<Seller>;
  SetCustomerForOrderResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SetCustomerForOrderResult']>;
  SetOrderShippingMethodResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SetOrderShippingMethodResult']>;
  ShippingLine: ResolverTypeWrapper<ShippingLine>;
  ShippingMethod: ResolverTypeWrapper<ShippingMethod>;
  ShippingMethodList: ResolverTypeWrapper<ShippingMethodList>;
  ShippingMethodQuote: ResolverTypeWrapper<ShippingMethodQuote>;
  ShippingMethodTranslation: ResolverTypeWrapper<ShippingMethodTranslation>;
  ShopFilteredProductFilterParameters: ShopFilteredProductFilterParameters;
  ShopFilteredProductListOptions: ShopFilteredProductListOptions;
  SinglePrice: ResolverTypeWrapper<SinglePrice>;
  SortOrder: SortOrder;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  StringCustomFieldConfig: ResolverTypeWrapper<StringCustomFieldConfig>;
  StringFieldOption: ResolverTypeWrapper<StringFieldOption>;
  StringListOperators: StringListOperators;
  StringOperators: StringOperators;
  StringStructFieldConfig: ResolverTypeWrapper<StringStructFieldConfig>;
  StructCustomFieldConfig: ResolverTypeWrapper<Omit<StructCustomFieldConfig, 'fields'> & { fields: Array<ResolversTypes['StructFieldConfig']> }>;
  StructField: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['StructField']>;
  StructFieldConfig: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['StructFieldConfig']>;
  Success: ResolverTypeWrapper<Success>;
  Surcharge: ResolverTypeWrapper<Surcharge>;
  Tag: ResolverTypeWrapper<Tag>;
  TagList: ResolverTypeWrapper<TagList>;
  TaxCategory: ResolverTypeWrapper<TaxCategory>;
  TaxLine: ResolverTypeWrapper<TaxLine>;
  TaxRate: ResolverTypeWrapper<Omit<TaxRate, 'customerGroup' | 'zone'> & { customerGroup?: Maybe<ResolversTypes['CustomerGroup']>, zone: ResolversTypes['Zone'] }>;
  TaxRateList: ResolverTypeWrapper<Omit<TaxRateList, 'items'> & { items: Array<ResolversTypes['TaxRate']> }>;
  TextCustomFieldConfig: ResolverTypeWrapper<TextCustomFieldConfig>;
  TextStructFieldConfig: ResolverTypeWrapper<TextStructFieldConfig>;
  TrackClickSuccess: ResolverTypeWrapper<TrackClickSuccess>;
  TransitionOrderToStateResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TransitionOrderToStateResult']>;
  UpdateAddressCustomFieldsInput: UpdateAddressCustomFieldsInput;
  UpdateAddressInput: UpdateAddressInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateCategoryTypeInput: UpdateCategoryTypeInput;
  UpdateCustomerCustomFieldsInput: UpdateCustomerCustomFieldsInput;
  UpdateCustomerEmailAddressResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateCustomerEmailAddressResult']>;
  UpdateCustomerInput: UpdateCustomerInput;
  UpdateCustomerPasswordResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateCustomerPasswordResult']>;
  UpdateLabelInput: UpdateLabelInput;
  UpdateMultipleOrderItemsResult: ResolverTypeWrapper<Omit<UpdateMultipleOrderItemsResult, 'errorResults' | 'order'> & { errorResults: Array<ResolversTypes['UpdateOrderItemErrorResult']>, order: ResolversTypes['Order'] }>;
  UpdateOrderCustomFieldsInput: UpdateOrderCustomFieldsInput;
  UpdateOrderInput: UpdateOrderInput;
  UpdateOrderItemErrorResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateOrderItemErrorResult']>;
  UpdateOrderItemsResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateOrderItemsResult']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<Omit<User, 'authenticationMethods' | 'roles'> & { authenticationMethods: Array<ResolversTypes['AuthenticationMethod']>, roles: Array<ResolversTypes['Role']> }>;
  VerificationTokenExpiredError: ResolverTypeWrapper<VerificationTokenExpiredError>;
  VerificationTokenInvalidError: ResolverTypeWrapper<VerificationTokenInvalidError>;
  VerifyCustomerAccountResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['VerifyCustomerAccountResult']>;
  Worker: ResolverTypeWrapper<Worker>;
  Zone: ResolverTypeWrapper<Omit<Zone, 'members'> & { members: Array<ResolversTypes['Region']> }>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ActiveOrderResult: ResolversUnionTypes<ResolversParentTypes>['ActiveOrderResult'];
  AddItemInput: AddItemInput;
  AddPaymentToOrderResult: ResolversUnionTypes<ResolversParentTypes>['AddPaymentToOrderResult'];
  Address: Omit<Address, 'country'> & { country: ResolversParentTypes['Country'] };
  AddressCustomFields: AddressCustomFields;
  Adjustment: Adjustment;
  AdminFilteredProductFilterParameters: AdminFilteredProductFilterParameters;
  AdminFilteredProductListOptions: AdminFilteredProductListOptions;
  AggregatedMetadata: Omit<AggregatedMetadata, 'categories'> & { categories: Array<ResolversParentTypes['Category']> };
  AlreadyLoggedInError: AlreadyLoggedInError;
  AppleAuthInput: AppleAuthInput;
  ApplyCouponCodeResult: ResolversUnionTypes<ResolversParentTypes>['ApplyCouponCodeResult'];
  Asset: Asset;
  AssetList: AssetList;
  AssetTranslation: AssetTranslation;
  AuthDeletionResponse: AuthDeletionResponse;
  AuthenticationInput: AuthenticationInput;
  AuthenticationMethod: AuthenticationMethod;
  AuthenticationResult: ResolversUnionTypes<ResolversParentTypes>['AuthenticationResult'];
  Banner: Omit<Banner, 'assets' | 'category' | 'products' | 'type' | 'variants'> & { assets: Array<ResolversParentTypes['BannerAsset']>, category?: Maybe<ResolversParentTypes['Category']>, products?: Maybe<Array<ResolversParentTypes['Product']>>, type?: Maybe<ResolversParentTypes['BannerType']>, variants?: Maybe<Array<ResolversParentTypes['ProductVariant']>> };
  BannerAsset: Omit<BannerAsset, 'banner'> & { banner: ResolversParentTypes['Banner'] };
  BannerFilterParameter: BannerFilterParameter;
  BannerList: Omit<BannerList, 'items'> & { items: Array<ResolversParentTypes['Banner']> };
  BannerListOptions: BannerListOptions;
  BannerSortParameter: BannerSortParameter;
  BannerTranslation: BannerTranslation;
  BannerType: Omit<BannerType, 'banners'> & { banners: Array<ResolversParentTypes['Banner']> };
  BannerTypeFilterParameter: BannerTypeFilterParameter;
  BannerTypeList: Omit<BannerTypeList, 'items'> & { items: Array<ResolversParentTypes['BannerType']> };
  BannerTypeListOptions: BannerTypeListOptions;
  BannerTypeSortParameter: BannerTypeSortParameter;
  BannerTypeTranslation: BannerTypeTranslation;
  BaseResponse: BaseResponse;
  Boolean: Scalars['Boolean']['output'];
  BooleanCustomFieldConfig: BooleanCustomFieldConfig;
  BooleanListOperators: BooleanListOperators;
  BooleanOperators: BooleanOperators;
  BooleanStructFieldConfig: BooleanStructFieldConfig;
  BoughtTogetherResult: Omit<BoughtTogetherResult, 'product'> & { product: ResolversParentTypes['Product'] };
  Category: Omit<Category, 'banners' | 'categoryType' | 'children' | 'parent' | 'productsByLabel'> & { banners: Array<ResolversParentTypes['Banner']>, categoryType: ResolversParentTypes['CategoryType'], children: Array<ResolversParentTypes['Category']>, parent?: Maybe<ResolversParentTypes['Category']>, productsByLabel: Array<ResolversParentTypes['Product']> };
  CategoryFilterParameter: CategoryFilterParameter;
  CategoryList: Omit<CategoryList, 'items'> & { items: Array<ResolversParentTypes['Category']> };
  CategoryListOptions: CategoryListOptions;
  CategorySortParameter: CategorySortParameter;
  CategoryTranslation: CategoryTranslation;
  CategoryTranslationInput: CategoryTranslationInput;
  CategoryType: Omit<CategoryType, 'categories'> & { categories: Array<ResolversParentTypes['Category']> };
  CategoryTypeFilterParameter: CategoryTypeFilterParameter;
  CategoryTypeList: Omit<CategoryTypeList, 'items'> & { items: Array<ResolversParentTypes['CategoryType']> };
  CategoryTypeListOptions: CategoryTypeListOptions;
  CategoryTypeSortParameter: CategoryTypeSortParameter;
  CategoryTypeTranslation: CategoryTypeTranslation;
  CategoryTypeTranslationInput: CategoryTypeTranslationInput;
  Channel: Omit<Channel, 'customFields' | 'defaultShippingZone' | 'defaultTaxZone'> & { customFields?: Maybe<ResolversParentTypes['ChannelCustomFields']>, defaultShippingZone?: Maybe<ResolversParentTypes['Zone']>, defaultTaxZone?: Maybe<ResolversParentTypes['Zone']> };
  ChannelCustomFields: ChannelCustomFields;
  Collection: Omit<Collection, 'breadcrumbs' | 'children' | 'parent' | 'productVariants'> & { breadcrumbs: Array<ResolversParentTypes['CollectionBreadcrumb']>, children?: Maybe<Array<ResolversParentTypes['Collection']>>, parent?: Maybe<ResolversParentTypes['Collection']>, productVariants: ResolversParentTypes['ProductVariantList'] };
  CollectionBreadcrumb: CollectionBreadcrumb;
  CollectionFilterParameter: CollectionFilterParameter;
  CollectionList: Omit<CollectionList, 'items'> & { items: Array<ResolversParentTypes['Collection']> };
  CollectionListOptions: CollectionListOptions;
  CollectionResult: Omit<CollectionResult, 'collection'> & { collection: ResolversParentTypes['Collection'] };
  CollectionSortParameter: CollectionSortParameter;
  CollectionTranslation: CollectionTranslation;
  ConfigArg: ConfigArg;
  ConfigArgDefinition: ConfigArgDefinition;
  ConfigArgInput: ConfigArgInput;
  ConfigurableOperation: ConfigurableOperation;
  ConfigurableOperationDefinition: ConfigurableOperationDefinition;
  ConfigurableOperationInput: ConfigurableOperationInput;
  Coordinate: Coordinate;
  Country: Omit<Country, 'parent'> & { parent?: Maybe<ResolversParentTypes['Region']> };
  CountryList: Omit<CountryList, 'items'> & { items: Array<ResolversParentTypes['Country']> };
  CouponCodeExpiredError: CouponCodeExpiredError;
  CouponCodeInvalidError: CouponCodeInvalidError;
  CouponCodeLimitError: CouponCodeLimitError;
  CreateAddressCustomFieldsInput: CreateAddressCustomFieldsInput;
  CreateAddressInput: CreateAddressInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateCategoryTypeInput: CreateCategoryTypeInput;
  CreateCustomerCustomFieldsInput: CreateCustomerCustomFieldsInput;
  CreateCustomerInput: CreateCustomerInput;
  CreateLabelInput: CreateLabelInput;
  CurrentUser: CurrentUser;
  CurrentUserChannel: CurrentUserChannel;
  CustomField: ResolversInterfaceTypes<ResolversParentTypes>['CustomField'];
  CustomFieldConfig: ResolversUnionTypes<ResolversParentTypes>['CustomFieldConfig'];
  Customer: Omit<Customer, 'addresses' | 'orders' | 'user'> & { addresses?: Maybe<Array<ResolversParentTypes['Address']>>, orders: ResolversParentTypes['OrderList'], user?: Maybe<ResolversParentTypes['User']> };
  CustomerCustomFields: CustomerCustomFields;
  CustomerFilterParameter: CustomerFilterParameter;
  CustomerGroup: Omit<CustomerGroup, 'customers'> & { customers: ResolversParentTypes['CustomerList'] };
  CustomerList: Omit<CustomerList, 'items'> & { items: Array<ResolversParentTypes['Customer']> };
  CustomerListOptions: CustomerListOptions;
  CustomerSortParameter: CustomerSortParameter;
  DateListOperators: DateListOperators;
  DateOperators: DateOperators;
  DateRange: DateRange;
  DateTime: Scalars['DateTime']['output'];
  DateTimeCustomFieldConfig: DateTimeCustomFieldConfig;
  DateTimeStructFieldConfig: DateTimeStructFieldConfig;
  Day: Day;
  DayFilterParameter: DayFilterParameter;
  DayList: DayList;
  DayListOptions: DayListOptions;
  DaySortParameter: DaySortParameter;
  DayTranslation: DayTranslation;
  DeletionResponse: DeletionResponse;
  DeliveryCredentialGroup: DeliveryCredentialGroup;
  DeliveryMethod: DeliveryMethod;
  DeliveryMethodFilterParameter: DeliveryMethodFilterParameter;
  DeliveryMethodList: DeliveryMethodList;
  DeliveryMethodListOptions: DeliveryMethodListOptions;
  DeliveryMethodSortParameter: DeliveryMethodSortParameter;
  DeliveryMethodTranslation: DeliveryMethodTranslation;
  Discount: Discount;
  EmailAddressConflictError: EmailAddressConflictError;
  EmailAuthInput: EmailAuthInput;
  ErrorResult: ResolversInterfaceTypes<ResolversParentTypes>['ErrorResult'];
  Facet: Facet;
  FacetFilterParameter: FacetFilterParameter;
  FacetList: FacetList;
  FacetListOptions: FacetListOptions;
  FacetSortParameter: FacetSortParameter;
  FacetTranslation: FacetTranslation;
  FacetValue: FacetValue;
  FacetValueCustomFields: Omit<FacetValueCustomFields, 'categories'> & { categories?: Maybe<Array<ResolversParentTypes['Category']>> };
  FacetValueFilterInput: FacetValueFilterInput;
  FacetValueFilterParameter: FacetValueFilterParameter;
  FacetValueList: FacetValueList;
  FacetValueListOptions: FacetValueListOptions;
  FacetValueResult: FacetValueResult;
  FacetValueSortParameter: FacetValueSortParameter;
  FacetValueTranslation: FacetValueTranslation;
  FilteredProductList: Omit<FilteredProductList, 'items'> & { items: Array<ResolversParentTypes['Product']> };
  FilteredProductSortParameters: FilteredProductSortParameters;
  Float: Scalars['Float']['output'];
  FloatCustomFieldConfig: FloatCustomFieldConfig;
  FloatStructFieldConfig: FloatStructFieldConfig;
  Fulfillment: Omit<Fulfillment, 'lines' | 'summary'> & { lines: Array<ResolversParentTypes['FulfillmentLine']>, summary: Array<ResolversParentTypes['FulfillmentLine']> };
  FulfillmentLine: Omit<FulfillmentLine, 'fulfillment' | 'orderLine'> & { fulfillment: ResolversParentTypes['Fulfillment'], orderLine: ResolversParentTypes['OrderLine'] };
  GoogleAuthInput: GoogleAuthInput;
  GuestCheckoutError: GuestCheckoutError;
  HistoryEntry: HistoryEntry;
  HistoryEntryFilterParameter: HistoryEntryFilterParameter;
  HistoryEntryList: HistoryEntryList;
  HistoryEntryListOptions: HistoryEntryListOptions;
  HistoryEntrySortParameter: HistoryEntrySortParameter;
  HomePageSection: Omit<HomePageSection, 'products'> & { products: Array<ResolversParentTypes['Product']> };
  ID: Scalars['ID']['output'];
  IDListOperators: IdListOperators;
  IDOperators: IdOperators;
  IdentifierChangeTokenExpiredError: IdentifierChangeTokenExpiredError;
  IdentifierChangeTokenInvalidError: IdentifierChangeTokenInvalidError;
  IneligiblePaymentMethodError: IneligiblePaymentMethodError;
  IneligibleShippingMethodError: IneligibleShippingMethodError;
  InsufficientStockError: Omit<InsufficientStockError, 'order'> & { order: ResolversParentTypes['Order'] };
  Int: Scalars['Int']['output'];
  IntCustomFieldConfig: IntCustomFieldConfig;
  IntStructFieldConfig: IntStructFieldConfig;
  InvalidCredentialsError: InvalidCredentialsError;
  JSON: Scalars['JSON']['output'];
  Label: Label;
  LabelFilterParameter: LabelFilterParameter;
  LabelList: LabelList;
  LabelListOptions: LabelListOptions;
  LabelSortParameter: LabelSortParameter;
  LabelTranslation: LabelTranslation;
  LabelTranslationInput: LabelTranslationInput;
  Like: Omit<Like, 'productVariant'> & { productVariant: ResolversParentTypes['ProductVariant'] };
  LikeResponse: Omit<LikeResponse, 'like'> & { like?: Maybe<ResolversParentTypes['Like']> };
  LocaleStringCustomFieldConfig: LocaleStringCustomFieldConfig;
  LocaleTextCustomFieldConfig: LocaleTextCustomFieldConfig;
  LocalizedString: LocalizedString;
  MissingPasswordError: MissingPasswordError;
  Model: Model;
  ModelList: ModelList;
  Money: Scalars['Money']['output'];
  Mutation: Record<PropertyKey, never>;
  NativeAuthInput: NativeAuthInput;
  NativeAuthStrategyError: NativeAuthStrategyError;
  NativeAuthenticationResult: ResolversUnionTypes<ResolversParentTypes>['NativeAuthenticationResult'];
  NegativeQuantityError: NegativeQuantityError;
  NoActiveOrderError: NoActiveOrderError;
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  NotVerifiedError: NotVerifiedError;
  NumberListOperators: NumberListOperators;
  NumberOperators: NumberOperators;
  NumberRange: NumberRange;
  Order: Omit<Order, 'billingAddress' | 'customer' | 'fulfillments' | 'lines' | 'payments' | 'shippingAddress'> & { billingAddress?: Maybe<ResolversParentTypes['OrderAddress']>, customer?: Maybe<ResolversParentTypes['Customer']>, fulfillments?: Maybe<Array<ResolversParentTypes['Fulfillment']>>, lines: Array<ResolversParentTypes['OrderLine']>, payments?: Maybe<Array<ResolversParentTypes['Payment']>>, shippingAddress?: Maybe<ResolversParentTypes['OrderAddress']> };
  OrderAddress: OrderAddress;
  OrderCustomFields: OrderCustomFields;
  OrderFilterParameter: OrderFilterParameter;
  OrderInterceptorError: OrderInterceptorError;
  OrderLimitError: OrderLimitError;
  OrderLine: Omit<OrderLine, 'fulfillmentLines' | 'order' | 'productVariant'> & { fulfillmentLines?: Maybe<Array<ResolversParentTypes['FulfillmentLine']>>, order: ResolversParentTypes['Order'], productVariant: ResolversParentTypes['ProductVariant'] };
  OrderList: Omit<OrderList, 'items'> & { items: Array<ResolversParentTypes['Order']> };
  OrderListOptions: OrderListOptions;
  OrderModificationError: OrderModificationError;
  OrderPaymentStateError: OrderPaymentStateError;
  OrderSortParameter: OrderSortParameter;
  OrderStateTransitionError: OrderStateTransitionError;
  OrderTaxSummary: OrderTaxSummary;
  PaginatedList: ResolversInterfaceTypes<ResolversParentTypes>['PaginatedList'];
  PasswordAlreadySetError: PasswordAlreadySetError;
  PasswordResetTokenExpiredError: PasswordResetTokenExpiredError;
  PasswordResetTokenInvalidError: PasswordResetTokenInvalidError;
  PasswordValidationError: PasswordValidationError;
  Payment: Omit<Payment, 'refunds'> & { refunds: Array<ResolversParentTypes['Refund']> };
  PaymentDeclinedError: PaymentDeclinedError;
  PaymentFailedError: PaymentFailedError;
  PaymentInput: PaymentInput;
  PaymentMethod: PaymentMethod;
  PaymentMethodQuote: PaymentMethodQuote;
  PaymentMethodTranslation: PaymentMethodTranslation;
  PhoneAuthInput: PhoneAuthInput;
  PriceRange: PriceRange;
  Product: Omit<Product, 'categories' | 'category' | 'collections' | 'sale' | 'variantList' | 'variants'> & { categories: Array<ResolversParentTypes['Category']>, category?: Maybe<ResolversParentTypes['Category']>, collections: Array<ResolversParentTypes['Collection']>, sale?: Maybe<ResolversParentTypes['SaleInfo']>, variantList: ResolversParentTypes['ProductVariantList'], variants: Array<ResolversParentTypes['ProductVariant']> };
  ProductCustomFields: Omit<ProductCustomFields, 'categories'> & { categories?: Maybe<Array<ResolversParentTypes['Category']>> };
  ProductFilterParameter: ProductFilterParameter;
  ProductList: Omit<ProductList, 'items'> & { items: Array<ResolversParentTypes['Product']> };
  ProductListOptions: ProductListOptions;
  ProductOption: ProductOption;
  ProductOptionGroup: ProductOptionGroup;
  ProductOptionGroupTranslation: ProductOptionGroupTranslation;
  ProductOptionTranslation: ProductOptionTranslation;
  ProductSortParameter: ProductSortParameter;
  ProductTranslation: ProductTranslation;
  ProductVariant: Omit<ProductVariant, 'product' | 'sale' | 'taxRateApplied'> & { product: ResolversParentTypes['Product'], sale?: Maybe<ResolversParentTypes['SaleInfo']>, taxRateApplied: ResolversParentTypes['TaxRate'] };
  ProductVariantFilterParameter: ProductVariantFilterParameter;
  ProductVariantList: Omit<ProductVariantList, 'items'> & { items: Array<ResolversParentTypes['ProductVariant']> };
  ProductVariantListOptions: ProductVariantListOptions;
  ProductVariantSortParameter: ProductVariantSortParameter;
  ProductVariantTranslation: ProductVariantTranslation;
  Promotion: Promotion;
  PromotionCustomFields: PromotionCustomFields;
  PromotionList: PromotionList;
  PromotionTranslation: PromotionTranslation;
  Province: Omit<Province, 'parent'> & { parent?: Maybe<ResolversParentTypes['Region']> };
  ProvinceList: Omit<ProvinceList, 'items'> & { items: Array<ResolversParentTypes['Province']> };
  PublicPaymentMethod: PublicPaymentMethod;
  PublicShippingMethod: PublicShippingMethod;
  Query: Record<PropertyKey, never>;
  RefreshCustomerVerificationResult: ResolversUnionTypes<ResolversParentTypes>['RefreshCustomerVerificationResult'];
  RefreshTokenResponse: RefreshTokenResponse;
  Refund: Omit<Refund, 'lines'> & { lines: Array<ResolversParentTypes['RefundLine']> };
  RefundLine: Omit<RefundLine, 'orderLine' | 'refund'> & { orderLine: ResolversParentTypes['OrderLine'], refund: ResolversParentTypes['Refund'] };
  Region: ResolversInterfaceTypes<ResolversParentTypes>['Region'];
  RegionTranslation: RegionTranslation;
  RegisterCustomerAccountResult: ResolversUnionTypes<ResolversParentTypes>['RegisterCustomerAccountResult'];
  RegisterCustomerCustomFieldsInput: RegisterCustomerCustomFieldsInput;
  RegisterCustomerInput: RegisterCustomerInput;
  RelationCustomFieldConfig: RelationCustomFieldConfig;
  RemoveOrderItemsResult: ResolversUnionTypes<ResolversParentTypes>['RemoveOrderItemsResult'];
  RequestPasswordResetResult: ResolversUnionTypes<ResolversParentTypes>['RequestPasswordResetResult'];
  RequestUpdateCustomerEmailAddressResult: ResolversUnionTypes<ResolversParentTypes>['RequestUpdateCustomerEmailAddressResult'];
  ResetPasswordResult: ResolversUnionTypes<ResolversParentTypes>['ResetPasswordResult'];
  Role: Omit<Role, 'channels'> & { channels: Array<ResolversParentTypes['Channel']> };
  RoleList: Omit<RoleList, 'items'> & { items: Array<ResolversParentTypes['Role']> };
  SaleInfo: SaleInfo;
  SearchInput: SearchInput;
  SearchReindexResponse: SearchReindexResponse;
  SearchResponse: Omit<SearchResponse, 'collections' | 'items'> & { collections: Array<ResolversParentTypes['CollectionResult']>, items: Array<ResolversParentTypes['SearchResult']> };
  SearchResult: Omit<SearchResult, 'categories' | 'category' | 'price' | 'priceWithTax'> & { categories: Array<ResolversParentTypes['Category']>, category?: Maybe<ResolversParentTypes['Category']>, price: ResolversParentTypes['SearchResultPrice'], priceWithTax: ResolversParentTypes['SearchResultPrice'] };
  SearchResultAsset: SearchResultAsset;
  SearchResultPrice: ResolversUnionTypes<ResolversParentTypes>['SearchResultPrice'];
  SearchResultSortParameter: SearchResultSortParameter;
  Season: Omit<Season, 'products'> & { products: ResolversParentTypes['ProductList'] };
  SeasonTranslation: SeasonTranslation;
  Seller: Seller;
  SetCustomerForOrderResult: ResolversUnionTypes<ResolversParentTypes>['SetCustomerForOrderResult'];
  SetOrderShippingMethodResult: ResolversUnionTypes<ResolversParentTypes>['SetOrderShippingMethodResult'];
  ShippingLine: ShippingLine;
  ShippingMethod: ShippingMethod;
  ShippingMethodList: ShippingMethodList;
  ShippingMethodQuote: ShippingMethodQuote;
  ShippingMethodTranslation: ShippingMethodTranslation;
  ShopFilteredProductFilterParameters: ShopFilteredProductFilterParameters;
  ShopFilteredProductListOptions: ShopFilteredProductListOptions;
  SinglePrice: SinglePrice;
  String: Scalars['String']['output'];
  StringCustomFieldConfig: StringCustomFieldConfig;
  StringFieldOption: StringFieldOption;
  StringListOperators: StringListOperators;
  StringOperators: StringOperators;
  StringStructFieldConfig: StringStructFieldConfig;
  StructCustomFieldConfig: Omit<StructCustomFieldConfig, 'fields'> & { fields: Array<ResolversParentTypes['StructFieldConfig']> };
  StructField: ResolversInterfaceTypes<ResolversParentTypes>['StructField'];
  StructFieldConfig: ResolversUnionTypes<ResolversParentTypes>['StructFieldConfig'];
  Success: Success;
  Surcharge: Surcharge;
  Tag: Tag;
  TagList: TagList;
  TaxCategory: TaxCategory;
  TaxLine: TaxLine;
  TaxRate: Omit<TaxRate, 'customerGroup' | 'zone'> & { customerGroup?: Maybe<ResolversParentTypes['CustomerGroup']>, zone: ResolversParentTypes['Zone'] };
  TaxRateList: Omit<TaxRateList, 'items'> & { items: Array<ResolversParentTypes['TaxRate']> };
  TextCustomFieldConfig: TextCustomFieldConfig;
  TextStructFieldConfig: TextStructFieldConfig;
  TrackClickSuccess: TrackClickSuccess;
  TransitionOrderToStateResult: ResolversUnionTypes<ResolversParentTypes>['TransitionOrderToStateResult'];
  UpdateAddressCustomFieldsInput: UpdateAddressCustomFieldsInput;
  UpdateAddressInput: UpdateAddressInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateCategoryTypeInput: UpdateCategoryTypeInput;
  UpdateCustomerCustomFieldsInput: UpdateCustomerCustomFieldsInput;
  UpdateCustomerEmailAddressResult: ResolversUnionTypes<ResolversParentTypes>['UpdateCustomerEmailAddressResult'];
  UpdateCustomerInput: UpdateCustomerInput;
  UpdateCustomerPasswordResult: ResolversUnionTypes<ResolversParentTypes>['UpdateCustomerPasswordResult'];
  UpdateLabelInput: UpdateLabelInput;
  UpdateMultipleOrderItemsResult: Omit<UpdateMultipleOrderItemsResult, 'errorResults' | 'order'> & { errorResults: Array<ResolversParentTypes['UpdateOrderItemErrorResult']>, order: ResolversParentTypes['Order'] };
  UpdateOrderCustomFieldsInput: UpdateOrderCustomFieldsInput;
  UpdateOrderInput: UpdateOrderInput;
  UpdateOrderItemErrorResult: ResolversUnionTypes<ResolversParentTypes>['UpdateOrderItemErrorResult'];
  UpdateOrderItemsResult: ResolversUnionTypes<ResolversParentTypes>['UpdateOrderItemsResult'];
  Upload: Scalars['Upload']['output'];
  User: Omit<User, 'authenticationMethods' | 'roles'> & { authenticationMethods: Array<ResolversParentTypes['AuthenticationMethod']>, roles: Array<ResolversParentTypes['Role']> };
  VerificationTokenExpiredError: VerificationTokenExpiredError;
  VerificationTokenInvalidError: VerificationTokenInvalidError;
  VerifyCustomerAccountResult: ResolversUnionTypes<ResolversParentTypes>['VerifyCustomerAccountResult'];
  Worker: Worker;
  Zone: Omit<Zone, 'members'> & { members: Array<ResolversParentTypes['Region']> };
};

export type ActiveOrderResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActiveOrderResult'] = ResolversParentTypes['ActiveOrderResult']> = {
  __resolveType: TypeResolveFn<'NoActiveOrderError' | 'Order', ParentType, ContextType>;
};

export type AddPaymentToOrderResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddPaymentToOrderResult'] = ResolversParentTypes['AddPaymentToOrderResult']> = {
  __resolveType: TypeResolveFn<'IneligiblePaymentMethodError' | 'NoActiveOrderError' | 'Order' | 'OrderPaymentStateError' | 'OrderStateTransitionError' | 'PaymentDeclinedError' | 'PaymentFailedError', ParentType, ContextType>;
};

export type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<ResolversTypes['Country'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['AddressCustomFields']>, ParentType, ContextType>;
  defaultBillingAddress?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  defaultShippingAddress?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  fullName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postalCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  province?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  streetLine1?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  streetLine2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AddressCustomFieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddressCustomFields'] = ResolversParentTypes['AddressCustomFields']> = {
  building?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  floor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  homeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  house?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  latitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  longitude?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type AdjustmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Adjustment'] = ResolversParentTypes['Adjustment']> = {
  adjustmentSource?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['AdjustmentType'], ParentType, ContextType>;
};

export type AggregatedMetadataResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregatedMetadata'] = ResolversParentTypes['AggregatedMetadata']> = {
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  models?: Resolver<Array<ResolversTypes['FacetValue']>, ParentType, ContextType>;
};

export type AlreadyLoggedInErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['AlreadyLoggedInError'] = ResolversParentTypes['AlreadyLoggedInError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApplyCouponCodeResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ApplyCouponCodeResult'] = ResolversParentTypes['ApplyCouponCodeResult']> = {
  __resolveType: TypeResolveFn<'CouponCodeExpiredError' | 'CouponCodeInvalidError' | 'CouponCodeLimitError' | 'Order', ParentType, ContextType>;
};

export type AssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Asset'] = ResolversParentTypes['Asset']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  fileSize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  focalPoint?: Resolver<Maybe<ResolversTypes['Coordinate']>, ParentType, ContextType>;
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  mimeType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  preview?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  source?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['AssetTranslation']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['AssetType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssetListResolvers<ContextType = any, ParentType extends ResolversParentTypes['AssetList'] = ResolversParentTypes['AssetList']> = {
  items?: Resolver<Array<ResolversTypes['Asset']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssetTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['AssetTranslation'] = ResolversParentTypes['AssetTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type AuthDeletionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthDeletionResponse'] = ResolversParentTypes['AuthDeletionResponse']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<ResolversTypes['AuthDeletionResult'], ParentType, ContextType>;
};

export type AuthenticationMethodResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthenticationMethod'] = ResolversParentTypes['AuthenticationMethod']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  strategy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthenticationResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthenticationResult'] = ResolversParentTypes['AuthenticationResult']> = {
  __resolveType: TypeResolveFn<'CurrentUser' | 'InvalidCredentialsError' | 'NotVerifiedError', ParentType, ContextType>;
};

export type BannerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Banner'] = ResolversParentTypes['Banner']> = {
  asset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  assets?: Resolver<Array<ResolversTypes['BannerAsset']>, ParentType, ContextType>;
  backColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  btnColor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  counter?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  link?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  model?: Resolver<Maybe<ResolversTypes['FacetValue']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  products?: Resolver<Maybe<Array<ResolversTypes['Product']>>, ParentType, ContextType>;
  redirect?: Resolver<ResolversTypes['RedirectTypes'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sort?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['BannerTranslation']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['BannerType']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  variants?: Resolver<Maybe<Array<ResolversTypes['ProductVariant']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BannerAssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['BannerAsset'] = ResolversParentTypes['BannerAsset']> = {
  asset?: Resolver<ResolversTypes['Asset'], ParentType, ContextType>;
  banner?: Resolver<ResolversTypes['Banner'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BannerListResolvers<ContextType = any, ParentType extends ResolversParentTypes['BannerList'] = ResolversParentTypes['BannerList']> = {
  items?: Resolver<Array<ResolversTypes['Banner']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BannerTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['BannerTranslation'] = ResolversParentTypes['BannerTranslation']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type BannerTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BannerType'] = ResolversParentTypes['BannerType']> = {
  banners?: Resolver<Array<ResolversTypes['Banner']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sort?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['BannerTypeTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BannerTypeListResolvers<ContextType = any, ParentType extends ResolversParentTypes['BannerTypeList'] = ResolversParentTypes['BannerTypeList']> = {
  items?: Resolver<Array<ResolversTypes['BannerType']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BannerTypeTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['BannerTypeTranslation'] = ResolversParentTypes['BannerTypeTranslation']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type BaseResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['BaseResponse'] = ResolversParentTypes['BaseResponse']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type BooleanCustomFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['BooleanCustomFieldConfig'] = ResolversParentTypes['BooleanCustomFieldConfig']> = {
  deprecated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  deprecationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  internal?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nullable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  readonly?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  requiresPermission?: Resolver<Maybe<Array<ResolversTypes['Permission']>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BooleanStructFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['BooleanStructFieldConfig'] = ResolversParentTypes['BooleanStructFieldConfig']> = {
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BoughtTogetherResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['BoughtTogetherResult'] = ResolversParentTypes['BoughtTogetherResult']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  banners?: Resolver<Array<ResolversTypes['Banner']>, ParentType, ContextType>;
  categoryType?: Resolver<ResolversTypes['CategoryType'], ParentType, ContextType>;
  children?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  featuredAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  iconAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  models?: Resolver<Array<ResolversTypes['FacetValue']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  productsByLabel?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<CategoryProductsByLabelArgs, 'labelId'>>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sort?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['CategoryTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryListResolvers<ContextType = any, ParentType extends ResolversParentTypes['CategoryList'] = ResolversParentTypes['CategoryList']> = {
  items?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['CategoryTranslation'] = ResolversParentTypes['CategoryTranslation']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type CategoryTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CategoryType'] = ResolversParentTypes['CategoryType']> = {
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  iconAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sort?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['CategoryTypeTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryTypeListResolvers<ContextType = any, ParentType extends ResolversParentTypes['CategoryTypeList'] = ResolversParentTypes['CategoryTypeList']> = {
  items?: Resolver<Array<ResolversTypes['CategoryType']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryTypeTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['CategoryTypeTranslation'] = ResolversParentTypes['CategoryTypeTranslation']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ChannelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Channel'] = ResolversParentTypes['Channel']> = {
  availableCurrencyCodes?: Resolver<Array<ResolversTypes['CurrencyCode']>, ParentType, ContextType>;
  availableLanguageCodes?: Resolver<Maybe<Array<ResolversTypes['LanguageCode']>>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currencyCode?: Resolver<ResolversTypes['CurrencyCode'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['ChannelCustomFields']>, ParentType, ContextType>;
  defaultCurrencyCode?: Resolver<ResolversTypes['CurrencyCode'], ParentType, ContextType>;
  defaultLanguageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  defaultShippingZone?: Resolver<Maybe<ResolversTypes['Zone']>, ParentType, ContextType>;
  defaultTaxZone?: Resolver<Maybe<ResolversTypes['Zone']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  outOfStockThreshold?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pricesIncludeTax?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  seller?: Resolver<Maybe<ResolversTypes['Seller']>, ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trackInventory?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChannelCustomFieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChannelCustomFields'] = ResolversParentTypes['ChannelCustomFields']> = {
  dayLimit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type CollectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = {
  assets?: Resolver<Array<ResolversTypes['Asset']>, ParentType, ContextType>;
  breadcrumbs?: Resolver<Array<ResolversTypes['CollectionBreadcrumb']>, ParentType, ContextType>;
  children?: Resolver<Maybe<Array<ResolversTypes['Collection']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  featuredAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  filters?: Resolver<Array<ResolversTypes['ConfigurableOperation']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<Maybe<ResolversTypes['LanguageCode']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Collection']>, ParentType, ContextType>;
  parentId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  productVariantCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  productVariants?: Resolver<ResolversTypes['ProductVariantList'], ParentType, ContextType, Partial<CollectionProductVariantsArgs>>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['CollectionTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionBreadcrumbResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionBreadcrumb'] = ResolversParentTypes['CollectionBreadcrumb']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type CollectionListResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionList'] = ResolversParentTypes['CollectionList']> = {
  items?: Resolver<Array<ResolversTypes['Collection']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionResult'] = ResolversParentTypes['CollectionResult']> = {
  collection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type CollectionTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['CollectionTranslation'] = ResolversParentTypes['CollectionTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type ConfigArgResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConfigArg'] = ResolversParentTypes['ConfigArg']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ConfigArgDefinitionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConfigArgDefinition'] = ResolversParentTypes['ConfigArgDefinition']> = {
  defaultValue?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  required?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
};

export type ConfigurableOperationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConfigurableOperation'] = ResolversParentTypes['ConfigurableOperation']> = {
  args?: Resolver<Array<ResolversTypes['ConfigArg']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ConfigurableOperationDefinitionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ConfigurableOperationDefinition'] = ResolversParentTypes['ConfigurableOperationDefinition']> = {
  args?: Resolver<Array<ResolversTypes['ConfigArgDefinition']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type CoordinateResolvers<ContextType = any, ParentType extends ResolversParentTypes['Coordinate'] = ResolversParentTypes['Coordinate']> = {
  x?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  y?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type CountryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Country'] = ResolversParentTypes['Country']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Region']>, ParentType, ContextType>;
  parentId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['RegionTranslation']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CountryListResolvers<ContextType = any, ParentType extends ResolversParentTypes['CountryList'] = ResolversParentTypes['CountryList']> = {
  items?: Resolver<Array<ResolversTypes['Country']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CouponCodeExpiredErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['CouponCodeExpiredError'] = ResolversParentTypes['CouponCodeExpiredError']> = {
  couponCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CouponCodeInvalidErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['CouponCodeInvalidError'] = ResolversParentTypes['CouponCodeInvalidError']> = {
  couponCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CouponCodeLimitErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['CouponCodeLimitError'] = ResolversParentTypes['CouponCodeLimitError']> = {
  couponCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  limit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CurrentUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurrentUser'] = ResolversParentTypes['CurrentUser']> = {
  accessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  channels?: Resolver<Array<ResolversTypes['CurrentUserChannel']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CurrentUserChannelResolvers<ContextType = any, ParentType extends ResolversParentTypes['CurrentUserChannel'] = ResolversParentTypes['CurrentUserChannel']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type CustomFieldResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomField'] = ResolversParentTypes['CustomField']> = {
  __resolveType: TypeResolveFn<'BooleanCustomFieldConfig' | 'DateTimeCustomFieldConfig' | 'FloatCustomFieldConfig' | 'IntCustomFieldConfig' | 'LocaleStringCustomFieldConfig' | 'LocaleTextCustomFieldConfig' | 'RelationCustomFieldConfig' | 'StringCustomFieldConfig' | 'StructCustomFieldConfig' | 'TextCustomFieldConfig', ParentType, ContextType>;
};

export type CustomFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomFieldConfig'] = ResolversParentTypes['CustomFieldConfig']> = {
  __resolveType: TypeResolveFn<'BooleanCustomFieldConfig' | 'DateTimeCustomFieldConfig' | 'FloatCustomFieldConfig' | 'IntCustomFieldConfig' | 'LocaleStringCustomFieldConfig' | 'LocaleTextCustomFieldConfig' | 'RelationCustomFieldConfig' | 'StringCustomFieldConfig' | 'StructCustomFieldConfig' | 'TextCustomFieldConfig', ParentType, ContextType>;
};

export type CustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = {
  addresses?: Resolver<Maybe<Array<ResolversTypes['Address']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['CustomerCustomFields']>, ParentType, ContextType>;
  emailAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orders?: Resolver<ResolversTypes['OrderList'], ParentType, ContextType, Partial<CustomerOrdersArgs>>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomerCustomFieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerCustomFields'] = ResolversParentTypes['CustomerCustomFields']> = {
  birthDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gender?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  region?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type CustomerGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerGroup'] = ResolversParentTypes['CustomerGroup']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  customers?: Resolver<ResolversTypes['CustomerList'], ParentType, ContextType, Partial<CustomerGroupCustomersArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomerListResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerList'] = ResolversParentTypes['CustomerList']> = {
  items?: Resolver<Array<ResolversTypes['Customer']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DateTimeCustomFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['DateTimeCustomFieldConfig'] = ResolversParentTypes['DateTimeCustomFieldConfig']> = {
  deprecated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  deprecationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  internal?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nullable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  readonly?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  requiresPermission?: Resolver<Maybe<Array<ResolversTypes['Permission']>>, ParentType, ContextType>;
  step?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DateTimeStructFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['DateTimeStructFieldConfig'] = ResolversParentTypes['DateTimeStructFieldConfig']> = {
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  step?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DayResolvers<ContextType = any, ParentType extends ResolversParentTypes['Day'] = ResolversParentTypes['Day']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dayOffset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  deliveryMethods?: Resolver<Array<ResolversTypes['DeliveryMethod']>, ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sort?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['DayTranslation']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DayType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DayListResolvers<ContextType = any, ParentType extends ResolversParentTypes['DayList'] = ResolversParentTypes['DayList']> = {
  items?: Resolver<Array<ResolversTypes['Day']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DayTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['DayTranslation'] = ResolversParentTypes['DayTranslation']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type DeletionResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeletionResponse'] = ResolversParentTypes['DeletionResponse']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<ResolversTypes['DeletionResult'], ParentType, ContextType>;
};

export type DeliveryCredentialGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeliveryCredentialGroup'] = ResolversParentTypes['DeliveryCredentialGroup']> = {
  data?: Resolver<Array<ResolversTypes['DeliveryMethod']>, ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  day?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type DeliveryMethodResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeliveryMethod'] = ResolversParentTypes['DeliveryMethod']> = {
  closeTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  days?: Resolver<Array<ResolversTypes['Day']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  from?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDisabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  limitPrice?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  maxCost?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  minCost?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  showTime?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  sort?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['DeliveryMethodTranslation']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DeliveryMethodType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryMethodListResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeliveryMethodList'] = ResolversParentTypes['DeliveryMethodList']> = {
  items?: Resolver<Array<ResolversTypes['DeliveryMethod']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeliveryMethodTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeliveryMethodTranslation'] = ResolversParentTypes['DeliveryMethodTranslation']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type DiscountResolvers<ContextType = any, ParentType extends ResolversParentTypes['Discount'] = ResolversParentTypes['Discount']> = {
  adjustmentSource?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  amountWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['AdjustmentType'], ParentType, ContextType>;
};

export type EmailAddressConflictErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmailAddressConflictError'] = ResolversParentTypes['EmailAddressConflictError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ErrorResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ErrorResult'] = ResolversParentTypes['ErrorResult']> = {
  __resolveType: TypeResolveFn<'AlreadyLoggedInError' | 'CouponCodeExpiredError' | 'CouponCodeInvalidError' | 'CouponCodeLimitError' | 'EmailAddressConflictError' | 'GuestCheckoutError' | 'IdentifierChangeTokenExpiredError' | 'IdentifierChangeTokenInvalidError' | 'IneligiblePaymentMethodError' | 'IneligibleShippingMethodError' | 'InsufficientStockError' | 'InvalidCredentialsError' | 'MissingPasswordError' | 'NativeAuthStrategyError' | 'NegativeQuantityError' | 'NoActiveOrderError' | 'NotVerifiedError' | 'OrderInterceptorError' | 'OrderLimitError' | 'OrderModificationError' | 'OrderPaymentStateError' | 'OrderStateTransitionError' | 'PasswordAlreadySetError' | 'PasswordResetTokenExpiredError' | 'PasswordResetTokenInvalidError' | 'PasswordValidationError' | 'PaymentDeclinedError' | 'PaymentFailedError' | 'VerificationTokenExpiredError' | 'VerificationTokenInvalidError', ParentType, ContextType>;
};

export type FacetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Facet'] = ResolversParentTypes['Facet']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['FacetTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  valueList?: Resolver<ResolversTypes['FacetValueList'], ParentType, ContextType, Partial<FacetValueListArgs>>;
  values?: Resolver<Array<ResolversTypes['FacetValue']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FacetListResolvers<ContextType = any, ParentType extends ResolversParentTypes['FacetList'] = ResolversParentTypes['FacetList']> = {
  items?: Resolver<Array<ResolversTypes['Facet']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FacetTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['FacetTranslation'] = ResolversParentTypes['FacetTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type FacetValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['FacetValue'] = ResolversParentTypes['FacetValue']> = {
  categoryIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['FacetValueCustomFields']>, ParentType, ContextType>;
  facet?: Resolver<ResolversTypes['Facet'], ParentType, ContextType>;
  facetId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['FacetValueTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FacetValueCustomFieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['FacetValueCustomFields'] = ResolversParentTypes['FacetValueCustomFields']> = {
  categories?: Resolver<Maybe<Array<ResolversTypes['Category']>>, ParentType, ContextType>;
};

export type FacetValueListResolvers<ContextType = any, ParentType extends ResolversParentTypes['FacetValueList'] = ResolversParentTypes['FacetValueList']> = {
  items?: Resolver<Array<ResolversTypes['FacetValue']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FacetValueResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['FacetValueResult'] = ResolversParentTypes['FacetValueResult']> = {
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  facetValue?: Resolver<ResolversTypes['FacetValue'], ParentType, ContextType>;
};

export type FacetValueTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['FacetValueTranslation'] = ResolversParentTypes['FacetValueTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type FilteredProductListResolvers<ContextType = any, ParentType extends ResolversParentTypes['FilteredProductList'] = ResolversParentTypes['FilteredProductList']> = {
  items?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type FloatCustomFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['FloatCustomFieldConfig'] = ResolversParentTypes['FloatCustomFieldConfig']> = {
  deprecated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  deprecationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  internal?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nullable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  readonly?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  requiresPermission?: Resolver<Maybe<Array<ResolversTypes['Permission']>>, ParentType, ContextType>;
  step?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FloatStructFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['FloatStructFieldConfig'] = ResolversParentTypes['FloatStructFieldConfig']> = {
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  step?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FulfillmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Fulfillment'] = ResolversParentTypes['Fulfillment']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lines?: Resolver<Array<ResolversTypes['FulfillmentLine']>, ParentType, ContextType>;
  method?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<Array<ResolversTypes['FulfillmentLine']>, ParentType, ContextType>;
  trackingCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FulfillmentLineResolvers<ContextType = any, ParentType extends ResolversParentTypes['FulfillmentLine'] = ResolversParentTypes['FulfillmentLine']> = {
  fulfillment?: Resolver<ResolversTypes['Fulfillment'], ParentType, ContextType>;
  fulfillmentId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderLine?: Resolver<ResolversTypes['OrderLine'], ParentType, ContextType>;
  orderLineId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type GuestCheckoutErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuestCheckoutError'] = ResolversParentTypes['GuestCheckoutError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  errorDetail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HistoryEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['HistoryEntry'] = ResolversParentTypes['HistoryEntry']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  data?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['HistoryEntryType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HistoryEntryListResolvers<ContextType = any, ParentType extends ResolversParentTypes['HistoryEntryList'] = ResolversParentTypes['HistoryEntryList']> = {
  items?: Resolver<Array<ResolversTypes['HistoryEntry']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HomePageSectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['HomePageSection'] = ResolversParentTypes['HomePageSection']> = {
  allBtn?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type IdentifierChangeTokenExpiredErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['IdentifierChangeTokenExpiredError'] = ResolversParentTypes['IdentifierChangeTokenExpiredError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdentifierChangeTokenInvalidErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['IdentifierChangeTokenInvalidError'] = ResolversParentTypes['IdentifierChangeTokenInvalidError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IneligiblePaymentMethodErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['IneligiblePaymentMethodError'] = ResolversParentTypes['IneligiblePaymentMethodError']> = {
  eligibilityCheckerMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IneligibleShippingMethodErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['IneligibleShippingMethodError'] = ResolversParentTypes['IneligibleShippingMethodError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InsufficientStockErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['InsufficientStockError'] = ResolversParentTypes['InsufficientStockError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Order'], ParentType, ContextType>;
  quantityAvailable?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IntCustomFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['IntCustomFieldConfig'] = ResolversParentTypes['IntCustomFieldConfig']> = {
  deprecated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  deprecationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  internal?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nullable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  readonly?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  requiresPermission?: Resolver<Maybe<Array<ResolversTypes['Permission']>>, ParentType, ContextType>;
  step?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IntStructFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['IntStructFieldConfig'] = ResolversParentTypes['IntStructFieldConfig']> = {
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  step?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvalidCredentialsErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvalidCredentialsError'] = ResolversParentTypes['InvalidCredentialsError']> = {
  authenticationError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LabelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Label'] = ResolversParentTypes['Label']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  color?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  featuredAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sort?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['LabelTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabelListResolvers<ContextType = any, ParentType extends ResolversParentTypes['LabelList'] = ResolversParentTypes['LabelList']> = {
  items?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LabelTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['LabelTranslation'] = ResolversParentTypes['LabelTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type LikeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Like'] = ResolversParentTypes['Like']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isLike?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  productVariant?: Resolver<ResolversTypes['ProductVariant'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type LikeResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LikeResponse'] = ResolversParentTypes['LikeResponse']> = {
  like?: Resolver<Maybe<ResolversTypes['Like']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type LocaleStringCustomFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocaleStringCustomFieldConfig'] = ResolversParentTypes['LocaleStringCustomFieldConfig']> = {
  deprecated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  deprecationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  internal?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  length?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nullable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  pattern?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  readonly?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  requiresPermission?: Resolver<Maybe<Array<ResolversTypes['Permission']>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocaleTextCustomFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocaleTextCustomFieldConfig'] = ResolversParentTypes['LocaleTextCustomFieldConfig']> = {
  deprecated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  deprecationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  internal?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nullable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  readonly?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  requiresPermission?: Resolver<Maybe<Array<ResolversTypes['Permission']>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocalizedStringResolvers<ContextType = any, ParentType extends ResolversParentTypes['LocalizedString'] = ResolversParentTypes['LocalizedString']> = {
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MissingPasswordErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['MissingPasswordError'] = ResolversParentTypes['MissingPasswordError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModelResolvers<ContextType = any, ParentType extends ResolversParentTypes['Model'] = ResolversParentTypes['Model']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ModelListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModelList'] = ResolversParentTypes['ModelList']> = {
  items?: Resolver<Array<ResolversTypes['Model']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export interface MoneyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Money'], any> {
  name: 'Money';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addItemToOrder?: Resolver<ResolversTypes['UpdateOrderItemsResult'], ParentType, ContextType, RequireFields<MutationAddItemToOrderArgs, 'productVariantId' | 'quantity'>>;
  addItemsToOrder?: Resolver<ResolversTypes['UpdateMultipleOrderItemsResult'], ParentType, ContextType, RequireFields<MutationAddItemsToOrderArgs, 'inputs'>>;
  addPaymentToOrder?: Resolver<ResolversTypes['AddPaymentToOrderResult'], ParentType, ContextType, RequireFields<MutationAddPaymentToOrderArgs, 'input'>>;
  adjustOrderLine?: Resolver<ResolversTypes['UpdateOrderItemsResult'], ParentType, ContextType, RequireFields<MutationAdjustOrderLineArgs, 'orderLineId' | 'quantity'>>;
  applyCouponCode?: Resolver<ResolversTypes['ApplyCouponCodeResult'], ParentType, ContextType, RequireFields<MutationApplyCouponCodeArgs, 'couponCode'>>;
  applyDeliveryMethod?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationApplyDeliveryMethodArgs, 'deliveryMethodId' | 'orderId'>>;
  authenticate?: Resolver<ResolversTypes['AuthenticationResult'], ParentType, ContextType, RequireFields<MutationAuthenticateArgs, 'input'>>;
  createCustomerAddress?: Resolver<ResolversTypes['Address'], ParentType, ContextType, RequireFields<MutationCreateCustomerAddressArgs, 'input'>>;
  deleteCustomerAccount?: Resolver<ResolversTypes['AuthDeletionResponse'], ParentType, ContextType>;
  deleteCustomerAddress?: Resolver<ResolversTypes['Success'], ParentType, ContextType, RequireFields<MutationDeleteCustomerAddressArgs, 'id'>>;
  likeProductVariant?: Resolver<ResolversTypes['LikeResponse'], ParentType, ContextType, RequireFields<MutationLikeProductVariantArgs, 'productVariantId'>>;
  login?: Resolver<ResolversTypes['NativeAuthenticationResult'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'username'>>;
  logout?: Resolver<ResolversTypes['Success'], ParentType, ContextType>;
  refreshCustomerVerification?: Resolver<ResolversTypes['RefreshCustomerVerificationResult'], ParentType, ContextType, RequireFields<MutationRefreshCustomerVerificationArgs, 'emailAddress'>>;
  registerCustomerAccount?: Resolver<ResolversTypes['RegisterCustomerAccountResult'], ParentType, ContextType, RequireFields<MutationRegisterCustomerAccountArgs, 'input'>>;
  removeAllOrderLines?: Resolver<ResolversTypes['RemoveOrderItemsResult'], ParentType, ContextType>;
  removeCouponCode?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationRemoveCouponCodeArgs, 'couponCode'>>;
  removeOrderLine?: Resolver<ResolversTypes['RemoveOrderItemsResult'], ParentType, ContextType, RequireFields<MutationRemoveOrderLineArgs, 'orderLineId'>>;
  requestPasswordReset?: Resolver<Maybe<ResolversTypes['RequestPasswordResetResult']>, ParentType, ContextType, RequireFields<MutationRequestPasswordResetArgs, 'emailAddress'>>;
  requestUpdateCustomerEmailAddress?: Resolver<ResolversTypes['RequestUpdateCustomerEmailAddressResult'], ParentType, ContextType, RequireFields<MutationRequestUpdateCustomerEmailAddressArgs, 'newEmailAddress' | 'password'>>;
  resetPassword?: Resolver<ResolversTypes['ResetPasswordResult'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'password' | 'token'>>;
  setCurrencyCodeForOrder?: Resolver<ResolversTypes['UpdateOrderItemsResult'], ParentType, ContextType, RequireFields<MutationSetCurrencyCodeForOrderArgs, 'currencyCode'>>;
  setCustomerForOrder?: Resolver<ResolversTypes['SetCustomerForOrderResult'], ParentType, ContextType, RequireFields<MutationSetCustomerForOrderArgs, 'input'>>;
  setOrderBillingAddress?: Resolver<ResolversTypes['ActiveOrderResult'], ParentType, ContextType, RequireFields<MutationSetOrderBillingAddressArgs, 'input'>>;
  setOrderCustomFields?: Resolver<ResolversTypes['ActiveOrderResult'], ParentType, ContextType, RequireFields<MutationSetOrderCustomFieldsArgs, 'input'>>;
  setOrderShippingAddress?: Resolver<ResolversTypes['ActiveOrderResult'], ParentType, ContextType, RequireFields<MutationSetOrderShippingAddressArgs, 'input'>>;
  setOrderShippingMethod?: Resolver<ResolversTypes['SetOrderShippingMethodResult'], ParentType, ContextType, RequireFields<MutationSetOrderShippingMethodArgs, 'shippingMethodId'>>;
  trackBannerClick?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationTrackBannerClickArgs, 'id'>>;
  trackProductClick?: Resolver<ResolversTypes['TrackClickSuccess'], ParentType, ContextType, RequireFields<MutationTrackProductClickArgs, 'productId' | 'productName'>>;
  transitionOrderToState?: Resolver<Maybe<ResolversTypes['TransitionOrderToStateResult']>, ParentType, ContextType, RequireFields<MutationTransitionOrderToStateArgs, 'state'>>;
  unsetOrderBillingAddress?: Resolver<ResolversTypes['ActiveOrderResult'], ParentType, ContextType>;
  unsetOrderShippingAddress?: Resolver<ResolversTypes['ActiveOrderResult'], ParentType, ContextType>;
  updateCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationUpdateCustomerArgs, 'input'>>;
  updateCustomerAddress?: Resolver<ResolversTypes['Address'], ParentType, ContextType, RequireFields<MutationUpdateCustomerAddressArgs, 'input'>>;
  updateCustomerEmailAddress?: Resolver<ResolversTypes['UpdateCustomerEmailAddressResult'], ParentType, ContextType, RequireFields<MutationUpdateCustomerEmailAddressArgs, 'token'>>;
  updateCustomerPassword?: Resolver<ResolversTypes['UpdateCustomerPasswordResult'], ParentType, ContextType, RequireFields<MutationUpdateCustomerPasswordArgs, 'currentPassword' | 'newPassword'>>;
  verifyCustomerAccount?: Resolver<ResolversTypes['VerifyCustomerAccountResult'], ParentType, ContextType, RequireFields<MutationVerifyCustomerAccountArgs, 'token'>>;
};

export type NativeAuthStrategyErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['NativeAuthStrategyError'] = ResolversParentTypes['NativeAuthStrategyError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NativeAuthenticationResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['NativeAuthenticationResult'] = ResolversParentTypes['NativeAuthenticationResult']> = {
  __resolveType: TypeResolveFn<'CurrentUser' | 'InvalidCredentialsError' | 'NativeAuthStrategyError' | 'NotVerifiedError', ParentType, ContextType>;
};

export type NegativeQuantityErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['NegativeQuantityError'] = ResolversParentTypes['NegativeQuantityError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NoActiveOrderErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['NoActiveOrderError'] = ResolversParentTypes['NoActiveOrderError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Address' | 'Asset' | 'AuthenticationMethod' | 'Banner' | 'BannerAsset' | 'BannerType' | 'Category' | 'CategoryType' | 'Channel' | 'Collection' | 'Country' | 'Customer' | 'CustomerGroup' | 'Day' | 'DeliveryMethod' | 'Facet' | 'FacetValue' | 'Fulfillment' | 'HistoryEntry' | 'Label' | 'Order' | 'OrderLine' | 'Payment' | 'PaymentMethod' | 'Product' | 'ProductOption' | 'ProductOptionGroup' | 'ProductVariant' | 'Promotion' | 'Province' | 'Refund' | 'Role' | 'Season' | 'SeasonTranslation' | 'Seller' | 'ShippingMethod' | 'Surcharge' | 'Tag' | 'TaxCategory' | 'TaxRate' | 'User' | 'Zone', ParentType, ContextType>;
};

export type NotVerifiedErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['NotVerifiedError'] = ResolversParentTypes['NotVerifiedError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  billingAddress?: Resolver<Maybe<ResolversTypes['OrderAddress']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  couponCodes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  courier?: Resolver<Maybe<ResolversTypes['Worker']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currencyCode?: Resolver<ResolversTypes['CurrencyCode'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['OrderCustomFields']>, ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  deliveryGroups?: Resolver<Array<ResolversTypes['DeliveryCredentialGroup']>, ParentType, ContextType>;
  discounts?: Resolver<Array<ResolversTypes['Discount']>, ParentType, ContextType>;
  fulfillments?: Resolver<Maybe<Array<ResolversTypes['Fulfillment']>>, ParentType, ContextType>;
  history?: Resolver<ResolversTypes['HistoryEntryList'], ParentType, ContextType, Partial<OrderHistoryArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lines?: Resolver<Array<ResolversTypes['OrderLine']>, ParentType, ContextType>;
  orderPlacedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  payments?: Resolver<Maybe<Array<ResolversTypes['Payment']>>, ParentType, ContextType>;
  promotions?: Resolver<Array<ResolversTypes['Promotion']>, ParentType, ContextType>;
  shipping?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  shippingAddress?: Resolver<Maybe<ResolversTypes['OrderAddress']>, ParentType, ContextType>;
  shippingLines?: Resolver<Array<ResolversTypes['ShippingLine']>, ParentType, ContextType>;
  shippingWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subTotal?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  subTotalWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  surcharges?: Resolver<Array<ResolversTypes['Surcharge']>, ParentType, ContextType>;
  taxSummary?: Resolver<Array<ResolversTypes['OrderTaxSummary']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  totalQuantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['OrderType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderAddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderAddress'] = ResolversParentTypes['OrderAddress']> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  countryCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['AddressCustomFields']>, ParentType, ContextType>;
  fullName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postalCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  province?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  streetLine1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  streetLine2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type OrderCustomFieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderCustomFields'] = ResolversParentTypes['OrderCustomFields']> = {
  assignedCourierId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deliveryMethod?: Resolver<Maybe<ResolversTypes['DeliveryMethod']>, ParentType, ContextType>;
};

export type OrderInterceptorErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderInterceptorError'] = ResolversParentTypes['OrderInterceptorError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  interceptorError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderLimitErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderLimitError'] = ResolversParentTypes['OrderLimitError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  maxItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderLineResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderLine'] = ResolversParentTypes['OrderLine']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  discountedLinePrice?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  discountedLinePriceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  discountedUnitPrice?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  discountedUnitPriceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  discounts?: Resolver<Array<ResolversTypes['Discount']>, ParentType, ContextType>;
  featuredAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  fulfillmentLines?: Resolver<Maybe<Array<ResolversTypes['FulfillmentLine']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  linePrice?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  linePriceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  lineTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Order'], ParentType, ContextType>;
  orderPlacedQuantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  productVariant?: Resolver<ResolversTypes['ProductVariant'], ParentType, ContextType>;
  proratedLinePrice?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  proratedLinePriceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  proratedUnitPrice?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  proratedUnitPriceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taxLines?: Resolver<Array<ResolversTypes['TaxLine']>, ParentType, ContextType>;
  taxRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  unitPriceChangeSinceAdded?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  unitPriceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  unitPriceWithTaxChangeSinceAdded?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderListResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderList'] = ResolversParentTypes['OrderList']> = {
  items?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderModificationErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderModificationError'] = ResolversParentTypes['OrderModificationError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderPaymentStateErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderPaymentStateError'] = ResolversParentTypes['OrderPaymentStateError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderStateTransitionErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderStateTransitionError'] = ResolversParentTypes['OrderStateTransitionError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  fromState?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toState?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transitionError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderTaxSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderTaxSummary'] = ResolversParentTypes['OrderTaxSummary']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taxBase?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  taxRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  taxTotal?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
};

export type PaginatedListResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaginatedList'] = ResolversParentTypes['PaginatedList']> = {
  __resolveType: TypeResolveFn<'AssetList' | 'BannerList' | 'BannerTypeList' | 'CategoryList' | 'CategoryTypeList' | 'CollectionList' | 'CountryList' | 'CustomerList' | 'DayList' | 'DeliveryMethodList' | 'FacetList' | 'FacetValueList' | 'HistoryEntryList' | 'LabelList' | 'OrderList' | 'ProductList' | 'ProductVariantList' | 'PromotionList' | 'ProvinceList' | 'RoleList' | 'ShippingMethodList' | 'TagList' | 'TaxRateList', ParentType, ContextType>;
};

export type PasswordAlreadySetErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['PasswordAlreadySetError'] = ResolversParentTypes['PasswordAlreadySetError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PasswordResetTokenExpiredErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['PasswordResetTokenExpiredError'] = ResolversParentTypes['PasswordResetTokenExpiredError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PasswordResetTokenInvalidErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['PasswordResetTokenInvalidError'] = ResolversParentTypes['PasswordResetTokenInvalidError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PasswordValidationErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['PasswordValidationError'] = ResolversParentTypes['PasswordValidationError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  validationErrorMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Payment'] = ResolversParentTypes['Payment']> = {
  amount?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  method?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refunds?: Resolver<Array<ResolversTypes['Refund']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentDeclinedErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentDeclinedError'] = ResolversParentTypes['PaymentDeclinedError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentErrorMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentFailedErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentFailedError'] = ResolversParentTypes['PaymentFailedError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentErrorMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentMethodResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentMethod'] = ResolversParentTypes['PaymentMethod']> = {
  checker?: Resolver<Maybe<ResolversTypes['ConfigurableOperation']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  handler?: Resolver<ResolversTypes['ConfigurableOperation'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['PaymentMethodTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentMethodQuoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentMethodQuote'] = ResolversParentTypes['PaymentMethodQuote']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  eligibilityMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isEligible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type PaymentMethodTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentMethodTranslation'] = ResolversParentTypes['PaymentMethodTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type PriceRangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PriceRange'] = ResolversParentTypes['PriceRange']> = {
  max?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  min?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  activeOptionGroups?: Resolver<Array<ResolversTypes['ProductOptionGroup']>, ParentType, ContextType>;
  assets?: Resolver<Array<ResolversTypes['Asset']>, ParentType, ContextType>;
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  collections?: Resolver<Array<ResolversTypes['Collection']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['ProductCustomFields']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  facetValues?: Resolver<Array<ResolversTypes['FacetValue']>, ParentType, ContextType>;
  featuredAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isSelected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionGroups?: Resolver<Array<ResolversTypes['ProductOptionGroup']>, ParentType, ContextType>;
  sale?: Resolver<Maybe<ResolversTypes['SaleInfo']>, ParentType, ContextType>;
  selectedQuantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['ProductTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  variantList?: Resolver<ResolversTypes['ProductVariantList'], ParentType, ContextType, Partial<ProductVariantListArgs>>;
  variants?: Resolver<Array<ResolversTypes['ProductVariant']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductCustomFieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductCustomFields'] = ResolversParentTypes['ProductCustomFields']> = {
  categories?: Resolver<Maybe<Array<ResolversTypes['Category']>>, ParentType, ContextType>;
  isRecommended?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  labels?: Resolver<Maybe<Array<ResolversTypes['Label']>>, ParentType, ContextType>;
};

export type ProductListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductList'] = ResolversParentTypes['ProductList']> = {
  items?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductOption'] = ResolversParentTypes['ProductOption']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  group?: Resolver<ResolversTypes['ProductOptionGroup'], ParentType, ContextType>;
  groupId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['ProductOptionTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductOptionGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductOptionGroup'] = ResolversParentTypes['ProductOptionGroup']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['ProductOption']>, ParentType, ContextType>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['ProductOptionGroupTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductOptionGroupTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductOptionGroupTranslation'] = ResolversParentTypes['ProductOptionGroupTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type ProductOptionTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductOptionTranslation'] = ResolversParentTypes['ProductOptionTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type ProductTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductTranslation'] = ResolversParentTypes['ProductTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type ProductVariantResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductVariant'] = ResolversParentTypes['ProductVariant']> = {
  assets?: Resolver<Array<ResolversTypes['Asset']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currencyCode?: Resolver<ResolversTypes['CurrencyCode'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  facetValues?: Resolver<Array<ResolversTypes['FacetValue']>, ParentType, ContextType>;
  featuredAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['ProductOption']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  priceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sale?: Resolver<Maybe<ResolversTypes['SaleInfo']>, ParentType, ContextType>;
  sku?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stockLevel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stockOnHand?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taxCategory?: Resolver<ResolversTypes['TaxCategory'], ParentType, ContextType>;
  taxRateApplied?: Resolver<ResolversTypes['TaxRate'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['ProductVariantTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductVariantListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductVariantList'] = ResolversParentTypes['ProductVariantList']> = {
  items?: Resolver<Array<ResolversTypes['ProductVariant']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductVariantTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductVariantTranslation'] = ResolversParentTypes['ProductVariantTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type PromotionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Promotion'] = ResolversParentTypes['Promotion']> = {
  actions?: Resolver<Array<ResolversTypes['ConfigurableOperation']>, ParentType, ContextType>;
  conditions?: Resolver<Array<ResolversTypes['ConfigurableOperation']>, ParentType, ContextType>;
  couponCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['PromotionCustomFields']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  endsAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  perCustomerUsageLimit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  startsAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['PromotionTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  usageLimit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PromotionCustomFieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['PromotionCustomFields'] = ResolversParentTypes['PromotionCustomFields']> = {
  collectionType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  internalPromoCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type PromotionListResolvers<ContextType = any, ParentType extends ResolversParentTypes['PromotionList'] = ResolversParentTypes['PromotionList']> = {
  items?: Resolver<Array<ResolversTypes['Promotion']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PromotionTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['PromotionTranslation'] = ResolversParentTypes['PromotionTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type ProvinceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Province'] = ResolversParentTypes['Province']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Region']>, ParentType, ContextType>;
  parentId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['RegionTranslation']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProvinceListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProvinceList'] = ResolversParentTypes['ProvinceList']> = {
  items?: Resolver<Array<ResolversTypes['Province']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PublicPaymentMethodResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicPaymentMethod'] = ResolversParentTypes['PublicPaymentMethod']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['PaymentMethodTranslation']>, ParentType, ContextType>;
};

export type PublicShippingMethodResolvers<ContextType = any, ParentType extends ResolversParentTypes['PublicShippingMethod'] = ResolversParentTypes['PublicShippingMethod']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['ShippingMethodTranslation']>, ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  activeChannel?: Resolver<ResolversTypes['Channel'], ParentType, ContextType>;
  activeCustomer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  activeOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType>;
  activePaymentMethods?: Resolver<Array<Maybe<ResolversTypes['PublicPaymentMethod']>>, ParentType, ContextType>;
  activeSeasons?: Resolver<Array<ResolversTypes['Season']>, ParentType, ContextType>;
  activeShippingMethods?: Resolver<Array<Maybe<ResolversTypes['PublicShippingMethod']>>, ParentType, ContextType>;
  availableCountries?: Resolver<Array<ResolversTypes['Country']>, ParentType, ContextType>;
  banner?: Resolver<Maybe<ResolversTypes['Banner']>, ParentType, ContextType, RequireFields<QueryBannerArgs, 'id'>>;
  bannerBySlug?: Resolver<Maybe<ResolversTypes['Banner']>, ParentType, ContextType, RequireFields<QueryBannerBySlugArgs, 'slug'>>;
  bannerType?: Resolver<Maybe<ResolversTypes['BannerType']>, ParentType, ContextType, RequireFields<QueryBannerTypeArgs, 'id'>>;
  bannerTypes?: Resolver<ResolversTypes['BannerTypeList'], ParentType, ContextType, Partial<QueryBannerTypesArgs>>;
  banners?: Resolver<ResolversTypes['BannerList'], ParentType, ContextType, Partial<QueryBannersArgs>>;
  boughtTogether?: Resolver<Array<ResolversTypes['BoughtTogetherResult']>, ParentType, ContextType, RequireFields<QueryBoughtTogetherArgs, 'productId'>>;
  categories?: Resolver<ResolversTypes['CategoryList'], ParentType, ContextType, Partial<QueryCategoriesArgs>>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, Partial<QueryCategoryArgs>>;
  categoryTree?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, Partial<QueryCategoryTreeArgs>>;
  categoryType?: Resolver<Maybe<ResolversTypes['CategoryType']>, ParentType, ContextType, Partial<QueryCategoryTypeArgs>>;
  categoryTypes?: Resolver<ResolversTypes['CategoryTypeList'], ParentType, ContextType, Partial<QueryCategoryTypesArgs>>;
  collection?: Resolver<Maybe<ResolversTypes['Collection']>, ParentType, ContextType, Partial<QueryCollectionArgs>>;
  collections?: Resolver<ResolversTypes['CollectionList'], ParentType, ContextType, Partial<QueryCollectionsArgs>>;
  day?: Resolver<Maybe<ResolversTypes['Day']>, ParentType, ContextType, RequireFields<QueryDayArgs, 'id'>>;
  days?: Resolver<ResolversTypes['DayList'], ParentType, ContextType, Partial<QueryDaysArgs>>;
  deliveryGroups?: Resolver<Array<ResolversTypes['DeliveryCredentialGroup']>, ParentType, ContextType, RequireFields<QueryDeliveryGroupsArgs, 'channelId'>>;
  deliveryMethod?: Resolver<Maybe<ResolversTypes['DeliveryMethod']>, ParentType, ContextType, RequireFields<QueryDeliveryMethodArgs, 'id'>>;
  deliveryMethods?: Resolver<ResolversTypes['DeliveryMethodList'], ParentType, ContextType, Partial<QueryDeliveryMethodsArgs>>;
  eligiblePaymentMethods?: Resolver<Array<ResolversTypes['PaymentMethodQuote']>, ParentType, ContextType>;
  eligibleShippingMethods?: Resolver<Array<ResolversTypes['ShippingMethodQuote']>, ParentType, ContextType>;
  facet?: Resolver<Maybe<ResolversTypes['Facet']>, ParentType, ContextType, RequireFields<QueryFacetArgs, 'id'>>;
  facets?: Resolver<ResolversTypes['FacetList'], ParentType, ContextType, Partial<QueryFacetsArgs>>;
  getAllProducts?: Resolver<ResolversTypes['FilteredProductList'], ParentType, ContextType, Partial<QueryGetAllProductsArgs>>;
  getFilters?: Resolver<ResolversTypes['AggregatedMetadata'], ParentType, ContextType, RequireFields<QueryGetFiltersArgs, 'slug' | 'type'>>;
  getHomePageData?: Resolver<Array<ResolversTypes['HomePageSection']>, ParentType, ContextType, Partial<QueryGetHomePageDataArgs>>;
  label?: Resolver<Maybe<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<QueryLabelArgs, 'id'>>;
  labels?: Resolver<ResolversTypes['LabelList'], ParentType, ContextType, Partial<QueryLabelsArgs>>;
  me?: Resolver<Maybe<ResolversTypes['CurrentUser']>, ParentType, ContextType>;
  models?: Resolver<ResolversTypes['ModelList'], ParentType, ContextType>;
  myLikes?: Resolver<Array<ResolversTypes['Like']>, ParentType, ContextType>;
  nextOrderStates?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<QueryOrderArgs, 'id'>>;
  orderByCode?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<QueryOrderByCodeArgs, 'code'>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, Partial<QueryProductArgs>>;
  products?: Resolver<ResolversTypes['ProductList'], ParentType, ContextType, Partial<QueryProductsArgs>>;
  refreshToken?: Resolver<ResolversTypes['RefreshTokenResponse'], ParentType, ContextType, RequireFields<QueryRefreshTokenArgs, 'refreshToken'>>;
  search?: Resolver<ResolversTypes['SearchResponse'], ParentType, ContextType, RequireFields<QuerySearchArgs, 'input'>>;
  seasonBySlug?: Resolver<Maybe<ResolversTypes['Season']>, ParentType, ContextType, RequireFields<QuerySeasonBySlugArgs, 'slug'>>;
  testContext?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
};

export type RefreshCustomerVerificationResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RefreshCustomerVerificationResult'] = ResolversParentTypes['RefreshCustomerVerificationResult']> = {
  __resolveType: TypeResolveFn<'NativeAuthStrategyError' | 'Success', ParentType, ContextType>;
};

export type RefreshTokenResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RefreshTokenResponse'] = ResolversParentTypes['RefreshTokenResponse']> = {
  accessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type RefundResolvers<ContextType = any, ParentType extends ResolversParentTypes['Refund'] = ResolversParentTypes['Refund']> = {
  adjustment?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  lines?: Resolver<Array<ResolversTypes['RefundLine']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  method?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  paymentId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shipping?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  transactionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RefundLineResolvers<ContextType = any, ParentType extends ResolversParentTypes['RefundLine'] = ResolversParentTypes['RefundLine']> = {
  orderLine?: Resolver<ResolversTypes['OrderLine'], ParentType, ContextType>;
  orderLineId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  refund?: Resolver<ResolversTypes['Refund'], ParentType, ContextType>;
  refundId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type RegionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Region'] = ResolversParentTypes['Region']> = {
  __resolveType: TypeResolveFn<'Country' | 'Province', ParentType, ContextType>;
};

export type RegionTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegionTranslation'] = ResolversParentTypes['RegionTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type RegisterCustomerAccountResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegisterCustomerAccountResult'] = ResolversParentTypes['RegisterCustomerAccountResult']> = {
  __resolveType: TypeResolveFn<'MissingPasswordError' | 'NativeAuthStrategyError' | 'PasswordValidationError' | 'Success', ParentType, ContextType>;
};

export type RelationCustomFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['RelationCustomFieldConfig'] = ResolversParentTypes['RelationCustomFieldConfig']> = {
  deprecated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  deprecationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  entity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  internal?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nullable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  readonly?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  requiresPermission?: Resolver<Maybe<Array<ResolversTypes['Permission']>>, ParentType, ContextType>;
  scalarFields?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RemoveOrderItemsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemoveOrderItemsResult'] = ResolversParentTypes['RemoveOrderItemsResult']> = {
  __resolveType: TypeResolveFn<'Order' | 'OrderInterceptorError' | 'OrderModificationError', ParentType, ContextType>;
};

export type RequestPasswordResetResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RequestPasswordResetResult'] = ResolversParentTypes['RequestPasswordResetResult']> = {
  __resolveType: TypeResolveFn<'NativeAuthStrategyError' | 'Success', ParentType, ContextType>;
};

export type RequestUpdateCustomerEmailAddressResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RequestUpdateCustomerEmailAddressResult'] = ResolversParentTypes['RequestUpdateCustomerEmailAddressResult']> = {
  __resolveType: TypeResolveFn<'EmailAddressConflictError' | 'InvalidCredentialsError' | 'NativeAuthStrategyError' | 'Success', ParentType, ContextType>;
};

export type ResetPasswordResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ResetPasswordResult'] = ResolversParentTypes['ResetPasswordResult']> = {
  __resolveType: TypeResolveFn<'CurrentUser' | 'NativeAuthStrategyError' | 'NotVerifiedError' | 'PasswordResetTokenExpiredError' | 'PasswordResetTokenInvalidError' | 'PasswordValidationError', ParentType, ContextType>;
};

export type RoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = {
  channels?: Resolver<Array<ResolversTypes['Channel']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleListResolvers<ContextType = any, ParentType extends ResolversParentTypes['RoleList'] = ResolversParentTypes['RoleList']> = {
  items?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SaleInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['SaleInfo'] = ResolversParentTypes['SaleInfo']> = {
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  limitCountOfEachOrder?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  neverExpires?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  orderLimit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  saleId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  salePercent?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalCountOfSalePrice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SearchReindexResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchReindexResponse'] = ResolversParentTypes['SearchReindexResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type SearchResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResponse'] = ResolversParentTypes['SearchResponse']> = {
  collections?: Resolver<Array<ResolversTypes['CollectionResult']>, ParentType, ContextType>;
  facetValues?: Resolver<Array<ResolversTypes['FacetValueResult']>, ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['SearchResult']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type SearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResult'] = ResolversParentTypes['SearchResult']> = {
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  collectionIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  currencyCode?: Resolver<ResolversTypes['CurrencyCode'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  facetIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  facetValueIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  inStock?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isSelected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['SearchResultPrice'], ParentType, ContextType>;
  priceWithTax?: Resolver<ResolversTypes['SearchResultPrice'], ParentType, ContextType>;
  productAsset?: Resolver<Maybe<ResolversTypes['SearchResultAsset']>, ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productLabels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  productName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productVariantAsset?: Resolver<Maybe<ResolversTypes['SearchResultAsset']>, ParentType, ContextType>;
  productVariantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productVariantName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  selectedQuantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sku?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SearchResultAssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResultAsset'] = ResolversParentTypes['SearchResultAsset']> = {
  focalPoint?: Resolver<Maybe<ResolversTypes['Coordinate']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  preview?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SearchResultPriceResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchResultPrice'] = ResolversParentTypes['SearchResultPrice']> = {
  __resolveType: TypeResolveFn<'PriceRange' | 'SinglePrice', ParentType, ContextType>;
};

export type SeasonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Season'] = ResolversParentTypes['Season']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  products?: Resolver<ResolversTypes['ProductList'], ParentType, ContextType, Partial<SeasonProductsArgs>>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  startDate?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['SeasonTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SeasonTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['SeasonTranslation'] = ResolversParentTypes['SeasonTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SellerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Seller'] = ResolversParentTypes['Seller']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetCustomerForOrderResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetCustomerForOrderResult'] = ResolversParentTypes['SetCustomerForOrderResult']> = {
  __resolveType: TypeResolveFn<'AlreadyLoggedInError' | 'EmailAddressConflictError' | 'GuestCheckoutError' | 'NoActiveOrderError' | 'Order', ParentType, ContextType>;
};

export type SetOrderShippingMethodResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetOrderShippingMethodResult'] = ResolversParentTypes['SetOrderShippingMethodResult']> = {
  __resolveType: TypeResolveFn<'IneligibleShippingMethodError' | 'NoActiveOrderError' | 'Order' | 'OrderModificationError', ParentType, ContextType>;
};

export type ShippingLineResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShippingLine'] = ResolversParentTypes['ShippingLine']> = {
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  discountedPrice?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  discountedPriceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  discounts?: Resolver<Array<ResolversTypes['Discount']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  priceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  shippingMethod?: Resolver<ResolversTypes['ShippingMethod'], ParentType, ContextType>;
};

export type ShippingMethodResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShippingMethod'] = ResolversParentTypes['ShippingMethod']> = {
  calculator?: Resolver<ResolversTypes['ConfigurableOperation'], ParentType, ContextType>;
  checker?: Resolver<ResolversTypes['ConfigurableOperation'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fulfillmentHandlerCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['ShippingMethodTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShippingMethodListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShippingMethodList'] = ResolversParentTypes['ShippingMethodList']> = {
  items?: Resolver<Array<ResolversTypes['ShippingMethod']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ShippingMethodQuoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShippingMethodQuote'] = ResolversParentTypes['ShippingMethodQuote']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  priceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
};

export type ShippingMethodTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ShippingMethodTranslation'] = ResolversParentTypes['ShippingMethodTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type SinglePriceResolvers<ContextType = any, ParentType extends ResolversParentTypes['SinglePrice'] = ResolversParentTypes['SinglePrice']> = {
  value?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StringCustomFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['StringCustomFieldConfig'] = ResolversParentTypes['StringCustomFieldConfig']> = {
  deprecated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  deprecationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  internal?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  length?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nullable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  options?: Resolver<Maybe<Array<ResolversTypes['StringFieldOption']>>, ParentType, ContextType>;
  pattern?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  readonly?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  requiresPermission?: Resolver<Maybe<Array<ResolversTypes['Permission']>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StringFieldOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['StringFieldOption'] = ResolversParentTypes['StringFieldOption']> = {
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type StringStructFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['StringStructFieldConfig'] = ResolversParentTypes['StringStructFieldConfig']> = {
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  length?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Maybe<Array<ResolversTypes['StringFieldOption']>>, ParentType, ContextType>;
  pattern?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StructCustomFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['StructCustomFieldConfig'] = ResolversParentTypes['StructCustomFieldConfig']> = {
  deprecated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  deprecationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  fields?: Resolver<Array<ResolversTypes['StructFieldConfig']>, ParentType, ContextType>;
  internal?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nullable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  readonly?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  requiresPermission?: Resolver<Maybe<Array<ResolversTypes['Permission']>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StructFieldResolvers<ContextType = any, ParentType extends ResolversParentTypes['StructField'] = ResolversParentTypes['StructField']> = {
  __resolveType: TypeResolveFn<'BooleanStructFieldConfig' | 'DateTimeStructFieldConfig' | 'FloatStructFieldConfig' | 'IntStructFieldConfig' | 'StringStructFieldConfig' | 'TextStructFieldConfig', ParentType, ContextType>;
};

export type StructFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['StructFieldConfig'] = ResolversParentTypes['StructFieldConfig']> = {
  __resolveType: TypeResolveFn<'BooleanStructFieldConfig' | 'DateTimeStructFieldConfig' | 'FloatStructFieldConfig' | 'IntStructFieldConfig' | 'StringStructFieldConfig' | 'TextStructFieldConfig', ParentType, ContextType>;
};

export type SuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['Success'] = ResolversParentTypes['Success']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SurchargeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Surcharge'] = ResolversParentTypes['Surcharge']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  priceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  sku?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  taxLines?: Resolver<Array<ResolversTypes['TaxLine']>, ParentType, ContextType>;
  taxRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagListResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagList'] = ResolversParentTypes['TagList']> = {
  items?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxCategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaxCategory'] = ResolversParentTypes['TaxCategory']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDefault?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxLineResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaxLine'] = ResolversParentTypes['TaxLine']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  taxRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type TaxRateResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaxRate'] = ResolversParentTypes['TaxRate']> = {
  category?: Resolver<ResolversTypes['TaxCategory'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  customerGroup?: Resolver<Maybe<ResolversTypes['CustomerGroup']>, ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  zone?: Resolver<ResolversTypes['Zone'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TaxRateListResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaxRateList'] = ResolversParentTypes['TaxRateList']> = {
  items?: Resolver<Array<ResolversTypes['TaxRate']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TextCustomFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['TextCustomFieldConfig'] = ResolversParentTypes['TextCustomFieldConfig']> = {
  deprecated?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  deprecationReason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  internal?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nullable?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  readonly?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  requiresPermission?: Resolver<Maybe<Array<ResolversTypes['Permission']>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TextStructFieldConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['TextStructFieldConfig'] = ResolversParentTypes['TextStructFieldConfig']> = {
  description?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  label?: Resolver<Maybe<Array<ResolversTypes['LocalizedString']>>, ParentType, ContextType>;
  list?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TrackClickSuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['TrackClickSuccess'] = ResolversParentTypes['TrackClickSuccess']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type TransitionOrderToStateResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransitionOrderToStateResult'] = ResolversParentTypes['TransitionOrderToStateResult']> = {
  __resolveType: TypeResolveFn<'Order' | 'OrderStateTransitionError', ParentType, ContextType>;
};

export type UpdateCustomerEmailAddressResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateCustomerEmailAddressResult'] = ResolversParentTypes['UpdateCustomerEmailAddressResult']> = {
  __resolveType: TypeResolveFn<'IdentifierChangeTokenExpiredError' | 'IdentifierChangeTokenInvalidError' | 'NativeAuthStrategyError' | 'Success', ParentType, ContextType>;
};

export type UpdateCustomerPasswordResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateCustomerPasswordResult'] = ResolversParentTypes['UpdateCustomerPasswordResult']> = {
  __resolveType: TypeResolveFn<'InvalidCredentialsError' | 'NativeAuthStrategyError' | 'PasswordValidationError' | 'Success', ParentType, ContextType>;
};

export type UpdateMultipleOrderItemsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateMultipleOrderItemsResult'] = ResolversParentTypes['UpdateMultipleOrderItemsResult']> = {
  errorResults?: Resolver<Array<ResolversTypes['UpdateOrderItemErrorResult']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Order'], ParentType, ContextType>;
};

export type UpdateOrderItemErrorResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateOrderItemErrorResult'] = ResolversParentTypes['UpdateOrderItemErrorResult']> = {
  __resolveType: TypeResolveFn<'InsufficientStockError' | 'NegativeQuantityError' | 'OrderInterceptorError' | 'OrderLimitError' | 'OrderModificationError', ParentType, ContextType>;
};

export type UpdateOrderItemsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateOrderItemsResult'] = ResolversParentTypes['UpdateOrderItemsResult']> = {
  __resolveType: TypeResolveFn<'InsufficientStockError' | 'NegativeQuantityError' | 'Order' | 'OrderInterceptorError' | 'OrderLimitError' | 'OrderModificationError', ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  authenticationMethods?: Resolver<Array<ResolversTypes['AuthenticationMethod']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  lastLogin?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  roles?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VerificationTokenExpiredErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerificationTokenExpiredError'] = ResolversParentTypes['VerificationTokenExpiredError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VerificationTokenInvalidErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerificationTokenInvalidError'] = ResolversParentTypes['VerificationTokenInvalidError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VerifyCustomerAccountResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerifyCustomerAccountResult'] = ResolversParentTypes['VerifyCustomerAccountResult']> = {
  __resolveType: TypeResolveFn<'CurrentUser' | 'MissingPasswordError' | 'NativeAuthStrategyError' | 'PasswordAlreadySetError' | 'PasswordValidationError' | 'VerificationTokenExpiredError' | 'VerificationTokenInvalidError', ParentType, ContextType>;
};

export type WorkerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Worker'] = ResolversParentTypes['Worker']> = {
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vehicle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vehiclePlate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type ZoneResolvers<ContextType = any, ParentType extends ResolversParentTypes['Zone'] = ResolversParentTypes['Zone']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['Region']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ActiveOrderResult?: ActiveOrderResultResolvers<ContextType>;
  AddPaymentToOrderResult?: AddPaymentToOrderResultResolvers<ContextType>;
  Address?: AddressResolvers<ContextType>;
  AddressCustomFields?: AddressCustomFieldsResolvers<ContextType>;
  Adjustment?: AdjustmentResolvers<ContextType>;
  AggregatedMetadata?: AggregatedMetadataResolvers<ContextType>;
  AlreadyLoggedInError?: AlreadyLoggedInErrorResolvers<ContextType>;
  ApplyCouponCodeResult?: ApplyCouponCodeResultResolvers<ContextType>;
  Asset?: AssetResolvers<ContextType>;
  AssetList?: AssetListResolvers<ContextType>;
  AssetTranslation?: AssetTranslationResolvers<ContextType>;
  AuthDeletionResponse?: AuthDeletionResponseResolvers<ContextType>;
  AuthenticationMethod?: AuthenticationMethodResolvers<ContextType>;
  AuthenticationResult?: AuthenticationResultResolvers<ContextType>;
  Banner?: BannerResolvers<ContextType>;
  BannerAsset?: BannerAssetResolvers<ContextType>;
  BannerList?: BannerListResolvers<ContextType>;
  BannerTranslation?: BannerTranslationResolvers<ContextType>;
  BannerType?: BannerTypeResolvers<ContextType>;
  BannerTypeList?: BannerTypeListResolvers<ContextType>;
  BannerTypeTranslation?: BannerTypeTranslationResolvers<ContextType>;
  BaseResponse?: BaseResponseResolvers<ContextType>;
  BooleanCustomFieldConfig?: BooleanCustomFieldConfigResolvers<ContextType>;
  BooleanStructFieldConfig?: BooleanStructFieldConfigResolvers<ContextType>;
  BoughtTogetherResult?: BoughtTogetherResultResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  CategoryList?: CategoryListResolvers<ContextType>;
  CategoryTranslation?: CategoryTranslationResolvers<ContextType>;
  CategoryType?: CategoryTypeResolvers<ContextType>;
  CategoryTypeList?: CategoryTypeListResolvers<ContextType>;
  CategoryTypeTranslation?: CategoryTypeTranslationResolvers<ContextType>;
  Channel?: ChannelResolvers<ContextType>;
  ChannelCustomFields?: ChannelCustomFieldsResolvers<ContextType>;
  Collection?: CollectionResolvers<ContextType>;
  CollectionBreadcrumb?: CollectionBreadcrumbResolvers<ContextType>;
  CollectionList?: CollectionListResolvers<ContextType>;
  CollectionResult?: CollectionResultResolvers<ContextType>;
  CollectionTranslation?: CollectionTranslationResolvers<ContextType>;
  ConfigArg?: ConfigArgResolvers<ContextType>;
  ConfigArgDefinition?: ConfigArgDefinitionResolvers<ContextType>;
  ConfigurableOperation?: ConfigurableOperationResolvers<ContextType>;
  ConfigurableOperationDefinition?: ConfigurableOperationDefinitionResolvers<ContextType>;
  Coordinate?: CoordinateResolvers<ContextType>;
  Country?: CountryResolvers<ContextType>;
  CountryList?: CountryListResolvers<ContextType>;
  CouponCodeExpiredError?: CouponCodeExpiredErrorResolvers<ContextType>;
  CouponCodeInvalidError?: CouponCodeInvalidErrorResolvers<ContextType>;
  CouponCodeLimitError?: CouponCodeLimitErrorResolvers<ContextType>;
  CurrentUser?: CurrentUserResolvers<ContextType>;
  CurrentUserChannel?: CurrentUserChannelResolvers<ContextType>;
  CustomField?: CustomFieldResolvers<ContextType>;
  CustomFieldConfig?: CustomFieldConfigResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  CustomerCustomFields?: CustomerCustomFieldsResolvers<ContextType>;
  CustomerGroup?: CustomerGroupResolvers<ContextType>;
  CustomerList?: CustomerListResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DateTimeCustomFieldConfig?: DateTimeCustomFieldConfigResolvers<ContextType>;
  DateTimeStructFieldConfig?: DateTimeStructFieldConfigResolvers<ContextType>;
  Day?: DayResolvers<ContextType>;
  DayList?: DayListResolvers<ContextType>;
  DayTranslation?: DayTranslationResolvers<ContextType>;
  DeletionResponse?: DeletionResponseResolvers<ContextType>;
  DeliveryCredentialGroup?: DeliveryCredentialGroupResolvers<ContextType>;
  DeliveryMethod?: DeliveryMethodResolvers<ContextType>;
  DeliveryMethodList?: DeliveryMethodListResolvers<ContextType>;
  DeliveryMethodTranslation?: DeliveryMethodTranslationResolvers<ContextType>;
  Discount?: DiscountResolvers<ContextType>;
  EmailAddressConflictError?: EmailAddressConflictErrorResolvers<ContextType>;
  ErrorResult?: ErrorResultResolvers<ContextType>;
  Facet?: FacetResolvers<ContextType>;
  FacetList?: FacetListResolvers<ContextType>;
  FacetTranslation?: FacetTranslationResolvers<ContextType>;
  FacetValue?: FacetValueResolvers<ContextType>;
  FacetValueCustomFields?: FacetValueCustomFieldsResolvers<ContextType>;
  FacetValueList?: FacetValueListResolvers<ContextType>;
  FacetValueResult?: FacetValueResultResolvers<ContextType>;
  FacetValueTranslation?: FacetValueTranslationResolvers<ContextType>;
  FilteredProductList?: FilteredProductListResolvers<ContextType>;
  FloatCustomFieldConfig?: FloatCustomFieldConfigResolvers<ContextType>;
  FloatStructFieldConfig?: FloatStructFieldConfigResolvers<ContextType>;
  Fulfillment?: FulfillmentResolvers<ContextType>;
  FulfillmentLine?: FulfillmentLineResolvers<ContextType>;
  GuestCheckoutError?: GuestCheckoutErrorResolvers<ContextType>;
  HistoryEntry?: HistoryEntryResolvers<ContextType>;
  HistoryEntryList?: HistoryEntryListResolvers<ContextType>;
  HomePageSection?: HomePageSectionResolvers<ContextType>;
  IdentifierChangeTokenExpiredError?: IdentifierChangeTokenExpiredErrorResolvers<ContextType>;
  IdentifierChangeTokenInvalidError?: IdentifierChangeTokenInvalidErrorResolvers<ContextType>;
  IneligiblePaymentMethodError?: IneligiblePaymentMethodErrorResolvers<ContextType>;
  IneligibleShippingMethodError?: IneligibleShippingMethodErrorResolvers<ContextType>;
  InsufficientStockError?: InsufficientStockErrorResolvers<ContextType>;
  IntCustomFieldConfig?: IntCustomFieldConfigResolvers<ContextType>;
  IntStructFieldConfig?: IntStructFieldConfigResolvers<ContextType>;
  InvalidCredentialsError?: InvalidCredentialsErrorResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Label?: LabelResolvers<ContextType>;
  LabelList?: LabelListResolvers<ContextType>;
  LabelTranslation?: LabelTranslationResolvers<ContextType>;
  Like?: LikeResolvers<ContextType>;
  LikeResponse?: LikeResponseResolvers<ContextType>;
  LocaleStringCustomFieldConfig?: LocaleStringCustomFieldConfigResolvers<ContextType>;
  LocaleTextCustomFieldConfig?: LocaleTextCustomFieldConfigResolvers<ContextType>;
  LocalizedString?: LocalizedStringResolvers<ContextType>;
  MissingPasswordError?: MissingPasswordErrorResolvers<ContextType>;
  Model?: ModelResolvers<ContextType>;
  ModelList?: ModelListResolvers<ContextType>;
  Money?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  NativeAuthStrategyError?: NativeAuthStrategyErrorResolvers<ContextType>;
  NativeAuthenticationResult?: NativeAuthenticationResultResolvers<ContextType>;
  NegativeQuantityError?: NegativeQuantityErrorResolvers<ContextType>;
  NoActiveOrderError?: NoActiveOrderErrorResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  NotVerifiedError?: NotVerifiedErrorResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderAddress?: OrderAddressResolvers<ContextType>;
  OrderCustomFields?: OrderCustomFieldsResolvers<ContextType>;
  OrderInterceptorError?: OrderInterceptorErrorResolvers<ContextType>;
  OrderLimitError?: OrderLimitErrorResolvers<ContextType>;
  OrderLine?: OrderLineResolvers<ContextType>;
  OrderList?: OrderListResolvers<ContextType>;
  OrderModificationError?: OrderModificationErrorResolvers<ContextType>;
  OrderPaymentStateError?: OrderPaymentStateErrorResolvers<ContextType>;
  OrderStateTransitionError?: OrderStateTransitionErrorResolvers<ContextType>;
  OrderTaxSummary?: OrderTaxSummaryResolvers<ContextType>;
  PaginatedList?: PaginatedListResolvers<ContextType>;
  PasswordAlreadySetError?: PasswordAlreadySetErrorResolvers<ContextType>;
  PasswordResetTokenExpiredError?: PasswordResetTokenExpiredErrorResolvers<ContextType>;
  PasswordResetTokenInvalidError?: PasswordResetTokenInvalidErrorResolvers<ContextType>;
  PasswordValidationError?: PasswordValidationErrorResolvers<ContextType>;
  Payment?: PaymentResolvers<ContextType>;
  PaymentDeclinedError?: PaymentDeclinedErrorResolvers<ContextType>;
  PaymentFailedError?: PaymentFailedErrorResolvers<ContextType>;
  PaymentMethod?: PaymentMethodResolvers<ContextType>;
  PaymentMethodQuote?: PaymentMethodQuoteResolvers<ContextType>;
  PaymentMethodTranslation?: PaymentMethodTranslationResolvers<ContextType>;
  PriceRange?: PriceRangeResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductCustomFields?: ProductCustomFieldsResolvers<ContextType>;
  ProductList?: ProductListResolvers<ContextType>;
  ProductOption?: ProductOptionResolvers<ContextType>;
  ProductOptionGroup?: ProductOptionGroupResolvers<ContextType>;
  ProductOptionGroupTranslation?: ProductOptionGroupTranslationResolvers<ContextType>;
  ProductOptionTranslation?: ProductOptionTranslationResolvers<ContextType>;
  ProductTranslation?: ProductTranslationResolvers<ContextType>;
  ProductVariant?: ProductVariantResolvers<ContextType>;
  ProductVariantList?: ProductVariantListResolvers<ContextType>;
  ProductVariantTranslation?: ProductVariantTranslationResolvers<ContextType>;
  Promotion?: PromotionResolvers<ContextType>;
  PromotionCustomFields?: PromotionCustomFieldsResolvers<ContextType>;
  PromotionList?: PromotionListResolvers<ContextType>;
  PromotionTranslation?: PromotionTranslationResolvers<ContextType>;
  Province?: ProvinceResolvers<ContextType>;
  ProvinceList?: ProvinceListResolvers<ContextType>;
  PublicPaymentMethod?: PublicPaymentMethodResolvers<ContextType>;
  PublicShippingMethod?: PublicShippingMethodResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RefreshCustomerVerificationResult?: RefreshCustomerVerificationResultResolvers<ContextType>;
  RefreshTokenResponse?: RefreshTokenResponseResolvers<ContextType>;
  Refund?: RefundResolvers<ContextType>;
  RefundLine?: RefundLineResolvers<ContextType>;
  Region?: RegionResolvers<ContextType>;
  RegionTranslation?: RegionTranslationResolvers<ContextType>;
  RegisterCustomerAccountResult?: RegisterCustomerAccountResultResolvers<ContextType>;
  RelationCustomFieldConfig?: RelationCustomFieldConfigResolvers<ContextType>;
  RemoveOrderItemsResult?: RemoveOrderItemsResultResolvers<ContextType>;
  RequestPasswordResetResult?: RequestPasswordResetResultResolvers<ContextType>;
  RequestUpdateCustomerEmailAddressResult?: RequestUpdateCustomerEmailAddressResultResolvers<ContextType>;
  ResetPasswordResult?: ResetPasswordResultResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  RoleList?: RoleListResolvers<ContextType>;
  SaleInfo?: SaleInfoResolvers<ContextType>;
  SearchReindexResponse?: SearchReindexResponseResolvers<ContextType>;
  SearchResponse?: SearchResponseResolvers<ContextType>;
  SearchResult?: SearchResultResolvers<ContextType>;
  SearchResultAsset?: SearchResultAssetResolvers<ContextType>;
  SearchResultPrice?: SearchResultPriceResolvers<ContextType>;
  Season?: SeasonResolvers<ContextType>;
  SeasonTranslation?: SeasonTranslationResolvers<ContextType>;
  Seller?: SellerResolvers<ContextType>;
  SetCustomerForOrderResult?: SetCustomerForOrderResultResolvers<ContextType>;
  SetOrderShippingMethodResult?: SetOrderShippingMethodResultResolvers<ContextType>;
  ShippingLine?: ShippingLineResolvers<ContextType>;
  ShippingMethod?: ShippingMethodResolvers<ContextType>;
  ShippingMethodList?: ShippingMethodListResolvers<ContextType>;
  ShippingMethodQuote?: ShippingMethodQuoteResolvers<ContextType>;
  ShippingMethodTranslation?: ShippingMethodTranslationResolvers<ContextType>;
  SinglePrice?: SinglePriceResolvers<ContextType>;
  StringCustomFieldConfig?: StringCustomFieldConfigResolvers<ContextType>;
  StringFieldOption?: StringFieldOptionResolvers<ContextType>;
  StringStructFieldConfig?: StringStructFieldConfigResolvers<ContextType>;
  StructCustomFieldConfig?: StructCustomFieldConfigResolvers<ContextType>;
  StructField?: StructFieldResolvers<ContextType>;
  StructFieldConfig?: StructFieldConfigResolvers<ContextType>;
  Success?: SuccessResolvers<ContextType>;
  Surcharge?: SurchargeResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TagList?: TagListResolvers<ContextType>;
  TaxCategory?: TaxCategoryResolvers<ContextType>;
  TaxLine?: TaxLineResolvers<ContextType>;
  TaxRate?: TaxRateResolvers<ContextType>;
  TaxRateList?: TaxRateListResolvers<ContextType>;
  TextCustomFieldConfig?: TextCustomFieldConfigResolvers<ContextType>;
  TextStructFieldConfig?: TextStructFieldConfigResolvers<ContextType>;
  TrackClickSuccess?: TrackClickSuccessResolvers<ContextType>;
  TransitionOrderToStateResult?: TransitionOrderToStateResultResolvers<ContextType>;
  UpdateCustomerEmailAddressResult?: UpdateCustomerEmailAddressResultResolvers<ContextType>;
  UpdateCustomerPasswordResult?: UpdateCustomerPasswordResultResolvers<ContextType>;
  UpdateMultipleOrderItemsResult?: UpdateMultipleOrderItemsResultResolvers<ContextType>;
  UpdateOrderItemErrorResult?: UpdateOrderItemErrorResultResolvers<ContextType>;
  UpdateOrderItemsResult?: UpdateOrderItemsResultResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  VerificationTokenExpiredError?: VerificationTokenExpiredErrorResolvers<ContextType>;
  VerificationTokenInvalidError?: VerificationTokenInvalidErrorResolvers<ContextType>;
  VerifyCustomerAccountResult?: VerifyCustomerAccountResultResolvers<ContextType>;
  Worker?: WorkerResolvers<ContextType>;
  Zone?: ZoneResolvers<ContextType>;
};

