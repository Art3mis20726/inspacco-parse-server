export const GET_PARTNER_LEVEL_ATTENDACE_STATUS = `
 
query getAttendances(
    $startDate: Date!
    $endDate: Date!
    $selectedSociety: ID!
    $selectedPartner: ID!
  ){
    attendances(
        where:{
          AND: [
              {createdAt: { greaterThanOrEqualTo: $startDate }}
              {createdAt:{ lessThanOrEqualTo: $endDate}}
            	{serviceStaff:{have:{ serviceSubscription:{have:{partner:{have:{objectId:{equalTo:$selectedPartner}}}}}}}}
              {serviceStaff:{have:{ serviceSubscription:{have:{society:{have:{objectId:{equalTo: $selectedSociety}}}}}}}}
          ]      
        }
        first: 2147483647
      ){
        edges{
          node{
          objectId
            isPresent
            serviceStaff{
              objectId
              serviceSubscription{
                partner{
                  objectId
                  name
                }
                service{
                  objectId
                  name
                }
              }
            }
          }
        }
    count
      }
  }
  `;
