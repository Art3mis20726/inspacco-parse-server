export const GET_TASKS_QUERY = `query getTasks(
    $societyId: ID!
    $date: Date!
    $dayOfWeek: Float!
    $dayOfMonth: Float!) {
    serviceSubscriptions(
      where: {
        tasks: { exists: true }
        society: { have: { objectId: { equalTo: $societyId } } }
      }
    ) {
      edges {
        node {
          id
          objectId
          service {
            name
          }
          tasks(
            where: {
              AND: [
                {
                  OR: [
                    { frequency: { equalTo: "DAILY" } }
                    {
                      AND: [
                        { frequency: { equalTo: "WEEKLY" } }
                        { dayInWeek: { equalTo: $dayOfWeek } }
                      ]
                    }
                    {
                      AND: [
                        { frequency: { equalTo: "MONTHLY" } }
                        { dayInMonth: { equalTo: $dayOfMonth } }
                      ]
                    }
                    {
                      AND: [
                        { frequency: { equalTo: "ONCE" } }
                        { startDate: { lessThanOrEqualTo: $date } }
                        { endDate: { greaterThanOrEqualTo: $date } }
                      ]
                    }
                  ]
                }
              ]
            }
          ) {
            count
            edges {
              node {
                objectId
                summary
                description
              }
            }
          }
        }
      }
    }
  }`;