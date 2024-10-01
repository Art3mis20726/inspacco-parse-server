export const GET_PARTNER_SERVICE_REQUESTS_FOR_DAILY_REPORT = `
  query getPartnerServiceRequestsForDailyReport(
    $startDate: Date!
    $endDate: Date!
    $recordCount: Int
  ) {
    partnerServiceRequests(
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
          objectId
        }
      }
    }
  }
`;
