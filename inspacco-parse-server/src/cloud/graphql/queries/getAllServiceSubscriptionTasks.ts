export const GET_ALL_SERVICE_SUBSCRIPTION_TASKS = `query getTasks(
    $date: Date!
    $dayOfWeek: Float!
    $dayOfMonth: Float!) {
    serviceSubscriptions(
      where: {
        tasks: { exists: true }
        startDate: { lessThanOrEqualTo: $date }
        endDate: { greaterThanOrEqualTo: $date }
      }
      first: 2147483647
    ) {
      edges {
        node {
          id
          objectId
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
            first: 2147483647
          ) {
            edges {
              node {
                objectId
                frequency
                createdBy {
                  objectId
                }
              }
            }
          }
        }
      }
    }
  }`;

  export const GET_ALL_SOCIETY_TASKS = `query getTasks(
    $date: Date!
    $dayOfWeek: Float!
    $dayOfMonth: Float!) {
    societies(
      where: {
        tasks: { exists: true }
        startDate: { lessThanOrEqualTo: $date }
        endDate: { greaterThanOrEqualTo: $date }
      }
      first: 2147483647
    ) {
      edges {
        node {
          id
          objectId
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
            first: 2147483647
          ) {
            edges {
              node {
                objectId
                frequency
                createdBy {
                  objectId
                }
              }
            }
          }
        }
      }
    }
  }`;