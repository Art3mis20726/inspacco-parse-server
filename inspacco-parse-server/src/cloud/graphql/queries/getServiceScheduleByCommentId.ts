export const GET_SERVICE_SCHEDULE_BY_COMMENT_ID = `
query ServiceSubscriptionSchedule($commentId:ID!) {
    serviceSubscriptionSchedules(
      where: { comments: { have: { objectId: { equalTo: $commentId } } } }
    ) {
      edges {
        node {
          objectId
          comments(where: { objectId: { equalTo: $commentId } }) {
            edges {
              node {
                objectId
                comment
                createdBy {
                  objectId
                  firstName
                  lastName
                }
              }
            }
            count
          }
          serviceSubscription {
            objectId
            partner {
              objectId
              name
            }
            service {
              objectId
              name
            }
            society {
              objectId
              name
            }
            createdBy{
              objectId
              firstName
              lastName
            }
          }

        }
      }
    }
  }  
`;
