import { gql as graphql } from "@apollo/client";

export const GET_CATEGORY_TYPES = graphql(`
  query GetCategoryTypes($options: CategoryTypeListOptions) {
    categoryTypes(options: $options) {
      items {
        id
        name
        slug
        enabled
        sort
        iconAsset {
          id
          preview
        }
        imageAsset {
          id
          preview
        }
      }
      totalItems
    }
  }
`);

export const GET_CATEGORY_TYPE = graphql(`
  query GetCategoryType($id: ID!) {
    categoryType(id: $id) {
      id
      name
      slug
      enabled
      sort
      translations {
        id
        languageCode
        name
      }
      iconAsset {
        id
        preview
      }
      imageAsset {
        id
        preview
      }
    }
  }
`);

export const GET_CATEGORIES_BY_TYPE = graphql(`
  query GetCategoriesByType($categoryTypeId: String!) {
    categories(
      options: { filter: { categoryTypeId: { eq: $categoryTypeId } } }
    ) {
      items {
        id
        name
        slug
        parent {
          id
          name
        }
        sort
        # No children field here - fetching flat list to support unlimited depth
      }
      totalItems
    }
  }
`);
export const GET_CATEGORIES_BY_IDS = graphql(`
  query GetCategoriesByIds($ids: [String!]!) {
    categories(options: { filter: { id: { in: $ids } } }) {
      items {
        id
        name
        categoryType {
          id
          name
        }
      }
    }
  }
`);
// Fetch all categories with basic info, supports filtering by type or parent
export const GET_CATEGORIES = graphql(`
  query GetCategories($options: CategoryListOptions) {
    categories(options: $options) {
      items {
        id
        name
        slug
        sort
        enabled
        parent {
          id
        }
        categoryType {
          id
          name
        }
        featuredAsset {
          id
          preview
        }
        iconAsset {
          id
          preview
        }
        # Include children count or children if small, but let's stick to parentId for manual tree building
        children {
          id
        }
      }
      totalItems
    }
  }
`);
export const GET_CATEGORY = graphql(`
  query GetCategory($id: ID!) {
    category(id: $id) {
      id
      name
      slug
      sort
      enabled
      parent {
        id
        name
      }
      categoryType {
        id
        name
      }
      featuredAsset {
        id
        preview
      }
      iconAsset {
        id
        preview
        name
      }
      translations {
        id
        languageCode
        name
      }
    }
  }
`);

export const CREATE_CATEGORY = graphql(`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      slug
      enabled
      translations {
        id
        languageCode
        name
      }
    }
  }
`);

export const UPDATE_CATEGORY = graphql(`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      id
      name
      slug
      enabled
      translations {
        id
        languageCode
        name
      }
    }
  }
`);

export const DELETE_CATEGORY = graphql(`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      result
      message
    }
  }
`);

export const CREATE_CATEGORY_TYPE = graphql(`
  mutation CreateCategoryType($input: CreateCategoryTypeInput!) {
    createCategoryType(input: $input) {
      id
      name
      slug
      enabled
      sort
      iconAsset {
        id
        preview
      }
      imageAsset {
        id
        preview
      }
    }
  }
`);

export const UPDATE_CATEGORY_TYPE = graphql(`
  mutation UpdateCategoryType($input: UpdateCategoryTypeInput!) {
    updateCategoryType(input: $input) {
      id
      name
      slug
      enabled
      sort
      iconAsset {
        id
        preview
      }
      imageAsset {
        id
        preview
      }
    }
  }
`);

export const DELETE_CATEGORY_TYPE = graphql(`
  mutation DeleteCategoryType($id: ID!) {
    deleteCategoryType(id: $id) {
      result
      message
    }
  }
`);

export const GET_CATEGORY_TREE = graphql(`
  query GetCategoryTree($categoryTypeId: ID) {
    categoryTree(categoryTypeId: $categoryTypeId) {
      id
      name
      slug
      sort
      enabled
      categoryType {
        id
        name
      }
      featuredAsset {
        id
        preview
      }
      iconAsset {
        id
        preview
      }
      children {
        id
        name
        slug
        sort
        enabled
        iconAsset {
          id
          preview
        }
        children {
          id
          name
          slug
          sort
          enabled
        iconAsset {
          id
          preview
        }
          children {
            id
            name
            slug
            sort
            enabled
        iconAsset {
          id
          preview
        }
            children {
              id
              name
              slug
              sort
              enabled
        iconAsset {
          id
          preview
        }
              children {
                id
                name
                slug
                sort
                enabled
        iconAsset {
          id
          preview
        }
                children {
                  id
                  name
                  slug
                  sort
                  enabled
        iconAsset {
          id
          preview
        }
                  children {
                    id
                    name
                    slug
                    sort
                    enabled
        iconAsset {
          id
          preview
        }
                    children {
                      id
                      name
                      slug
                      sort
                      enabled
        iconAsset {
          id
          preview
        }
                      children {
                        id
                        name
                        slug
                        sort
                        enabled
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);
