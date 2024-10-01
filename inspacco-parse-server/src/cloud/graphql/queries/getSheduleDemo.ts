  export const GET_SCHEDULE_DEMO_DATA = `
  query getSheduledDemo(
    $demoId : ID!
  ){
    scehduleDemos(
        where: {
          objectId:{equalTo: $demoId}
        }
      ){
      edges{
        node{
          objectId
          Name
          CompanyName
          MobileNumber
          email
        }
      }
    }
  }
`;
