import { gql } from "graphql-tag";

const commonTypes = gql`
  type SaleInfo {
    saleId: ID!
    price: Int!
    salePercent: Int!
    type: String!
    endDate: DateTime
    totalCountOfSalePrice: Int
    limitCountOfEachOrder: Int
    orderLimit: Int
    neverExpires: Boolean!
  }
`;

export const shopApiExtensions = gql`
  ${commonTypes}

  extend type ProductVariant {
    sale: SaleInfo
  }
`;

export const adminApiExtensions = gql`
  ${commonTypes}

  type VariantSoldCount {
    variantId: ID!
    soldCount: Int!
    remaining: Int
    isExhausted: Boolean!
  }

  extend type Query {
    variantSoldCountsForPromotion(
      promotionId: ID!
      variantIds: [ID!]!
    ): [VariantSoldCount!]!
  }
`;
