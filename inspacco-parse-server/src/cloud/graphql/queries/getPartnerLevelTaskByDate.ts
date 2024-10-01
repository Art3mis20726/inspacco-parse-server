export const GET_PARTNER_LEVEL_TASKS_STATUS = `
 
query getTasks(
    $startDate: Date!
    $endDate: Date!
    $selectedSociety: ID!
    $selectedPartner: ID!
  ){
    taskActivities(
      where:{
        AND: [
            {taskDate: { greaterThanOrEqualTo: $startDate}}
            {taskDate:{ lessThanOrEqualTo: $endDate}}
            {serviceSubscription:{have:{society:{have:{objectId:{equalTo: $selectedSociety}}}}}}
            {serviceSubscription:{have:{partner:{have:{objectId:{equalTo: $selectedPartner}}}}}}
        ]      
      }
      first: 2147483647
    ){
      edges{
        node{
        objectId
        taskStatus
        }
      }
    }
  }
`;
