import { compact, get, lowerCase, startCase } from 'lodash';
import * as Parse from 'parse/node';
import SendPushNotification, { sendFirebaseNotification } from '../../util/sendPushNotification';
import {
  COLLECTIONS,
  NOTIFICATION_CATEGORY,
  ROLES,
} from '../../constants/common';
import { getNextSequence } from '../../util/displayId';
import executeGraphql from '../../util/graphqlClient';
import { getUserById, getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import { GET_SERVICE_SUBSCRIPTION } from '../graphql/queries/getServiceSubscription';
import { GET_INSPACCO_KAM_FOR_SOCIETY } from '../graphql/queries/getSocietyKAMs';
import SaveUserNotification from '../../util/saveUserNotification';
import {
  getNotificationBody,
  getNotificationTitle,
} from '../../util/notification';
import { getIncidentById } from '../../util/incident';
import {
  getSocietyAdmin,
  getSocietyKAMs,
  getSocietyManager,
} from '../../util/society';
import { findUserRoles } from '../../util/role';
import { GET_SOCIETY_MEMBERS } from '../graphql/queries/getSocietyMembers';
import { getPartnerAdmin } from '../../util/partner';
import { getSaveOrQueryOption } from '../../util';
export const beforeSaveIncidentHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  const user = req.master ? await getUserByUserName('SYSTEM_ADMIN') : req.user;
  req.context = {
    operation,
    oldDocumentValue:
      operation === 'UPDATE'
        ? await getIncidentById(req.object.id, req.user)
        : undefined,
  };
  if (operation === 'CREATE') {
    // Set displayId
    const nextId = await getNextSequence(COLLECTIONS.INCIDENT);
    req.object.set('displayId', nextId);

    // Set createdBy updatedBy
    req.object.set('createdBy', user);
    req.object.set('updatedBy', user);
    
    const serviceSubscriptionRes = await executeGraphql(
      req.user,
      GET_SERVICE_SUBSCRIPTION,
      {
        id: req.object.get('serviceSubscription').id,
      }
    );
    const serviceSubscription = get(
      serviceSubscriptionRes,
      'data.serviceSubscription'
    );

    // Set ACL
    if (serviceSubscription) {
      const acl = new Parse.ACL();
      acl.setRoleWriteAccess(
        `${ROLES.SOCIETY_ADMIN}__${serviceSubscription.society?.objectId}`,
        true
      );
      acl.setRoleReadAccess(
        `${ROLES.SOCIETY_ADMIN}__${serviceSubscription.society?.objectId}`,
        true
      );
      acl.setRoleWriteAccess(
        `${ROLES.SOCIETY_MANAGER}__${serviceSubscription.society?.objectId}`,
        true
      );
      acl.setRoleReadAccess(
        `${ROLES.SOCIETY_MANAGER}__${serviceSubscription.society?.objectId}`,
        true
      );
      acl.setRoleWriteAccess(
        `${ROLES.PARTNER_ADMIN}__${serviceSubscription.partner?.objectId}`,
        true
      );
      acl.setRoleReadAccess(
        `${ROLES.PARTNER_ADMIN}__${serviceSubscription.partner?.objectId}`,
        true
      );
      acl.setRoleWriteAccess(
        `${ROLES.PARTNER_KAM}__${serviceSubscription.partner?.objectId}`,
        true
      );
      acl.setRoleReadAccess(
        `${ROLES.PARTNER_KAM}__${serviceSubscription.partner?.objectId}`,
        true
      );
      req.object.setACL(acl);
    }

    // Set Assigned group and assignee
    req.object.set('status', 'OPEN');
    req.object.set('assignedGroup', 'INSPACCO');

    const inspaccoKAMRes = await executeGraphql(
      req.user,
      GET_INSPACCO_KAM_FOR_SOCIETY,
      {
        societyId: serviceSubscription.society?.objectId,
      }
    );
     if(!req.object.get('assignee')){
      const inspaccoKAM = get(
        inspaccoKAMRes,
        'data.societyMembers.edges[0].node.member'
      );
  
      req.object.set(
        'assignee',
        Parse.User.createWithoutData(inspaccoKAM.objectId)
      );
     }
  
  }

  if (operation === 'UPDATE') {
    req.object.set('updatedBy', user);
  }
};

