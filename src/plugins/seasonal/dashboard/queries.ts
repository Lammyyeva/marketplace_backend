import { gql } from 'graphql-tag';

export const GET_SEASON = gql`
    query GetSeason($id: ID!) {
        season(id: $id) {
            id
            slug
            startDate
            endDate
            isActive
            name
            description
            translations {
                id
                languageCode
                name
                description
            }
            products(options: { take: 100 }) {
                items {
                    id
                    name
                    featuredAsset {
                        preview
                    }
                }
                totalItems
            }
        }
    }
`;

export const CREATE_SEASON = gql`
    mutation CreateSeason($input: CreateSeasonInput!) {
        createSeason(input: $input) {
            id
            name
        }
    }
`;

export const UPDATE_SEASON = gql`
    mutation UpdateSeason($input: UpdateSeasonInput!) {
        updateSeason(input: $input) {
            id
            name
        }
    }
`;

export const ASSIGN_PRODUCTS = gql`
    mutation AssignProducts($seasonId: ID!, $productIds: [ID!]!) {
        assignProductsToSeason(seasonId: $seasonId, productIds: $productIds) {
            id
        }
    }
`;

export const REMOVE_PRODUCTS = gql`
    mutation RemoveProducts($seasonId: ID!, $productIds: [ID!]!) {
        removeProductsFromSeason(seasonId: $seasonId, productIds: $productIds) {
            id
        }
    }
`;

export const SEARCH_PRODUCTS = gql`
    query SearchProducts($input: SearchInput!) {
        search(input: $input) {
            items {
                productId
                productName
                slug
                enabled
                productAsset {
                    id
                    preview
                }
                sku
                priceWithTax {
                    ... on PriceRange {
                        min
                    }
                    ... on SinglePrice {
                        value
                    }
                }
            }
            totalItems
        }
    }
`;

export const GET_ALL_PRODUCTS = gql`
    query GetAllProducts($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                name
                enabled
                featuredAsset {
                    id
                    preview
                }
                variants {
                    id
                    name
                    sku
                    priceWithTax
                }
            }
            totalItems
        }
    }
`;


export const GET_ALL_SEASONS = gql`
    query GetAllSeasons {
        seasons(options: { take: 100 }) {
            items {
                id
                name
                isActive
            }
            totalItems
        }
    }
`;

export const GET_PRODUCT_SEASONS = gql`
    query GetProductSeasons($productId: ID!) {
        productSeasons(productId: $productId) {
            id
            name
            isActive
        }
    }
`;
export const DELETE_SEASON = gql`
    mutation DeleteSeason($id: ID!) {
        deleteSeason(id: $id) {
            result
        }
    }
`;
