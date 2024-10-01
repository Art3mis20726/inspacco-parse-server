// export const GET_TASK_FOR_REPORT = `
//     query getTaskReport(
//       $societyId: ID!
//       $serviceId: ID!
//       $status: [String]
//       $startDate: Date!
//       $endDate: Date!
//       $recordCount: Int
//     )  {
//       taskActivities(
//         where: {
//          serviceSubscription:
//           {have:
//             {service: {have: {objectId: {equalTo: $serviceId}}}
//             society: {have: {objectId: {equalTo:  $societyId}}}
//                status: {in: $status}
//             }
//         }
//         taskDate: {
//               lessThanOrEqualTo: $endDate
//              greaterThanOrEqualTo: $startDate
//             }
//         }
//         first: $recordCount
//         order: updatedAt_DESC
//       ) {
//         edges {
//           node {
//             objectId
//             createdAt
//             updatedAt
//             createdBy{
//               objectId
//               firstName
//               lastName
//             }
//             updatedBy{
//               objectId
//               firstName
//               lastName
//             }
//             task {
//               id
//               summary
//               frequency
//               assignedTo {
//                 id
//                 firstName
//                 lastName
//               }
//             }
//             activityHistory{
//               edges{
//                 node{
//                   objectId
//                   action
//                   value
//                   createdAt
//                   createdBy {
//                     objectId
//                     firstName
//                     lastName
//                   }
//                 }
//               }
//             }
//             attachments{
//               edges{
//                 node{
//                   url
//                 }
//               }
//             }
//             serviceSubscription{
//               society{
//                 objectId
//                 name
//               }
//               service{
//                 name
//                 status
//               }
//               startDate
//               endDate
//             }
//             comment
//             taskStatus
//             taskDate
            
//           }
          
          
           
//           }
//         }
//       }
// `;
export const GET_TASK_FOR_REPORT_FOR_MULTIPLE_SOCIETIES = `
    query getTaskReport(
      $societyId: [ID]!
      $serviceId: [ID]!
      $status: [String]
      $startDate: Date!
      $endDate: Date!
      $recordCount: Int
    )  {
      taskActivities(
        where: {
         serviceSubscription:
          {have:
            {service: {have: {objectId: {in: $serviceId}}}
            society: {have: {objectId: {in:  $societyId}}}
               status: {in: $status}
            }
        }
        taskDate: {
              lessThanOrEqualTo: $endDate
             greaterThanOrEqualTo: $startDate
            }
        }
        first: $recordCount
        order: updatedAt_DESC
      ) {
        edges {
          node {
            objectId
            createdAt
            updatedAt
            createdBy{
              objectId
              firstName
              lastName
            }
            updatedBy{
              objectId
              firstName
              lastName
            }
            task {
              id
              summary
              frequency
              assignedTo {
                id
                firstName
                lastName
              }
            }
            activityHistory{
              edges{
                node{
                  objectId
                  action
                  value
                  createdAt
                  createdBy {
                    objectId
                    firstName
                    lastName
                  }
                }
              }
            }
            attachments{
              edges{
                node{
                  url
                }
              }
            }
            serviceSubscription{
              society{
                objectId
                name
              }
              service{
                name
                status
              }
              startDate
              endDate
            }
            comment
            taskStatus
            taskDate
            
          }
          
          
           
          }
        }
      }
`;
export const GET_TASK_FOR_REPORT = `
query getTaskReport($taskIds: [ID]!, $startDate: Date!, $endDate: Date!, $recordCount: Int) {
  taskActivities(
    where: { 
      taskDate: {
        lessThanOrEqualTo: $endDate,
        greaterThanOrEqualTo: $startDate
      },
      task: {
        have: {objectId: {in: $taskIds } }
      }
    },
    first: $recordCount,
    order: updatedAt_DESC
  ) {
    edges {
      node {
        objectId
        createdAt
        updatedAt
        createdBy {
          objectId
          firstName
          lastName
        }
        updatedBy {
          objectId
          firstName
          lastName
        }
        task {
          id
          summary
          startDate
          endDate
          frequency
          objectId
          category
          assignedTo {
            id
            firstName
            lastName
          }
        }
        activityHistory {
          edges {
            node {
              objectId
              action
              value
              createdAt
              createdBy {
                objectId
                firstName
                lastName
              }
            }
          }
        }
        comment
        taskStatus
        attachments {
          edges {
            node {
              url
            }
          }
        }
      }
    }
  }
}

`;
export const GET_TASKS_BY_SERVICE_SUBSCRIPTION_QUERY = `
query getTaskIdsBySrerviceSubscriptionQuery($societyId: [ID!],$serviceId: [ID!]) {
  serviceSubscriptions(
    where:  {service: {have: {objectId: {in: $serviceId}}}, society: {have: {objectId: {in: $societyId}}}}
  ) {
    edges {
      node {
        society {
          name
          objectId
        }
        service {
          name
          objectId
        }
        tasks {
          edges {
            node {
              objectId
            }
          }
        }
      }
    }
  }
}
`;
export const GET_TASKS_BY_SOCIETY_QUERY = `
query getTaskIdsBySocietyQuery($societyId: [ID!]) {
  societies(
    where:  { objectId:{ in:$societyId } }
  ) {
    edges {
      node {
        name
        tasks {
          edges {
            node {
              objectId
            }
          }
        }
      }
    }
  }
}
`;