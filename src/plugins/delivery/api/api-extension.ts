// src/plugins/delivery/api/api-extensions.ts
import gql from "graphql-tag";

const commonTypes = gql`
  type DayTranslation {
    id: ID!
    languageCode: LanguageCode!
    name: String!
  }

  type Day implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    enabled: Boolean!
    sort: Int!
    code: String!
    name: String!
    type: DayType!
    date: String
    dayOffset: Int
    translations: [DayTranslation!]!
    deliveryMethods: [DeliveryMethod!]!
  }

  type DeliveryMethodTranslation {
    id: ID!
    languageCode: LanguageCode!
    name: String!
    description: String!
  }

  type DeliveryMethod implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    code: String!
    name: String!
    description: String!
    enabled: Boolean!
    isDisabled: Boolean!
    sort: Int!
    type: DeliveryMethodType!
    from: String!
    to: String!
    closeTime: String!
    maxCost: Int!
    minCost: Int!
    limitPrice: Int!
    showTime: Boolean!
    days: [Day!]!
    translations: [DeliveryMethodTranslation!]!
  }

  type DeliveryCredentialGroup {
    key: Int!
    day: String!
    date: String
    type: String!
    data: [DeliveryMethod!]!
  }

  enum DeliveryMethodType {
    express
    default
    pickUp
    interval
  }

  enum DayType {
    express
    default
  }

  type DayList implements PaginatedList {
    items: [Day!]!
    totalItems: Int!
  }

  input DayListOptions {
    skip: Int
    take: Int
    sort: DaySortParameter
    filter: DayFilterParameter
  }

  input DaySortParameter {
    id: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
    enabled: SortOrder
    sort: SortOrder
    code: SortOrder
    type: SortOrder
    dayOffset: SortOrder
  }

  input DayFilterParameter {
    id: IDOperators
    createdAt: DateOperators
    updatedAt: DateOperators
    enabled: BooleanOperators
    sort: NumberOperators
    code: StringOperators
    type: StringOperators
    dayOffset: NumberOperators
  }

  type DeliveryMethodList implements PaginatedList {
    items: [DeliveryMethod!]!
    totalItems: Int!
  }

  input DeliveryMethodListOptions {
    skip: Int
    take: Int
    sort: DeliveryMethodSortParameter
    filter: DeliveryMethodFilterParameter
  }

  input DeliveryMethodSortParameter {
    id: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
    code: SortOrder
    type: SortOrder
    enabled: SortOrder
    isDisabled: SortOrder
    sort: SortOrder
    from: SortOrder
    to: SortOrder
    closeTime: SortOrder
    maxCost: SortOrder
    minCost: SortOrder
    limitPrice: SortOrder
    showTime: SortOrder
  }

  input DeliveryMethodFilterParameter {
    id: IDOperators
    createdAt: DateOperators
    updatedAt: DateOperators
    code: StringOperators
    type: StringOperators
    enabled: BooleanOperators
    isDisabled: BooleanOperators
    sort: NumberOperators
    from: StringOperators
    to: StringOperators
    closeTime: StringOperators
    maxCost: NumberOperators
    minCost: NumberOperators
    limitPrice: NumberOperators
    showTime: BooleanOperators
  }
`;

export const adminApiExtensions = gql`
  ${commonTypes}

  input DayTranslationInput {
    languageCode: LanguageCode!
    name: String!
  }

  input CreateDayInput {
    code: String!
    enabled: Boolean!
    sort: Int!
    dayOffset: Int
    type: DayType!
    translations: [DayTranslationInput!]!
  }

  input UpdateDayInput {
    id: ID!
    enabled: Boolean
    sort: Int
    dayOffset: Int
    code: String
    type: DayType
    translations: [DayTranslationInput!]
  }

  input DeliveryMethodTranslationInput {
    languageCode: LanguageCode!
    name: String!
    description: String!
  }

  input CreateDeliveryMethodInput {
    code: String!
    enabled: Boolean!
    isDisabled: Boolean!
    sort: Int!
    type: DeliveryMethodType!
    from: String!
    to: String!
    closeTime: String!
    maxCost: Int
    minCost: Int!
    limitPrice: Int
    showTime: Boolean
    dayIds: [ID!]!
    translations: [DeliveryMethodTranslationInput!]!
  }

  input UpdateDeliveryMethodInput {
    id: ID!
    code: String
    enabled: Boolean
    isDisabled: Boolean
    sort: Int
    type: DeliveryMethodType
    from: String
    to: String
    closeTime: String
    maxCost: Int
    minCost: Int
    limitPrice: Int
    showTime: Boolean
    dayIds: [ID!]
    translations: [DeliveryMethodTranslationInput!]
  }

  extend type Query {
    # Day queries
    days(options: DayListOptions): DayList!
    day(id: ID!): Day

    # DeliveryMethod queries
    deliveryMethods(options: DeliveryMethodListOptions): DeliveryMethodList!
    deliveryMethod(id: ID!): DeliveryMethod
  }

  extend type Mutation {
    # Day mutations
    createDay(input: CreateDayInput!): Day!
    updateDay(input: UpdateDayInput!): Day!
    deleteDay(id: ID!): Boolean!

    # DeliveryMethod mutations
    createDeliveryMethod(input: CreateDeliveryMethodInput!): DeliveryMethod!
    updateDeliveryMethod(input: UpdateDeliveryMethodInput!): DeliveryMethod!
    deleteDeliveryMethod(id: ID!): Boolean!
    editButtonState(id: ID!): DeliveryMethod!
    applyDeliveryMethod(orderId: ID!, deliveryMethodId: ID!): Order!
  }

  extend type Order {
    deliveryGroups: [DeliveryCredentialGroup!]!
  }
`;

export const shopApiExtensions = gql`
  ${commonTypes}

  extend type Query {
    days(options: DayListOptions): DayList!
    day(id: ID!): Day
    deliveryMethods(options: DeliveryMethodListOptions): DeliveryMethodList!
    deliveryMethod(id: ID!): DeliveryMethod
    deliveryGroups(channelId: String!): [DeliveryCredentialGroup!]!
  }

  extend type Mutation {
    applyDeliveryMethod(orderId: ID!, deliveryMethodId: ID!): Order!
  }

  extend type Order {
    deliveryGroups: [DeliveryCredentialGroup!]!
  }
`;
