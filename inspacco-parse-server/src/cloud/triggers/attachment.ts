/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Parse from 'parse/node';
import { getUserById, getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import { ROLES } from '../../constants/common';
import { get, isEmpty } from 'lodash';
import executeGraphql from '../../util/graphqlClient';
import { NOTIFICATION_CATEGORY } from '../../constants/common';
import {
  getNotificationBody,
  getNotificationTitle,
  sendNotificationToInsapccoAdmin,
} from '../../util/notification';
import { GET_ATTACHMENT_DATA } from '../graphql/queries/getAttachmentData';
import { GET_REQUESTER_DATA } from '../graphql/queries/getRequesterData';
import SendPushNotification from '../../util/sendPushNotification';
import SaveUserNotification from '../../util/saveUserNotification';
import { GET_ADMIN_REQUESTER_DATA } from '../graphql/queries/getAdminRequesterData';
import { createActivityHistory } from './serviceRequest';

const ATTACHMENTS_TYPE = {
  SERVICE_REQUEST_CREATION_ATTACHMENT: {
    name: 'Request Attachments',
  },
  InspaccoAdmin: {
    name: 'Quotation Attachments',
  },
  SERVICE_REQUEST_RESOLUTION_ATTACHMENT: {
    name: 'Completion Attachments',
  },
  SERVICE_REQUEST_PO_ATTACHMENT: {
    name: 'Client PO Attachments',
  },
  SERVICE_REQUEST_OTHER_ATTACHMENT: {
    name: 'Other Attachments',
  }
};

// ******************************************************************************************************
// Attachments REQUEST : Before Save Handler
// ******************************************************************************************************

export const beforeSaveAttachmentHandler = async (req: Parse.Cloud.BeforeSaveRequest): Promise<any> => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  const user = req.master ? await getUserByUserName('SYSTEM_ADMIN') : req.user;
  if (operation === 'CREATE') {
    req.object.set('createdBy', user);
    setACL(req);
  }
  req.context = {
    operation,
  };
};

function setACL(req: Parse.Cloud.BeforeSaveRequest) {
  const acl = new Parse.ACL();
  const permissionGroupId: string = req.object.get('permissionGroupId');
  const permissionGroups: string[] = permissionGroupId.split('|');
  permissionGroups.forEach((group) => {
    const [type, objectId] = group.split('_');
    if (type === 'PARTNER') {
      const partnerAdminRole = `${ROLES.PARTNER_ADMIN}__${objectId}`;
      acl.setRoleReadAccess(partnerAdminRole, true);
      acl.setRoleWriteAccess(partnerAdminRole, true);
      acl.setRoleReadAccess("*", true);
    } else if (type === 'SOCIETY') {
      const societyAdminRole = `${ROLES.SOCIETY_ADMIN}__${objectId}`;
      const societyManagerRole = `${ROLES.SOCIETY_MANAGER}__${objectId}`;
      acl.setRoleReadAccess(societyAdminRole, true);
      acl.setRoleWriteAccess(societyAdminRole, true);
      acl.setRoleReadAccess(societyManagerRole, true);
      acl.setRoleWriteAccess(societyManagerRole, true);
      acl.setRoleReadAccess("*", true);
    }
  });
  acl.setWriteAccess(req.user,true);
  acl.setReadAccess(req.user,true);
  acl.setRoleReadAccess(ROLES.PARTNER_ADMIN, true);
  acl.setRoleWriteAccess(ROLES.PARTNER_ADMIN, true);
  acl.setRoleReadAccess(ROLES.INSPACCO_KAM, true);
  acl.setRoleReadAccess(ROLES.PARTNER_KAM, true);
  acl.setRoleWriteAccess(ROLES.PARTNER_KAM, true);
  acl.setRoleWriteAccess(ROLES.INSPACCO_KAM, true);
  acl.setRoleReadAccess(ROLES.SOCIETY_ADMIN, true);
  acl.setRoleReadAccess(ROLES.SOCIETY_MANAGER, true);
  acl.setRoleWriteAccess(ROLES.SOCIETY_ADMIN, true);
  acl.setRoleWriteAccess(ROLES.SOCIETY_MANAGER, true);
  req.object.setACL(acl);
}

// ******************************************************************************************************
// Attachments REQUEST : After Save Handler
// ******************************************************************************************************

export const afterSaveAttachmentHandler = async (req: Parse.Cloud.AfterSaveRequest): Promise<any> => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);

  const context = req.context;
  const operation = context['operation'];
  const currentAttachmentObject = req.object;

  if (operation === 'CREATE') {
    setTimeout(async () => {
      handleAfterSaveForNewAttachment(req, currentAttachmentObject);
    }, 1000);
  }
};

// ******************************************************************************************************
// Attachments REQUEST : After Save Handler : Create
// ******************************************************************************************************

