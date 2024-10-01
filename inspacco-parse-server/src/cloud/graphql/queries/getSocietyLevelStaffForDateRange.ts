export const GET_SOCIETY_LEVEL_STAFF_FOR_DATE_RANGE = `
  query getServiceStaffForDate(
    $societyId: ID!
    $startDate: Date!
    $endDate: Date!
    $recordCount: Int
  ) {
    serviceStaffs(
      where: {
        AND: [
          {
            serviceSubscription: {
              have: { society: { have: { objectId: { equalTo: $societyId } } } }
            }
          }
          {
            serviceSubscription: {
              have: {
                service: { have: { requireAttendance: { equalTo: true } } }
              }
            }
          }
          {
            OR: [
              { startDate: { lessThanOrEqualTo: $startDate } }
              { startDate: { greaterThanOrEqualTo: $startDate } }
            ]
          }
          { endDate: { greaterThanOrEqualTo: $endDate } }
        ]
      }
      first: $recordCount
    ) {
      edges {
        node {
          id
          objectId
          serviceSubscription {
            id
            objectId
            service {
              id
              objectId
              status
              name
              displayOrder
              requireAttendance
            }
          }
        }
      }
    }
  }
`;
export const GET_SOCIETY_LEVEL_STAFF_BY_SERVICE_SUBSCRIPTION_FOR_DATE_RANGE = `
query getServiceStaffForDate(
  $serviceSubscriptionIds: [ID!]!
  $startDate: Date!
  $endDate: Date!
  $recordCount: Int
) {
  serviceStaffs(
    where: {
      AND: [
        {
          serviceSubscription: {
            have:  { objectId: { in: $serviceSubscriptionIds } } }
          }
        
        {
          serviceSubscription: {
            have: {
              service: { have: { requireAttendance: { equalTo: true } } }
            }
          }
        }
        {
          OR: [
            { startDate: { lessThanOrEqualTo: $startDate } }
            { startDate: { greaterThanOrEqualTo: $startDate } }
          ]
        }
        { endDate: { greaterThanOrEqualTo: $endDate } }
      ]
    }
    first: $recordCount
  ) {
    edges {
      node {
        id
        objectId
        serviceSubscription {
          id
          objectId
          service {
            id
            objectId
            status
            name
            displayOrder
            requireAttendance
          }
        }
      }
    }
  }
}
`;
