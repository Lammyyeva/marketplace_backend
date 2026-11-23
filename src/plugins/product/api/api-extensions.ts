import { gql } from "graphql-tag";

const commonProductTypes = gql`
  type FilteredProductList {
    items: [Product!]!
    totalItems: Int!
  }

  type AggregatedMetadata {
    models: [FacetValue!]!
    labels: [Label!]!
    categories: [Category!]!
    min: Float
    max: Float
  }

  input AdminFilteredProductListOptions {
    skip: Int
    take: Int
    sort: FilteredProductSortParameters
    filter: AdminFilteredProductFilterParameters
  }

  input ShopFilteredProductListOptions {
    skip: Int
    take: Int
    sort: FilteredProductSortParameters
    filter: ShopFilteredProductFilterParameters
  }

  input FilteredProductSortParameters {
    price: SortOrder
    name: SortOrder
  }

  input AdminFilteredProductFilterParameters {
    slug: String
    type: String
    enabled: Boolean
    ids: [ID!]
    categoryIds: [ID!]
    modelIds: [ID!]
    labelIds: [ID!]
    min: Float
    max: Float
    isRecommended: Boolean
    isSale: Boolean
    isNew: Boolean
    isSeason: Boolean
    sku: String
  }

  input ShopFilteredProductFilterParameters {
    slug: String
    type: String
    categoryIds: [ID!]
    modelIds: [ID!]
    labelIds: [ID!]
    min: Float
    max: Float
    isRecommended: Boolean
    isSale: Boolean
    isNew: Boolean
    isSeason: Boolean
    sku: String
    """
    Whether only in-stock products are returned. Defaults to true on the
    shop API so out-of-stock products are hidden from public listings.
    Pass false explicitly to include products with zero or unknown stock
    (e.g. admin previews).
    """
    inStock: Boolean
  }

  type Model {
    id: ID!
    name: String!
  }

  type ModelList {
    items: [Model!]!
    totalItems: Int!
  }

  extend type Query {
    models: ModelList!
    getFilters(slug: String!, type: String!): AggregatedMetadata!
  }
`;

export const productShopApiExtensions = gql`
  ${commonProductTypes}

  type HomePageSection {
    title: String!
    products: [Product!]!
    slug: String!
    allBtn: Boolean!
    type: String!
  }

  extend type Query {
    getAllProducts(
      options: ShopFilteredProductListOptions
    ): FilteredProductList!
    getHomePageData(options: ProductListOptions): [HomePageSection!]!
    boughtTogether(productId: ID!, limit: Int): [BoughtTogetherResult!]!
  }

  type BoughtTogetherResult {
    product: Product!
    count: Int!
  }

  type TrackClickSuccess {
    success: Boolean!
    message: String!
  }

  extend type Mutation {
    trackProductClick(productId: ID!, productName: String!): TrackClickSuccess!
  }
  extend type Product {
    labels: [Label!]!
    category: Category
    categories: [Category!]!
    isSelected: Boolean!
    selectedQuantity: Int!
    sale: SaleInfo
    activeOptionGroups: [ProductOptionGroup!]!
  }

  extend input SearchInput {
    slug: String
    type: String
    isSale: Boolean
    isRecommended: Boolean
  }

  extend type SearchResult {
    category: Category
    categories: [Category!]!
    productLabels: [Label!]!
    isSelected: Boolean!
    selectedQuantity: Int!
  }

  extend type ProductVariant {
    stockOnHand: Int!
  }
`;

export const productAdminApiExtensions = gql`
  ${commonProductTypes}
  extend type Query {
    getAllProducts(
      options: AdminFilteredProductListOptions
    ): FilteredProductList!
  }
  extend type Product {
    labels: [Label!]!
    category: Category
    categories: [Category!]!
    image: Asset
    isSelected: Boolean!
    selectedQuantity: Int!
    sale: SaleInfo
    activeOptionGroups: [ProductOptionGroup!]!
  }
`;
