import { gql as graphql } from "@apollo/client";

export const GET_BANNERS = graphql(`
  query GetBanners($options: BannerListOptions) {
    banners(options: $options) {
      items {
        id
        createdAt
        updatedAt
        name
        slug
        enabled
        sort
        counter
        redirect
        assets {
          id
          languageCode
          asset {
            id
            preview
          }
        }
        type {
          id
          name
        }
      }
      totalItems
    }
  }
`);

export const GET_BANNER = graphql(`
  query GetBanner($id: ID!) {
    banner(id: $id) {
      id
      name
      slug
      enabled
      sort
      counter
      redirect
      link
      backColor
      btnColor
      startDate
      endDate
      type {
        id
        name
      }
      assets {
        id
        languageCode
        asset {
          id
          preview
        }
      }
      category {
        id
        name
      }
      model {
        id
        name
      }
      products {
        id
        name
        featuredAsset {
          id
          preview
        }
      }
      translations {
        id
        languageCode
        name
      }
    }
  }
`);

export const CREATE_BANNER = graphql(`
  mutation CreateBanner($input: CreateBannerInput!) {
    createBanner(input: $input) {
      id
      name
      slug
    }
  }
`);

export const UPDATE_BANNER = graphql(`
  mutation UpdateBanner($input: UpdateBannerInput!) {
    updateBanner(input: $input) {
      id
      name
      slug
    }
  }
`);

export const DELETE_BANNER = graphql(`
  mutation DeleteBanner($id: ID!) {
    deleteBanner(id: $id) {
      result
      message
    }
  }
`);

export const GET_BANNER_TYPES = graphql(`
  query GetBannerTypes($options: BannerTypeListOptions) {
    bannerTypes(options: $options) {
      items {
        id
        createdAt
        updatedAt
        name
        enabled
        sort
      }
      totalItems
    }
  }
`);

export const GET_BANNER_TYPE = graphql(`
  query GetBannerType($id: ID!) {
    bannerType(id: $id) {
      id
      name
      enabled
      sort
      translations {
        id
        languageCode
        name
      }
    }
  }
`);

export const CREATE_BANNER_TYPE = graphql(`
  mutation CreateBannerType($input: CreateBannerTypeInput!) {
    createBannerType(input: $input) {
      id
      name
    }
  }
`);

export const UPDATE_BANNER_TYPE = graphql(`
  mutation UpdateBannerType($input: UpdateBannerTypeInput!) {
    updateBannerType(input: $input) {
      id
      name
    }
  }
`);

export const DELETE_BANNER_TYPE = graphql(`
  mutation DeleteBannerType($id: ID!) {
    deleteBannerType(id: $id) {
      result
      message
    }
  }
`);

export const GET_FACETS = graphql(`
  query GetFacets($options: FacetListOptions) {
    facets(options: $options) {
      items {
        id
        name
        values {
          id
          name
        }
      }
    }
  }
`);

export const SEARCH_PRODUCTS = graphql(`
  query SearchProducts($input: SearchInput!) {
    search(input: $input) {
      items {
        productId
        productName
        productVariantId
        productVariantName
        productAsset {
          id
          preview
        }
        productVariantAsset {
          id
          preview
        }
        slug
        sku
        priceWithTax {
          ... on PriceRange {
            min
            max
          }
          ... on SinglePrice {
            value
          }
        }
        enabled
      }
      totalItems
    }
  }
`);

export const GET_PRODUCTS_BY_IDS = graphql(`
  query GetProductsByIds($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
        name
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`);

export const GET_ALL_PRODUCTS = graphql(`
  query GetAllProducts($options: AdminFilteredProductListOptions!) {
    getAllProducts(options: $options) {
      items {
        id
        name
        slug
        enabled
        featuredAsset {
          id
          preview
        }
        variants {
          id
          sku
          priceWithTax
          stockLevel
        }
      }
      totalItems
    }
  }
`);

export const GET_MODELS = graphql(`
  query GetModels {
    models {
      items {
        id
        name
      }
      totalItems
    }
  }
`);

export const GET_PRODUCT_IDS_BY_ENABLED = graphql(`
  query GetProductIdsByEnabled($options: ProductListOptions) {
    products(options: $options) {
      items {
        id
      }
      totalItems
    }
  }
`);

export const UPSERT_BANNER_ASSET = graphql(`
  mutation UpsertBannerAsset($input: UpsertBannerAssetInput!) {
    upsertBannerAsset(input: $input) {
      id
      assets {
        id
        languageCode
        asset {
          id
          preview
        }
      }
    }
  }
`);

export const REMOVE_BANNER_ASSET = graphql(`
  mutation RemoveBannerAsset($input: RemoveBannerAssetInput!) {
    removeBannerAsset(input: $input) {
      id
      assets {
        id
        languageCode
        asset {
          id
          preview
        }
      }
    }
  }
`);
