import * as Parse from 'parse/node';
import { COLLECTIONS, ROLES } from '../../constants/common';
import { getNextSequence } from '../../util/displayId';
import { getUser, getUserById, getUserByUserName, linkUser, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import { getSaveOrQueryOption, getSchemaQuery } from '../../util';
// import { IUser } from 'src/schema/config-data/data/SystemUsers';

//create role and assign

const assignRoleToStaffMember = async (user: any, societyId: any) => {
  const qUser = new Parse.Query(Parse.User);
  qUser.equalTo('objectId', user.id);
  const userData = await qUser.first({ useMasterKey: true });

  const qRole = new Parse.Query(Parse.Role);
  qRole.equalTo('name', `SOCIETY_STAFF__${societyId}`);
  const roleRecord = await qRole.first({ useMasterKey: true });
  if(roleRecord){
    console.log('role records start here');
   console.log(roleRecord.toJSON());
   roleRecord.getUsers().add(userData);
   await roleRecord.save(null, { useMasterKey: true });
  }
  
};
const updatePermissionForPartnerStaffUser = async (
  user: any,
  societyId
) => {
  const acl = user.getACL();
  acl.setRoleWriteAccess(ROLES.SOCIETY_ADMIN + '__' + societyId, true);
  acl.setRoleWriteAccess(ROLES.SOCIETY_MANAGER + '__' + societyId, true);
  user.setACL(acl);
  await user.save(null, { useMasterKey: true });
};

export const beforeSaveSocietyStaffHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (!req.object.id) {
    const societyId = req.object.get('society').toJSON().objectId;

    //create new staff member starts
    const firstName = req.object.get('firstName');
    const lastName = req.object.get('lastName');
    const mobileNumber = req.object.get('mobileNumber');
    const profileImage = req.object.get('profileImage');

     let user  = await  getUserById(req.object.get('user')?.toJSON()?.objectId);
     if(!user){
        const otp: string = Math.floor(Math.random() * 8999 + 1000).toString();
        const userAttribuite = {
            firstName: firstName,
            lastName: lastName,
            profilePicture: profileImage,
          };
        user = await linkUser(mobileNumber, otp, userAttribuite);
    }
    const existingStaff = await getSchemaQuery(COLLECTIONS.SOCIETY_STAFF)(
      { user: user, society: req.object.get('society') },
      null
    );
    if (existingStaff) {
      throw new Parse.Error(
        Parse.Error.VALIDATION_ERROR,
        `Following User ${mobileNumber} already registered`
      );
    }

    req.object.set('user', user);
    await assignRoleToStaffMember(user, societyId);
    //Need Write Access of Partner Staff User
    await updatePermissionForPartnerStaffUser(user, societyId);
  }
};
