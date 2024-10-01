/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
require('../../util/string_util');

import moment from 'moment';
import moment_tz from 'moment-timezone';
import _ from 'lodash';
import * as Parse from 'parse/node';
import { getServiceRequestById } from '../../util/serviceRequest';
import { getUser, getUserById, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import {
  COLLECTIONS,
  NOTIFICATION_CATEGORY,
  ROLES,
  TIMEZONE,
} from '../../constants/common';
import { getNextSequence } from '../../util/displayId';
import {
  getNotificationBody,
  getNotificationTitle,
  sendNotificationToInsapccoAdmin,
} from '../../util/notification';
import { getServiceById } from '../../util/service';
import { SERVICE_REQUEST_STATUS } from '../../constants/serviceRequestStatuses';
import SendPushNotification from '../../util/sendPushNotification';
import SaveUserNotification from '../../util/saveUserNotification';
import { compact, get, isEmpty } from 'lodash';
import { GET_SOCIETY_DETAILS } from '../graphql/queries/getSocietyDetails';
import executeGraphql from '../../util/graphqlClient';
import { GET_SOCIETY_ADMIN_DETAILS } from '../graphql/queries/getAdminDetails';
import { createRecord, getSaveOrQueryOption } from '../../util';

// ******************************************************************************************************
// SERVICE REQUEST : Before Save Handler
// ******************************************************************************************************

export const beforeSaveServiceRequestHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
): Promise<any> => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  req.context = {
    operation,
    prevObject:
      operation === 'UPDATE'
        ? await getServiceRequestById(req.object.id)
        : undefined,
  };
  if (operation === 'CREATE') {
    // Set displayId
    const nextId = await getNextSequence(COLLECTIONS.SERVICE_REQUEST);
    req.object.set('displayId', nextId);

    // Set ACL
    setACL(req);
  }
};

function setACL(req: Parse.Cloud.BeforeSaveRequest) {
  const acl = new Parse.ACL();
  if (req.object.get('society')) {
    acl.setRoleReadAccess(
      `${ROLES.SOCIETY_ADMIN}__${req.object.get('society').id}`,
      true
    );
    acl.setRoleWriteAccess(
      `${ROLES.SOCIETY_ADMIN}__${req.object.get('society').id}`,
      true
    );
    acl.setRoleReadAccess(
      `${ROLES.SOCIETY_MANAGER}__${req.object.get('society').id}`,
      true
    );
    acl.setRoleWriteAccess(
      `${ROLES.SOCIETY_MANAGER}__${req.object.get('society').id}`,
      true
    );
  } else {
    acl.setReadAccess(req.object.get('requester').id, true);
    acl.setWriteAccess(req.object.get('requester').id, true);
  }
  acl.setRoleReadAccess(ROLES.INSPACCO_ADMIN, true);
  acl.setRoleWriteAccess(ROLES.INSPACCO_ADMIN, true);
  acl.setRoleReadAccess(ROLES.PARTNER_ADMIN, true);
  acl.setRoleWriteAccess(ROLES.PARTNER_ADMIN, true);
  acl.setRoleReadAccess(ROLES.SOCIETY_ADMIN, true);
  acl.setRoleWriteAccess(ROLES.SOCIETY_ADMIN, true);
  req.object.setACL(acl);
}

// ******************************************************************************************************
// SERVICE REQUEST : After Save Handler
// ******************************************************************************************************


export const afterSaveServiceRequestHandler = async (req: Parse.Cloud.AfterSaveRequest): Promise<any> => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);

  const context = req.context;
  const operation = context['operation'];
  const currentServiceRequestObject = req.object;


  if (operation === 'CREATE') {
    return handleAfterSaveForNewServiceRequest(req, currentServiceRequestObject);
  } else {
    const previousServiceRequestObject = context['prevObject'];
    return handleAfterSaveForUpdatedServiceRequest(req, currentServiceRequestObject, previousServiceRequestObject);
  }
};

// ******************************************************************************************************
// SERVICE REQUEST : After Save Handler : Create
// ******************************************************************************************************

async function addRewardPoints(referralCode: string, loginUser) {
  const user = await getUser(referralCode);
  if (user && loginUser && loginUser.get('mobileNumber') !== referralCode) {
    const rewardRec = new Parse.Object('Reward');
    rewardRec.set('user', user);
    rewardRec.set('rewardPoints', 100);
    rewardRec.set('rewardDate', new Date());
    await rewardRec.save(null, { useMasterKey: true });
  } else {
    console.log('Invalid Referral Code');
  }
}

