import moment from 'moment';
import * as Parse from 'parse/node';
import executeGraphql from '../../util/graphqlClient';
import { COLLECTIONS, NOTIFICATION_CATEGORY } from '../../constants/common';
import { getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import { GET_INCIDENT_BY_COMMENT_ID } from '../graphql/queries/getIncidentByCommentId';
import { compact, get, size } from 'lodash';
import {
  getSocietyAdmin,
  getSocietyKAMs,
  getSocietyManager,
} from '../../util/society';
import { getIncidentUserScreenPath } from './incident';
import SendPushNotification from '../../util/sendPushNotification';
import SaveUserNotification from '../../util/saveUserNotification';
import { getNotificationTitle } from '../../util/notification';
import { getNotificationBody } from '../../util/notification';
export const beforeSaveIncidentCommentHandler = async (
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

export const afterSaveIncidentCommentHandler = async (
  req: Parse.Cloud.AfterSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (req.context['operation'] === 'CREATE') {
    setTimeout(async () => {
      const {users,incidentId,displayId} = await getUsersToNotify(req);      
      users.forEach(async (user) => {
        const data = {
          screenPath:  await getIncidentUserScreenPath(user),
          params: {          
            incidentId: incidentId,
          },
        };
        SendPushNotification(
          user,
          getNotificationTitle('INCIDENT_COMMENT',{
            user:req.user.get('firstName') || 'User',
            displayId:displayId
          }),
          getNotificationBody('INCIDENT_COMMENT', {
            comment: req.object.get('comment'),           
          }),
          data
        );
        SaveUserNotification(
          user,
          NOTIFICATION_CATEGORY.complaint,
          getNotificationTitle('INCIDENT_COMMENT',{
            user:req.user.get('firstName') || 'User',
            displayId:displayId
          }),
          getNotificationBody('INCIDENT_COMMENT', {
            comment: req.object.get('comment'),           
          }),
          data
        );
      });
    }, 2000);
  }
};

export const beforeDeleteIncidentCommentHandler = async (
  req: Parse.Cloud.BeforeDeleteRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const q = new Parse.Query(COLLECTIONS.INCIDENT_COMMENT);
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
    const incidentQuery = await executeGraphql(
      req.user,
      GET_INCIDENT_BY_COMMENT_ID,
      {
        commentId: req.object.id,
      },
      true
    );
    const commentIncident = get(incidentQuery, 'data.incidents.edges[0].node');

    if (!size(commentIncident)) {
      return;
    }

    const assignee = Parse.User.createWithoutData(
      commentIncident.assignee.objectId
    );
    const societyKAM = await getSocietyKAMs(
      commentIncident.serviceSubscription.society.objectId
    );
    const societyAdmin = await getSocietyAdmin(
      commentIncident.serviceSubscription.society.objectId
    );

    let societyManager = await getSocietyManager(
      commentIncident.serviceSubscription.society.objectId
    );
    //If complaint for society manager dont notify
    if (
      commentIncident.serviceSubscription.service.name === 'Society Manager'
    ) {
      societyManager = [];
    }
    const usersToNotify = [
      assignee,
      ...societyAdmin,
      ...societyKAM,
      ...societyManager,
    ].filter((user: Parse.User) => {
      return user.id !== req.user.id;
    });
    return {
      displayId: commentIncident.displayId,
      users: compact(usersToNotify),
      incidentId: commentIncident.objectId
    };
  } catch (error) {
    return {
      displayId:'',
      users: [],
      incidentId: null
    };
  }
}
