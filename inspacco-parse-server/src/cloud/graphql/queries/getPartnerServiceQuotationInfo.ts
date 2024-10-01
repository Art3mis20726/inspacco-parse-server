export const GET_PARTNER_SERVICE_QUOTATION_INFO = `
query GetPartnerServiceQuotationRequestor($quotationId:ID!) {
  partnerServiceRequests(where: {
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
        service {
          name
          objectId
        }
        partner {
          objectId
          name
        }
      }
    }
  }
}
`;