async function handleAfterSaveForNewServiceRequest(req: Parse.Cloud.AfterSaveRequest, currentServiceRequestObject: any): Promise<void> {
  // 1. Create Entry in Activity History
  const title = `SR Created`;
  const description = `New Service Request #${currentServiceRequestObject.get('displayId')} is created`;
  await createActivityHistory(currentServiceRequestObject, req.user, 'TO_BE_WORKED_UPON', title, description);

  // 2. Get Society Id
  const service = await getServiceById(currentServiceRequestObject.get('service').id);
  const SocietyRequestGQL = await executeGraphql(
    req.user, 
    GET_SOCIETY_DETAILS, 
    { id: currentServiceRequestObject.id }, 
    true
  );

  const societyId = get(
    SocietyRequestGQL.data.serviceRequests,
    'edges[0].node.society.objectId',
    null
  );

  // 3. Get Society Admins
  const SocietyAdminGQL = await executeGraphql(
    req.user,
    GET_SOCIETY_ADMIN_DETAILS,
    { id: societyId },
    true
  );

  const societyMemberData = get(
    SocietyAdminGQL.data.societyMembers,
    'edges',
    null
  );
  const member = societyMemberData.map(societymamber => {
    return societymamber.node.member.objectId;
  });

  // 4. Send Push Notification

  const assignee = [];
  member.map(id => assignee.push(Parse.User.createWithoutData(id)));
  const usersToNotify = [
    ...assignee
  ].filter((user: Parse.User) => {
    return user.id !== req.user.id;
  });

  compact(usersToNotify).forEach(async (user) => {
    const societyData = {
      screenPath: 'SOCIETY.HOME.SERVICE_REQUEST_VIEW',
      params: {
        serviceRequestId: currentServiceRequestObject.id
      }
    };

    SendPushNotification(
      user,
      getNotificationTitle('NEW_SERVICE_REQUEST'),
      getNotificationBody('NEW_SERVICE_REQUEST', {
        displayId: currentServiceRequestObject.get('displayId'),
        service: service.get('name'),
      }),
      societyData
    );
    SaveUserNotification(
      user,
      NOTIFICATION_CATEGORY.serviceRequest,
      getNotificationTitle('NEW_SERVICE_REQUEST'),
      getNotificationBody('NEW_SERVICE_REQUEST', {
        displayId: currentServiceRequestObject.get('displayId'),
        service: service.get('name'),
      }),
      societyData
    );
  });

  sendNotificationToInsapccoAdmin(
    req,
    getNotificationTitle('NEW_SERVICE_REQUEST'),
    getNotificationBody('NEW_SERVICE_REQUEST', {
      displayId: currentServiceRequestObject.get('displayId'),
      service: service.get('name'),
    }),
    NOTIFICATION_CATEGORY.serviceRequest,
    {
      screenPath: 'INSPACCO.SERVICE_REQUEST.SERVICE_REQUEST_VIEW',
      params: {
        serviceRequestId: currentServiceRequestObject.id,
      },
    }
  );

  // 5. Add Reward Points
  if (currentServiceRequestObject.get('referralCode')) {
    await addRewardPoints(currentServiceRequestObject.get('referralCode'), req.user);
  }

  return;  
}

// ******************************************************************************************************
// SERVICE REQUEST : After Save Handler : Update
// ******************************************************************************************************

