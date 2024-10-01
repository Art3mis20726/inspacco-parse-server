export const GET_ATTACHMENT_DATA = `
query GetPartnerServiceQuotationDocument ($id:ID!) {
    attachments(where: {
          objectId:{
            equalTo:$id
          }
    }
    ) {
      edges {     
        node {      
        objectId
          name
          parentId
          module
          permissionGroupId
          url
          
      }
    }
  }
  }
`;
