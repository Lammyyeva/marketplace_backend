import gql from "graphql-tag";

export const adminApiExtensions = gql`
  enum WorkerRole {
    Courier
  }

  type Worker implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    firstName: String!
    lastName: String
    username: String!
    phone: String!
    erpCode: String
    note: String
    sort: Int!
    enabled: Boolean!
    role: WorkerRole!
    vehicle: String
    vehiclePlate: String
    address: String
    externalCode: String
  }

  type WorkerList implements PaginatedList {
    items: [Worker!]!
    totalItems: Int!
  }

  # Options for workers query
  input WorkerListOptions {
    skip: Int
    take: Int
    sort: WorkerSortParameter
    filter: WorkerFilterParameter
  }

  input WorkerSortParameter {
    id: SortOrder
    createdAt: SortOrder
    firstName: SortOrder
    sort: SortOrder
    enabled: SortOrder
  }

  input WorkerFilterParameter {
    firstName: StringOperators
    lastName: StringOperators
    phone: StringOperators
    erpCode: StringOperators
    enabled: BooleanOperators
    role: StringOperators
  }

  input CreateWorkerInput {
    firstName: String!
    lastName: String
    username: String!
    password: String!
    phone: String!
    erpCode: String
    note: String
    sort: Int
    enabled: Boolean
    role: WorkerRole
    vehicle: String
    vehiclePlate: String
    address: String
    externalCode: String
  }

  input UpdateWorkerInput {
    firstName: String
    lastName: String
    username: String
    password: String
    phone: String
    erpCode: String
    note: String
    sort: Int
    enabled: Boolean
    role: WorkerRole
    vehicle: String
    vehiclePlate: String
    address: String
    externalCode: String
  }

  extend type Query {
    workers(options: WorkerListOptions): WorkerList!
    worker(id: ID!): Worker
  }

  extend type Mutation {
    createWorker(input: CreateWorkerInput!): Worker!
    updateWorker(id: ID!, input: UpdateWorkerInput!): Worker!
    deleteWorker(id: ID!): DeletionResponse!
    assignCourierToOrder(orderId: ID!, courierId: ID!): Order!
    unassignCourierFromOrder(orderId: ID!): Order!
  }

  extend type Order {
    courier: Worker
  }
`;

export const shopApiExtensions = gql`
  type Worker {
    id: ID!
    firstName: String!
    lastName: String
    phone: String!
    vehicle: String
    vehiclePlate: String
  }

  extend type Order {
    courier: Worker
  }
`;
