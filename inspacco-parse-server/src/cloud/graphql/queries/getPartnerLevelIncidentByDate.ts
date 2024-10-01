export const GET_PARTNER_LEVEL_INCIDENT_STATUS = `
 
query getincidents(
    $startDate: Date!
    $endDate: Date!
    $selectedSociety: ID!
    $selectedPartner: ID!
  ){
    incidents(
        where:{
          AND: [
              {createdAt: { greaterThanOrEqualTo:  $startDate}}
              {createdAt:{ lessThanOrEqualTo: $endDate}}
              {serviceSubscription:{have:{partner:{have:{objectId:{equalTo: $selectedPartner}}}}}}
              {serviceSubscription:{have:{society:{have:{objectId:{equalTo: $selectedSociety}}}}}}
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
