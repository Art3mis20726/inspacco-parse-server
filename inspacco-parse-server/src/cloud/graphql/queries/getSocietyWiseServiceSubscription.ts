export const GET_SOCIETY_WISE_SERVICE_SUBSCRIPTION = `
query getActiveServiceSubscriptionsForSociety($societyId: ID! $serviceId:ID!){
    serviceSubscriptions(
      where: {
        society: { have: { objectId: { equalTo: $societyId } } }
        service: { have: { objectId: { equalTo:  $serviceId} } }
      }
    ) {
      edges {
        node {
          id
          objectId
          service {
            id
            objectId
            name
          }
        }
      }
    count
    }
  }
`;