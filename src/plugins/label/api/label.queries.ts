import { gql as graphql } from "@apollo/client";

export const GET_LABELS = graphql(`
  query GetLabels($options: LabelListOptions) {
    labels(options: $options) {
      items {
        id
        name
        code
        color
        enabled
        sort
        featuredAsset {
          id
          name
          preview
        }
        translations {
          id
          languageCode
          name
        }
      }
      totalItems
    }
  }
`);

// export const GET_LABEL = graphql(`
//   query GetLabel($id: ID!) {
//     label(id: $id) {
//       id
//       name
//       code
//       color
//       sort
//       translations {
//         id
//         languageCode
//         name
//       }
//     }
//   }
// `);

export const GET_LABEL = graphql(`
  query GetLabel($id: ID!) {
    label(id: $id) {
      id
      name
      code
      color
      enabled
      sort
      featuredAsset {
        id
        name
        preview
      }
      translations {
        id
        languageCode
        name
      }
    }
  }
`);

export const CREATE_LABEL = graphql(`
  mutation CreateLabel($input: CreateLabelInput!) {
    createLabel(input: $input) {
      id
      name
      code
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

export const UPDATE_LABEL = graphql(`
  mutation UpdateLabel($input: UpdateLabelInput!) {
    updateLabel(input: $input) {
      id
      name
      code
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

export const DELETE_LABEL = graphql(`
  mutation DeleteLabel($id: ID!) {
    deleteLabel(id: $id) {
      result
      message
    }
  }
`);
