export const TASK_ACTIVITY_COUNT_QUERY = `
query getTaskActivityCountBySociety($societyId: ID!, $startDay: Date!, $endDay: Date!) {
    taskActivities(
      where: {serviceSubscription: {have: {society: {have: {objectId: {equalTo: $societyId}}}}}, taskDate: {greaterThanOrEqualTo: $startDay, lessThanOrEqualTo: $endDay}}
    ) {
      count
    }
  }
`;
export const GET_TASK_IDS_BY_SOCIETY_ID = `
query getTaskIdsBySociety($societyid: ID!) {
  serviceSubscriptions(
    where: { society: {have: {objectId: {equalTo: $societyid}}}}
  ) {
    edges {
      node {
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

export const TASK_ACTIVITY_LAST_COPIED_DATE = `
query getTaskActivityCountBySociety($societyId: ID!) {
  taskActivities(
    where: {serviceSubscription: {have: {society: {have: {objectId: {equalTo: $societyId}}}}}}
    order: taskDate_DESC
  ) {
    edges {
      node {
        taskDate
      }
    }
  }
}
`;
