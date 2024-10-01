import { getRoleByName } from "../../util/role";
import { ADMIN_ROLES } from "./data/AdminRoles";
export const createAdminRoles = async () => {
  console.log('------------- Import Admin Roles ----------------');
  for await (const role of ADMIN_ROLES) {
    await _createAdminRole(role);
  }
};

const _createAdminRole = async (newRole: {name: string;childRole: string[];}) => {

  const Role = Parse.Object.extend('_Role');
  // Check if the admin role already exists
  const existinAgdminRole = await new Parse.Query(Role)
    .equalTo('name', newRole.name)
    .first();
  // If the admin role already exists we have nothing to do here
  if (existinAgdminRole) {
    console.log(`Role ${newRole.name} already exists.`);
    return;
    // If the admin role does not exist create it and set the ACLs
  } else {
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    const adminRole:Parse.Role = new Role();
    adminRole.set('name', newRole.name);
    adminRole.setACL(acl);
    if(newRole.childRole){
      for (let i =0; i < newRole.childRole.length; i++) {
        const childRole = newRole.childRole[i];
        const roleRecord:Parse.Role = await getRoleByName(childRole);
        adminRole.getRoles().add(roleRecord);    
      }
    }
    await adminRole.save({}, { useMasterKey: true });
    console.log(`+ Role ${newRole.name} created.`);
  }
};
