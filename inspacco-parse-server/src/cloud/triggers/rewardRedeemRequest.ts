import { compact } from 'lodash';
import SaveUserNotification from '../../util/saveUserNotification';
import SendPushNotification from '../../util/sendPushNotification';
import {
  COLLECTIONS,
  NOTIFICATION_CATEGORY,
  REWARD_REDEEM_STATUS,
  ROLES,
} from '../../constants/common';
import {
  getNotificationBody,
  getNotificationTitle,
  sendNotificationToInsapccoAdmin,
} from '../../util/notification';
import { getUserById, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
export const beforeSaveRewardRedeemRequest = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  req.context = { operation };
};

export const afterSaveRewardRedeemRequest = (
  req: Parse.Cloud.AfterSaveRequest
) => {
  (async () => {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    if (req.context['operation'] === 'CREATE') {
      try {
        const title = getNotificationTitle('REWARD_REDEEM_REQUEST');
        const body = getNotificationBody('REWARD_REDEEM_REQUEST', {
          points: req.object.get('rewardPoints'),
          user: compact([
            req.user.get('firstName'),
            req.user.get('lastName'),
          ]).join(' '),
        });
        const data = {
          screenPath: 'INSPACCO.REDEEM_REQUEST.REWARD_REDEEM_REQUEST_VIEW',
          params: {
            redeemRequestId: req.object.id,
          },
        };
        sendNotificationToInsapccoAdmin(
          req,
          title,
          body,
          NOTIFICATION_CATEGORY.rewardRedeemRequest,
          data
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      const status = req.object.get('status');
      const requestedUser = await getUserById(req.object.get('user').id);
      const points = Number(req.object.get('rewardPoints')) || 0;
      if (REWARD_REDEEM_STATUS.PROCESSED === status) {
        const redeemType = `UPI payment on ${req.object.get('upiId')}`;
        try {
          //make entry in Reward table (after save reward trigger will add rewardPoint in  User totalRewardPoints)
          const Reward = Parse.Object.extend(COLLECTIONS.REWARD);
          const reward = new Reward();
          reward.set('user', requestedUser);
          reward.set('rewardPoints', -points);
          reward.set('rewardDate', new Date());
          reward.set('redeemType', redeemType);
          const isSaveData = await reward.save(null, { useMasterKey: true });
          if (isSaveData) {
            const statusFor = 'REWARD_REDEEM_REQUEST_PROCESSED';
            sendNotificationToUser(requestedUser, points, statusFor);
          }
          return;
        } catch (error) {
          console.log(error);
          return;
        }
      }

      if (REWARD_REDEEM_STATUS.REJECTED === status) {       
        const statusFor = 'REWARD_REDEEM_REQUEST_REJECTED';
        sendNotificationToUser(requestedUser, points, statusFor);
      }
    }
  })();
};

function sendNotificationToUser(user, points, statusFor) {
  const title = getNotificationTitle(statusFor);
  const body = getNotificationBody(statusFor,{
    points: `${points}`,
    user: user.get('firstName'),
  });
  SendPushNotification(user, title, body);
  SaveUserNotification(
    user,
    NOTIFICATION_CATEGORY.rewardRedeemRequest,  
    title,
    body
  );
}
