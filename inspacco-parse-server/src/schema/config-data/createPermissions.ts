import { size } from "lodash";
import { getRoleByName } from "../../util/role";
import { IPermissionData, permissions } from "./data/Permissions";


export const createPermissions = async () => {
    console.log('------------- Import Permissions ----------------');
      for await (const document of permissions) {
        await _createPermission(document);
      }
};

 const _createPermission = async (permission: IPermissionData) => {
    const Permission = Parse.Object.extend('Permission');
  // Check if the collection already exists
   const isPresent = await new Parse.Query(Permission).equalTo('action', permission.action).equalTo('resourceClass',permission.resourceClass).first({ useMasterKey: true });
    if(size(isPresent)){
        console.log(`Permission ${permission.resourceClass}:${permission.action} already exists`);
        return;
    }else{
        const newPermission = new Permission();
        newPermission.set('action',permission.action);
        newPermission.set('resourceClass',permission.resourceClass);
        newPermission.set('description',permission.description);
        const relation = newPermission.relation('roles');
        for(const role_name of permission.roles){
            const role:Parse.Role = await getRoleByName(role_name);
            if(role){
                relation.add(role);
            }           
        }  
        await newPermission.save(null, { useMasterKey: true });
        console.log(`Permission ${permission.action}:${permission.resourceClass} is created`);
    }
 };