import gql from "graphql-tag";

export const GET_WORKERS = gql`
  query GetWorkers($options: WorkerListOptions) {
    workers(options: $options) {
      items {
        id
        createdAt
        updatedAt
        firstName
        lastName
        username
        phone
        erpCode
        note
        sort
        enabled
        role
        vehicle
        vehiclePlate
        address
        externalCode
      }
      totalItems
    }
  }
`;

export const GET_WORKER = gql`
  query GetWorker($id: ID!) {
    worker(id: $id) {
      id
      firstName
      lastName
      username
      phone
      erpCode
      note
      sort
      enabled
      role
      vehicle
      vehiclePlate
      address
      externalCode
    }
  }
`;

export const CREATE_WORKER = gql`
  mutation CreateWorker($input: CreateWorkerInput!) {
    createWorker(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

export const UPDATE_WORKER = gql`
  mutation UpdateWorker($id: ID!, $input: UpdateWorkerInput!) {
    updateWorker(id: $id, input: $input) {
      id
      firstName
      lastName
    }
  }
`;

export const DELETE_WORKER = gql`
  mutation DeleteWorker($id: ID!) {
    deleteWorker(id: $id) {
      result
      message
    }
  }
`;

export const ASSIGN_COURIER_TO_ORDER = gql`
  mutation AssignCourierToOrder($orderId: ID!, $courierId: ID!) {
    assignCourierToOrder(orderId: $orderId, courierId: $courierId) {
      id
      customFields {
        assignedCourierId
      }
      courier {
        id
        firstName
        lastName
      }
    }
  }
`;

export const UNASSIGN_COURIER_FROM_ORDER = gql`
  mutation UnassignCourierFromOrder($orderId: ID!) {
    unassignCourierFromOrder(orderId: $orderId) {
      id
      customFields {
        assignedCourierId
      }
      courier {
        id
      }
    }
  }
`;
