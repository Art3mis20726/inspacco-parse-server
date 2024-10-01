import { compact, get } from 'lodash';
import { getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import {
  COLLECTIONS,
  NOTIFICATION_CATEGORY,
  ROLES,
  TASK_ACTIVITY_STATUS,
} from '../../constants/common';
import executeGraphql from '../../util/graphqlClient';
import { findUserRoles } from '../../util/role';
import { GET_TASK_ACTIVITY_REWARD } from '../graphql/queries/getTackActivityRewards';
import { getSocietyAdmin } from '../../util/society';
import { getServiceSubscription } from '../../util/serviceSubscription';
import SendPushNotification from '../../util/sendPushNotification';
import {
  getNotificationTitle,
  getNotificationBody,
} from '../../util/notification';
import { getTaskById } from '../../util/task';
import SaveUserNotification from '../../util/saveUserNotification';

export const beforeSaveTaskActivityHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  const user = req.master ? await getUserByUserName('SYSTEM_ADMIN') : req.user;
  if (operation === 'UPDATE') {
    req.object.set('updatedBy', user);
  }
  req.context = {
    operation,
  };
};

export const afterSaveTakActivity = (req: Parse.Cloud.AfterSaveRequest) => {
  (async () => {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    if (!req.user) {
      return;
    }

    const status = req.object.get('taskStatus');
    if (TASK_ACTIVITY_STATUS.COMPLETED === status) {
      //check user role is SOCIETY_MANAGER
      // if No do-nothing return;
      const userRoles = await findUserRoles(req.user);

      const isSocietyManager = userRoles.map((role) => {
        const roleName = role.get('name');
        return roleName.includes(ROLES.SOCIETY_MANAGER);
      });

      if (isSocietyManager && isSocietyManager.includes(true)) {
        //If user is SOCIETY_MANAGER:
        //check if reward entry available
        const Rewards = Parse.Object.extend(COLLECTIONS.REWARD);
        const TaskActivity = Parse.Object.extend(COLLECTIONS.TASK_ACTIVITY);
        const taskActivity = new TaskActivity();
        const query = new Parse.Query(Rewards);
        taskActivity.id = req.object.id;
        query.equalTo('taskActivity', taskActivity);
        const isRewardPresent = await query.count({ useMasterKey: true });
        if (isRewardPresent > 0) {
          //if yes // return
          return;
        }
        //If reward entry not available.
        //get rewardPoint from task using taskActivity objectId
        const graphQl = GET_TASK_ACTIVITY_REWARD;
        const params = { id: req.object.id };
        const result = await executeGraphql(req.user, graphQl, params);
        const rewardPoints = get(result, 'data.taskActivity.task.rewardPoints');
        if (rewardPoints) {
          try {
            //make entry in Reward table (after save reward trigger will add rewardPoint in  User totalRewardPoints)
            const Reward = Parse.Object.extend(COLLECTIONS.REWARD);
            const TaskActivity = Parse.Object.extend(COLLECTIONS.TASK_ACTIVITY);
            const reward = new Reward();
            reward.set(
              'taskActivity',
              TaskActivity.createWithoutData(req.object.id)
            );
            reward.set('user', req.user);
            reward.set('rewardPoints', rewardPoints);
            reward.set('rewardDate', req.object.get('taskDate'));
            await reward.save(null, { useMasterKey: true });
          } catch (error) {
            console.log(error);
          }
        }
      }

      sendNotificationToSocietyAdmins(req);
    } else {
      // REOPEN or Re-INPROGRESS.
      //check if reward entry available
      //if yes
      //remove entry from Task Activity
      //minus points from User totalRewardPoints(on Rewards delete trigger)
      //if no
      //do nothing
    }
  })();
};

async function sendNotificationToSocietyAdmins(
  req: Parse.Cloud.AfterSaveRequest
) {
  const task = await getTaskById(req.object.get('task').id);
  if(task.get('frequency') !== 'ONCE') {
    return;
  }
  const serviceSub = await getServiceSubscription(
    req.object.get('serviceSubscription').id
  );
  const societyAdmins = await getSocietyAdmin(serviceSub.get('society').id);
  const title = getNotificationTitle('ADHOC_TASK_COMPLETED');
  const body = getNotificationBody('ADHOC_TASK_COMPLETED', {
    user: compact([req.user.get('firstName'), req.user.get('lastName')]).join(
      ' '
    ),
    taskSummary: task.get('summary'),
  });
  const data = {
    screenPath: 'SOCIETY.TASK.TASK_ACTIVITY_VIEW',
    params: {
      taskActivityId: req.object.id,
    },
  };
  societyAdmins.forEach((user) => {
    SendPushNotification(user, title, body, data);
    SaveUserNotification(user, NOTIFICATION_CATEGORY.task, title, body, data);
  });
}
