export const GET_PARTNERS_FOR_DAILY_REPORT = `
  query getPartnersForDailyReport(
    $startDate: Date!
    $endDate: Date!
    $recordCount: Int
  ) {
    partners(
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
          description
          website
          email
          mobileNumber
          fullAddress
          serviceNames
          gstNumber
          pan
          experience
          numberOfClients
          estd
          annualTurnover
          createdAt
          updatedAt
        }
      }
    }
  }
`;
