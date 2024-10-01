export const GET_SOCIETY_DETAILS = `
 
query societyDetails(
    $id:ID!
){
    serviceRequests(where:{objectId: {equalTo: $id}})
    {
      edges{
        node{
          objectId
          requester{
            firstName
            lastName
          }
          society{
            objectId
            name
          }
        }
      }
    }
}
`;