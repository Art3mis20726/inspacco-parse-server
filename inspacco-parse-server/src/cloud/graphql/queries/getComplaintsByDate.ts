export const GET_COMPLAINTS_STATUS = ` 
query getIncidents(
  $startDate: Date!
  $endDate: Date!
){
  incidents(
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