export const beforeDeleteIncidentHandler = async (
  req: Parse.Cloud.BeforeDeleteRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const q = new Parse.Query(COLLECTIONS.INCIDENT);
  const incident = await q.get(req.object.id, getSaveOrQueryOption(req.user));
  if (incident.get('status') !== 'OPEN') {
    throw `Complaint in ${startCase(
      lowerCase(incident.get('status').replace('_', ''))
    )} status cannot be deleted.`;
  }
};

async function _sendNewComplaintNotification(
  req: Parse.Cloud.AfterSaveRequest,
  serviceSubscription: any,
) {
  const requester = await getUserById(req.object.get('createdBy').id);
  const assignee = Parse.User.createWithoutData(req.object.get('assignee').id);
  const societyAdmin = await getSocietyAdmin(
    serviceSubscription.society.objectId
  );
  const societyManager = await getSocietyManager(
    serviceSubscription.society.objectId
  );
  const partnerAdmin = await getPartnerAdmin(serviceSubscription.partner.objectId);
  const usersToNotify = [
    assignee,
    ...societyAdmin,
    ...societyManager,
    ...partnerAdmin
  ].filter((user: Parse.User) => {
    return user.id !== req.user.id;
  });


  compact(partnerAdmin).forEach(async(user)=>{

    const data = {
      screenPath: await getIncidentUserScreenPath(user),
      params: {
        incidentId: req.object.id,
      },
    }; 
    sendFirebaseNotification(user,
      getNotificationTitle('NEW_INCIDENT'),
      getNotificationBody('NEW_INCIDENT', {
        name: compact([
          requester.get('firstName'),
          requester.get('lastName'),
        ]).join(' '),
        society: serviceSubscription.society.name,
        service: serviceSubscription.service.name,
        displayId: req.object.get('displayId'),
      }),
      data);
      SaveUserNotification(
        user,
        NOTIFICATION_CATEGORY.complaint,
        getNotificationTitle('NEW_INCIDENT'),
        getNotificationBody('NEW_INCIDENT', {
          name: compact([
            requester.get('firstName'),
            requester.get('lastName'),
          ]).join(' '),
          society: serviceSubscription.society.name,
          service: serviceSubscription.service.name,
          displayId: req.object.get('displayId'),
        }),
        data
      );
  });

    compact(usersToNotify).forEach( async (user) => {
      const data = {
        screenPath: await getIncidentUserScreenPath(user),
        params: {
          incidentId: req.object.id,
        },
      };
      SendPushNotification(
        user,
        getNotificationTitle('NEW_INCIDENT'),
        getNotificationBody('NEW_INCIDENT', {
          name: compact([
            requester.get('firstName'),
            requester.get('lastName'),
          ]).join(' '),
          society: serviceSubscription.society.name,
          service: serviceSubscription.service.name,
          displayId: req.object.get('displayId'),
        }),
        data
      );
      SaveUserNotification(
        user,
        NOTIFICATION_CATEGORY.complaint,
        getNotificationTitle('NEW_INCIDENT'),
        getNotificationBody('NEW_INCIDENT', {
          name: compact([
            requester.get('firstName'),
            requester.get('lastName'),
          ]).join(' '),
          society: serviceSubscription.society.name,
          service: serviceSubscription.service.name,
          displayId: req.object.get('displayId'),
        }),
        data
      );
    });
  }

