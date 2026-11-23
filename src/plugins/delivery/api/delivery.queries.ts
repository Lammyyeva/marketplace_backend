import { gql as graphql } from "@apollo/client";

export const GET_DAYS = graphql(`
  query GetDays($options: DayListOptions) {
    days(options: $options) {
      items {
        id
        code
        type
        enabled
        sort
        dayOffset
        name
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

export const GET_DAY = graphql(`
  query GetDay($id: ID!) {
    day(id: $id) {
      id
      code
      type
      enabled
      sort
      dayOffset
      name
      translations {
        id
        languageCode
        name
      }
    }
  }
`);

export const CREATE_DAY = graphql(`
  mutation CreateDay($input: CreateDayInput!) {
    createDay(input: $input) {
      id
      code
      type
      enabled
      sort
      dayOffset
      name
      translations {
        id
        languageCode
        name
      }
    }
  }
`);

export const UPDATE_DAY = graphql(`
  mutation UpdateDay($input: UpdateDayInput!) {
    updateDay(input: $input) {
      id
      code
      type
      enabled
      sort
      dayOffset
      name
      translations {
        id
        languageCode
        name
      }
    }
  }
`);

export const DELETE_DAY = graphql(`
  mutation DeleteDay($id: ID!) {
    deleteDay(id: $id)
  }
`);

export const GET_DELIVERY_METHODS = graphql(`
  query GetDeliveryMethods($options: DeliveryMethodListOptions) {
    deliveryMethods(options: $options) {
      items {
        id
        code
        name
        description
        enabled
        isDisabled
        sort
        type
        from
        to
        closeTime
        maxCost
        minCost
        limitPrice
        showTime
        translations {
          id
          languageCode
          name
          description
        }
        days {
          id
          name
          code
        }
      }
      totalItems
    }
  }
`);

export const GET_DELIVERY_METHOD = graphql(`
  query GetDeliveryMethod($id: ID!) {
    deliveryMethod(id: $id) {
      id
      code
      name
      description
      enabled
      isDisabled
      sort
      type
      from
      to
      closeTime
      maxCost
      minCost
      limitPrice
      showTime
      translations {
        id
        languageCode
        name
        description
      }
      days {
        id
        name
        code
      }
    }
  }
`);

export const CREATE_DELIVERY_METHOD = graphql(`
  mutation CreateDeliveryMethod($input: CreateDeliveryMethodInput!) {
    createDeliveryMethod(input: $input) {
      id
      code
      name
      description
      enabled
      isDisabled
      sort
      type
      from
      to
      closeTime
      maxCost
      minCost
      limitPrice
      showTime
      translations {
        id
        languageCode
        name
        description
      }
      days {
        id
        name
        code
      }
    }
  }
`);

export const UPDATE_DELIVERY_METHOD = graphql(`
  mutation UpdateDeliveryMethod($input: UpdateDeliveryMethodInput!) {
    updateDeliveryMethod(input: $input) {
      id
      code
      name
      description
      enabled
      isDisabled
      sort
      type
      from
      to
      closeTime
      maxCost
      minCost
      limitPrice
      showTime
      translations {
        id
        languageCode
        name
        description
      }
      days {
        id
        name
        code
      }
    }
  }
`);

export const DELETE_DELIVERY_METHOD = graphql(`
  mutation DeleteDeliveryMethod($id: ID!) {
    deleteDeliveryMethod(id: $id)
  }
`);

export const TOGGLE_DELIVERY_METHOD = graphql(`
  mutation ToggleDeliveryMethod($id: ID!) {
    editButtonState(id: $id) {
      id
      code
      name
      description
      enabled
      isDisabled
      sort
      type
      from
      to
      closeTime
      maxCost
      minCost
      limitPrice
      showTime
      translations {
        id
        languageCode
        name
        description
      }
      days {
        id
        name
        code
      }
    }
  }
`);
