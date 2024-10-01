export const GET_APP_OPEN_COUNT = `
query getAppOpen(
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
        }
      }
    }
  }
`;