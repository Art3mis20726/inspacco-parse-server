export const GET_ACTIVITY_HISTORY = `
query getActivitiesHistory(
  $activiityHistoryIds:[ID!]!
  $action:String
) {
  activityHistories(
    where: {
      objectId :{in:$activiityHistoryIds}
      action:{equalTo:$action}
    }
    order: createdAt_DESC
    first: 1
  ) {
    edges {
      node {
        
        createdAt
        createdBy {
          id
          objectId
          firstName
          lastName
        }
        action
        value
      }
    }
  }
}
`;
