export const GET_SERVICE_QUOTATION_INFO = `
query GetServiceQuotationRequestor($quotationId:ID!) {
  serviceRequests(where: {
    quotations:{
      have:{
        objectId:{
          equalTo:$quotationId
        }
      }
    }
  }) {
    edges {
      node {
        objectId
        requester {         
          objectId
          id
          firstName
          lastName
        }
        service {
          name
          objectId
        }
        society {
          name
          objectId
        }
        quotations {
          edges {
            node {
              objectId
            }
          }
        }
      }
    }
  }
}
`;
