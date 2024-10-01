export const GET_INSPACCO_KAM_FOR_SOCIETY = `
query getInspaccoKAM($societyId: ID!) {
  societyMembers(
    where: {
      society: { have: { objectId: { equalTo: $societyId } } }
      type: { equalTo: "INSPACCO_KAM" }
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
