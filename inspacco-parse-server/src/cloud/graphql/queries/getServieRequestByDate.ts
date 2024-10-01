export const GET_SERVICE_REQUEST_STATUS = `
 
query getServiceRequest(
  $startDate: Date!
  $endDate: Date!
){
  serviceRequests(
    where:{
      AND: [
          {createdAt: { greaterThanOrEqualTo: $startDate}}
          {createdAt:{ lessThanOrEqualTo: $endDate}}
      ]      
    }
    first: 2147483647
  ){
    edges{
      node{
      objectId
      status
      }
    }
  }
}
`;
