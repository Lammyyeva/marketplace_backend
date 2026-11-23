import { graphql } from "@vendure/dashboard";

export const GET_ORDER_DELIVERY_GROUPS = graphql(`
  query GetOrderDeliveryGroups($id: ID!) {
    order(id: $id) {
      id
      deliveryGroups {
        key
        day
        date
        type
        data {
          id
          code
          name
          minCost
          limitPrice
          isDisabled
          type
          showTime
          from
          to
        }
      }
    }
  }
`);

export const SET_DRAFT_ORDER_CUSTOM_FIELDS = graphql(`
  mutation SetDraftOrderCustomFields($orderId: ID!, $input: UpdateOrderInput!) {
    setDraftOrderCustomFields(orderId: $orderId, input: $input) {
      id
      customFields {
        deliveryMethod {
          id
          name
          minCost
        }
      }
    }
  }
`);

export const SET_SHIPPING_METHOD = graphql(`
  mutation SetDraftOrderShippingMethod($orderId: ID!, $shippingMethodId: ID!) {
    setDraftOrderShippingMethod(
      orderId: $orderId
      shippingMethodId: $shippingMethodId
    ) {
      ... on Order {
        id
        shippingWithTax
        totalWithTax
      }
    }
  }
`);

export const GET_SHIPPING_METHODS = graphql(`
  query GetShippingMethods {
    shippingMethods(options: {}) {
      items {
        id
        name
        calculator {
          code
        }
      }
    }
  }
`);

export const APPLY_DELIVERY_METHOD = graphql(`
  mutation ApplyDeliveryMethod($orderId: ID!, $deliveryMethodId: ID!) {
    applyDeliveryMethod(
      orderId: $orderId
      deliveryMethodId: $deliveryMethodId
    ) {
      id
      shippingWithTax
      totalWithTax
      customFields {
        deliveryMethod {
          id
          name
        }
      }
    }
  }
`);
