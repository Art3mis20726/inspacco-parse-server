export const GET_QUOTATION = `
query getServiceRequest($serviceRequestId: ID!, $quotationId: ID!) {
  serviceRequest(id: $serviceRequestId) {
    id
    objectId
    status
    createdAt
    updatedAt
    society {
      name
      area
      city
    }
    service {
      name
      objectId
    }
    requester {
      firstName
      lastName
      mobileNumber
    }
    quotations(where: { objectId: { equalTo: $quotationId } }) {
      edges {
        node {
          id
          objectId
          createdAt
          updatedAt
          discount
          tax
          otherCharges
          margin
          totalAmount
          note
          status
          displayId
          actualAmount
          items(order: serialNumber_ASC) {
            edges {
              node {
                id
                objectId
                serialNumber
                rate
                displayId
                quantity
                amount
                comment
                serviceDescription
              }
            }
          }
        }
      }
    }
  }
}

`;
