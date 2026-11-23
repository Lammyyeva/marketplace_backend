import { gql } from "graphql-tag";

export const commonApiExtensions = gql`
  type Label implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    code: String!
    color: String!
    enabled: Boolean!
    sort: Int!
    featuredAsset: Asset
    translations: [LabelTranslation!]!
  }

  type LabelTranslation {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    languageCode: LanguageCode!
    name: String!
  }

  input LabelTranslationInput {
    languageCode: LanguageCode!
    name: String!
  }

  input CreateLabelInput {
    translations: [LabelTranslationInput!]!
    code: String!
    color: String!
    enabled: Boolean!
    sort: Int!
    featuredAssetId: ID!
  }

  input UpdateLabelInput {
    id: ID!
    translations: [LabelTranslationInput!]
    code: String
    color: String
    enabled: Boolean
    sort: Int
    featuredAssetId: ID
  }
  type LabelList implements PaginatedList {
    items: [Label!]!
    totalItems: Int!
  }

  input LabelListOptions {
    skip: Int
    take: Int
    sort: LabelSortParameter
    filter: LabelFilterParameter
  }

  input LabelSortParameter {
    id: SortOrder
    name: SortOrder
    enabled: SortOrder
    sort: SortOrder
  }

  input LabelFilterParameter {
    id: IDOperators
    createdAt: DateOperators
    updatedAt: DateOperators
    name: StringOperators
    code: StringOperators
    enabled: BooleanOperators
    sort: NumberOperators
  }
`;

export const shopApiExtensions = gql`
  ${commonApiExtensions}
  extend type Query {
    labels(options: LabelListOptions): LabelList!
    label(id: ID!): Label
  }
`;

export const adminApiExtensions = gql`
  ${commonApiExtensions}
  extend type Query {
    labels(options: LabelListOptions): LabelList!
    label(id: ID!): Label
  }
  extend type Mutation {
    createLabel(input: CreateLabelInput!): Label!
    updateLabel(input: UpdateLabelInput!): Label!
    deleteLabel(id: ID!): DeletionResponse!
  }
`;
