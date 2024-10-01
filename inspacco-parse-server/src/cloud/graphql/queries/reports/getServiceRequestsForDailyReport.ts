export const GET_SERVICE_REQUESTS_FOR_DAILY_REPORT = `
  query getServiceRequestsForDailyReport(
    $startDate: Date!
    $endDate: Date!
    $recordCount: Int
  ) {
    serviceRequests(
      where: {
        createdAt: {
          lessThanOrEqualTo: $endDate
          greaterThanOrEqualTo: $startDate
        }
      }
      first: $recordCount
      order: updatedAt_DESC
    ) {
      edges {
        node {
          service {
            name
          }
          society {
            name
          }
          requester {
            firstName
            lastName
            mobileNumber
          }
          id
          objectId
          createdAt
          updatedAt
          requirement
          status
          displayId
          comments{
            edges{
              node{
                comment
                objectId
              }
            }
          }
        }
      }
    }
  }
`;
