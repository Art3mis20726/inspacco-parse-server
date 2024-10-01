export const GET_TASKS_STATUS = `
 
query getTasks(
    $startDate: Date!
    $endDate: Date!
  ){
    taskActivities(
      where:{
        AND: [
            {taskDate: { greaterThanOrEqualTo: $startDate}}
            {taskDate:{ lessThanOrEqualTo: $endDate}}
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
