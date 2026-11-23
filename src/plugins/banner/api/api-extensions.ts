import gql from "graphql-tag";

export enum RedirectTypes {
  model = "model",
  category = "category",
  products = "products",
  url = "url",
  empty = "empty",
}

export const commonApiExtensions = gql`
  type Banner implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    slug: String!
    redirect: RedirectTypes!
    link: String
    enabled: Boolean!
    sort: Int!
    counter: Int!
    backColor: String
    btnColor: String
    asset: Asset
    assets: [BannerAsset!]!
    startDate: DateTime!
    endDate: DateTime!
    model: FacetValue
    category: Category
    products: [Product!]
    variants: [ProductVariant!]
    translations: [BannerTranslation!]!
    type: BannerType
  }

  type BannerAsset implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    languageCode: LanguageCode!
    asset: Asset!
    banner: Banner!
  }

  type BannerType implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    enabled: Boolean!
    sort: Int!
    banners: [Banner!]!
    translations: [BannerTypeTranslation!]!
  }

  type BannerTypeTranslation {
    id: ID!
    languageCode: LanguageCode!
    name: String!
  }

  type BannerTypeList implements PaginatedList {
    items: [BannerType!]!
    totalItems: Int!
  }

  input BannerTypeListOptions {
    skip: Int
    take: Int
    sort: BannerTypeSortParameter
    filter: BannerTypeFilterParameter
  }

  input BannerTypeSortParameter {
    id: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
    sort: SortOrder
  }

  input BannerTypeFilterParameter {
    id: IDOperators
    createdAt: DateOperators
    updatedAt: DateOperators
    sort: NumberOperators
  }

  enum RedirectTypes {
    model
    category
    products
    url
    empty
  }

  type BannerTranslation {
    id: ID!
    languageCode: LanguageCode!
    name: String!
  }

  type BannerList implements PaginatedList {
    items: [Banner!]!
    totalItems: Int!
  }

  input BannerListOptions {
    skip: Int
    take: Int
    sort: BannerSortParameter
    filter: BannerFilterParameter
  }

  input BannerSortParameter {
    id: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
    slug: SortOrder
    sort: SortOrder
    counter: SortOrder
    startDate: SortOrder
    endDate: SortOrder
    enabled: SortOrder
  }

  input BannerFilterParameter {
    id: IDOperators
    createdAt: DateOperators
    updatedAt: DateOperators
    slug: StringOperators
    enabled: BooleanOperators
    sort: NumberOperators
    counter: NumberOperators
    startDate: DateOperators
    endDate: DateOperators
    redirect: StringOperators
    typeId: IDOperators
  }

  extend type Category {
    banners: [Banner!]!
  }

  extend type Mutation {
    trackBannerClick(id: ID!): Boolean!
  }

  extend type Query {
    banner(id: ID!): Banner
    banners(options: BannerListOptions): BannerList!
    bannerBySlug(slug: String!): Banner
    bannerType(id: ID!): BannerType
    bannerTypes(options: BannerTypeListOptions): BannerTypeList!
  }
`;

export const adminApiExtensions = gql`
  ${commonApiExtensions}

  input BannerTranslationInput {
    languageCode: LanguageCode!
    name: String!
  }

  input BannerTypeTranslationInput {
    languageCode: LanguageCode!
    name: String!
  }

  input CreateBannerTypeInput {
    sort: Int!
    enabled: Boolean!
    translations: [BannerTypeTranslationInput!]!
  }

  input UpdateBannerTypeInput {
    id: ID!
    sort: Int
    enabled: Boolean
    translations: [BannerTypeTranslationInput!]
  }

  input CreateBannerInput {
    slug: String!
    redirect: RedirectTypes!
    link: String
    enabled: Boolean!
    sort: Int!
    counter: Int
    backColor: String
    btnColor: String
    startDate: DateTime
    endDate: DateTime
    categoryId: ID
    modelId: ID
    productIds: [ID!]
    productVariantIds: [ID!]
    typeId: ID!
    translations: [BannerTranslationInput!]!
  }

  input UpdateBannerInput {
    id: ID!
    slug: String
    redirect: RedirectTypes
    link: String
    enabled: Boolean
    sort: Int
    counter: Int
    backColor: String
    btnColor: String
    startDate: DateTime
    endDate: DateTime
    categoryId: ID
    modelId: ID
    productIds: [ID!]
    productVariantIds: [ID!]
    typeId: ID
    translations: [BannerTranslationInput!]
  }

  input UpsertBannerAssetInput {
    bannerId: ID!
    languageCode: LanguageCode!
    assetId: ID!
  }

  input RemoveBannerAssetInput {
    bannerId: ID!
    languageCode: LanguageCode!
  }

  extend type Mutation {
    createBanner(input: CreateBannerInput!): Banner!
    updateBanner(input: UpdateBannerInput!): Banner!
    upsertBannerAsset(input: UpsertBannerAssetInput!): Banner!
    removeBannerAsset(input: RemoveBannerAssetInput!): Banner!
    deleteBanner(id: ID!): DeletionResponse!
    deleteBanners(ids: [ID!]!): [DeletionResponse!]!

    createBannerType(input: CreateBannerTypeInput!): BannerType!
    updateBannerType(input: UpdateBannerTypeInput!): BannerType!
    deleteBannerType(id: ID!): DeletionResponse!
    deleteBannerTypes(ids: [ID!]!): [DeletionResponse!]!
  }
`;
