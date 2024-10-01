import moment from 'moment-timezone';
import { getSocietyById, getSocietyManager } from '../../util/society';
import {
  COLLECTIONS,
  NOTIFICATION_CATEGORY,
  TIMEZONE,
} from '../../constants/common';
import { getUserById, getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import { buildTaskActivityRecord } from '../functions/task/copyTaskToActivity';
import SendPushNotification from '../../util/sendPushNotification';
import { getNotificationTitle } from '../../util/notification';
import { getNotificationBody } from '../../util/notification';
import { compact } from 'lodash';
import SaveUserNotification from '../../util/saveUserNotification';
import { getServiceSubscription } from '../../util/serviceSubscription';
import { getPartnerAdmin } from '../../util/partner';
import rollbar from '../../util/rollbar';

export const beforeSaveTaskHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  const user = req.master ? await getUserByUserName('SYSTEM_ADMIN') : req.user;
  if (operation === 'CREATE') {
    req.object.set('createdBy', user);
    req.object.set('updatedBy', user);
  } else {
    req.object.set('updatedBy', user);
  }
  req.context = {
    operation,
  };
};
const parentModules = ['ServiceSubscription', 'Society'];
export const afterSaveTaskHandler = async (
  req: Parse.Cloud.AfterSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (
    req.context['operation'] === 'CREATE' &&
    req.object.get('frequency') === 'ONCE' &&
    moment()
      .add(5, 'days')
      .endOf('day')
      .isSameOrAfter(moment(req.object.get('startDate')))
  ) {
    setTimeout(async () => {
      const taskModule = req.object.get('module') || 'ServiceSubscription';
      const parentId = req.object.get('parentId');
      const Task = Parse.Object.extend(COLLECTIONS.TASK);
      if (parentModules.includes(taskModule) && parentId) {
        const parentModule = await (taskModule === 'Society'
          ? getSocietyById(parentId)
          : getServiceSubscription(parentId));
        const serviceSubQ = new Parse.Query(
          taskModule === 'Society'
            ? COLLECTIONS.SOCIETY
            : COLLECTIONS.SERVICE_SUBSCRIPTION
        );
        serviceSubQ.equalTo('tasks', Task.createWithoutData(req.object.id));
        const serviceSubRec = await serviceSubQ.first({ useMasterKey: true });

        if (serviceSubRec) {
          const activityRec = buildTaskActivityRecord(
            {
              objectId: req.object.id,
              createdBy: { objectId: req.object.get('createdBy').id },
            },
            moment.tz(req.object.get('startDate'), TIMEZONE).set({
              hours: 12,
              minutes: 0,
              seconds: 0,
              milliseconds: 0,
            })
          );
          const taskActivitySaveRes = await activityRec.save(null, {
            useMasterKey: true,
          });
          sendTaskCreationNotification(serviceSubRec, req, taskActivitySaveRes);
        }
      }
    }, 5 * 1000);
  }
};
async function sendTaskCreationNotification(
  serviceSubRec,
  req,
  taskActivitySaveRes
) {
  const taskModule = req.object.get('module') || 'ServiceSubscription';

  let members = [];
  if (taskModule === 'Society') {
    members = await getSocietyManager(serviceSubRec.id);
  } else {
    members = await getPartnerAdmin(serviceSubRec.get('partner').id);
  }
  const createdBy = await getUserById(req.object.get('createdBy').id);
  if (req.object.get('assignedTo').id) {
    const assignedTo = await getUserById(req.object.get('assignedTo').id);
    members.push(assignedTo);
  }
  members.forEach((manager) => {
    const title = getNotificationTitle('ADHOC_TASK_ADDED');
    const body = getNotificationBody('ADHOC_TASK_ADDED', {
      user: compact([
        createdBy.get('firstName'),
        createdBy.get('lastName'),
      ]).join(' '),
      taskSummary: req.object.get('summary'),
      date: moment
        .tz(req.object.get('startDate'), TIMEZONE)
        .format('D MMM YYYY'),
    });
    const data = {
      screenPath: 'SOCIETY.TASK.TASK_ACTIVITY_VIEW',
      params: {
        taskActivityId: taskActivitySaveRes.id,
      },
    };
    SendPushNotification(manager, title, body, data);
    SaveUserNotification(
      manager,
      NOTIFICATION_CATEGORY.task,
      title,
      body,
      data
    );
  });
}
export const beforeDeleteTaskHandler = async (
  req: Parse.Cloud.BeforeDeleteRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const task = req.object;

  // Create a query to find the associated TaskActivity records
  const taskActivityQuery = new Parse.Query(COLLECTIONS.TASK_ACTIVITY);
  taskActivityQuery.equalTo('task', task);

  try {
    // Find the TaskActivity records
    const taskActivities = await taskActivityQuery.find({ useMasterKey: true });

    // Delete the TaskActivity records
    await Parse.Object.destroyAll(taskActivities, { useMasterKey: true });

    const serviceSubscriptionQuery = new Parse.Query(
      COLLECTIONS.SERVICE_SUBSCRIPTION
    );
    serviceSubscriptionQuery.equalTo('tasks', task);
    const serviceSubscriptions = await serviceSubscriptionQuery.find({
      useMasterKey: true,
    });

    // Remove the task from the relation field of each ServiceSubscription record
    serviceSubscriptions.forEach((serviceSubscription) => {
      const relation = serviceSubscription.relation('tasks');
      relation.remove(task);
    });

    // Save the updated ServiceSubscription records
    await Parse.Object.saveAll(serviceSubscriptions, { useMasterKey: true });
    console.log(
      `Deleted ${taskActivities.length} TaskActivity records for Task ${task.id}`
    );
    // Task removed from ServiceSubscription records successfully
    console.log(
      `Removed Task ${task.id} from ${serviceSubscriptions.length} ServiceSubscription records`
    );

    // TaskActivity records deleted successfully
  } catch (error) {
    // Handle error
    rollbar.error(`${taskActivityQuery} Error deleting TaskActivity records ${error.message}`)
    console.error('Error deleting TaskActivity records:', error);
    throw new Error('Error Deleting TaskActivity records');
  }
};
