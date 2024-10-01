import * as Parse from 'parse/node';
import { getServiceById } from '../../util/service';
import {
  COLLECTIONS,
  NOTIFICATION_CATEGORY,
  ROLES,
} from '../../constants/common';
import { getNextSequence } from '../../util/displayId';
import {
  getNotificationBody,
  getNotificationTitle,
} from '../../util/notification';
import { getPartnerAdmin } from '../../util/partner';
import SaveUserNotification from '../../util/saveUserNotification';
import SendPushNotification from '../../util/sendPushNotification';
import {
  getSocietyAdmin,
  getSocietyById,
  getSocietyKAMs,
  getSocietyManager,
} from '../../util/society';
import { getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import { GET_SOCIETY_WISE_SERVICE_SUBSCRIPTION } from '../graphql/queries/getSocietyWiseServiceSubscription';
import executeGraphql from '../../util/graphqlClient';
import { getSaveOrQueryOption } from '../../util';

function setACL(req: Parse.Cloud.BeforeSaveRequest) {
  const acl = new Parse.ACL();
  const societyAdminRole = `${ROLES.SOCIETY_ADMIN}__${
    req.object.get('society').id
  }`;
  const societyManagerRole = `${ROLES.SOCIETY_MANAGER}__${
    req.object.get('society').id
  }`;
  const partnerAdminRole = `${ROLES.PARTNER_ADMIN}__${
    req.object.get('partner').id
  }`;
  const partnerKAMRole = `${ROLES.PARTNER_KAM}__${
    req.object.get('partner').id
  }`;
  const partnerStaffRole = `${ROLES.PARTNER_STAFF}__${
    req.object.get('partner').id
  }`;

  acl.setRoleReadAccess(partnerStaffRole, true);
  acl.setRoleReadAccess(societyAdminRole, true);
  acl.setRoleReadAccess(societyManagerRole, true);
  acl.setRoleReadAccess(partnerAdminRole, true);
  acl.setRoleReadAccess(partnerKAMRole,true);

  acl.setRoleWriteAccess(partnerKAMRole,true);
  acl.setRoleWriteAccess(partnerAdminRole,true);
  acl.setRoleReadAccess(ROLES.INSPACCO_KAM, true);
  acl.setRoleWriteAccess(ROLES.INSPACCO_KAM, true);
  req.object.setACL(acl);
}
export const beforeSaveServiceSubscriptionHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  const user = req.master ? await getUserByUserName('SYSTEM_ADMIN') : req.user;
  if (operation === 'CREATE') {
    const nextId = await getNextSequence(COLLECTIONS.SERVICE_SUBSCRIPTION);
    req.object.set('displayId', nextId);
    req.object.set('createdBy', user);
    req.object.set('updatedBy', user);
    setACL(req);
  } else {
    req.object.set('updatedBy', user);
  }
  req.context = {
    operation,
  };
};

async function _fetchServiceTasks(serviceId: string) {
  const serviceQuery = new Parse.Query('Service');
  const service = await serviceQuery.get(serviceId);
  const taskRelation = service.relation('tasks');
  const taskQuery = taskRelation.query();
  taskQuery.equalTo('status', 'Active');
  return await taskQuery.find({ useMasterKey: true });
}

async function _createTask(serviceTask: Parse.Object, user: Parse.User) {
  const task = new Parse.Object('Task');
  [
    'summary',
    'description',
    'frequency',
    'rewardPoints',
    'dayInMonth',
    'dayInWeek',
  ].forEach((key) => {
    task.set(key, serviceTask.attributes[key]);
  });
  return await task.save(null, getSaveOrQueryOption(user));
}

async function _copyServiceTaskToTask(
  serviceId: string,
  serviceSubscription: Parse.Object,
  user: Parse.User
) {
  console.log('************ COPY SERVICE TASK TO TASK - START ************');
  const serviceTasks = await _fetchServiceTasks(serviceId);
  const taskRelation = serviceSubscription.relation('tasks');
  const createTaskRes = await Promise.all(
    serviceTasks.map((serviceTask) => {
      return _createTask(serviceTask, user);
    })
  );
  createTaskRes.forEach((res) => {
    taskRelation.add(res);
  });
  
  if (createTaskRes.length) {
    await serviceSubscription.save(null, getSaveOrQueryOption(user));
  }
  console.log('************ COPY SERVICE TASK TO TASK - FINISH ************');
}

async function _sendNotification(req: Parse.Cloud.AfterSaveRequest, count) {
  const societyKAM = await getSocietyKAMs(req.object.get('society').id);
  const societyAdmin = await getSocietyAdmin(req.object.get('society').id);
  const societyManager = await getSocietyManager(req.object.get('society').id);
  const partnerAdmin = await getPartnerAdmin(req.object.get('partner').id);
  const usersToNotify = [
    ...societyAdmin,
    ...societyKAM,
    ...societyManager,
    ...partnerAdmin,
  ].filter((user: Parse.User) => {
    return user.id !== req.user.id;
  });
  const society = await getSocietyById(req.object.get('society').id);
  const service = await getServiceById(req.object.get('service').id);

  usersToNotify.forEach((user) => {
    const serviceSubscribed = "SERVICE_SUBSCRIBED";
    const NewPartner = "SERVICE_SUBSCRIBED_FOR_NEW_PARTNER";

    SendPushNotification(
      user,
      getNotificationTitle(count.data.serviceSubscriptions.count > 1 ? NewPartner :serviceSubscribed),
      getNotificationBody(count.data.serviceSubscriptions.count > 1 ? NewPartner :serviceSubscribed, {
        service: service.get('name'),
        society: society.get('name'),
      })
    );
    SaveUserNotification(
      user,
      NOTIFICATION_CATEGORY.complaint,
      getNotificationTitle(count.data.serviceSubscriptions.count > 1 ? NewPartner :serviceSubscribed),
      getNotificationBody(count.data.serviceSubscriptions.count > 1 ? NewPartner :serviceSubscribed, {
        service: service.get('name'),
        society: society.get('name'),
      })
    );
  });
}

async function getSocietyWiseServiceSubscription(society, service,req) {
  const societyLevelServiceSubscription = await executeGraphql(
    req.user,
    GET_SOCIETY_WISE_SERVICE_SUBSCRIPTION,
    {
      societyId: society,
      serviceId: service,
    },
    true
  );
  return societyLevelServiceSubscription;
}


export const afterSaveServiceSubscriptionHandler = async (
  req: Parse.Cloud.AfterSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (req.context['operation'] === 'CREATE') {
    _copyServiceTaskToTask(req.object.get('service').id, req.object, req.user);
    const count = await getSocietyWiseServiceSubscription(req.object.get('society').id, req.object.get('service').id, req);
    _sendNotification(req, count);
    

  }
};
