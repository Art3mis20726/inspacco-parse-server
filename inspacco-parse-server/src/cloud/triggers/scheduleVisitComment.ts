import moment from 'moment';
import * as Parse from 'parse/node';
import executeGraphql from '../../util/graphqlClient';
import { COLLECTIONS, NOTIFICATION_CATEGORY, ROLES } from '../../constants/common';
import { getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import { compact, get, size } from 'lodash';
import {
  getSocietyAdmin,
  getSocietyKAMs,
  getSocietyManager,
} from '../../util/society';
import SendPushNotification from '../../util/sendPushNotification';
import SaveUserNotification from '../../util/saveUserNotification';
import { getNotificationTitle, sendNotificationToInsapccoAdmin } from '../../util/notification';
import { getNotificationBody } from '../../util/notification';
import { GET_SERVICE_SCHEDULE_BY_COMMENT_ID } from '../graphql/queries/getServiceScheduleByCommentId';
import { findUserRoles } from '../../util/role';
import { getPartnerAdmin } from '../../util/partner';
import rollbar from '../../util/rollbar';
export const beforeSaveScheduleVisitCommentHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  const user = req.master ? await getUserByUserName('SYSTEM_ADMIN') : req.user;
  req.context = {
    operation,
  };
  if (operation === 'CREATE') {
    // Set createdBy updatedBy
    req.object.set('createdBy', user);
    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    req.object.setACL(acl);
  }
};
export const afterSaveScheduleVisitCommentHandler = async (
  req: Parse.Cloud.AfterSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (req.context['operation'] === 'CREATE') {
    setTimeout(async () => {
      const {users,visitId} = await getUsersToNotify(req);
      users.forEach(async (user) => {  
        const data = {
          screenPath:  await getSceduleVisitUserScreenPath(user),
          params: {          
            visitId: visitId,
          },
        };
        SendPushNotification(
          user,
          getNotificationTitle('SCHEDULE_VISIT_COMMENT',{
            user:req.user.get('firstName')+ ' ' + req.user.get('lastName') || 'User',
          }),
          getNotificationBody('SCHEDULE_VISIT_COMMENT', {
            comment: req.object.get('comment'),           
          }),
          data
        );
        SaveUserNotification(
          user,
          NOTIFICATION_CATEGORY.complaint,
          getNotificationTitle('SCHEDULE_VISIT_COMMENT',{
            user:req.user.get('firstName') + ' ' + req.user.get('lastName') || 'User',
          }),
          getNotificationBody('SCHEDULE_VISIT_COMMENT', {
            comment: req.object.get('comment'),           
          }),
          data
        );
        // {
        // sendNotificationToInsapccoAdmin(
        //     req,
        //     getNotificationTitle('SCHEDULE_VISIT_COMMENT',{
        //         user:req.user.get('firstName') + ' ' + req.user.get('lastName') || 'User',
        //       }),
        //       getNotificationBody('SCHEDULE_VISIT_COMMENT', {
        //         comment: req.object.get('comment'),           
        //       }),
        //     NOTIFICATION_CATEGORY.complaint,
        //     data
        //   );
        //     }
      });
    }, 2000);
  }
};
export const getSceduleVisitUserScreenPath = async (user) => {
  let screenPath = '';
  const userRole = await findUserRoles(user);
  if (userRole.length === 0) {
    return screenPath;
  }
  
  try {
    const roleName = userRole[0].getName().split('__')[0];
    switch (roleName) {
      case ROLES.INSPACCO_ADMIN:
      case ROLES.INSPACCO_KAM:
        screenPath = 'INSPACCO.SOCIETY.SERVICE_SUBSCRIPTION_SCHEDULE_VISIT';
        break;
      case ROLES.SOCIETY_ADMIN:
      case ROLES.SOCIETY_MANAGER:
        screenPath = 'SOCIETY.SERVICES.SERVICE_SUBSCRIPTION_SCHEDULE_VISIT';
        break;
      case ROLES.PARTNER_ADMIN:
        screenPath = 'PARTNER.HOME.SERVICE_SUBSCRIPTION_SCHEDULE_VISIT';
        break;

      default:
        screenPath = 'SOCIETY.SERVICES.SERVICE_SUBSCRIPTION_SCHEDULE_VISIT';
        break;
    }
    return screenPath;
  } catch (error) {
    rollbar.error(`${userRole} failed to schedule visit user screen path ${error.message} `)
    return screenPath;
  }
};

export const beforeDeleteScheduleVisitCommentHandler = async (
  req: Parse.Cloud.BeforeDeleteRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const q = new Parse.Query(COLLECTIONS.SCHEDULE_VISIT_COMMENT);
  const comment = await q.get(req.object.id, {
    useMasterKey: true,
  });
  if (
    moment().diff(moment(comment.createdAt), 'minutes') > 60 ||
    req.user.id !== comment.get('createdBy')?.id
  ) {
    throw `Selected comment cannot be deleted.`;
  }
};

async function getUsersToNotify(req: Parse.Cloud.AfterSaveRequest) {
  try {
    const scheduleVisitQuery = await executeGraphql(
      req.user,
      GET_SERVICE_SCHEDULE_BY_COMMENT_ID,
      {
        commentId: req.object.id,
      },
      true
    );
    const commentScheduleVisit = get(scheduleVisitQuery, 'data.serviceSubscriptionSchedules.edges[0].node');
    if (!size(commentScheduleVisit)) {
      return;
    }

    // const assignee = Parse.User.createWithoutData(
    //   commentScheduleVisit.assignee.objectId
    // );
    const societyKAM = await getSocietyKAMs(
      commentScheduleVisit.serviceSubscription.society.objectId
    );
    const societyAdmin = await getSocietyAdmin(
      commentScheduleVisit.serviceSubscription.society.objectId
    );

    let societyManager = await getSocietyManager(
      commentScheduleVisit.serviceSubscription.society.objectId
    );
    const partner = await getPartnerAdmin(
        commentScheduleVisit.serviceSubscription.partner.objectId
      );
    //If complaint for society manager dont notify
    if (
      commentScheduleVisit.serviceSubscription.service.name === 'Society Manager'
    ) {
      societyManager = [];
    }
    const usersToNotify = [
    //   assignee,
      ...societyAdmin,
      ...societyKAM,
      ...societyManager,
      ...partner,
    ].filter((user: Parse.User) => {
      return user.id !== req.user.id;
    });
    return {
      users: compact(usersToNotify),
      visitId: commentScheduleVisit.objectId
    };
  } catch (error) {
    return {
      users: [],
      visitId: null
    };
  }
}
