export const GET_USERS_PROFILE_PIC = `
query getUserProfilePic($userId: ID!){
  user(id:$userId){
    profilePicture
  }
}
`;