async function _sendComplaintAssignmentChangeNotification(
  req: Parse.Cloud.AfterSaveRequest
) {
  const assignee = Parse.User.createWithoutData(req.object.get('assignee').id);

  SendPushNotification(
    assignee,
    getNotificationTitle('INCIDENT_ASSIGNMENT_CHANGED'),
    getNotificationBody('INCIDENT_ASSIGNMENT_CHANGED', {
      displayId: req.object.get('displayId'),
    })
  );
  SaveUserNotification(
    assignee,
    NOTIFICATION_CATEGORY.complaint,
    getNotificationTitle('INCIDENT_ASSIGNMENT_CHANGED'),
    getNotificationBody('INCIDENT_ASSIGNMENT_CHANGED', {
      displayId: req.object.get('displayId'),
    })
  );
}

export const getIncidentUserScreenPath = async (user) => {
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
        screenPath = 'INSPACCO.INCIDENT.INCIDENT_DETAIL_VIEW';
        break;
      case ROLES.SOCIETY_ADMIN:
      case ROLES.SOCIETY_MANAGER:
        screenPath = 'SOCIETY.INCIDENTS.INCIDENT_DETAIL_VIEW';
        break;
      case ROLES.PARTNER_ADMIN:
        screenPath = 'PARTNER.INCIDENTS.INCIDENT_DETAIL_VIEW';
        break;

      default:
        screenPath = 'SOCIETY.INCIDENTS.INCIDENT_DETAIL_VIEW';
        break;
    }
    return screenPath;
  } catch (error) {
    return screenPath;
  }
};

async function _sendComplaintStatusChangeNotification(
  req: Parse.Cloud.AfterSaveRequest,
  serviceSubscription: any
) {
  const assignee = Parse.User.createWithoutData(req.object.get('assignee').id);
  const societyKAM = await getSocietyKAMs(serviceSubscription.society.objectId);
  const societyAdmin = await getSocietyAdmin(
    serviceSubscription.society.objectId
  );

  let societyManager = await getSocietyManager(
    serviceSubscription.society.objectId
  ); 

  //If complaint for society manager dont notify
  if (serviceSubscription.service.name === 'Society Manager') {
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
  

  compact(usersToNotify).forEach(async (user) => {
    const data = {
      screenPath: await getIncidentUserScreenPath(user),
      params: {
        incidentId: req.object.id,
      },
    };

    SendPushNotification(
      user,
      getNotificationTitle('INCIDENT_STATUS_CHANGED'),
      getNotificationBody('INCIDENT_STATUS_CHANGED', {
        displayId: req.object.get('displayId'),
        status: startCase(
          lowerCase(req.object.get('status').replace('_', ' '))
        ),
      }),
      data
    );
    SaveUserNotification(
      user,
      NOTIFICATION_CATEGORY.complaint,
      getNotificationTitle('INCIDENT_STATUS_CHANGED'),
      getNotificationBody('INCIDENT_STATUS_CHANGED', {
        displayId: req.object.get('displayId'),
        status: startCase(
          lowerCase(req.object.get('status').replace('_', ' '))
        ),
      }),
      data
    );
  });
}

export const afterSaveIncidentHandler = (req: Parse.Cloud.AfterSaveRequest) => {
  (async () => {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    try {
      const serviceSubscriptionRes = await executeGraphql(
        req.user,
        GET_SERVICE_SUBSCRIPTION,
        {
          id: req.object.get('serviceSubscription').id,
        }
      );
      const serviceSubscription = get(
        serviceSubscriptionRes,
        'data.serviceSubscription'
      );     

      if (req.user && req.context['operation'] == 'CREATE') {
     
        _sendNewComplaintNotification(req, serviceSubscription);
      } else {
        if (
          (<any>req.context['oldDocumentValue']).get('assignee').id !==
          req.object.get('assignee').id
        ) {
          _sendComplaintAssignmentChangeNotification(req);
        }

        if (
          (<any>req.context['oldDocumentValue']).get('status') !==
          req.object.get('status')
        ) {
          _sendComplaintStatusChangeNotification(req, serviceSubscription);
        }
      }
    } catch (error) {
      console.log(error);
    }
  })();
};
