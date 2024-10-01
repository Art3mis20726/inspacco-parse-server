export const GET_SERVICE_SUBSCRIPTION_DETAILS = `
query getServiceSubscription($id: ID!) {
  serviceSubscription(id: $id) {
    objectId
    society {
      id
      objectId
      name
    }
    partner {
      id
      objectId
      name
    }
    service {
      id
      objectId
      name
    }
  }
}
`;
