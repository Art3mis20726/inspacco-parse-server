export const GET_SOCIETY_LEVEL_INCIDENTS_FOR_REPORT = `
query getSocietyLevelIncidentsForDashboard(
  $societyId: ID!
  $status: [String]
  $startDate: Date!
  $endDate: Date!
  $recordCount: Int
) {
  incidents(
    where: {
      serviceSubscription: {
        have: { society: { have: { objectId: { equalTo: $societyId } } } }
      }
      createdAt: {
        lessThanOrEqualTo: $endDate
        greaterThanOrEqualTo:$startDate
      }
      status: { in: $status }
    }
    first: $recordCount
    order: updatedAt_DESC
  ) {
    edges {
      node {
        serviceSubscription {
          society{
            name
          }
          service {
            name
          }
        }
        id
        objectId
        category
        createdBy{
          id
          username
          firstName
          lastName
        }
        createdAt
        updatedAt
        category
        priority
        summary
        description
        status
        assignedGroup
        displayId
        comments{
          edges{
            node{
              comment
              objectId
            }
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
        assignee{
          objectId
          username
          firstName
          lastName
        }
      }
    }
  }
}
`;
export const GET_SOCIETY_SERVICE_LEVEL_INCIDENTS_FOR_REPORT = `
query getSocietyLevelIncidentsForDashboard(
  $societyId: ID!
  $status: [String]
  $startDate: Date!
  $endDate: Date!
  $recordCount: Int
  $serviceId: [ID!]
) {
  incidents(
    where: {
      serviceSubscription: {
        have: {service: {have: {objectId: {in: $serviceId}}}, society: { have: { objectId: { equalTo: $societyId } } } }
      }
      createdAt: {
        lessThanOrEqualTo: $endDate
        greaterThanOrEqualTo:$startDate
      }
      status: { in: $status }
    }
    first: $recordCount
    order: updatedAt_DESC
  ) {
    edges {
      node {
        serviceSubscription {
          society{
            name
          }
          service {
            name
          }
        }
        id
        objectId
        category
        createdBy{
          id
          username
          firstName
          lastName
        }
        createdAt
        updatedAt
        category
        priority
        summary
        description
        status
        assignedGroup
        displayId
        comments{
          edges{
            node{
              comment
              objectId
            }
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
        assignee{
          objectId
          username
          firstName
          lastName
        }
      }
    }
  }
}
`;

