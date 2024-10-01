export const GET_ACTIVE_USERS = `
query getActiveUsers(
    $startDate: Date!
    $endDate: Date!
  ){
    userActivities(
      where:{
        AND: [
            {foregroundTime: { greaterThanOrEqualTo: $startDate}}
            {foregroundTime: { lessThanOrEqualTo: $endDate}}
        ]      
      }
      first: 2147483647
    ){
      edges{
        node{
        objectId
        userType
        userId
        }
      }
    }
  }
`;