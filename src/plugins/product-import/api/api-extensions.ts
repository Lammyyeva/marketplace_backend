import { gql } from 'graphql-tag';

export const adminApiExtensions = gql`
  type ImportLog implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    rowNumber: Int!
    sku: String
    status: ImportLogStatus!
    message: String!
    suggestedFix: String
  }

  type ImportJob implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    status: ImportJobStatus!
    mode: ImportMode!
    fileName: String!
    totalRows: Int!
    successCount: Int!
    failedCount: Int!
    warningCount: Int!
    skippedCount: Int!
    progress: Int!
    startedAt: DateTime
    completedAt: DateTime
    durationMs: Int
    initiatedBy: String!
    dryRun: Boolean!
    errorMessage: String
    """Path to the generated Excel results report. Null until job completes."""
    reportPath: String
    logs: [ImportLog!]!
  }

  type ImportJobList implements PaginatedList {
    items: [ImportJob!]!
    totalItems: Int!
  }

  type ImageUploadResult {
    matched: Int!
    unmatched: Int!
    total: Int!
    unmatchedFiles: [String!]!
    errors: [String!]!
  }

  type ImportErrorRow {
    rowNumber: Int!
    sku: String
    error: String!
    suggestedFix: String
  }

  enum ImportJobStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
    CANCELLED
  }

  enum ImportMode {
    CREATE
    UPDATE
    UPSERT
  }

  enum ImportLogStatus {
    SUCCESS
    ERROR
    WARNING
    SKIPPED
  }

  input ImportJobListOptions {
    skip: Int
    take: Int
    sort: ImportJobSortParameter
    filter: ImportJobFilterParameter
  }

  input ImportJobSortParameter {
    createdAt: SortOrder
    updatedAt: SortOrder
    fileName: SortOrder
    status: SortOrder
    totalRows: SortOrder
  }

  input ImportJobFilterParameter {
    id: IDOperators
    createdAt: DateOperators
    updatedAt: DateOperators
    status: StringOperators
    mode: StringOperators
    fileName: StringOperators
    initiatedBy: StringOperators
  }

  extend type Query {
    importJobs(options: ImportJobListOptions): ImportJobList!
    importJob(id: ID!): ImportJob
    importJobLogs(jobId: ID!, take: Int, skip: Int): [ImportLog!]!
    importErrorReport(jobId: ID!): [ImportErrorRow!]!
  }

  extend type Mutation {
    uploadProductExcel(mode: ImportMode!, dryRun: Boolean): ImportJob!
    uploadProductImages: ImageUploadResult!
    cancelImportJob(id: ID!): ImportJob!
  }
`;
