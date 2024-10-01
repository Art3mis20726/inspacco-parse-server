import { compact } from 'lodash';
import * as Parse from 'parse/node';
import { COLLECTIONS, NOTIFICATION_CATEGORY, ROLES } from '../../constants/common';
import { getNextSequence } from '../../util/displayId';
import { getNotificationBody, getNotificationTitle, sendNotificationToInsapccoAdmin } from '../../util/notification';
import { findUserRoles, getRoleByName } from '../../util/role';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';

const createSocietyAdminRole = async (societyId: string) => {
  const roleName = `${ROLES.SOCIETY_ADMIN}__${societyId}`;
  const acl = new Parse.ACL();
  acl.setPublicReadAccess(true);
  acl.setRoleWriteAccess(ROLES.INSPACCO_KAM, true);
  acl.setRoleWriteAccess(roleName, true);

  const role = new Parse.Role(roleName, acl);
  const kamRole = await getRoleByName(ROLES.INSPACCO_KAM);
  role.getRoles().add(kamRole);
  const societyAdminRole = await role.save(null, { useMasterKey: true });

  const groupRole = await getRoleByName(ROLES.SOCIETY_ADMIN);
  groupRole.getRoles().add(societyAdminRole);
  await groupRole.save(null, { useMasterKey: true });
  return societyAdminRole;
};

const createSocietyManagerRole = async (societyId: string) => {
  const roleName = `${ROLES.SOCIETY_MANAGER}__${societyId}`;
  const acl = new Parse.ACL();
  acl.setPublicReadAccess(true);
  acl.setPublicWriteAccess(true);
  acl.setRoleWriteAccess(ROLES.INSPACCO_KAM, true);
  acl.setRoleWriteAccess(roleName, true);

  const role = new Parse.Role(roleName, acl);
  const kamRole = await getRoleByName(ROLES.INSPACCO_KAM);
  role.getRoles().add(kamRole);
  const societyManagerRole = await role.save(null, { useMasterKey: true });

  const groupRole = await getRoleByName(ROLES.SOCIETY_MANAGER);
  groupRole.getRoles().add(societyManagerRole);
  await groupRole.save(null, { useMasterKey: true });
  return societyManagerRole;
};

const linkInspaccoKAMToSocietyMember = async (
  req: Parse.Cloud.AfterSaveRequest
) => {
  if (await findUserRoles(req.user, [ROLES.INSPACCO_KAM])) {
    const societyMember = new Parse.Object(COLLECTIONS.SOCIETY_MEMBER);
    const Society = Parse.Object.extend(COLLECTIONS.SOCIETY);
    societyMember.set('type', 'INSPACCO_KAM');
    societyMember.set('society', Society.createWithoutData(req.object.id));
    societyMember.set('member', req.user);
    await societyMember.save(null, { useMasterKey: true });
  }
};
export const beforeSaveSocietyHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (!req.object.id) {
    const nextId = await getNextSequence(COLLECTIONS.SOCIETY);
    req.object.set('displayId', nextId);
  }
  const societyLong = parseFloat(req.object.get('societyLong')) || 0;
  const societyLat = parseFloat(req.object.get('societyLat')) || 0;
  const location = new Parse.GeoPoint(societyLat, societyLong);
  req.object.set('location',location);
  req.context = {
    operation: req.object.id ? 'UPDATE' : 'CREATE',
  };
};

export const afterSaveSocietyHandler = (req: Parse.Cloud.AfterSaveRequest) => {
  (async () => {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    if (req.context['operation'] == 'CREATE') {
      const societyAdminRole = await createSocietyAdminRole(req.object.id);
      const societyManagerRole = await createSocietyManagerRole(req.object.id);

      const acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setRoleWriteAccess(societyAdminRole, true);
      acl.setRoleWriteAccess(societyManagerRole, true);
      req.object.setACL(acl);

      await req.object.save(null, { useMasterKey: true });

      // await linkInspaccoKAMToSocietyMember(req);

      const title = getNotificationTitle('SOCIETY_ONBOARD');
      const body = getNotificationBody('SOCIETY_ONBOARD',{
        society : req.object.get('name'),
        name:  compact([req.user.get('firstName'), req.user.get('lastName')]).join(' ')
      });
      sendNotificationToInsapccoAdmin(req,title,body,NOTIFICATION_CATEGORY.onBoarding);

      
    }
  })();


};

export const afterDeleteSocietyHandler = async (req:Parse.Cloud.AfterDeleteRequest)=>{
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const society = req.object;
  const subscriptionsQuery = new Parse.Query(COLLECTIONS.SERVICE_SUBSCRIPTION);
  subscriptionsQuery.equalTo("society", society);
  const subscriptions = await subscriptionsQuery.find({ useMasterKey:true  });
  await Parse.Object.destroyAll(subscriptions,{ useMasterKey:true });
};