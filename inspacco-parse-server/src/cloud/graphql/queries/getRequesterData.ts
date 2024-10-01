export const GET_REQUESTER_DATA = `
query GetServiceRequester ($parentId:ID!) {
    serviceRequests(where: {
          objectId:{
            equalTo: $parentId
          }
    }
    ) {
      edges {     
        node {      
        objectId
          requester {
            id
            objectId
            firstName
          }
          service{
            name
          }
          
      }
    }
  }
  }
`;
