export const GET_SERVICE_SUBSCRIPTION = `
query getServiceSubscription($id: ID!) {
  serviceSubscription(id: $id) {
    objectId
    society {
      objectId
      name
    }
    partner {
      objectId
      name
    }
    service {
      objectId
      name
    }
  }
}
`;
