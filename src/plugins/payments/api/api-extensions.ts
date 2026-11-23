import gql from "graphql-tag";

/** Shop API: customers initiate a payment and poll its status. */
export const shopApiExtensions = gql`
  enum PaymentTxnStatus {
    Pending
    Processing
    Authorized
    Paid
    Failed
    Cancelled
    Refunded
    PartiallyRefunded
    Expired
  }

  type InitiatePaymentResult {
    transactionId: ID!
    externalTransactionId: String!
    redirectUrl: String!
  }

  type PaymentStatusResult {
    transactionId: ID!
    orderCode: String!
    status: PaymentTxnStatus!
    amount: Int!
    currency: String!
    externalTransactionId: String
    paidAt: DateTime
  }

  type AvailableGateway {
    code: String!
    name: String!
  }

  type AvailablePaymentGateways {
    onlinePaymentEnabled: Boolean!
    gateways: [AvailableGateway!]!
  }

  extend type Query {
    """
    Online-payment availability for the storefront. Returns the global switch and
    the enabled gateways in display order. When onlinePaymentEnabled is false the
    gateways list is empty and the storefront must hide all online methods.
    """
    availablePaymentGateways: AvailablePaymentGateways!
    paymentStatus(transactionId: ID!): PaymentStatusResult
  }

  extend type Mutation {
    """
    Register a payment with the chosen bank for the active order and return the
    hosted-page redirect URL.
    """
    initiatePayment(gatewayCode: String!): InitiatePaymentResult!

    """
    Re-initiate payment for the active order after a failed/expired attempt,
    returning a fresh hosted-page redirect URL.
    """
    retryPayment(gatewayCode: String!): InitiatePaymentResult!
  }
`;

