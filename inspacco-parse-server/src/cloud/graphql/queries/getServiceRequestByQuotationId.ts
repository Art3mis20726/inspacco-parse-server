export const GET_SERVICE_REQUEST_BY_QUOTATION_ID = `
query getServiceRequestByQuotationId($quotationId: ID!) {
  serviceRequests(
    where: { quotations: { have: { objectId: { equalTo: $quotationId } } } }
  ) {
    edges {
      node {
        id
        objectId
        createdAt
        updatedAt
        status
        service {
          id
          objectId
          name
        }
        quotations {
          edges {
            node {
              id
              objectId
            }
          }
        }
      }
    }
  }
}
`;
