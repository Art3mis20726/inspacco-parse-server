import * as Parse from 'parse/node';
import { COLLECTIONS, ROLES } from '../../constants/common';
import { getNextSequence } from '../../util/displayId';
import { getUser, linkUser, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import { getSchemaQuery } from '../../util';
import { addFaceToPerson, createPerson } from '../../util/azurefaceservice';
import { ATTACHMENTS_BASE_URL } from '../../util/secrets';
import { getRoleByName } from '../../util/role';

//create role and assign

const assignRoleToStaffMember = async (user: any, partnerId: any) => {
  const qUser = new Parse.Query(Parse.User);
  qUser.equalTo('objectId', user.id);
  const userData = await qUser.first({ useMasterKey: true });

  const qRole = new Parse.Query(Parse.Role);
  qRole.equalTo('name', `PARTNER_STAFF__${partnerId}`);
  const roleRecord = await qRole.first({ useMasterKey: true });

  console.log('role records start here');
  console.log(roleRecord.toJSON());

  roleRecord.getUsers().add(userData);
  await roleRecord.save(null, { useMasterKey: true });
};
const updatePermissionForPartnerStaffUser = async (
  user: Parse.User,
  partnerId
) => {
  const acl = user.getACL();
  acl.setRoleWriteAccess(ROLES.PARTNER_ADMIN + '__' + partnerId, true);
  acl.setRoleWriteAccess(ROLES.PARTNER_KAM + '__' + partnerId, true);
  user.setACL(acl);
  await user.save(null, { useMasterKey: true });
};

export const beforeSavePartnerStaffHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (!req.object.id) {
    const partnerId = req.object.get('partner').toJSON().objectId;

    //create new staff member starts
    const firstName = req.object.get('firstName');
    const lastName = req.object.get('lastName');
    const mobileUser = req.object.get('mobileNumber');
    const profileImage = req.object.get('profileImage');

    const existingStaff = await getSchemaQuery('PartnerStaff')(
      { mobileNumber: mobileUser, partner: req.object.get('partner') },
      null
    );
    if (existingStaff) {
      throw new Parse.Error(
        Parse.Error.VALIDATION_ERROR,
        `Following User ${mobileUser} already registered`
      );
    }

    const otp: string = Math.floor(Math.random() * 8999 + 1000).toString();

    const personId = await createPerson(`${firstName} ${lastName}`, mobileUser);
    await addFaceToPerson(personId, ATTACHMENTS_BASE_URL + profileImage);
    const userAttribuite = {
      firstName: firstName,
      lastName: lastName,
      profilePicture: profileImage,
      personFaceId: personId,
    };

    const userData = await linkUser(mobileUser, otp, userAttribuite);

    const nextId = await getNextSequence(COLLECTIONS.PARTNER_STAFF);
    req.object.set('displayId', nextId);
    req.object.set('user', userData);

    await assignRoleToStaffMember(userData, partnerId);
    //Need Write Access of Partner Staff User
    await updatePermissionForPartnerStaffUser(userData, partnerId);
  } else {
    const profileImage = req.object.get('profileImage');
    const partnerStaff = await getSchemaQuery(COLLECTIONS.PARTNER_STAFF)(
      { objectId: req.object.id },
      req.user
    );
    console.log('profileImage',partnerStaff.get('profileImage'));
    console.log('user',partnerStaff.get('user'));
    if (profileImage) {
      const user_object = partnerStaff.get('user');
      if (user_object) {
        const user = await getSchemaQuery('_User')(
          { objectId: user_object.id},
          req.user
        );
        let personId = user.get('personFaceId');
        if (!personId) {
          personId = await createPerson(
            `${user.get('firstName')} ${user.get('lastName')}`,
            user.get('mobileNumber')
          );
        }
        await addFaceToPerson(personId, ATTACHMENTS_BASE_URL + profileImage);
        user.set('profilePicture',profileImage);
        user.set('personFaceId', personId);
        await user.save(null, { useMasterKey: true });
      }
    }
  }
};
export const afterDeletePartnerStaffHandler = async (req:Parse.Cloud.AfterDeleteRequest)=>{
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const partnerStaff = req.object;
  const serviceStaffQuery = new Parse.Query(COLLECTIONS.SERVICE_STAFF);
  serviceStaffQuery.equalTo("staff", partnerStaff);
  const serviceStaffs = await serviceStaffQuery.find( { useMasterKey : true });
  await Parse.Object.destroyAll(serviceStaffs,{ useMasterKey:true });
  const roleRecord = await getRoleByName(
    `${ROLES.PARTNER_STAFF}__${req.object.get('partner').id}`
  );
  if (roleRecord) {
    roleRecord.getUsers().remove(req.object.get('user'));
    await roleRecord.save(null, { useMasterKey: true });
  }
};