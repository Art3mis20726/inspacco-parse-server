export const GET_SOCIETY_MEMBERS = `
query getSocietyMembers($societyId: ID!) {
  societyMembers(
    where: {
      society: { have: { objectId: { equalTo: $societyId} } }
      OR:[
        {type: {notEqualTo: "INSPACCO_KAM" }}
        {type: {equalTo: "SOCIETY_ADMIN"}}
        {type: {equalTo: "SOCIETY_MANAGER"}}
      ]
    }
  ) {
    edges {
      node {
        member {
          objectId
          firstName
          lastName
        }
        type
      }
    }
  }
}
`;
