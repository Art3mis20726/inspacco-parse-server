import * as Parse from 'parse/node';
import { getRoleByName } from '../../util/role';
import { NOTIFICATION_CATEGORY, ROLES } from '../../constants/common';
import SendPushNotification from '../../util/sendPushNotification';
import { getNotificationTitle } from '../../util/notification';
import { getNotificationBody } from '../../util/notification';
import SaveUserNotification from '../../util/saveUserNotification';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';

export const beforeSavePartnerMemberHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  req.context = {
    operation: req.object.id ? 'UPDATE' : 'CREATE',
  };
};

export const afterSavePartnerMemberHandler = async (
  req: Parse.Cloud.AfterSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (req.context['operation'] == 'CREATE') {
    const acl = new Parse.ACL();
    const roleName = `${ROLES.PARTNER_ADMIN}__${req.object.get('partner').id}`;
    acl.setPublicReadAccess(true);
    acl.setRoleReadAccess(roleName, true);
    acl.setRoleWriteAccess(roleName, true);
    req.object.setACL(acl);

    await req.object.save(null, { useMasterKey: true });

    if (req.object.get('type') !== ROLES.INSPACCO_KAM) {
      const roleRecord = await getRoleByName(
        `${req.object.get('type')}__${req.object.get('partner').id}`
      );
      if (roleRecord) {
        roleRecord.getUsers().add(req.object.get('member'));
        await roleRecord.save(null, { useMasterKey: true });
      }
    }

    try {
      const title = getNotificationTitle('PARTNER_MEMBER');
      const body = getNotificationBody('PARTNER_MEMBER');
      SendPushNotification(req.object.get('member'), title, body);
      SaveUserNotification(
        req.object.get('member'),
        NOTIFICATION_CATEGORY.onBoarding,
        title,
        body
      );
    } catch (error) {
      console.log(error);
    }
  }
};

export const afterDeletePartnerMemberHandler = async (
  req: Parse.Cloud.AfterDeleteRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (req.object.get('type') !== ROLES.INSPACCO_KAM) {
    const roleRecord = await getRoleByName(
      `${req.object.get('type')}__${req.object.get('partner').id}`
    );
    if (roleRecord) {
      roleRecord.getUsers().remove(req.object.get('member'));
      await roleRecord.save(null, { useMasterKey: true });
    }
  }
};
