import { size } from "lodash";
import * as Parse from "parse/node";
import { User } from "parse/node";

export function getRoleByName(roleName: string): Promise<Parse.Role> {
  const q = new Parse.Query(Parse.Role);
  q.equalTo("name", roleName);
  return q.first({useMasterKey: true});
}

export async function findUserRoles(user: User,findRoles?:Array<string>): Promise<any> {
  if(user){
      const q = new Parse.Query(Parse.Role);
      q.equalTo("users", user);

      if(size(findRoles)){
        const queries = [];
        findRoles.forEach(function(role:string){
          const roleQuery = new Parse.Query(Parse.Role);
          roleQuery.equalTo("users", user);
          roleQuery.startsWith('name',role);
          queries.push(roleQuery);
        });
        const mainQuery = Parse.Query.or(...queries);
        const userRole = await mainQuery.find();
        if(userRole){
          return userRole;
        }
      }else{
          const userRole = await q.find();
          if(userRole){
          return userRole;
        }
      }        
  }   
  return null;
}
