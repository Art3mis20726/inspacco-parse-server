import * as Parse from 'parse/node';
import { getRoleByName } from '../../util/role';
import { NOTIFICATION_CATEGORY, ROLES } from '../../constants/common';
import SendPushNotification from '../../util/sendPushNotification';
import SaveUserNotification from '../../util/saveUserNotification';
import {
  getNotificationBody,
  getNotificationTitle,
} from '../../util/notification';
import { lowerCase, startCase } from 'lodash';
import { getSocietyById } from '../../util/society';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';

export const beforeSaveSocietyMemberHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  if (operation === 'CREATE') {
    const acl = new Parse.ACL();
    const societyAdmin = `${ROLES.SOCIETY_ADMIN}__${
      req.object.get('society').id
    }`;
    acl.setPublicReadAccess(true);
    acl.setReadAccess(req.object.get('member').id, true);
    acl.setWriteAccess(req.object.get('member').id, true);
    acl.setRoleReadAccess(societyAdmin, true);
    acl.setRoleWriteAccess(societyAdmin, true);
    req.object.setACL(acl);
  }
  req.context = {
    operation,
  };
};

export const afterSaveSocietyMemberHandler = async (
  req: Parse.Cloud.AfterSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (req.context['operation'] == 'CREATE') {
    if (req.object.get('type') !== ROLES.INSPACCO_KAM) {
      const roleRecord = await getRoleByName(
        `${req.object.get('type')}__${req.object.get('society').id}`
      );
      if (roleRecord) {
        roleRecord.getUsers().add(req.object.get('member'));
        await roleRecord.save(null, { useMasterKey: true });
      }
    }
    _sendNotification(req);
  }
};

export const afterDeleteSocietyMemberHandler = async (
  req: Parse.Cloud.AfterDeleteRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (req.object.get('type') !== ROLES.INSPACCO_KAM) {
    const roleRecord = await getRoleByName(
      `${req.object.get('type')}__${req.object.get('society').id}`
    );
    if (roleRecord) {
      roleRecord.getUsers().remove(req.object.get('member'));
      await roleRecord.save(null, { useMasterKey: true });
    }
  }
};

async function _sendNotification(req: Parse.Cloud.AfterSaveRequest) {
  const role = startCase(lowerCase(req.object.get('type').replace('_', ' ')));
  const society = await getSocietyById(req.object.get('society').id);
  SendPushNotification(
    req.object.get('member'),
    getNotificationTitle('SOCIETY_MEMBER_ADDED', {
      role,
    }),
    getNotificationBody('SOCIETY_MEMBER_ADDED', {
      role,
      society: society.get('name'),
    })
  );
  SaveUserNotification(
    req.object.get('member'),
    NOTIFICATION_CATEGORY.onBoarding,
    getNotificationTitle('SOCIETY_MEMBER_ADDED', {
      role,
    }),
    getNotificationBody('SOCIETY_MEMBER_ADDED', {
      role,
      society: society.get('name'),
    })
  );
}