/** Admin API: full management surface for the Payments dashboard module. */
export const adminApiExtensions = gql`
  enum PaymentTxnStatus {
    Pending
    Processing
    Authorized
    Paid
    Failed
    Cancelled
    Refunded
    PartiallyRefunded
    Expired
  }

  type PaymentGatewayConfig {
    id: ID!
    name: String!
    code: String!
    enabled: Boolean!
    displayOrder: Int!
    configuration: JSON!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type SystemPaymentSettings {
    onlinePaymentEnabled: Boolean!
  }

  type TestConnectionResult {
    ok: Boolean!
    message: String!
  }

  type PaymentStatusHistoryEntry {
    id: ID!
    oldStatus: PaymentTxnStatus
    newStatus: PaymentTxnStatus!
    source: String!
    notes: String
    createdAt: DateTime!
  }

  type PaymentRefundEntry implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    paymentTransactionId: ID!
    amount: Int!
    reason: String
    status: String!
    externalRefundId: String
    initiatedBy: String
  }

  "A payment attempt against an order, mapped 1..n to a Vendure Order."
  type PaymentTransaction implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    orderId: ID!
    orderCode: String!
    customerId: ID
    customerEmail: String
    gatewayCode: String!
    gatewayName: String!
    externalTransactionId: String
    amount: Int!
    currency: String!
    status: PaymentTxnStatus!
    refundedAmount: Int!
    expiresAt: DateTime
    requestPayload: JSON
    responsePayload: JSON
    callbackPayload: JSON
    history: [PaymentStatusHistoryEntry!]!
    refunds: [PaymentRefundEntry!]!
  }

  type PaymentTransactionList implements PaginatedList {
    items: [PaymentTransaction!]!
    totalItems: Int!
  }

  input PaymentTransactionSortParameter {
    id: SortOrder
    createdAt: SortOrder
    updatedAt: SortOrder
    amount: SortOrder
    status: SortOrder
  }

  input PaymentTransactionFilterParameter {
    id: IDOperators
    createdAt: DateOperators
    updatedAt: DateOperators
    orderId: IDOperators
    customerId: IDOperators
    gatewayId: IDOperators
    externalTransactionId: StringOperators
    status: StringOperators
    amount: NumberOperators
    currency: StringOperators
  }

  input PaymentTransactionListOptions {
    skip: Int
    take: Int
    sort: PaymentTransactionSortParameter
    filter: PaymentTransactionFilterParameter
  }

  type PaymentRefundList implements PaginatedList {
    items: [PaymentRefundEntry!]!
    totalItems: Int!
  }

  input PaymentRefundSortParameter {
    id: SortOrder
    createdAt: SortOrder
    amount: SortOrder
  }

  input PaymentRefundFilterParameter {
    id: IDOperators
    createdAt: DateOperators
    status: StringOperators
    paymentTransactionId: IDOperators
  }

  input PaymentRefundListOptions {
    skip: Int
    take: Int
    sort: PaymentRefundSortParameter
    filter: PaymentRefundFilterParameter
  }

  type PaymentAuditLogEntry implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    action: String!
    paymentTransactionId: ID
    actor: String
    sourceIp: String
    payload: JSON
  }

  type PaymentAuditLogList implements PaginatedList {
    items: [PaymentAuditLogEntry!]!
    totalItems: Int!
  }

  input PaymentAuditLogSortParameter {
    id: SortOrder
    createdAt: SortOrder
  }

  input PaymentAuditLogFilterParameter {
    id: IDOperators
    createdAt: DateOperators
    action: StringOperators
    actor: StringOperators
    sourceIp: StringOperators
    paymentTransactionId: IDOperators
  }

  input PaymentAuditLogListOptions {
    skip: Int
    take: Int
    sort: PaymentAuditLogSortParameter
    filter: PaymentAuditLogFilterParameter
  }

  type PaymentKpis {
    totalPayments: Int!
    successfulPayments: Int!
    failedPayments: Int!
    pendingPayments: Int!
    refundAmount: Int!
    netRevenue: Int!
    conversionRate: Float!
  }

  input CreatePaymentGatewayInput {
    name: String!
    code: String!
    enabled: Boolean
    displayOrder: Int
    credentials: JSON!
    configuration: JSON
  }

  input UpdatePaymentGatewayInput {
    id: ID!
    name: String
    enabled: Boolean
    displayOrder: Int
    credentials: JSON
    configuration: JSON
  }

  extend type Query {
    paymentTransactions(options: PaymentTransactionListOptions): PaymentTransactionList!
    paymentTransaction(id: ID!): PaymentTransaction
    paymentTransactionsForOrder(orderId: ID!): [PaymentTransaction!]!
    paymentRefunds(options: PaymentRefundListOptions): PaymentRefundList!
    paymentAuditLogs(options: PaymentAuditLogListOptions): PaymentAuditLogList!
    paymentGateways: [PaymentGatewayConfig!]!
    paymentKpis(dateFrom: DateTime, dateTo: DateTime): PaymentKpis!
    systemPaymentSettings: SystemPaymentSettings!
  }

  extend type Mutation {
    createPaymentGateway(input: CreatePaymentGatewayInput!): PaymentGatewayConfig!
    updatePaymentGateway(input: UpdatePaymentGatewayInput!): PaymentGatewayConfig!
    setPaymentGatewayEnabled(code: String!, enabled: Boolean!): PaymentGatewayConfig!
    reorderPaymentGateways(orderedCodes: [String!]!): [PaymentGatewayConfig!]!
    testPaymentGatewayConnection(code: String!): TestConnectionResult!
    setOnlinePaymentEnabled(enabled: Boolean!): SystemPaymentSettings!
    refundPaymentTransaction(transactionId: ID!, amount: Int!, reason: String!): PaymentRefundEntry!
    cancelPaymentTransaction(transactionId: ID!): Boolean!
    "Re-query the bank for a single transaction and reconcile local state (Verify / Retry Verification)."
    verifyPayment(transactionId: ID!): PaymentTxnStatus!
    "Run a full reconciliation pass across all open transactions (Sync Now)."
    reconcilePayments: Boolean!
    runPaymentReconciliation: Boolean!
  }
`;