async function handleAfterSaveForNewAttachment(req: Parse.Cloud.AfterSaveRequest, currentAttachmentObject: any): Promise<void> {
  const attachmentsGQL = await executeGraphql(
    req.user,
    GET_ATTACHMENT_DATA,
    { id: currentAttachmentObject.id },
    true
  );

  const parentId = get(
    attachmentsGQL.data.attachments,
    'edges[0].node.parentId',
    null
  );

  const documentModule = get(
    attachmentsGQL.data.attachments,
    'edges[0].node.module',
    null
  );

  const getServiceRequesterIdRes = await getRequesterId(parentId, req);
  const getAdminServiceRequesterIdRes = await getAdminRequesterId(parentId, req);

  const serviceRequestwer = get(
    getServiceRequesterIdRes.data.serviceRequests,
    'edges[0].node.requester.objectId'
  );
  const serviceRequestId = get(
    getServiceRequesterIdRes.data.serviceRequests,
    'edges[0].node.objectId'
  );

  const serviceName = get(
    getServiceRequesterIdRes.data.serviceRequests,
    'edges[0].node.service.name'
  );

  const adminRequester = get(
    getAdminServiceRequesterIdRes.data.partnerServiceRequests,
    'edges[0].node.objectId'
  );
  const adminServiceName = get(
    getAdminServiceRequesterIdRes.data.partnerServiceRequests,
    'edges[0].node.service.name'
  );

  const data = {
    screenPath:'INSPACCO.SERVICE_REQUEST.PARTNER_SERVICE_REQUEST_VIEW',
    params: {          
      id: adminRequester,
      partnerServiceReqId: adminRequester
    }
  };

  const societyData = {
    screenPath:'SOCIETY.HOME.SERVICE_REQUEST_VIEW',
    params: { 
      id: serviceRequestId,         
      serviceRequestId: serviceRequestId
    }
  };

  // 1. Send Notification
  if (!isEmpty(serviceRequestwer) && documentModule === 'InspaccoAdmin') {
    const requester = await getUserById(serviceRequestwer);
    SendPushNotification(
      requester,
      getNotificationTitle('SERVICE_QUOTATION_DOCUMENT'),
      getNotificationBody('SERVICE_QUOTATION_DOCUMENT', {
        service: serviceName || '',
      }),
      societyData
    );
    SaveUserNotification(
      requester,
      NOTIFICATION_CATEGORY.partnerServiceQuotation,
      getNotificationTitle('SERVICE_QUOTATION_DOCUMENT'),
      getNotificationBody('SERVICE_QUOTATION_DOCUMENT', {
        service: serviceName || '',
      }),
      societyData
    );
  } else if(!isEmpty(adminRequester) && documentModule === 'PartnerServiceQuatation'){
    sendNotificationToInsapccoAdmin(
      req.user,
      getNotificationTitle('PARTNER_SERVICE_QUOTATION_DOCUMENT'),
      getNotificationBody('PARTNER_SERVICE_QUOTATION_DOCUMENT',{
        service: adminServiceName
      }),
      NOTIFICATION_CATEGORY.partnerServiceQuotation,
      data
    );
  }

  // 2. Create Activity History
  if(serviceRequestId) {
    const serviceRequest = { id: serviceRequestId };
    const title = 'Attachment Uploaded';

    const module = currentAttachmentObject.get('module');

    const attachmentType = ATTACHMENTS_TYPE[module] ? ATTACHMENTS_TYPE[module].name : 'Some Other Attachments';
    
    const description = `File ${currentAttachmentObject.get('fileName')} uploaded to ${attachmentType}`;
    const metadata = {
      serviceRequestId,
      attachmentId: currentAttachmentObject.id
    };

    await createActivityHistory(serviceRequest, req.user, `ATTACHMENT_UPLOADED`, title, description, metadata);
  }
  
  
  return;
}

async function getRequesterId(parentId, req) {

  const partnerServiceDocumentRequestGQL = await executeGraphql(
    req.user,
    GET_REQUESTER_DATA,
    {
      parentId: parentId,
    },
    true
  );
  return partnerServiceDocumentRequestGQL;
}

async function getAdminRequesterId(parentId, req) {

  const adminServiceDocumentRequestGQL = await executeGraphql(
    req.user,
    GET_ADMIN_REQUESTER_DATA,
    {
      parentId: parentId,
    },
    true
  );
  return adminServiceDocumentRequestGQL;
}

// ******************************************************************************************************
// Attachments REQUEST : After Delete Handler
// ******************************************************************************************************

export async function afterDeleteAttachmentHandler(req: Parse.Cloud.AfterDeleteRequest): Promise<void> {

  await setUserForCloudFunctionAndTriggersIfRequired(req);
  
  const currentAttachmentObject = req.object;

  const parentId = currentAttachmentObject.get('parentId');

  const getServiceRequesterIdRes = await getRequesterId(parentId, req);
  const serviceRequestId = get(
    getServiceRequesterIdRes.data.serviceRequests,
    'edges[0].node.objectId'
  );

  // 2. Create Activity History
  if(serviceRequestId) {
    const serviceRequest = { id: serviceRequestId };
    const title = 'Attachment Deleted';

    const module = currentAttachmentObject.get('module');

    const attachmentType = ATTACHMENTS_TYPE[module] ? ATTACHMENTS_TYPE[module].name : 'Some Other Attachments';
    
    const description = `File ${currentAttachmentObject.get('fileName')} deleted from ${attachmentType}`;
    const metadata = {
      serviceRequestId,
      attachmentId: currentAttachmentObject.id
    };

    await createActivityHistory(serviceRequest, req.user, `ATTACHMENT_DELETED`, title, description, metadata);
  }
  return;
}