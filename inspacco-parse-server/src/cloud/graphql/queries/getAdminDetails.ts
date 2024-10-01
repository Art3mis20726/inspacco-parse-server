export const GET_SOCIETY_ADMIN_DETAILS = `
 
query getSocietyAdminDetails(
    $id:ID!
){
    societyMembers(where:{
       type:{equalTo:"SOCIETY_ADMIN"}
       society:{
         have:{
           objectId:{
             equalTo: $id
           }
         }
       }
     })
     {
       edges{
         node{
           objectId
           type
           subtype
           member {
            id
            objectId
             firstName
             lastName
          }
         }
       }
     }
   }
`;