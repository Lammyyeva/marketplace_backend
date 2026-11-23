import gql from "graphql-tag";

export const likeShopApiExtensions = gql`
  type Like {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    isLike: Boolean!
    productVariant: ProductVariant!
  }

  type LikeResponse {
    success: Boolean!
    message: String!
    like: Like
  }

  extend type Mutation {
    likeProductVariant(productVariantId: ID!): LikeResponse!
  }

  extend type Query {
    myLikes: [Like!]!
  }

  extend type ProductVariant {
    isLiked: Boolean!
  }

  extend type SearchResult {
    isLiked: Boolean!
  }
`;
