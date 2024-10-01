export const GET_SOCIETIES_FOR_DAILY_REPORT = `
  query getSocietiesForDailyReport(
    $startDate: Date!
    $endDate: Date!
    $recordCount: Int
  ) {
    societies(
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
          id
          objectId
          displayId
          name
          addressLine1
          addressLine2
          area
          city
          state
          pincode
          status
          createdAt
          updatedAt
          amenities {
            ... on Element {
              value
            }
          }
        }
      }
    }
  }
`;
