import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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

export type AddFulfillmentToOrderResult = CreateFulfillmentError | EmptyOrderLineSelectionError | Fulfillment | FulfillmentStateTransitionError | InsufficientStockOnHandError | InvalidFulfillmentHandlerError | ItemsAlreadyFulfilledError;

export type AddItemInput = {
  productVariantId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type AddItemToDraftOrderInput = {
  productVariantId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type AddManualPaymentToOrderResult = ManualPaymentStateError | Order;

export type AddNoteToCustomerInput = {
  id: Scalars['ID']['input'];
  isPublic: Scalars['Boolean']['input'];
  note: Scalars['String']['input'];
};

export type AddNoteToOrderInput = {
  id: Scalars['ID']['input'];
  isPublic: Scalars['Boolean']['input'];
  note: Scalars['String']['input'];
};

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

export type AdjustDraftOrderLineInput = {
  orderLineId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
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

export type Administrator = Node & {
  __typename?: 'Administrator';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  emailAddress: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type AdministratorFilterParameter = {
  _and?: InputMaybe<Array<AdministratorFilterParameter>>;
  _or?: InputMaybe<Array<AdministratorFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  emailAddress?: InputMaybe<StringOperators>;
  firstName?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  lastName?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type AdministratorList = PaginatedList & {
  __typename?: 'AdministratorList';
  items: Array<Administrator>;
  totalItems: Scalars['Int']['output'];
};

export type AdministratorListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<AdministratorFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<AdministratorSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type AdministratorPaymentInput = {
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
};

export type AdministratorRefundInput = {
  /**
   * The amount to be refunded to this particular Payment. This was introduced in
   * v2.2.0 as the preferred way to specify the refund amount. The `lines`, `shipping` and `adjustment`
   * fields will be removed in a future version.
   */
  amount?: InputMaybe<Scalars['Money']['input']>;
  paymentId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type AdministratorSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  emailAddress?: InputMaybe<SortOrder>;
  firstName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  lastName?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type AggregatedMetadata = {
  __typename?: 'AggregatedMetadata';
  categories: Array<Category>;
  labels: Array<Label>;
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  models: Array<FacetValue>;
};

export type Allocation = Node & StockMovement & {
  __typename?: 'Allocation';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  orderLine: OrderLine;
  productVariant: ProductVariant;
  quantity: Scalars['Int']['output'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime']['output'];
};

/** Returned if an attempting to refund an OrderItem which has already been refunded */
export type AlreadyRefundedError = ErrorResult & {
  __typename?: 'AlreadyRefundedError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
  refundId: Scalars['ID']['output'];
};

export type ApiKey = Node & {
  __typename?: 'ApiKey';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  /** Helps you identify unused keys */
  lastUsedAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * ID by which we can look up the API-Key.
   * Also helps you identify keys without leaking the underlying secret API-Key.
   */
  lookupId: Scalars['String']['output'];
  /** A descriptive name so you can remind yourself where the API-Key gets used */
  name: Scalars['String']['output'];
  /**
   * Usually the user who created the ApiKey but could also be used as the basis for
   * restricting resolvers to `Permission.Owner` queries for customers for example.
   */
  owner: User;
  translations: Array<ApiKeyTranslation>;
  updatedAt: Scalars['DateTime']['output'];
  /** This is the underlying User which determines the kind of permissions for this API-Key. */
  user: User;
};

export type ApiKeyFilterParameter = {
  _and?: InputMaybe<Array<ApiKeyFilterParameter>>;
  _or?: InputMaybe<Array<ApiKeyFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  lastUsedAt?: InputMaybe<DateOperators>;
  lookupId?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type ApiKeyList = PaginatedList & {
  __typename?: 'ApiKeyList';
  items: Array<ApiKey>;
  totalItems: Scalars['Int']['output'];
};

export type ApiKeyListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<ApiKeyFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<ApiKeySortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type ApiKeySortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  lastUsedAt?: InputMaybe<SortOrder>;
  lookupId?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ApiKeyTranslation = Node & {
  __typename?: 'ApiKeyTranslation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  /** A descriptive name so you can remind yourself where the API-Key gets used */
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
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

export type AssetFilterParameter = {
  _and?: InputMaybe<Array<AssetFilterParameter>>;
  _or?: InputMaybe<Array<AssetFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  fileSize?: InputMaybe<NumberOperators>;
  height?: InputMaybe<NumberOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  mimeType?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  preview?: InputMaybe<StringOperators>;
  source?: InputMaybe<StringOperators>;
  type?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
  width?: InputMaybe<NumberOperators>;
};

export type AssetList = PaginatedList & {
  __typename?: 'AssetList';
  items: Array<Asset>;
  totalItems: Scalars['Int']['output'];
};

export type AssetListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<AssetFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<AssetSortParameter>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  tagsOperator?: InputMaybe<LogicalOperator>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type AssetSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  fileSize?: InputMaybe<SortOrder>;
  height?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  mimeType?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  preview?: InputMaybe<SortOrder>;
  source?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  width?: InputMaybe<SortOrder>;
};

export type AssetTranslation = {
  __typename?: 'AssetTranslation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AssetTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
};

export enum AssetType {
  BINARY = 'BINARY',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export type AssignAssetsToChannelInput = {
  assetIds: Array<Scalars['ID']['input']>;
  channelId: Scalars['ID']['input'];
};

export type AssignCollectionsToChannelInput = {
  channelId: Scalars['ID']['input'];
  collectionIds: Array<Scalars['ID']['input']>;
};

export type AssignFacetsToChannelInput = {
  channelId: Scalars['ID']['input'];
  facetIds: Array<Scalars['ID']['input']>;
};

export type AssignPaymentMethodsToChannelInput = {
  channelId: Scalars['ID']['input'];
  paymentMethodIds: Array<Scalars['ID']['input']>;
};

export type AssignProductOptionGroupsToChannelInput = {
  channelId: Scalars['ID']['input'];
  productOptionGroupIds: Array<Scalars['ID']['input']>;
};

export type AssignProductVariantsToChannelInput = {
  channelId: Scalars['ID']['input'];
  priceFactor?: InputMaybe<Scalars['Float']['input']>;
  productVariantIds: Array<Scalars['ID']['input']>;
};

export type AssignProductsToChannelInput = {
  channelId: Scalars['ID']['input'];
  priceFactor?: InputMaybe<Scalars['Float']['input']>;
  productIds: Array<Scalars['ID']['input']>;
};

export type AssignPromotionsToChannelInput = {
  channelId: Scalars['ID']['input'];
  promotionIds: Array<Scalars['ID']['input']>;
};

export type AssignShippingMethodsToChannelInput = {
  channelId: Scalars['ID']['input'];
  shippingMethodIds: Array<Scalars['ID']['input']>;
};

export type AssignStockLocationsToChannelInput = {
  channelId: Scalars['ID']['input'];
  stockLocationIds: Array<Scalars['ID']['input']>;
};

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
  native?: InputMaybe<NativeAuthInput>;
};

export type AuthenticationMethod = Node & {
  __typename?: 'AuthenticationMethod';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  strategy: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AuthenticationResult = CurrentUser | InvalidCredentialsError;

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

export type BannerTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  languageCode: LanguageCode;
  name: Scalars['String']['input'];
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

export type BannerTypeTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  languageCode: LanguageCode;
  name: Scalars['String']['input'];
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

/** Returned if an attempting to cancel lines from an Order which is still active */
export type CancelActiveOrderError = ErrorResult & {
  __typename?: 'CancelActiveOrderError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
  orderState: Scalars['String']['output'];
};

export type CancelOrderInput = {
  /** Specify whether the shipping charges should also be cancelled. Defaults to false */
  cancelShipping?: InputMaybe<Scalars['Boolean']['input']>;
  /** Optionally specify which OrderLines to cancel. If not provided, all OrderLines will be cancelled */
  lines?: InputMaybe<Array<OrderLineInput>>;
  /** The id of the order to be cancelled */
  orderId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type CancelOrderResult = CancelActiveOrderError | EmptyOrderLineSelectionError | MultipleOrderError | Order | OrderStateTransitionError | QuantityTooGreatError;

/** Returned if the Payment cancellation fails */
export type CancelPaymentError = ErrorResult & {
  __typename?: 'CancelPaymentError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
  paymentErrorMessage: Scalars['String']['output'];
};

export type CancelPaymentResult = CancelPaymentError | Payment | PaymentStateTransitionError;

export type Cancellation = Node & StockMovement & {
  __typename?: 'Cancellation';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  orderLine: OrderLine;
  productVariant: ProductVariant;
  quantity: Scalars['Int']['output'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime']['output'];
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

/**
 * Returned when the default LanguageCode of a Channel is no longer found in the `availableLanguages`
 * of the GlobalSettings
 */
export type ChannelDefaultLanguageError = ErrorResult & {
  __typename?: 'ChannelDefaultLanguageError';
  channelCode: Scalars['String']['output'];
  errorCode: ErrorCode;
  language: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type ChannelFilterParameter = {
  _and?: InputMaybe<Array<ChannelFilterParameter>>;
  _or?: InputMaybe<Array<ChannelFilterParameter>>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  currencyCode?: InputMaybe<StringOperators>;
  dayLimit?: InputMaybe<NumberOperators>;
  defaultCurrencyCode?: InputMaybe<StringOperators>;
  defaultLanguageCode?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  outOfStockThreshold?: InputMaybe<NumberOperators>;
  pricesIncludeTax?: InputMaybe<BooleanOperators>;
  token?: InputMaybe<StringOperators>;
  trackInventory?: InputMaybe<BooleanOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type ChannelList = PaginatedList & {
  __typename?: 'ChannelList';
  items: Array<Channel>;
  totalItems: Scalars['Int']['output'];
};

export type ChannelListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<ChannelFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<ChannelSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type ChannelSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  dayLimit?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  outOfStockThreshold?: InputMaybe<SortOrder>;
  token?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
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
  inheritFilters: Scalars['Boolean']['output'];
  isPrivate: Scalars['Boolean']['output'];
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
  inheritFilters?: InputMaybe<BooleanOperators>;
  isPrivate?: InputMaybe<BooleanOperators>;
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

export type CoordinateInput = {
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
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

export type CountryFilterParameter = {
  _and?: InputMaybe<Array<CountryFilterParameter>>;
  _or?: InputMaybe<Array<CountryFilterParameter>>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  parentId?: InputMaybe<IdOperators>;
  type?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type CountryList = PaginatedList & {
  __typename?: 'CountryList';
  items: Array<Country>;
  totalItems: Scalars['Int']['output'];
};

export type CountryListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<CountryFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<CountrySortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CountrySortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  parentId?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type CountryTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
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

export type CreateAdministratorInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  emailAddress: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  roleIds: Array<Scalars['ID']['input']>;
};

/**
 * There is no User ID because you can only create API-Keys for yourself,
 * which gets determined by the User who does the request.
 */
export type CreateApiKeyInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  /**
   * Which roles to attach to this ApiKey.
   * You may only grant roles which you, yourself have.
   */
  roleIds: Array<Scalars['ID']['input']>;
  translations: Array<CreateApiKeyTranslationInput>;
};

export type CreateApiKeyResult = {
  __typename?: 'CreateApiKeyResult';
  /** The generated API-Key. API-Keys cannot be viewed again after creation! */
  apiKey: Scalars['String']['output'];
  /** ID of the created ApiKey-Entity */
  entityId: Scalars['ID']['output'];
};

export type CreateApiKeyTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  languageCode: LanguageCode;
  /** A descriptive name so you can remind yourself where the API-Key gets used */
  name: Scalars['String']['input'];
};

export type CreateAssetInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  file: Scalars['Upload']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  translations?: InputMaybe<Array<AssetTranslationInput>>;
};

export type CreateAssetResult = Asset | MimeTypeError;

export type CreateBannerInput = {
  backColor?: InputMaybe<Scalars['String']['input']>;
  btnColor?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  counter?: InputMaybe<Scalars['Int']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled: Scalars['Boolean']['input'];
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  modelId?: InputMaybe<Scalars['ID']['input']>;
  productIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  productVariantIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  redirect: RedirectTypes;
  slug: Scalars['String']['input'];
  sort: Scalars['Int']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  translations: Array<BannerTranslationInput>;
  typeId: Scalars['ID']['input'];
};

export type CreateBannerTypeInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled: Scalars['Boolean']['input'];
  sort: Scalars['Int']['input'];
  translations: Array<BannerTypeTranslationInput>;
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

export type CreateChannelCustomFieldsInput = {
  dayLimit?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateChannelInput = {
  availableCurrencyCodes?: InputMaybe<Array<CurrencyCode>>;
  availableLanguageCodes?: InputMaybe<Array<LanguageCode>>;
  code: Scalars['String']['input'];
  customFields?: InputMaybe<CreateChannelCustomFieldsInput>;
  defaultCurrencyCode?: InputMaybe<CurrencyCode>;
  defaultLanguageCode: LanguageCode;
  defaultShippingZoneId: Scalars['ID']['input'];
  defaultTaxZoneId: Scalars['ID']['input'];
  outOfStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  pricesIncludeTax: Scalars['Boolean']['input'];
  sellerId?: InputMaybe<Scalars['ID']['input']>;
  token: Scalars['String']['input'];
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateChannelResult = Channel | LanguageNotAvailableError;

export type CreateCollectionInput = {
  assetIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  featuredAssetId?: InputMaybe<Scalars['ID']['input']>;
  filters: Array<ConfigurableOperationInput>;
  inheritFilters?: InputMaybe<Scalars['Boolean']['input']>;
  isPrivate?: InputMaybe<Scalars['Boolean']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  translations: Array<CreateCollectionTranslationInput>;
};

export type CreateCollectionTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  description: Scalars['String']['input'];
  languageCode: LanguageCode;
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
};

export type CreateCountryInput = {
  code: Scalars['String']['input'];
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled: Scalars['Boolean']['input'];
  translations: Array<CountryTranslationInput>;
};

export type CreateCustomerCustomFieldsInput = {
  birthDate?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCustomerGroupInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  customerIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  name: Scalars['String']['input'];
};

export type CreateCustomerInput = {
  customFields?: InputMaybe<CreateCustomerCustomFieldsInput>;
  emailAddress: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCustomerResult = Customer | EmailAddressConflictError;

export type CreateDayInput = {
  code: Scalars['String']['input'];
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  dayOffset?: InputMaybe<Scalars['Int']['input']>;
  enabled: Scalars['Boolean']['input'];
  sort: Scalars['Int']['input'];
  translations: Array<DayTranslationInput>;
  type: DayType;
};

export type CreateDeliveryMethodInput = {
  closeTime: Scalars['String']['input'];
  code: Scalars['String']['input'];
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  dayIds: Array<Scalars['ID']['input']>;
  enabled: Scalars['Boolean']['input'];
  from: Scalars['String']['input'];
  isDisabled: Scalars['Boolean']['input'];
  limitPrice?: InputMaybe<Scalars['Int']['input']>;
  maxCost?: InputMaybe<Scalars['Int']['input']>;
  minCost: Scalars['Int']['input'];
  showTime?: InputMaybe<Scalars['Boolean']['input']>;
  sort: Scalars['Int']['input'];
  to: Scalars['String']['input'];
  translations: Array<DeliveryMethodTranslationInput>;
  type: DeliveryMethodType;
};

export type CreateFacetInput = {
  code: Scalars['String']['input'];
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  isPrivate: Scalars['Boolean']['input'];
  translations: Array<FacetTranslationInput>;
  values?: InputMaybe<Array<CreateFacetValueWithFacetInput>>;
};

export type CreateFacetValueCustomFieldsInput = {
  categoriesIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type CreateFacetValueInput = {
  code: Scalars['String']['input'];
  customFields?: InputMaybe<CreateFacetValueCustomFieldsInput>;
  facetId: Scalars['ID']['input'];
  translations: Array<FacetValueTranslationInput>;
};

export type CreateFacetValueWithFacetInput = {
  code: Scalars['String']['input'];
  translations: Array<FacetValueTranslationInput>;
};

/** Returned if an error is thrown in a FulfillmentHandler's createFulfillment method */
export type CreateFulfillmentError = ErrorResult & {
  __typename?: 'CreateFulfillmentError';
  errorCode: ErrorCode;
  fulfillmentHandlerError: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type CreateGroupOptionInput = {
  code: Scalars['String']['input'];
  translations: Array<ProductOptionGroupTranslationInput>;
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

export type CreatePaymentMethodInput = {
  checker?: InputMaybe<ConfigurableOperationInput>;
  code: Scalars['String']['input'];
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled: Scalars['Boolean']['input'];
  handler: ConfigurableOperationInput;
  translations: Array<PaymentMethodTranslationInput>;
};

export type CreateProductCustomFieldsInput = {
  categoriesIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  isRecommended?: InputMaybe<Scalars['Boolean']['input']>;
  labelsIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type CreateProductInput = {
  assetIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  customFields?: InputMaybe<CreateProductCustomFieldsInput>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  facetValueIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  featuredAssetId?: InputMaybe<Scalars['ID']['input']>;
  translations: Array<ProductTranslationInput>;
};

export type CreateProductOptionGroupInput = {
  code: Scalars['String']['input'];
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  options?: InputMaybe<Array<CreateGroupOptionInput>>;
  translations: Array<ProductOptionGroupTranslationInput>;
};

export type CreateProductOptionInput = {
  code: Scalars['String']['input'];
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  productOptionGroupId: Scalars['ID']['input'];
  translations: Array<ProductOptionGroupTranslationInput>;
};

export type CreateProductVariantInput = {
  assetIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  facetValueIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  featuredAssetId?: InputMaybe<Scalars['ID']['input']>;
  optionIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  outOfStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Money']['input']>;
  prices?: InputMaybe<Array<InputMaybe<CreateProductVariantPriceInput>>>;
  productId: Scalars['ID']['input'];
  sku: Scalars['String']['input'];
  stockLevels?: InputMaybe<Array<StockLevelInput>>;
  stockOnHand?: InputMaybe<Scalars['Int']['input']>;
  taxCategoryId?: InputMaybe<Scalars['ID']['input']>;
  trackInventory?: InputMaybe<GlobalFlag>;
  translations: Array<ProductVariantTranslationInput>;
  useGlobalOutOfStockThreshold?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CreateProductVariantOptionInput = {
  code: Scalars['String']['input'];
  optionGroupId: Scalars['ID']['input'];
  translations: Array<ProductOptionTranslationInput>;
};

export type CreateProductVariantPriceInput = {
  currencyCode: CurrencyCode;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  price: Scalars['Money']['input'];
};

export type CreatePromotionCustomFieldsInput = {
  collectionType?: InputMaybe<Scalars['String']['input']>;
  internalPromoCode?: InputMaybe<Scalars['String']['input']>;
};

export type CreatePromotionInput = {
  actions: Array<ConfigurableOperationInput>;
  conditions: Array<ConfigurableOperationInput>;
  couponCode?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<CreatePromotionCustomFieldsInput>;
  enabled: Scalars['Boolean']['input'];
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  perCustomerUsageLimit?: InputMaybe<Scalars['Int']['input']>;
  startsAt?: InputMaybe<Scalars['DateTime']['input']>;
  translations: Array<PromotionTranslationInput>;
  usageLimit?: InputMaybe<Scalars['Int']['input']>;
};

export type CreatePromotionResult = MissingConditionsError | Promotion;

export type CreateProvinceInput = {
  code: Scalars['String']['input'];
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled: Scalars['Boolean']['input'];
  translations: Array<ProvinceTranslationInput>;
};

export type CreateRoleInput = {
  channelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  code: Scalars['String']['input'];
  description: Scalars['String']['input'];
  permissions: Array<Permission>;
};

export type CreateSeasonInput = {
  endDate: Scalars['DateTime']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  slug: Scalars['String']['input'];
  startDate: Scalars['DateTime']['input'];
  translations: Array<SeasonTranslationInput>;
};

export type CreateSellerInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  name: Scalars['String']['input'];
};

export type CreateShippingMethodInput = {
  calculator: ConfigurableOperationInput;
  checker: ConfigurableOperationInput;
  code: Scalars['String']['input'];
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  fulfillmentHandler: Scalars['String']['input'];
  translations: Array<ShippingMethodTranslationInput>;
};

export type CreateStockLocationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateTagInput = {
  value: Scalars['String']['input'];
};

export type CreateTaxCategoryInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type CreateTaxRateInput = {
  categoryId: Scalars['ID']['input'];
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  customerGroupId?: InputMaybe<Scalars['ID']['input']>;
  enabled: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  value: Scalars['Float']['input'];
  zoneId: Scalars['ID']['input'];
};

export type CreateWorkerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  erpCode?: InputMaybe<Scalars['String']['input']>;
  externalCode?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  phone: Scalars['String']['input'];
  role?: InputMaybe<WorkerRole>;
  sort?: InputMaybe<Scalars['Int']['input']>;
  username: Scalars['String']['input'];
  vehicle?: InputMaybe<Scalars['String']['input']>;
  vehiclePlate?: InputMaybe<Scalars['String']['input']>;
};

export type CreateZoneInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  memberIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  name: Scalars['String']['input'];
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

/**
 * This type is deprecated in v2.2 in favor of the EntityCustomFields type,
 * which allows custom fields to be defined on user-supplied entities.
 */
export type CustomFields = {
  __typename?: 'CustomFields';
  Address: Array<CustomFieldConfig>;
  Administrator: Array<CustomFieldConfig>;
  ApiKey: Array<CustomFieldConfig>;
  Asset: Array<CustomFieldConfig>;
  Banner: Array<CustomFieldConfig>;
  BannerType: Array<CustomFieldConfig>;
  Category: Array<CustomFieldConfig>;
  CategoryType: Array<CustomFieldConfig>;
  Channel: Array<CustomFieldConfig>;
  Collection: Array<CustomFieldConfig>;
  Customer: Array<CustomFieldConfig>;
  CustomerGroup: Array<CustomFieldConfig>;
  Day: Array<CustomFieldConfig>;
  DeliveryMethod: Array<CustomFieldConfig>;
  Facet: Array<CustomFieldConfig>;
  FacetValue: Array<CustomFieldConfig>;
  Fulfillment: Array<CustomFieldConfig>;
  GlobalSettings: Array<CustomFieldConfig>;
  HistoryEntry: Array<CustomFieldConfig>;
  Label: Array<CustomFieldConfig>;
  Order: Array<CustomFieldConfig>;
  OrderLine: Array<CustomFieldConfig>;
  Payment: Array<CustomFieldConfig>;
  PaymentMethod: Array<CustomFieldConfig>;
  Product: Array<CustomFieldConfig>;
  ProductOption: Array<CustomFieldConfig>;
  ProductOptionGroup: Array<CustomFieldConfig>;
  ProductVariant: Array<CustomFieldConfig>;
  ProductVariantPrice: Array<CustomFieldConfig>;
  Promotion: Array<CustomFieldConfig>;
  Refund: Array<CustomFieldConfig>;
  Region: Array<CustomFieldConfig>;
  Seller: Array<CustomFieldConfig>;
  Session: Array<CustomFieldConfig>;
  ShippingLine: Array<CustomFieldConfig>;
  ShippingMethod: Array<CustomFieldConfig>;
  StockLevel: Array<CustomFieldConfig>;
  StockLocation: Array<CustomFieldConfig>;
  StockMovement: Array<CustomFieldConfig>;
  TaxCategory: Array<CustomFieldConfig>;
  TaxRate: Array<CustomFieldConfig>;
  User: Array<CustomFieldConfig>;
  Zone: Array<CustomFieldConfig>;
};

export type Customer = Node & {
  __typename?: 'Customer';
  addresses?: Maybe<Array<Address>>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<CustomerCustomFields>;
  emailAddress: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  groups: Array<CustomerGroup>;
  history: HistoryEntryList;
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  orders: OrderList;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
};


export type CustomerHistoryArgs = {
  options?: InputMaybe<HistoryEntryListOptions>;
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
  postalCode?: InputMaybe<StringOperators>;
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

export type CustomerGroupFilterParameter = {
  _and?: InputMaybe<Array<CustomerGroupFilterParameter>>;
  _or?: InputMaybe<Array<CustomerGroupFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type CustomerGroupList = PaginatedList & {
  __typename?: 'CustomerGroupList';
  items: Array<CustomerGroup>;
  totalItems: Scalars['Int']['output'];
};

export type CustomerGroupListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<CustomerGroupFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<CustomerGroupSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type CustomerGroupSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
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

export type DashboardMetricSummary = {
  __typename?: 'DashboardMetricSummary';
  entries: Array<DashboardMetricSummaryEntry>;
  title: Scalars['String']['output'];
  type: DashboardMetricType;
};

export type DashboardMetricSummaryEntry = {
  __typename?: 'DashboardMetricSummaryEntry';
  label: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type DashboardMetricSummaryInput = {
  endDate: Scalars['DateTime']['input'];
  refresh?: InputMaybe<Scalars['Boolean']['input']>;
  startDate: Scalars['DateTime']['input'];
  types: Array<DashboardMetricType>;
};

export enum DashboardMetricType {
  AverageOrderValue = 'AverageOrderValue',
  OrderCount = 'OrderCount',
  OrderTotal = 'OrderTotal'
}

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

export type DayTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  languageCode: LanguageCode;
  name: Scalars['String']['input'];
};

export enum DayType {
  default = 'default',
  express = 'express'
}

export type DeleteAssetInput = {
  assetId: Scalars['ID']['input'];
  deleteFromAllChannels?: InputMaybe<Scalars['Boolean']['input']>;
  force?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DeleteAssetsInput = {
  assetIds: Array<Scalars['ID']['input']>;
  deleteFromAllChannels?: InputMaybe<Scalars['Boolean']['input']>;
  force?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DeleteStockLocationInput = {
  id: Scalars['ID']['input'];
  transferToLocationId?: InputMaybe<Scalars['ID']['input']>;
};

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

export type DeliveryMethodTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  description: Scalars['String']['input'];
  languageCode: LanguageCode;
  name: Scalars['String']['input'];
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

export type DuplicateEntityError = ErrorResult & {
  __typename?: 'DuplicateEntityError';
  duplicationError: Scalars['String']['output'];
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type DuplicateEntityInput = {
  duplicatorInput: ConfigurableOperationInput;
  entityId: Scalars['ID']['input'];
  entityName: Scalars['String']['input'];
};

export type DuplicateEntityResult = DuplicateEntityError | DuplicateEntitySuccess;

export type DuplicateEntitySuccess = {
  __typename?: 'DuplicateEntitySuccess';
  newEntityId: Scalars['ID']['output'];
};

/** Returned when attempting to create a Customer with an email address already registered to an existing User. */
export type EmailAddressConflictError = ErrorResult & {
  __typename?: 'EmailAddressConflictError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/** Returned if no OrderLines have been specified for the operation */
export type EmptyOrderLineSelectionError = ErrorResult & {
  __typename?: 'EmptyOrderLineSelectionError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type EntityCustomFields = {
  __typename?: 'EntityCustomFields';
  customFields: Array<CustomFieldConfig>;
  entityName: Scalars['String']['output'];
};

export type EntityDuplicatorDefinition = {
  __typename?: 'EntityDuplicatorDefinition';
  args: Array<ConfigArgDefinition>;
  code: Scalars['String']['output'];
  description: Scalars['String']['output'];
  forEntities: Array<Scalars['String']['output']>;
  requiresPermission: Array<Permission>;
};

export enum ErrorCode {
  ALREADY_REFUNDED_ERROR = 'ALREADY_REFUNDED_ERROR',
  CANCEL_ACTIVE_ORDER_ERROR = 'CANCEL_ACTIVE_ORDER_ERROR',
  CANCEL_PAYMENT_ERROR = 'CANCEL_PAYMENT_ERROR',
  CHANNEL_DEFAULT_LANGUAGE_ERROR = 'CHANNEL_DEFAULT_LANGUAGE_ERROR',
  COUPON_CODE_EXPIRED_ERROR = 'COUPON_CODE_EXPIRED_ERROR',
  COUPON_CODE_INVALID_ERROR = 'COUPON_CODE_INVALID_ERROR',
  COUPON_CODE_LIMIT_ERROR = 'COUPON_CODE_LIMIT_ERROR',
  CREATE_FULFILLMENT_ERROR = 'CREATE_FULFILLMENT_ERROR',
  DUPLICATE_ENTITY_ERROR = 'DUPLICATE_ENTITY_ERROR',
  EMAIL_ADDRESS_CONFLICT_ERROR = 'EMAIL_ADDRESS_CONFLICT_ERROR',
  EMPTY_ORDER_LINE_SELECTION_ERROR = 'EMPTY_ORDER_LINE_SELECTION_ERROR',
  FACET_IN_USE_ERROR = 'FACET_IN_USE_ERROR',
  FULFILLMENT_STATE_TRANSITION_ERROR = 'FULFILLMENT_STATE_TRANSITION_ERROR',
  GUEST_CHECKOUT_ERROR = 'GUEST_CHECKOUT_ERROR',
  INELIGIBLE_SHIPPING_METHOD_ERROR = 'INELIGIBLE_SHIPPING_METHOD_ERROR',
  INSUFFICIENT_STOCK_ERROR = 'INSUFFICIENT_STOCK_ERROR',
  INSUFFICIENT_STOCK_ON_HAND_ERROR = 'INSUFFICIENT_STOCK_ON_HAND_ERROR',
  INVALID_CREDENTIALS_ERROR = 'INVALID_CREDENTIALS_ERROR',
  INVALID_FULFILLMENT_HANDLER_ERROR = 'INVALID_FULFILLMENT_HANDLER_ERROR',
  ITEMS_ALREADY_FULFILLED_ERROR = 'ITEMS_ALREADY_FULFILLED_ERROR',
  LANGUAGE_NOT_AVAILABLE_ERROR = 'LANGUAGE_NOT_AVAILABLE_ERROR',
  MANUAL_PAYMENT_STATE_ERROR = 'MANUAL_PAYMENT_STATE_ERROR',
  MIME_TYPE_ERROR = 'MIME_TYPE_ERROR',
  MISSING_CONDITIONS_ERROR = 'MISSING_CONDITIONS_ERROR',
  MULTIPLE_ORDER_ERROR = 'MULTIPLE_ORDER_ERROR',
  NATIVE_AUTH_STRATEGY_ERROR = 'NATIVE_AUTH_STRATEGY_ERROR',
  NEGATIVE_QUANTITY_ERROR = 'NEGATIVE_QUANTITY_ERROR',
  NOTHING_TO_REFUND_ERROR = 'NOTHING_TO_REFUND_ERROR',
  NO_ACTIVE_ORDER_ERROR = 'NO_ACTIVE_ORDER_ERROR',
  NO_CHANGES_SPECIFIED_ERROR = 'NO_CHANGES_SPECIFIED_ERROR',
  ORDER_INTERCEPTOR_ERROR = 'ORDER_INTERCEPTOR_ERROR',
  ORDER_LIMIT_ERROR = 'ORDER_LIMIT_ERROR',
  ORDER_MODIFICATION_ERROR = 'ORDER_MODIFICATION_ERROR',
  ORDER_MODIFICATION_STATE_ERROR = 'ORDER_MODIFICATION_STATE_ERROR',
  ORDER_STATE_TRANSITION_ERROR = 'ORDER_STATE_TRANSITION_ERROR',
  PAYMENT_METHOD_MISSING_ERROR = 'PAYMENT_METHOD_MISSING_ERROR',
  PAYMENT_ORDER_MISMATCH_ERROR = 'PAYMENT_ORDER_MISMATCH_ERROR',
  PAYMENT_STATE_TRANSITION_ERROR = 'PAYMENT_STATE_TRANSITION_ERROR',
  PRODUCT_OPTION_GROUP_IN_USE_ERROR = 'PRODUCT_OPTION_GROUP_IN_USE_ERROR',
  PRODUCT_OPTION_IN_USE_ERROR = 'PRODUCT_OPTION_IN_USE_ERROR',
  QUANTITY_TOO_GREAT_ERROR = 'QUANTITY_TOO_GREAT_ERROR',
  REFUND_AMOUNT_ERROR = 'REFUND_AMOUNT_ERROR',
  REFUND_ORDER_STATE_ERROR = 'REFUND_ORDER_STATE_ERROR',
  REFUND_PAYMENT_ID_MISSING_ERROR = 'REFUND_PAYMENT_ID_MISSING_ERROR',
  REFUND_STATE_TRANSITION_ERROR = 'REFUND_STATE_TRANSITION_ERROR',
  SETTLE_PAYMENT_ERROR = 'SETTLE_PAYMENT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
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
  isPrivate: Scalars['Boolean']['output'];
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
  isPrivate?: InputMaybe<BooleanOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type FacetInUseError = ErrorResult & {
  __typename?: 'FacetInUseError';
  errorCode: ErrorCode;
  facetCode: Scalars['String']['output'];
  message: Scalars['String']['output'];
  productCount: Scalars['Int']['output'];
  variantCount: Scalars['Int']['output'];
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

export type FacetTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
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

export type FacetValueTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
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

export type FulfillOrderInput = {
  handler: ConfigurableOperationInput;
  lines: Array<OrderLineInput>;
};

export type Fulfillment = Node & {
  __typename?: 'Fulfillment';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  lines: Array<FulfillmentLine>;
  method: Scalars['String']['output'];
  nextStates: Array<Scalars['String']['output']>;
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

/** Returned when there is an error in transitioning the Fulfillment state */
export type FulfillmentStateTransitionError = ErrorResult & {
  __typename?: 'FulfillmentStateTransitionError';
  errorCode: ErrorCode;
  fromState: Scalars['String']['output'];
  message: Scalars['String']['output'];
  toState: Scalars['String']['output'];
  transitionError: Scalars['String']['output'];
};

export enum GlobalFlag {
  FALSE = 'FALSE',
  INHERIT = 'INHERIT',
  TRUE = 'TRUE'
}

export type GlobalSettings = {
  __typename?: 'GlobalSettings';
  availableLanguages: Array<LanguageCode>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  outOfStockThreshold: Scalars['Int']['output'];
  serverConfig: ServerConfig;
  trackInventory: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
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
  administrator?: Maybe<Administrator>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  data: Scalars['JSON']['output'];
  id: Scalars['ID']['output'];
  isPublic: Scalars['Boolean']['output'];
  type: HistoryEntryType;
  updatedAt: Scalars['DateTime']['output'];
};

export type HistoryEntryFilterParameter = {
  _and?: InputMaybe<Array<HistoryEntryFilterParameter>>;
  _or?: InputMaybe<Array<HistoryEntryFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  isPublic?: InputMaybe<BooleanOperators>;
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

export type ImageUploadResult = {
  __typename?: 'ImageUploadResult';
  errors: Array<Scalars['String']['output']>;
  matched: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
  unmatched: Scalars['Int']['output'];
  unmatchedFiles: Array<Scalars['String']['output']>;
};

export type ImportErrorRow = {
  __typename?: 'ImportErrorRow';
  error: Scalars['String']['output'];
  rowNumber: Scalars['Int']['output'];
  sku?: Maybe<Scalars['String']['output']>;
  suggestedFix?: Maybe<Scalars['String']['output']>;
};

export type ImportInfo = {
  __typename?: 'ImportInfo';
  errors?: Maybe<Array<Scalars['String']['output']>>;
  imported: Scalars['Int']['output'];
  processed: Scalars['Int']['output'];
};

export type ImportJob = Node & {
  __typename?: 'ImportJob';
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dryRun: Scalars['Boolean']['output'];
  durationMs?: Maybe<Scalars['Int']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  failedCount: Scalars['Int']['output'];
  fileName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  initiatedBy: Scalars['String']['output'];
  logs: Array<ImportLog>;
  mode: ImportMode;
  progress: Scalars['Int']['output'];
  /** Path to the generated Excel results report. Null until job completes. */
  reportPath?: Maybe<Scalars['String']['output']>;
  skippedCount: Scalars['Int']['output'];
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  status: ImportJobStatus;
  successCount: Scalars['Int']['output'];
  totalRows: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  warningCount: Scalars['Int']['output'];
};

export type ImportJobFilterParameter = {
  _and?: InputMaybe<Array<ImportJobFilterParameter>>;
  _or?: InputMaybe<Array<ImportJobFilterParameter>>;
  completedAt?: InputMaybe<DateOperators>;
  createdAt?: InputMaybe<DateOperators>;
  dryRun?: InputMaybe<BooleanOperators>;
  durationMs?: InputMaybe<NumberOperators>;
  errorMessage?: InputMaybe<StringOperators>;
  failedCount?: InputMaybe<NumberOperators>;
  fileName?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  initiatedBy?: InputMaybe<StringOperators>;
  mode?: InputMaybe<StringOperators>;
  progress?: InputMaybe<NumberOperators>;
  reportPath?: InputMaybe<StringOperators>;
  skippedCount?: InputMaybe<NumberOperators>;
  startedAt?: InputMaybe<DateOperators>;
  status?: InputMaybe<StringOperators>;
  successCount?: InputMaybe<NumberOperators>;
  totalRows?: InputMaybe<NumberOperators>;
  updatedAt?: InputMaybe<DateOperators>;
  warningCount?: InputMaybe<NumberOperators>;
};

export type ImportJobList = PaginatedList & {
  __typename?: 'ImportJobList';
  items: Array<ImportJob>;
  totalItems: Scalars['Int']['output'];
};

export type ImportJobListOptions = {
  filter?: InputMaybe<ImportJobFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<ImportJobSortParameter>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type ImportJobSortParameter = {
  completedAt?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  durationMs?: InputMaybe<SortOrder>;
  errorMessage?: InputMaybe<SortOrder>;
  failedCount?: InputMaybe<SortOrder>;
  fileName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  initiatedBy?: InputMaybe<SortOrder>;
  progress?: InputMaybe<SortOrder>;
  reportPath?: InputMaybe<SortOrder>;
  skippedCount?: InputMaybe<SortOrder>;
  startedAt?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  successCount?: InputMaybe<SortOrder>;
  totalRows?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  warningCount?: InputMaybe<SortOrder>;
};

export enum ImportJobStatus {
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING'
}

export type ImportLog = Node & {
  __typename?: 'ImportLog';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
  rowNumber: Scalars['Int']['output'];
  sku?: Maybe<Scalars['String']['output']>;
  status: ImportLogStatus;
  suggestedFix?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum ImportLogStatus {
  ERROR = 'ERROR',
  SKIPPED = 'SKIPPED',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING'
}

export enum ImportMode {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  UPSERT = 'UPSERT'
}

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

/**
 * Returned if attempting to create a Fulfillment when there is insufficient
 * stockOnHand of a ProductVariant to satisfy the requested quantity.
 */
export type InsufficientStockOnHandError = ErrorResult & {
  __typename?: 'InsufficientStockOnHandError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
  productVariantId: Scalars['ID']['output'];
  productVariantName: Scalars['String']['output'];
  stockOnHand: Scalars['Int']['output'];
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

/** Returned if the specified FulfillmentHandler code is not valid */
export type InvalidFulfillmentHandlerError = ErrorResult & {
  __typename?: 'InvalidFulfillmentHandlerError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/** Returned if the specified items are already part of a Fulfillment */
export type ItemsAlreadyFulfilledError = ErrorResult & {
  __typename?: 'ItemsAlreadyFulfilledError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type Job = Node & {
  __typename?: 'Job';
  attempts: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  data?: Maybe<Scalars['JSON']['output']>;
  duration: Scalars['Int']['output'];
  error?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  isSettled: Scalars['Boolean']['output'];
  progress: Scalars['Float']['output'];
  queueName: Scalars['String']['output'];
  result?: Maybe<Scalars['JSON']['output']>;
  retries: Scalars['Int']['output'];
  settledAt?: Maybe<Scalars['DateTime']['output']>;
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  state: JobState;
};

export type JobBufferSize = {
  __typename?: 'JobBufferSize';
  bufferId: Scalars['String']['output'];
  size: Scalars['Int']['output'];
};

export type JobFilterParameter = {
  _and?: InputMaybe<Array<JobFilterParameter>>;
  _or?: InputMaybe<Array<JobFilterParameter>>;
  attempts?: InputMaybe<NumberOperators>;
  createdAt?: InputMaybe<DateOperators>;
  duration?: InputMaybe<NumberOperators>;
  id?: InputMaybe<IdOperators>;
  isSettled?: InputMaybe<BooleanOperators>;
  progress?: InputMaybe<NumberOperators>;
  queueName?: InputMaybe<StringOperators>;
  retries?: InputMaybe<NumberOperators>;
  settledAt?: InputMaybe<DateOperators>;
  startedAt?: InputMaybe<DateOperators>;
  state?: InputMaybe<StringOperators>;
};

export type JobList = PaginatedList & {
  __typename?: 'JobList';
  items: Array<Job>;
  totalItems: Scalars['Int']['output'];
};

export type JobListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<JobFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<JobSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type JobQueue = {
  __typename?: 'JobQueue';
  name: Scalars['String']['output'];
  running: Scalars['Boolean']['output'];
};

export type JobSortParameter = {
  attempts?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  duration?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  progress?: InputMaybe<SortOrder>;
  queueName?: InputMaybe<SortOrder>;
  retries?: InputMaybe<SortOrder>;
  settledAt?: InputMaybe<SortOrder>;
  startedAt?: InputMaybe<SortOrder>;
};

/**
 * @description
 * The state of a Job in the JobQueue
 *
 * @docsCategory common
 */
export enum JobState {
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  RETRYING = 'RETRYING',
  RUNNING = 'RUNNING'
}

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

/** Returned if attempting to set a Channel's defaultLanguageCode to a language which is not enabled in GlobalSettings */
export type LanguageNotAvailableError = ErrorResult & {
  __typename?: 'LanguageNotAvailableError';
  errorCode: ErrorCode;
  languageCode: Scalars['String']['output'];
  message: Scalars['String']['output'];
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

export type ManualPaymentInput = {
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  method: Scalars['String']['input'];
  orderId: Scalars['ID']['input'];
  transactionId?: InputMaybe<Scalars['String']['input']>;
};

/**
 * Returned when a call to addManualPaymentToOrder is made but the Order
 * is not in the required state.
 */
export type ManualPaymentStateError = ErrorResult & {
  __typename?: 'ManualPaymentStateError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type MeiliAnalytics = {
  __typename?: 'MeiliAnalytics';
  emptyResultTerms: Array<SearchTermStat>;
  failedSyncCount: Scalars['Float']['output'];
  lastSyncTime?: Maybe<Scalars['String']['output']>;
  topSearchTerms: Array<SearchTermStat>;
  totalSearchRequests: Scalars['Float']['output'];
};

export type MeiliHealthStatus = {
  __typename?: 'MeiliHealthStatus';
  dbSizeBytes: Scalars['Float']['output'];
  isHealthy: Scalars['Boolean']['output'];
  lastUpdated: Scalars['String']['output'];
  status: Scalars['String']['output'];
  version?: Maybe<Scalars['String']['output']>;
};

export type MeiliIndexStats = {
  __typename?: 'MeiliIndexStats';
  documentCount: Scalars['Int']['output'];
  indexName: Scalars['String']['output'];
  isIndexing: Scalars['Boolean']['output'];
};

export type MeiliMonitoringResult = {
  __typename?: 'MeiliMonitoringResult';
  analytics: MeiliAnalytics;
  health: MeiliHealthStatus;
  indexStats: MeiliIndexStats;
  syncProgress: MeiliSyncProgress;
  taskStats: MeiliTaskStats;
};

export type MeiliRecentTask = {
  __typename?: 'MeiliRecentTask';
  duration?: Maybe<Scalars['String']['output']>;
  enqueuedAt: Scalars['String']['output'];
  finishedAt?: Maybe<Scalars['String']['output']>;
  startedAt?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  type: Scalars['String']['output'];
  uid: Scalars['Int']['output'];
};

export type MeiliSettingsInput = {
  filterableAttributes?: InputMaybe<Array<Scalars['String']['input']>>;
  rankingRules?: InputMaybe<Array<Scalars['String']['input']>>;
  searchableAttributes?: InputMaybe<Array<Scalars['String']['input']>>;
  sortableAttributes?: InputMaybe<Array<Scalars['String']['input']>>;
  stopWords?: InputMaybe<Array<Scalars['String']['input']>>;
  synonyms?: InputMaybe<Scalars['String']['input']>;
  typoOneTypo?: InputMaybe<Scalars['Int']['input']>;
  typoToleranceEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  typoTwoTypos?: InputMaybe<Scalars['Int']['input']>;
};

export type MeiliSettingsResult = {
  __typename?: 'MeiliSettingsResult';
  filterableAttributes: Array<Scalars['String']['output']>;
  rankingRules: Array<Scalars['String']['output']>;
  searchableAttributes: Array<Scalars['String']['output']>;
  sortableAttributes: Array<Scalars['String']['output']>;
  stopWords: Array<Scalars['String']['output']>;
  synonyms: Scalars['String']['output'];
  typoOneTypo: Scalars['Int']['output'];
  typoToleranceEnabled: Scalars['Boolean']['output'];
  typoTwoTypos: Scalars['Int']['output'];
};

export type MeiliSyncProgress = {
  __typename?: 'MeiliSyncProgress';
  completedAt?: Maybe<Scalars['String']['output']>;
  failed: Scalars['Int']['output'];
  inProgress: Scalars['Boolean']['output'];
  indexed: Scalars['Int']['output'];
  lastError?: Maybe<Scalars['String']['output']>;
  startedAt?: Maybe<Scalars['String']['output']>;
  total: Scalars['Int']['output'];
};

export type MeiliTaskStats = {
  __typename?: 'MeiliTaskStats';
  enqueuedTasks: Scalars['Int']['output'];
  failedTasks: Scalars['Int']['output'];
  pendingTasks: Scalars['Int']['output'];
  processingTasks: Scalars['Int']['output'];
  recentTasks: Array<MeiliRecentTask>;
  succeededTasks: Scalars['Int']['output'];
  totalTasks: Scalars['Int']['output'];
};

export type MimeTypeError = ErrorResult & {
  __typename?: 'MimeTypeError';
  errorCode: ErrorCode;
  fileName: Scalars['String']['output'];
  message: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
};

/** Returned if a PromotionCondition has neither a couponCode nor any conditions set */
export type MissingConditionsError = ErrorResult & {
  __typename?: 'MissingConditionsError';
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

export type ModifyOrderInput = {
  addItems?: InputMaybe<Array<AddItemInput>>;
  adjustOrderLines?: InputMaybe<Array<OrderLineInput>>;
  couponCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  customFields?: InputMaybe<UpdateOrderCustomFieldsInput>;
  dryRun: Scalars['Boolean']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<ModifyOrderOptions>;
  orderId: Scalars['ID']['input'];
  /**
   * Deprecated in v2.2.0. Use `refunds` instead to allow multiple refunds to be
   * applied in the case that multiple payment methods have been used on the order.
   */
  refund?: InputMaybe<AdministratorRefundInput>;
  refunds?: InputMaybe<Array<AdministratorRefundInput>>;
  /** Added in v2.2 */
  shippingMethodIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  surcharges?: InputMaybe<Array<SurchargeInput>>;
  updateBillingAddress?: InputMaybe<UpdateOrderAddressInput>;
  updateShippingAddress?: InputMaybe<UpdateOrderAddressInput>;
};

export type ModifyOrderOptions = {
  freezePromotions?: InputMaybe<Scalars['Boolean']['input']>;
  recalculateShipping?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ModifyOrderResult = CouponCodeExpiredError | CouponCodeInvalidError | CouponCodeLimitError | IneligibleShippingMethodError | InsufficientStockError | NegativeQuantityError | NoChangesSpecifiedError | Order | OrderLimitError | OrderModificationStateError | PaymentMethodMissingError | RefundPaymentIdMissingError;

export type MoveCollectionInput = {
  collectionId: Scalars['ID']['input'];
  index: Scalars['Int']['input'];
  parentId: Scalars['ID']['input'];
};

/** Returned if an operation has specified OrderLines from multiple Orders */
export type MultipleOrderError = ErrorResult & {
  __typename?: 'MultipleOrderError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Add Customers to a CustomerGroup */
  addCustomersToGroup: CustomerGroup;
  addFulfillmentToOrder: AddFulfillmentToOrderResult;
  /** Adds an item to the draft Order. */
  addItemToDraftOrder: UpdateOrderItemsResult;
  /**
   * Used to manually create a new Payment against an Order.
   * This can be used by an Administrator when an Order is in the ArrangingPayment state.
   *
   * It is also used when a completed Order
   * has been modified (using `modifyOrder`) and the price has increased. The extra payment
   * can then be manually arranged by the administrator, and the details used to create a new
   * Payment.
   */
  addManualPaymentToOrder: AddManualPaymentToOrderResult;
  /** Add members to a Zone */
  addMembersToZone: Zone;
  addNoteToCustomer: Customer;
  addNoteToOrder: Order;
  /** Add an OptionGroup to a Product */
  addOptionGroupToProduct: Product;
  /** Adjusts a draft OrderLine. If custom fields are defined on the OrderLine entity, a third argument 'customFields' of type `OrderLineCustomFieldsInput` will be available. */
  adjustDraftOrderLine: UpdateOrderItemsResult;
  /** Applies the given coupon code to the draft Order */
  applyCouponCodeToDraftOrder: ApplyCouponCodeResult;
  applyDeliveryMethod: Order;
  /** Assign assets to channel */
  assignAssetsToChannel: Array<Asset>;
  /** Assigns Collections to the specified Channel */
  assignCollectionsToChannel: Array<Collection>;
  assignCourierToOrder: Order;
  /** Assigns Facets to the specified Channel */
  assignFacetsToChannel: Array<Facet>;
  /** Assigns PaymentMethods to the specified Channel */
  assignPaymentMethodsToChannel: Array<PaymentMethod>;
  /** Assigns ProductOptionGroups to the specified Channel */
  assignProductOptionGroupsToChannel: Array<ProductOptionGroup>;
  /** Assigns ProductVariants to the specified Channel */
  assignProductVariantsToChannel: Array<ProductVariant>;
  /** Assigns all ProductVariants of Product to the specified Channel */
  assignProductsToChannel: Array<Product>;
  assignProductsToSeason: Season;
  /** Assigns Promotions to the specified Channel */
  assignPromotionsToChannel: Array<Promotion>;
  /** Assign a Role to an Administrator */
  assignRoleToAdministrator: Administrator;
  /** Assigns ShippingMethods to the specified Channel */
  assignShippingMethodsToChannel: Array<ShippingMethod>;
  /** Assigns StockLocations to the specified Channel */
  assignStockLocationsToChannel: Array<StockLocation>;
  /** Authenticates the user using a named authentication strategy */
  authenticate: AuthenticationResult;
  cancelImportJob: ImportJob;
  cancelJob: Job;
  cancelOrder: CancelOrderResult;
  cancelPayment: CancelPaymentResult;
  /** Create a new Administrator */
  createAdministrator: Administrator;
  /**
   * Generates a new API-Key and attaches it to an Administrator.
   * Returns the generated API-Key.
   * API-Keys cannot be viewed again after creation.
   */
  createApiKey: CreateApiKeyResult;
  /** Create a new Asset */
  createAssets: Array<CreateAssetResult>;
  createBanner: Banner;
  createBannerType: BannerType;
  createCategory: Category;
  createCategoryType: CategoryType;
  /** Create a new Channel */
  createChannel: CreateChannelResult;
  /** Create a new Collection */
  createCollection: Collection;
  /** Create a new Country */
  createCountry: Country;
  /** Create a new Customer. If a password is provided, a new User will also be created an linked to the Customer. */
  createCustomer: CreateCustomerResult;
  /** Create a new Address and associate it with the Customer specified by customerId */
  createCustomerAddress: Address;
  /** Create a new CustomerGroup */
  createCustomerGroup: CustomerGroup;
  createDay: Day;
  createDeliveryMethod: DeliveryMethod;
  /** Creates a draft Order */
  createDraftOrder: Order;
  /** Create a new Facet */
  createFacet: Facet;
  /** Create a single FacetValue */
  createFacetValue: FacetValue;
  /** Create one or more FacetValues */
  createFacetValues: Array<FacetValue>;
  createLabel: Label;
  /** Create existing PaymentMethod */
  createPaymentMethod: PaymentMethod;
  /** Create a new Product */
  createProduct: Product;
  /** Create a new ProductOption within a ProductOptionGroup */
  createProductOption: ProductOption;
  /** Create a new ProductOptionGroup */
  createProductOptionGroup: ProductOptionGroup;
  /** Create a set of ProductVariants based on the OptionGroups assigned to the given Product */
  createProductVariants: Array<Maybe<ProductVariant>>;
  createPromotion: CreatePromotionResult;
  /** Create a new Province */
  createProvince: Province;
  /** Create a new Role */
  createRole: Role;
  createSeason: Season;
  /** Create a new Seller */
  createSeller: Seller;
  /** Create a new ShippingMethod */
  createShippingMethod: ShippingMethod;
  createStockLocation: StockLocation;
  /** Create a new Tag */
  createTag: Tag;
  /** Create a new TaxCategory */
  createTaxCategory: TaxCategory;
  /** Create a new TaxRate */
  createTaxRate: TaxRate;
  createWorker: Worker;
  /** Create a new Zone */
  createZone: Zone;
  /** Delete an Administrator */
  deleteAdministrator: DeletionResponse;
  /** Delete multiple Administrators */
  deleteAdministrators: Array<DeletionResponse>;
  /** Deletes API-Keys */
  deleteApiKeys: Array<DeletionResponse>;
  /** Delete an Asset */
  deleteAsset: DeletionResponse;
  /** Delete multiple Assets */
  deleteAssets: DeletionResponse;
  deleteBanner: DeletionResponse;
  deleteBannerType: DeletionResponse;
  deleteBannerTypes: Array<DeletionResponse>;
  deleteBanners: Array<DeletionResponse>;
  deleteCategory: DeletionResponse;
  deleteCategoryType: DeletionResponse;
  /** Delete a Channel */
  deleteChannel: DeletionResponse;
  /** Delete multiple Channels */
  deleteChannels: Array<DeletionResponse>;
  /** Delete a Collection and all of its descendants */
  deleteCollection: DeletionResponse;
  /** Delete multiple Collections and all of their descendants */
  deleteCollections: Array<DeletionResponse>;
  /** Delete multiple Countries */
  deleteCountries: Array<DeletionResponse>;
  /** Delete a Country */
  deleteCountry: DeletionResponse;
  /** Delete a Customer */
  deleteCustomer: DeletionResponse;
  /** Deletes the current customer account (soft delete) */
  deleteCustomerAccount: AuthDeletionResponse;
  /** Update an existing Address */
  deleteCustomerAddress: Success;
  /** Delete a CustomerGroup */
  deleteCustomerGroup: DeletionResponse;
  /** Delete multiple CustomerGroups */
  deleteCustomerGroups: Array<DeletionResponse>;
  deleteCustomerNote: DeletionResponse;
  /** Deletes Customers */
  deleteCustomers: Array<DeletionResponse>;
  deleteDay: Scalars['Boolean']['output'];
  deleteDeliveryMethod: Scalars['Boolean']['output'];
  /** Deletes a draft Order */
  deleteDraftOrder: DeletionResponse;
  /** Delete an existing Facet */
  deleteFacet: DeletionResponse;
  /** Delete one or more FacetValues */
  deleteFacetValues: Array<DeletionResponse>;
  /** Delete multiple existing Facets */
  deleteFacets: Array<DeletionResponse>;
  deleteLabel: DeletionResponse;
  deleteOrderNote: DeletionResponse;
  /** Delete a PaymentMethod */
  deletePaymentMethod: DeletionResponse;
  /** Delete multiple PaymentMethods */
  deletePaymentMethods: Array<DeletionResponse>;
  /** Delete a Product */
  deleteProduct: DeletionResponse;
  /** Delete a ProductOption */
  deleteProductOption: DeletionResponse;
  /** Delete a ProductOptionGroup */
  deleteProductOptionGroup: DeletionResponse;
  /** Delete multiple ProductOptionGroups */
  deleteProductOptionGroups: Array<DeletionResponse>;
  /** Delete a ProductVariant */
  deleteProductVariant: DeletionResponse;
  /** Delete multiple ProductVariants */
  deleteProductVariants: Array<DeletionResponse>;
  /** Delete multiple Products */
  deleteProducts: Array<DeletionResponse>;
  deletePromotion: DeletionResponse;
  deletePromotions: Array<DeletionResponse>;
  /** Delete a Province */
  deleteProvince: DeletionResponse;
  /** Delete an existing Role */
  deleteRole: DeletionResponse;
  /** Delete multiple Roles */
  deleteRoles: Array<DeletionResponse>;
  deleteSeason: DeletionResponse;
  /** Delete a Seller */
  deleteSeller: DeletionResponse;
  /** Delete multiple Sellers */
  deleteSellers: Array<DeletionResponse>;
  /** Delete a ShippingMethod */
  deleteShippingMethod: DeletionResponse;
  /** Delete multiple ShippingMethods */
  deleteShippingMethods: Array<DeletionResponse>;
  deleteStockLocation: DeletionResponse;
  deleteStockLocations: Array<DeletionResponse>;
  /** Delete an existing Tag */
  deleteTag: DeletionResponse;
  /** Deletes multiple TaxCategories */
  deleteTaxCategories: Array<DeletionResponse>;
  /** Deletes a TaxCategory */
  deleteTaxCategory: DeletionResponse;
  /** Delete a TaxRate */
  deleteTaxRate: DeletionResponse;
  /** Delete multiple TaxRates */
  deleteTaxRates: Array<DeletionResponse>;
  deleteWorker: DeletionResponse;
  /** Delete a Zone */
  deleteZone: DeletionResponse;
  /** Delete a Zone */
  deleteZones: Array<DeletionResponse>;
  /**
   * Duplicate an existing entity using a specific EntityDuplicator.
   * Since v2.2.0.
   */
  duplicateEntity: DuplicateEntityResult;
  editButtonState: DeliveryMethod;
  flushBufferedJobs: Success;
  importProducts?: Maybe<ImportInfo>;
  /**
   * Authenticates the user using the native authentication strategy. This mutation is an alias for authenticate({ native: { ... }})
   *
   * The `rememberMe` option applies when using cookie-based sessions, and if `true` it will set the maxAge of the session cookie
   * to 1 year.
   */
  login: NativeAuthenticationResult;
  logout: Success;
  meiliClearIndex: Scalars['Boolean']['output'];
  meiliForceSync: Scalars['Boolean']['output'];
  meiliResetAnalytics: Scalars['Boolean']['output'];
  /** Run a full reindex inline on the server process (bypassing the worker job queue). Returns immediately; sync runs in the background. Use as a fallback when worker queue is not delivering jobs. */
  meiliRunSyncInline: Scalars['Boolean']['output'];
  /**
   * Allows an Order to be modified after it has been completed by the Customer. The Order must first
   * be in the `Modifying` state.
   */
  modifyOrder: ModifyOrderResult;
  /** Move a Collection to a different parent or index */
  moveCollection: Collection;
  refundOrder: RefundOrderResult;
  reindex: Job;
  removeBannerAsset: Banner;
  /** Removes Collections from the specified Channel */
  removeCollectionsFromChannel: Array<Collection>;
  /** Removes the given coupon code from the draft Order */
  removeCouponCodeFromDraftOrder?: Maybe<Order>;
  /** Remove Customers from a CustomerGroup */
  removeCustomersFromGroup: CustomerGroup;
  /** Remove an OrderLine from the draft Order */
  removeDraftOrderLine: RemoveOrderItemsResult;
  /** Removes Facets from the specified Channel */
  removeFacetsFromChannel: Array<RemoveFacetFromChannelResult>;
  /** Remove members from a Zone */
  removeMembersFromZone: Zone;
  /**
   * Remove an OptionGroup from a Product. If the OptionGroup is in use by any ProductVariants
   * the mutation will return a ProductOptionInUseError, and the OptionGroup will not be removed.
   * Setting the `force` argument to `true` will override this and remove the OptionGroup anyway,
   * as well as removing any of the group's options from the Product's ProductVariants.
   */
  removeOptionGroupFromProduct: RemoveOptionGroupFromProductResult;
  /** Removes PaymentMethods from the specified Channel */
  removePaymentMethodsFromChannel: Array<PaymentMethod>;
  /** Removes ProductOptionGroups from the specified Channel */
  removeProductOptionGroupsFromChannel: Array<RemoveProductOptionGroupFromChannelResult>;
  /** Removes ProductVariants from the specified Channel */
  removeProductVariantsFromChannel: Array<ProductVariant>;
  /** Removes all ProductVariants of Product from the specified Channel */
  removeProductsFromChannel: Array<Product>;
  removeProductsFromSeason: Season;
  /** Removes Promotions from the specified Channel */
  removePromotionsFromChannel: Array<Promotion>;
  /** Remove all settled jobs in the given queues older than the given date. Returns the number of jobs deleted. */
  removeSettledJobs: Scalars['Int']['output'];
  /** Removes ShippingMethods from the specified Channel */
  removeShippingMethodsFromChannel: Array<ShippingMethod>;
  /** Removes StockLocations from the specified Channel */
  removeStockLocationsFromChannel: Array<StockLocation>;
  /**
   * Replaces the old with a new API-Key.
   * This is a convenience method to invalidate an API-Key without
   * deleting the underlying roles and permissions.
   */
  rotateApiKey: RotateApiKeyResult;
  runMeiliInitialSync: Scalars['Boolean']['output'];
  runPendingSearchIndexUpdates: Success;
  runScheduledTask: Success;
  setCustomerForDraftOrder: SetCustomerForDraftOrderResult;
  /** Sets the billing address for a draft Order */
  setDraftOrderBillingAddress: Order;
  /** Allows any custom fields to be set for the active order */
  setDraftOrderCustomFields: Order;
  /** Sets the shipping address for a draft Order */
  setDraftOrderShippingAddress: Order;
  /** Sets the shipping method by id, which can be obtained with the `eligibleShippingMethodsForDraftOrder` query */
  setDraftOrderShippingMethod: SetOrderShippingMethodResult;
  setOrderCustomFields?: Maybe<Order>;
  /** Allows a different Customer to be assigned to an Order. Added in v2.2.0. */
  setOrderCustomer?: Maybe<Order>;
  /** Set a single key-value pair (automatically scoped based on field configuration) */
  setSettingsStoreValue: SetSettingsStoreValueResult;
  /** Set multiple key-value pairs in a transaction (each automatically scoped) */
  setSettingsStoreValues: Array<SetSettingsStoreValueResult>;
  settlePayment: SettlePaymentResult;
  settleRefund: SettleRefundResult;
  syncMeilisearchNow: Scalars['Boolean']['output'];
  trackBannerClick: Scalars['Boolean']['output'];
  transitionFulfillmentToState: TransitionFulfillmentToStateResult;
  transitionOrderToState?: Maybe<TransitionOrderToStateResult>;
  transitionPaymentToState: TransitionPaymentToStateResult;
  unassignCourierFromOrder: Order;
  /** Unsets the billing address for a draft Order */
  unsetDraftOrderBillingAddress: Order;
  /** Unsets the shipping address for a draft Order */
  unsetDraftOrderShippingAddress: Order;
  /** Update the active (currently logged-in) Administrator */
  updateActiveAdministrator: Administrator;
  /** Update an existing Administrator */
  updateAdministrator: Administrator;
  /** Updates an API-Key */
  updateApiKey: ApiKey;
  /** Update an existing Asset */
  updateAsset: Asset;
  updateBanner: Banner;
  updateBannerType: BannerType;
  updateCategory: Category;
  updateCategoryType: CategoryType;
  /** Update an existing Channel */
  updateChannel: UpdateChannelResult;
  /** Update an existing Collection */
  updateCollection: Collection;
  /** Update an existing Country */
  updateCountry: Country;
  /** Update an existing Customer */
  updateCustomer: UpdateCustomerResult;
  /** Update an existing Address */
  updateCustomerAddress: Address;
  /** Update an existing CustomerGroup */
  updateCustomerGroup: CustomerGroup;
  updateCustomerNote: HistoryEntry;
  updateDay: Day;
  updateDeliveryMethod: DeliveryMethod;
  /** Update an existing Facet */
  updateFacet: Facet;
  /** Update a single FacetValue */
  updateFacetValue: FacetValue;
  /** Update one or more FacetValues */
  updateFacetValues: Array<FacetValue>;
  updateGlobalSettings: UpdateGlobalSettingsResult;
  updateLabel: Label;
  updateMeiliSettings: MeiliSettingsResult;
  updateOrderNote: HistoryEntry;
  /** Update an existing PaymentMethod */
  updatePaymentMethod: PaymentMethod;
  /** Update an existing Product */
  updateProduct: Product;
  /** Create a new ProductOption within a ProductOptionGroup */
  updateProductOption: ProductOption;
  /** Update an existing ProductOptionGroup */
  updateProductOptionGroup: ProductOptionGroup;
  /** Update an existing ProductVariant */
  updateProductVariant: ProductVariant;
  /** Update existing ProductVariants */
  updateProductVariants: Array<Maybe<ProductVariant>>;
  /** Update multiple existing Products */
  updateProducts: Array<Product>;
  updatePromotion: UpdatePromotionResult;
  /** Update an existing Province */
  updateProvince: Province;
  /** Update an existing Role */
  updateRole: Role;
  updateScheduledTask: ScheduledTask;
  updateSeason: Season;
  /** Update an existing Seller */
  updateSeller: Seller;
  /** Update an existing ShippingMethod */
  updateShippingMethod: ShippingMethod;
  updateStockLocation: StockLocation;
  /** Update an existing Tag */
  updateTag: Tag;
  /** Update an existing TaxCategory */
  updateTaxCategory: TaxCategory;
  /** Update an existing TaxRate */
  updateTaxRate: TaxRate;
  updateWorker: Worker;
  /** Update an existing Zone */
  updateZone: Zone;
  uploadProductExcel: ImportJob;
  uploadProductImages: ImageUploadResult;
  upsertBannerAsset: Banner;
};


export type MutationAddCustomersToGroupArgs = {
  customerGroupId: Scalars['ID']['input'];
  customerIds: Array<Scalars['ID']['input']>;
};


export type MutationAddFulfillmentToOrderArgs = {
  input: FulfillOrderInput;
};


export type MutationAddItemToDraftOrderArgs = {
  input: AddItemToDraftOrderInput;
  orderId: Scalars['ID']['input'];
};


export type MutationAddManualPaymentToOrderArgs = {
  input: ManualPaymentInput;
};


export type MutationAddMembersToZoneArgs = {
  memberIds: Array<Scalars['ID']['input']>;
  zoneId: Scalars['ID']['input'];
};


export type MutationAddNoteToCustomerArgs = {
  input: AddNoteToCustomerInput;
};


export type MutationAddNoteToOrderArgs = {
  input: AddNoteToOrderInput;
};


export type MutationAddOptionGroupToProductArgs = {
  optionGroupId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
};


export type MutationAdjustDraftOrderLineArgs = {
  input: AdjustDraftOrderLineInput;
  orderId: Scalars['ID']['input'];
};


export type MutationApplyCouponCodeToDraftOrderArgs = {
  couponCode: Scalars['String']['input'];
  orderId: Scalars['ID']['input'];
};


export type MutationApplyDeliveryMethodArgs = {
  deliveryMethodId: Scalars['ID']['input'];
  orderId: Scalars['ID']['input'];
};


export type MutationAssignAssetsToChannelArgs = {
  input: AssignAssetsToChannelInput;
};


export type MutationAssignCollectionsToChannelArgs = {
  input: AssignCollectionsToChannelInput;
};


export type MutationAssignCourierToOrderArgs = {
  courierId: Scalars['ID']['input'];
  orderId: Scalars['ID']['input'];
};


export type MutationAssignFacetsToChannelArgs = {
  input: AssignFacetsToChannelInput;
};


export type MutationAssignPaymentMethodsToChannelArgs = {
  input: AssignPaymentMethodsToChannelInput;
};


export type MutationAssignProductOptionGroupsToChannelArgs = {
  input: AssignProductOptionGroupsToChannelInput;
};


export type MutationAssignProductVariantsToChannelArgs = {
  input: AssignProductVariantsToChannelInput;
};


export type MutationAssignProductsToChannelArgs = {
  input: AssignProductsToChannelInput;
};


export type MutationAssignProductsToSeasonArgs = {
  productIds: Array<Scalars['ID']['input']>;
  seasonId: Scalars['ID']['input'];
};


export type MutationAssignPromotionsToChannelArgs = {
  input: AssignPromotionsToChannelInput;
};


export type MutationAssignRoleToAdministratorArgs = {
  administratorId: Scalars['ID']['input'];
  roleId: Scalars['ID']['input'];
};


export type MutationAssignShippingMethodsToChannelArgs = {
  input: AssignShippingMethodsToChannelInput;
};


export type MutationAssignStockLocationsToChannelArgs = {
  input: AssignStockLocationsToChannelInput;
};


export type MutationAuthenticateArgs = {
  input: AuthenticationInput;
  rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationCancelImportJobArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelJobArgs = {
  jobId: Scalars['ID']['input'];
};


export type MutationCancelOrderArgs = {
  input: CancelOrderInput;
};


export type MutationCancelPaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateAdministratorArgs = {
  input: CreateAdministratorInput;
};


export type MutationCreateApiKeyArgs = {
  input: CreateApiKeyInput;
};


export type MutationCreateAssetsArgs = {
  input: Array<CreateAssetInput>;
};


export type MutationCreateBannerArgs = {
  input: CreateBannerInput;
};


export type MutationCreateBannerTypeArgs = {
  input: CreateBannerTypeInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateCategoryTypeArgs = {
  input: CreateCategoryTypeInput;
};


export type MutationCreateChannelArgs = {
  input: CreateChannelInput;
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};


export type MutationCreateCountryArgs = {
  input: CreateCountryInput;
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
  password?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateCustomerAddressArgs = {
  customerId: Scalars['ID']['input'];
  input: CreateAddressInput;
};


export type MutationCreateCustomerGroupArgs = {
  input: CreateCustomerGroupInput;
};


export type MutationCreateDayArgs = {
  input: CreateDayInput;
};


export type MutationCreateDeliveryMethodArgs = {
  input: CreateDeliveryMethodInput;
};


export type MutationCreateFacetArgs = {
  input: CreateFacetInput;
};


export type MutationCreateFacetValueArgs = {
  input: CreateFacetValueInput;
};


export type MutationCreateFacetValuesArgs = {
  input: Array<CreateFacetValueInput>;
};


export type MutationCreateLabelArgs = {
  input: CreateLabelInput;
};


export type MutationCreatePaymentMethodArgs = {
  input: CreatePaymentMethodInput;
};


export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


export type MutationCreateProductOptionArgs = {
  input: CreateProductOptionInput;
};


export type MutationCreateProductOptionGroupArgs = {
  input: CreateProductOptionGroupInput;
};


export type MutationCreateProductVariantsArgs = {
  input: Array<CreateProductVariantInput>;
};


export type MutationCreatePromotionArgs = {
  input: CreatePromotionInput;
};


export type MutationCreateProvinceArgs = {
  input: CreateProvinceInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateSeasonArgs = {
  input: CreateSeasonInput;
};


export type MutationCreateSellerArgs = {
  input: CreateSellerInput;
};


export type MutationCreateShippingMethodArgs = {
  input: CreateShippingMethodInput;
};


export type MutationCreateStockLocationArgs = {
  input: CreateStockLocationInput;
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateTaxCategoryArgs = {
  input: CreateTaxCategoryInput;
};


export type MutationCreateTaxRateArgs = {
  input: CreateTaxRateInput;
};


export type MutationCreateWorkerArgs = {
  input: CreateWorkerInput;
};


export type MutationCreateZoneArgs = {
  input: CreateZoneInput;
};


export type MutationDeleteAdministratorArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAdministratorsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteApiKeysArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteAssetArgs = {
  input: DeleteAssetInput;
};


export type MutationDeleteAssetsArgs = {
  input: DeleteAssetsInput;
};


export type MutationDeleteBannerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBannerTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBannerTypesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteBannersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCategoryTypeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteChannelArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteChannelsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCollectionsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteCountriesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteCountryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomerAddressArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomerGroupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomerGroupsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteCustomerNoteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteDayArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDeliveryMethodArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDraftOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationDeleteFacetArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationDeleteFacetValuesArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteFacetsArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteLabelArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOrderNoteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePaymentMethodArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationDeletePaymentMethodsArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductOptionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductOptionGroupArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductOptionGroupsArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteProductVariantArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductVariantsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteProductsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeletePromotionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePromotionsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteProvinceArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRolesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteSeasonArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSellerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSellersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteShippingMethodArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShippingMethodsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteStockLocationArgs = {
  input: DeleteStockLocationInput;
};


export type MutationDeleteStockLocationsArgs = {
  input: Array<DeleteStockLocationInput>;
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTaxCategoriesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteTaxCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTaxRateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTaxRatesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteWorkerArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteZoneArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteZonesArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDuplicateEntityArgs = {
  input: DuplicateEntityInput;
};


export type MutationEditButtonStateArgs = {
  id: Scalars['ID']['input'];
};


export type MutationFlushBufferedJobsArgs = {
  bufferIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationImportProductsArgs = {
  csvFile: Scalars['Upload']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
  username: Scalars['String']['input'];
};


export type MutationModifyOrderArgs = {
  input: ModifyOrderInput;
};


export type MutationMoveCollectionArgs = {
  input: MoveCollectionInput;
};


export type MutationRefundOrderArgs = {
  input: RefundOrderInput;
};


export type MutationRemoveBannerAssetArgs = {
  input: RemoveBannerAssetInput;
};


export type MutationRemoveCollectionsFromChannelArgs = {
  input: RemoveCollectionsFromChannelInput;
};


export type MutationRemoveCouponCodeFromDraftOrderArgs = {
  couponCode: Scalars['String']['input'];
  orderId: Scalars['ID']['input'];
};


export type MutationRemoveCustomersFromGroupArgs = {
  customerGroupId: Scalars['ID']['input'];
  customerIds: Array<Scalars['ID']['input']>;
};


export type MutationRemoveDraftOrderLineArgs = {
  orderId: Scalars['ID']['input'];
  orderLineId: Scalars['ID']['input'];
};


export type MutationRemoveFacetsFromChannelArgs = {
  input: RemoveFacetsFromChannelInput;
};


export type MutationRemoveMembersFromZoneArgs = {
  memberIds: Array<Scalars['ID']['input']>;
  zoneId: Scalars['ID']['input'];
};


export type MutationRemoveOptionGroupFromProductArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  optionGroupId: Scalars['ID']['input'];
  productId: Scalars['ID']['input'];
};


export type MutationRemovePaymentMethodsFromChannelArgs = {
  input: RemovePaymentMethodsFromChannelInput;
};


export type MutationRemoveProductOptionGroupsFromChannelArgs = {
  input: RemoveProductOptionGroupsFromChannelInput;
};


export type MutationRemoveProductVariantsFromChannelArgs = {
  input: RemoveProductVariantsFromChannelInput;
};


export type MutationRemoveProductsFromChannelArgs = {
  input: RemoveProductsFromChannelInput;
};


export type MutationRemoveProductsFromSeasonArgs = {
  productIds: Array<Scalars['ID']['input']>;
  seasonId: Scalars['ID']['input'];
};


export type MutationRemovePromotionsFromChannelArgs = {
  input: RemovePromotionsFromChannelInput;
};


export type MutationRemoveSettledJobsArgs = {
  olderThan?: InputMaybe<Scalars['DateTime']['input']>;
  queueNames?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationRemoveShippingMethodsFromChannelArgs = {
  input: RemoveShippingMethodsFromChannelInput;
};


export type MutationRemoveStockLocationsFromChannelArgs = {
  input: RemoveStockLocationsFromChannelInput;
};


export type MutationRotateApiKeyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRunScheduledTaskArgs = {
  id: Scalars['String']['input'];
};


export type MutationSetCustomerForDraftOrderArgs = {
  customerId?: InputMaybe<Scalars['ID']['input']>;
  input?: InputMaybe<CreateCustomerInput>;
  orderId: Scalars['ID']['input'];
};


export type MutationSetDraftOrderBillingAddressArgs = {
  input: CreateAddressInput;
  orderId: Scalars['ID']['input'];
};


export type MutationSetDraftOrderCustomFieldsArgs = {
  input: UpdateOrderInput;
  orderId: Scalars['ID']['input'];
};


export type MutationSetDraftOrderShippingAddressArgs = {
  input: CreateAddressInput;
  orderId: Scalars['ID']['input'];
};


export type MutationSetDraftOrderShippingMethodArgs = {
  orderId: Scalars['ID']['input'];
  shippingMethodId: Scalars['ID']['input'];
};


export type MutationSetOrderCustomFieldsArgs = {
  input: UpdateOrderInput;
};


export type MutationSetOrderCustomerArgs = {
  input: SetOrderCustomerInput;
};


export type MutationSetSettingsStoreValueArgs = {
  input: SettingsStoreInput;
};


export type MutationSetSettingsStoreValuesArgs = {
  inputs: Array<SettingsStoreInput>;
};


export type MutationSettlePaymentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSettleRefundArgs = {
  input: SettleRefundInput;
};


export type MutationTrackBannerClickArgs = {
  id: Scalars['ID']['input'];
};


export type MutationTransitionFulfillmentToStateArgs = {
  id: Scalars['ID']['input'];
  state: Scalars['String']['input'];
};


export type MutationTransitionOrderToStateArgs = {
  id: Scalars['ID']['input'];
  state: Scalars['String']['input'];
};


export type MutationTransitionPaymentToStateArgs = {
  id: Scalars['ID']['input'];
  state: Scalars['String']['input'];
};


export type MutationUnassignCourierFromOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationUnsetDraftOrderBillingAddressArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationUnsetDraftOrderShippingAddressArgs = {
  orderId: Scalars['ID']['input'];
};


export type MutationUpdateActiveAdministratorArgs = {
  input: UpdateActiveAdministratorInput;
};


export type MutationUpdateAdministratorArgs = {
  input: UpdateAdministratorInput;
};


export type MutationUpdateApiKeyArgs = {
  input: UpdateApiKeyInput;
};


export type MutationUpdateAssetArgs = {
  input: UpdateAssetInput;
};


export type MutationUpdateBannerArgs = {
  input: UpdateBannerInput;
};


export type MutationUpdateBannerTypeArgs = {
  input: UpdateBannerTypeInput;
};


export type MutationUpdateCategoryArgs = {
  input: UpdateCategoryInput;
};


export type MutationUpdateCategoryTypeArgs = {
  input: UpdateCategoryTypeInput;
};


export type MutationUpdateChannelArgs = {
  input: UpdateChannelInput;
};


export type MutationUpdateCollectionArgs = {
  input: UpdateCollectionInput;
};


export type MutationUpdateCountryArgs = {
  input: UpdateCountryInput;
};


export type MutationUpdateCustomerArgs = {
  input: UpdateCustomerInput;
};


export type MutationUpdateCustomerAddressArgs = {
  input: UpdateAddressInput;
};


export type MutationUpdateCustomerGroupArgs = {
  input: UpdateCustomerGroupInput;
};


export type MutationUpdateCustomerNoteArgs = {
  input: UpdateCustomerNoteInput;
};


export type MutationUpdateDayArgs = {
  input: UpdateDayInput;
};


export type MutationUpdateDeliveryMethodArgs = {
  input: UpdateDeliveryMethodInput;
};


export type MutationUpdateFacetArgs = {
  input: UpdateFacetInput;
};


export type MutationUpdateFacetValueArgs = {
  input: UpdateFacetValueInput;
};


export type MutationUpdateFacetValuesArgs = {
  input: Array<UpdateFacetValueInput>;
};


export type MutationUpdateGlobalSettingsArgs = {
  input: UpdateGlobalSettingsInput;
};


export type MutationUpdateLabelArgs = {
  input: UpdateLabelInput;
};


export type MutationUpdateMeiliSettingsArgs = {
  input: MeiliSettingsInput;
};


export type MutationUpdateOrderNoteArgs = {
  input: UpdateOrderNoteInput;
};


export type MutationUpdatePaymentMethodArgs = {
  input: UpdatePaymentMethodInput;
};


export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationUpdateProductOptionArgs = {
  input: UpdateProductOptionInput;
};


export type MutationUpdateProductOptionGroupArgs = {
  input: UpdateProductOptionGroupInput;
};


export type MutationUpdateProductVariantArgs = {
  input: UpdateProductVariantInput;
};


export type MutationUpdateProductVariantsArgs = {
  input: Array<UpdateProductVariantInput>;
};


export type MutationUpdateProductsArgs = {
  input: Array<UpdateProductInput>;
};


export type MutationUpdatePromotionArgs = {
  input: UpdatePromotionInput;
};


export type MutationUpdateProvinceArgs = {
  input: UpdateProvinceInput;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};


export type MutationUpdateScheduledTaskArgs = {
  input: UpdateScheduledTaskInput;
};


export type MutationUpdateSeasonArgs = {
  input: UpdateSeasonInput;
};


export type MutationUpdateSellerArgs = {
  input: UpdateSellerInput;
};


export type MutationUpdateShippingMethodArgs = {
  input: UpdateShippingMethodInput;
};


export type MutationUpdateStockLocationArgs = {
  input: UpdateStockLocationInput;
};


export type MutationUpdateTagArgs = {
  input: UpdateTagInput;
};


export type MutationUpdateTaxCategoryArgs = {
  input: UpdateTaxCategoryInput;
};


export type MutationUpdateTaxRateArgs = {
  input: UpdateTaxRateInput;
};


export type MutationUpdateWorkerArgs = {
  id: Scalars['ID']['input'];
  input: UpdateWorkerInput;
};


export type MutationUpdateZoneArgs = {
  input: UpdateZoneInput;
};


export type MutationUploadProductExcelArgs = {
  dryRun?: InputMaybe<Scalars['Boolean']['input']>;
  mode: ImportMode;
};


export type MutationUpsertBannerAssetArgs = {
  input: UpsertBannerAssetInput;
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

export type NativeAuthenticationResult = CurrentUser | InvalidCredentialsError | NativeAuthStrategyError;

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

/** Returned when a call to modifyOrder fails to specify any changes */
export type NoChangesSpecifiedError = ErrorResult & {
  __typename?: 'NoChangesSpecifiedError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type Node = {
  id: Scalars['ID']['output'];
};

/** Returned if an attempting to refund an Order but neither items nor shipping refund was specified */
export type NothingToRefundError = ErrorResult & {
  __typename?: 'NothingToRefundError';
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
  aggregateOrder?: Maybe<Order>;
  aggregateOrderId?: Maybe<Scalars['ID']['output']>;
  billingAddress?: Maybe<OrderAddress>;
  channels: Array<Channel>;
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
  modifications: Array<OrderModification>;
  nextStates: Array<Scalars['String']['output']>;
  /**
   * The date & time that the Order was placed, i.e. the Customer
   * completed the checkout and the Order is no longer "active"
   */
  orderPlacedAt?: Maybe<Scalars['DateTime']['output']>;
  payments?: Maybe<Array<Payment>>;
  /** Promotions applied to the order. Only gets populated after the payment process has completed. */
  promotions: Array<Promotion>;
  sellerOrders?: Maybe<Array<Order>>;
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
  aggregateOrderId?: InputMaybe<IdOperators>;
  assignedCourierId?: InputMaybe<StringOperators>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  currencyCode?: InputMaybe<StringOperators>;
  customerLastName?: InputMaybe<StringOperators>;
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
  transactionId?: InputMaybe<StringOperators>;
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

export type OrderLineInput = {
  orderLineId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
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

export type OrderModification = Node & {
  __typename?: 'OrderModification';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isSettled: Scalars['Boolean']['output'];
  lines: Array<OrderModificationLine>;
  note: Scalars['String']['output'];
  payment?: Maybe<Payment>;
  priceChange: Scalars['Money']['output'];
  refund?: Maybe<Refund>;
  surcharges?: Maybe<Array<Surcharge>>;
  updatedAt: Scalars['DateTime']['output'];
};

/** Returned when attempting to modify the contents of an Order that is not in the `AddingItems` state. */
export type OrderModificationError = ErrorResult & {
  __typename?: 'OrderModificationError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type OrderModificationLine = {
  __typename?: 'OrderModificationLine';
  modification: OrderModification;
  modificationId: Scalars['ID']['output'];
  orderLine: OrderLine;
  orderLineId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
};

/** Returned when attempting to modify the contents of an Order that is not in the `Modifying` state. */
export type OrderModificationStateError = ErrorResult & {
  __typename?: 'OrderModificationStateError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type OrderProcessState = {
  __typename?: 'OrderProcessState';
  name: Scalars['String']['output'];
  to: Array<Scalars['String']['output']>;
};

export type OrderSortParameter = {
  aggregateOrderId?: InputMaybe<SortOrder>;
  assignedCourierId?: InputMaybe<SortOrder>;
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  customerLastName?: InputMaybe<SortOrder>;
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
  transactionId?: InputMaybe<SortOrder>;
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

export type Payment = Node & {
  __typename?: 'Payment';
  amount: Scalars['Money']['output'];
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  errorMessage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  method: Scalars['String']['output'];
  nextStates: Array<Scalars['String']['output']>;
  refunds: Array<Refund>;
  state: Scalars['String']['output'];
  transactionId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
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

export type PaymentMethodFilterParameter = {
  _and?: InputMaybe<Array<PaymentMethodFilterParameter>>;
  _or?: InputMaybe<Array<PaymentMethodFilterParameter>>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type PaymentMethodList = PaginatedList & {
  __typename?: 'PaymentMethodList';
  items: Array<PaymentMethod>;
  totalItems: Scalars['Int']['output'];
};

export type PaymentMethodListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<PaymentMethodFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<PaymentMethodSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Returned when a call to modifyOrder fails to include a paymentMethod even
 * though the price has increased as a result of the changes.
 */
export type PaymentMethodMissingError = ErrorResult & {
  __typename?: 'PaymentMethodMissingError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
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

export type PaymentMethodSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
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

export type PaymentMethodTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Returned if an attempting to refund a Payment against OrderLines from a different Order */
export type PaymentOrderMismatchError = ErrorResult & {
  __typename?: 'PaymentOrderMismatchError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/** Returned when there is an error in transitioning the Payment state */
export type PaymentStateTransitionError = ErrorResult & {
  __typename?: 'PaymentStateTransitionError';
  errorCode: ErrorCode;
  fromState: Scalars['String']['output'];
  message: Scalars['String']['output'];
  toState: Scalars['String']['output'];
  transitionError: Scalars['String']['output'];
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

export type PermissionDefinition = {
  __typename?: 'PermissionDefinition';
  assignable: Scalars['Boolean']['output'];
  description: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type PreviewCollectionVariantsInput = {
  filters: Array<ConfigurableOperationInput>;
  inheritFilters: Scalars['Boolean']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
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
  channels: Array<Channel>;
  collections: Array<Collection>;
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<ProductCustomFields>;
  description: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  facetValues: Array<FacetValue>;
  featuredAsset?: Maybe<Asset>;
  id: Scalars['ID']['output'];
  image?: Maybe<Asset>;
  isSelected: Scalars['Boolean']['output'];
  labels: Array<Label>;
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  optionGroups: Array<ProductOptionGroup>;
  sale?: Maybe<SaleInfo>;
  seasons: Array<Season>;
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
  facetValueId?: InputMaybe<IdOperators>;
  id?: InputMaybe<IdOperators>;
  isRecommended?: InputMaybe<BooleanOperators>;
  isSelected?: InputMaybe<BooleanOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  optionGroupId?: InputMaybe<IdOperators>;
  selectedQuantity?: InputMaybe<NumberOperators>;
  sku?: InputMaybe<StringOperators>;
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

export type ProductOptionFilterParameter = {
  _and?: InputMaybe<Array<ProductOptionFilterParameter>>;
  _or?: InputMaybe<Array<ProductOptionFilterParameter>>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  groupId?: InputMaybe<IdOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type ProductOptionGroup = Node & {
  __typename?: 'ProductOptionGroup';
  channels: Array<Channel>;
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

export type ProductOptionGroupFilterParameter = {
  _and?: InputMaybe<Array<ProductOptionGroupFilterParameter>>;
  _or?: InputMaybe<Array<ProductOptionGroupFilterParameter>>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  productCount?: InputMaybe<NumberOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type ProductOptionGroupInUseError = ErrorResult & {
  __typename?: 'ProductOptionGroupInUseError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
  optionGroupCode: Scalars['String']['output'];
  productCount: Scalars['Int']['output'];
  variantCount: Scalars['Int']['output'];
};

export type ProductOptionGroupList = PaginatedList & {
  __typename?: 'ProductOptionGroupList';
  items: Array<ProductOptionGroup>;
  totalItems: Scalars['Int']['output'];
};

export type ProductOptionGroupListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<ProductOptionGroupFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<ProductOptionGroupSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductOptionGroupSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  productCount?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ProductOptionGroupTranslation = {
  __typename?: 'ProductOptionGroupTranslation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductOptionGroupTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ProductOptionInUseError = ErrorResult & {
  __typename?: 'ProductOptionInUseError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
  optionGroupCode: Scalars['String']['output'];
  productVariantCount: Scalars['Int']['output'];
};

export type ProductOptionList = PaginatedList & {
  __typename?: 'ProductOptionList';
  items: Array<ProductOption>;
  totalItems: Scalars['Int']['output'];
};

export type ProductOptionListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<ProductOptionFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<ProductOptionSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type ProductOptionSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  groupId?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ProductOptionTranslation = {
  __typename?: 'ProductOptionTranslation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductOptionTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
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

export type ProductTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type ProductVariant = Node & {
  __typename?: 'ProductVariant';
  assets: Array<Asset>;
  channels: Array<Channel>;
  createdAt: Scalars['DateTime']['output'];
  currencyCode: CurrencyCode;
  customFields?: Maybe<Scalars['JSON']['output']>;
  enabled: Scalars['Boolean']['output'];
  facetValues: Array<FacetValue>;
  featuredAsset?: Maybe<Asset>;
  id: Scalars['ID']['output'];
  languageCode: LanguageCode;
  name: Scalars['String']['output'];
  options: Array<ProductOption>;
  outOfStockThreshold: Scalars['Int']['output'];
  price: Scalars['Money']['output'];
  priceWithTax: Scalars['Money']['output'];
  prices: Array<ProductVariantPrice>;
  product: Product;
  productId: Scalars['ID']['output'];
  sku: Scalars['String']['output'];
  /** @deprecated use stockLevels */
  stockAllocated: Scalars['Int']['output'];
  stockLevel: Scalars['String']['output'];
  stockLevels: Array<StockLevel>;
  stockMovements: StockMovementList;
  /** @deprecated use stockLevels */
  stockOnHand: Scalars['Int']['output'];
  taxCategory: TaxCategory;
  taxRateApplied: TaxRate;
  trackInventory: GlobalFlag;
  translations: Array<ProductVariantTranslation>;
  updatedAt: Scalars['DateTime']['output'];
  useGlobalOutOfStockThreshold: Scalars['Boolean']['output'];
};


export type ProductVariantStockMovementsArgs = {
  options?: InputMaybe<StockMovementListOptions>;
};

export type ProductVariantFilterParameter = {
  _and?: InputMaybe<Array<ProductVariantFilterParameter>>;
  _or?: InputMaybe<Array<ProductVariantFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  currencyCode?: InputMaybe<StringOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  facetValueId?: InputMaybe<IdOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  outOfStockThreshold?: InputMaybe<NumberOperators>;
  price?: InputMaybe<NumberOperators>;
  priceWithTax?: InputMaybe<NumberOperators>;
  productId?: InputMaybe<IdOperators>;
  sku?: InputMaybe<StringOperators>;
  stockAllocated?: InputMaybe<NumberOperators>;
  stockLevel?: InputMaybe<StringOperators>;
  stockOnHand?: InputMaybe<NumberOperators>;
  trackInventory?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
  useGlobalOutOfStockThreshold?: InputMaybe<BooleanOperators>;
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

export type ProductVariantPrice = {
  __typename?: 'ProductVariantPrice';
  currencyCode: CurrencyCode;
  customFields?: Maybe<Scalars['JSON']['output']>;
  price: Scalars['Money']['output'];
};

export type ProductVariantSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  outOfStockThreshold?: InputMaybe<SortOrder>;
  price?: InputMaybe<SortOrder>;
  priceWithTax?: InputMaybe<SortOrder>;
  productId?: InputMaybe<SortOrder>;
  sku?: InputMaybe<SortOrder>;
  stockAllocated?: InputMaybe<SortOrder>;
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

export type ProductVariantTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
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

export type PromotionFilterParameter = {
  _and?: InputMaybe<Array<PromotionFilterParameter>>;
  _or?: InputMaybe<Array<PromotionFilterParameter>>;
  collectionType?: InputMaybe<StringOperators>;
  couponCode?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  endsAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  internalPromoCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  perCustomerUsageLimit?: InputMaybe<NumberOperators>;
  startsAt?: InputMaybe<DateOperators>;
  updatedAt?: InputMaybe<DateOperators>;
  usageLimit?: InputMaybe<NumberOperators>;
};

export type PromotionList = PaginatedList & {
  __typename?: 'PromotionList';
  items: Array<Promotion>;
  totalItems: Scalars['Int']['output'];
};

export type PromotionListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<PromotionFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<PromotionSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type PromotionSortParameter = {
  collectionType?: InputMaybe<SortOrder>;
  couponCode?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  endsAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  internalPromoCode?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  perCustomerUsageLimit?: InputMaybe<SortOrder>;
  startsAt?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  usageLimit?: InputMaybe<SortOrder>;
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

export type PromotionTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
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

export type ProvinceFilterParameter = {
  _and?: InputMaybe<Array<ProvinceFilterParameter>>;
  _or?: InputMaybe<Array<ProvinceFilterParameter>>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  parentId?: InputMaybe<IdOperators>;
  type?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type ProvinceList = PaginatedList & {
  __typename?: 'ProvinceList';
  items: Array<Province>;
  totalItems: Scalars['Int']['output'];
};

export type ProvinceListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<ProvinceFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<ProvinceSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type ProvinceSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  parentId?: InputMaybe<SortOrder>;
  type?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ProvinceTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Returned if the specified quantity of an OrderLine is greater than the number of items in that line */
export type QuantityTooGreatError = ErrorResult & {
  __typename?: 'QuantityTooGreatError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  activeAdministrator?: Maybe<Administrator>;
  activeChannel: Channel;
  activeSeasons: Array<Season>;
  administrator?: Maybe<Administrator>;
  administrators: AdministratorList;
  apiKey?: Maybe<ApiKey>;
  apiKeys: ApiKeyList;
  /** Get a single Asset by id */
  asset?: Maybe<Asset>;
  /** Get a list of Assets */
  assets: AssetList;
  banner?: Maybe<Banner>;
  bannerBySlug?: Maybe<Banner>;
  bannerType?: Maybe<BannerType>;
  bannerTypes: BannerTypeList;
  banners: BannerList;
  categories: CategoryList;
  category?: Maybe<Category>;
  categoryTree: Array<Category>;
  categoryType?: Maybe<CategoryType>;
  categoryTypes: CategoryTypeList;
  channel?: Maybe<Channel>;
  channels: ChannelList;
  /** Get a Collection either by id or slug. If neither id nor slug is specified, an error will result. */
  collection?: Maybe<Collection>;
  collectionFilters: Array<ConfigurableOperationDefinition>;
  collections: CollectionList;
  countries: CountryList;
  country?: Maybe<Country>;
  customer?: Maybe<Customer>;
  customerGroup?: Maybe<CustomerGroup>;
  customerGroups: CustomerGroupList;
  customers: CustomerList;
  /** Get metrics for the given date range and metric types. */
  dashboardMetricSummary: Array<DashboardMetricSummary>;
  day?: Maybe<Day>;
  days: DayList;
  deliveryMethod?: Maybe<DeliveryMethod>;
  deliveryMethods: DeliveryMethodList;
  /** Returns a list of eligible shipping methods for the draft Order */
  eligibleShippingMethodsForDraftOrder: Array<ShippingMethodQuote>;
  /** Returns all configured EntityDuplicators. */
  entityDuplicators: Array<EntityDuplicatorDefinition>;
  facet?: Maybe<Facet>;
  facetValue?: Maybe<FacetValue>;
  facetValues: FacetValueList;
  facets: FacetList;
  fulfillmentHandlers: Array<ConfigurableOperationDefinition>;
  getAllProducts: FilteredProductList;
  getFilters: AggregatedMetadata;
  /** Get value for a specific key (automatically scoped based on field configuration) */
  getSettingsStoreValue?: Maybe<Scalars['JSON']['output']>;
  /** Get multiple key-value pairs (each automatically scoped) */
  getSettingsStoreValues?: Maybe<Scalars['JSON']['output']>;
  globalSettings: GlobalSettings;
  importErrorReport: Array<ImportErrorRow>;
  importJob?: Maybe<ImportJob>;
  importJobLogs: Array<ImportLog>;
  importJobs: ImportJobList;
  job?: Maybe<Job>;
  jobBufferSize: Array<JobBufferSize>;
  jobQueues: Array<JobQueue>;
  jobs: JobList;
  jobsById: Array<Job>;
  label?: Maybe<Label>;
  labels: LabelList;
  me?: Maybe<CurrentUser>;
  meiliMonitoring: MeiliMonitoringResult;
  meiliSettings: MeiliSettingsResult;
  models: ModelList;
  order?: Maybe<Order>;
  orders: OrderList;
  paymentMethod?: Maybe<PaymentMethod>;
  paymentMethodEligibilityCheckers: Array<ConfigurableOperationDefinition>;
  paymentMethodHandlers: Array<ConfigurableOperationDefinition>;
  paymentMethods: PaymentMethodList;
  pendingSearchIndexUpdates: Scalars['Int']['output'];
  /** Used for real-time previews of the contents of a Collection */
  previewCollectionVariants: ProductVariantList;
  /** Get a Product either by id or slug. If neither id nor slug is specified, an error will result. */
  product?: Maybe<Product>;
  productOption?: Maybe<ProductOption>;
  productOptionGroup?: Maybe<ProductOptionGroup>;
  productOptionGroups: ProductOptionGroupList;
  productOptions: ProductOptionList;
  productSeasons: Array<Season>;
  /** Get a ProductVariant by id */
  productVariant?: Maybe<ProductVariant>;
  /** List ProductVariants either all or for the specific product. */
  productVariants: ProductVariantList;
  /** List Products */
  products: ProductList;
  promotion?: Maybe<Promotion>;
  promotionActions: Array<ConfigurableOperationDefinition>;
  promotionConditions: Array<ConfigurableOperationDefinition>;
  promotions: PromotionList;
  province?: Maybe<Province>;
  provinces: ProvinceList;
  /** Gets new refresh token */
  refreshToken: RefreshTokenResponse;
  role?: Maybe<Role>;
  roles: RoleList;
  scheduledTasks: Array<ScheduledTask>;
  search: SearchResponse;
  season?: Maybe<Season>;
  seasonBySlug?: Maybe<Season>;
  seasons: SeasonList;
  seller?: Maybe<Seller>;
  sellers: SellerList;
  /** Returns all registered settings store field definitions with their current values */
  settingsStoreFieldDefinitions: Array<SettingsStoreFieldDefinition>;
  shippingCalculators: Array<ConfigurableOperationDefinition>;
  shippingEligibilityCheckers: Array<ConfigurableOperationDefinition>;
  shippingMethod?: Maybe<ShippingMethod>;
  shippingMethods: ShippingMethodList;
  /** Generate slug for entity */
  slugForEntity: Scalars['String']['output'];
  stockLocation?: Maybe<StockLocation>;
  stockLocations: StockLocationList;
  tag: Tag;
  tags: TagList;
  taxCategories: TaxCategoryList;
  taxCategory?: Maybe<TaxCategory>;
  taxRate?: Maybe<TaxRate>;
  taxRates: TaxRateList;
  testContext?: Maybe<Scalars['JSON']['output']>;
  testEligibleShippingMethods: Array<ShippingMethodQuote>;
  testShippingMethod: TestShippingMethodResult;
  variantSoldCountsForPromotion: Array<VariantSoldCount>;
  worker?: Maybe<Worker>;
  workers: WorkerList;
  zone?: Maybe<Zone>;
  zones: ZoneList;
};


export type QueryAdministratorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAdministratorsArgs = {
  options?: InputMaybe<AdministratorListOptions>;
};


export type QueryApiKeyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryApiKeysArgs = {
  options?: InputMaybe<ApiKeyListOptions>;
};


export type QueryAssetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAssetsArgs = {
  options?: InputMaybe<AssetListOptions>;
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


export type QueryChannelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryChannelsArgs = {
  options?: InputMaybe<ChannelListOptions>;
};


export type QueryCollectionArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCollectionsArgs = {
  options?: InputMaybe<CollectionListOptions>;
};


export type QueryCountriesArgs = {
  options?: InputMaybe<CountryListOptions>;
};


export type QueryCountryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerGroupsArgs = {
  options?: InputMaybe<CustomerGroupListOptions>;
};


export type QueryCustomersArgs = {
  options?: InputMaybe<CustomerListOptions>;
};


export type QueryDashboardMetricSummaryArgs = {
  input?: InputMaybe<DashboardMetricSummaryInput>;
};


export type QueryDayArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDaysArgs = {
  options?: InputMaybe<DayListOptions>;
};


export type QueryDeliveryMethodArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDeliveryMethodsArgs = {
  options?: InputMaybe<DeliveryMethodListOptions>;
};


export type QueryEligibleShippingMethodsForDraftOrderArgs = {
  orderId: Scalars['ID']['input'];
};


export type QueryFacetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFacetValueArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFacetValuesArgs = {
  options?: InputMaybe<FacetValueListOptions>;
};


export type QueryFacetsArgs = {
  options?: InputMaybe<FacetListOptions>;
};


export type QueryGetAllProductsArgs = {
  options?: InputMaybe<AdminFilteredProductListOptions>;
};


export type QueryGetFiltersArgs = {
  slug: Scalars['String']['input'];
  type: Scalars['String']['input'];
};


export type QueryGetSettingsStoreValueArgs = {
  key: Scalars['String']['input'];
};


export type QueryGetSettingsStoreValuesArgs = {
  keys: Array<Scalars['String']['input']>;
};


export type QueryImportErrorReportArgs = {
  jobId: Scalars['ID']['input'];
};


export type QueryImportJobArgs = {
  id: Scalars['ID']['input'];
};


export type QueryImportJobLogsArgs = {
  jobId: Scalars['ID']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryImportJobsArgs = {
  options?: InputMaybe<ImportJobListOptions>;
};


export type QueryJobArgs = {
  jobId: Scalars['ID']['input'];
};


export type QueryJobBufferSizeArgs = {
  bufferIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryJobsArgs = {
  options?: InputMaybe<JobListOptions>;
};


export type QueryJobsByIdArgs = {
  jobIds: Array<Scalars['ID']['input']>;
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


export type QueryOrdersArgs = {
  options?: InputMaybe<OrderListOptions>;
};


export type QueryPaymentMethodArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPaymentMethodsArgs = {
  options?: InputMaybe<PaymentMethodListOptions>;
};


export type QueryPreviewCollectionVariantsArgs = {
  input: PreviewCollectionVariantsInput;
  options?: InputMaybe<ProductVariantListOptions>;
};


export type QueryProductArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProductOptionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductOptionGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductOptionGroupsArgs = {
  options?: InputMaybe<ProductOptionGroupListOptions>;
};


export type QueryProductOptionsArgs = {
  groupId?: InputMaybe<Scalars['ID']['input']>;
  options?: InputMaybe<ProductOptionListOptions>;
};


export type QueryProductSeasonsArgs = {
  productId: Scalars['ID']['input'];
};


export type QueryProductVariantArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductVariantsArgs = {
  options?: InputMaybe<ProductVariantListOptions>;
  productId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryProductsArgs = {
  options?: InputMaybe<ProductListOptions>;
};


export type QueryPromotionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPromotionsArgs = {
  options?: InputMaybe<PromotionListOptions>;
};


export type QueryProvinceArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProvincesArgs = {
  options?: InputMaybe<ProvinceListOptions>;
};


export type QueryRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type QueryRoleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRolesArgs = {
  options?: InputMaybe<RoleListOptions>;
};


export type QuerySearchArgs = {
  input: SearchInput;
};


export type QuerySeasonArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySeasonBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QuerySeasonsArgs = {
  options?: InputMaybe<SeasonListOptions>;
};


export type QuerySellerArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySellersArgs = {
  options?: InputMaybe<SellerListOptions>;
};


export type QueryShippingMethodArgs = {
  id: Scalars['ID']['input'];
};


export type QueryShippingMethodsArgs = {
  options?: InputMaybe<ShippingMethodListOptions>;
};


export type QuerySlugForEntityArgs = {
  input: SlugForEntityInput;
};


export type QueryStockLocationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStockLocationsArgs = {
  options?: InputMaybe<StockLocationListOptions>;
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTagsArgs = {
  options?: InputMaybe<TagListOptions>;
};


export type QueryTaxCategoriesArgs = {
  options?: InputMaybe<TaxCategoryListOptions>;
};


export type QueryTaxCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTaxRateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTaxRatesArgs = {
  options?: InputMaybe<TaxRateListOptions>;
};


export type QueryTestEligibleShippingMethodsArgs = {
  input: TestEligibleShippingMethodsInput;
};


export type QueryTestShippingMethodArgs = {
  input: TestShippingMethodInput;
};


export type QueryVariantSoldCountsForPromotionArgs = {
  promotionId: Scalars['ID']['input'];
  variantIds: Array<Scalars['ID']['input']>;
};


export type QueryWorkerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryWorkersArgs = {
  options?: InputMaybe<WorkerListOptions>;
};


export type QueryZoneArgs = {
  id: Scalars['ID']['input'];
};


export type QueryZonesArgs = {
  options?: InputMaybe<ZoneListOptions>;
};

export enum RedirectTypes {
  category = 'category',
  empty = 'empty',
  model = 'model',
  products = 'products',
  url = 'url'
}

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

/** Returned if `amount` is greater than the maximum un-refunded amount of the Payment */
export type RefundAmountError = ErrorResult & {
  __typename?: 'RefundAmountError';
  errorCode: ErrorCode;
  maximumRefundable: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

export type RefundLine = {
  __typename?: 'RefundLine';
  orderLine: OrderLine;
  orderLineId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  refund: Refund;
  refundId: Scalars['ID']['output'];
};

export type RefundOrderInput = {
  /**
   * The amount to be refunded to this particular payment. This was introduced in v2.2.0 as the preferred way to specify the refund amount.
   * Can be as much as the total amount of the payment minus the sum of all previous refunds.
   */
  amount?: InputMaybe<Scalars['Money']['input']>;
  paymentId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type RefundOrderResult = AlreadyRefundedError | MultipleOrderError | NothingToRefundError | OrderStateTransitionError | PaymentOrderMismatchError | QuantityTooGreatError | Refund | RefundAmountError | RefundOrderStateError | RefundStateTransitionError;

/** Returned if an attempting to refund an Order which is not in the expected state */
export type RefundOrderStateError = ErrorResult & {
  __typename?: 'RefundOrderStateError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
  orderState: Scalars['String']['output'];
};

/**
 * Returned when a call to modifyOrder fails to include a refundPaymentId even
 * though the price has decreased as a result of the changes.
 */
export type RefundPaymentIdMissingError = ErrorResult & {
  __typename?: 'RefundPaymentIdMissingError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
};

/** Returned when there is an error in transitioning the Refund state */
export type RefundStateTransitionError = ErrorResult & {
  __typename?: 'RefundStateTransitionError';
  errorCode: ErrorCode;
  fromState: Scalars['String']['output'];
  message: Scalars['String']['output'];
  toState: Scalars['String']['output'];
  transitionError: Scalars['String']['output'];
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

export type Release = Node & StockMovement & {
  __typename?: 'Release';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  productVariant: ProductVariant;
  quantity: Scalars['Int']['output'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime']['output'];
};

export type RemoveBannerAssetInput = {
  bannerId: Scalars['ID']['input'];
  languageCode: LanguageCode;
};

export type RemoveCollectionsFromChannelInput = {
  channelId: Scalars['ID']['input'];
  collectionIds: Array<Scalars['ID']['input']>;
};

export type RemoveFacetFromChannelResult = Facet | FacetInUseError;

export type RemoveFacetsFromChannelInput = {
  channelId: Scalars['ID']['input'];
  facetIds: Array<Scalars['ID']['input']>;
  force?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RemoveOptionGroupFromProductResult = Product | ProductOptionInUseError;

export type RemoveOrderItemsResult = Order | OrderInterceptorError | OrderModificationError;

export type RemovePaymentMethodsFromChannelInput = {
  channelId: Scalars['ID']['input'];
  paymentMethodIds: Array<Scalars['ID']['input']>;
};

export type RemoveProductOptionGroupFromChannelResult = ProductOptionGroup | ProductOptionGroupInUseError;

export type RemoveProductOptionGroupsFromChannelInput = {
  channelId: Scalars['ID']['input'];
  force?: InputMaybe<Scalars['Boolean']['input']>;
  productOptionGroupIds: Array<Scalars['ID']['input']>;
};

export type RemoveProductVariantsFromChannelInput = {
  channelId: Scalars['ID']['input'];
  productVariantIds: Array<Scalars['ID']['input']>;
};

export type RemoveProductsFromChannelInput = {
  channelId: Scalars['ID']['input'];
  productIds: Array<Scalars['ID']['input']>;
};

export type RemovePromotionsFromChannelInput = {
  channelId: Scalars['ID']['input'];
  promotionIds: Array<Scalars['ID']['input']>;
};

export type RemoveShippingMethodsFromChannelInput = {
  channelId: Scalars['ID']['input'];
  shippingMethodIds: Array<Scalars['ID']['input']>;
};

export type RemoveStockLocationsFromChannelInput = {
  channelId: Scalars['ID']['input'];
  stockLocationIds: Array<Scalars['ID']['input']>;
};

export type Return = Node & StockMovement & {
  __typename?: 'Return';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  productVariant: ProductVariant;
  quantity: Scalars['Int']['output'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime']['output'];
};

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

export type RoleFilterParameter = {
  _and?: InputMaybe<Array<RoleFilterParameter>>;
  _or?: InputMaybe<Array<RoleFilterParameter>>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type RoleList = PaginatedList & {
  __typename?: 'RoleList';
  items: Array<Role>;
  totalItems: Scalars['Int']['output'];
};

export type RoleListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<RoleFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<RoleSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type RoleSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type RotateApiKeyResult = {
  __typename?: 'RotateApiKeyResult';
  /** The generated API-Key. API-Keys cannot be viewed again after creation! */
  apiKey: Scalars['String']['output'];
};

export type Sale = Node & StockMovement & {
  __typename?: 'Sale';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  productVariant: ProductVariant;
  quantity: Scalars['Int']['output'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime']['output'];
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

export type ScheduledTask = {
  __typename?: 'ScheduledTask';
  description: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  isRunning: Scalars['Boolean']['output'];
  lastExecutedAt?: Maybe<Scalars['DateTime']['output']>;
  lastResult?: Maybe<Scalars['JSON']['output']>;
  nextExecutionAt?: Maybe<Scalars['DateTime']['output']>;
  schedule: Scalars['String']['output'];
  scheduleDescription: Scalars['String']['output'];
};

export type SearchInput = {
  collectionId?: InputMaybe<Scalars['ID']['input']>;
  collectionIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  collectionSlug?: InputMaybe<Scalars['String']['input']>;
  collectionSlugs?: InputMaybe<Array<Scalars['String']['input']>>;
  facetValueFilters?: InputMaybe<Array<FacetValueFilterInput>>;
  groupByProduct?: InputMaybe<Scalars['Boolean']['input']>;
  inStock?: InputMaybe<Scalars['Boolean']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<SearchResultSortParameter>;
  take?: InputMaybe<Scalars['Int']['input']>;
  term?: InputMaybe<Scalars['String']['input']>;
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
  /** An array of ids of the Channels in which this result appears */
  channelIds: Array<Scalars['ID']['output']>;
  /** An array of ids of the Collections in which this result appears */
  collectionIds: Array<Scalars['ID']['output']>;
  currencyCode: CurrencyCode;
  description: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  facetIds: Array<Scalars['ID']['output']>;
  facetValueIds: Array<Scalars['ID']['output']>;
  inStock: Scalars['Boolean']['output'];
  price: SearchResultPrice;
  priceWithTax: SearchResultPrice;
  productAsset?: Maybe<SearchResultAsset>;
  productId: Scalars['ID']['output'];
  productName: Scalars['String']['output'];
  productVariantAsset?: Maybe<SearchResultAsset>;
  productVariantId: Scalars['ID']['output'];
  productVariantName: Scalars['String']['output'];
  /** A relevance score for the result. Differs between database implementations */
  score: Scalars['Float']['output'];
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

export type SearchTermStat = {
  __typename?: 'SearchTermStat';
  count: Scalars['Float']['output'];
  term: Scalars['String']['output'];
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

export type SeasonFilterParameter = {
  _and?: InputMaybe<Array<SeasonFilterParameter>>;
  _or?: InputMaybe<Array<SeasonFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  endDate?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  isActive?: InputMaybe<BooleanOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  slug?: InputMaybe<StringOperators>;
  startDate?: InputMaybe<DateOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type SeasonList = PaginatedList & {
  __typename?: 'SeasonList';
  items: Array<Season>;
  totalItems: Scalars['Int']['output'];
};

export type SeasonListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<SeasonFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<SeasonSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type SeasonSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  endDate?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  slug?: InputMaybe<SortOrder>;
  startDate?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
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

export type SeasonTranslationInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Seller = Node & {
  __typename?: 'Seller';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SellerFilterParameter = {
  _and?: InputMaybe<Array<SellerFilterParameter>>;
  _or?: InputMaybe<Array<SellerFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type SellerList = PaginatedList & {
  __typename?: 'SellerList';
  items: Array<Seller>;
  totalItems: Scalars['Int']['output'];
};

export type SellerListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<SellerFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<SellerSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type SellerSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type ServerConfig = {
  __typename?: 'ServerConfig';
  /**
   * This field is deprecated in v2.2 in favor of the entityCustomFields field,
   * which allows custom fields to be defined on user-supplies entities.
   */
  customFieldConfig: CustomFields;
  entityCustomFields: Array<EntityCustomFields>;
  moneyStrategyPrecision: Scalars['Int']['output'];
  orderProcess: Array<OrderProcessState>;
  permissions: Array<PermissionDefinition>;
  permittedAssetTypes: Array<Scalars['String']['output']>;
};

export type SetCustomerForDraftOrderResult = EmailAddressConflictError | Order;

export type SetOrderCustomerInput = {
  customerId: Scalars['ID']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['ID']['input'];
};

export type SetOrderShippingMethodResult = IneligibleShippingMethodError | NoActiveOrderError | Order | OrderModificationError;

export type SetSettingsStoreValueResult = {
  __typename?: 'SetSettingsStoreValueResult';
  error?: Maybe<Scalars['String']['output']>;
  key: Scalars['String']['output'];
  result: Scalars['Boolean']['output'];
};

export type SettingsStoreFieldDefinition = {
  __typename?: 'SettingsStoreFieldDefinition';
  currentValue?: Maybe<Scalars['JSON']['output']>;
  key: Scalars['String']['output'];
  readonly: Scalars['Boolean']['output'];
  scopeType: SettingsStoreScopeType;
};

export type SettingsStoreInput = {
  key: Scalars['String']['input'];
  value: Scalars['JSON']['input'];
};

export enum SettingsStoreScopeType {
  CHANNEL = 'CHANNEL',
  CUSTOM = 'CUSTOM',
  GLOBAL = 'GLOBAL',
  USER = 'USER',
  USER_AND_CHANNEL = 'USER_AND_CHANNEL'
}

/** Returned if the Payment settlement fails */
export type SettlePaymentError = ErrorResult & {
  __typename?: 'SettlePaymentError';
  errorCode: ErrorCode;
  message: Scalars['String']['output'];
  paymentErrorMessage: Scalars['String']['output'];
};

export type SettlePaymentResult = OrderStateTransitionError | Payment | PaymentStateTransitionError | SettlePaymentError;

export type SettleRefundInput = {
  id: Scalars['ID']['input'];
  transactionId: Scalars['String']['input'];
};

export type SettleRefundResult = Refund | RefundStateTransitionError;

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

export type ShippingMethodFilterParameter = {
  _and?: InputMaybe<Array<ShippingMethodFilterParameter>>;
  _or?: InputMaybe<Array<ShippingMethodFilterParameter>>;
  code?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  fulfillmentHandlerCode?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  languageCode?: InputMaybe<StringOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type ShippingMethodList = PaginatedList & {
  __typename?: 'ShippingMethodList';
  items: Array<ShippingMethod>;
  totalItems: Scalars['Int']['output'];
};

export type ShippingMethodListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<ShippingMethodFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<ShippingMethodSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
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

export type ShippingMethodSortParameter = {
  code?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  fulfillmentHandlerCode?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
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

export type ShippingMethodTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
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

export type SlugForEntityInput = {
  entityId?: InputMaybe<Scalars['ID']['input']>;
  entityName: Scalars['String']['input'];
  fieldName: Scalars['String']['input'];
  inputValue: Scalars['String']['input'];
};

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export type StockAdjustment = Node & StockMovement & {
  __typename?: 'StockAdjustment';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  productVariant: ProductVariant;
  quantity: Scalars['Int']['output'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime']['output'];
};

export type StockLevel = Node & {
  __typename?: 'StockLevel';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  stockAllocated: Scalars['Int']['output'];
  stockLocation: StockLocation;
  stockLocationId: Scalars['ID']['output'];
  stockOnHand: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type StockLevelInput = {
  stockLocationId: Scalars['ID']['input'];
  stockOnHand: Scalars['Int']['input'];
};

export type StockLocation = Node & {
  __typename?: 'StockLocation';
  createdAt: Scalars['DateTime']['output'];
  customFields?: Maybe<Scalars['JSON']['output']>;
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type StockLocationFilterParameter = {
  _and?: InputMaybe<Array<StockLocationFilterParameter>>;
  _or?: InputMaybe<Array<StockLocationFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  description?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type StockLocationList = PaginatedList & {
  __typename?: 'StockLocationList';
  items: Array<StockLocation>;
  totalItems: Scalars['Int']['output'];
};

export type StockLocationListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<StockLocationFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<StockLocationSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type StockLocationSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type StockMovement = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  productVariant: ProductVariant;
  quantity: Scalars['Int']['output'];
  type: StockMovementType;
  updatedAt: Scalars['DateTime']['output'];
};

export type StockMovementItem = Allocation | Cancellation | Release | Return | Sale | StockAdjustment;

export type StockMovementList = {
  __typename?: 'StockMovementList';
  items: Array<StockMovementItem>;
  totalItems: Scalars['Int']['output'];
};

export type StockMovementListOptions = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<StockMovementType>;
};

export enum StockMovementType {
  ADJUSTMENT = 'ADJUSTMENT',
  ALLOCATION = 'ALLOCATION',
  CANCELLATION = 'CANCELLATION',
  RELEASE = 'RELEASE',
  RETURN = 'RETURN',
  SALE = 'SALE'
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

export type SurchargeInput = {
  description: Scalars['String']['input'];
  price: Scalars['Money']['input'];
  priceIncludesTax: Scalars['Boolean']['input'];
  sku?: InputMaybe<Scalars['String']['input']>;
  taxDescription?: InputMaybe<Scalars['String']['input']>;
  taxRate?: InputMaybe<Scalars['Float']['input']>;
};

export type Tag = Node & {
  __typename?: 'Tag';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  value: Scalars['String']['output'];
};

export type TagFilterParameter = {
  _and?: InputMaybe<Array<TagFilterParameter>>;
  _or?: InputMaybe<Array<TagFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  updatedAt?: InputMaybe<DateOperators>;
  value?: InputMaybe<StringOperators>;
};

export type TagList = PaginatedList & {
  __typename?: 'TagList';
  items: Array<Tag>;
  totalItems: Scalars['Int']['output'];
};

export type TagListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<TagFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<TagSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type TagSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  value?: InputMaybe<SortOrder>;
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

export type TaxCategoryFilterParameter = {
  _and?: InputMaybe<Array<TaxCategoryFilterParameter>>;
  _or?: InputMaybe<Array<TaxCategoryFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  isDefault?: InputMaybe<BooleanOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type TaxCategoryList = PaginatedList & {
  __typename?: 'TaxCategoryList';
  items: Array<TaxCategory>;
  totalItems: Scalars['Int']['output'];
};

export type TaxCategoryListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<TaxCategoryFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<TaxCategorySortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type TaxCategorySortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
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

export type TaxRateFilterParameter = {
  _and?: InputMaybe<Array<TaxRateFilterParameter>>;
  _or?: InputMaybe<Array<TaxRateFilterParameter>>;
  categoryId?: InputMaybe<IdOperators>;
  createdAt?: InputMaybe<DateOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
  value?: InputMaybe<NumberOperators>;
  zoneId?: InputMaybe<IdOperators>;
};

export type TaxRateList = PaginatedList & {
  __typename?: 'TaxRateList';
  items: Array<TaxRate>;
  totalItems: Scalars['Int']['output'];
};

export type TaxRateListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<TaxRateFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<TaxRateSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type TaxRateSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  value?: InputMaybe<SortOrder>;
};

export type TestEligibleShippingMethodsInput = {
  lines: Array<TestShippingMethodOrderLineInput>;
  shippingAddress: CreateAddressInput;
};

export type TestShippingMethodInput = {
  calculator: ConfigurableOperationInput;
  checker: ConfigurableOperationInput;
  lines: Array<TestShippingMethodOrderLineInput>;
  shippingAddress: CreateAddressInput;
};

export type TestShippingMethodOrderLineInput = {
  productVariantId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type TestShippingMethodQuote = {
  __typename?: 'TestShippingMethodQuote';
  metadata?: Maybe<Scalars['JSON']['output']>;
  price: Scalars['Money']['output'];
  priceWithTax: Scalars['Money']['output'];
};

export type TestShippingMethodResult = {
  __typename?: 'TestShippingMethodResult';
  eligible: Scalars['Boolean']['output'];
  quote?: Maybe<TestShippingMethodQuote>;
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

export type TransitionFulfillmentToStateResult = Fulfillment | FulfillmentStateTransitionError;

export type TransitionOrderToStateResult = Order | OrderStateTransitionError;

export type TransitionPaymentToStateResult = Payment | PaymentStateTransitionError;

export type UpdateActiveAdministratorInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

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

export type UpdateAdministratorInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  roleIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateApiKeyInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  /** ID of the ApiKey */
  id: Scalars['ID']['input'];
  /**
   * Which roles to attach to this ApiKey.
   * You may only grant roles which you, yourself have.
   */
  roleIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  translations?: InputMaybe<Array<UpdateApiKeyTranslationInput>>;
};

export type UpdateApiKeyTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  /** A descriptive name so you can remind yourself where the API-Key gets used */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateAssetInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  focalPoint?: InputMaybe<CoordinateInput>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  translations?: InputMaybe<Array<AssetTranslationInput>>;
};

export type UpdateBannerInput = {
  backColor?: InputMaybe<Scalars['String']['input']>;
  btnColor?: InputMaybe<Scalars['String']['input']>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  counter?: InputMaybe<Scalars['Int']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  link?: InputMaybe<Scalars['String']['input']>;
  modelId?: InputMaybe<Scalars['ID']['input']>;
  productIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  productVariantIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  redirect?: InputMaybe<RedirectTypes>;
  slug?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  translations?: InputMaybe<Array<BannerTranslationInput>>;
  typeId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateBannerTypeInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  sort?: InputMaybe<Scalars['Int']['input']>;
  translations?: InputMaybe<Array<BannerTypeTranslationInput>>;
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

export type UpdateChannelCustomFieldsInput = {
  dayLimit?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateChannelInput = {
  availableCurrencyCodes?: InputMaybe<Array<CurrencyCode>>;
  availableLanguageCodes?: InputMaybe<Array<LanguageCode>>;
  code?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<UpdateChannelCustomFieldsInput>;
  defaultCurrencyCode?: InputMaybe<CurrencyCode>;
  defaultLanguageCode?: InputMaybe<LanguageCode>;
  defaultShippingZoneId?: InputMaybe<Scalars['ID']['input']>;
  defaultTaxZoneId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  outOfStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  pricesIncludeTax?: InputMaybe<Scalars['Boolean']['input']>;
  sellerId?: InputMaybe<Scalars['ID']['input']>;
  token?: InputMaybe<Scalars['String']['input']>;
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateChannelResult = Channel | LanguageNotAvailableError;

export type UpdateCollectionInput = {
  assetIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  featuredAssetId?: InputMaybe<Scalars['ID']['input']>;
  filters?: InputMaybe<Array<ConfigurableOperationInput>>;
  id: Scalars['ID']['input'];
  inheritFilters?: InputMaybe<Scalars['Boolean']['input']>;
  isPrivate?: InputMaybe<Scalars['Boolean']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  translations?: InputMaybe<Array<UpdateCollectionTranslationInput>>;
};

export type UpdateCollectionTranslationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  languageCode: LanguageCode;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCountryInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  translations?: InputMaybe<Array<CountryTranslationInput>>;
};

export type UpdateCustomerCustomFieldsInput = {
  birthDate?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerGroupInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerInput = {
  customFields?: InputMaybe<UpdateCustomerCustomFieldsInput>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomerNoteInput = {
  note: Scalars['String']['input'];
  noteId: Scalars['ID']['input'];
};

export type UpdateCustomerResult = Customer | EmailAddressConflictError;

export type UpdateDayInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  dayOffset?: InputMaybe<Scalars['Int']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  sort?: InputMaybe<Scalars['Int']['input']>;
  translations?: InputMaybe<Array<DayTranslationInput>>;
  type?: InputMaybe<DayType>;
};

export type UpdateDeliveryMethodInput = {
  closeTime?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  dayIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isDisabled?: InputMaybe<Scalars['Boolean']['input']>;
  limitPrice?: InputMaybe<Scalars['Int']['input']>;
  maxCost?: InputMaybe<Scalars['Int']['input']>;
  minCost?: InputMaybe<Scalars['Int']['input']>;
  showTime?: InputMaybe<Scalars['Boolean']['input']>;
  sort?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
  translations?: InputMaybe<Array<DeliveryMethodTranslationInput>>;
  type?: InputMaybe<DeliveryMethodType>;
};

export type UpdateFacetInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
  isPrivate?: InputMaybe<Scalars['Boolean']['input']>;
  translations?: InputMaybe<Array<FacetTranslationInput>>;
};

export type UpdateFacetValueCustomFieldsInput = {
  categoriesIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateFacetValueInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<UpdateFacetValueCustomFieldsInput>;
  id: Scalars['ID']['input'];
  translations?: InputMaybe<Array<FacetValueTranslationInput>>;
};

export type UpdateGlobalSettingsInput = {
  availableLanguages?: InputMaybe<Array<LanguageCode>>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  outOfStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateGlobalSettingsResult = ChannelDefaultLanguageError | GlobalSettings;

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

export type UpdateOrderAddressInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['String']['input']>;
  countryCode?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<UpdateAddressCustomFieldsInput>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  streetLine1?: InputMaybe<Scalars['String']['input']>;
  streetLine2?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOrderCustomFieldsInput = {
  assignedCourierId?: InputMaybe<Scalars['String']['input']>;
  deliveryMethodId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateOrderInput = {
  customFields?: InputMaybe<UpdateOrderCustomFieldsInput>;
  id: Scalars['ID']['input'];
};

/** Union type of all possible errors that can occur when adding or removing items from an Order. */
export type UpdateOrderItemErrorResult = InsufficientStockError | NegativeQuantityError | OrderInterceptorError | OrderLimitError | OrderModificationError;

export type UpdateOrderItemsResult = InsufficientStockError | NegativeQuantityError | Order | OrderInterceptorError | OrderLimitError | OrderModificationError;

export type UpdateOrderNoteInput = {
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  noteId: Scalars['ID']['input'];
};

export type UpdatePaymentMethodInput = {
  checker?: InputMaybe<ConfigurableOperationInput>;
  code?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  handler?: InputMaybe<ConfigurableOperationInput>;
  id: Scalars['ID']['input'];
  translations?: InputMaybe<Array<PaymentMethodTranslationInput>>;
};

export type UpdateProductCustomFieldsInput = {
  categoriesIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  isRecommended?: InputMaybe<Scalars['Boolean']['input']>;
  labelsIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateProductInput = {
  assetIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  customFields?: InputMaybe<UpdateProductCustomFieldsInput>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  facetValueIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  featuredAssetId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  translations?: InputMaybe<Array<ProductTranslationInput>>;
};

export type UpdateProductOptionGroupInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
  translations?: InputMaybe<Array<ProductOptionGroupTranslationInput>>;
};

export type UpdateProductOptionInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
  translations?: InputMaybe<Array<ProductOptionGroupTranslationInput>>;
};

export type UpdateProductVariantInput = {
  assetIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  facetValueIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  featuredAssetId?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  optionIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  outOfStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  /** Sets the price for the ProductVariant in the Channel's default currency */
  price?: InputMaybe<Scalars['Money']['input']>;
  /** Allows multiple prices to be set for the ProductVariant in different currencies. */
  prices?: InputMaybe<Array<UpdateProductVariantPriceInput>>;
  sku?: InputMaybe<Scalars['String']['input']>;
  stockLevels?: InputMaybe<Array<StockLevelInput>>;
  stockOnHand?: InputMaybe<Scalars['Int']['input']>;
  taxCategoryId?: InputMaybe<Scalars['ID']['input']>;
  trackInventory?: InputMaybe<GlobalFlag>;
  translations?: InputMaybe<Array<ProductVariantTranslationInput>>;
  useGlobalOutOfStockThreshold?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * Used to set up update the price of a ProductVariant in a particular Channel.
 * If the `delete` flag is `true`, the price will be deleted for the given Channel.
 */
export type UpdateProductVariantPriceInput = {
  currencyCode: CurrencyCode;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  delete?: InputMaybe<Scalars['Boolean']['input']>;
  price: Scalars['Money']['input'];
};

export type UpdatePromotionCustomFieldsInput = {
  collectionType?: InputMaybe<Scalars['String']['input']>;
  internalPromoCode?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePromotionInput = {
  actions?: InputMaybe<Array<ConfigurableOperationInput>>;
  conditions?: InputMaybe<Array<ConfigurableOperationInput>>;
  couponCode?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<UpdatePromotionCustomFieldsInput>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  endsAt?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  perCustomerUsageLimit?: InputMaybe<Scalars['Int']['input']>;
  startsAt?: InputMaybe<Scalars['DateTime']['input']>;
  translations?: InputMaybe<Array<PromotionTranslationInput>>;
  usageLimit?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdatePromotionResult = MissingConditionsError | Promotion;

export type UpdateProvinceInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  translations?: InputMaybe<Array<ProvinceTranslationInput>>;
};

export type UpdateRoleInput = {
  channelIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  permissions?: InputMaybe<Array<Permission>>;
};

export type UpdateScheduledTaskInput = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['String']['input'];
};

export type UpdateSeasonInput = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  translations?: InputMaybe<Array<SeasonTranslationInput>>;
};

export type UpdateSellerInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateShippingMethodInput = {
  calculator?: InputMaybe<ConfigurableOperationInput>;
  checker?: InputMaybe<ConfigurableOperationInput>;
  code?: InputMaybe<Scalars['String']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  fulfillmentHandler?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  translations: Array<ShippingMethodTranslationInput>;
};

export type UpdateStockLocationInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTagInput = {
  id: Scalars['ID']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTaxCategoryInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTaxRateInput = {
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  customerGroupId?: InputMaybe<Scalars['ID']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Float']['input']>;
  zoneId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateWorkerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  erpCode?: InputMaybe<Scalars['String']['input']>;
  externalCode?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<WorkerRole>;
  sort?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  vehicle?: InputMaybe<Scalars['String']['input']>;
  vehiclePlate?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateZoneInput = {
  customFields?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpsertBannerAssetInput = {
  assetId: Scalars['ID']['input'];
  bannerId: Scalars['ID']['input'];
  languageCode: LanguageCode;
};

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

export type VariantSoldCount = {
  __typename?: 'VariantSoldCount';
  isExhausted: Scalars['Boolean']['output'];
  remaining?: Maybe<Scalars['Int']['output']>;
  soldCount: Scalars['Int']['output'];
  variantId: Scalars['ID']['output'];
};

export type Worker = Node & {
  __typename?: 'Worker';
  address?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  enabled: Scalars['Boolean']['output'];
  erpCode?: Maybe<Scalars['String']['output']>;
  externalCode?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  phone: Scalars['String']['output'];
  role: WorkerRole;
  sort: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
  vehicle?: Maybe<Scalars['String']['output']>;
  vehiclePlate?: Maybe<Scalars['String']['output']>;
};

export type WorkerFilterParameter = {
  _and?: InputMaybe<Array<WorkerFilterParameter>>;
  _or?: InputMaybe<Array<WorkerFilterParameter>>;
  address?: InputMaybe<StringOperators>;
  createdAt?: InputMaybe<DateOperators>;
  enabled?: InputMaybe<BooleanOperators>;
  erpCode?: InputMaybe<StringOperators>;
  externalCode?: InputMaybe<StringOperators>;
  firstName?: InputMaybe<StringOperators>;
  id?: InputMaybe<IdOperators>;
  lastName?: InputMaybe<StringOperators>;
  note?: InputMaybe<StringOperators>;
  phone?: InputMaybe<StringOperators>;
  role?: InputMaybe<StringOperators>;
  sort?: InputMaybe<NumberOperators>;
  updatedAt?: InputMaybe<DateOperators>;
  username?: InputMaybe<StringOperators>;
  vehicle?: InputMaybe<StringOperators>;
  vehiclePlate?: InputMaybe<StringOperators>;
};

export type WorkerList = PaginatedList & {
  __typename?: 'WorkerList';
  items: Array<Worker>;
  totalItems: Scalars['Int']['output'];
};

export type WorkerListOptions = {
  filter?: InputMaybe<WorkerFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<WorkerSortParameter>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export enum WorkerRole {
  Courier = 'Courier'
}

export type WorkerSortParameter = {
  address?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  enabled?: InputMaybe<SortOrder>;
  erpCode?: InputMaybe<SortOrder>;
  externalCode?: InputMaybe<SortOrder>;
  firstName?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  lastName?: InputMaybe<SortOrder>;
  note?: InputMaybe<SortOrder>;
  phone?: InputMaybe<SortOrder>;
  sort?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
  username?: InputMaybe<SortOrder>;
  vehicle?: InputMaybe<SortOrder>;
  vehiclePlate?: InputMaybe<SortOrder>;
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

export type ZoneFilterParameter = {
  _and?: InputMaybe<Array<ZoneFilterParameter>>;
  _or?: InputMaybe<Array<ZoneFilterParameter>>;
  createdAt?: InputMaybe<DateOperators>;
  id?: InputMaybe<IdOperators>;
  name?: InputMaybe<StringOperators>;
  updatedAt?: InputMaybe<DateOperators>;
};

export type ZoneList = PaginatedList & {
  __typename?: 'ZoneList';
  items: Array<Zone>;
  totalItems: Scalars['Int']['output'];
};

export type ZoneListOptions = {
  /** Allows the results to be filtered */
  filter?: InputMaybe<ZoneFilterParameter>;
  /** Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND. */
  filterOperator?: InputMaybe<LogicalOperator>;
  /** Skips the first n results, for use in pagination */
  skip?: InputMaybe<Scalars['Int']['input']>;
  /** Specifies which properties to sort the results by */
  sort?: InputMaybe<ZoneSortParameter>;
  /** Takes n results, for use in pagination */
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type ZoneSortParameter = {
  createdAt?: InputMaybe<SortOrder>;
  id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  updatedAt?: InputMaybe<SortOrder>;
};

export type GetBannersQueryVariables = Exact<{
  options?: InputMaybe<BannerListOptions>;
}>;


export type GetBannersQuery = { __typename?: 'Query', banners: { __typename?: 'BannerList', totalItems: number, items: Array<{ __typename?: 'Banner', id: string, createdAt: any, updatedAt: any, name: string, slug: string, enabled: boolean, sort: number, counter: number, redirect: RedirectTypes, assets: Array<{ __typename?: 'BannerAsset', id: string, languageCode: LanguageCode, asset: { __typename?: 'Asset', id: string, preview: string } }>, type?: { __typename?: 'BannerType', id: string, name: string } | null }> } };

export type GetBannerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetBannerQuery = { __typename?: 'Query', banner?: { __typename?: 'Banner', id: string, name: string, slug: string, enabled: boolean, sort: number, counter: number, redirect: RedirectTypes, link?: string | null, backColor?: string | null, btnColor?: string | null, startDate: any, endDate: any, type?: { __typename?: 'BannerType', id: string, name: string } | null, assets: Array<{ __typename?: 'BannerAsset', id: string, languageCode: LanguageCode, asset: { __typename?: 'Asset', id: string, preview: string } }>, category?: { __typename?: 'Category', id: string, name: string } | null, model?: { __typename?: 'FacetValue', id: string, name: string } | null, products?: Array<{ __typename?: 'Product', id: string, name: string, featuredAsset?: { __typename?: 'Asset', id: string, preview: string } | null }> | null, translations: Array<{ __typename?: 'BannerTranslation', id: string, languageCode: LanguageCode, name: string }> } | null };

export type CreateBannerMutationVariables = Exact<{
  input: CreateBannerInput;
}>;


export type CreateBannerMutation = { __typename?: 'Mutation', createBanner: { __typename?: 'Banner', id: string, name: string, slug: string } };

export type UpdateBannerMutationVariables = Exact<{
  input: UpdateBannerInput;
}>;


export type UpdateBannerMutation = { __typename?: 'Mutation', updateBanner: { __typename?: 'Banner', id: string, name: string, slug: string } };

export type DeleteBannerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteBannerMutation = { __typename?: 'Mutation', deleteBanner: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type GetBannerTypesQueryVariables = Exact<{
  options?: InputMaybe<BannerTypeListOptions>;
}>;


export type GetBannerTypesQuery = { __typename?: 'Query', bannerTypes: { __typename?: 'BannerTypeList', totalItems: number, items: Array<{ __typename?: 'BannerType', id: string, createdAt: any, updatedAt: any, name: string, enabled: boolean, sort: number }> } };

export type GetBannerTypeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetBannerTypeQuery = { __typename?: 'Query', bannerType?: { __typename?: 'BannerType', id: string, name: string, enabled: boolean, sort: number, translations: Array<{ __typename?: 'BannerTypeTranslation', id: string, languageCode: LanguageCode, name: string }> } | null };

export type CreateBannerTypeMutationVariables = Exact<{
  input: CreateBannerTypeInput;
}>;


export type CreateBannerTypeMutation = { __typename?: 'Mutation', createBannerType: { __typename?: 'BannerType', id: string, name: string } };

export type UpdateBannerTypeMutationVariables = Exact<{
  input: UpdateBannerTypeInput;
}>;


export type UpdateBannerTypeMutation = { __typename?: 'Mutation', updateBannerType: { __typename?: 'BannerType', id: string, name: string } };

export type DeleteBannerTypeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteBannerTypeMutation = { __typename?: 'Mutation', deleteBannerType: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type GetFacetsQueryVariables = Exact<{
  options?: InputMaybe<FacetListOptions>;
}>;


export type GetFacetsQuery = { __typename?: 'Query', facets: { __typename?: 'FacetList', items: Array<{ __typename?: 'Facet', id: string, name: string, values: Array<{ __typename?: 'FacetValue', id: string, name: string }> }> } };

export type SearchProductsQueryVariables = Exact<{
  input: SearchInput;
}>;


export type SearchProductsQuery = { __typename?: 'Query', search: { __typename?: 'SearchResponse', totalItems: number, items: Array<{ __typename?: 'SearchResult', productId: string, productName: string, productVariantId: string, productVariantName: string, slug: string, sku: string, enabled: boolean, productAsset?: { __typename?: 'SearchResultAsset', id: string, preview: string } | null, productVariantAsset?: { __typename?: 'SearchResultAsset', id: string, preview: string } | null, priceWithTax:
        | { __typename?: 'PriceRange', min: number, max: number }
        | { __typename?: 'SinglePrice', value: number }
       }> } };

export type GetProductsByIdsQueryVariables = Exact<{
  options?: InputMaybe<ProductListOptions>;
}>;


export type GetProductsByIdsQuery = { __typename?: 'Query', products: { __typename?: 'ProductList', items: Array<{ __typename?: 'Product', id: string, name: string, featuredAsset?: { __typename?: 'Asset', id: string, preview: string } | null }> } };

export type GetAllProductsQueryVariables = Exact<{
  options: AdminFilteredProductListOptions;
}>;


export type GetAllProductsQuery = { __typename?: 'Query', getAllProducts: { __typename?: 'FilteredProductList', totalItems: number, items: Array<{ __typename?: 'Product', id: string, name: string, slug: string, enabled: boolean, featuredAsset?: { __typename?: 'Asset', id: string, preview: string } | null, variants: Array<{ __typename?: 'ProductVariant', id: string, sku: string, priceWithTax: number, stockLevel: string }> }> } };

export type GetModelsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetModelsQuery = { __typename?: 'Query', models: { __typename?: 'ModelList', totalItems: number, items: Array<{ __typename?: 'Model', id: string, name: string }> } };

export type GetProductIdsByEnabledQueryVariables = Exact<{
  options?: InputMaybe<ProductListOptions>;
}>;


export type GetProductIdsByEnabledQuery = { __typename?: 'Query', products: { __typename?: 'ProductList', totalItems: number, items: Array<{ __typename?: 'Product', id: string }> } };

export type UpsertBannerAssetMutationVariables = Exact<{
  input: UpsertBannerAssetInput;
}>;


export type UpsertBannerAssetMutation = { __typename?: 'Mutation', upsertBannerAsset: { __typename?: 'Banner', id: string, assets: Array<{ __typename?: 'BannerAsset', id: string, languageCode: LanguageCode, asset: { __typename?: 'Asset', id: string, preview: string } }> } };

export type RemoveBannerAssetMutationVariables = Exact<{
  input: RemoveBannerAssetInput;
}>;


export type RemoveBannerAssetMutation = { __typename?: 'Mutation', removeBannerAsset: { __typename?: 'Banner', id: string, assets: Array<{ __typename?: 'BannerAsset', id: string, languageCode: LanguageCode, asset: { __typename?: 'Asset', id: string, preview: string } }> } };

export type GetCategoryTypesQueryVariables = Exact<{
  options?: InputMaybe<CategoryTypeListOptions>;
}>;


export type GetCategoryTypesQuery = { __typename?: 'Query', categoryTypes: { __typename?: 'CategoryTypeList', totalItems: number, items: Array<{ __typename?: 'CategoryType', id: string, name: string, slug: string, enabled: boolean, sort: number, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, imageAsset?: { __typename?: 'Asset', id: string, preview: string } | null }> } };

export type GetCategoryTypeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCategoryTypeQuery = { __typename?: 'Query', categoryType?: { __typename?: 'CategoryType', id: string, name: string, slug: string, enabled: boolean, sort: number, translations: Array<{ __typename?: 'CategoryTypeTranslation', id: string, languageCode: LanguageCode, name: string }>, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, imageAsset?: { __typename?: 'Asset', id: string, preview: string } | null } | null };

export type GetCategoriesByTypeQueryVariables = Exact<{
  categoryTypeId: Scalars['String']['input'];
}>;


export type GetCategoriesByTypeQuery = { __typename?: 'Query', categories: { __typename?: 'CategoryList', totalItems: number, items: Array<{ __typename?: 'Category', id: string, name: string, slug: string, sort: number, parent?: { __typename?: 'Category', id: string, name: string } | null }> } };

export type GetCategoriesByIdsQueryVariables = Exact<{
  ids: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type GetCategoriesByIdsQuery = { __typename?: 'Query', categories: { __typename?: 'CategoryList', items: Array<{ __typename?: 'Category', id: string, name: string, categoryType: { __typename?: 'CategoryType', id: string, name: string } }> } };

export type GetCategoriesQueryVariables = Exact<{
  options?: InputMaybe<CategoryListOptions>;
}>;


export type GetCategoriesQuery = { __typename?: 'Query', categories: { __typename?: 'CategoryList', totalItems: number, items: Array<{ __typename?: 'Category', id: string, name: string, slug: string, sort: number, enabled: boolean, parent?: { __typename?: 'Category', id: string } | null, categoryType: { __typename?: 'CategoryType', id: string, name: string }, featuredAsset?: { __typename?: 'Asset', id: string, preview: string } | null, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, children: Array<{ __typename?: 'Category', id: string }> }> } };

export type GetCategoryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCategoryQuery = { __typename?: 'Query', category?: { __typename?: 'Category', id: string, name: string, slug: string, sort: number, enabled: boolean, parent?: { __typename?: 'Category', id: string, name: string } | null, categoryType: { __typename?: 'CategoryType', id: string, name: string }, featuredAsset?: { __typename?: 'Asset', id: string, preview: string } | null, iconAsset?: { __typename?: 'Asset', id: string, preview: string, name: string } | null, translations: Array<{ __typename?: 'CategoryTranslation', id: string, languageCode: LanguageCode, name: string }> } | null };

export type CreateCategoryMutationVariables = Exact<{
  input: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename?: 'Category', id: string, name: string, slug: string, enabled: boolean, translations: Array<{ __typename?: 'CategoryTranslation', id: string, languageCode: LanguageCode, name: string }> } };

export type UpdateCategoryMutationVariables = Exact<{
  input: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename?: 'Category', id: string, name: string, slug: string, enabled: boolean, translations: Array<{ __typename?: 'CategoryTranslation', id: string, languageCode: LanguageCode, name: string }> } };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type CreateCategoryTypeMutationVariables = Exact<{
  input: CreateCategoryTypeInput;
}>;


export type CreateCategoryTypeMutation = { __typename?: 'Mutation', createCategoryType: { __typename?: 'CategoryType', id: string, name: string, slug: string, enabled: boolean, sort: number, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, imageAsset?: { __typename?: 'Asset', id: string, preview: string } | null } };

export type UpdateCategoryTypeMutationVariables = Exact<{
  input: UpdateCategoryTypeInput;
}>;


export type UpdateCategoryTypeMutation = { __typename?: 'Mutation', updateCategoryType: { __typename?: 'CategoryType', id: string, name: string, slug: string, enabled: boolean, sort: number, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, imageAsset?: { __typename?: 'Asset', id: string, preview: string } | null } };

export type DeleteCategoryTypeMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCategoryTypeMutation = { __typename?: 'Mutation', deleteCategoryType: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type GetCategoryTreeQueryVariables = Exact<{
  categoryTypeId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetCategoryTreeQuery = { __typename?: 'Query', categoryTree: Array<{ __typename?: 'Category', id: string, name: string, slug: string, sort: number, enabled: boolean, categoryType: { __typename?: 'CategoryType', id: string, name: string }, featuredAsset?: { __typename?: 'Asset', id: string, preview: string } | null, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, children: Array<{ __typename?: 'Category', id: string, name: string, slug: string, sort: number, enabled: boolean, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, children: Array<{ __typename?: 'Category', id: string, name: string, slug: string, sort: number, enabled: boolean, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, children: Array<{ __typename?: 'Category', id: string, name: string, slug: string, sort: number, enabled: boolean, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, children: Array<{ __typename?: 'Category', id: string, name: string, slug: string, sort: number, enabled: boolean, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, children: Array<{ __typename?: 'Category', id: string, name: string, slug: string, sort: number, enabled: boolean, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, children: Array<{ __typename?: 'Category', id: string, name: string, slug: string, sort: number, enabled: boolean, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, children: Array<{ __typename?: 'Category', id: string, name: string, slug: string, sort: number, enabled: boolean, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, children: Array<{ __typename?: 'Category', id: string, name: string, slug: string, sort: number, enabled: boolean, iconAsset?: { __typename?: 'Asset', id: string, preview: string } | null, children: Array<{ __typename?: 'Category', id: string, name: string, slug: string, sort: number, enabled: boolean }> }> }> }> }> }> }> }> }> }> };

export type GetDaysQueryVariables = Exact<{
  options?: InputMaybe<DayListOptions>;
}>;


export type GetDaysQuery = { __typename?: 'Query', days: { __typename?: 'DayList', totalItems: number, items: Array<{ __typename?: 'Day', id: string, code: string, type: DayType, enabled: boolean, sort: number, dayOffset?: number | null, name: string, translations: Array<{ __typename?: 'DayTranslation', id: string, languageCode: LanguageCode, name: string }> }> } };

export type GetDayQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDayQuery = { __typename?: 'Query', day?: { __typename?: 'Day', id: string, code: string, type: DayType, enabled: boolean, sort: number, dayOffset?: number | null, name: string, translations: Array<{ __typename?: 'DayTranslation', id: string, languageCode: LanguageCode, name: string }> } | null };

export type CreateDayMutationVariables = Exact<{
  input: CreateDayInput;
}>;


export type CreateDayMutation = { __typename?: 'Mutation', createDay: { __typename?: 'Day', id: string, code: string, type: DayType, enabled: boolean, sort: number, dayOffset?: number | null, name: string, translations: Array<{ __typename?: 'DayTranslation', id: string, languageCode: LanguageCode, name: string }> } };

export type UpdateDayMutationVariables = Exact<{
  input: UpdateDayInput;
}>;


export type UpdateDayMutation = { __typename?: 'Mutation', updateDay: { __typename?: 'Day', id: string, code: string, type: DayType, enabled: boolean, sort: number, dayOffset?: number | null, name: string, translations: Array<{ __typename?: 'DayTranslation', id: string, languageCode: LanguageCode, name: string }> } };

export type DeleteDayMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteDayMutation = { __typename?: 'Mutation', deleteDay: boolean };

export type GetDeliveryMethodsQueryVariables = Exact<{
  options?: InputMaybe<DeliveryMethodListOptions>;
}>;


export type GetDeliveryMethodsQuery = { __typename?: 'Query', deliveryMethods: { __typename?: 'DeliveryMethodList', totalItems: number, items: Array<{ __typename?: 'DeliveryMethod', id: string, code: string, name: string, description: string, enabled: boolean, isDisabled: boolean, sort: number, type: DeliveryMethodType, from: string, to: string, closeTime: string, maxCost: number, minCost: number, limitPrice: number, showTime: boolean, translations: Array<{ __typename?: 'DeliveryMethodTranslation', id: string, languageCode: LanguageCode, name: string, description: string }>, days: Array<{ __typename?: 'Day', id: string, name: string, code: string }> }> } };

export type GetDeliveryMethodQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDeliveryMethodQuery = { __typename?: 'Query', deliveryMethod?: { __typename?: 'DeliveryMethod', id: string, code: string, name: string, description: string, enabled: boolean, isDisabled: boolean, sort: number, type: DeliveryMethodType, from: string, to: string, closeTime: string, maxCost: number, minCost: number, limitPrice: number, showTime: boolean, translations: Array<{ __typename?: 'DeliveryMethodTranslation', id: string, languageCode: LanguageCode, name: string, description: string }>, days: Array<{ __typename?: 'Day', id: string, name: string, code: string }> } | null };

export type CreateDeliveryMethodMutationVariables = Exact<{
  input: CreateDeliveryMethodInput;
}>;


export type CreateDeliveryMethodMutation = { __typename?: 'Mutation', createDeliveryMethod: { __typename?: 'DeliveryMethod', id: string, code: string, name: string, description: string, enabled: boolean, isDisabled: boolean, sort: number, type: DeliveryMethodType, from: string, to: string, closeTime: string, maxCost: number, minCost: number, limitPrice: number, showTime: boolean, translations: Array<{ __typename?: 'DeliveryMethodTranslation', id: string, languageCode: LanguageCode, name: string, description: string }>, days: Array<{ __typename?: 'Day', id: string, name: string, code: string }> } };

export type UpdateDeliveryMethodMutationVariables = Exact<{
  input: UpdateDeliveryMethodInput;
}>;


export type UpdateDeliveryMethodMutation = { __typename?: 'Mutation', updateDeliveryMethod: { __typename?: 'DeliveryMethod', id: string, code: string, name: string, description: string, enabled: boolean, isDisabled: boolean, sort: number, type: DeliveryMethodType, from: string, to: string, closeTime: string, maxCost: number, minCost: number, limitPrice: number, showTime: boolean, translations: Array<{ __typename?: 'DeliveryMethodTranslation', id: string, languageCode: LanguageCode, name: string, description: string }>, days: Array<{ __typename?: 'Day', id: string, name: string, code: string }> } };

export type DeleteDeliveryMethodMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteDeliveryMethodMutation = { __typename?: 'Mutation', deleteDeliveryMethod: boolean };

export type ToggleDeliveryMethodMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ToggleDeliveryMethodMutation = { __typename?: 'Mutation', editButtonState: { __typename?: 'DeliveryMethod', id: string, code: string, name: string, description: string, enabled: boolean, isDisabled: boolean, sort: number, type: DeliveryMethodType, from: string, to: string, closeTime: string, maxCost: number, minCost: number, limitPrice: number, showTime: boolean, translations: Array<{ __typename?: 'DeliveryMethodTranslation', id: string, languageCode: LanguageCode, name: string, description: string }>, days: Array<{ __typename?: 'Day', id: string, name: string, code: string }> } };

export type GetLabelsQueryVariables = Exact<{
  options?: InputMaybe<LabelListOptions>;
}>;


export type GetLabelsQuery = { __typename?: 'Query', labels: { __typename?: 'LabelList', totalItems: number, items: Array<{ __typename?: 'Label', id: string, name: string, code: string, color: string, enabled: boolean, sort: number, featuredAsset?: { __typename?: 'Asset', id: string, name: string, preview: string } | null, translations: Array<{ __typename?: 'LabelTranslation', id: string, languageCode: LanguageCode, name: string }> }> } };

export type GetLabelQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetLabelQuery = { __typename?: 'Query', label?: { __typename?: 'Label', id: string, name: string, code: string, color: string, enabled: boolean, sort: number, featuredAsset?: { __typename?: 'Asset', id: string, name: string, preview: string } | null, translations: Array<{ __typename?: 'LabelTranslation', id: string, languageCode: LanguageCode, name: string }> } | null };

export type CreateLabelMutationVariables = Exact<{
  input: CreateLabelInput;
}>;


export type CreateLabelMutation = { __typename?: 'Mutation', createLabel: { __typename?: 'Label', id: string, name: string, code: string, enabled: boolean, sort: number, translations: Array<{ __typename?: 'LabelTranslation', id: string, languageCode: LanguageCode, name: string }> } };

export type UpdateLabelMutationVariables = Exact<{
  input: UpdateLabelInput;
}>;


export type UpdateLabelMutation = { __typename?: 'Mutation', updateLabel: { __typename?: 'Label', id: string, name: string, code: string, enabled: boolean, sort: number, translations: Array<{ __typename?: 'LabelTranslation', id: string, languageCode: LanguageCode, name: string }> } };

export type DeleteLabelMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLabelMutation = { __typename?: 'Mutation', deleteLabel: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type GetOrderDeliveryGroupsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOrderDeliveryGroupsQuery = { __typename?: 'Query', order?: { __typename?: 'Order', id: string, deliveryGroups: Array<{ __typename?: 'DeliveryCredentialGroup', key: number, day: string, date?: string | null, type: string, data: Array<{ __typename?: 'DeliveryMethod', id: string, code: string, name: string, minCost: number, limitPrice: number, isDisabled: boolean, type: DeliveryMethodType, showTime: boolean, from: string, to: string }> }> } | null };

export type SetDraftOrderCustomFieldsMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
  input: UpdateOrderInput;
}>;


export type SetDraftOrderCustomFieldsMutation = { __typename?: 'Mutation', setDraftOrderCustomFields: { __typename?: 'Order', id: string, customFields?: { __typename?: 'OrderCustomFields', deliveryMethod?: { __typename?: 'DeliveryMethod', id: string, name: string, minCost: number } | null } | null } };

export type SetDraftOrderShippingMethodMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
  shippingMethodId: Scalars['ID']['input'];
}>;


export type SetDraftOrderShippingMethodMutation = { __typename?: 'Mutation', setDraftOrderShippingMethod:
    | { __typename?: 'IneligibleShippingMethodError' }
    | { __typename?: 'NoActiveOrderError' }
    | { __typename?: 'Order', id: string, shippingWithTax: number, totalWithTax: number }
    | { __typename?: 'OrderModificationError' }
   };

export type GetShippingMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetShippingMethodsQuery = { __typename?: 'Query', shippingMethods: { __typename?: 'ShippingMethodList', items: Array<{ __typename?: 'ShippingMethod', id: string, name: string, calculator: { __typename?: 'ConfigurableOperation', code: string } }> } };

export type ApplyDeliveryMethodMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
  deliveryMethodId: Scalars['ID']['input'];
}>;


export type ApplyDeliveryMethodMutation = { __typename?: 'Mutation', applyDeliveryMethod: { __typename?: 'Order', id: string, shippingWithTax: number, totalWithTax: number, customFields?: { __typename?: 'OrderCustomFields', deliveryMethod?: { __typename?: 'DeliveryMethod', id: string, name: string } | null } | null } };

export type GetMeiliMonitoringQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeiliMonitoringQuery = { __typename?: 'Query', meiliMonitoring: { __typename?: 'MeiliMonitoringResult', health: { __typename?: 'MeiliHealthStatus', status: string, isHealthy: boolean, version?: string | null, dbSizeBytes: number, lastUpdated: string }, indexStats: { __typename?: 'MeiliIndexStats', indexName: string, documentCount: number, isIndexing: boolean }, taskStats: { __typename?: 'MeiliTaskStats', totalTasks: number, pendingTasks: number, processingTasks: number, failedTasks: number, succeededTasks: number, enqueuedTasks: number, recentTasks: Array<{ __typename?: 'MeiliRecentTask', uid: number, type: string, status: string, duration?: string | null, enqueuedAt: string, startedAt?: string | null, finishedAt?: string | null }> }, analytics: { __typename?: 'MeiliAnalytics', totalSearchRequests: number, failedSyncCount: number, lastSyncTime?: string | null, topSearchTerms: Array<{ __typename?: 'SearchTermStat', term: string, count: number }>, emptyResultTerms: Array<{ __typename?: 'SearchTermStat', term: string, count: number }> }, syncProgress: { __typename?: 'MeiliSyncProgress', total: number, indexed: number, failed: number, inProgress: boolean, startedAt?: string | null, completedAt?: string | null } } };

export type GetMeiliSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeiliSettingsQuery = { __typename?: 'Query', meiliSettings: { __typename?: 'MeiliSettingsResult', searchableAttributes: Array<string>, filterableAttributes: Array<string>, sortableAttributes: Array<string>, synonyms: string, stopWords: Array<string>, rankingRules: Array<string>, typoToleranceEnabled: boolean, typoOneTypo: number, typoTwoTypos: number } };

export type RunMeiliInitialSyncMutationVariables = Exact<{ [key: string]: never; }>;


export type RunMeiliInitialSyncMutation = { __typename?: 'Mutation', runMeiliInitialSync: boolean };

export type MeiliForceSyncMutationVariables = Exact<{ [key: string]: never; }>;


export type MeiliForceSyncMutation = { __typename?: 'Mutation', meiliForceSync: boolean };

export type MeiliRunSyncInlineMutationVariables = Exact<{ [key: string]: never; }>;


export type MeiliRunSyncInlineMutation = { __typename?: 'Mutation', meiliRunSyncInline: boolean };

export type MeiliClearIndexMutationVariables = Exact<{ [key: string]: never; }>;


export type MeiliClearIndexMutation = { __typename?: 'Mutation', meiliClearIndex: boolean };

export type MeiliResetAnalyticsMutationVariables = Exact<{ [key: string]: never; }>;


export type MeiliResetAnalyticsMutation = { __typename?: 'Mutation', meiliResetAnalytics: boolean };

export type UpdateMeiliSettingsMutationVariables = Exact<{
  input: MeiliSettingsInput;
}>;


export type UpdateMeiliSettingsMutation = { __typename?: 'Mutation', updateMeiliSettings: { __typename?: 'MeiliSettingsResult', searchableAttributes: Array<string>, filterableAttributes: Array<string>, sortableAttributes: Array<string>, synonyms: string, stopWords: Array<string>, rankingRules: Array<string>, typoToleranceEnabled: boolean, typoOneTypo: number, typoTwoTypos: number } };

export type GetWorkersQueryVariables = Exact<{
  options?: InputMaybe<WorkerListOptions>;
}>;


export type GetWorkersQuery = { __typename?: 'Query', workers: { __typename?: 'WorkerList', totalItems: number, items: Array<{ __typename?: 'Worker', id: string, createdAt: any, updatedAt: any, firstName: string, lastName?: string | null, username: string, phone: string, erpCode?: string | null, note?: string | null, sort: number, enabled: boolean, role: WorkerRole, vehicle?: string | null, vehiclePlate?: string | null, address?: string | null, externalCode?: string | null }> } };

export type GetWorkerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetWorkerQuery = { __typename?: 'Query', worker?: { __typename?: 'Worker', id: string, firstName: string, lastName?: string | null, username: string, phone: string, erpCode?: string | null, note?: string | null, sort: number, enabled: boolean, role: WorkerRole, vehicle?: string | null, vehiclePlate?: string | null, address?: string | null, externalCode?: string | null } | null };

export type CreateWorkerMutationVariables = Exact<{
  input: CreateWorkerInput;
}>;


export type CreateWorkerMutation = { __typename?: 'Mutation', createWorker: { __typename?: 'Worker', id: string, firstName: string, lastName?: string | null } };

export type UpdateWorkerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateWorkerInput;
}>;


export type UpdateWorkerMutation = { __typename?: 'Mutation', updateWorker: { __typename?: 'Worker', id: string, firstName: string, lastName?: string | null } };

export type DeleteWorkerMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteWorkerMutation = { __typename?: 'Mutation', deleteWorker: { __typename?: 'DeletionResponse', result: DeletionResult, message?: string | null } };

export type AssignCourierToOrderMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
  courierId: Scalars['ID']['input'];
}>;


export type AssignCourierToOrderMutation = { __typename?: 'Mutation', assignCourierToOrder: { __typename?: 'Order', id: string, customFields?: { __typename?: 'OrderCustomFields', assignedCourierId?: string | null } | null, courier?: { __typename?: 'Worker', id: string, firstName: string, lastName?: string | null } | null } };

export type UnassignCourierFromOrderMutationVariables = Exact<{
  orderId: Scalars['ID']['input'];
}>;


export type UnassignCourierFromOrderMutation = { __typename?: 'Mutation', unassignCourierFromOrder: { __typename?: 'Order', id: string, customFields?: { __typename?: 'OrderCustomFields', assignedCourierId?: string | null } | null, courier?: { __typename?: 'Worker', id: string } | null } };



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
  AddFulfillmentToOrderResult:
    | ( CreateFulfillmentError )
    | ( EmptyOrderLineSelectionError )
    | ( Omit<Fulfillment, 'lines' | 'summary'> & { lines: Array<_RefType['FulfillmentLine']>, summary: Array<_RefType['FulfillmentLine']> } )
    | ( FulfillmentStateTransitionError )
    | ( InsufficientStockOnHandError )
    | ( InvalidFulfillmentHandlerError )
    | ( ItemsAlreadyFulfilledError )
  ;
  AddManualPaymentToOrderResult:
    | ( ManualPaymentStateError )
    | ( Omit<Order, 'aggregateOrder' | 'billingAddress' | 'channels' | 'customer' | 'fulfillments' | 'history' | 'lines' | 'modifications' | 'payments' | 'sellerOrders' | 'shippingAddress'> & { aggregateOrder?: Maybe<_RefType['Order']>, billingAddress?: Maybe<_RefType['OrderAddress']>, channels: Array<_RefType['Channel']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, history: _RefType['HistoryEntryList'], lines: Array<_RefType['OrderLine']>, modifications: Array<_RefType['OrderModification']>, payments?: Maybe<Array<_RefType['Payment']>>, sellerOrders?: Maybe<Array<_RefType['Order']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
  ;
  ApplyCouponCodeResult:
    | ( CouponCodeExpiredError )
    | ( CouponCodeInvalidError )
    | ( CouponCodeLimitError )
    | ( Omit<Order, 'aggregateOrder' | 'billingAddress' | 'channels' | 'customer' | 'fulfillments' | 'history' | 'lines' | 'modifications' | 'payments' | 'sellerOrders' | 'shippingAddress'> & { aggregateOrder?: Maybe<_RefType['Order']>, billingAddress?: Maybe<_RefType['OrderAddress']>, channels: Array<_RefType['Channel']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, history: _RefType['HistoryEntryList'], lines: Array<_RefType['OrderLine']>, modifications: Array<_RefType['OrderModification']>, payments?: Maybe<Array<_RefType['Payment']>>, sellerOrders?: Maybe<Array<_RefType['Order']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
  ;
  AuthenticationResult:
    | ( CurrentUser )
    | ( InvalidCredentialsError )
  ;
  CancelOrderResult:
    | ( CancelActiveOrderError )
    | ( EmptyOrderLineSelectionError )
    | ( MultipleOrderError )
    | ( Omit<Order, 'aggregateOrder' | 'billingAddress' | 'channels' | 'customer' | 'fulfillments' | 'history' | 'lines' | 'modifications' | 'payments' | 'sellerOrders' | 'shippingAddress'> & { aggregateOrder?: Maybe<_RefType['Order']>, billingAddress?: Maybe<_RefType['OrderAddress']>, channels: Array<_RefType['Channel']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, history: _RefType['HistoryEntryList'], lines: Array<_RefType['OrderLine']>, modifications: Array<_RefType['OrderModification']>, payments?: Maybe<Array<_RefType['Payment']>>, sellerOrders?: Maybe<Array<_RefType['Order']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( OrderStateTransitionError )
    | ( QuantityTooGreatError )
  ;
  CancelPaymentResult:
    | ( CancelPaymentError )
    | ( Omit<Payment, 'refunds'> & { refunds: Array<_RefType['Refund']> } )
    | ( PaymentStateTransitionError )
  ;
  CreateAssetResult:
    | ( Asset )
    | ( MimeTypeError )
  ;
  CreateChannelResult:
    | ( Omit<Channel, 'customFields' | 'defaultShippingZone' | 'defaultTaxZone'> & { customFields?: Maybe<_RefType['ChannelCustomFields']>, defaultShippingZone?: Maybe<_RefType['Zone']>, defaultTaxZone?: Maybe<_RefType['Zone']> } )
    | ( LanguageNotAvailableError )
  ;
  CreateCustomerResult:
    | ( Omit<Customer, 'addresses' | 'groups' | 'history' | 'orders' | 'user'> & { addresses?: Maybe<Array<_RefType['Address']>>, groups: Array<_RefType['CustomerGroup']>, history: _RefType['HistoryEntryList'], orders: _RefType['OrderList'], user?: Maybe<_RefType['User']> } )
    | ( EmailAddressConflictError )
  ;
  CreatePromotionResult:
    | ( MissingConditionsError )
    | ( Promotion )
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
  DuplicateEntityResult:
    | ( DuplicateEntityError )
    | ( DuplicateEntitySuccess )
  ;
  ModifyOrderResult:
    | ( CouponCodeExpiredError )
    | ( CouponCodeInvalidError )
    | ( CouponCodeLimitError )
    | ( IneligibleShippingMethodError )
    | ( Omit<InsufficientStockError, 'order'> & { order: _RefType['Order'] } )
    | ( NegativeQuantityError )
    | ( NoChangesSpecifiedError )
    | ( Omit<Order, 'aggregateOrder' | 'billingAddress' | 'channels' | 'customer' | 'fulfillments' | 'history' | 'lines' | 'modifications' | 'payments' | 'sellerOrders' | 'shippingAddress'> & { aggregateOrder?: Maybe<_RefType['Order']>, billingAddress?: Maybe<_RefType['OrderAddress']>, channels: Array<_RefType['Channel']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, history: _RefType['HistoryEntryList'], lines: Array<_RefType['OrderLine']>, modifications: Array<_RefType['OrderModification']>, payments?: Maybe<Array<_RefType['Payment']>>, sellerOrders?: Maybe<Array<_RefType['Order']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( OrderLimitError )
    | ( OrderModificationStateError )
    | ( PaymentMethodMissingError )
    | ( RefundPaymentIdMissingError )
  ;
  NativeAuthenticationResult:
    | ( CurrentUser )
    | ( InvalidCredentialsError )
    | ( NativeAuthStrategyError )
  ;
  RefundOrderResult:
    | ( AlreadyRefundedError )
    | ( MultipleOrderError )
    | ( NothingToRefundError )
    | ( OrderStateTransitionError )
    | ( PaymentOrderMismatchError )
    | ( QuantityTooGreatError )
    | ( Omit<Refund, 'lines'> & { lines: Array<_RefType['RefundLine']> } )
    | ( RefundAmountError )
    | ( RefundOrderStateError )
    | ( RefundStateTransitionError )
  ;
  RemoveFacetFromChannelResult:
    | ( Facet )
    | ( FacetInUseError )
  ;
  RemoveOptionGroupFromProductResult:
    | ( Omit<Product, 'activeOptionGroups' | 'categories' | 'category' | 'channels' | 'collections' | 'optionGroups' | 'seasons' | 'variantList' | 'variants'> & { activeOptionGroups: Array<_RefType['ProductOptionGroup']>, categories: Array<_RefType['Category']>, category?: Maybe<_RefType['Category']>, channels: Array<_RefType['Channel']>, collections: Array<_RefType['Collection']>, optionGroups: Array<_RefType['ProductOptionGroup']>, seasons: Array<_RefType['Season']>, variantList: _RefType['ProductVariantList'], variants: Array<_RefType['ProductVariant']> } )
    | ( ProductOptionInUseError )
  ;
  RemoveOrderItemsResult:
    | ( Omit<Order, 'aggregateOrder' | 'billingAddress' | 'channels' | 'customer' | 'fulfillments' | 'history' | 'lines' | 'modifications' | 'payments' | 'sellerOrders' | 'shippingAddress'> & { aggregateOrder?: Maybe<_RefType['Order']>, billingAddress?: Maybe<_RefType['OrderAddress']>, channels: Array<_RefType['Channel']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, history: _RefType['HistoryEntryList'], lines: Array<_RefType['OrderLine']>, modifications: Array<_RefType['OrderModification']>, payments?: Maybe<Array<_RefType['Payment']>>, sellerOrders?: Maybe<Array<_RefType['Order']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( OrderInterceptorError )
    | ( OrderModificationError )
  ;
  RemoveProductOptionGroupFromChannelResult:
    | ( Omit<ProductOptionGroup, 'channels' | 'options'> & { channels: Array<_RefType['Channel']>, options: Array<_RefType['ProductOption']> } )
    | ( ProductOptionGroupInUseError )
  ;
  SearchResultPrice:
    | ( PriceRange )
    | ( SinglePrice )
  ;
  SetCustomerForDraftOrderResult:
    | ( EmailAddressConflictError )
    | ( Omit<Order, 'aggregateOrder' | 'billingAddress' | 'channels' | 'customer' | 'fulfillments' | 'history' | 'lines' | 'modifications' | 'payments' | 'sellerOrders' | 'shippingAddress'> & { aggregateOrder?: Maybe<_RefType['Order']>, billingAddress?: Maybe<_RefType['OrderAddress']>, channels: Array<_RefType['Channel']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, history: _RefType['HistoryEntryList'], lines: Array<_RefType['OrderLine']>, modifications: Array<_RefType['OrderModification']>, payments?: Maybe<Array<_RefType['Payment']>>, sellerOrders?: Maybe<Array<_RefType['Order']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
  ;
  SetOrderShippingMethodResult:
    | ( IneligibleShippingMethodError )
    | ( NoActiveOrderError )
    | ( Omit<Order, 'aggregateOrder' | 'billingAddress' | 'channels' | 'customer' | 'fulfillments' | 'history' | 'lines' | 'modifications' | 'payments' | 'sellerOrders' | 'shippingAddress'> & { aggregateOrder?: Maybe<_RefType['Order']>, billingAddress?: Maybe<_RefType['OrderAddress']>, channels: Array<_RefType['Channel']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, history: _RefType['HistoryEntryList'], lines: Array<_RefType['OrderLine']>, modifications: Array<_RefType['OrderModification']>, payments?: Maybe<Array<_RefType['Payment']>>, sellerOrders?: Maybe<Array<_RefType['Order']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( OrderModificationError )
  ;
  SettlePaymentResult:
    | ( OrderStateTransitionError )
    | ( Omit<Payment, 'refunds'> & { refunds: Array<_RefType['Refund']> } )
    | ( PaymentStateTransitionError )
    | ( SettlePaymentError )
  ;
  SettleRefundResult:
    | ( Omit<Refund, 'lines'> & { lines: Array<_RefType['RefundLine']> } )
    | ( RefundStateTransitionError )
  ;
  StockMovementItem:
    | ( Omit<Allocation, 'orderLine' | 'productVariant'> & { orderLine: _RefType['OrderLine'], productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Cancellation, 'orderLine' | 'productVariant'> & { orderLine: _RefType['OrderLine'], productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Release, 'productVariant'> & { productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Return, 'productVariant'> & { productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Sale, 'productVariant'> & { productVariant: _RefType['ProductVariant'] } )
    | ( Omit<StockAdjustment, 'productVariant'> & { productVariant: _RefType['ProductVariant'] } )
  ;
  StructFieldConfig:
    | ( BooleanStructFieldConfig )
    | ( DateTimeStructFieldConfig )
    | ( FloatStructFieldConfig )
    | ( IntStructFieldConfig )
    | ( StringStructFieldConfig )
    | ( TextStructFieldConfig )
  ;
  TransitionFulfillmentToStateResult:
    | ( Omit<Fulfillment, 'lines' | 'summary'> & { lines: Array<_RefType['FulfillmentLine']>, summary: Array<_RefType['FulfillmentLine']> } )
    | ( FulfillmentStateTransitionError )
  ;
  TransitionOrderToStateResult:
    | ( Omit<Order, 'aggregateOrder' | 'billingAddress' | 'channels' | 'customer' | 'fulfillments' | 'history' | 'lines' | 'modifications' | 'payments' | 'sellerOrders' | 'shippingAddress'> & { aggregateOrder?: Maybe<_RefType['Order']>, billingAddress?: Maybe<_RefType['OrderAddress']>, channels: Array<_RefType['Channel']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, history: _RefType['HistoryEntryList'], lines: Array<_RefType['OrderLine']>, modifications: Array<_RefType['OrderModification']>, payments?: Maybe<Array<_RefType['Payment']>>, sellerOrders?: Maybe<Array<_RefType['Order']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( OrderStateTransitionError )
  ;
  TransitionPaymentToStateResult:
    | ( Omit<Payment, 'refunds'> & { refunds: Array<_RefType['Refund']> } )
    | ( PaymentStateTransitionError )
  ;
  UpdateChannelResult:
    | ( Omit<Channel, 'customFields' | 'defaultShippingZone' | 'defaultTaxZone'> & { customFields?: Maybe<_RefType['ChannelCustomFields']>, defaultShippingZone?: Maybe<_RefType['Zone']>, defaultTaxZone?: Maybe<_RefType['Zone']> } )
    | ( LanguageNotAvailableError )
  ;
  UpdateCustomerResult:
    | ( Omit<Customer, 'addresses' | 'groups' | 'history' | 'orders' | 'user'> & { addresses?: Maybe<Array<_RefType['Address']>>, groups: Array<_RefType['CustomerGroup']>, history: _RefType['HistoryEntryList'], orders: _RefType['OrderList'], user?: Maybe<_RefType['User']> } )
    | ( EmailAddressConflictError )
  ;
  UpdateGlobalSettingsResult:
    | ( ChannelDefaultLanguageError )
    | ( Omit<GlobalSettings, 'serverConfig'> & { serverConfig: _RefType['ServerConfig'] } )
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
    | ( Omit<Order, 'aggregateOrder' | 'billingAddress' | 'channels' | 'customer' | 'fulfillments' | 'history' | 'lines' | 'modifications' | 'payments' | 'sellerOrders' | 'shippingAddress'> & { aggregateOrder?: Maybe<_RefType['Order']>, billingAddress?: Maybe<_RefType['OrderAddress']>, channels: Array<_RefType['Channel']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, history: _RefType['HistoryEntryList'], lines: Array<_RefType['OrderLine']>, modifications: Array<_RefType['OrderModification']>, payments?: Maybe<Array<_RefType['Payment']>>, sellerOrders?: Maybe<Array<_RefType['Order']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( OrderInterceptorError )
    | ( OrderLimitError )
    | ( OrderModificationError )
  ;
  UpdatePromotionResult:
    | ( MissingConditionsError )
    | ( Promotion )
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
    | ( AlreadyRefundedError )
    | ( CancelActiveOrderError )
    | ( CancelPaymentError )
    | ( ChannelDefaultLanguageError )
    | ( CouponCodeExpiredError )
    | ( CouponCodeInvalidError )
    | ( CouponCodeLimitError )
    | ( CreateFulfillmentError )
    | ( DuplicateEntityError )
    | ( EmailAddressConflictError )
    | ( EmptyOrderLineSelectionError )
    | ( FacetInUseError )
    | ( FulfillmentStateTransitionError )
    | ( GuestCheckoutError )
    | ( IneligibleShippingMethodError )
    | ( Omit<InsufficientStockError, 'order'> & { order: _RefType['Order'] } )
    | ( InsufficientStockOnHandError )
    | ( InvalidCredentialsError )
    | ( InvalidFulfillmentHandlerError )
    | ( ItemsAlreadyFulfilledError )
    | ( LanguageNotAvailableError )
    | ( ManualPaymentStateError )
    | ( MimeTypeError )
    | ( MissingConditionsError )
    | ( MultipleOrderError )
    | ( NativeAuthStrategyError )
    | ( NegativeQuantityError )
    | ( NoActiveOrderError )
    | ( NoChangesSpecifiedError )
    | ( NothingToRefundError )
    | ( OrderInterceptorError )
    | ( OrderLimitError )
    | ( OrderModificationError )
    | ( OrderModificationStateError )
    | ( OrderStateTransitionError )
    | ( PaymentMethodMissingError )
    | ( PaymentOrderMismatchError )
    | ( PaymentStateTransitionError )
    | ( ProductOptionGroupInUseError )
    | ( ProductOptionInUseError )
    | ( QuantityTooGreatError )
    | ( RefundAmountError )
    | ( RefundOrderStateError )
    | ( RefundPaymentIdMissingError )
    | ( RefundStateTransitionError )
    | ( SettlePaymentError )
  ;
  Node:
    | ( Omit<Address, 'country'> & { country: _RefType['Country'] } )
    | ( Omit<Administrator, 'user'> & { user: _RefType['User'] } )
    | ( Omit<Allocation, 'orderLine' | 'productVariant'> & { orderLine: _RefType['OrderLine'], productVariant: _RefType['ProductVariant'] } )
    | ( Omit<ApiKey, 'owner' | 'user'> & { owner: _RefType['User'], user: _RefType['User'] } )
    | ( ApiKeyTranslation )
    | ( Asset )
    | ( AuthenticationMethod )
    | ( Omit<Banner, 'assets' | 'category' | 'products' | 'type' | 'variants'> & { assets: Array<_RefType['BannerAsset']>, category?: Maybe<_RefType['Category']>, products?: Maybe<Array<_RefType['Product']>>, type?: Maybe<_RefType['BannerType']>, variants?: Maybe<Array<_RefType['ProductVariant']>> } )
    | ( Omit<BannerAsset, 'banner'> & { banner: _RefType['Banner'] } )
    | ( Omit<BannerType, 'banners'> & { banners: Array<_RefType['Banner']> } )
    | ( Omit<Cancellation, 'orderLine' | 'productVariant'> & { orderLine: _RefType['OrderLine'], productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Category, 'banners' | 'categoryType' | 'children' | 'parent' | 'productsByLabel'> & { banners: Array<_RefType['Banner']>, categoryType: _RefType['CategoryType'], children: Array<_RefType['Category']>, parent?: Maybe<_RefType['Category']>, productsByLabel: Array<_RefType['Product']> } )
    | ( Omit<CategoryType, 'categories'> & { categories: Array<_RefType['Category']> } )
    | ( Omit<Channel, 'customFields' | 'defaultShippingZone' | 'defaultTaxZone'> & { customFields?: Maybe<_RefType['ChannelCustomFields']>, defaultShippingZone?: Maybe<_RefType['Zone']>, defaultTaxZone?: Maybe<_RefType['Zone']> } )
    | ( Omit<Collection, 'breadcrumbs' | 'children' | 'parent' | 'productVariants'> & { breadcrumbs: Array<_RefType['CollectionBreadcrumb']>, children?: Maybe<Array<_RefType['Collection']>>, parent?: Maybe<_RefType['Collection']>, productVariants: _RefType['ProductVariantList'] } )
    | ( Omit<Country, 'parent'> & { parent?: Maybe<_RefType['Region']> } )
    | ( Omit<Customer, 'addresses' | 'groups' | 'history' | 'orders' | 'user'> & { addresses?: Maybe<Array<_RefType['Address']>>, groups: Array<_RefType['CustomerGroup']>, history: _RefType['HistoryEntryList'], orders: _RefType['OrderList'], user?: Maybe<_RefType['User']> } )
    | ( Omit<CustomerGroup, 'customers'> & { customers: _RefType['CustomerList'] } )
    | ( Day )
    | ( DeliveryMethod )
    | ( Facet )
    | ( FacetValue )
    | ( Omit<Fulfillment, 'lines' | 'summary'> & { lines: Array<_RefType['FulfillmentLine']>, summary: Array<_RefType['FulfillmentLine']> } )
    | ( Omit<HistoryEntry, 'administrator'> & { administrator?: Maybe<_RefType['Administrator']> } )
    | ( ImportJob )
    | ( ImportLog )
    | ( Job )
    | ( Label )
    | ( Omit<Order, 'aggregateOrder' | 'billingAddress' | 'channels' | 'customer' | 'fulfillments' | 'history' | 'lines' | 'modifications' | 'payments' | 'sellerOrders' | 'shippingAddress'> & { aggregateOrder?: Maybe<_RefType['Order']>, billingAddress?: Maybe<_RefType['OrderAddress']>, channels: Array<_RefType['Channel']>, customer?: Maybe<_RefType['Customer']>, fulfillments?: Maybe<Array<_RefType['Fulfillment']>>, history: _RefType['HistoryEntryList'], lines: Array<_RefType['OrderLine']>, modifications: Array<_RefType['OrderModification']>, payments?: Maybe<Array<_RefType['Payment']>>, sellerOrders?: Maybe<Array<_RefType['Order']>>, shippingAddress?: Maybe<_RefType['OrderAddress']> } )
    | ( Omit<OrderLine, 'fulfillmentLines' | 'order' | 'productVariant'> & { fulfillmentLines?: Maybe<Array<_RefType['FulfillmentLine']>>, order: _RefType['Order'], productVariant: _RefType['ProductVariant'] } )
    | ( Omit<OrderModification, 'lines' | 'payment' | 'refund'> & { lines: Array<_RefType['OrderModificationLine']>, payment?: Maybe<_RefType['Payment']>, refund?: Maybe<_RefType['Refund']> } )
    | ( Omit<Payment, 'refunds'> & { refunds: Array<_RefType['Refund']> } )
    | ( PaymentMethod )
    | ( Omit<Product, 'activeOptionGroups' | 'categories' | 'category' | 'channels' | 'collections' | 'optionGroups' | 'seasons' | 'variantList' | 'variants'> & { activeOptionGroups: Array<_RefType['ProductOptionGroup']>, categories: Array<_RefType['Category']>, category?: Maybe<_RefType['Category']>, channels: Array<_RefType['Channel']>, collections: Array<_RefType['Collection']>, optionGroups: Array<_RefType['ProductOptionGroup']>, seasons: Array<_RefType['Season']>, variantList: _RefType['ProductVariantList'], variants: Array<_RefType['ProductVariant']> } )
    | ( Omit<ProductOption, 'group'> & { group: _RefType['ProductOptionGroup'] } )
    | ( Omit<ProductOptionGroup, 'channels' | 'options'> & { channels: Array<_RefType['Channel']>, options: Array<_RefType['ProductOption']> } )
    | ( Omit<ProductVariant, 'channels' | 'options' | 'product' | 'stockMovements' | 'taxRateApplied'> & { channels: Array<_RefType['Channel']>, options: Array<_RefType['ProductOption']>, product: _RefType['Product'], stockMovements: _RefType['StockMovementList'], taxRateApplied: _RefType['TaxRate'] } )
    | ( Promotion )
    | ( Omit<Province, 'parent'> & { parent?: Maybe<_RefType['Region']> } )
    | ( Omit<Refund, 'lines'> & { lines: Array<_RefType['RefundLine']> } )
    | ( Omit<Release, 'productVariant'> & { productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Return, 'productVariant'> & { productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Role, 'channels'> & { channels: Array<_RefType['Channel']> } )
    | ( Omit<Sale, 'productVariant'> & { productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Season, 'products'> & { products: _RefType['ProductList'] } )
    | ( SeasonTranslation )
    | ( Seller )
    | ( ShippingMethod )
    | ( Omit<StockAdjustment, 'productVariant'> & { productVariant: _RefType['ProductVariant'] } )
    | ( StockLevel )
    | ( StockLocation )
    | ( Surcharge )
    | ( Tag )
    | ( TaxCategory )
    | ( Omit<TaxRate, 'customerGroup' | 'zone'> & { customerGroup?: Maybe<_RefType['CustomerGroup']>, zone: _RefType['Zone'] } )
    | ( Omit<User, 'authenticationMethods' | 'roles'> & { authenticationMethods: Array<_RefType['AuthenticationMethod']>, roles: Array<_RefType['Role']> } )
    | ( Worker )
    | ( Omit<Zone, 'members'> & { members: Array<_RefType['Region']> } )
  ;
  PaginatedList:
    | ( Omit<AdministratorList, 'items'> & { items: Array<_RefType['Administrator']> } )
    | ( Omit<ApiKeyList, 'items'> & { items: Array<_RefType['ApiKey']> } )
    | ( AssetList )
    | ( Omit<BannerList, 'items'> & { items: Array<_RefType['Banner']> } )
    | ( Omit<BannerTypeList, 'items'> & { items: Array<_RefType['BannerType']> } )
    | ( Omit<CategoryList, 'items'> & { items: Array<_RefType['Category']> } )
    | ( Omit<CategoryTypeList, 'items'> & { items: Array<_RefType['CategoryType']> } )
    | ( Omit<ChannelList, 'items'> & { items: Array<_RefType['Channel']> } )
    | ( Omit<CollectionList, 'items'> & { items: Array<_RefType['Collection']> } )
    | ( Omit<CountryList, 'items'> & { items: Array<_RefType['Country']> } )
    | ( Omit<CustomerGroupList, 'items'> & { items: Array<_RefType['CustomerGroup']> } )
    | ( Omit<CustomerList, 'items'> & { items: Array<_RefType['Customer']> } )
    | ( DayList )
    | ( DeliveryMethodList )
    | ( FacetList )
    | ( FacetValueList )
    | ( Omit<HistoryEntryList, 'items'> & { items: Array<_RefType['HistoryEntry']> } )
    | ( ImportJobList )
    | ( JobList )
    | ( LabelList )
    | ( Omit<OrderList, 'items'> & { items: Array<_RefType['Order']> } )
    | ( PaymentMethodList )
    | ( Omit<ProductList, 'items'> & { items: Array<_RefType['Product']> } )
    | ( Omit<ProductOptionGroupList, 'items'> & { items: Array<_RefType['ProductOptionGroup']> } )
    | ( Omit<ProductOptionList, 'items'> & { items: Array<_RefType['ProductOption']> } )
    | ( Omit<ProductVariantList, 'items'> & { items: Array<_RefType['ProductVariant']> } )
    | ( PromotionList )
    | ( Omit<ProvinceList, 'items'> & { items: Array<_RefType['Province']> } )
    | ( Omit<RoleList, 'items'> & { items: Array<_RefType['Role']> } )
    | ( Omit<SeasonList, 'items'> & { items: Array<_RefType['Season']> } )
    | ( SellerList )
    | ( ShippingMethodList )
    | ( StockLocationList )
    | ( TagList )
    | ( TaxCategoryList )
    | ( Omit<TaxRateList, 'items'> & { items: Array<_RefType['TaxRate']> } )
    | ( WorkerList )
    | ( Omit<ZoneList, 'items'> & { items: Array<_RefType['Zone']> } )
  ;
  Region:
    | ( Omit<Country, 'parent'> & { parent?: Maybe<_RefType['Region']> } )
    | ( Omit<Province, 'parent'> & { parent?: Maybe<_RefType['Region']> } )
  ;
  StockMovement:
    | ( Omit<Allocation, 'orderLine' | 'productVariant'> & { orderLine: _RefType['OrderLine'], productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Cancellation, 'orderLine' | 'productVariant'> & { orderLine: _RefType['OrderLine'], productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Release, 'productVariant'> & { productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Return, 'productVariant'> & { productVariant: _RefType['ProductVariant'] } )
    | ( Omit<Sale, 'productVariant'> & { productVariant: _RefType['ProductVariant'] } )
    | ( Omit<StockAdjustment, 'productVariant'> & { productVariant: _RefType['ProductVariant'] } )
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
  AddFulfillmentToOrderResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['AddFulfillmentToOrderResult']>;
  AddItemInput: AddItemInput;
  AddItemToDraftOrderInput: AddItemToDraftOrderInput;
  AddManualPaymentToOrderResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['AddManualPaymentToOrderResult']>;
  AddNoteToCustomerInput: AddNoteToCustomerInput;
  AddNoteToOrderInput: AddNoteToOrderInput;
  Address: ResolverTypeWrapper<Omit<Address, 'country'> & { country: ResolversTypes['Country'] }>;
  AddressCustomFields: ResolverTypeWrapper<AddressCustomFields>;
  AdjustDraftOrderLineInput: AdjustDraftOrderLineInput;
  Adjustment: ResolverTypeWrapper<Adjustment>;
  AdjustmentType: AdjustmentType;
  AdminFilteredProductFilterParameters: AdminFilteredProductFilterParameters;
  AdminFilteredProductListOptions: AdminFilteredProductListOptions;
  Administrator: ResolverTypeWrapper<Omit<Administrator, 'user'> & { user: ResolversTypes['User'] }>;
  AdministratorFilterParameter: AdministratorFilterParameter;
  AdministratorList: ResolverTypeWrapper<Omit<AdministratorList, 'items'> & { items: Array<ResolversTypes['Administrator']> }>;
  AdministratorListOptions: AdministratorListOptions;
  AdministratorPaymentInput: AdministratorPaymentInput;
  AdministratorRefundInput: AdministratorRefundInput;
  AdministratorSortParameter: AdministratorSortParameter;
  AggregatedMetadata: ResolverTypeWrapper<Omit<AggregatedMetadata, 'categories'> & { categories: Array<ResolversTypes['Category']> }>;
  Allocation: ResolverTypeWrapper<Omit<Allocation, 'orderLine' | 'productVariant'> & { orderLine: ResolversTypes['OrderLine'], productVariant: ResolversTypes['ProductVariant'] }>;
  AlreadyRefundedError: ResolverTypeWrapper<AlreadyRefundedError>;
  ApiKey: ResolverTypeWrapper<Omit<ApiKey, 'owner' | 'user'> & { owner: ResolversTypes['User'], user: ResolversTypes['User'] }>;
  ApiKeyFilterParameter: ApiKeyFilterParameter;
  ApiKeyList: ResolverTypeWrapper<Omit<ApiKeyList, 'items'> & { items: Array<ResolversTypes['ApiKey']> }>;
  ApiKeyListOptions: ApiKeyListOptions;
  ApiKeySortParameter: ApiKeySortParameter;
  ApiKeyTranslation: ResolverTypeWrapper<ApiKeyTranslation>;
  ApplyCouponCodeResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ApplyCouponCodeResult']>;
  Asset: ResolverTypeWrapper<Asset>;
  AssetFilterParameter: AssetFilterParameter;
  AssetList: ResolverTypeWrapper<AssetList>;
  AssetListOptions: AssetListOptions;
  AssetSortParameter: AssetSortParameter;
  AssetTranslation: ResolverTypeWrapper<AssetTranslation>;
  AssetTranslationInput: AssetTranslationInput;
  AssetType: AssetType;
  AssignAssetsToChannelInput: AssignAssetsToChannelInput;
  AssignCollectionsToChannelInput: AssignCollectionsToChannelInput;
  AssignFacetsToChannelInput: AssignFacetsToChannelInput;
  AssignPaymentMethodsToChannelInput: AssignPaymentMethodsToChannelInput;
  AssignProductOptionGroupsToChannelInput: AssignProductOptionGroupsToChannelInput;
  AssignProductVariantsToChannelInput: AssignProductVariantsToChannelInput;
  AssignProductsToChannelInput: AssignProductsToChannelInput;
  AssignPromotionsToChannelInput: AssignPromotionsToChannelInput;
  AssignShippingMethodsToChannelInput: AssignShippingMethodsToChannelInput;
  AssignStockLocationsToChannelInput: AssignStockLocationsToChannelInput;
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
  BannerTranslationInput: BannerTranslationInput;
  BannerType: ResolverTypeWrapper<Omit<BannerType, 'banners'> & { banners: Array<ResolversTypes['Banner']> }>;
  BannerTypeFilterParameter: BannerTypeFilterParameter;
  BannerTypeList: ResolverTypeWrapper<Omit<BannerTypeList, 'items'> & { items: Array<ResolversTypes['BannerType']> }>;
  BannerTypeListOptions: BannerTypeListOptions;
  BannerTypeSortParameter: BannerTypeSortParameter;
  BannerTypeTranslation: ResolverTypeWrapper<BannerTypeTranslation>;
  BannerTypeTranslationInput: BannerTypeTranslationInput;
  BaseResponse: ResolverTypeWrapper<BaseResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BooleanCustomFieldConfig: ResolverTypeWrapper<BooleanCustomFieldConfig>;
  BooleanListOperators: BooleanListOperators;
  BooleanOperators: BooleanOperators;
  BooleanStructFieldConfig: ResolverTypeWrapper<BooleanStructFieldConfig>;
  CancelActiveOrderError: ResolverTypeWrapper<CancelActiveOrderError>;
  CancelOrderInput: CancelOrderInput;
  CancelOrderResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CancelOrderResult']>;
  CancelPaymentError: ResolverTypeWrapper<CancelPaymentError>;
  CancelPaymentResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CancelPaymentResult']>;
  Cancellation: ResolverTypeWrapper<Omit<Cancellation, 'orderLine' | 'productVariant'> & { orderLine: ResolversTypes['OrderLine'], productVariant: ResolversTypes['ProductVariant'] }>;
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
  ChannelDefaultLanguageError: ResolverTypeWrapper<ChannelDefaultLanguageError>;
  ChannelFilterParameter: ChannelFilterParameter;
  ChannelList: ResolverTypeWrapper<Omit<ChannelList, 'items'> & { items: Array<ResolversTypes['Channel']> }>;
  ChannelListOptions: ChannelListOptions;
  ChannelSortParameter: ChannelSortParameter;
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
  CoordinateInput: CoordinateInput;
  Country: ResolverTypeWrapper<Omit<Country, 'parent'> & { parent?: Maybe<ResolversTypes['Region']> }>;
  CountryFilterParameter: CountryFilterParameter;
  CountryList: ResolverTypeWrapper<Omit<CountryList, 'items'> & { items: Array<ResolversTypes['Country']> }>;
  CountryListOptions: CountryListOptions;
  CountrySortParameter: CountrySortParameter;
  CountryTranslationInput: CountryTranslationInput;
  CouponCodeExpiredError: ResolverTypeWrapper<CouponCodeExpiredError>;
  CouponCodeInvalidError: ResolverTypeWrapper<CouponCodeInvalidError>;
  CouponCodeLimitError: ResolverTypeWrapper<CouponCodeLimitError>;
  CreateAddressCustomFieldsInput: CreateAddressCustomFieldsInput;
  CreateAddressInput: CreateAddressInput;
  CreateAdministratorInput: CreateAdministratorInput;
  CreateApiKeyInput: CreateApiKeyInput;
  CreateApiKeyResult: ResolverTypeWrapper<CreateApiKeyResult>;
  CreateApiKeyTranslationInput: CreateApiKeyTranslationInput;
  CreateAssetInput: CreateAssetInput;
  CreateAssetResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateAssetResult']>;
  CreateBannerInput: CreateBannerInput;
  CreateBannerTypeInput: CreateBannerTypeInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateCategoryTypeInput: CreateCategoryTypeInput;
  CreateChannelCustomFieldsInput: CreateChannelCustomFieldsInput;
  CreateChannelInput: CreateChannelInput;
  CreateChannelResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateChannelResult']>;
  CreateCollectionInput: CreateCollectionInput;
  CreateCollectionTranslationInput: CreateCollectionTranslationInput;
  CreateCountryInput: CreateCountryInput;
  CreateCustomerCustomFieldsInput: CreateCustomerCustomFieldsInput;
  CreateCustomerGroupInput: CreateCustomerGroupInput;
  CreateCustomerInput: CreateCustomerInput;
  CreateCustomerResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreateCustomerResult']>;
  CreateDayInput: CreateDayInput;
  CreateDeliveryMethodInput: CreateDeliveryMethodInput;
  CreateFacetInput: CreateFacetInput;
  CreateFacetValueCustomFieldsInput: CreateFacetValueCustomFieldsInput;
  CreateFacetValueInput: CreateFacetValueInput;
  CreateFacetValueWithFacetInput: CreateFacetValueWithFacetInput;
  CreateFulfillmentError: ResolverTypeWrapper<CreateFulfillmentError>;
  CreateGroupOptionInput: CreateGroupOptionInput;
  CreateLabelInput: CreateLabelInput;
  CreatePaymentMethodInput: CreatePaymentMethodInput;
  CreateProductCustomFieldsInput: CreateProductCustomFieldsInput;
  CreateProductInput: CreateProductInput;
  CreateProductOptionGroupInput: CreateProductOptionGroupInput;
  CreateProductOptionInput: CreateProductOptionInput;
  CreateProductVariantInput: CreateProductVariantInput;
  CreateProductVariantOptionInput: CreateProductVariantOptionInput;
  CreateProductVariantPriceInput: CreateProductVariantPriceInput;
  CreatePromotionCustomFieldsInput: CreatePromotionCustomFieldsInput;
  CreatePromotionInput: CreatePromotionInput;
  CreatePromotionResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CreatePromotionResult']>;
  CreateProvinceInput: CreateProvinceInput;
  CreateRoleInput: CreateRoleInput;
  CreateSeasonInput: CreateSeasonInput;
  CreateSellerInput: CreateSellerInput;
  CreateShippingMethodInput: CreateShippingMethodInput;
  CreateStockLocationInput: CreateStockLocationInput;
  CreateTagInput: CreateTagInput;
  CreateTaxCategoryInput: CreateTaxCategoryInput;
  CreateTaxRateInput: CreateTaxRateInput;
  CreateWorkerInput: CreateWorkerInput;
  CreateZoneInput: CreateZoneInput;
  CurrencyCode: CurrencyCode;
  CurrentUser: ResolverTypeWrapper<CurrentUser>;
  CurrentUserChannel: ResolverTypeWrapper<CurrentUserChannel>;
  CustomField: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['CustomField']>;
  CustomFieldConfig: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['CustomFieldConfig']>;
  CustomFields: ResolverTypeWrapper<Omit<CustomFields, 'Address' | 'Administrator' | 'ApiKey' | 'Asset' | 'Banner' | 'BannerType' | 'Category' | 'CategoryType' | 'Channel' | 'Collection' | 'Customer' | 'CustomerGroup' | 'Day' | 'DeliveryMethod' | 'Facet' | 'FacetValue' | 'Fulfillment' | 'GlobalSettings' | 'HistoryEntry' | 'Label' | 'Order' | 'OrderLine' | 'Payment' | 'PaymentMethod' | 'Product' | 'ProductOption' | 'ProductOptionGroup' | 'ProductVariant' | 'ProductVariantPrice' | 'Promotion' | 'Refund' | 'Region' | 'Seller' | 'Session' | 'ShippingLine' | 'ShippingMethod' | 'StockLevel' | 'StockLocation' | 'StockMovement' | 'TaxCategory' | 'TaxRate' | 'User' | 'Zone'> & { Address: Array<ResolversTypes['CustomFieldConfig']>, Administrator: Array<ResolversTypes['CustomFieldConfig']>, ApiKey: Array<ResolversTypes['CustomFieldConfig']>, Asset: Array<ResolversTypes['CustomFieldConfig']>, Banner: Array<ResolversTypes['CustomFieldConfig']>, BannerType: Array<ResolversTypes['CustomFieldConfig']>, Category: Array<ResolversTypes['CustomFieldConfig']>, CategoryType: Array<ResolversTypes['CustomFieldConfig']>, Channel: Array<ResolversTypes['CustomFieldConfig']>, Collection: Array<ResolversTypes['CustomFieldConfig']>, Customer: Array<ResolversTypes['CustomFieldConfig']>, CustomerGroup: Array<ResolversTypes['CustomFieldConfig']>, Day: Array<ResolversTypes['CustomFieldConfig']>, DeliveryMethod: Array<ResolversTypes['CustomFieldConfig']>, Facet: Array<ResolversTypes['CustomFieldConfig']>, FacetValue: Array<ResolversTypes['CustomFieldConfig']>, Fulfillment: Array<ResolversTypes['CustomFieldConfig']>, GlobalSettings: Array<ResolversTypes['CustomFieldConfig']>, HistoryEntry: Array<ResolversTypes['CustomFieldConfig']>, Label: Array<ResolversTypes['CustomFieldConfig']>, Order: Array<ResolversTypes['CustomFieldConfig']>, OrderLine: Array<ResolversTypes['CustomFieldConfig']>, Payment: Array<ResolversTypes['CustomFieldConfig']>, PaymentMethod: Array<ResolversTypes['CustomFieldConfig']>, Product: Array<ResolversTypes['CustomFieldConfig']>, ProductOption: Array<ResolversTypes['CustomFieldConfig']>, ProductOptionGroup: Array<ResolversTypes['CustomFieldConfig']>, ProductVariant: Array<ResolversTypes['CustomFieldConfig']>, ProductVariantPrice: Array<ResolversTypes['CustomFieldConfig']>, Promotion: Array<ResolversTypes['CustomFieldConfig']>, Refund: Array<ResolversTypes['CustomFieldConfig']>, Region: Array<ResolversTypes['CustomFieldConfig']>, Seller: Array<ResolversTypes['CustomFieldConfig']>, Session: Array<ResolversTypes['CustomFieldConfig']>, ShippingLine: Array<ResolversTypes['CustomFieldConfig']>, ShippingMethod: Array<ResolversTypes['CustomFieldConfig']>, StockLevel: Array<ResolversTypes['CustomFieldConfig']>, StockLocation: Array<ResolversTypes['CustomFieldConfig']>, StockMovement: Array<ResolversTypes['CustomFieldConfig']>, TaxCategory: Array<ResolversTypes['CustomFieldConfig']>, TaxRate: Array<ResolversTypes['CustomFieldConfig']>, User: Array<ResolversTypes['CustomFieldConfig']>, Zone: Array<ResolversTypes['CustomFieldConfig']> }>;
  Customer: ResolverTypeWrapper<Omit<Customer, 'addresses' | 'groups' | 'history' | 'orders' | 'user'> & { addresses?: Maybe<Array<ResolversTypes['Address']>>, groups: Array<ResolversTypes['CustomerGroup']>, history: ResolversTypes['HistoryEntryList'], orders: ResolversTypes['OrderList'], user?: Maybe<ResolversTypes['User']> }>;
  CustomerCustomFields: ResolverTypeWrapper<CustomerCustomFields>;
  CustomerFilterParameter: CustomerFilterParameter;
  CustomerGroup: ResolverTypeWrapper<Omit<CustomerGroup, 'customers'> & { customers: ResolversTypes['CustomerList'] }>;
  CustomerGroupFilterParameter: CustomerGroupFilterParameter;
  CustomerGroupList: ResolverTypeWrapper<Omit<CustomerGroupList, 'items'> & { items: Array<ResolversTypes['CustomerGroup']> }>;
  CustomerGroupListOptions: CustomerGroupListOptions;
  CustomerGroupSortParameter: CustomerGroupSortParameter;
  CustomerList: ResolverTypeWrapper<Omit<CustomerList, 'items'> & { items: Array<ResolversTypes['Customer']> }>;
  CustomerListOptions: CustomerListOptions;
  CustomerSortParameter: CustomerSortParameter;
  DashboardMetricSummary: ResolverTypeWrapper<DashboardMetricSummary>;
  DashboardMetricSummaryEntry: ResolverTypeWrapper<DashboardMetricSummaryEntry>;
  DashboardMetricSummaryInput: DashboardMetricSummaryInput;
  DashboardMetricType: DashboardMetricType;
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
  DayTranslationInput: DayTranslationInput;
  DayType: DayType;
  DeleteAssetInput: DeleteAssetInput;
  DeleteAssetsInput: DeleteAssetsInput;
  DeleteStockLocationInput: DeleteStockLocationInput;
  DeletionResponse: ResolverTypeWrapper<DeletionResponse>;
  DeletionResult: DeletionResult;
  DeliveryCredentialGroup: ResolverTypeWrapper<DeliveryCredentialGroup>;
  DeliveryMethod: ResolverTypeWrapper<DeliveryMethod>;
  DeliveryMethodFilterParameter: DeliveryMethodFilterParameter;
  DeliveryMethodList: ResolverTypeWrapper<DeliveryMethodList>;
  DeliveryMethodListOptions: DeliveryMethodListOptions;
  DeliveryMethodSortParameter: DeliveryMethodSortParameter;
  DeliveryMethodTranslation: ResolverTypeWrapper<DeliveryMethodTranslation>;
  DeliveryMethodTranslationInput: DeliveryMethodTranslationInput;
  DeliveryMethodType: DeliveryMethodType;
  Discount: ResolverTypeWrapper<Discount>;
  DuplicateEntityError: ResolverTypeWrapper<DuplicateEntityError>;
  DuplicateEntityInput: DuplicateEntityInput;
  DuplicateEntityResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['DuplicateEntityResult']>;
  DuplicateEntitySuccess: ResolverTypeWrapper<DuplicateEntitySuccess>;
  EmailAddressConflictError: ResolverTypeWrapper<EmailAddressConflictError>;
  EmptyOrderLineSelectionError: ResolverTypeWrapper<EmptyOrderLineSelectionError>;
  EntityCustomFields: ResolverTypeWrapper<Omit<EntityCustomFields, 'customFields'> & { customFields: Array<ResolversTypes['CustomFieldConfig']> }>;
  EntityDuplicatorDefinition: ResolverTypeWrapper<EntityDuplicatorDefinition>;
  ErrorCode: ErrorCode;
  ErrorResult: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['ErrorResult']>;
  Facet: ResolverTypeWrapper<Facet>;
  FacetFilterParameter: FacetFilterParameter;
  FacetInUseError: ResolverTypeWrapper<FacetInUseError>;
  FacetList: ResolverTypeWrapper<FacetList>;
  FacetListOptions: FacetListOptions;
  FacetSortParameter: FacetSortParameter;
  FacetTranslation: ResolverTypeWrapper<FacetTranslation>;
  FacetTranslationInput: FacetTranslationInput;
  FacetValue: ResolverTypeWrapper<FacetValue>;
  FacetValueCustomFields: ResolverTypeWrapper<Omit<FacetValueCustomFields, 'categories'> & { categories?: Maybe<Array<ResolversTypes['Category']>> }>;
  FacetValueFilterInput: FacetValueFilterInput;
  FacetValueFilterParameter: FacetValueFilterParameter;
  FacetValueList: ResolverTypeWrapper<FacetValueList>;
  FacetValueListOptions: FacetValueListOptions;
  FacetValueResult: ResolverTypeWrapper<FacetValueResult>;
  FacetValueSortParameter: FacetValueSortParameter;
  FacetValueTranslation: ResolverTypeWrapper<FacetValueTranslation>;
  FacetValueTranslationInput: FacetValueTranslationInput;
  FilteredProductList: ResolverTypeWrapper<Omit<FilteredProductList, 'items'> & { items: Array<ResolversTypes['Product']> }>;
  FilteredProductSortParameters: FilteredProductSortParameters;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  FloatCustomFieldConfig: ResolverTypeWrapper<FloatCustomFieldConfig>;
  FloatStructFieldConfig: ResolverTypeWrapper<FloatStructFieldConfig>;
  FulfillOrderInput: FulfillOrderInput;
  Fulfillment: ResolverTypeWrapper<Omit<Fulfillment, 'lines' | 'summary'> & { lines: Array<ResolversTypes['FulfillmentLine']>, summary: Array<ResolversTypes['FulfillmentLine']> }>;
  FulfillmentLine: ResolverTypeWrapper<Omit<FulfillmentLine, 'fulfillment' | 'orderLine'> & { fulfillment: ResolversTypes['Fulfillment'], orderLine: ResolversTypes['OrderLine'] }>;
  FulfillmentStateTransitionError: ResolverTypeWrapper<FulfillmentStateTransitionError>;
  GlobalFlag: GlobalFlag;
  GlobalSettings: ResolverTypeWrapper<Omit<GlobalSettings, 'serverConfig'> & { serverConfig: ResolversTypes['ServerConfig'] }>;
  GuestCheckoutError: ResolverTypeWrapper<GuestCheckoutError>;
  HistoryEntry: ResolverTypeWrapper<Omit<HistoryEntry, 'administrator'> & { administrator?: Maybe<ResolversTypes['Administrator']> }>;
  HistoryEntryFilterParameter: HistoryEntryFilterParameter;
  HistoryEntryList: ResolverTypeWrapper<Omit<HistoryEntryList, 'items'> & { items: Array<ResolversTypes['HistoryEntry']> }>;
  HistoryEntryListOptions: HistoryEntryListOptions;
  HistoryEntrySortParameter: HistoryEntrySortParameter;
  HistoryEntryType: HistoryEntryType;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IDListOperators: IdListOperators;
  IDOperators: IdOperators;
  ImageUploadResult: ResolverTypeWrapper<ImageUploadResult>;
  ImportErrorRow: ResolverTypeWrapper<ImportErrorRow>;
  ImportInfo: ResolverTypeWrapper<ImportInfo>;
  ImportJob: ResolverTypeWrapper<ImportJob>;
  ImportJobFilterParameter: ImportJobFilterParameter;
  ImportJobList: ResolverTypeWrapper<ImportJobList>;
  ImportJobListOptions: ImportJobListOptions;
  ImportJobSortParameter: ImportJobSortParameter;
  ImportJobStatus: ImportJobStatus;
  ImportLog: ResolverTypeWrapper<ImportLog>;
  ImportLogStatus: ImportLogStatus;
  ImportMode: ImportMode;
  IneligibleShippingMethodError: ResolverTypeWrapper<IneligibleShippingMethodError>;
  InsufficientStockError: ResolverTypeWrapper<Omit<InsufficientStockError, 'order'> & { order: ResolversTypes['Order'] }>;
  InsufficientStockOnHandError: ResolverTypeWrapper<InsufficientStockOnHandError>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  IntCustomFieldConfig: ResolverTypeWrapper<IntCustomFieldConfig>;
  IntStructFieldConfig: ResolverTypeWrapper<IntStructFieldConfig>;
  InvalidCredentialsError: ResolverTypeWrapper<InvalidCredentialsError>;
  InvalidFulfillmentHandlerError: ResolverTypeWrapper<InvalidFulfillmentHandlerError>;
  ItemsAlreadyFulfilledError: ResolverTypeWrapper<ItemsAlreadyFulfilledError>;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  Job: ResolverTypeWrapper<Job>;
  JobBufferSize: ResolverTypeWrapper<JobBufferSize>;
  JobFilterParameter: JobFilterParameter;
  JobList: ResolverTypeWrapper<JobList>;
  JobListOptions: JobListOptions;
  JobQueue: ResolverTypeWrapper<JobQueue>;
  JobSortParameter: JobSortParameter;
  JobState: JobState;
  Label: ResolverTypeWrapper<Label>;
  LabelFilterParameter: LabelFilterParameter;
  LabelList: ResolverTypeWrapper<LabelList>;
  LabelListOptions: LabelListOptions;
  LabelSortParameter: LabelSortParameter;
  LabelTranslation: ResolverTypeWrapper<LabelTranslation>;
  LabelTranslationInput: LabelTranslationInput;
  LanguageCode: LanguageCode;
  LanguageNotAvailableError: ResolverTypeWrapper<LanguageNotAvailableError>;
  LocaleStringCustomFieldConfig: ResolverTypeWrapper<LocaleStringCustomFieldConfig>;
  LocaleTextCustomFieldConfig: ResolverTypeWrapper<LocaleTextCustomFieldConfig>;
  LocalizedString: ResolverTypeWrapper<LocalizedString>;
  LogicalOperator: LogicalOperator;
  ManualPaymentInput: ManualPaymentInput;
  ManualPaymentStateError: ResolverTypeWrapper<ManualPaymentStateError>;
  MeiliAnalytics: ResolverTypeWrapper<MeiliAnalytics>;
  MeiliHealthStatus: ResolverTypeWrapper<MeiliHealthStatus>;
  MeiliIndexStats: ResolverTypeWrapper<MeiliIndexStats>;
  MeiliMonitoringResult: ResolverTypeWrapper<MeiliMonitoringResult>;
  MeiliRecentTask: ResolverTypeWrapper<MeiliRecentTask>;
  MeiliSettingsInput: MeiliSettingsInput;
  MeiliSettingsResult: ResolverTypeWrapper<MeiliSettingsResult>;
  MeiliSyncProgress: ResolverTypeWrapper<MeiliSyncProgress>;
  MeiliTaskStats: ResolverTypeWrapper<MeiliTaskStats>;
  MimeTypeError: ResolverTypeWrapper<MimeTypeError>;
  MissingConditionsError: ResolverTypeWrapper<MissingConditionsError>;
  Model: ResolverTypeWrapper<Model>;
  ModelList: ResolverTypeWrapper<ModelList>;
  ModifyOrderInput: ModifyOrderInput;
  ModifyOrderOptions: ModifyOrderOptions;
  ModifyOrderResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['ModifyOrderResult']>;
  Money: ResolverTypeWrapper<Scalars['Money']['output']>;
  MoveCollectionInput: MoveCollectionInput;
  MultipleOrderError: ResolverTypeWrapper<MultipleOrderError>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  NativeAuthInput: NativeAuthInput;
  NativeAuthStrategyError: ResolverTypeWrapper<NativeAuthStrategyError>;
  NativeAuthenticationResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['NativeAuthenticationResult']>;
  NegativeQuantityError: ResolverTypeWrapper<NegativeQuantityError>;
  NoActiveOrderError: ResolverTypeWrapper<NoActiveOrderError>;
  NoChangesSpecifiedError: ResolverTypeWrapper<NoChangesSpecifiedError>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  NothingToRefundError: ResolverTypeWrapper<NothingToRefundError>;
  NumberListOperators: NumberListOperators;
  NumberOperators: NumberOperators;
  NumberRange: NumberRange;
  Order: ResolverTypeWrapper<Omit<Order, 'aggregateOrder' | 'billingAddress' | 'channels' | 'customer' | 'fulfillments' | 'history' | 'lines' | 'modifications' | 'payments' | 'sellerOrders' | 'shippingAddress'> & { aggregateOrder?: Maybe<ResolversTypes['Order']>, billingAddress?: Maybe<ResolversTypes['OrderAddress']>, channels: Array<ResolversTypes['Channel']>, customer?: Maybe<ResolversTypes['Customer']>, fulfillments?: Maybe<Array<ResolversTypes['Fulfillment']>>, history: ResolversTypes['HistoryEntryList'], lines: Array<ResolversTypes['OrderLine']>, modifications: Array<ResolversTypes['OrderModification']>, payments?: Maybe<Array<ResolversTypes['Payment']>>, sellerOrders?: Maybe<Array<ResolversTypes['Order']>>, shippingAddress?: Maybe<ResolversTypes['OrderAddress']> }>;
  OrderAddress: ResolverTypeWrapper<OrderAddress>;
  OrderCustomFields: ResolverTypeWrapper<OrderCustomFields>;
  OrderFilterParameter: OrderFilterParameter;
  OrderInterceptorError: ResolverTypeWrapper<OrderInterceptorError>;
  OrderLimitError: ResolverTypeWrapper<OrderLimitError>;
  OrderLine: ResolverTypeWrapper<Omit<OrderLine, 'fulfillmentLines' | 'order' | 'productVariant'> & { fulfillmentLines?: Maybe<Array<ResolversTypes['FulfillmentLine']>>, order: ResolversTypes['Order'], productVariant: ResolversTypes['ProductVariant'] }>;
  OrderLineInput: OrderLineInput;
  OrderList: ResolverTypeWrapper<Omit<OrderList, 'items'> & { items: Array<ResolversTypes['Order']> }>;
  OrderListOptions: OrderListOptions;
  OrderModification: ResolverTypeWrapper<Omit<OrderModification, 'lines' | 'payment' | 'refund'> & { lines: Array<ResolversTypes['OrderModificationLine']>, payment?: Maybe<ResolversTypes['Payment']>, refund?: Maybe<ResolversTypes['Refund']> }>;
  OrderModificationError: ResolverTypeWrapper<OrderModificationError>;
  OrderModificationLine: ResolverTypeWrapper<Omit<OrderModificationLine, 'modification' | 'orderLine'> & { modification: ResolversTypes['OrderModification'], orderLine: ResolversTypes['OrderLine'] }>;
  OrderModificationStateError: ResolverTypeWrapper<OrderModificationStateError>;
  OrderProcessState: ResolverTypeWrapper<OrderProcessState>;
  OrderSortParameter: OrderSortParameter;
  OrderStateTransitionError: ResolverTypeWrapper<OrderStateTransitionError>;
  OrderTaxSummary: ResolverTypeWrapper<OrderTaxSummary>;
  OrderType: OrderType;
  PaginatedList: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['PaginatedList']>;
  Payment: ResolverTypeWrapper<Omit<Payment, 'refunds'> & { refunds: Array<ResolversTypes['Refund']> }>;
  PaymentMethod: ResolverTypeWrapper<PaymentMethod>;
  PaymentMethodFilterParameter: PaymentMethodFilterParameter;
  PaymentMethodList: ResolverTypeWrapper<PaymentMethodList>;
  PaymentMethodListOptions: PaymentMethodListOptions;
  PaymentMethodMissingError: ResolverTypeWrapper<PaymentMethodMissingError>;
  PaymentMethodQuote: ResolverTypeWrapper<PaymentMethodQuote>;
  PaymentMethodSortParameter: PaymentMethodSortParameter;
  PaymentMethodTranslation: ResolverTypeWrapper<PaymentMethodTranslation>;
  PaymentMethodTranslationInput: PaymentMethodTranslationInput;
  PaymentOrderMismatchError: ResolverTypeWrapper<PaymentOrderMismatchError>;
  PaymentStateTransitionError: ResolverTypeWrapper<PaymentStateTransitionError>;
  Permission: Permission;
  PermissionDefinition: ResolverTypeWrapper<PermissionDefinition>;
  PreviewCollectionVariantsInput: PreviewCollectionVariantsInput;
  PriceRange: ResolverTypeWrapper<PriceRange>;
  Product: ResolverTypeWrapper<Omit<Product, 'activeOptionGroups' | 'categories' | 'category' | 'channels' | 'collections' | 'optionGroups' | 'seasons' | 'variantList' | 'variants'> & { activeOptionGroups: Array<ResolversTypes['ProductOptionGroup']>, categories: Array<ResolversTypes['Category']>, category?: Maybe<ResolversTypes['Category']>, channels: Array<ResolversTypes['Channel']>, collections: Array<ResolversTypes['Collection']>, optionGroups: Array<ResolversTypes['ProductOptionGroup']>, seasons: Array<ResolversTypes['Season']>, variantList: ResolversTypes['ProductVariantList'], variants: Array<ResolversTypes['ProductVariant']> }>;
  ProductCustomFields: ResolverTypeWrapper<Omit<ProductCustomFields, 'categories'> & { categories?: Maybe<Array<ResolversTypes['Category']>> }>;
  ProductFilterParameter: ProductFilterParameter;
  ProductList: ResolverTypeWrapper<Omit<ProductList, 'items'> & { items: Array<ResolversTypes['Product']> }>;
  ProductListOptions: ProductListOptions;
  ProductOption: ResolverTypeWrapper<Omit<ProductOption, 'group'> & { group: ResolversTypes['ProductOptionGroup'] }>;
  ProductOptionFilterParameter: ProductOptionFilterParameter;
  ProductOptionGroup: ResolverTypeWrapper<Omit<ProductOptionGroup, 'channels' | 'options'> & { channels: Array<ResolversTypes['Channel']>, options: Array<ResolversTypes['ProductOption']> }>;
  ProductOptionGroupFilterParameter: ProductOptionGroupFilterParameter;
  ProductOptionGroupInUseError: ResolverTypeWrapper<ProductOptionGroupInUseError>;
  ProductOptionGroupList: ResolverTypeWrapper<Omit<ProductOptionGroupList, 'items'> & { items: Array<ResolversTypes['ProductOptionGroup']> }>;
  ProductOptionGroupListOptions: ProductOptionGroupListOptions;
  ProductOptionGroupSortParameter: ProductOptionGroupSortParameter;
  ProductOptionGroupTranslation: ResolverTypeWrapper<ProductOptionGroupTranslation>;
  ProductOptionGroupTranslationInput: ProductOptionGroupTranslationInput;
  ProductOptionInUseError: ResolverTypeWrapper<ProductOptionInUseError>;
  ProductOptionList: ResolverTypeWrapper<Omit<ProductOptionList, 'items'> & { items: Array<ResolversTypes['ProductOption']> }>;
  ProductOptionListOptions: ProductOptionListOptions;
  ProductOptionSortParameter: ProductOptionSortParameter;
  ProductOptionTranslation: ResolverTypeWrapper<ProductOptionTranslation>;
  ProductOptionTranslationInput: ProductOptionTranslationInput;
  ProductSortParameter: ProductSortParameter;
  ProductTranslation: ResolverTypeWrapper<ProductTranslation>;
  ProductTranslationInput: ProductTranslationInput;
  ProductVariant: ResolverTypeWrapper<Omit<ProductVariant, 'channels' | 'options' | 'product' | 'stockMovements' | 'taxRateApplied'> & { channels: Array<ResolversTypes['Channel']>, options: Array<ResolversTypes['ProductOption']>, product: ResolversTypes['Product'], stockMovements: ResolversTypes['StockMovementList'], taxRateApplied: ResolversTypes['TaxRate'] }>;
  ProductVariantFilterParameter: ProductVariantFilterParameter;
  ProductVariantList: ResolverTypeWrapper<Omit<ProductVariantList, 'items'> & { items: Array<ResolversTypes['ProductVariant']> }>;
  ProductVariantListOptions: ProductVariantListOptions;
  ProductVariantPrice: ResolverTypeWrapper<ProductVariantPrice>;
  ProductVariantSortParameter: ProductVariantSortParameter;
  ProductVariantTranslation: ResolverTypeWrapper<ProductVariantTranslation>;
  ProductVariantTranslationInput: ProductVariantTranslationInput;
  Promotion: ResolverTypeWrapper<Promotion>;
  PromotionCustomFields: ResolverTypeWrapper<PromotionCustomFields>;
  PromotionFilterParameter: PromotionFilterParameter;
  PromotionList: ResolverTypeWrapper<PromotionList>;
  PromotionListOptions: PromotionListOptions;
  PromotionSortParameter: PromotionSortParameter;
  PromotionTranslation: ResolverTypeWrapper<PromotionTranslation>;
  PromotionTranslationInput: PromotionTranslationInput;
  Province: ResolverTypeWrapper<Omit<Province, 'parent'> & { parent?: Maybe<ResolversTypes['Region']> }>;
  ProvinceFilterParameter: ProvinceFilterParameter;
  ProvinceList: ResolverTypeWrapper<Omit<ProvinceList, 'items'> & { items: Array<ResolversTypes['Province']> }>;
  ProvinceListOptions: ProvinceListOptions;
  ProvinceSortParameter: ProvinceSortParameter;
  ProvinceTranslationInput: ProvinceTranslationInput;
  QuantityTooGreatError: ResolverTypeWrapper<QuantityTooGreatError>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  RedirectTypes: RedirectTypes;
  RefreshTokenResponse: ResolverTypeWrapper<RefreshTokenResponse>;
  Refund: ResolverTypeWrapper<Omit<Refund, 'lines'> & { lines: Array<ResolversTypes['RefundLine']> }>;
  RefundAmountError: ResolverTypeWrapper<RefundAmountError>;
  RefundLine: ResolverTypeWrapper<Omit<RefundLine, 'orderLine' | 'refund'> & { orderLine: ResolversTypes['OrderLine'], refund: ResolversTypes['Refund'] }>;
  RefundOrderInput: RefundOrderInput;
  RefundOrderResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RefundOrderResult']>;
  RefundOrderStateError: ResolverTypeWrapper<RefundOrderStateError>;
  RefundPaymentIdMissingError: ResolverTypeWrapper<RefundPaymentIdMissingError>;
  RefundStateTransitionError: ResolverTypeWrapper<RefundStateTransitionError>;
  Region: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Region']>;
  RegionTranslation: ResolverTypeWrapper<RegionTranslation>;
  RelationCustomFieldConfig: ResolverTypeWrapper<RelationCustomFieldConfig>;
  Release: ResolverTypeWrapper<Omit<Release, 'productVariant'> & { productVariant: ResolversTypes['ProductVariant'] }>;
  RemoveBannerAssetInput: RemoveBannerAssetInput;
  RemoveCollectionsFromChannelInput: RemoveCollectionsFromChannelInput;
  RemoveFacetFromChannelResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RemoveFacetFromChannelResult']>;
  RemoveFacetsFromChannelInput: RemoveFacetsFromChannelInput;
  RemoveOptionGroupFromProductResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RemoveOptionGroupFromProductResult']>;
  RemoveOrderItemsResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RemoveOrderItemsResult']>;
  RemovePaymentMethodsFromChannelInput: RemovePaymentMethodsFromChannelInput;
  RemoveProductOptionGroupFromChannelResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['RemoveProductOptionGroupFromChannelResult']>;
  RemoveProductOptionGroupsFromChannelInput: RemoveProductOptionGroupsFromChannelInput;
  RemoveProductVariantsFromChannelInput: RemoveProductVariantsFromChannelInput;
  RemoveProductsFromChannelInput: RemoveProductsFromChannelInput;
  RemovePromotionsFromChannelInput: RemovePromotionsFromChannelInput;
  RemoveShippingMethodsFromChannelInput: RemoveShippingMethodsFromChannelInput;
  RemoveStockLocationsFromChannelInput: RemoveStockLocationsFromChannelInput;
  Return: ResolverTypeWrapper<Omit<Return, 'productVariant'> & { productVariant: ResolversTypes['ProductVariant'] }>;
  Role: ResolverTypeWrapper<Omit<Role, 'channels'> & { channels: Array<ResolversTypes['Channel']> }>;
  RoleFilterParameter: RoleFilterParameter;
  RoleList: ResolverTypeWrapper<Omit<RoleList, 'items'> & { items: Array<ResolversTypes['Role']> }>;
  RoleListOptions: RoleListOptions;
  RoleSortParameter: RoleSortParameter;
  RotateApiKeyResult: ResolverTypeWrapper<RotateApiKeyResult>;
  Sale: ResolverTypeWrapper<Omit<Sale, 'productVariant'> & { productVariant: ResolversTypes['ProductVariant'] }>;
  SaleInfo: ResolverTypeWrapper<SaleInfo>;
  ScheduledTask: ResolverTypeWrapper<ScheduledTask>;
  SearchInput: SearchInput;
  SearchReindexResponse: ResolverTypeWrapper<SearchReindexResponse>;
  SearchResponse: ResolverTypeWrapper<Omit<SearchResponse, 'collections' | 'items'> & { collections: Array<ResolversTypes['CollectionResult']>, items: Array<ResolversTypes['SearchResult']> }>;
  SearchResult: ResolverTypeWrapper<Omit<SearchResult, 'price' | 'priceWithTax'> & { price: ResolversTypes['SearchResultPrice'], priceWithTax: ResolversTypes['SearchResultPrice'] }>;
  SearchResultAsset: ResolverTypeWrapper<SearchResultAsset>;
  SearchResultPrice: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SearchResultPrice']>;
  SearchResultSortParameter: SearchResultSortParameter;
  SearchTermStat: ResolverTypeWrapper<SearchTermStat>;
  Season: ResolverTypeWrapper<Omit<Season, 'products'> & { products: ResolversTypes['ProductList'] }>;
  SeasonFilterParameter: SeasonFilterParameter;
  SeasonList: ResolverTypeWrapper<Omit<SeasonList, 'items'> & { items: Array<ResolversTypes['Season']> }>;
  SeasonListOptions: SeasonListOptions;
  SeasonSortParameter: SeasonSortParameter;
  SeasonTranslation: ResolverTypeWrapper<SeasonTranslation>;
  SeasonTranslationInput: SeasonTranslationInput;
  Seller: ResolverTypeWrapper<Seller>;
  SellerFilterParameter: SellerFilterParameter;
  SellerList: ResolverTypeWrapper<SellerList>;
  SellerListOptions: SellerListOptions;
  SellerSortParameter: SellerSortParameter;
  ServerConfig: ResolverTypeWrapper<Omit<ServerConfig, 'customFieldConfig' | 'entityCustomFields'> & { customFieldConfig: ResolversTypes['CustomFields'], entityCustomFields: Array<ResolversTypes['EntityCustomFields']> }>;
  SetCustomerForDraftOrderResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SetCustomerForDraftOrderResult']>;
  SetOrderCustomerInput: SetOrderCustomerInput;
  SetOrderShippingMethodResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SetOrderShippingMethodResult']>;
  SetSettingsStoreValueResult: ResolverTypeWrapper<SetSettingsStoreValueResult>;
  SettingsStoreFieldDefinition: ResolverTypeWrapper<SettingsStoreFieldDefinition>;
  SettingsStoreInput: SettingsStoreInput;
  SettingsStoreScopeType: SettingsStoreScopeType;
  SettlePaymentError: ResolverTypeWrapper<SettlePaymentError>;
  SettlePaymentResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SettlePaymentResult']>;
  SettleRefundInput: SettleRefundInput;
  SettleRefundResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['SettleRefundResult']>;
  ShippingLine: ResolverTypeWrapper<ShippingLine>;
  ShippingMethod: ResolverTypeWrapper<ShippingMethod>;
  ShippingMethodFilterParameter: ShippingMethodFilterParameter;
  ShippingMethodList: ResolverTypeWrapper<ShippingMethodList>;
  ShippingMethodListOptions: ShippingMethodListOptions;
  ShippingMethodQuote: ResolverTypeWrapper<ShippingMethodQuote>;
  ShippingMethodSortParameter: ShippingMethodSortParameter;
  ShippingMethodTranslation: ResolverTypeWrapper<ShippingMethodTranslation>;
  ShippingMethodTranslationInput: ShippingMethodTranslationInput;
  ShopFilteredProductFilterParameters: ShopFilteredProductFilterParameters;
  ShopFilteredProductListOptions: ShopFilteredProductListOptions;
  SinglePrice: ResolverTypeWrapper<SinglePrice>;
  SlugForEntityInput: SlugForEntityInput;
  SortOrder: SortOrder;
  StockAdjustment: ResolverTypeWrapper<Omit<StockAdjustment, 'productVariant'> & { productVariant: ResolversTypes['ProductVariant'] }>;
  StockLevel: ResolverTypeWrapper<StockLevel>;
  StockLevelInput: StockLevelInput;
  StockLocation: ResolverTypeWrapper<StockLocation>;
  StockLocationFilterParameter: StockLocationFilterParameter;
  StockLocationList: ResolverTypeWrapper<StockLocationList>;
  StockLocationListOptions: StockLocationListOptions;
  StockLocationSortParameter: StockLocationSortParameter;
  StockMovement: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['StockMovement']>;
  StockMovementItem: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['StockMovementItem']>;
  StockMovementList: ResolverTypeWrapper<Omit<StockMovementList, 'items'> & { items: Array<ResolversTypes['StockMovementItem']> }>;
  StockMovementListOptions: StockMovementListOptions;
  StockMovementType: StockMovementType;
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
  SurchargeInput: SurchargeInput;
  Tag: ResolverTypeWrapper<Tag>;
  TagFilterParameter: TagFilterParameter;
  TagList: ResolverTypeWrapper<TagList>;
  TagListOptions: TagListOptions;
  TagSortParameter: TagSortParameter;
  TaxCategory: ResolverTypeWrapper<TaxCategory>;
  TaxCategoryFilterParameter: TaxCategoryFilterParameter;
  TaxCategoryList: ResolverTypeWrapper<TaxCategoryList>;
  TaxCategoryListOptions: TaxCategoryListOptions;
  TaxCategorySortParameter: TaxCategorySortParameter;
  TaxLine: ResolverTypeWrapper<TaxLine>;
  TaxRate: ResolverTypeWrapper<Omit<TaxRate, 'customerGroup' | 'zone'> & { customerGroup?: Maybe<ResolversTypes['CustomerGroup']>, zone: ResolversTypes['Zone'] }>;
  TaxRateFilterParameter: TaxRateFilterParameter;
  TaxRateList: ResolverTypeWrapper<Omit<TaxRateList, 'items'> & { items: Array<ResolversTypes['TaxRate']> }>;
  TaxRateListOptions: TaxRateListOptions;
  TaxRateSortParameter: TaxRateSortParameter;
  TestEligibleShippingMethodsInput: TestEligibleShippingMethodsInput;
  TestShippingMethodInput: TestShippingMethodInput;
  TestShippingMethodOrderLineInput: TestShippingMethodOrderLineInput;
  TestShippingMethodQuote: ResolverTypeWrapper<TestShippingMethodQuote>;
  TestShippingMethodResult: ResolverTypeWrapper<TestShippingMethodResult>;
  TextCustomFieldConfig: ResolverTypeWrapper<TextCustomFieldConfig>;
  TextStructFieldConfig: ResolverTypeWrapper<TextStructFieldConfig>;
  TransitionFulfillmentToStateResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TransitionFulfillmentToStateResult']>;
  TransitionOrderToStateResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TransitionOrderToStateResult']>;
  TransitionPaymentToStateResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['TransitionPaymentToStateResult']>;
  UpdateActiveAdministratorInput: UpdateActiveAdministratorInput;
  UpdateAddressCustomFieldsInput: UpdateAddressCustomFieldsInput;
  UpdateAddressInput: UpdateAddressInput;
  UpdateAdministratorInput: UpdateAdministratorInput;
  UpdateApiKeyInput: UpdateApiKeyInput;
  UpdateApiKeyTranslationInput: UpdateApiKeyTranslationInput;
  UpdateAssetInput: UpdateAssetInput;
  UpdateBannerInput: UpdateBannerInput;
  UpdateBannerTypeInput: UpdateBannerTypeInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateCategoryTypeInput: UpdateCategoryTypeInput;
  UpdateChannelCustomFieldsInput: UpdateChannelCustomFieldsInput;
  UpdateChannelInput: UpdateChannelInput;
  UpdateChannelResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateChannelResult']>;
  UpdateCollectionInput: UpdateCollectionInput;
  UpdateCollectionTranslationInput: UpdateCollectionTranslationInput;
  UpdateCountryInput: UpdateCountryInput;
  UpdateCustomerCustomFieldsInput: UpdateCustomerCustomFieldsInput;
  UpdateCustomerGroupInput: UpdateCustomerGroupInput;
  UpdateCustomerInput: UpdateCustomerInput;
  UpdateCustomerNoteInput: UpdateCustomerNoteInput;
  UpdateCustomerResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateCustomerResult']>;
  UpdateDayInput: UpdateDayInput;
  UpdateDeliveryMethodInput: UpdateDeliveryMethodInput;
  UpdateFacetInput: UpdateFacetInput;
  UpdateFacetValueCustomFieldsInput: UpdateFacetValueCustomFieldsInput;
  UpdateFacetValueInput: UpdateFacetValueInput;
  UpdateGlobalSettingsInput: UpdateGlobalSettingsInput;
  UpdateGlobalSettingsResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateGlobalSettingsResult']>;
  UpdateLabelInput: UpdateLabelInput;
  UpdateOrderAddressInput: UpdateOrderAddressInput;
  UpdateOrderCustomFieldsInput: UpdateOrderCustomFieldsInput;
  UpdateOrderInput: UpdateOrderInput;
  UpdateOrderItemErrorResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateOrderItemErrorResult']>;
  UpdateOrderItemsResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdateOrderItemsResult']>;
  UpdateOrderNoteInput: UpdateOrderNoteInput;
  UpdatePaymentMethodInput: UpdatePaymentMethodInput;
  UpdateProductCustomFieldsInput: UpdateProductCustomFieldsInput;
  UpdateProductInput: UpdateProductInput;
  UpdateProductOptionGroupInput: UpdateProductOptionGroupInput;
  UpdateProductOptionInput: UpdateProductOptionInput;
  UpdateProductVariantInput: UpdateProductVariantInput;
  UpdateProductVariantPriceInput: UpdateProductVariantPriceInput;
  UpdatePromotionCustomFieldsInput: UpdatePromotionCustomFieldsInput;
  UpdatePromotionInput: UpdatePromotionInput;
  UpdatePromotionResult: ResolverTypeWrapper<ResolversUnionTypes<ResolversTypes>['UpdatePromotionResult']>;
  UpdateProvinceInput: UpdateProvinceInput;
  UpdateRoleInput: UpdateRoleInput;
  UpdateScheduledTaskInput: UpdateScheduledTaskInput;
  UpdateSeasonInput: UpdateSeasonInput;
  UpdateSellerInput: UpdateSellerInput;
  UpdateShippingMethodInput: UpdateShippingMethodInput;
  UpdateStockLocationInput: UpdateStockLocationInput;
  UpdateTagInput: UpdateTagInput;
  UpdateTaxCategoryInput: UpdateTaxCategoryInput;
  UpdateTaxRateInput: UpdateTaxRateInput;
  UpdateWorkerInput: UpdateWorkerInput;
  UpdateZoneInput: UpdateZoneInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  UpsertBannerAssetInput: UpsertBannerAssetInput;
  User: ResolverTypeWrapper<Omit<User, 'authenticationMethods' | 'roles'> & { authenticationMethods: Array<ResolversTypes['AuthenticationMethod']>, roles: Array<ResolversTypes['Role']> }>;
  VariantSoldCount: ResolverTypeWrapper<VariantSoldCount>;
  Worker: ResolverTypeWrapper<Worker>;
  WorkerFilterParameter: WorkerFilterParameter;
  WorkerList: ResolverTypeWrapper<WorkerList>;
  WorkerListOptions: WorkerListOptions;
  WorkerRole: WorkerRole;
  WorkerSortParameter: WorkerSortParameter;
  Zone: ResolverTypeWrapper<Omit<Zone, 'members'> & { members: Array<ResolversTypes['Region']> }>;
  ZoneFilterParameter: ZoneFilterParameter;
  ZoneList: ResolverTypeWrapper<Omit<ZoneList, 'items'> & { items: Array<ResolversTypes['Zone']> }>;
  ZoneListOptions: ZoneListOptions;
  ZoneSortParameter: ZoneSortParameter;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddFulfillmentToOrderResult: ResolversUnionTypes<ResolversParentTypes>['AddFulfillmentToOrderResult'];
  AddItemInput: AddItemInput;
  AddItemToDraftOrderInput: AddItemToDraftOrderInput;
  AddManualPaymentToOrderResult: ResolversUnionTypes<ResolversParentTypes>['AddManualPaymentToOrderResult'];
  AddNoteToCustomerInput: AddNoteToCustomerInput;
  AddNoteToOrderInput: AddNoteToOrderInput;
  Address: Omit<Address, 'country'> & { country: ResolversParentTypes['Country'] };
  AddressCustomFields: AddressCustomFields;
  AdjustDraftOrderLineInput: AdjustDraftOrderLineInput;
  Adjustment: Adjustment;
  AdminFilteredProductFilterParameters: AdminFilteredProductFilterParameters;
  AdminFilteredProductListOptions: AdminFilteredProductListOptions;
  Administrator: Omit<Administrator, 'user'> & { user: ResolversParentTypes['User'] };
  AdministratorFilterParameter: AdministratorFilterParameter;
  AdministratorList: Omit<AdministratorList, 'items'> & { items: Array<ResolversParentTypes['Administrator']> };
  AdministratorListOptions: AdministratorListOptions;
  AdministratorPaymentInput: AdministratorPaymentInput;
  AdministratorRefundInput: AdministratorRefundInput;
  AdministratorSortParameter: AdministratorSortParameter;
  AggregatedMetadata: Omit<AggregatedMetadata, 'categories'> & { categories: Array<ResolversParentTypes['Category']> };
  Allocation: Omit<Allocation, 'orderLine' | 'productVariant'> & { orderLine: ResolversParentTypes['OrderLine'], productVariant: ResolversParentTypes['ProductVariant'] };
  AlreadyRefundedError: AlreadyRefundedError;
  ApiKey: Omit<ApiKey, 'owner' | 'user'> & { owner: ResolversParentTypes['User'], user: ResolversParentTypes['User'] };
  ApiKeyFilterParameter: ApiKeyFilterParameter;
  ApiKeyList: Omit<ApiKeyList, 'items'> & { items: Array<ResolversParentTypes['ApiKey']> };
  ApiKeyListOptions: ApiKeyListOptions;
  ApiKeySortParameter: ApiKeySortParameter;
  ApiKeyTranslation: ApiKeyTranslation;
  ApplyCouponCodeResult: ResolversUnionTypes<ResolversParentTypes>['ApplyCouponCodeResult'];
  Asset: Asset;
  AssetFilterParameter: AssetFilterParameter;
  AssetList: AssetList;
  AssetListOptions: AssetListOptions;
  AssetSortParameter: AssetSortParameter;
  AssetTranslation: AssetTranslation;
  AssetTranslationInput: AssetTranslationInput;
  AssignAssetsToChannelInput: AssignAssetsToChannelInput;
  AssignCollectionsToChannelInput: AssignCollectionsToChannelInput;
  AssignFacetsToChannelInput: AssignFacetsToChannelInput;
  AssignPaymentMethodsToChannelInput: AssignPaymentMethodsToChannelInput;
  AssignProductOptionGroupsToChannelInput: AssignProductOptionGroupsToChannelInput;
  AssignProductVariantsToChannelInput: AssignProductVariantsToChannelInput;
  AssignProductsToChannelInput: AssignProductsToChannelInput;
  AssignPromotionsToChannelInput: AssignPromotionsToChannelInput;
  AssignShippingMethodsToChannelInput: AssignShippingMethodsToChannelInput;
  AssignStockLocationsToChannelInput: AssignStockLocationsToChannelInput;
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
  BannerTranslationInput: BannerTranslationInput;
  BannerType: Omit<BannerType, 'banners'> & { banners: Array<ResolversParentTypes['Banner']> };
  BannerTypeFilterParameter: BannerTypeFilterParameter;
  BannerTypeList: Omit<BannerTypeList, 'items'> & { items: Array<ResolversParentTypes['BannerType']> };
  BannerTypeListOptions: BannerTypeListOptions;
  BannerTypeSortParameter: BannerTypeSortParameter;
  BannerTypeTranslation: BannerTypeTranslation;
  BannerTypeTranslationInput: BannerTypeTranslationInput;
  BaseResponse: BaseResponse;
  Boolean: Scalars['Boolean']['output'];
  BooleanCustomFieldConfig: BooleanCustomFieldConfig;
  BooleanListOperators: BooleanListOperators;
  BooleanOperators: BooleanOperators;
  BooleanStructFieldConfig: BooleanStructFieldConfig;
  CancelActiveOrderError: CancelActiveOrderError;
  CancelOrderInput: CancelOrderInput;
  CancelOrderResult: ResolversUnionTypes<ResolversParentTypes>['CancelOrderResult'];
  CancelPaymentError: CancelPaymentError;
  CancelPaymentResult: ResolversUnionTypes<ResolversParentTypes>['CancelPaymentResult'];
  Cancellation: Omit<Cancellation, 'orderLine' | 'productVariant'> & { orderLine: ResolversParentTypes['OrderLine'], productVariant: ResolversParentTypes['ProductVariant'] };
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
  ChannelDefaultLanguageError: ChannelDefaultLanguageError;
  ChannelFilterParameter: ChannelFilterParameter;
  ChannelList: Omit<ChannelList, 'items'> & { items: Array<ResolversParentTypes['Channel']> };
  ChannelListOptions: ChannelListOptions;
  ChannelSortParameter: ChannelSortParameter;
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
  CoordinateInput: CoordinateInput;
  Country: Omit<Country, 'parent'> & { parent?: Maybe<ResolversParentTypes['Region']> };
  CountryFilterParameter: CountryFilterParameter;
  CountryList: Omit<CountryList, 'items'> & { items: Array<ResolversParentTypes['Country']> };
  CountryListOptions: CountryListOptions;
  CountrySortParameter: CountrySortParameter;
  CountryTranslationInput: CountryTranslationInput;
  CouponCodeExpiredError: CouponCodeExpiredError;
  CouponCodeInvalidError: CouponCodeInvalidError;
  CouponCodeLimitError: CouponCodeLimitError;
  CreateAddressCustomFieldsInput: CreateAddressCustomFieldsInput;
  CreateAddressInput: CreateAddressInput;
  CreateAdministratorInput: CreateAdministratorInput;
  CreateApiKeyInput: CreateApiKeyInput;
  CreateApiKeyResult: CreateApiKeyResult;
  CreateApiKeyTranslationInput: CreateApiKeyTranslationInput;
  CreateAssetInput: CreateAssetInput;
  CreateAssetResult: ResolversUnionTypes<ResolversParentTypes>['CreateAssetResult'];
  CreateBannerInput: CreateBannerInput;
  CreateBannerTypeInput: CreateBannerTypeInput;
  CreateCategoryInput: CreateCategoryInput;
  CreateCategoryTypeInput: CreateCategoryTypeInput;
  CreateChannelCustomFieldsInput: CreateChannelCustomFieldsInput;
  CreateChannelInput: CreateChannelInput;
  CreateChannelResult: ResolversUnionTypes<ResolversParentTypes>['CreateChannelResult'];
  CreateCollectionInput: CreateCollectionInput;
  CreateCollectionTranslationInput: CreateCollectionTranslationInput;
  CreateCountryInput: CreateCountryInput;
  CreateCustomerCustomFieldsInput: CreateCustomerCustomFieldsInput;
  CreateCustomerGroupInput: CreateCustomerGroupInput;
  CreateCustomerInput: CreateCustomerInput;
  CreateCustomerResult: ResolversUnionTypes<ResolversParentTypes>['CreateCustomerResult'];
  CreateDayInput: CreateDayInput;
  CreateDeliveryMethodInput: CreateDeliveryMethodInput;
  CreateFacetInput: CreateFacetInput;
  CreateFacetValueCustomFieldsInput: CreateFacetValueCustomFieldsInput;
  CreateFacetValueInput: CreateFacetValueInput;
  CreateFacetValueWithFacetInput: CreateFacetValueWithFacetInput;
  CreateFulfillmentError: CreateFulfillmentError;
  CreateGroupOptionInput: CreateGroupOptionInput;
  CreateLabelInput: CreateLabelInput;
  CreatePaymentMethodInput: CreatePaymentMethodInput;
  CreateProductCustomFieldsInput: CreateProductCustomFieldsInput;
  CreateProductInput: CreateProductInput;
  CreateProductOptionGroupInput: CreateProductOptionGroupInput;
  CreateProductOptionInput: CreateProductOptionInput;
  CreateProductVariantInput: CreateProductVariantInput;
  CreateProductVariantOptionInput: CreateProductVariantOptionInput;
  CreateProductVariantPriceInput: CreateProductVariantPriceInput;
  CreatePromotionCustomFieldsInput: CreatePromotionCustomFieldsInput;
  CreatePromotionInput: CreatePromotionInput;
  CreatePromotionResult: ResolversUnionTypes<ResolversParentTypes>['CreatePromotionResult'];
  CreateProvinceInput: CreateProvinceInput;
  CreateRoleInput: CreateRoleInput;
  CreateSeasonInput: CreateSeasonInput;
  CreateSellerInput: CreateSellerInput;
  CreateShippingMethodInput: CreateShippingMethodInput;
  CreateStockLocationInput: CreateStockLocationInput;
  CreateTagInput: CreateTagInput;
  CreateTaxCategoryInput: CreateTaxCategoryInput;
  CreateTaxRateInput: CreateTaxRateInput;
  CreateWorkerInput: CreateWorkerInput;
  CreateZoneInput: CreateZoneInput;
  CurrentUser: CurrentUser;
  CurrentUserChannel: CurrentUserChannel;
  CustomField: ResolversInterfaceTypes<ResolversParentTypes>['CustomField'];
  CustomFieldConfig: ResolversUnionTypes<ResolversParentTypes>['CustomFieldConfig'];
  CustomFields: Omit<CustomFields, 'Address' | 'Administrator' | 'ApiKey' | 'Asset' | 'Banner' | 'BannerType' | 'Category' | 'CategoryType' | 'Channel' | 'Collection' | 'Customer' | 'CustomerGroup' | 'Day' | 'DeliveryMethod' | 'Facet' | 'FacetValue' | 'Fulfillment' | 'GlobalSettings' | 'HistoryEntry' | 'Label' | 'Order' | 'OrderLine' | 'Payment' | 'PaymentMethod' | 'Product' | 'ProductOption' | 'ProductOptionGroup' | 'ProductVariant' | 'ProductVariantPrice' | 'Promotion' | 'Refund' | 'Region' | 'Seller' | 'Session' | 'ShippingLine' | 'ShippingMethod' | 'StockLevel' | 'StockLocation' | 'StockMovement' | 'TaxCategory' | 'TaxRate' | 'User' | 'Zone'> & { Address: Array<ResolversParentTypes['CustomFieldConfig']>, Administrator: Array<ResolversParentTypes['CustomFieldConfig']>, ApiKey: Array<ResolversParentTypes['CustomFieldConfig']>, Asset: Array<ResolversParentTypes['CustomFieldConfig']>, Banner: Array<ResolversParentTypes['CustomFieldConfig']>, BannerType: Array<ResolversParentTypes['CustomFieldConfig']>, Category: Array<ResolversParentTypes['CustomFieldConfig']>, CategoryType: Array<ResolversParentTypes['CustomFieldConfig']>, Channel: Array<ResolversParentTypes['CustomFieldConfig']>, Collection: Array<ResolversParentTypes['CustomFieldConfig']>, Customer: Array<ResolversParentTypes['CustomFieldConfig']>, CustomerGroup: Array<ResolversParentTypes['CustomFieldConfig']>, Day: Array<ResolversParentTypes['CustomFieldConfig']>, DeliveryMethod: Array<ResolversParentTypes['CustomFieldConfig']>, Facet: Array<ResolversParentTypes['CustomFieldConfig']>, FacetValue: Array<ResolversParentTypes['CustomFieldConfig']>, Fulfillment: Array<ResolversParentTypes['CustomFieldConfig']>, GlobalSettings: Array<ResolversParentTypes['CustomFieldConfig']>, HistoryEntry: Array<ResolversParentTypes['CustomFieldConfig']>, Label: Array<ResolversParentTypes['CustomFieldConfig']>, Order: Array<ResolversParentTypes['CustomFieldConfig']>, OrderLine: Array<ResolversParentTypes['CustomFieldConfig']>, Payment: Array<ResolversParentTypes['CustomFieldConfig']>, PaymentMethod: Array<ResolversParentTypes['CustomFieldConfig']>, Product: Array<ResolversParentTypes['CustomFieldConfig']>, ProductOption: Array<ResolversParentTypes['CustomFieldConfig']>, ProductOptionGroup: Array<ResolversParentTypes['CustomFieldConfig']>, ProductVariant: Array<ResolversParentTypes['CustomFieldConfig']>, ProductVariantPrice: Array<ResolversParentTypes['CustomFieldConfig']>, Promotion: Array<ResolversParentTypes['CustomFieldConfig']>, Refund: Array<ResolversParentTypes['CustomFieldConfig']>, Region: Array<ResolversParentTypes['CustomFieldConfig']>, Seller: Array<ResolversParentTypes['CustomFieldConfig']>, Session: Array<ResolversParentTypes['CustomFieldConfig']>, ShippingLine: Array<ResolversParentTypes['CustomFieldConfig']>, ShippingMethod: Array<ResolversParentTypes['CustomFieldConfig']>, StockLevel: Array<ResolversParentTypes['CustomFieldConfig']>, StockLocation: Array<ResolversParentTypes['CustomFieldConfig']>, StockMovement: Array<ResolversParentTypes['CustomFieldConfig']>, TaxCategory: Array<ResolversParentTypes['CustomFieldConfig']>, TaxRate: Array<ResolversParentTypes['CustomFieldConfig']>, User: Array<ResolversParentTypes['CustomFieldConfig']>, Zone: Array<ResolversParentTypes['CustomFieldConfig']> };
  Customer: Omit<Customer, 'addresses' | 'groups' | 'history' | 'orders' | 'user'> & { addresses?: Maybe<Array<ResolversParentTypes['Address']>>, groups: Array<ResolversParentTypes['CustomerGroup']>, history: ResolversParentTypes['HistoryEntryList'], orders: ResolversParentTypes['OrderList'], user?: Maybe<ResolversParentTypes['User']> };
  CustomerCustomFields: CustomerCustomFields;
  CustomerFilterParameter: CustomerFilterParameter;
  CustomerGroup: Omit<CustomerGroup, 'customers'> & { customers: ResolversParentTypes['CustomerList'] };
  CustomerGroupFilterParameter: CustomerGroupFilterParameter;
  CustomerGroupList: Omit<CustomerGroupList, 'items'> & { items: Array<ResolversParentTypes['CustomerGroup']> };
  CustomerGroupListOptions: CustomerGroupListOptions;
  CustomerGroupSortParameter: CustomerGroupSortParameter;
  CustomerList: Omit<CustomerList, 'items'> & { items: Array<ResolversParentTypes['Customer']> };
  CustomerListOptions: CustomerListOptions;
  CustomerSortParameter: CustomerSortParameter;
  DashboardMetricSummary: DashboardMetricSummary;
  DashboardMetricSummaryEntry: DashboardMetricSummaryEntry;
  DashboardMetricSummaryInput: DashboardMetricSummaryInput;
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
  DayTranslationInput: DayTranslationInput;
  DeleteAssetInput: DeleteAssetInput;
  DeleteAssetsInput: DeleteAssetsInput;
  DeleteStockLocationInput: DeleteStockLocationInput;
  DeletionResponse: DeletionResponse;
  DeliveryCredentialGroup: DeliveryCredentialGroup;
  DeliveryMethod: DeliveryMethod;
  DeliveryMethodFilterParameter: DeliveryMethodFilterParameter;
  DeliveryMethodList: DeliveryMethodList;
  DeliveryMethodListOptions: DeliveryMethodListOptions;
  DeliveryMethodSortParameter: DeliveryMethodSortParameter;
  DeliveryMethodTranslation: DeliveryMethodTranslation;
  DeliveryMethodTranslationInput: DeliveryMethodTranslationInput;
  Discount: Discount;
  DuplicateEntityError: DuplicateEntityError;
  DuplicateEntityInput: DuplicateEntityInput;
  DuplicateEntityResult: ResolversUnionTypes<ResolversParentTypes>['DuplicateEntityResult'];
  DuplicateEntitySuccess: DuplicateEntitySuccess;
  EmailAddressConflictError: EmailAddressConflictError;
  EmptyOrderLineSelectionError: EmptyOrderLineSelectionError;
  EntityCustomFields: Omit<EntityCustomFields, 'customFields'> & { customFields: Array<ResolversParentTypes['CustomFieldConfig']> };
  EntityDuplicatorDefinition: EntityDuplicatorDefinition;
  ErrorResult: ResolversInterfaceTypes<ResolversParentTypes>['ErrorResult'];
  Facet: Facet;
  FacetFilterParameter: FacetFilterParameter;
  FacetInUseError: FacetInUseError;
  FacetList: FacetList;
  FacetListOptions: FacetListOptions;
  FacetSortParameter: FacetSortParameter;
  FacetTranslation: FacetTranslation;
  FacetTranslationInput: FacetTranslationInput;
  FacetValue: FacetValue;
  FacetValueCustomFields: Omit<FacetValueCustomFields, 'categories'> & { categories?: Maybe<Array<ResolversParentTypes['Category']>> };
  FacetValueFilterInput: FacetValueFilterInput;
  FacetValueFilterParameter: FacetValueFilterParameter;
  FacetValueList: FacetValueList;
  FacetValueListOptions: FacetValueListOptions;
  FacetValueResult: FacetValueResult;
  FacetValueSortParameter: FacetValueSortParameter;
  FacetValueTranslation: FacetValueTranslation;
  FacetValueTranslationInput: FacetValueTranslationInput;
  FilteredProductList: Omit<FilteredProductList, 'items'> & { items: Array<ResolversParentTypes['Product']> };
  FilteredProductSortParameters: FilteredProductSortParameters;
  Float: Scalars['Float']['output'];
  FloatCustomFieldConfig: FloatCustomFieldConfig;
  FloatStructFieldConfig: FloatStructFieldConfig;
  FulfillOrderInput: FulfillOrderInput;
  Fulfillment: Omit<Fulfillment, 'lines' | 'summary'> & { lines: Array<ResolversParentTypes['FulfillmentLine']>, summary: Array<ResolversParentTypes['FulfillmentLine']> };
  FulfillmentLine: Omit<FulfillmentLine, 'fulfillment' | 'orderLine'> & { fulfillment: ResolversParentTypes['Fulfillment'], orderLine: ResolversParentTypes['OrderLine'] };
  FulfillmentStateTransitionError: FulfillmentStateTransitionError;
  GlobalSettings: Omit<GlobalSettings, 'serverConfig'> & { serverConfig: ResolversParentTypes['ServerConfig'] };
  GuestCheckoutError: GuestCheckoutError;
  HistoryEntry: Omit<HistoryEntry, 'administrator'> & { administrator?: Maybe<ResolversParentTypes['Administrator']> };
  HistoryEntryFilterParameter: HistoryEntryFilterParameter;
  HistoryEntryList: Omit<HistoryEntryList, 'items'> & { items: Array<ResolversParentTypes['HistoryEntry']> };
  HistoryEntryListOptions: HistoryEntryListOptions;
  HistoryEntrySortParameter: HistoryEntrySortParameter;
  ID: Scalars['ID']['output'];
  IDListOperators: IdListOperators;
  IDOperators: IdOperators;
  ImageUploadResult: ImageUploadResult;
  ImportErrorRow: ImportErrorRow;
  ImportInfo: ImportInfo;
  ImportJob: ImportJob;
  ImportJobFilterParameter: ImportJobFilterParameter;
  ImportJobList: ImportJobList;
  ImportJobListOptions: ImportJobListOptions;
  ImportJobSortParameter: ImportJobSortParameter;
  ImportLog: ImportLog;
  IneligibleShippingMethodError: IneligibleShippingMethodError;
  InsufficientStockError: Omit<InsufficientStockError, 'order'> & { order: ResolversParentTypes['Order'] };
  InsufficientStockOnHandError: InsufficientStockOnHandError;
  Int: Scalars['Int']['output'];
  IntCustomFieldConfig: IntCustomFieldConfig;
  IntStructFieldConfig: IntStructFieldConfig;
  InvalidCredentialsError: InvalidCredentialsError;
  InvalidFulfillmentHandlerError: InvalidFulfillmentHandlerError;
  ItemsAlreadyFulfilledError: ItemsAlreadyFulfilledError;
  JSON: Scalars['JSON']['output'];
  Job: Job;
  JobBufferSize: JobBufferSize;
  JobFilterParameter: JobFilterParameter;
  JobList: JobList;
  JobListOptions: JobListOptions;
  JobQueue: JobQueue;
  JobSortParameter: JobSortParameter;
  Label: Label;
  LabelFilterParameter: LabelFilterParameter;
  LabelList: LabelList;
  LabelListOptions: LabelListOptions;
  LabelSortParameter: LabelSortParameter;
  LabelTranslation: LabelTranslation;
  LabelTranslationInput: LabelTranslationInput;
  LanguageNotAvailableError: LanguageNotAvailableError;
  LocaleStringCustomFieldConfig: LocaleStringCustomFieldConfig;
  LocaleTextCustomFieldConfig: LocaleTextCustomFieldConfig;
  LocalizedString: LocalizedString;
  ManualPaymentInput: ManualPaymentInput;
  ManualPaymentStateError: ManualPaymentStateError;
  MeiliAnalytics: MeiliAnalytics;
  MeiliHealthStatus: MeiliHealthStatus;
  MeiliIndexStats: MeiliIndexStats;
  MeiliMonitoringResult: MeiliMonitoringResult;
  MeiliRecentTask: MeiliRecentTask;
  MeiliSettingsInput: MeiliSettingsInput;
  MeiliSettingsResult: MeiliSettingsResult;
  MeiliSyncProgress: MeiliSyncProgress;
  MeiliTaskStats: MeiliTaskStats;
  MimeTypeError: MimeTypeError;
  MissingConditionsError: MissingConditionsError;
  Model: Model;
  ModelList: ModelList;
  ModifyOrderInput: ModifyOrderInput;
  ModifyOrderOptions: ModifyOrderOptions;
  ModifyOrderResult: ResolversUnionTypes<ResolversParentTypes>['ModifyOrderResult'];
  Money: Scalars['Money']['output'];
  MoveCollectionInput: MoveCollectionInput;
  MultipleOrderError: MultipleOrderError;
  Mutation: Record<PropertyKey, never>;
  NativeAuthInput: NativeAuthInput;
  NativeAuthStrategyError: NativeAuthStrategyError;
  NativeAuthenticationResult: ResolversUnionTypes<ResolversParentTypes>['NativeAuthenticationResult'];
  NegativeQuantityError: NegativeQuantityError;
  NoActiveOrderError: NoActiveOrderError;
  NoChangesSpecifiedError: NoChangesSpecifiedError;
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  NothingToRefundError: NothingToRefundError;
  NumberListOperators: NumberListOperators;
  NumberOperators: NumberOperators;
  NumberRange: NumberRange;
  Order: Omit<Order, 'aggregateOrder' | 'billingAddress' | 'channels' | 'customer' | 'fulfillments' | 'history' | 'lines' | 'modifications' | 'payments' | 'sellerOrders' | 'shippingAddress'> & { aggregateOrder?: Maybe<ResolversParentTypes['Order']>, billingAddress?: Maybe<ResolversParentTypes['OrderAddress']>, channels: Array<ResolversParentTypes['Channel']>, customer?: Maybe<ResolversParentTypes['Customer']>, fulfillments?: Maybe<Array<ResolversParentTypes['Fulfillment']>>, history: ResolversParentTypes['HistoryEntryList'], lines: Array<ResolversParentTypes['OrderLine']>, modifications: Array<ResolversParentTypes['OrderModification']>, payments?: Maybe<Array<ResolversParentTypes['Payment']>>, sellerOrders?: Maybe<Array<ResolversParentTypes['Order']>>, shippingAddress?: Maybe<ResolversParentTypes['OrderAddress']> };
  OrderAddress: OrderAddress;
  OrderCustomFields: OrderCustomFields;
  OrderFilterParameter: OrderFilterParameter;
  OrderInterceptorError: OrderInterceptorError;
  OrderLimitError: OrderLimitError;
  OrderLine: Omit<OrderLine, 'fulfillmentLines' | 'order' | 'productVariant'> & { fulfillmentLines?: Maybe<Array<ResolversParentTypes['FulfillmentLine']>>, order: ResolversParentTypes['Order'], productVariant: ResolversParentTypes['ProductVariant'] };
  OrderLineInput: OrderLineInput;
  OrderList: Omit<OrderList, 'items'> & { items: Array<ResolversParentTypes['Order']> };
  OrderListOptions: OrderListOptions;
  OrderModification: Omit<OrderModification, 'lines' | 'payment' | 'refund'> & { lines: Array<ResolversParentTypes['OrderModificationLine']>, payment?: Maybe<ResolversParentTypes['Payment']>, refund?: Maybe<ResolversParentTypes['Refund']> };
  OrderModificationError: OrderModificationError;
  OrderModificationLine: Omit<OrderModificationLine, 'modification' | 'orderLine'> & { modification: ResolversParentTypes['OrderModification'], orderLine: ResolversParentTypes['OrderLine'] };
  OrderModificationStateError: OrderModificationStateError;
  OrderProcessState: OrderProcessState;
  OrderSortParameter: OrderSortParameter;
  OrderStateTransitionError: OrderStateTransitionError;
  OrderTaxSummary: OrderTaxSummary;
  PaginatedList: ResolversInterfaceTypes<ResolversParentTypes>['PaginatedList'];
  Payment: Omit<Payment, 'refunds'> & { refunds: Array<ResolversParentTypes['Refund']> };
  PaymentMethod: PaymentMethod;
  PaymentMethodFilterParameter: PaymentMethodFilterParameter;
  PaymentMethodList: PaymentMethodList;
  PaymentMethodListOptions: PaymentMethodListOptions;
  PaymentMethodMissingError: PaymentMethodMissingError;
  PaymentMethodQuote: PaymentMethodQuote;
  PaymentMethodSortParameter: PaymentMethodSortParameter;
  PaymentMethodTranslation: PaymentMethodTranslation;
  PaymentMethodTranslationInput: PaymentMethodTranslationInput;
  PaymentOrderMismatchError: PaymentOrderMismatchError;
  PaymentStateTransitionError: PaymentStateTransitionError;
  PermissionDefinition: PermissionDefinition;
  PreviewCollectionVariantsInput: PreviewCollectionVariantsInput;
  PriceRange: PriceRange;
  Product: Omit<Product, 'activeOptionGroups' | 'categories' | 'category' | 'channels' | 'collections' | 'optionGroups' | 'seasons' | 'variantList' | 'variants'> & { activeOptionGroups: Array<ResolversParentTypes['ProductOptionGroup']>, categories: Array<ResolversParentTypes['Category']>, category?: Maybe<ResolversParentTypes['Category']>, channels: Array<ResolversParentTypes['Channel']>, collections: Array<ResolversParentTypes['Collection']>, optionGroups: Array<ResolversParentTypes['ProductOptionGroup']>, seasons: Array<ResolversParentTypes['Season']>, variantList: ResolversParentTypes['ProductVariantList'], variants: Array<ResolversParentTypes['ProductVariant']> };
  ProductCustomFields: Omit<ProductCustomFields, 'categories'> & { categories?: Maybe<Array<ResolversParentTypes['Category']>> };
  ProductFilterParameter: ProductFilterParameter;
  ProductList: Omit<ProductList, 'items'> & { items: Array<ResolversParentTypes['Product']> };
  ProductListOptions: ProductListOptions;
  ProductOption: Omit<ProductOption, 'group'> & { group: ResolversParentTypes['ProductOptionGroup'] };
  ProductOptionFilterParameter: ProductOptionFilterParameter;
  ProductOptionGroup: Omit<ProductOptionGroup, 'channels' | 'options'> & { channels: Array<ResolversParentTypes['Channel']>, options: Array<ResolversParentTypes['ProductOption']> };
  ProductOptionGroupFilterParameter: ProductOptionGroupFilterParameter;
  ProductOptionGroupInUseError: ProductOptionGroupInUseError;
  ProductOptionGroupList: Omit<ProductOptionGroupList, 'items'> & { items: Array<ResolversParentTypes['ProductOptionGroup']> };
  ProductOptionGroupListOptions: ProductOptionGroupListOptions;
  ProductOptionGroupSortParameter: ProductOptionGroupSortParameter;
  ProductOptionGroupTranslation: ProductOptionGroupTranslation;
  ProductOptionGroupTranslationInput: ProductOptionGroupTranslationInput;
  ProductOptionInUseError: ProductOptionInUseError;
  ProductOptionList: Omit<ProductOptionList, 'items'> & { items: Array<ResolversParentTypes['ProductOption']> };
  ProductOptionListOptions: ProductOptionListOptions;
  ProductOptionSortParameter: ProductOptionSortParameter;
  ProductOptionTranslation: ProductOptionTranslation;
  ProductOptionTranslationInput: ProductOptionTranslationInput;
  ProductSortParameter: ProductSortParameter;
  ProductTranslation: ProductTranslation;
  ProductTranslationInput: ProductTranslationInput;
  ProductVariant: Omit<ProductVariant, 'channels' | 'options' | 'product' | 'stockMovements' | 'taxRateApplied'> & { channels: Array<ResolversParentTypes['Channel']>, options: Array<ResolversParentTypes['ProductOption']>, product: ResolversParentTypes['Product'], stockMovements: ResolversParentTypes['StockMovementList'], taxRateApplied: ResolversParentTypes['TaxRate'] };
  ProductVariantFilterParameter: ProductVariantFilterParameter;
  ProductVariantList: Omit<ProductVariantList, 'items'> & { items: Array<ResolversParentTypes['ProductVariant']> };
  ProductVariantListOptions: ProductVariantListOptions;
  ProductVariantPrice: ProductVariantPrice;
  ProductVariantSortParameter: ProductVariantSortParameter;
  ProductVariantTranslation: ProductVariantTranslation;
  ProductVariantTranslationInput: ProductVariantTranslationInput;
  Promotion: Promotion;
  PromotionCustomFields: PromotionCustomFields;
  PromotionFilterParameter: PromotionFilterParameter;
  PromotionList: PromotionList;
  PromotionListOptions: PromotionListOptions;
  PromotionSortParameter: PromotionSortParameter;
  PromotionTranslation: PromotionTranslation;
  PromotionTranslationInput: PromotionTranslationInput;
  Province: Omit<Province, 'parent'> & { parent?: Maybe<ResolversParentTypes['Region']> };
  ProvinceFilterParameter: ProvinceFilterParameter;
  ProvinceList: Omit<ProvinceList, 'items'> & { items: Array<ResolversParentTypes['Province']> };
  ProvinceListOptions: ProvinceListOptions;
  ProvinceSortParameter: ProvinceSortParameter;
  ProvinceTranslationInput: ProvinceTranslationInput;
  QuantityTooGreatError: QuantityTooGreatError;
  Query: Record<PropertyKey, never>;
  RefreshTokenResponse: RefreshTokenResponse;
  Refund: Omit<Refund, 'lines'> & { lines: Array<ResolversParentTypes['RefundLine']> };
  RefundAmountError: RefundAmountError;
  RefundLine: Omit<RefundLine, 'orderLine' | 'refund'> & { orderLine: ResolversParentTypes['OrderLine'], refund: ResolversParentTypes['Refund'] };
  RefundOrderInput: RefundOrderInput;
  RefundOrderResult: ResolversUnionTypes<ResolversParentTypes>['RefundOrderResult'];
  RefundOrderStateError: RefundOrderStateError;
  RefundPaymentIdMissingError: RefundPaymentIdMissingError;
  RefundStateTransitionError: RefundStateTransitionError;
  Region: ResolversInterfaceTypes<ResolversParentTypes>['Region'];
  RegionTranslation: RegionTranslation;
  RelationCustomFieldConfig: RelationCustomFieldConfig;
  Release: Omit<Release, 'productVariant'> & { productVariant: ResolversParentTypes['ProductVariant'] };
  RemoveBannerAssetInput: RemoveBannerAssetInput;
  RemoveCollectionsFromChannelInput: RemoveCollectionsFromChannelInput;
  RemoveFacetFromChannelResult: ResolversUnionTypes<ResolversParentTypes>['RemoveFacetFromChannelResult'];
  RemoveFacetsFromChannelInput: RemoveFacetsFromChannelInput;
  RemoveOptionGroupFromProductResult: ResolversUnionTypes<ResolversParentTypes>['RemoveOptionGroupFromProductResult'];
  RemoveOrderItemsResult: ResolversUnionTypes<ResolversParentTypes>['RemoveOrderItemsResult'];
  RemovePaymentMethodsFromChannelInput: RemovePaymentMethodsFromChannelInput;
  RemoveProductOptionGroupFromChannelResult: ResolversUnionTypes<ResolversParentTypes>['RemoveProductOptionGroupFromChannelResult'];
  RemoveProductOptionGroupsFromChannelInput: RemoveProductOptionGroupsFromChannelInput;
  RemoveProductVariantsFromChannelInput: RemoveProductVariantsFromChannelInput;
  RemoveProductsFromChannelInput: RemoveProductsFromChannelInput;
  RemovePromotionsFromChannelInput: RemovePromotionsFromChannelInput;
  RemoveShippingMethodsFromChannelInput: RemoveShippingMethodsFromChannelInput;
  RemoveStockLocationsFromChannelInput: RemoveStockLocationsFromChannelInput;
  Return: Omit<Return, 'productVariant'> & { productVariant: ResolversParentTypes['ProductVariant'] };
  Role: Omit<Role, 'channels'> & { channels: Array<ResolversParentTypes['Channel']> };
  RoleFilterParameter: RoleFilterParameter;
  RoleList: Omit<RoleList, 'items'> & { items: Array<ResolversParentTypes['Role']> };
  RoleListOptions: RoleListOptions;
  RoleSortParameter: RoleSortParameter;
  RotateApiKeyResult: RotateApiKeyResult;
  Sale: Omit<Sale, 'productVariant'> & { productVariant: ResolversParentTypes['ProductVariant'] };
  SaleInfo: SaleInfo;
  ScheduledTask: ScheduledTask;
  SearchInput: SearchInput;
  SearchReindexResponse: SearchReindexResponse;
  SearchResponse: Omit<SearchResponse, 'collections' | 'items'> & { collections: Array<ResolversParentTypes['CollectionResult']>, items: Array<ResolversParentTypes['SearchResult']> };
  SearchResult: Omit<SearchResult, 'price' | 'priceWithTax'> & { price: ResolversParentTypes['SearchResultPrice'], priceWithTax: ResolversParentTypes['SearchResultPrice'] };
  SearchResultAsset: SearchResultAsset;
  SearchResultPrice: ResolversUnionTypes<ResolversParentTypes>['SearchResultPrice'];
  SearchResultSortParameter: SearchResultSortParameter;
  SearchTermStat: SearchTermStat;
  Season: Omit<Season, 'products'> & { products: ResolversParentTypes['ProductList'] };
  SeasonFilterParameter: SeasonFilterParameter;
  SeasonList: Omit<SeasonList, 'items'> & { items: Array<ResolversParentTypes['Season']> };
  SeasonListOptions: SeasonListOptions;
  SeasonSortParameter: SeasonSortParameter;
  SeasonTranslation: SeasonTranslation;
  SeasonTranslationInput: SeasonTranslationInput;
  Seller: Seller;
  SellerFilterParameter: SellerFilterParameter;
  SellerList: SellerList;
  SellerListOptions: SellerListOptions;
  SellerSortParameter: SellerSortParameter;
  ServerConfig: Omit<ServerConfig, 'customFieldConfig' | 'entityCustomFields'> & { customFieldConfig: ResolversParentTypes['CustomFields'], entityCustomFields: Array<ResolversParentTypes['EntityCustomFields']> };
  SetCustomerForDraftOrderResult: ResolversUnionTypes<ResolversParentTypes>['SetCustomerForDraftOrderResult'];
  SetOrderCustomerInput: SetOrderCustomerInput;
  SetOrderShippingMethodResult: ResolversUnionTypes<ResolversParentTypes>['SetOrderShippingMethodResult'];
  SetSettingsStoreValueResult: SetSettingsStoreValueResult;
  SettingsStoreFieldDefinition: SettingsStoreFieldDefinition;
  SettingsStoreInput: SettingsStoreInput;
  SettlePaymentError: SettlePaymentError;
  SettlePaymentResult: ResolversUnionTypes<ResolversParentTypes>['SettlePaymentResult'];
  SettleRefundInput: SettleRefundInput;
  SettleRefundResult: ResolversUnionTypes<ResolversParentTypes>['SettleRefundResult'];
  ShippingLine: ShippingLine;
  ShippingMethod: ShippingMethod;
  ShippingMethodFilterParameter: ShippingMethodFilterParameter;
  ShippingMethodList: ShippingMethodList;
  ShippingMethodListOptions: ShippingMethodListOptions;
  ShippingMethodQuote: ShippingMethodQuote;
  ShippingMethodSortParameter: ShippingMethodSortParameter;
  ShippingMethodTranslation: ShippingMethodTranslation;
  ShippingMethodTranslationInput: ShippingMethodTranslationInput;
  ShopFilteredProductFilterParameters: ShopFilteredProductFilterParameters;
  ShopFilteredProductListOptions: ShopFilteredProductListOptions;
  SinglePrice: SinglePrice;
  SlugForEntityInput: SlugForEntityInput;
  StockAdjustment: Omit<StockAdjustment, 'productVariant'> & { productVariant: ResolversParentTypes['ProductVariant'] };
  StockLevel: StockLevel;
  StockLevelInput: StockLevelInput;
  StockLocation: StockLocation;
  StockLocationFilterParameter: StockLocationFilterParameter;
  StockLocationList: StockLocationList;
  StockLocationListOptions: StockLocationListOptions;
  StockLocationSortParameter: StockLocationSortParameter;
  StockMovement: ResolversInterfaceTypes<ResolversParentTypes>['StockMovement'];
  StockMovementItem: ResolversUnionTypes<ResolversParentTypes>['StockMovementItem'];
  StockMovementList: Omit<StockMovementList, 'items'> & { items: Array<ResolversParentTypes['StockMovementItem']> };
  StockMovementListOptions: StockMovementListOptions;
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
  SurchargeInput: SurchargeInput;
  Tag: Tag;
  TagFilterParameter: TagFilterParameter;
  TagList: TagList;
  TagListOptions: TagListOptions;
  TagSortParameter: TagSortParameter;
  TaxCategory: TaxCategory;
  TaxCategoryFilterParameter: TaxCategoryFilterParameter;
  TaxCategoryList: TaxCategoryList;
  TaxCategoryListOptions: TaxCategoryListOptions;
  TaxCategorySortParameter: TaxCategorySortParameter;
  TaxLine: TaxLine;
  TaxRate: Omit<TaxRate, 'customerGroup' | 'zone'> & { customerGroup?: Maybe<ResolversParentTypes['CustomerGroup']>, zone: ResolversParentTypes['Zone'] };
  TaxRateFilterParameter: TaxRateFilterParameter;
  TaxRateList: Omit<TaxRateList, 'items'> & { items: Array<ResolversParentTypes['TaxRate']> };
  TaxRateListOptions: TaxRateListOptions;
  TaxRateSortParameter: TaxRateSortParameter;
  TestEligibleShippingMethodsInput: TestEligibleShippingMethodsInput;
  TestShippingMethodInput: TestShippingMethodInput;
  TestShippingMethodOrderLineInput: TestShippingMethodOrderLineInput;
  TestShippingMethodQuote: TestShippingMethodQuote;
  TestShippingMethodResult: TestShippingMethodResult;
  TextCustomFieldConfig: TextCustomFieldConfig;
  TextStructFieldConfig: TextStructFieldConfig;
  TransitionFulfillmentToStateResult: ResolversUnionTypes<ResolversParentTypes>['TransitionFulfillmentToStateResult'];
  TransitionOrderToStateResult: ResolversUnionTypes<ResolversParentTypes>['TransitionOrderToStateResult'];
  TransitionPaymentToStateResult: ResolversUnionTypes<ResolversParentTypes>['TransitionPaymentToStateResult'];
  UpdateActiveAdministratorInput: UpdateActiveAdministratorInput;
  UpdateAddressCustomFieldsInput: UpdateAddressCustomFieldsInput;
  UpdateAddressInput: UpdateAddressInput;
  UpdateAdministratorInput: UpdateAdministratorInput;
  UpdateApiKeyInput: UpdateApiKeyInput;
  UpdateApiKeyTranslationInput: UpdateApiKeyTranslationInput;
  UpdateAssetInput: UpdateAssetInput;
  UpdateBannerInput: UpdateBannerInput;
  UpdateBannerTypeInput: UpdateBannerTypeInput;
  UpdateCategoryInput: UpdateCategoryInput;
  UpdateCategoryTypeInput: UpdateCategoryTypeInput;
  UpdateChannelCustomFieldsInput: UpdateChannelCustomFieldsInput;
  UpdateChannelInput: UpdateChannelInput;
  UpdateChannelResult: ResolversUnionTypes<ResolversParentTypes>['UpdateChannelResult'];
  UpdateCollectionInput: UpdateCollectionInput;
  UpdateCollectionTranslationInput: UpdateCollectionTranslationInput;
  UpdateCountryInput: UpdateCountryInput;
  UpdateCustomerCustomFieldsInput: UpdateCustomerCustomFieldsInput;
  UpdateCustomerGroupInput: UpdateCustomerGroupInput;
  UpdateCustomerInput: UpdateCustomerInput;
  UpdateCustomerNoteInput: UpdateCustomerNoteInput;
  UpdateCustomerResult: ResolversUnionTypes<ResolversParentTypes>['UpdateCustomerResult'];
  UpdateDayInput: UpdateDayInput;
  UpdateDeliveryMethodInput: UpdateDeliveryMethodInput;
  UpdateFacetInput: UpdateFacetInput;
  UpdateFacetValueCustomFieldsInput: UpdateFacetValueCustomFieldsInput;
  UpdateFacetValueInput: UpdateFacetValueInput;
  UpdateGlobalSettingsInput: UpdateGlobalSettingsInput;
  UpdateGlobalSettingsResult: ResolversUnionTypes<ResolversParentTypes>['UpdateGlobalSettingsResult'];
  UpdateLabelInput: UpdateLabelInput;
  UpdateOrderAddressInput: UpdateOrderAddressInput;
  UpdateOrderCustomFieldsInput: UpdateOrderCustomFieldsInput;
  UpdateOrderInput: UpdateOrderInput;
  UpdateOrderItemErrorResult: ResolversUnionTypes<ResolversParentTypes>['UpdateOrderItemErrorResult'];
  UpdateOrderItemsResult: ResolversUnionTypes<ResolversParentTypes>['UpdateOrderItemsResult'];
  UpdateOrderNoteInput: UpdateOrderNoteInput;
  UpdatePaymentMethodInput: UpdatePaymentMethodInput;
  UpdateProductCustomFieldsInput: UpdateProductCustomFieldsInput;
  UpdateProductInput: UpdateProductInput;
  UpdateProductOptionGroupInput: UpdateProductOptionGroupInput;
  UpdateProductOptionInput: UpdateProductOptionInput;
  UpdateProductVariantInput: UpdateProductVariantInput;
  UpdateProductVariantPriceInput: UpdateProductVariantPriceInput;
  UpdatePromotionCustomFieldsInput: UpdatePromotionCustomFieldsInput;
  UpdatePromotionInput: UpdatePromotionInput;
  UpdatePromotionResult: ResolversUnionTypes<ResolversParentTypes>['UpdatePromotionResult'];
  UpdateProvinceInput: UpdateProvinceInput;
  UpdateRoleInput: UpdateRoleInput;
  UpdateScheduledTaskInput: UpdateScheduledTaskInput;
  UpdateSeasonInput: UpdateSeasonInput;
  UpdateSellerInput: UpdateSellerInput;
  UpdateShippingMethodInput: UpdateShippingMethodInput;
  UpdateStockLocationInput: UpdateStockLocationInput;
  UpdateTagInput: UpdateTagInput;
  UpdateTaxCategoryInput: UpdateTaxCategoryInput;
  UpdateTaxRateInput: UpdateTaxRateInput;
  UpdateWorkerInput: UpdateWorkerInput;
  UpdateZoneInput: UpdateZoneInput;
  Upload: Scalars['Upload']['output'];
  UpsertBannerAssetInput: UpsertBannerAssetInput;
  User: Omit<User, 'authenticationMethods' | 'roles'> & { authenticationMethods: Array<ResolversParentTypes['AuthenticationMethod']>, roles: Array<ResolversParentTypes['Role']> };
  VariantSoldCount: VariantSoldCount;
  Worker: Worker;
  WorkerFilterParameter: WorkerFilterParameter;
  WorkerList: WorkerList;
  WorkerListOptions: WorkerListOptions;
  WorkerSortParameter: WorkerSortParameter;
  Zone: Omit<Zone, 'members'> & { members: Array<ResolversParentTypes['Region']> };
  ZoneFilterParameter: ZoneFilterParameter;
  ZoneList: Omit<ZoneList, 'items'> & { items: Array<ResolversParentTypes['Zone']> };
  ZoneListOptions: ZoneListOptions;
  ZoneSortParameter: ZoneSortParameter;
};

export type AddFulfillmentToOrderResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddFulfillmentToOrderResult'] = ResolversParentTypes['AddFulfillmentToOrderResult']> = {
  __resolveType: TypeResolveFn<'CreateFulfillmentError' | 'EmptyOrderLineSelectionError' | 'Fulfillment' | 'FulfillmentStateTransitionError' | 'InsufficientStockOnHandError' | 'InvalidFulfillmentHandlerError' | 'ItemsAlreadyFulfilledError', ParentType, ContextType>;
};

export type AddManualPaymentToOrderResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddManualPaymentToOrderResult'] = ResolversParentTypes['AddManualPaymentToOrderResult']> = {
  __resolveType: TypeResolveFn<'ManualPaymentStateError' | 'Order', ParentType, ContextType>;
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

export type AdministratorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Administrator'] = ResolversParentTypes['Administrator']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  emailAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AdministratorListResolvers<ContextType = any, ParentType extends ResolversParentTypes['AdministratorList'] = ResolversParentTypes['AdministratorList']> = {
  items?: Resolver<Array<ResolversTypes['Administrator']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AggregatedMetadataResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregatedMetadata'] = ResolversParentTypes['AggregatedMetadata']> = {
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  max?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  min?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  models?: Resolver<Array<ResolversTypes['FacetValue']>, ParentType, ContextType>;
};

export type AllocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Allocation'] = ResolversParentTypes['Allocation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderLine?: Resolver<ResolversTypes['OrderLine'], ParentType, ContextType>;
  productVariant?: Resolver<ResolversTypes['ProductVariant'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['StockMovementType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AlreadyRefundedErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['AlreadyRefundedError'] = ResolversParentTypes['AlreadyRefundedError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refundId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApiKeyResolvers<ContextType = any, ParentType extends ResolversParentTypes['ApiKey'] = ResolversParentTypes['ApiKey']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastUsedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  lookupId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['ApiKeyTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApiKeyListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ApiKeyList'] = ResolversParentTypes['ApiKeyList']> = {
  items?: Resolver<Array<ResolversTypes['ApiKey']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApiKeyTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ApiKeyTranslation'] = ResolversParentTypes['ApiKeyTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<'CurrentUser' | 'InvalidCredentialsError', ParentType, ContextType>;
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

export type CancelActiveOrderErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['CancelActiveOrderError'] = ResolversParentTypes['CancelActiveOrderError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderState?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CancelOrderResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CancelOrderResult'] = ResolversParentTypes['CancelOrderResult']> = {
  __resolveType: TypeResolveFn<'CancelActiveOrderError' | 'EmptyOrderLineSelectionError' | 'MultipleOrderError' | 'Order' | 'OrderStateTransitionError' | 'QuantityTooGreatError', ParentType, ContextType>;
};

export type CancelPaymentErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['CancelPaymentError'] = ResolversParentTypes['CancelPaymentError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentErrorMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CancelPaymentResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CancelPaymentResult'] = ResolversParentTypes['CancelPaymentResult']> = {
  __resolveType: TypeResolveFn<'CancelPaymentError' | 'Payment' | 'PaymentStateTransitionError', ParentType, ContextType>;
};

export type CancellationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Cancellation'] = ResolversParentTypes['Cancellation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderLine?: Resolver<ResolversTypes['OrderLine'], ParentType, ContextType>;
  productVariant?: Resolver<ResolversTypes['ProductVariant'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['StockMovementType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type ChannelDefaultLanguageErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChannelDefaultLanguageError'] = ResolversParentTypes['ChannelDefaultLanguageError']> = {
  channelCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChannelListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChannelList'] = ResolversParentTypes['ChannelList']> = {
  items?: Resolver<Array<ResolversTypes['Channel']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  inheritFilters?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isPrivate?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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

export type CreateApiKeyResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateApiKeyResult'] = ResolversParentTypes['CreateApiKeyResult']> = {
  apiKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type CreateAssetResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAssetResult'] = ResolversParentTypes['CreateAssetResult']> = {
  __resolveType: TypeResolveFn<'Asset' | 'MimeTypeError', ParentType, ContextType>;
};

export type CreateChannelResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateChannelResult'] = ResolversParentTypes['CreateChannelResult']> = {
  __resolveType: TypeResolveFn<'Channel' | 'LanguageNotAvailableError', ParentType, ContextType>;
};

export type CreateCustomerResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateCustomerResult'] = ResolversParentTypes['CreateCustomerResult']> = {
  __resolveType: TypeResolveFn<'Customer' | 'EmailAddressConflictError', ParentType, ContextType>;
};

export type CreateFulfillmentErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateFulfillmentError'] = ResolversParentTypes['CreateFulfillmentError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  fulfillmentHandlerError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatePromotionResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatePromotionResult'] = ResolversParentTypes['CreatePromotionResult']> = {
  __resolveType: TypeResolveFn<'MissingConditionsError' | 'Promotion', ParentType, ContextType>;
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

export type CustomFieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomFields'] = ResolversParentTypes['CustomFields']> = {
  Address?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Administrator?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  ApiKey?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Asset?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Banner?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  BannerType?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Category?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  CategoryType?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Channel?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Collection?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Customer?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  CustomerGroup?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Day?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  DeliveryMethod?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Facet?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  FacetValue?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Fulfillment?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  GlobalSettings?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  HistoryEntry?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Label?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Order?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  OrderLine?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Payment?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  PaymentMethod?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Product?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  ProductOption?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  ProductOptionGroup?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  ProductVariant?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  ProductVariantPrice?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Promotion?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Refund?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Region?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Seller?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Session?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  ShippingLine?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  ShippingMethod?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  StockLevel?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  StockLocation?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  StockMovement?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  TaxCategory?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  TaxRate?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  User?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  Zone?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
};

export type CustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = {
  addresses?: Resolver<Maybe<Array<ResolversTypes['Address']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['CustomerCustomFields']>, ParentType, ContextType>;
  emailAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  groups?: Resolver<Array<ResolversTypes['CustomerGroup']>, ParentType, ContextType>;
  history?: Resolver<ResolversTypes['HistoryEntryList'], ParentType, ContextType, Partial<CustomerHistoryArgs>>;
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

export type CustomerGroupListResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerGroupList'] = ResolversParentTypes['CustomerGroupList']> = {
  items?: Resolver<Array<ResolversTypes['CustomerGroup']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomerListResolvers<ContextType = any, ParentType extends ResolversParentTypes['CustomerList'] = ResolversParentTypes['CustomerList']> = {
  items?: Resolver<Array<ResolversTypes['Customer']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DashboardMetricSummaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['DashboardMetricSummary'] = ResolversParentTypes['DashboardMetricSummary']> = {
  entries?: Resolver<Array<ResolversTypes['DashboardMetricSummaryEntry']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DashboardMetricType'], ParentType, ContextType>;
};

export type DashboardMetricSummaryEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['DashboardMetricSummaryEntry'] = ResolversParentTypes['DashboardMetricSummaryEntry']> = {
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
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

export type DuplicateEntityErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['DuplicateEntityError'] = ResolversParentTypes['DuplicateEntityError']> = {
  duplicationError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DuplicateEntityResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['DuplicateEntityResult'] = ResolversParentTypes['DuplicateEntityResult']> = {
  __resolveType: TypeResolveFn<'DuplicateEntityError' | 'DuplicateEntitySuccess', ParentType, ContextType>;
};

export type DuplicateEntitySuccessResolvers<ContextType = any, ParentType extends ResolversParentTypes['DuplicateEntitySuccess'] = ResolversParentTypes['DuplicateEntitySuccess']> = {
  newEntityId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmailAddressConflictErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmailAddressConflictError'] = ResolversParentTypes['EmailAddressConflictError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EmptyOrderLineSelectionErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['EmptyOrderLineSelectionError'] = ResolversParentTypes['EmptyOrderLineSelectionError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityCustomFieldsResolvers<ContextType = any, ParentType extends ResolversParentTypes['EntityCustomFields'] = ResolversParentTypes['EntityCustomFields']> = {
  customFields?: Resolver<Array<ResolversTypes['CustomFieldConfig']>, ParentType, ContextType>;
  entityName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type EntityDuplicatorDefinitionResolvers<ContextType = any, ParentType extends ResolversParentTypes['EntityDuplicatorDefinition'] = ResolversParentTypes['EntityDuplicatorDefinition']> = {
  args?: Resolver<Array<ResolversTypes['ConfigArgDefinition']>, ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  forEntities?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  requiresPermission?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType>;
};

export type ErrorResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ErrorResult'] = ResolversParentTypes['ErrorResult']> = {
  __resolveType: TypeResolveFn<'AlreadyRefundedError' | 'CancelActiveOrderError' | 'CancelPaymentError' | 'ChannelDefaultLanguageError' | 'CouponCodeExpiredError' | 'CouponCodeInvalidError' | 'CouponCodeLimitError' | 'CreateFulfillmentError' | 'DuplicateEntityError' | 'EmailAddressConflictError' | 'EmptyOrderLineSelectionError' | 'FacetInUseError' | 'FulfillmentStateTransitionError' | 'GuestCheckoutError' | 'IneligibleShippingMethodError' | 'InsufficientStockError' | 'InsufficientStockOnHandError' | 'InvalidCredentialsError' | 'InvalidFulfillmentHandlerError' | 'ItemsAlreadyFulfilledError' | 'LanguageNotAvailableError' | 'ManualPaymentStateError' | 'MimeTypeError' | 'MissingConditionsError' | 'MultipleOrderError' | 'NativeAuthStrategyError' | 'NegativeQuantityError' | 'NoActiveOrderError' | 'NoChangesSpecifiedError' | 'NothingToRefundError' | 'OrderInterceptorError' | 'OrderLimitError' | 'OrderModificationError' | 'OrderModificationStateError' | 'OrderStateTransitionError' | 'PaymentMethodMissingError' | 'PaymentOrderMismatchError' | 'PaymentStateTransitionError' | 'ProductOptionGroupInUseError' | 'ProductOptionInUseError' | 'QuantityTooGreatError' | 'RefundAmountError' | 'RefundOrderStateError' | 'RefundPaymentIdMissingError' | 'RefundStateTransitionError' | 'SettlePaymentError', ParentType, ContextType>;
};

export type FacetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Facet'] = ResolversParentTypes['Facet']> = {
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isPrivate?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['FacetTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  valueList?: Resolver<ResolversTypes['FacetValueList'], ParentType, ContextType, Partial<FacetValueListArgs>>;
  values?: Resolver<Array<ResolversTypes['FacetValue']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FacetInUseErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['FacetInUseError'] = ResolversParentTypes['FacetInUseError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  facetCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  variantCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  nextStates?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
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

export type FulfillmentStateTransitionErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['FulfillmentStateTransitionError'] = ResolversParentTypes['FulfillmentStateTransitionError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  fromState?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toState?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transitionError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GlobalSettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['GlobalSettings'] = ResolversParentTypes['GlobalSettings']> = {
  availableLanguages?: Resolver<Array<ResolversTypes['LanguageCode']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  outOfStockThreshold?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  serverConfig?: Resolver<ResolversTypes['ServerConfig'], ParentType, ContextType>;
  trackInventory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GuestCheckoutErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['GuestCheckoutError'] = ResolversParentTypes['GuestCheckoutError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  errorDetail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HistoryEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['HistoryEntry'] = ResolversParentTypes['HistoryEntry']> = {
  administrator?: Resolver<Maybe<ResolversTypes['Administrator']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  data?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isPublic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['HistoryEntryType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HistoryEntryListResolvers<ContextType = any, ParentType extends ResolversParentTypes['HistoryEntryList'] = ResolversParentTypes['HistoryEntryList']> = {
  items?: Resolver<Array<ResolversTypes['HistoryEntry']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImageUploadResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImageUploadResult'] = ResolversParentTypes['ImageUploadResult']> = {
  errors?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  matched?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unmatched?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unmatchedFiles?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
};

export type ImportErrorRowResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImportErrorRow'] = ResolversParentTypes['ImportErrorRow']> = {
  error?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rowNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sku?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  suggestedFix?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type ImportInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImportInfo'] = ResolversParentTypes['ImportInfo']> = {
  errors?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  imported?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  processed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type ImportJobResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImportJob'] = ResolversParentTypes['ImportJob']> = {
  completedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  dryRun?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  durationMs?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  failedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fileName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  initiatedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  logs?: Resolver<Array<ResolversTypes['ImportLog']>, ParentType, ContextType>;
  mode?: Resolver<ResolversTypes['ImportMode'], ParentType, ContextType>;
  progress?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reportPath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  skippedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ImportJobStatus'], ParentType, ContextType>;
  successCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalRows?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  warningCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImportJobListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImportJobList'] = ResolversParentTypes['ImportJobList']> = {
  items?: Resolver<Array<ResolversTypes['ImportJob']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImportLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['ImportLog'] = ResolversParentTypes['ImportLog']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rowNumber?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sku?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ImportLogStatus'], ParentType, ContextType>;
  suggestedFix?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
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

export type InsufficientStockOnHandErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['InsufficientStockOnHandError'] = ResolversParentTypes['InsufficientStockOnHandError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productVariantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productVariantName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stockOnHand?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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

export type InvalidFulfillmentHandlerErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['InvalidFulfillmentHandlerError'] = ResolversParentTypes['InvalidFulfillmentHandlerError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ItemsAlreadyFulfilledErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ItemsAlreadyFulfilledError'] = ResolversParentTypes['ItemsAlreadyFulfilledError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type JobResolvers<ContextType = any, ParentType extends ResolversParentTypes['Job'] = ResolversParentTypes['Job']> = {
  attempts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  data?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isSettled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  progress?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  queueName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  retries?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  settledAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['JobState'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type JobBufferSizeResolvers<ContextType = any, ParentType extends ResolversParentTypes['JobBufferSize'] = ResolversParentTypes['JobBufferSize']> = {
  bufferId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type JobListResolvers<ContextType = any, ParentType extends ResolversParentTypes['JobList'] = ResolversParentTypes['JobList']> = {
  items?: Resolver<Array<ResolversTypes['Job']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type JobQueueResolvers<ContextType = any, ParentType extends ResolversParentTypes['JobQueue'] = ResolversParentTypes['JobQueue']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  running?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

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

export type LanguageNotAvailableErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['LanguageNotAvailableError'] = ResolversParentTypes['LanguageNotAvailableError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type ManualPaymentStateErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ManualPaymentStateError'] = ResolversParentTypes['ManualPaymentStateError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeiliAnalyticsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeiliAnalytics'] = ResolversParentTypes['MeiliAnalytics']> = {
  emptyResultTerms?: Resolver<Array<ResolversTypes['SearchTermStat']>, ParentType, ContextType>;
  failedSyncCount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lastSyncTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  topSearchTerms?: Resolver<Array<ResolversTypes['SearchTermStat']>, ParentType, ContextType>;
  totalSearchRequests?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
};

export type MeiliHealthStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeiliHealthStatus'] = ResolversParentTypes['MeiliHealthStatus']> = {
  dbSizeBytes?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  isHealthy?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastUpdated?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type MeiliIndexStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeiliIndexStats'] = ResolversParentTypes['MeiliIndexStats']> = {
  documentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  indexName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isIndexing?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type MeiliMonitoringResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeiliMonitoringResult'] = ResolversParentTypes['MeiliMonitoringResult']> = {
  analytics?: Resolver<ResolversTypes['MeiliAnalytics'], ParentType, ContextType>;
  health?: Resolver<ResolversTypes['MeiliHealthStatus'], ParentType, ContextType>;
  indexStats?: Resolver<ResolversTypes['MeiliIndexStats'], ParentType, ContextType>;
  syncProgress?: Resolver<ResolversTypes['MeiliSyncProgress'], ParentType, ContextType>;
  taskStats?: Resolver<ResolversTypes['MeiliTaskStats'], ParentType, ContextType>;
};

export type MeiliRecentTaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeiliRecentTask'] = ResolversParentTypes['MeiliRecentTask']> = {
  duration?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  enqueuedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  finishedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uid?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type MeiliSettingsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeiliSettingsResult'] = ResolversParentTypes['MeiliSettingsResult']> = {
  filterableAttributes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  rankingRules?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  searchableAttributes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  sortableAttributes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  stopWords?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  synonyms?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  typoOneTypo?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  typoToleranceEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  typoTwoTypos?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type MeiliSyncProgressResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeiliSyncProgress'] = ResolversParentTypes['MeiliSyncProgress']> = {
  completedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  failed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  inProgress?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  indexed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastError?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type MeiliTaskStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeiliTaskStats'] = ResolversParentTypes['MeiliTaskStats']> = {
  enqueuedTasks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  failedTasks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pendingTasks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  processingTasks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  recentTasks?: Resolver<Array<ResolversTypes['MeiliRecentTask']>, ParentType, ContextType>;
  succeededTasks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalTasks?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type MimeTypeErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['MimeTypeError'] = ResolversParentTypes['MimeTypeError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  fileName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimeType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MissingConditionsErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['MissingConditionsError'] = ResolversParentTypes['MissingConditionsError']> = {
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

export type ModifyOrderResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ModifyOrderResult'] = ResolversParentTypes['ModifyOrderResult']> = {
  __resolveType: TypeResolveFn<'CouponCodeExpiredError' | 'CouponCodeInvalidError' | 'CouponCodeLimitError' | 'IneligibleShippingMethodError' | 'InsufficientStockError' | 'NegativeQuantityError' | 'NoChangesSpecifiedError' | 'Order' | 'OrderLimitError' | 'OrderModificationStateError' | 'PaymentMethodMissingError' | 'RefundPaymentIdMissingError', ParentType, ContextType>;
};

export interface MoneyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Money'], any> {
  name: 'Money';
}

export type MultipleOrderErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['MultipleOrderError'] = ResolversParentTypes['MultipleOrderError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCustomersToGroup?: Resolver<ResolversTypes['CustomerGroup'], ParentType, ContextType, RequireFields<MutationAddCustomersToGroupArgs, 'customerGroupId' | 'customerIds'>>;
  addFulfillmentToOrder?: Resolver<ResolversTypes['AddFulfillmentToOrderResult'], ParentType, ContextType, RequireFields<MutationAddFulfillmentToOrderArgs, 'input'>>;
  addItemToDraftOrder?: Resolver<ResolversTypes['UpdateOrderItemsResult'], ParentType, ContextType, RequireFields<MutationAddItemToDraftOrderArgs, 'input' | 'orderId'>>;
  addManualPaymentToOrder?: Resolver<ResolversTypes['AddManualPaymentToOrderResult'], ParentType, ContextType, RequireFields<MutationAddManualPaymentToOrderArgs, 'input'>>;
  addMembersToZone?: Resolver<ResolversTypes['Zone'], ParentType, ContextType, RequireFields<MutationAddMembersToZoneArgs, 'memberIds' | 'zoneId'>>;
  addNoteToCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationAddNoteToCustomerArgs, 'input'>>;
  addNoteToOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationAddNoteToOrderArgs, 'input'>>;
  addOptionGroupToProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationAddOptionGroupToProductArgs, 'optionGroupId' | 'productId'>>;
  adjustDraftOrderLine?: Resolver<ResolversTypes['UpdateOrderItemsResult'], ParentType, ContextType, RequireFields<MutationAdjustDraftOrderLineArgs, 'input' | 'orderId'>>;
  applyCouponCodeToDraftOrder?: Resolver<ResolversTypes['ApplyCouponCodeResult'], ParentType, ContextType, RequireFields<MutationApplyCouponCodeToDraftOrderArgs, 'couponCode' | 'orderId'>>;
  applyDeliveryMethod?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationApplyDeliveryMethodArgs, 'deliveryMethodId' | 'orderId'>>;
  assignAssetsToChannel?: Resolver<Array<ResolversTypes['Asset']>, ParentType, ContextType, RequireFields<MutationAssignAssetsToChannelArgs, 'input'>>;
  assignCollectionsToChannel?: Resolver<Array<ResolversTypes['Collection']>, ParentType, ContextType, RequireFields<MutationAssignCollectionsToChannelArgs, 'input'>>;
  assignCourierToOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationAssignCourierToOrderArgs, 'courierId' | 'orderId'>>;
  assignFacetsToChannel?: Resolver<Array<ResolversTypes['Facet']>, ParentType, ContextType, RequireFields<MutationAssignFacetsToChannelArgs, 'input'>>;
  assignPaymentMethodsToChannel?: Resolver<Array<ResolversTypes['PaymentMethod']>, ParentType, ContextType, RequireFields<MutationAssignPaymentMethodsToChannelArgs, 'input'>>;
  assignProductOptionGroupsToChannel?: Resolver<Array<ResolversTypes['ProductOptionGroup']>, ParentType, ContextType, RequireFields<MutationAssignProductOptionGroupsToChannelArgs, 'input'>>;
  assignProductVariantsToChannel?: Resolver<Array<ResolversTypes['ProductVariant']>, ParentType, ContextType, RequireFields<MutationAssignProductVariantsToChannelArgs, 'input'>>;
  assignProductsToChannel?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<MutationAssignProductsToChannelArgs, 'input'>>;
  assignProductsToSeason?: Resolver<ResolversTypes['Season'], ParentType, ContextType, RequireFields<MutationAssignProductsToSeasonArgs, 'productIds' | 'seasonId'>>;
  assignPromotionsToChannel?: Resolver<Array<ResolversTypes['Promotion']>, ParentType, ContextType, RequireFields<MutationAssignPromotionsToChannelArgs, 'input'>>;
  assignRoleToAdministrator?: Resolver<ResolversTypes['Administrator'], ParentType, ContextType, RequireFields<MutationAssignRoleToAdministratorArgs, 'administratorId' | 'roleId'>>;
  assignShippingMethodsToChannel?: Resolver<Array<ResolversTypes['ShippingMethod']>, ParentType, ContextType, RequireFields<MutationAssignShippingMethodsToChannelArgs, 'input'>>;
  assignStockLocationsToChannel?: Resolver<Array<ResolversTypes['StockLocation']>, ParentType, ContextType, RequireFields<MutationAssignStockLocationsToChannelArgs, 'input'>>;
  authenticate?: Resolver<ResolversTypes['AuthenticationResult'], ParentType, ContextType, RequireFields<MutationAuthenticateArgs, 'input'>>;
  cancelImportJob?: Resolver<ResolversTypes['ImportJob'], ParentType, ContextType, RequireFields<MutationCancelImportJobArgs, 'id'>>;
  cancelJob?: Resolver<ResolversTypes['Job'], ParentType, ContextType, RequireFields<MutationCancelJobArgs, 'jobId'>>;
  cancelOrder?: Resolver<ResolversTypes['CancelOrderResult'], ParentType, ContextType, RequireFields<MutationCancelOrderArgs, 'input'>>;
  cancelPayment?: Resolver<ResolversTypes['CancelPaymentResult'], ParentType, ContextType, RequireFields<MutationCancelPaymentArgs, 'id'>>;
  createAdministrator?: Resolver<ResolversTypes['Administrator'], ParentType, ContextType, RequireFields<MutationCreateAdministratorArgs, 'input'>>;
  createApiKey?: Resolver<ResolversTypes['CreateApiKeyResult'], ParentType, ContextType, RequireFields<MutationCreateApiKeyArgs, 'input'>>;
  createAssets?: Resolver<Array<ResolversTypes['CreateAssetResult']>, ParentType, ContextType, RequireFields<MutationCreateAssetsArgs, 'input'>>;
  createBanner?: Resolver<ResolversTypes['Banner'], ParentType, ContextType, RequireFields<MutationCreateBannerArgs, 'input'>>;
  createBannerType?: Resolver<ResolversTypes['BannerType'], ParentType, ContextType, RequireFields<MutationCreateBannerTypeArgs, 'input'>>;
  createCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'input'>>;
  createCategoryType?: Resolver<ResolversTypes['CategoryType'], ParentType, ContextType, RequireFields<MutationCreateCategoryTypeArgs, 'input'>>;
  createChannel?: Resolver<ResolversTypes['CreateChannelResult'], ParentType, ContextType, RequireFields<MutationCreateChannelArgs, 'input'>>;
  createCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationCreateCollectionArgs, 'input'>>;
  createCountry?: Resolver<ResolversTypes['Country'], ParentType, ContextType, RequireFields<MutationCreateCountryArgs, 'input'>>;
  createCustomer?: Resolver<ResolversTypes['CreateCustomerResult'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'input'>>;
  createCustomerAddress?: Resolver<ResolversTypes['Address'], ParentType, ContextType, RequireFields<MutationCreateCustomerAddressArgs, 'customerId' | 'input'>>;
  createCustomerGroup?: Resolver<ResolversTypes['CustomerGroup'], ParentType, ContextType, RequireFields<MutationCreateCustomerGroupArgs, 'input'>>;
  createDay?: Resolver<ResolversTypes['Day'], ParentType, ContextType, RequireFields<MutationCreateDayArgs, 'input'>>;
  createDeliveryMethod?: Resolver<ResolversTypes['DeliveryMethod'], ParentType, ContextType, RequireFields<MutationCreateDeliveryMethodArgs, 'input'>>;
  createDraftOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType>;
  createFacet?: Resolver<ResolversTypes['Facet'], ParentType, ContextType, RequireFields<MutationCreateFacetArgs, 'input'>>;
  createFacetValue?: Resolver<ResolversTypes['FacetValue'], ParentType, ContextType, RequireFields<MutationCreateFacetValueArgs, 'input'>>;
  createFacetValues?: Resolver<Array<ResolversTypes['FacetValue']>, ParentType, ContextType, RequireFields<MutationCreateFacetValuesArgs, 'input'>>;
  createLabel?: Resolver<ResolversTypes['Label'], ParentType, ContextType, RequireFields<MutationCreateLabelArgs, 'input'>>;
  createPaymentMethod?: Resolver<ResolversTypes['PaymentMethod'], ParentType, ContextType, RequireFields<MutationCreatePaymentMethodArgs, 'input'>>;
  createProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'input'>>;
  createProductOption?: Resolver<ResolversTypes['ProductOption'], ParentType, ContextType, RequireFields<MutationCreateProductOptionArgs, 'input'>>;
  createProductOptionGroup?: Resolver<ResolversTypes['ProductOptionGroup'], ParentType, ContextType, RequireFields<MutationCreateProductOptionGroupArgs, 'input'>>;
  createProductVariants?: Resolver<Array<Maybe<ResolversTypes['ProductVariant']>>, ParentType, ContextType, RequireFields<MutationCreateProductVariantsArgs, 'input'>>;
  createPromotion?: Resolver<ResolversTypes['CreatePromotionResult'], ParentType, ContextType, RequireFields<MutationCreatePromotionArgs, 'input'>>;
  createProvince?: Resolver<ResolversTypes['Province'], ParentType, ContextType, RequireFields<MutationCreateProvinceArgs, 'input'>>;
  createRole?: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationCreateRoleArgs, 'input'>>;
  createSeason?: Resolver<ResolversTypes['Season'], ParentType, ContextType, RequireFields<MutationCreateSeasonArgs, 'input'>>;
  createSeller?: Resolver<ResolversTypes['Seller'], ParentType, ContextType, RequireFields<MutationCreateSellerArgs, 'input'>>;
  createShippingMethod?: Resolver<ResolversTypes['ShippingMethod'], ParentType, ContextType, RequireFields<MutationCreateShippingMethodArgs, 'input'>>;
  createStockLocation?: Resolver<ResolversTypes['StockLocation'], ParentType, ContextType, RequireFields<MutationCreateStockLocationArgs, 'input'>>;
  createTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'input'>>;
  createTaxCategory?: Resolver<ResolversTypes['TaxCategory'], ParentType, ContextType, RequireFields<MutationCreateTaxCategoryArgs, 'input'>>;
  createTaxRate?: Resolver<ResolversTypes['TaxRate'], ParentType, ContextType, RequireFields<MutationCreateTaxRateArgs, 'input'>>;
  createWorker?: Resolver<ResolversTypes['Worker'], ParentType, ContextType, RequireFields<MutationCreateWorkerArgs, 'input'>>;
  createZone?: Resolver<ResolversTypes['Zone'], ParentType, ContextType, RequireFields<MutationCreateZoneArgs, 'input'>>;
  deleteAdministrator?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteAdministratorArgs, 'id'>>;
  deleteAdministrators?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteAdministratorsArgs, 'ids'>>;
  deleteApiKeys?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteApiKeysArgs, 'ids'>>;
  deleteAsset?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteAssetArgs, 'input'>>;
  deleteAssets?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteAssetsArgs, 'input'>>;
  deleteBanner?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteBannerArgs, 'id'>>;
  deleteBannerType?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteBannerTypeArgs, 'id'>>;
  deleteBannerTypes?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteBannerTypesArgs, 'ids'>>;
  deleteBanners?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteBannersArgs, 'ids'>>;
  deleteCategory?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteCategoryType?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteCategoryTypeArgs, 'id'>>;
  deleteChannel?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteChannelArgs, 'id'>>;
  deleteChannels?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteChannelsArgs, 'ids'>>;
  deleteCollection?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteCollectionArgs, 'id'>>;
  deleteCollections?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteCollectionsArgs, 'ids'>>;
  deleteCountries?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteCountriesArgs, 'ids'>>;
  deleteCountry?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteCountryArgs, 'id'>>;
  deleteCustomer?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteCustomerArgs, 'id'>>;
  deleteCustomerAccount?: Resolver<ResolversTypes['AuthDeletionResponse'], ParentType, ContextType>;
  deleteCustomerAddress?: Resolver<ResolversTypes['Success'], ParentType, ContextType, RequireFields<MutationDeleteCustomerAddressArgs, 'id'>>;
  deleteCustomerGroup?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteCustomerGroupArgs, 'id'>>;
  deleteCustomerGroups?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteCustomerGroupsArgs, 'ids'>>;
  deleteCustomerNote?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteCustomerNoteArgs, 'id'>>;
  deleteCustomers?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteCustomersArgs, 'ids'>>;
  deleteDay?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDayArgs, 'id'>>;
  deleteDeliveryMethod?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteDeliveryMethodArgs, 'id'>>;
  deleteDraftOrder?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteDraftOrderArgs, 'orderId'>>;
  deleteFacet?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteFacetArgs, 'id'>>;
  deleteFacetValues?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteFacetValuesArgs, 'ids'>>;
  deleteFacets?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteFacetsArgs, 'ids'>>;
  deleteLabel?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteLabelArgs, 'id'>>;
  deleteOrderNote?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteOrderNoteArgs, 'id'>>;
  deletePaymentMethod?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeletePaymentMethodArgs, 'id'>>;
  deletePaymentMethods?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeletePaymentMethodsArgs, 'ids'>>;
  deleteProduct?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'id'>>;
  deleteProductOption?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteProductOptionArgs, 'id'>>;
  deleteProductOptionGroup?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteProductOptionGroupArgs, 'id'>>;
  deleteProductOptionGroups?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteProductOptionGroupsArgs, 'ids'>>;
  deleteProductVariant?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteProductVariantArgs, 'id'>>;
  deleteProductVariants?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteProductVariantsArgs, 'ids'>>;
  deleteProducts?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteProductsArgs, 'ids'>>;
  deletePromotion?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeletePromotionArgs, 'id'>>;
  deletePromotions?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeletePromotionsArgs, 'ids'>>;
  deleteProvince?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteProvinceArgs, 'id'>>;
  deleteRole?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteRoleArgs, 'id'>>;
  deleteRoles?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteRolesArgs, 'ids'>>;
  deleteSeason?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteSeasonArgs, 'id'>>;
  deleteSeller?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteSellerArgs, 'id'>>;
  deleteSellers?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteSellersArgs, 'ids'>>;
  deleteShippingMethod?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteShippingMethodArgs, 'id'>>;
  deleteShippingMethods?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteShippingMethodsArgs, 'ids'>>;
  deleteStockLocation?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteStockLocationArgs, 'input'>>;
  deleteStockLocations?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteStockLocationsArgs, 'input'>>;
  deleteTag?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'id'>>;
  deleteTaxCategories?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteTaxCategoriesArgs, 'ids'>>;
  deleteTaxCategory?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteTaxCategoryArgs, 'id'>>;
  deleteTaxRate?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteTaxRateArgs, 'id'>>;
  deleteTaxRates?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteTaxRatesArgs, 'ids'>>;
  deleteWorker?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteWorkerArgs, 'id'>>;
  deleteZone?: Resolver<ResolversTypes['DeletionResponse'], ParentType, ContextType, RequireFields<MutationDeleteZoneArgs, 'id'>>;
  deleteZones?: Resolver<Array<ResolversTypes['DeletionResponse']>, ParentType, ContextType, RequireFields<MutationDeleteZonesArgs, 'ids'>>;
  duplicateEntity?: Resolver<ResolversTypes['DuplicateEntityResult'], ParentType, ContextType, RequireFields<MutationDuplicateEntityArgs, 'input'>>;
  editButtonState?: Resolver<ResolversTypes['DeliveryMethod'], ParentType, ContextType, RequireFields<MutationEditButtonStateArgs, 'id'>>;
  flushBufferedJobs?: Resolver<ResolversTypes['Success'], ParentType, ContextType, Partial<MutationFlushBufferedJobsArgs>>;
  importProducts?: Resolver<Maybe<ResolversTypes['ImportInfo']>, ParentType, ContextType, RequireFields<MutationImportProductsArgs, 'csvFile'>>;
  login?: Resolver<ResolversTypes['NativeAuthenticationResult'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'password' | 'username'>>;
  logout?: Resolver<ResolversTypes['Success'], ParentType, ContextType>;
  meiliClearIndex?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  meiliForceSync?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  meiliResetAnalytics?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  meiliRunSyncInline?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  modifyOrder?: Resolver<ResolversTypes['ModifyOrderResult'], ParentType, ContextType, RequireFields<MutationModifyOrderArgs, 'input'>>;
  moveCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationMoveCollectionArgs, 'input'>>;
  refundOrder?: Resolver<ResolversTypes['RefundOrderResult'], ParentType, ContextType, RequireFields<MutationRefundOrderArgs, 'input'>>;
  reindex?: Resolver<ResolversTypes['Job'], ParentType, ContextType>;
  removeBannerAsset?: Resolver<ResolversTypes['Banner'], ParentType, ContextType, RequireFields<MutationRemoveBannerAssetArgs, 'input'>>;
  removeCollectionsFromChannel?: Resolver<Array<ResolversTypes['Collection']>, ParentType, ContextType, RequireFields<MutationRemoveCollectionsFromChannelArgs, 'input'>>;
  removeCouponCodeFromDraftOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationRemoveCouponCodeFromDraftOrderArgs, 'couponCode' | 'orderId'>>;
  removeCustomersFromGroup?: Resolver<ResolversTypes['CustomerGroup'], ParentType, ContextType, RequireFields<MutationRemoveCustomersFromGroupArgs, 'customerGroupId' | 'customerIds'>>;
  removeDraftOrderLine?: Resolver<ResolversTypes['RemoveOrderItemsResult'], ParentType, ContextType, RequireFields<MutationRemoveDraftOrderLineArgs, 'orderId' | 'orderLineId'>>;
  removeFacetsFromChannel?: Resolver<Array<ResolversTypes['RemoveFacetFromChannelResult']>, ParentType, ContextType, RequireFields<MutationRemoveFacetsFromChannelArgs, 'input'>>;
  removeMembersFromZone?: Resolver<ResolversTypes['Zone'], ParentType, ContextType, RequireFields<MutationRemoveMembersFromZoneArgs, 'memberIds' | 'zoneId'>>;
  removeOptionGroupFromProduct?: Resolver<ResolversTypes['RemoveOptionGroupFromProductResult'], ParentType, ContextType, RequireFields<MutationRemoveOptionGroupFromProductArgs, 'optionGroupId' | 'productId'>>;
  removePaymentMethodsFromChannel?: Resolver<Array<ResolversTypes['PaymentMethod']>, ParentType, ContextType, RequireFields<MutationRemovePaymentMethodsFromChannelArgs, 'input'>>;
  removeProductOptionGroupsFromChannel?: Resolver<Array<ResolversTypes['RemoveProductOptionGroupFromChannelResult']>, ParentType, ContextType, RequireFields<MutationRemoveProductOptionGroupsFromChannelArgs, 'input'>>;
  removeProductVariantsFromChannel?: Resolver<Array<ResolversTypes['ProductVariant']>, ParentType, ContextType, RequireFields<MutationRemoveProductVariantsFromChannelArgs, 'input'>>;
  removeProductsFromChannel?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<MutationRemoveProductsFromChannelArgs, 'input'>>;
  removeProductsFromSeason?: Resolver<ResolversTypes['Season'], ParentType, ContextType, RequireFields<MutationRemoveProductsFromSeasonArgs, 'productIds' | 'seasonId'>>;
  removePromotionsFromChannel?: Resolver<Array<ResolversTypes['Promotion']>, ParentType, ContextType, RequireFields<MutationRemovePromotionsFromChannelArgs, 'input'>>;
  removeSettledJobs?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<MutationRemoveSettledJobsArgs>>;
  removeShippingMethodsFromChannel?: Resolver<Array<ResolversTypes['ShippingMethod']>, ParentType, ContextType, RequireFields<MutationRemoveShippingMethodsFromChannelArgs, 'input'>>;
  removeStockLocationsFromChannel?: Resolver<Array<ResolversTypes['StockLocation']>, ParentType, ContextType, RequireFields<MutationRemoveStockLocationsFromChannelArgs, 'input'>>;
  rotateApiKey?: Resolver<ResolversTypes['RotateApiKeyResult'], ParentType, ContextType, RequireFields<MutationRotateApiKeyArgs, 'id'>>;
  runMeiliInitialSync?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  runPendingSearchIndexUpdates?: Resolver<ResolversTypes['Success'], ParentType, ContextType>;
  runScheduledTask?: Resolver<ResolversTypes['Success'], ParentType, ContextType, RequireFields<MutationRunScheduledTaskArgs, 'id'>>;
  setCustomerForDraftOrder?: Resolver<ResolversTypes['SetCustomerForDraftOrderResult'], ParentType, ContextType, RequireFields<MutationSetCustomerForDraftOrderArgs, 'orderId'>>;
  setDraftOrderBillingAddress?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationSetDraftOrderBillingAddressArgs, 'input' | 'orderId'>>;
  setDraftOrderCustomFields?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationSetDraftOrderCustomFieldsArgs, 'input' | 'orderId'>>;
  setDraftOrderShippingAddress?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationSetDraftOrderShippingAddressArgs, 'input' | 'orderId'>>;
  setDraftOrderShippingMethod?: Resolver<ResolversTypes['SetOrderShippingMethodResult'], ParentType, ContextType, RequireFields<MutationSetDraftOrderShippingMethodArgs, 'orderId' | 'shippingMethodId'>>;
  setOrderCustomFields?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationSetOrderCustomFieldsArgs, 'input'>>;
  setOrderCustomer?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationSetOrderCustomerArgs, 'input'>>;
  setSettingsStoreValue?: Resolver<ResolversTypes['SetSettingsStoreValueResult'], ParentType, ContextType, RequireFields<MutationSetSettingsStoreValueArgs, 'input'>>;
  setSettingsStoreValues?: Resolver<Array<ResolversTypes['SetSettingsStoreValueResult']>, ParentType, ContextType, RequireFields<MutationSetSettingsStoreValuesArgs, 'inputs'>>;
  settlePayment?: Resolver<ResolversTypes['SettlePaymentResult'], ParentType, ContextType, RequireFields<MutationSettlePaymentArgs, 'id'>>;
  settleRefund?: Resolver<ResolversTypes['SettleRefundResult'], ParentType, ContextType, RequireFields<MutationSettleRefundArgs, 'input'>>;
  syncMeilisearchNow?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  trackBannerClick?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationTrackBannerClickArgs, 'id'>>;
  transitionFulfillmentToState?: Resolver<ResolversTypes['TransitionFulfillmentToStateResult'], ParentType, ContextType, RequireFields<MutationTransitionFulfillmentToStateArgs, 'id' | 'state'>>;
  transitionOrderToState?: Resolver<Maybe<ResolversTypes['TransitionOrderToStateResult']>, ParentType, ContextType, RequireFields<MutationTransitionOrderToStateArgs, 'id' | 'state'>>;
  transitionPaymentToState?: Resolver<ResolversTypes['TransitionPaymentToStateResult'], ParentType, ContextType, RequireFields<MutationTransitionPaymentToStateArgs, 'id' | 'state'>>;
  unassignCourierFromOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationUnassignCourierFromOrderArgs, 'orderId'>>;
  unsetDraftOrderBillingAddress?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationUnsetDraftOrderBillingAddressArgs, 'orderId'>>;
  unsetDraftOrderShippingAddress?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationUnsetDraftOrderShippingAddressArgs, 'orderId'>>;
  updateActiveAdministrator?: Resolver<ResolversTypes['Administrator'], ParentType, ContextType, RequireFields<MutationUpdateActiveAdministratorArgs, 'input'>>;
  updateAdministrator?: Resolver<ResolversTypes['Administrator'], ParentType, ContextType, RequireFields<MutationUpdateAdministratorArgs, 'input'>>;
  updateApiKey?: Resolver<ResolversTypes['ApiKey'], ParentType, ContextType, RequireFields<MutationUpdateApiKeyArgs, 'input'>>;
  updateAsset?: Resolver<ResolversTypes['Asset'], ParentType, ContextType, RequireFields<MutationUpdateAssetArgs, 'input'>>;
  updateBanner?: Resolver<ResolversTypes['Banner'], ParentType, ContextType, RequireFields<MutationUpdateBannerArgs, 'input'>>;
  updateBannerType?: Resolver<ResolversTypes['BannerType'], ParentType, ContextType, RequireFields<MutationUpdateBannerTypeArgs, 'input'>>;
  updateCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, 'input'>>;
  updateCategoryType?: Resolver<ResolversTypes['CategoryType'], ParentType, ContextType, RequireFields<MutationUpdateCategoryTypeArgs, 'input'>>;
  updateChannel?: Resolver<ResolversTypes['UpdateChannelResult'], ParentType, ContextType, RequireFields<MutationUpdateChannelArgs, 'input'>>;
  updateCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationUpdateCollectionArgs, 'input'>>;
  updateCountry?: Resolver<ResolversTypes['Country'], ParentType, ContextType, RequireFields<MutationUpdateCountryArgs, 'input'>>;
  updateCustomer?: Resolver<ResolversTypes['UpdateCustomerResult'], ParentType, ContextType, RequireFields<MutationUpdateCustomerArgs, 'input'>>;
  updateCustomerAddress?: Resolver<ResolversTypes['Address'], ParentType, ContextType, RequireFields<MutationUpdateCustomerAddressArgs, 'input'>>;
  updateCustomerGroup?: Resolver<ResolversTypes['CustomerGroup'], ParentType, ContextType, RequireFields<MutationUpdateCustomerGroupArgs, 'input'>>;
  updateCustomerNote?: Resolver<ResolversTypes['HistoryEntry'], ParentType, ContextType, RequireFields<MutationUpdateCustomerNoteArgs, 'input'>>;
  updateDay?: Resolver<ResolversTypes['Day'], ParentType, ContextType, RequireFields<MutationUpdateDayArgs, 'input'>>;
  updateDeliveryMethod?: Resolver<ResolversTypes['DeliveryMethod'], ParentType, ContextType, RequireFields<MutationUpdateDeliveryMethodArgs, 'input'>>;
  updateFacet?: Resolver<ResolversTypes['Facet'], ParentType, ContextType, RequireFields<MutationUpdateFacetArgs, 'input'>>;
  updateFacetValue?: Resolver<ResolversTypes['FacetValue'], ParentType, ContextType, RequireFields<MutationUpdateFacetValueArgs, 'input'>>;
  updateFacetValues?: Resolver<Array<ResolversTypes['FacetValue']>, ParentType, ContextType, RequireFields<MutationUpdateFacetValuesArgs, 'input'>>;
  updateGlobalSettings?: Resolver<ResolversTypes['UpdateGlobalSettingsResult'], ParentType, ContextType, RequireFields<MutationUpdateGlobalSettingsArgs, 'input'>>;
  updateLabel?: Resolver<ResolversTypes['Label'], ParentType, ContextType, RequireFields<MutationUpdateLabelArgs, 'input'>>;
  updateMeiliSettings?: Resolver<ResolversTypes['MeiliSettingsResult'], ParentType, ContextType, RequireFields<MutationUpdateMeiliSettingsArgs, 'input'>>;
  updateOrderNote?: Resolver<ResolversTypes['HistoryEntry'], ParentType, ContextType, RequireFields<MutationUpdateOrderNoteArgs, 'input'>>;
  updatePaymentMethod?: Resolver<ResolversTypes['PaymentMethod'], ParentType, ContextType, RequireFields<MutationUpdatePaymentMethodArgs, 'input'>>;
  updateProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationUpdateProductArgs, 'input'>>;
  updateProductOption?: Resolver<ResolversTypes['ProductOption'], ParentType, ContextType, RequireFields<MutationUpdateProductOptionArgs, 'input'>>;
  updateProductOptionGroup?: Resolver<ResolversTypes['ProductOptionGroup'], ParentType, ContextType, RequireFields<MutationUpdateProductOptionGroupArgs, 'input'>>;
  updateProductVariant?: Resolver<ResolversTypes['ProductVariant'], ParentType, ContextType, RequireFields<MutationUpdateProductVariantArgs, 'input'>>;
  updateProductVariants?: Resolver<Array<Maybe<ResolversTypes['ProductVariant']>>, ParentType, ContextType, RequireFields<MutationUpdateProductVariantsArgs, 'input'>>;
  updateProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<MutationUpdateProductsArgs, 'input'>>;
  updatePromotion?: Resolver<ResolversTypes['UpdatePromotionResult'], ParentType, ContextType, RequireFields<MutationUpdatePromotionArgs, 'input'>>;
  updateProvince?: Resolver<ResolversTypes['Province'], ParentType, ContextType, RequireFields<MutationUpdateProvinceArgs, 'input'>>;
  updateRole?: Resolver<ResolversTypes['Role'], ParentType, ContextType, RequireFields<MutationUpdateRoleArgs, 'input'>>;
  updateScheduledTask?: Resolver<ResolversTypes['ScheduledTask'], ParentType, ContextType, RequireFields<MutationUpdateScheduledTaskArgs, 'input'>>;
  updateSeason?: Resolver<ResolversTypes['Season'], ParentType, ContextType, RequireFields<MutationUpdateSeasonArgs, 'input'>>;
  updateSeller?: Resolver<ResolversTypes['Seller'], ParentType, ContextType, RequireFields<MutationUpdateSellerArgs, 'input'>>;
  updateShippingMethod?: Resolver<ResolversTypes['ShippingMethod'], ParentType, ContextType, RequireFields<MutationUpdateShippingMethodArgs, 'input'>>;
  updateStockLocation?: Resolver<ResolversTypes['StockLocation'], ParentType, ContextType, RequireFields<MutationUpdateStockLocationArgs, 'input'>>;
  updateTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdateTagArgs, 'input'>>;
  updateTaxCategory?: Resolver<ResolversTypes['TaxCategory'], ParentType, ContextType, RequireFields<MutationUpdateTaxCategoryArgs, 'input'>>;
  updateTaxRate?: Resolver<ResolversTypes['TaxRate'], ParentType, ContextType, RequireFields<MutationUpdateTaxRateArgs, 'input'>>;
  updateWorker?: Resolver<ResolversTypes['Worker'], ParentType, ContextType, RequireFields<MutationUpdateWorkerArgs, 'id' | 'input'>>;
  updateZone?: Resolver<ResolversTypes['Zone'], ParentType, ContextType, RequireFields<MutationUpdateZoneArgs, 'input'>>;
  uploadProductExcel?: Resolver<ResolversTypes['ImportJob'], ParentType, ContextType, RequireFields<MutationUploadProductExcelArgs, 'mode'>>;
  uploadProductImages?: Resolver<ResolversTypes['ImageUploadResult'], ParentType, ContextType>;
  upsertBannerAsset?: Resolver<ResolversTypes['Banner'], ParentType, ContextType, RequireFields<MutationUpsertBannerAssetArgs, 'input'>>;
};

export type NativeAuthStrategyErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['NativeAuthStrategyError'] = ResolversParentTypes['NativeAuthStrategyError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NativeAuthenticationResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['NativeAuthenticationResult'] = ResolversParentTypes['NativeAuthenticationResult']> = {
  __resolveType: TypeResolveFn<'CurrentUser' | 'InvalidCredentialsError' | 'NativeAuthStrategyError', ParentType, ContextType>;
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

export type NoChangesSpecifiedErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['NoChangesSpecifiedError'] = ResolversParentTypes['NoChangesSpecifiedError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'Address' | 'Administrator' | 'Allocation' | 'ApiKey' | 'ApiKeyTranslation' | 'Asset' | 'AuthenticationMethod' | 'Banner' | 'BannerAsset' | 'BannerType' | 'Cancellation' | 'Category' | 'CategoryType' | 'Channel' | 'Collection' | 'Country' | 'Customer' | 'CustomerGroup' | 'Day' | 'DeliveryMethod' | 'Facet' | 'FacetValue' | 'Fulfillment' | 'HistoryEntry' | 'ImportJob' | 'ImportLog' | 'Job' | 'Label' | 'Order' | 'OrderLine' | 'OrderModification' | 'Payment' | 'PaymentMethod' | 'Product' | 'ProductOption' | 'ProductOptionGroup' | 'ProductVariant' | 'Promotion' | 'Province' | 'Refund' | 'Release' | 'Return' | 'Role' | 'Sale' | 'Season' | 'SeasonTranslation' | 'Seller' | 'ShippingMethod' | 'StockAdjustment' | 'StockLevel' | 'StockLocation' | 'Surcharge' | 'Tag' | 'TaxCategory' | 'TaxRate' | 'User' | 'Worker' | 'Zone', ParentType, ContextType>;
};

export type NothingToRefundErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['NothingToRefundError'] = ResolversParentTypes['NothingToRefundError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  aggregateOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType>;
  aggregateOrderId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  billingAddress?: Resolver<Maybe<ResolversTypes['OrderAddress']>, ParentType, ContextType>;
  channels?: Resolver<Array<ResolversTypes['Channel']>, ParentType, ContextType>;
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
  modifications?: Resolver<Array<ResolversTypes['OrderModification']>, ParentType, ContextType>;
  nextStates?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  orderPlacedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  payments?: Resolver<Maybe<Array<ResolversTypes['Payment']>>, ParentType, ContextType>;
  promotions?: Resolver<Array<ResolversTypes['Promotion']>, ParentType, ContextType>;
  sellerOrders?: Resolver<Maybe<Array<ResolversTypes['Order']>>, ParentType, ContextType>;
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

export type OrderModificationResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderModification'] = ResolversParentTypes['OrderModification']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isSettled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lines?: Resolver<Array<ResolversTypes['OrderModificationLine']>, ParentType, ContextType>;
  note?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  payment?: Resolver<Maybe<ResolversTypes['Payment']>, ParentType, ContextType>;
  priceChange?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  refund?: Resolver<Maybe<ResolversTypes['Refund']>, ParentType, ContextType>;
  surcharges?: Resolver<Maybe<Array<ResolversTypes['Surcharge']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderModificationErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderModificationError'] = ResolversParentTypes['OrderModificationError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderModificationLineResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderModificationLine'] = ResolversParentTypes['OrderModificationLine']> = {
  modification?: Resolver<ResolversTypes['OrderModification'], ParentType, ContextType>;
  modificationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  orderLine?: Resolver<ResolversTypes['OrderLine'], ParentType, ContextType>;
  orderLineId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type OrderModificationStateErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderModificationStateError'] = ResolversParentTypes['OrderModificationStateError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderProcessStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderProcessState'] = ResolversParentTypes['OrderProcessState']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  to?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
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
  __resolveType: TypeResolveFn<'AdministratorList' | 'ApiKeyList' | 'AssetList' | 'BannerList' | 'BannerTypeList' | 'CategoryList' | 'CategoryTypeList' | 'ChannelList' | 'CollectionList' | 'CountryList' | 'CustomerGroupList' | 'CustomerList' | 'DayList' | 'DeliveryMethodList' | 'FacetList' | 'FacetValueList' | 'HistoryEntryList' | 'ImportJobList' | 'JobList' | 'LabelList' | 'OrderList' | 'PaymentMethodList' | 'ProductList' | 'ProductOptionGroupList' | 'ProductOptionList' | 'ProductVariantList' | 'PromotionList' | 'ProvinceList' | 'RoleList' | 'SeasonList' | 'SellerList' | 'ShippingMethodList' | 'StockLocationList' | 'TagList' | 'TaxCategoryList' | 'TaxRateList' | 'WorkerList' | 'ZoneList', ParentType, ContextType>;
};

export type PaymentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Payment'] = ResolversParentTypes['Payment']> = {
  amount?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  errorMessage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  method?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nextStates?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  refunds?: Resolver<Array<ResolversTypes['Refund']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transactionId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
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

export type PaymentMethodListResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentMethodList'] = ResolversParentTypes['PaymentMethodList']> = {
  items?: Resolver<Array<ResolversTypes['PaymentMethod']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentMethodMissingErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentMethodMissingError'] = ResolversParentTypes['PaymentMethodMissingError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type PaymentOrderMismatchErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentOrderMismatchError'] = ResolversParentTypes['PaymentOrderMismatchError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PaymentStateTransitionErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['PaymentStateTransitionError'] = ResolversParentTypes['PaymentStateTransitionError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  fromState?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toState?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transitionError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PermissionDefinitionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PermissionDefinition'] = ResolversParentTypes['PermissionDefinition']> = {
  assignable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  channels?: Resolver<Array<ResolversTypes['Channel']>, ParentType, ContextType>;
  collections?: Resolver<Array<ResolversTypes['Collection']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['ProductCustomFields']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  facetValues?: Resolver<Array<ResolversTypes['FacetValue']>, ParentType, ContextType>;
  featuredAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  isSelected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  labels?: Resolver<Array<ResolversTypes['Label']>, ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionGroups?: Resolver<Array<ResolversTypes['ProductOptionGroup']>, ParentType, ContextType>;
  sale?: Resolver<Maybe<ResolversTypes['SaleInfo']>, ParentType, ContextType>;
  seasons?: Resolver<Array<ResolversTypes['Season']>, ParentType, ContextType>;
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
  channels?: Resolver<Array<ResolversTypes['Channel']>, ParentType, ContextType>;
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

export type ProductOptionGroupInUseErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductOptionGroupInUseError'] = ResolversParentTypes['ProductOptionGroupInUseError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionGroupCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  variantCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductOptionGroupListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductOptionGroupList'] = ResolversParentTypes['ProductOptionGroupList']> = {
  items?: Resolver<Array<ResolversTypes['ProductOptionGroup']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductOptionGroupTranslationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductOptionGroupTranslation'] = ResolversParentTypes['ProductOptionGroupTranslation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
};

export type ProductOptionInUseErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductOptionInUseError'] = ResolversParentTypes['ProductOptionInUseError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  optionGroupCode?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productVariantCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductOptionListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductOptionList'] = ResolversParentTypes['ProductOptionList']> = {
  items?: Resolver<Array<ResolversTypes['ProductOption']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  channels?: Resolver<Array<ResolversTypes['Channel']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currencyCode?: Resolver<ResolversTypes['CurrencyCode'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  facetValues?: Resolver<Array<ResolversTypes['FacetValue']>, ParentType, ContextType>;
  featuredAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  languageCode?: Resolver<ResolversTypes['LanguageCode'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['ProductOption']>, ParentType, ContextType>;
  outOfStockThreshold?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  priceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  prices?: Resolver<Array<ResolversTypes['ProductVariantPrice']>, ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  sku?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stockAllocated?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stockLevel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stockLevels?: Resolver<Array<ResolversTypes['StockLevel']>, ParentType, ContextType>;
  stockMovements?: Resolver<ResolversTypes['StockMovementList'], ParentType, ContextType, Partial<ProductVariantStockMovementsArgs>>;
  stockOnHand?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  taxCategory?: Resolver<ResolversTypes['TaxCategory'], ParentType, ContextType>;
  taxRateApplied?: Resolver<ResolversTypes['TaxRate'], ParentType, ContextType>;
  trackInventory?: Resolver<ResolversTypes['GlobalFlag'], ParentType, ContextType>;
  translations?: Resolver<Array<ResolversTypes['ProductVariantTranslation']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  useGlobalOutOfStockThreshold?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductVariantListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductVariantList'] = ResolversParentTypes['ProductVariantList']> = {
  items?: Resolver<Array<ResolversTypes['ProductVariant']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductVariantPriceResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductVariantPrice'] = ResolversParentTypes['ProductVariantPrice']> = {
  currencyCode?: Resolver<ResolversTypes['CurrencyCode'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
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

export type QuantityTooGreatErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['QuantityTooGreatError'] = ResolversParentTypes['QuantityTooGreatError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  activeAdministrator?: Resolver<Maybe<ResolversTypes['Administrator']>, ParentType, ContextType>;
  activeChannel?: Resolver<ResolversTypes['Channel'], ParentType, ContextType>;
  activeSeasons?: Resolver<Array<ResolversTypes['Season']>, ParentType, ContextType>;
  administrator?: Resolver<Maybe<ResolversTypes['Administrator']>, ParentType, ContextType, RequireFields<QueryAdministratorArgs, 'id'>>;
  administrators?: Resolver<ResolversTypes['AdministratorList'], ParentType, ContextType, Partial<QueryAdministratorsArgs>>;
  apiKey?: Resolver<Maybe<ResolversTypes['ApiKey']>, ParentType, ContextType, RequireFields<QueryApiKeyArgs, 'id'>>;
  apiKeys?: Resolver<ResolversTypes['ApiKeyList'], ParentType, ContextType, Partial<QueryApiKeysArgs>>;
  asset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType, RequireFields<QueryAssetArgs, 'id'>>;
  assets?: Resolver<ResolversTypes['AssetList'], ParentType, ContextType, Partial<QueryAssetsArgs>>;
  banner?: Resolver<Maybe<ResolversTypes['Banner']>, ParentType, ContextType, RequireFields<QueryBannerArgs, 'id'>>;
  bannerBySlug?: Resolver<Maybe<ResolversTypes['Banner']>, ParentType, ContextType, RequireFields<QueryBannerBySlugArgs, 'slug'>>;
  bannerType?: Resolver<Maybe<ResolversTypes['BannerType']>, ParentType, ContextType, RequireFields<QueryBannerTypeArgs, 'id'>>;
  bannerTypes?: Resolver<ResolversTypes['BannerTypeList'], ParentType, ContextType, Partial<QueryBannerTypesArgs>>;
  banners?: Resolver<ResolversTypes['BannerList'], ParentType, ContextType, Partial<QueryBannersArgs>>;
  categories?: Resolver<ResolversTypes['CategoryList'], ParentType, ContextType, Partial<QueryCategoriesArgs>>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, Partial<QueryCategoryArgs>>;
  categoryTree?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, Partial<QueryCategoryTreeArgs>>;
  categoryType?: Resolver<Maybe<ResolversTypes['CategoryType']>, ParentType, ContextType, Partial<QueryCategoryTypeArgs>>;
  categoryTypes?: Resolver<ResolversTypes['CategoryTypeList'], ParentType, ContextType, Partial<QueryCategoryTypesArgs>>;
  channel?: Resolver<Maybe<ResolversTypes['Channel']>, ParentType, ContextType, RequireFields<QueryChannelArgs, 'id'>>;
  channels?: Resolver<ResolversTypes['ChannelList'], ParentType, ContextType, Partial<QueryChannelsArgs>>;
  collection?: Resolver<Maybe<ResolversTypes['Collection']>, ParentType, ContextType, Partial<QueryCollectionArgs>>;
  collectionFilters?: Resolver<Array<ResolversTypes['ConfigurableOperationDefinition']>, ParentType, ContextType>;
  collections?: Resolver<ResolversTypes['CollectionList'], ParentType, ContextType, Partial<QueryCollectionsArgs>>;
  countries?: Resolver<ResolversTypes['CountryList'], ParentType, ContextType, Partial<QueryCountriesArgs>>;
  country?: Resolver<Maybe<ResolversTypes['Country']>, ParentType, ContextType, RequireFields<QueryCountryArgs, 'id'>>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryCustomerArgs, 'id'>>;
  customerGroup?: Resolver<Maybe<ResolversTypes['CustomerGroup']>, ParentType, ContextType, RequireFields<QueryCustomerGroupArgs, 'id'>>;
  customerGroups?: Resolver<ResolversTypes['CustomerGroupList'], ParentType, ContextType, Partial<QueryCustomerGroupsArgs>>;
  customers?: Resolver<ResolversTypes['CustomerList'], ParentType, ContextType, Partial<QueryCustomersArgs>>;
  dashboardMetricSummary?: Resolver<Array<ResolversTypes['DashboardMetricSummary']>, ParentType, ContextType, Partial<QueryDashboardMetricSummaryArgs>>;
  day?: Resolver<Maybe<ResolversTypes['Day']>, ParentType, ContextType, RequireFields<QueryDayArgs, 'id'>>;
  days?: Resolver<ResolversTypes['DayList'], ParentType, ContextType, Partial<QueryDaysArgs>>;
  deliveryMethod?: Resolver<Maybe<ResolversTypes['DeliveryMethod']>, ParentType, ContextType, RequireFields<QueryDeliveryMethodArgs, 'id'>>;
  deliveryMethods?: Resolver<ResolversTypes['DeliveryMethodList'], ParentType, ContextType, Partial<QueryDeliveryMethodsArgs>>;
  eligibleShippingMethodsForDraftOrder?: Resolver<Array<ResolversTypes['ShippingMethodQuote']>, ParentType, ContextType, RequireFields<QueryEligibleShippingMethodsForDraftOrderArgs, 'orderId'>>;
  entityDuplicators?: Resolver<Array<ResolversTypes['EntityDuplicatorDefinition']>, ParentType, ContextType>;
  facet?: Resolver<Maybe<ResolversTypes['Facet']>, ParentType, ContextType, RequireFields<QueryFacetArgs, 'id'>>;
  facetValue?: Resolver<Maybe<ResolversTypes['FacetValue']>, ParentType, ContextType, RequireFields<QueryFacetValueArgs, 'id'>>;
  facetValues?: Resolver<ResolversTypes['FacetValueList'], ParentType, ContextType, Partial<QueryFacetValuesArgs>>;
  facets?: Resolver<ResolversTypes['FacetList'], ParentType, ContextType, Partial<QueryFacetsArgs>>;
  fulfillmentHandlers?: Resolver<Array<ResolversTypes['ConfigurableOperationDefinition']>, ParentType, ContextType>;
  getAllProducts?: Resolver<ResolversTypes['FilteredProductList'], ParentType, ContextType, Partial<QueryGetAllProductsArgs>>;
  getFilters?: Resolver<ResolversTypes['AggregatedMetadata'], ParentType, ContextType, RequireFields<QueryGetFiltersArgs, 'slug' | 'type'>>;
  getSettingsStoreValue?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryGetSettingsStoreValueArgs, 'key'>>;
  getSettingsStoreValues?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryGetSettingsStoreValuesArgs, 'keys'>>;
  globalSettings?: Resolver<ResolversTypes['GlobalSettings'], ParentType, ContextType>;
  importErrorReport?: Resolver<Array<ResolversTypes['ImportErrorRow']>, ParentType, ContextType, RequireFields<QueryImportErrorReportArgs, 'jobId'>>;
  importJob?: Resolver<Maybe<ResolversTypes['ImportJob']>, ParentType, ContextType, RequireFields<QueryImportJobArgs, 'id'>>;
  importJobLogs?: Resolver<Array<ResolversTypes['ImportLog']>, ParentType, ContextType, RequireFields<QueryImportJobLogsArgs, 'jobId'>>;
  importJobs?: Resolver<ResolversTypes['ImportJobList'], ParentType, ContextType, Partial<QueryImportJobsArgs>>;
  job?: Resolver<Maybe<ResolversTypes['Job']>, ParentType, ContextType, RequireFields<QueryJobArgs, 'jobId'>>;
  jobBufferSize?: Resolver<Array<ResolversTypes['JobBufferSize']>, ParentType, ContextType, Partial<QueryJobBufferSizeArgs>>;
  jobQueues?: Resolver<Array<ResolversTypes['JobQueue']>, ParentType, ContextType>;
  jobs?: Resolver<ResolversTypes['JobList'], ParentType, ContextType, Partial<QueryJobsArgs>>;
  jobsById?: Resolver<Array<ResolversTypes['Job']>, ParentType, ContextType, RequireFields<QueryJobsByIdArgs, 'jobIds'>>;
  label?: Resolver<Maybe<ResolversTypes['Label']>, ParentType, ContextType, RequireFields<QueryLabelArgs, 'id'>>;
  labels?: Resolver<ResolversTypes['LabelList'], ParentType, ContextType, Partial<QueryLabelsArgs>>;
  me?: Resolver<Maybe<ResolversTypes['CurrentUser']>, ParentType, ContextType>;
  meiliMonitoring?: Resolver<ResolversTypes['MeiliMonitoringResult'], ParentType, ContextType>;
  meiliSettings?: Resolver<ResolversTypes['MeiliSettingsResult'], ParentType, ContextType>;
  models?: Resolver<ResolversTypes['ModelList'], ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<QueryOrderArgs, 'id'>>;
  orders?: Resolver<ResolversTypes['OrderList'], ParentType, ContextType, Partial<QueryOrdersArgs>>;
  paymentMethod?: Resolver<Maybe<ResolversTypes['PaymentMethod']>, ParentType, ContextType, RequireFields<QueryPaymentMethodArgs, 'id'>>;
  paymentMethodEligibilityCheckers?: Resolver<Array<ResolversTypes['ConfigurableOperationDefinition']>, ParentType, ContextType>;
  paymentMethodHandlers?: Resolver<Array<ResolversTypes['ConfigurableOperationDefinition']>, ParentType, ContextType>;
  paymentMethods?: Resolver<ResolversTypes['PaymentMethodList'], ParentType, ContextType, Partial<QueryPaymentMethodsArgs>>;
  pendingSearchIndexUpdates?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  previewCollectionVariants?: Resolver<ResolversTypes['ProductVariantList'], ParentType, ContextType, RequireFields<QueryPreviewCollectionVariantsArgs, 'input'>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, Partial<QueryProductArgs>>;
  productOption?: Resolver<Maybe<ResolversTypes['ProductOption']>, ParentType, ContextType, RequireFields<QueryProductOptionArgs, 'id'>>;
  productOptionGroup?: Resolver<Maybe<ResolversTypes['ProductOptionGroup']>, ParentType, ContextType, RequireFields<QueryProductOptionGroupArgs, 'id'>>;
  productOptionGroups?: Resolver<ResolversTypes['ProductOptionGroupList'], ParentType, ContextType, Partial<QueryProductOptionGroupsArgs>>;
  productOptions?: Resolver<ResolversTypes['ProductOptionList'], ParentType, ContextType, Partial<QueryProductOptionsArgs>>;
  productSeasons?: Resolver<Array<ResolversTypes['Season']>, ParentType, ContextType, RequireFields<QueryProductSeasonsArgs, 'productId'>>;
  productVariant?: Resolver<Maybe<ResolversTypes['ProductVariant']>, ParentType, ContextType, RequireFields<QueryProductVariantArgs, 'id'>>;
  productVariants?: Resolver<ResolversTypes['ProductVariantList'], ParentType, ContextType, Partial<QueryProductVariantsArgs>>;
  products?: Resolver<ResolversTypes['ProductList'], ParentType, ContextType, Partial<QueryProductsArgs>>;
  promotion?: Resolver<Maybe<ResolversTypes['Promotion']>, ParentType, ContextType, RequireFields<QueryPromotionArgs, 'id'>>;
  promotionActions?: Resolver<Array<ResolversTypes['ConfigurableOperationDefinition']>, ParentType, ContextType>;
  promotionConditions?: Resolver<Array<ResolversTypes['ConfigurableOperationDefinition']>, ParentType, ContextType>;
  promotions?: Resolver<ResolversTypes['PromotionList'], ParentType, ContextType, Partial<QueryPromotionsArgs>>;
  province?: Resolver<Maybe<ResolversTypes['Province']>, ParentType, ContextType, RequireFields<QueryProvinceArgs, 'id'>>;
  provinces?: Resolver<ResolversTypes['ProvinceList'], ParentType, ContextType, Partial<QueryProvincesArgs>>;
  refreshToken?: Resolver<ResolversTypes['RefreshTokenResponse'], ParentType, ContextType, RequireFields<QueryRefreshTokenArgs, 'refreshToken'>>;
  role?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<QueryRoleArgs, 'id'>>;
  roles?: Resolver<ResolversTypes['RoleList'], ParentType, ContextType, Partial<QueryRolesArgs>>;
  scheduledTasks?: Resolver<Array<ResolversTypes['ScheduledTask']>, ParentType, ContextType>;
  search?: Resolver<ResolversTypes['SearchResponse'], ParentType, ContextType, RequireFields<QuerySearchArgs, 'input'>>;
  season?: Resolver<Maybe<ResolversTypes['Season']>, ParentType, ContextType, RequireFields<QuerySeasonArgs, 'id'>>;
  seasonBySlug?: Resolver<Maybe<ResolversTypes['Season']>, ParentType, ContextType, RequireFields<QuerySeasonBySlugArgs, 'slug'>>;
  seasons?: Resolver<ResolversTypes['SeasonList'], ParentType, ContextType, Partial<QuerySeasonsArgs>>;
  seller?: Resolver<Maybe<ResolversTypes['Seller']>, ParentType, ContextType, RequireFields<QuerySellerArgs, 'id'>>;
  sellers?: Resolver<ResolversTypes['SellerList'], ParentType, ContextType, Partial<QuerySellersArgs>>;
  settingsStoreFieldDefinitions?: Resolver<Array<ResolversTypes['SettingsStoreFieldDefinition']>, ParentType, ContextType>;
  shippingCalculators?: Resolver<Array<ResolversTypes['ConfigurableOperationDefinition']>, ParentType, ContextType>;
  shippingEligibilityCheckers?: Resolver<Array<ResolversTypes['ConfigurableOperationDefinition']>, ParentType, ContextType>;
  shippingMethod?: Resolver<Maybe<ResolversTypes['ShippingMethod']>, ParentType, ContextType, RequireFields<QueryShippingMethodArgs, 'id'>>;
  shippingMethods?: Resolver<ResolversTypes['ShippingMethodList'], ParentType, ContextType, Partial<QueryShippingMethodsArgs>>;
  slugForEntity?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QuerySlugForEntityArgs, 'input'>>;
  stockLocation?: Resolver<Maybe<ResolversTypes['StockLocation']>, ParentType, ContextType, RequireFields<QueryStockLocationArgs, 'id'>>;
  stockLocations?: Resolver<ResolversTypes['StockLocationList'], ParentType, ContextType, Partial<QueryStockLocationsArgs>>;
  tag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<QueryTagArgs, 'id'>>;
  tags?: Resolver<ResolversTypes['TagList'], ParentType, ContextType, Partial<QueryTagsArgs>>;
  taxCategories?: Resolver<ResolversTypes['TaxCategoryList'], ParentType, ContextType, Partial<QueryTaxCategoriesArgs>>;
  taxCategory?: Resolver<Maybe<ResolversTypes['TaxCategory']>, ParentType, ContextType, RequireFields<QueryTaxCategoryArgs, 'id'>>;
  taxRate?: Resolver<Maybe<ResolversTypes['TaxRate']>, ParentType, ContextType, RequireFields<QueryTaxRateArgs, 'id'>>;
  taxRates?: Resolver<ResolversTypes['TaxRateList'], ParentType, ContextType, Partial<QueryTaxRatesArgs>>;
  testContext?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  testEligibleShippingMethods?: Resolver<Array<ResolversTypes['ShippingMethodQuote']>, ParentType, ContextType, RequireFields<QueryTestEligibleShippingMethodsArgs, 'input'>>;
  testShippingMethod?: Resolver<ResolversTypes['TestShippingMethodResult'], ParentType, ContextType, RequireFields<QueryTestShippingMethodArgs, 'input'>>;
  variantSoldCountsForPromotion?: Resolver<Array<ResolversTypes['VariantSoldCount']>, ParentType, ContextType, RequireFields<QueryVariantSoldCountsForPromotionArgs, 'promotionId' | 'variantIds'>>;
  worker?: Resolver<Maybe<ResolversTypes['Worker']>, ParentType, ContextType, RequireFields<QueryWorkerArgs, 'id'>>;
  workers?: Resolver<ResolversTypes['WorkerList'], ParentType, ContextType, Partial<QueryWorkersArgs>>;
  zone?: Resolver<Maybe<ResolversTypes['Zone']>, ParentType, ContextType, RequireFields<QueryZoneArgs, 'id'>>;
  zones?: Resolver<ResolversTypes['ZoneList'], ParentType, ContextType, Partial<QueryZonesArgs>>;
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

export type RefundAmountErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['RefundAmountError'] = ResolversParentTypes['RefundAmountError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  maximumRefundable?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RefundLineResolvers<ContextType = any, ParentType extends ResolversParentTypes['RefundLine'] = ResolversParentTypes['RefundLine']> = {
  orderLine?: Resolver<ResolversTypes['OrderLine'], ParentType, ContextType>;
  orderLineId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  refund?: Resolver<ResolversTypes['Refund'], ParentType, ContextType>;
  refundId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type RefundOrderResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RefundOrderResult'] = ResolversParentTypes['RefundOrderResult']> = {
  __resolveType: TypeResolveFn<'AlreadyRefundedError' | 'MultipleOrderError' | 'NothingToRefundError' | 'OrderStateTransitionError' | 'PaymentOrderMismatchError' | 'QuantityTooGreatError' | 'Refund' | 'RefundAmountError' | 'RefundOrderStateError' | 'RefundStateTransitionError', ParentType, ContextType>;
};

export type RefundOrderStateErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['RefundOrderStateError'] = ResolversParentTypes['RefundOrderStateError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderState?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RefundPaymentIdMissingErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['RefundPaymentIdMissingError'] = ResolversParentTypes['RefundPaymentIdMissingError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RefundStateTransitionErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['RefundStateTransitionError'] = ResolversParentTypes['RefundStateTransitionError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  fromState?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  toState?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  transitionError?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type ReleaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Release'] = ResolversParentTypes['Release']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productVariant?: Resolver<ResolversTypes['ProductVariant'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['StockMovementType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RemoveFacetFromChannelResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemoveFacetFromChannelResult'] = ResolversParentTypes['RemoveFacetFromChannelResult']> = {
  __resolveType: TypeResolveFn<'Facet' | 'FacetInUseError', ParentType, ContextType>;
};

export type RemoveOptionGroupFromProductResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemoveOptionGroupFromProductResult'] = ResolversParentTypes['RemoveOptionGroupFromProductResult']> = {
  __resolveType: TypeResolveFn<'Product' | 'ProductOptionInUseError', ParentType, ContextType>;
};

export type RemoveOrderItemsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemoveOrderItemsResult'] = ResolversParentTypes['RemoveOrderItemsResult']> = {
  __resolveType: TypeResolveFn<'Order' | 'OrderInterceptorError' | 'OrderModificationError', ParentType, ContextType>;
};

export type RemoveProductOptionGroupFromChannelResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemoveProductOptionGroupFromChannelResult'] = ResolversParentTypes['RemoveProductOptionGroupFromChannelResult']> = {
  __resolveType: TypeResolveFn<'ProductOptionGroup' | 'ProductOptionGroupInUseError', ParentType, ContextType>;
};

export type ReturnResolvers<ContextType = any, ParentType extends ResolversParentTypes['Return'] = ResolversParentTypes['Return']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productVariant?: Resolver<ResolversTypes['ProductVariant'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['StockMovementType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type RotateApiKeyResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['RotateApiKeyResult'] = ResolversParentTypes['RotateApiKeyResult']> = {
  apiKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SaleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Sale'] = ResolversParentTypes['Sale']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productVariant?: Resolver<ResolversTypes['ProductVariant'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['StockMovementType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
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

export type ScheduledTaskResolvers<ContextType = any, ParentType extends ResolversParentTypes['ScheduledTask'] = ResolversParentTypes['ScheduledTask']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isRunning?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastExecutedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  lastResult?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  nextExecutionAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  schedule?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scheduleDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  channelIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  collectionIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  currencyCode?: Resolver<ResolversTypes['CurrencyCode'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  facetIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  facetValueIds?: Resolver<Array<ResolversTypes['ID']>, ParentType, ContextType>;
  inStock?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['SearchResultPrice'], ParentType, ContextType>;
  priceWithTax?: Resolver<ResolversTypes['SearchResultPrice'], ParentType, ContextType>;
  productAsset?: Resolver<Maybe<ResolversTypes['SearchResultAsset']>, ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productVariantAsset?: Resolver<Maybe<ResolversTypes['SearchResultAsset']>, ParentType, ContextType>;
  productVariantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productVariantName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
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

export type SearchTermStatResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchTermStat'] = ResolversParentTypes['SearchTermStat']> = {
  count?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  term?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type SeasonListResolvers<ContextType = any, ParentType extends ResolversParentTypes['SeasonList'] = ResolversParentTypes['SeasonList']> = {
  items?: Resolver<Array<ResolversTypes['Season']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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

export type SellerListResolvers<ContextType = any, ParentType extends ResolversParentTypes['SellerList'] = ResolversParentTypes['SellerList']> = {
  items?: Resolver<Array<ResolversTypes['Seller']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ServerConfigResolvers<ContextType = any, ParentType extends ResolversParentTypes['ServerConfig'] = ResolversParentTypes['ServerConfig']> = {
  customFieldConfig?: Resolver<ResolversTypes['CustomFields'], ParentType, ContextType>;
  entityCustomFields?: Resolver<Array<ResolversTypes['EntityCustomFields']>, ParentType, ContextType>;
  moneyStrategyPrecision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  orderProcess?: Resolver<Array<ResolversTypes['OrderProcessState']>, ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['PermissionDefinition']>, ParentType, ContextType>;
  permittedAssetTypes?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
};

export type SetCustomerForDraftOrderResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetCustomerForDraftOrderResult'] = ResolversParentTypes['SetCustomerForDraftOrderResult']> = {
  __resolveType: TypeResolveFn<'EmailAddressConflictError' | 'Order', ParentType, ContextType>;
};

export type SetOrderShippingMethodResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetOrderShippingMethodResult'] = ResolversParentTypes['SetOrderShippingMethodResult']> = {
  __resolveType: TypeResolveFn<'IneligibleShippingMethodError' | 'NoActiveOrderError' | 'Order' | 'OrderModificationError', ParentType, ContextType>;
};

export type SetSettingsStoreValueResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetSettingsStoreValueResult'] = ResolversParentTypes['SetSettingsStoreValueResult']> = {
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  result?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type SettingsStoreFieldDefinitionResolvers<ContextType = any, ParentType extends ResolversParentTypes['SettingsStoreFieldDefinition'] = ResolversParentTypes['SettingsStoreFieldDefinition']> = {
  currentValue?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  readonly?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  scopeType?: Resolver<ResolversTypes['SettingsStoreScopeType'], ParentType, ContextType>;
};

export type SettlePaymentErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['SettlePaymentError'] = ResolversParentTypes['SettlePaymentError']> = {
  errorCode?: Resolver<ResolversTypes['ErrorCode'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentErrorMessage?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SettlePaymentResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SettlePaymentResult'] = ResolversParentTypes['SettlePaymentResult']> = {
  __resolveType: TypeResolveFn<'OrderStateTransitionError' | 'Payment' | 'PaymentStateTransitionError' | 'SettlePaymentError', ParentType, ContextType>;
};

export type SettleRefundResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SettleRefundResult'] = ResolversParentTypes['SettleRefundResult']> = {
  __resolveType: TypeResolveFn<'Refund' | 'RefundStateTransitionError', ParentType, ContextType>;
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

export type StockAdjustmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['StockAdjustment'] = ResolversParentTypes['StockAdjustment']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productVariant?: Resolver<ResolversTypes['ProductVariant'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['StockMovementType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StockLevelResolvers<ContextType = any, ParentType extends ResolversParentTypes['StockLevel'] = ResolversParentTypes['StockLevel']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  stockAllocated?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  stockLocation?: Resolver<ResolversTypes['StockLocation'], ParentType, ContextType>;
  stockLocationId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  stockOnHand?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StockLocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['StockLocation'] = ResolversParentTypes['StockLocation']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  customFields?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StockLocationListResolvers<ContextType = any, ParentType extends ResolversParentTypes['StockLocationList'] = ResolversParentTypes['StockLocationList']> = {
  items?: Resolver<Array<ResolversTypes['StockLocation']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StockMovementResolvers<ContextType = any, ParentType extends ResolversParentTypes['StockMovement'] = ResolversParentTypes['StockMovement']> = {
  __resolveType: TypeResolveFn<'Allocation' | 'Cancellation' | 'Release' | 'Return' | 'Sale' | 'StockAdjustment', ParentType, ContextType>;
};

export type StockMovementItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['StockMovementItem'] = ResolversParentTypes['StockMovementItem']> = {
  __resolveType: TypeResolveFn<'Allocation' | 'Cancellation' | 'Release' | 'Return' | 'Sale' | 'StockAdjustment', ParentType, ContextType>;
};

export type StockMovementListResolvers<ContextType = any, ParentType extends ResolversParentTypes['StockMovementList'] = ResolversParentTypes['StockMovementList']> = {
  items?: Resolver<Array<ResolversTypes['StockMovementItem']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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

export type TaxCategoryListResolvers<ContextType = any, ParentType extends ResolversParentTypes['TaxCategoryList'] = ResolversParentTypes['TaxCategoryList']> = {
  items?: Resolver<Array<ResolversTypes['TaxCategory']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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

export type TestShippingMethodQuoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['TestShippingMethodQuote'] = ResolversParentTypes['TestShippingMethodQuote']> = {
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  priceWithTax?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
};

export type TestShippingMethodResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TestShippingMethodResult'] = ResolversParentTypes['TestShippingMethodResult']> = {
  eligible?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  quote?: Resolver<Maybe<ResolversTypes['TestShippingMethodQuote']>, ParentType, ContextType>;
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

export type TransitionFulfillmentToStateResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransitionFulfillmentToStateResult'] = ResolversParentTypes['TransitionFulfillmentToStateResult']> = {
  __resolveType: TypeResolveFn<'Fulfillment' | 'FulfillmentStateTransitionError', ParentType, ContextType>;
};

export type TransitionOrderToStateResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransitionOrderToStateResult'] = ResolversParentTypes['TransitionOrderToStateResult']> = {
  __resolveType: TypeResolveFn<'Order' | 'OrderStateTransitionError', ParentType, ContextType>;
};

export type TransitionPaymentToStateResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TransitionPaymentToStateResult'] = ResolversParentTypes['TransitionPaymentToStateResult']> = {
  __resolveType: TypeResolveFn<'Payment' | 'PaymentStateTransitionError', ParentType, ContextType>;
};

export type UpdateChannelResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateChannelResult'] = ResolversParentTypes['UpdateChannelResult']> = {
  __resolveType: TypeResolveFn<'Channel' | 'LanguageNotAvailableError', ParentType, ContextType>;
};

export type UpdateCustomerResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateCustomerResult'] = ResolversParentTypes['UpdateCustomerResult']> = {
  __resolveType: TypeResolveFn<'Customer' | 'EmailAddressConflictError', ParentType, ContextType>;
};

export type UpdateGlobalSettingsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateGlobalSettingsResult'] = ResolversParentTypes['UpdateGlobalSettingsResult']> = {
  __resolveType: TypeResolveFn<'ChannelDefaultLanguageError' | 'GlobalSettings', ParentType, ContextType>;
};

export type UpdateOrderItemErrorResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateOrderItemErrorResult'] = ResolversParentTypes['UpdateOrderItemErrorResult']> = {
  __resolveType: TypeResolveFn<'InsufficientStockError' | 'NegativeQuantityError' | 'OrderInterceptorError' | 'OrderLimitError' | 'OrderModificationError', ParentType, ContextType>;
};

export type UpdateOrderItemsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateOrderItemsResult'] = ResolversParentTypes['UpdateOrderItemsResult']> = {
  __resolveType: TypeResolveFn<'InsufficientStockError' | 'NegativeQuantityError' | 'Order' | 'OrderInterceptorError' | 'OrderLimitError' | 'OrderModificationError', ParentType, ContextType>;
};

export type UpdatePromotionResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdatePromotionResult'] = ResolversParentTypes['UpdatePromotionResult']> = {
  __resolveType: TypeResolveFn<'MissingConditionsError' | 'Promotion', ParentType, ContextType>;
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

export type VariantSoldCountResolvers<ContextType = any, ParentType extends ResolversParentTypes['VariantSoldCount'] = ResolversParentTypes['VariantSoldCount']> = {
  isExhausted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  remaining?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  soldCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  variantId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type WorkerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Worker'] = ResolversParentTypes['Worker']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  erpCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  externalCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['WorkerRole'], ParentType, ContextType>;
  sort?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  vehicle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  vehiclePlate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WorkerListResolvers<ContextType = any, ParentType extends ResolversParentTypes['WorkerList'] = ResolversParentTypes['WorkerList']> = {
  items?: Resolver<Array<ResolversTypes['Worker']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type ZoneListResolvers<ContextType = any, ParentType extends ResolversParentTypes['ZoneList'] = ResolversParentTypes['ZoneList']> = {
  items?: Resolver<Array<ResolversTypes['Zone']>, ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AddFulfillmentToOrderResult?: AddFulfillmentToOrderResultResolvers<ContextType>;
  AddManualPaymentToOrderResult?: AddManualPaymentToOrderResultResolvers<ContextType>;
  Address?: AddressResolvers<ContextType>;
  AddressCustomFields?: AddressCustomFieldsResolvers<ContextType>;
  Adjustment?: AdjustmentResolvers<ContextType>;
  Administrator?: AdministratorResolvers<ContextType>;
  AdministratorList?: AdministratorListResolvers<ContextType>;
  AggregatedMetadata?: AggregatedMetadataResolvers<ContextType>;
  Allocation?: AllocationResolvers<ContextType>;
  AlreadyRefundedError?: AlreadyRefundedErrorResolvers<ContextType>;
  ApiKey?: ApiKeyResolvers<ContextType>;
  ApiKeyList?: ApiKeyListResolvers<ContextType>;
  ApiKeyTranslation?: ApiKeyTranslationResolvers<ContextType>;
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
  CancelActiveOrderError?: CancelActiveOrderErrorResolvers<ContextType>;
  CancelOrderResult?: CancelOrderResultResolvers<ContextType>;
  CancelPaymentError?: CancelPaymentErrorResolvers<ContextType>;
  CancelPaymentResult?: CancelPaymentResultResolvers<ContextType>;
  Cancellation?: CancellationResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  CategoryList?: CategoryListResolvers<ContextType>;
  CategoryTranslation?: CategoryTranslationResolvers<ContextType>;
  CategoryType?: CategoryTypeResolvers<ContextType>;
  CategoryTypeList?: CategoryTypeListResolvers<ContextType>;
  CategoryTypeTranslation?: CategoryTypeTranslationResolvers<ContextType>;
  Channel?: ChannelResolvers<ContextType>;
  ChannelCustomFields?: ChannelCustomFieldsResolvers<ContextType>;
  ChannelDefaultLanguageError?: ChannelDefaultLanguageErrorResolvers<ContextType>;
  ChannelList?: ChannelListResolvers<ContextType>;
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
  CreateApiKeyResult?: CreateApiKeyResultResolvers<ContextType>;
  CreateAssetResult?: CreateAssetResultResolvers<ContextType>;
  CreateChannelResult?: CreateChannelResultResolvers<ContextType>;
  CreateCustomerResult?: CreateCustomerResultResolvers<ContextType>;
  CreateFulfillmentError?: CreateFulfillmentErrorResolvers<ContextType>;
  CreatePromotionResult?: CreatePromotionResultResolvers<ContextType>;
  CurrentUser?: CurrentUserResolvers<ContextType>;
  CurrentUserChannel?: CurrentUserChannelResolvers<ContextType>;
  CustomField?: CustomFieldResolvers<ContextType>;
  CustomFieldConfig?: CustomFieldConfigResolvers<ContextType>;
  CustomFields?: CustomFieldsResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  CustomerCustomFields?: CustomerCustomFieldsResolvers<ContextType>;
  CustomerGroup?: CustomerGroupResolvers<ContextType>;
  CustomerGroupList?: CustomerGroupListResolvers<ContextType>;
  CustomerList?: CustomerListResolvers<ContextType>;
  DashboardMetricSummary?: DashboardMetricSummaryResolvers<ContextType>;
  DashboardMetricSummaryEntry?: DashboardMetricSummaryEntryResolvers<ContextType>;
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
  DuplicateEntityError?: DuplicateEntityErrorResolvers<ContextType>;
  DuplicateEntityResult?: DuplicateEntityResultResolvers<ContextType>;
  DuplicateEntitySuccess?: DuplicateEntitySuccessResolvers<ContextType>;
  EmailAddressConflictError?: EmailAddressConflictErrorResolvers<ContextType>;
  EmptyOrderLineSelectionError?: EmptyOrderLineSelectionErrorResolvers<ContextType>;
  EntityCustomFields?: EntityCustomFieldsResolvers<ContextType>;
  EntityDuplicatorDefinition?: EntityDuplicatorDefinitionResolvers<ContextType>;
  ErrorResult?: ErrorResultResolvers<ContextType>;
  Facet?: FacetResolvers<ContextType>;
  FacetInUseError?: FacetInUseErrorResolvers<ContextType>;
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
  FulfillmentStateTransitionError?: FulfillmentStateTransitionErrorResolvers<ContextType>;
  GlobalSettings?: GlobalSettingsResolvers<ContextType>;
  GuestCheckoutError?: GuestCheckoutErrorResolvers<ContextType>;
  HistoryEntry?: HistoryEntryResolvers<ContextType>;
  HistoryEntryList?: HistoryEntryListResolvers<ContextType>;
  ImageUploadResult?: ImageUploadResultResolvers<ContextType>;
  ImportErrorRow?: ImportErrorRowResolvers<ContextType>;
  ImportInfo?: ImportInfoResolvers<ContextType>;
  ImportJob?: ImportJobResolvers<ContextType>;
  ImportJobList?: ImportJobListResolvers<ContextType>;
  ImportLog?: ImportLogResolvers<ContextType>;
  IneligibleShippingMethodError?: IneligibleShippingMethodErrorResolvers<ContextType>;
  InsufficientStockError?: InsufficientStockErrorResolvers<ContextType>;
  InsufficientStockOnHandError?: InsufficientStockOnHandErrorResolvers<ContextType>;
  IntCustomFieldConfig?: IntCustomFieldConfigResolvers<ContextType>;
  IntStructFieldConfig?: IntStructFieldConfigResolvers<ContextType>;
  InvalidCredentialsError?: InvalidCredentialsErrorResolvers<ContextType>;
  InvalidFulfillmentHandlerError?: InvalidFulfillmentHandlerErrorResolvers<ContextType>;
  ItemsAlreadyFulfilledError?: ItemsAlreadyFulfilledErrorResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Job?: JobResolvers<ContextType>;
  JobBufferSize?: JobBufferSizeResolvers<ContextType>;
  JobList?: JobListResolvers<ContextType>;
  JobQueue?: JobQueueResolvers<ContextType>;
  Label?: LabelResolvers<ContextType>;
  LabelList?: LabelListResolvers<ContextType>;
  LabelTranslation?: LabelTranslationResolvers<ContextType>;
  LanguageNotAvailableError?: LanguageNotAvailableErrorResolvers<ContextType>;
  LocaleStringCustomFieldConfig?: LocaleStringCustomFieldConfigResolvers<ContextType>;
  LocaleTextCustomFieldConfig?: LocaleTextCustomFieldConfigResolvers<ContextType>;
  LocalizedString?: LocalizedStringResolvers<ContextType>;
  ManualPaymentStateError?: ManualPaymentStateErrorResolvers<ContextType>;
  MeiliAnalytics?: MeiliAnalyticsResolvers<ContextType>;
  MeiliHealthStatus?: MeiliHealthStatusResolvers<ContextType>;
  MeiliIndexStats?: MeiliIndexStatsResolvers<ContextType>;
  MeiliMonitoringResult?: MeiliMonitoringResultResolvers<ContextType>;
  MeiliRecentTask?: MeiliRecentTaskResolvers<ContextType>;
  MeiliSettingsResult?: MeiliSettingsResultResolvers<ContextType>;
  MeiliSyncProgress?: MeiliSyncProgressResolvers<ContextType>;
  MeiliTaskStats?: MeiliTaskStatsResolvers<ContextType>;
  MimeTypeError?: MimeTypeErrorResolvers<ContextType>;
  MissingConditionsError?: MissingConditionsErrorResolvers<ContextType>;
  Model?: ModelResolvers<ContextType>;
  ModelList?: ModelListResolvers<ContextType>;
  ModifyOrderResult?: ModifyOrderResultResolvers<ContextType>;
  Money?: GraphQLScalarType;
  MultipleOrderError?: MultipleOrderErrorResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NativeAuthStrategyError?: NativeAuthStrategyErrorResolvers<ContextType>;
  NativeAuthenticationResult?: NativeAuthenticationResultResolvers<ContextType>;
  NegativeQuantityError?: NegativeQuantityErrorResolvers<ContextType>;
  NoActiveOrderError?: NoActiveOrderErrorResolvers<ContextType>;
  NoChangesSpecifiedError?: NoChangesSpecifiedErrorResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  NothingToRefundError?: NothingToRefundErrorResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderAddress?: OrderAddressResolvers<ContextType>;
  OrderCustomFields?: OrderCustomFieldsResolvers<ContextType>;
  OrderInterceptorError?: OrderInterceptorErrorResolvers<ContextType>;
  OrderLimitError?: OrderLimitErrorResolvers<ContextType>;
  OrderLine?: OrderLineResolvers<ContextType>;
  OrderList?: OrderListResolvers<ContextType>;
  OrderModification?: OrderModificationResolvers<ContextType>;
  OrderModificationError?: OrderModificationErrorResolvers<ContextType>;
  OrderModificationLine?: OrderModificationLineResolvers<ContextType>;
  OrderModificationStateError?: OrderModificationStateErrorResolvers<ContextType>;
  OrderProcessState?: OrderProcessStateResolvers<ContextType>;
  OrderStateTransitionError?: OrderStateTransitionErrorResolvers<ContextType>;
  OrderTaxSummary?: OrderTaxSummaryResolvers<ContextType>;
  PaginatedList?: PaginatedListResolvers<ContextType>;
  Payment?: PaymentResolvers<ContextType>;
  PaymentMethod?: PaymentMethodResolvers<ContextType>;
  PaymentMethodList?: PaymentMethodListResolvers<ContextType>;
  PaymentMethodMissingError?: PaymentMethodMissingErrorResolvers<ContextType>;
  PaymentMethodQuote?: PaymentMethodQuoteResolvers<ContextType>;
  PaymentMethodTranslation?: PaymentMethodTranslationResolvers<ContextType>;
  PaymentOrderMismatchError?: PaymentOrderMismatchErrorResolvers<ContextType>;
  PaymentStateTransitionError?: PaymentStateTransitionErrorResolvers<ContextType>;
  PermissionDefinition?: PermissionDefinitionResolvers<ContextType>;
  PriceRange?: PriceRangeResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductCustomFields?: ProductCustomFieldsResolvers<ContextType>;
  ProductList?: ProductListResolvers<ContextType>;
  ProductOption?: ProductOptionResolvers<ContextType>;
  ProductOptionGroup?: ProductOptionGroupResolvers<ContextType>;
  ProductOptionGroupInUseError?: ProductOptionGroupInUseErrorResolvers<ContextType>;
  ProductOptionGroupList?: ProductOptionGroupListResolvers<ContextType>;
  ProductOptionGroupTranslation?: ProductOptionGroupTranslationResolvers<ContextType>;
  ProductOptionInUseError?: ProductOptionInUseErrorResolvers<ContextType>;
  ProductOptionList?: ProductOptionListResolvers<ContextType>;
  ProductOptionTranslation?: ProductOptionTranslationResolvers<ContextType>;
  ProductTranslation?: ProductTranslationResolvers<ContextType>;
  ProductVariant?: ProductVariantResolvers<ContextType>;
  ProductVariantList?: ProductVariantListResolvers<ContextType>;
  ProductVariantPrice?: ProductVariantPriceResolvers<ContextType>;
  ProductVariantTranslation?: ProductVariantTranslationResolvers<ContextType>;
  Promotion?: PromotionResolvers<ContextType>;
  PromotionCustomFields?: PromotionCustomFieldsResolvers<ContextType>;
  PromotionList?: PromotionListResolvers<ContextType>;
  PromotionTranslation?: PromotionTranslationResolvers<ContextType>;
  Province?: ProvinceResolvers<ContextType>;
  ProvinceList?: ProvinceListResolvers<ContextType>;
  QuantityTooGreatError?: QuantityTooGreatErrorResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RefreshTokenResponse?: RefreshTokenResponseResolvers<ContextType>;
  Refund?: RefundResolvers<ContextType>;
  RefundAmountError?: RefundAmountErrorResolvers<ContextType>;
  RefundLine?: RefundLineResolvers<ContextType>;
  RefundOrderResult?: RefundOrderResultResolvers<ContextType>;
  RefundOrderStateError?: RefundOrderStateErrorResolvers<ContextType>;
  RefundPaymentIdMissingError?: RefundPaymentIdMissingErrorResolvers<ContextType>;
  RefundStateTransitionError?: RefundStateTransitionErrorResolvers<ContextType>;
  Region?: RegionResolvers<ContextType>;
  RegionTranslation?: RegionTranslationResolvers<ContextType>;
  RelationCustomFieldConfig?: RelationCustomFieldConfigResolvers<ContextType>;
  Release?: ReleaseResolvers<ContextType>;
  RemoveFacetFromChannelResult?: RemoveFacetFromChannelResultResolvers<ContextType>;
  RemoveOptionGroupFromProductResult?: RemoveOptionGroupFromProductResultResolvers<ContextType>;
  RemoveOrderItemsResult?: RemoveOrderItemsResultResolvers<ContextType>;
  RemoveProductOptionGroupFromChannelResult?: RemoveProductOptionGroupFromChannelResultResolvers<ContextType>;
  Return?: ReturnResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  RoleList?: RoleListResolvers<ContextType>;
  RotateApiKeyResult?: RotateApiKeyResultResolvers<ContextType>;
  Sale?: SaleResolvers<ContextType>;
  SaleInfo?: SaleInfoResolvers<ContextType>;
  ScheduledTask?: ScheduledTaskResolvers<ContextType>;
  SearchReindexResponse?: SearchReindexResponseResolvers<ContextType>;
  SearchResponse?: SearchResponseResolvers<ContextType>;
  SearchResult?: SearchResultResolvers<ContextType>;
  SearchResultAsset?: SearchResultAssetResolvers<ContextType>;
  SearchResultPrice?: SearchResultPriceResolvers<ContextType>;
  SearchTermStat?: SearchTermStatResolvers<ContextType>;
  Season?: SeasonResolvers<ContextType>;
  SeasonList?: SeasonListResolvers<ContextType>;
  SeasonTranslation?: SeasonTranslationResolvers<ContextType>;
  Seller?: SellerResolvers<ContextType>;
  SellerList?: SellerListResolvers<ContextType>;
  ServerConfig?: ServerConfigResolvers<ContextType>;
  SetCustomerForDraftOrderResult?: SetCustomerForDraftOrderResultResolvers<ContextType>;
  SetOrderShippingMethodResult?: SetOrderShippingMethodResultResolvers<ContextType>;
  SetSettingsStoreValueResult?: SetSettingsStoreValueResultResolvers<ContextType>;
  SettingsStoreFieldDefinition?: SettingsStoreFieldDefinitionResolvers<ContextType>;
  SettlePaymentError?: SettlePaymentErrorResolvers<ContextType>;
  SettlePaymentResult?: SettlePaymentResultResolvers<ContextType>;
  SettleRefundResult?: SettleRefundResultResolvers<ContextType>;
  ShippingLine?: ShippingLineResolvers<ContextType>;
  ShippingMethod?: ShippingMethodResolvers<ContextType>;
  ShippingMethodList?: ShippingMethodListResolvers<ContextType>;
  ShippingMethodQuote?: ShippingMethodQuoteResolvers<ContextType>;
  ShippingMethodTranslation?: ShippingMethodTranslationResolvers<ContextType>;
  SinglePrice?: SinglePriceResolvers<ContextType>;
  StockAdjustment?: StockAdjustmentResolvers<ContextType>;
  StockLevel?: StockLevelResolvers<ContextType>;
  StockLocation?: StockLocationResolvers<ContextType>;
  StockLocationList?: StockLocationListResolvers<ContextType>;
  StockMovement?: StockMovementResolvers<ContextType>;
  StockMovementItem?: StockMovementItemResolvers<ContextType>;
  StockMovementList?: StockMovementListResolvers<ContextType>;
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
  TaxCategoryList?: TaxCategoryListResolvers<ContextType>;
  TaxLine?: TaxLineResolvers<ContextType>;
  TaxRate?: TaxRateResolvers<ContextType>;
  TaxRateList?: TaxRateListResolvers<ContextType>;
  TestShippingMethodQuote?: TestShippingMethodQuoteResolvers<ContextType>;
  TestShippingMethodResult?: TestShippingMethodResultResolvers<ContextType>;
  TextCustomFieldConfig?: TextCustomFieldConfigResolvers<ContextType>;
  TextStructFieldConfig?: TextStructFieldConfigResolvers<ContextType>;
  TransitionFulfillmentToStateResult?: TransitionFulfillmentToStateResultResolvers<ContextType>;
  TransitionOrderToStateResult?: TransitionOrderToStateResultResolvers<ContextType>;
  TransitionPaymentToStateResult?: TransitionPaymentToStateResultResolvers<ContextType>;
  UpdateChannelResult?: UpdateChannelResultResolvers<ContextType>;
  UpdateCustomerResult?: UpdateCustomerResultResolvers<ContextType>;
  UpdateGlobalSettingsResult?: UpdateGlobalSettingsResultResolvers<ContextType>;
  UpdateOrderItemErrorResult?: UpdateOrderItemErrorResultResolvers<ContextType>;
  UpdateOrderItemsResult?: UpdateOrderItemsResultResolvers<ContextType>;
  UpdatePromotionResult?: UpdatePromotionResultResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  VariantSoldCount?: VariantSoldCountResolvers<ContextType>;
  Worker?: WorkerResolvers<ContextType>;
  WorkerList?: WorkerListResolvers<ContextType>;
  Zone?: ZoneResolvers<ContextType>;
  ZoneList?: ZoneListResolvers<ContextType>;
};



export const GetBannersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBanners"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BannerListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"banners"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"counter"}},{"kind":"Field","name":{"kind":"Name","value":"redirect"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetBannersQuery, GetBannersQueryVariables>;
export const GetBannerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBanner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"banner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"counter"}},{"kind":"Field","name":{"kind":"Name","value":"redirect"}},{"kind":"Field","name":{"kind":"Name","value":"link"}},{"kind":"Field","name":{"kind":"Name","value":"backColor"}},{"kind":"Field","name":{"kind":"Name","value":"btnColor"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"type"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"model"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"products"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetBannerQuery, GetBannerQueryVariables>;
export const CreateBannerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBanner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBannerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBanner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<CreateBannerMutation, CreateBannerMutationVariables>;
export const UpdateBannerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBanner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBannerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBanner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]} as unknown as DocumentNode<UpdateBannerMutation, UpdateBannerMutationVariables>;
export const DeleteBannerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBanner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBanner"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteBannerMutation, DeleteBannerMutationVariables>;
export const GetBannerTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBannerTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BannerTypeListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bannerTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetBannerTypesQuery, GetBannerTypesQueryVariables>;
export const GetBannerTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBannerType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bannerType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetBannerTypeQuery, GetBannerTypeQueryVariables>;
export const CreateBannerTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBannerType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBannerTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBannerType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateBannerTypeMutation, CreateBannerTypeMutationVariables>;
export const UpdateBannerTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBannerType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateBannerTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBannerType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateBannerTypeMutation, UpdateBannerTypeMutationVariables>;
export const DeleteBannerTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteBannerType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBannerType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteBannerTypeMutation, DeleteBannerTypeMutationVariables>;
export const GetFacetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFacets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FacetListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"facets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetFacetsQuery, GetFacetsQueryVariables>;
export const SearchProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"search"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productId"}},{"kind":"Field","name":{"kind":"Name","value":"productName"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantId"}},{"kind":"Field","name":{"kind":"Name","value":"productVariantName"}},{"kind":"Field","name":{"kind":"Name","value":"productAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"productVariantAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PriceRange"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SinglePrice"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<SearchProductsQuery, SearchProductsQueryVariables>;
export const GetProductsByIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductsByIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProductsByIdsQuery, GetProductsByIdsQueryVariables>;
export const GetAllProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdminFilteredProductListOptions"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getAllProducts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"variants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"priceWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"stockLevel"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetAllProductsQuery, GetAllProductsQueryVariables>;
export const GetModelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetModels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"models"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetModelsQuery, GetModelsQueryVariables>;
export const GetProductIdsByEnabledDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductIdsByEnabled"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProductListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"products"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetProductIdsByEnabledQuery, GetProductIdsByEnabledQueryVariables>;
export const UpsertBannerAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertBannerAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpsertBannerAssetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertBannerAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpsertBannerAssetMutation, UpsertBannerAssetMutationVariables>;
export const RemoveBannerAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveBannerAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveBannerAssetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeBannerAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"asset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RemoveBannerAssetMutation, RemoveBannerAssetMutationVariables>;
export const GetCategoryTypesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategoryTypes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryTypeListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryTypes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetCategoryTypesQuery, GetCategoryTypesQueryVariables>;
export const GetCategoryTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategoryType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]}}]}}]} as unknown as DocumentNode<GetCategoryTypeQuery, GetCategoryTypeQueryVariables>;
export const GetCategoriesByTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategoriesByType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryTypeId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"categoryTypeId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryTypeId"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sort"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetCategoriesByTypeQuery, GetCategoriesByTypeQueryVariables>;
export const GetCategoriesByIdsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategoriesByIds"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"in"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"categoryType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCategoriesByIdsQuery, GetCategoriesByIdsQueryVariables>;
export const GetCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CategoryListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetCategoryQuery, GetCategoryQueryVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const CreateCategoryTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategoryType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategoryTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategoryType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCategoryTypeMutation, CreateCategoryTypeMutationVariables>;
export const UpdateCategoryTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategoryType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryTypeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategoryType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCategoryTypeMutation, UpdateCategoryTypeMutationVariables>;
export const DeleteCategoryTypeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCategoryType"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCategoryType"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteCategoryTypeMutation, DeleteCategoryTypeMutationVariables>;
export const GetCategoryTreeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategoryTree"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryTypeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryTree"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"categoryTypeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryTypeId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"categoryType"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"iconAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCategoryTreeQuery, GetCategoryTreeQueryVariables>;
export const GetDaysDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDays"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DayListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"days"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"dayOffset"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetDaysQuery, GetDaysQueryVariables>;
export const GetDayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDay"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"day"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"dayOffset"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetDayQuery, GetDayQueryVariables>;
export const CreateDayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDay"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDayInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDay"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"dayOffset"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateDayMutation, CreateDayMutationVariables>;
export const UpdateDayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDay"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDayInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDay"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"dayOffset"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateDayMutation, UpdateDayMutationVariables>;
export const DeleteDayDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDay"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDay"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteDayMutation, DeleteDayMutationVariables>;
export const GetDeliveryMethodsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDeliveryMethods"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DeliveryMethodListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deliveryMethods"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"isDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"closeTime"}},{"kind":"Field","name":{"kind":"Name","value":"maxCost"}},{"kind":"Field","name":{"kind":"Name","value":"minCost"}},{"kind":"Field","name":{"kind":"Name","value":"limitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"showTime"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"days"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetDeliveryMethodsQuery, GetDeliveryMethodsQueryVariables>;
export const GetDeliveryMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDeliveryMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deliveryMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"isDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"closeTime"}},{"kind":"Field","name":{"kind":"Name","value":"maxCost"}},{"kind":"Field","name":{"kind":"Name","value":"minCost"}},{"kind":"Field","name":{"kind":"Name","value":"limitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"showTime"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"days"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<GetDeliveryMethodQuery, GetDeliveryMethodQueryVariables>;
export const CreateDeliveryMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDeliveryMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDeliveryMethodInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDeliveryMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"isDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"closeTime"}},{"kind":"Field","name":{"kind":"Name","value":"maxCost"}},{"kind":"Field","name":{"kind":"Name","value":"minCost"}},{"kind":"Field","name":{"kind":"Name","value":"limitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"showTime"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"days"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<CreateDeliveryMethodMutation, CreateDeliveryMethodMutationVariables>;
export const UpdateDeliveryMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDeliveryMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDeliveryMethodInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDeliveryMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"isDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"closeTime"}},{"kind":"Field","name":{"kind":"Name","value":"maxCost"}},{"kind":"Field","name":{"kind":"Name","value":"minCost"}},{"kind":"Field","name":{"kind":"Name","value":"limitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"showTime"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"days"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateDeliveryMethodMutation, UpdateDeliveryMethodMutationVariables>;
export const DeleteDeliveryMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDeliveryMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDeliveryMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteDeliveryMethodMutation, DeleteDeliveryMethodMutationVariables>;
export const ToggleDeliveryMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleDeliveryMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editButtonState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"isDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"closeTime"}},{"kind":"Field","name":{"kind":"Name","value":"maxCost"}},{"kind":"Field","name":{"kind":"Name","value":"minCost"}},{"kind":"Field","name":{"kind":"Name","value":"limitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"showTime"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"days"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<ToggleDeliveryMethodMutation, ToggleDeliveryMethodMutationVariables>;
export const GetLabelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLabels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LabelListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetLabelsQuery, GetLabelsQueryVariables>;
export const GetLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"featuredAsset"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"preview"}}]}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetLabelQuery, GetLabelQueryVariables>;
export const CreateLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLabelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CreateLabelMutation, CreateLabelMutationVariables>;
export const UpdateLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLabelInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"translations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateLabelMutation, UpdateLabelMutationVariables>;
export const DeleteLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteLabelMutation, DeleteLabelMutationVariables>;
export const GetOrderDeliveryGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrderDeliveryGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"order"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deliveryGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"day"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"minCost"}},{"kind":"Field","name":{"kind":"Name","value":"limitPrice"}},{"kind":"Field","name":{"kind":"Name","value":"isDisabled"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"showTime"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetOrderDeliveryGroupsQuery, GetOrderDeliveryGroupsQueryVariables>;
export const SetDraftOrderCustomFieldsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDraftOrderCustomFields"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDraftOrderCustomFields"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deliveryMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"minCost"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SetDraftOrderCustomFieldsMutation, SetDraftOrderCustomFieldsMutationVariables>;
export const SetDraftOrderShippingMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetDraftOrderShippingMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shippingMethodId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setDraftOrderShippingMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"shippingMethodId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shippingMethodId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Order"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}}]}}]}}]}}]} as unknown as DocumentNode<SetDraftOrderShippingMethodMutation, SetDraftOrderShippingMethodMutationVariables>;
export const GetShippingMethodsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetShippingMethods"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shippingMethods"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"ObjectValue","fields":[]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"calculator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetShippingMethodsQuery, GetShippingMethodsQueryVariables>;
export const ApplyDeliveryMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApplyDeliveryMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deliveryMethodId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applyDeliveryMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"deliveryMethodId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deliveryMethodId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shippingWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"totalWithTax"}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deliveryMethod"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ApplyDeliveryMethodMutation, ApplyDeliveryMethodMutationVariables>;
export const GetMeiliMonitoringDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeiliMonitoring"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meiliMonitoring"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"isHealthy"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"dbSizeBytes"}},{"kind":"Field","name":{"kind":"Name","value":"lastUpdated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"indexStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"indexName"}},{"kind":"Field","name":{"kind":"Name","value":"documentCount"}},{"kind":"Field","name":{"kind":"Name","value":"isIndexing"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalTasks"}},{"kind":"Field","name":{"kind":"Name","value":"pendingTasks"}},{"kind":"Field","name":{"kind":"Name","value":"processingTasks"}},{"kind":"Field","name":{"kind":"Name","value":"failedTasks"}},{"kind":"Field","name":{"kind":"Name","value":"succeededTasks"}},{"kind":"Field","name":{"kind":"Name","value":"enqueuedTasks"}},{"kind":"Field","name":{"kind":"Name","value":"recentTasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"enqueuedAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"finishedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"analytics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalSearchRequests"}},{"kind":"Field","name":{"kind":"Name","value":"topSearchTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emptyResultTerms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"term"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"failedSyncCount"}},{"kind":"Field","name":{"kind":"Name","value":"lastSyncTime"}}]}},{"kind":"Field","name":{"kind":"Name","value":"syncProgress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"indexed"}},{"kind":"Field","name":{"kind":"Name","value":"failed"}},{"kind":"Field","name":{"kind":"Name","value":"inProgress"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"completedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetMeiliMonitoringQuery, GetMeiliMonitoringQueryVariables>;
export const GetMeiliSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeiliSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meiliSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchableAttributes"}},{"kind":"Field","name":{"kind":"Name","value":"filterableAttributes"}},{"kind":"Field","name":{"kind":"Name","value":"sortableAttributes"}},{"kind":"Field","name":{"kind":"Name","value":"synonyms"}},{"kind":"Field","name":{"kind":"Name","value":"stopWords"}},{"kind":"Field","name":{"kind":"Name","value":"rankingRules"}},{"kind":"Field","name":{"kind":"Name","value":"typoToleranceEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"typoOneTypo"}},{"kind":"Field","name":{"kind":"Name","value":"typoTwoTypos"}}]}}]}}]} as unknown as DocumentNode<GetMeiliSettingsQuery, GetMeiliSettingsQueryVariables>;
export const RunMeiliInitialSyncDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RunMeiliInitialSync"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"runMeiliInitialSync"}}]}}]} as unknown as DocumentNode<RunMeiliInitialSyncMutation, RunMeiliInitialSyncMutationVariables>;
export const MeiliForceSyncDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MeiliForceSync"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meiliForceSync"}}]}}]} as unknown as DocumentNode<MeiliForceSyncMutation, MeiliForceSyncMutationVariables>;
export const MeiliRunSyncInlineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MeiliRunSyncInline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meiliRunSyncInline"}}]}}]} as unknown as DocumentNode<MeiliRunSyncInlineMutation, MeiliRunSyncInlineMutationVariables>;
export const MeiliClearIndexDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MeiliClearIndex"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meiliClearIndex"}}]}}]} as unknown as DocumentNode<MeiliClearIndexMutation, MeiliClearIndexMutationVariables>;
export const MeiliResetAnalyticsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MeiliResetAnalytics"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meiliResetAnalytics"}}]}}]} as unknown as DocumentNode<MeiliResetAnalyticsMutation, MeiliResetAnalyticsMutationVariables>;
export const UpdateMeiliSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMeiliSettings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MeiliSettingsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMeiliSettings"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchableAttributes"}},{"kind":"Field","name":{"kind":"Name","value":"filterableAttributes"}},{"kind":"Field","name":{"kind":"Name","value":"sortableAttributes"}},{"kind":"Field","name":{"kind":"Name","value":"synonyms"}},{"kind":"Field","name":{"kind":"Name","value":"stopWords"}},{"kind":"Field","name":{"kind":"Name","value":"rankingRules"}},{"kind":"Field","name":{"kind":"Name","value":"typoToleranceEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"typoOneTypo"}},{"kind":"Field","name":{"kind":"Name","value":"typoTwoTypos"}}]}}]}}]} as unknown as DocumentNode<UpdateMeiliSettingsMutation, UpdateMeiliSettingsMutationVariables>;
export const GetWorkersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"options"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkerListOptions"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"options"},"value":{"kind":"Variable","name":{"kind":"Name","value":"options"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"erpCode"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"vehicle"}},{"kind":"Field","name":{"kind":"Name","value":"vehiclePlate"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"externalCode"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}}]}}]}}]} as unknown as DocumentNode<GetWorkersQuery, GetWorkersQueryVariables>;
export const GetWorkerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorker"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"worker"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"phone"}},{"kind":"Field","name":{"kind":"Name","value":"erpCode"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"sort"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"vehicle"}},{"kind":"Field","name":{"kind":"Name","value":"vehiclePlate"}},{"kind":"Field","name":{"kind":"Name","value":"address"}},{"kind":"Field","name":{"kind":"Name","value":"externalCode"}}]}}]}}]} as unknown as DocumentNode<GetWorkerQuery, GetWorkerQueryVariables>;
export const CreateWorkerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorker"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWorkerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorker"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<CreateWorkerMutation, CreateWorkerMutationVariables>;
export const UpdateWorkerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWorker"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWorkerInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWorker"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]} as unknown as DocumentNode<UpdateWorkerMutation, UpdateWorkerMutationVariables>;
export const DeleteWorkerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteWorker"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteWorker"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"result"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteWorkerMutation, DeleteWorkerMutationVariables>;
export const AssignCourierToOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignCourierToOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courierId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignCourierToOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"courierId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courierId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignedCourierId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]} as unknown as DocumentNode<AssignCourierToOrderMutation, AssignCourierToOrderMutationVariables>;
export const UnassignCourierFromOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnassignCourierFromOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unassignCourierFromOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customFields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignedCourierId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courier"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UnassignCourierFromOrderMutation, UnassignCourierFromOrderMutationVariables>;