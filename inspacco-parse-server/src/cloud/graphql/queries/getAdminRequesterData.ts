export const GET_ADMIN_REQUESTER_DATA = `
query GetAdminRequester ($parentId:ID!) {
    partnerServiceRequests(where: {
          objectId:{
            equalTo: $parentId
          }
    }
    ) {
      edges {     
        node {      
        objectId
        service{
            name}
      }
    }
  }
  }
`;