async function handleAfterSaveForUpdatedServiceRequest(req: Parse.Cloud.AfterSaveRequest, currentServiceRequestObject: any, previousServiceRequestObject: any): Promise<void> {

  // 1. Mark Service Request in progress when atleast one quotation gets added

  if(currentServiceRequestObject.get('status') === 'OPEN') {
    const rel = currentServiceRequestObject.relation('quotations');
    const q = rel.query();
    const quotations = await q.findAll(getSaveOrQueryOption(req.user));
    if(quotations) {
      currentServiceRequestObject.set('status', 'IN_PROGRESS');
      await currentServiceRequestObject.save(null, getSaveOrQueryOption(req.user));
    }
  }

  // 2. Send Notification if visit date changed
  
  const previousVisitDate = moment(previousServiceRequestObject.get('visitDate'));
  const currentVisitDate = moment(currentServiceRequestObject.get('visitDate'));

  if(!previousVisitDate.isSame(currentVisitDate)) {
    const service = await getServiceById(currentServiceRequestObject.get('service').id);
    const requester = await getUserById(currentServiceRequestObject.get('requester').id);
    sendNotificationToInsapccoAdmin(
      req,
      getNotificationTitle(
        'SERVICE_REQUEST_VISIT_DATE_CHANGED__INSAPCCO_ADMIN'
      ),
      getNotificationBody(
        'SERVICE_REQUEST_VISIT_DATE_CHANGED__INSAPCCO_ADMIN',
        {
          oldDate: moment(previousVisitDate).format('lll'),
          newDate: moment(currentVisitDate).format('lll'),
          service: service.get('name'),
          requester: requester.get('firstName'),
        }
      ),
      NOTIFICATION_CATEGORY.serviceRequest,
      {
        screenPath: 'INSPACCO.SERVICE_REQUEST.SERVICE_REQUEST_VIEW',
        params: {
          serviceRequestId: currentServiceRequestObject.id,
        },
      }
    );

    const date = moment_tz(currentServiceRequestObject.get('visitDate')).tz(TIMEZONE);
    const title = 'Visit Scheduled';
    const description = `A visit is scheduled for ${date.format('DD MMM, YYYY at hh:mm a')}`;
    const metadata = {
      visitDate: currentServiceRequestObject.get('visitDate'),
    };

    await createActivityHistory(currentServiceRequestObject, req.user, 'VISIT_SCHEDULED', title, description, metadata); 
  }

  const previousStatus = previousServiceRequestObject.get('status');
  const currentStatus = currentServiceRequestObject.get('status');


  // 3. Send Push Notification if service request status cancelled
  if(currentStatus === SERVICE_REQUEST_STATUS.CANCELLED && previousStatus !== currentStatus) {
    const service = await getServiceById(currentServiceRequestObject.get('service').id);
    const requester = await getUserById(currentServiceRequestObject.get('requester').id);

    const title = getNotificationTitle('SERVICE_REQUEST_CANCELLED');
    const body = getNotificationBody('SERVICE_REQUEST_CANCELLED', {
        service: service.get('name'),
    });
    
    sendNotificationToInsapccoAdmin(
      req,
      title,
      body,
      NOTIFICATION_CATEGORY.serviceRequest,
      {
        screenPath: 'INSPACCO.SERVICE_REQUEST.SERVICE_REQUEST_VIEW',
        params: {
          serviceRequestId: currentServiceRequestObject.id,
        },
      }
    );
    SendPushNotification(requester, title, body, {
      screenPath: isEmpty(currentServiceRequestObject.get('society'))
        ? 'GUEST.SERVICE_REQUEST.SERVICE_REQUEST_VIEW'
        : 'SOCIETY.HOME.SERVICE_REQUEST_VIEW',
      params: {
        serviceRequestId: currentServiceRequestObject.id,
      },
    });
    SaveUserNotification(
      requester,
      NOTIFICATION_CATEGORY.serviceRequest,
      title,
      body,
      {
        screenPath: isEmpty(currentServiceRequestObject.get('society'))
          ? 'GUEST.SERVICE_REQUEST.SERVICE_REQUEST_VIEW'
          : 'SOCIETY.HOME.SERVICE_REQUEST_VIEW',
        params: {
          serviceRequestId: currentServiceRequestObject.id,
        },
      }
    );
  }

  // 5. Create Activity Histroy Entry
  if(previousStatus !== currentStatus) {

    const previousStatusDisplayText = _.startCase(_.toLower(previousStatus.replaceAll(' ', '_')));
    const currentStatusDisplayText = _.startCase(_.toLower(currentStatus.replaceAll(' ', '_')));

    const title = `Status Updated - ${currentStatusDisplayText}`;
    const description = `The status is updated from "${previousStatusDisplayText}" to "${currentStatusDisplayText}"`;
    const metadata = {
      previousStatus,
      currentStatus,
    }; 
    await createActivityHistory(currentServiceRequestObject, req.user, currentStatus, title, description, metadata); 
  }

  return;
}

export async function createActivityHistory(
  serviceRequest: any, 
  user: Parse.User,
  status: any,
  title?: string,
  description?: string,
  metadata?: any,
): Promise<void> {

  if(user) {
    console.log('`storeActivityHistory');

    const createActivityHistoryFunc = createRecord('ActivityHistory');
    
    const action = 'editServiceRequestStatus';
    const activityHistoryObj = {
      action, 
      value: status,
      title: title ? title : _.startCase(_.toLower(status.replaceAll(' ', '_'))),
      description: description ? description : action,
      metadata: metadata ? metadata : undefined,
      createdBy: user,
    };

    const activityHistory = await createActivityHistoryFunc(activityHistoryObj, user);
    const q = new Parse.Query('ServiceRequest');
    q.equalTo('objectId', serviceRequest.id);
    const serviceRequestObj = await q.first({ useMasterKey: true });
    const rel = serviceRequestObj.relation('activityHistory');
    rel.add(activityHistory);
    await serviceRequestObj.save(null, getSaveOrQueryOption(user));
    console.log('`storeActivityHistory end', serviceRequestObj);
  } else {
    console.log(`
      ************************************************
      Unable to create activity history due to user not found
      serviceRequest: ${serviceRequest.id}
      status: ${status}
      title: ${title}
      description: ${description}
      metadata: ${metadata}
      ************************************************
    `);
  }
  return;
}