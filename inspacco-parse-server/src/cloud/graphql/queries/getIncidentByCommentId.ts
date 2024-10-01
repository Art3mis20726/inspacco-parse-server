export const GET_INCIDENT_BY_COMMENT_ID = `
query Incidents($commentId:ID!) {
    incidents(
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
          }
          assignee {
            objectId
            firstName
            lastName
          }
          displayId
        }
      }
    }
  }  
`;
