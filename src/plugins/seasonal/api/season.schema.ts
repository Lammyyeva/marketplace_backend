import gql from 'graphql-tag';

export const seasonAdminApiSchema = gql`
    type Season implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        languageCode: LanguageCode!
        name: String!
        slug: String!
        description: String
        startDate: DateTime!
        endDate: DateTime!
        isActive: Boolean!
        translations: [SeasonTranslation!]!
        products(options: ProductListOptions): ProductList!
    }

    type SeasonTranslation implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        languageCode: LanguageCode!
        name: String!
        description: String
    }

    type SeasonList implements PaginatedList {
        items: [Season!]!
        totalItems: Int!
    }

    input CreateSeasonInput {
        translations: [SeasonTranslationInput!]!
        slug: String!
        startDate: DateTime!
        endDate: DateTime!
        isActive: Boolean
    }

    input UpdateSeasonInput {
        id: ID!
        translations: [SeasonTranslationInput!]
        slug: String
        startDate: DateTime
        endDate: DateTime
        isActive: Boolean
    }

    input SeasonTranslationInput {
        id: ID
        languageCode: LanguageCode!
        name: String
        description: String
    }

    extend type Query {
        seasons(options: SeasonListOptions): SeasonList!
        season(id: ID!): Season
        activeSeasons: [Season!]!
        seasonBySlug(slug: String!): Season
        productSeasons(productId: ID!): [Season!]!
    }

    extend type Mutation {
        createSeason(input: CreateSeasonInput!): Season!
        updateSeason(input: UpdateSeasonInput!): Season!
        deleteSeason(id: ID!): DeletionResponse!
        assignProductsToSeason(seasonId: ID!, productIds: [ID!]!): Season!
        removeProductsFromSeason(seasonId: ID!, productIds: [ID!]!): Season!
    }

    input SeasonListOptions

    extend type Product {
        seasons: [Season!]!
    }
`;

export const seasonShopApiSchema = gql`
    type Season implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        languageCode: LanguageCode!
        name: String!
        slug: String!
        description: String
        startDate: DateTime!
        endDate: DateTime!
        isActive: Boolean!
        translations: [SeasonTranslation!]!
        products(options: ProductListOptions): ProductList!
    }

    type SeasonTranslation implements Node {
        id: ID!
        createdAt: DateTime!
        updatedAt: DateTime!
        languageCode: LanguageCode!
        name: String!
        description: String
    }

    extend type Query {
        activeSeasons: [Season!]!
        seasonBySlug(slug: String!): Season
    }
`;
