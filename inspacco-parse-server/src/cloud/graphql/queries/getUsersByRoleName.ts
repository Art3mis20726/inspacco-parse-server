export const GET_USERS_BY_ROLE_NAME = `query GetUsersByRoleName($roleName: String!) {
    roles(where: {name: {equalTo: $roleName}}) {
      edges {
        node {
          users {
            edges {
              node {
                objectId
                mobileNumber
                firstName
                lastName
              }
            }
          }
        }
      }
    }
  }
  `;
