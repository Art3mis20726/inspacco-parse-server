export const GET_ATTENDANCE_FOR_DATE = `
  query getAttendance(
    $serviceSubscriptionIds: [ID!]
    $startDate: Date!
    $endDate: Date!
    $recordCount: Int
  ) {
    attendances(
      where: {
        AND: [
          {
            serviceStaff: {
              have: {
                serviceSubscription: {
                  have: { objectId: { in: $serviceSubscriptionIds } }
                }
              }
            }
          }
          { date: { greaterThanOrEqualTo: $startDate } }
          { date: { lessThanOrEqualTo: $endDate } }
        ]
      }
      first: $recordCount
    ) {
      edges {
        node {
          id
          objectId
          date
          createdBy{
            objectId
            firstName
            lastName
            
          }
          serviceStaff {
            shift{
              objectId
              shiftType
            }
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
              society{
                name
                objectId
              }
            }
            staff {
              id
              objectId
              firstName
              lastName
              mobileNumber
              profileImage
            }
            type
          }
          mode
          inTime
          outTime
          shift
          isPresent
          isTemporary
          attendanceDetails
        }
      }
    }
  }
`;