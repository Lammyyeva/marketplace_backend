import { gql } from "graphql-tag";

export const commonApiExtensions = gql`
  type CategoryType implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    slug: String!
    categories: [Category!]!
    translations: [CategoryTypeTranslation!]!
    iconAsset: Asset
    imageAsset: Asset
    sort: Int!
    enabled: Boolean!
  }

  type CategoryTypeTranslation {
    id: ID!
    languageCode: LanguageCode!
    name: String!
  }

  type CategoryTypeList implements PaginatedList {
    items: [CategoryType!]!
    totalItems: Int!
  }

  type CategoryList implements PaginatedList {
    items: [Category!]!
    totalItems: Int!
  }

  type Category implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    slug: String!
    categoryType: CategoryType!
    featuredAsset: Asset
    iconAsset: Asset
    children: [Category!]!
    parent: Category
    models: [FacetValue!]!
    productsByLabel(labelId: ID!): [Product!]!
    sort: Int!
    enabled: Boolean!
    translations: [CategoryTranslation!]!
  }

  type CategoryTranslation {
    id: ID!
    languageCode: LanguageCode!
    name: String!
  }

  extend type FacetValue {
    categoryIds: [ID!]!
  }

  input CategoryTranslationInput {
    languageCode: LanguageCode!
    name: String!
  }

  input CategoryTypeTranslationInput {
    languageCode: LanguageCode!
    name: String!
  }

  input CreateCategoryInput {
    translations: [CategoryTranslationInput!]!
    slug: String!
    categoryTypeId: ID!
    featuredAssetId: ID
    iconAssetId: ID
    modelIds: [ID!]
    parentId: ID
    sort: Int
    enabled: Boolean
  }

  input UpdateCategoryInput {
    id: ID!
    translations: [CategoryTranslationInput!]
    slug: String
    categoryTypeId: ID
    featuredAssetId: ID
    iconAssetId: ID
    parentId: ID
    modelIds: [ID!]
    sort: Int
    enabled: Boolean
  }

  input CreateCategoryTypeInput {
    translations: [CategoryTypeTranslationInput!]!
    slug: String!
    iconAssetId: ID
    imageAssetId: ID
    sort: Int!
    enabled: Boolean!
  }

  input UpdateCategoryTypeInput {
    id: ID!
    translations: [CategoryTypeTranslationInput!]
    slug: String
    iconAssetId: ID
    imageAssetId: ID
    sort: Int
    enabled: Boolean
  }

  input CategoryListOptions {
    skip: Int
    take: Int
    sort: CategorySortParameter
    filter: CategoryFilterParameter
  }

  input CategorySortParameter {
    id: SortOrder
    name: SortOrder
    sort: SortOrder
  }

  input CategoryFilterParameter {
    id: IDOperators
    createdAt: DateOperators
    updatedAt: DateOperators
    name: StringOperators
    slug: StringOperators
    categoryTypeId: IDOperators
    parentId: IDOperators
    enabled: BooleanOperators
  }

  input CategoryTypeListOptions {
    skip: Int
    take: Int
    sort: CategoryTypeSortParameter
    filter: CategoryTypeFilterParameter
  }

  input CategoryTypeSortParameter {
    id: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
    name: SortOrder
    slug: SortOrder
    sort: SortOrder
    enabled: SortOrder
  }

  input CategoryTypeFilterParameter {
    id: IDOperators
    createdAt: DateOperators
    updatedAt: DateOperators
    name: StringOperators
    slug: StringOperators
    sort: NumberOperators
    enabled: BooleanOperators
  }
`;

export const shopApiExtensions = gql`
  ${commonApiExtensions}
  extend type Query {
    categories(options: CategoryListOptions): CategoryList!
    categoryTypes(options: CategoryTypeListOptions): CategoryTypeList!
    category(id: ID, slug: String): Category
    categoryType(id: ID): CategoryType
    categoryTree(categoryTypeId: ID): [Category!]!
  }
`;

export const adminApiExtensions = gql`
  ${commonApiExtensions}
  extend type Query {
    categories(options: CategoryListOptions): CategoryList!
    categoryTypes(options: CategoryTypeListOptions): CategoryTypeList!
    category(id: ID, slug: String): Category
    categoryType(id: ID): CategoryType
    categoryTree(categoryTypeId: ID): [Category!]!
  }
  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): DeletionResponse!

    createCategoryType(input: CreateCategoryTypeInput!): CategoryType!
    updateCategoryType(input: UpdateCategoryTypeInput!): CategoryType!
    deleteCategoryType(id: ID!): DeletionResponse!
  }
`;
