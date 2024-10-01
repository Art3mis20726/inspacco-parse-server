/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Parse from 'parse/node';
import _ from 'lodash';
import {
  getNotificationBody,
  sendNotificationToInsapccoAdmin,
} from '../../util/notification';
import { getNotificationTitle } from '../../util/notification';
import SaveUserNotification from '../../util/saveUserNotification';
import SendPushNotification from '../../util/sendPushNotification';
import { COLLECTIONS, NOTIFICATION_CATEGORY } from '../../constants/common';
import { getNextSequence } from '../../util/displayId';
import { getUserById, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import executeGraphql from '../../util/graphqlClient';
import { GET_SERVICE_QUOTATION_INFO } from '../graphql/queries/getServiceQuotationInfo';
import { compact, get, isEmpty } from 'lodash';
import { getServiceQuotationById } from '../../util/serviceQuotation';
import { SERVICE_QUOTATION_STATUS } from '../../constants/serviceQuotationStatuses';
import { GET_SERVICE_REQUEST_BY_QUOTATION_ID } from '../graphql/queries/getServiceRequestByQuotationId';
import { createActivityHistory } from './serviceRequest';
import rollbar from '../../util/rollbar';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

// ******************************************************************************************************
// SERVICE QUOTATION : Before Save Handler
// ******************************************************************************************************

export const beforeSaveServiceQuotationHandler = async (req: Parse.Cloud.BeforeSaveRequest): Promise<any> => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  req.context = {
    operation,
    prevObject:
      operation === 'UPDATE'
        ? await getServiceQuotationById(req.object.id)
        : undefined,
  };
  if (operation === 'CREATE') {
    // Set displayId
    const nextId = await getNextSequence(COLLECTIONS.SERVICE_QUOTATION);
    req.object.set('displayId', nextId);
  }
};

// ******************************************************************************************************
// SERVICE QUOTATION : After Save Handler
// ******************************************************************************************************

export const afterSaveServiceQuotationHandler = async (req: Parse.Cloud.BeforeSaveRequest): Promise<void> => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);

  const context = req.context;
  const operation = context['operation'];
  const currentServiceQuotationObject = req.object;

  if (operation === 'CREATE') {
    setTimeout(() => {
      handleAfterSaveForNewServiceQuotation(req, currentServiceQuotationObject);
    }, 1000);
    return;
  } else {
    const previousServiceQuotationObject = context['prevObject'];
    return handleAfterSaveForUpdatedServiceQuotation(req, currentServiceQuotationObject, previousServiceQuotationObject);
  }
};

// ******************************************************************************************************
// SERVICE QUOTATION : After Save Handler : Create
// ******************************************************************************************************

async function handleAfterSaveForNewServiceQuotation(req: Parse.Cloud.AfterSaveRequest, currentServiceQuotationObject: any): Promise<void> {

  // 1. Get Service Request Info
  const serviceRequestGQL = await executeGraphql(
    req.user,
    GET_SERVICE_QUOTATION_INFO,
    { quotationId: currentServiceQuotationObject.id },
    true
  );

  const requestId = get(
    serviceRequestGQL.data.serviceRequests,
    'edges[0].node.requester.objectId',
    null
  );

  const serviceName = get(
    serviceRequestGQL.data.serviceRequests,
    'edges[0].node.service.name',
    null
  );
  // 2. Send Notification
  if (!isEmpty(requestId)) {
    const requester = await getUserById(requestId);
    try {
      const title = getNotificationTitle('SERVICE_QUOTATION');
      const body = getNotificationBody('SERVICE_QUOTATION', {
        displayId: req.object.get('displayId'),
        service: serviceName || '',
      });
      const serviceRequestId = get(
        serviceRequestGQL.data.serviceRequests,
        'edges[0].node.objectId',
        null
      );
      //Check for guest
      const societyId = get(
        serviceRequestGQL.data.serviceRequests,
        'edges[0].node.society.objectId',
        null
      );

      const data = {
        screenPath: societyId
          ? 'SOCIETY.HOME.SERVICE_QUOTATION_VIEW'
          : 'GUEST.SERVICE_REQUEST.SERVICE_REQUEST_QUOTATION_VIEW',
        params: {
          quotationId: req.object.id,
          serviceRequestId: serviceRequestId,
        },
      };
      SendPushNotification(requester, title, body, data);
      SaveUserNotification(
        requester,
        NOTIFICATION_CATEGORY.serviceQuotation,
        title,
        body,
        data
      );
    } catch (error) {
      rollbar.error(`${requestId} failed to handle after save new qoutation ${error.message}`)   
      console.log(error);
    }
  } else {
    console.log('Requester not found for service quoation notification.');
  }

  const quoationNumber = get(serviceRequestGQL.data.serviceRequests, 'edges[0].node.quotations.edges', 0).length;
  const serviceRequest = { id: get(serviceRequestGQL.data.serviceRequests, 'edges[0].node.objectId', null) };

  if(serviceRequest) {
    const query = currentServiceQuotationObject.relation('items').query();  
    const totalItems = (await query.find({ useMasterKey: true })).length;
    const totalAmount = currentServiceQuotationObject.get('totalAmount');

    const title = 'Quotation Submitted';
    const description = `Quotation [#${quoationNumber}] with [${totalItems}] items totaling [Rs. ${totalAmount}] is submitted.`;
    const metadata = {
      quotationId: currentServiceQuotationObject.id,
      totalItems,
      totalAmount
    };

    await createActivityHistory(serviceRequest, req.user, `QUOTATION_SUBMITTED [#${quoationNumber}]`, title, description, metadata);
  }
  return;  
}

// ******************************************************************************************************
// SERVICE REQUEST : After Save Handler : Update
// ******************************************************************************************************

async function handleAfterSaveForUpdatedServiceQuotation(req: Parse.Cloud.AfterSaveRequest, currentServiceQuotationObject: any, previousServiceQuotationObject: any): Promise<void> {

  const prevQuotationStatus = previousServiceQuotationObject.get('status');
  const currentQuotationStatus = currentServiceQuotationObject.get('status');

  if (prevQuotationStatus !== currentQuotationStatus) {

    const serviceReqRes = await executeGraphql(
      req.user,
      GET_SERVICE_REQUEST_BY_QUOTATION_ID,
      {
        quotationId: currentServiceQuotationObject.id,
      },
      true
    );

    const quotations: {node: {objectId: string } } [] = get(serviceReqRes.data.serviceRequests, 'edges[0].node.quotations.edges', []);
    const quoationNumber = quotations.findIndex((item) => item.node.objectId === currentServiceQuotationObject.id) + 1;

    const serviceRequest = { id: get(serviceReqRes.data.serviceRequests, 'edges[0].node.objectId', null) };

    const query = currentServiceQuotationObject.relation('items').query();  
    const totalItems = (await query.find({ useMasterKey: true })).length;
    const totalAmount = currentServiceQuotationObject.get('totalAmount');

    const historyTitle = 'Quotation ' + _.startCase(_.toLower(currentQuotationStatus.replaceAll(' ', '_')));
    const description = `Quotation [#${quoationNumber}] with [${totalItems}] items totaling [Rs. ${totalAmount}] is ${_.toLower(currentQuotationStatus)}.`;
    const metadata = {
      quotationId: currentServiceQuotationObject.id,
      currentQuotationStatus,
      totalItems,
      totalAmount
    };

    if(currentQuotationStatus === SERVICE_QUOTATION_STATUS.ACCEPTED) {

      const title = getNotificationTitle('SERVICE_QUOTATION_ACCEPTED');
      const body = getNotificationBody('SERVICE_QUOTATION_ACCEPTED', {
        user: req.user
          ? compact([req.user.get('firstName'), req.user.get('lastName')]).join(
              ' '
            )
          : 'System',
        quotationNumber: currentServiceQuotationObject.get('displayId'),
        serviceName: get(
          serviceReqRes,
          'data.serviceRequests.edges.[0].node.service.name'
        ),
      });
      
      sendNotificationToInsapccoAdmin(
        req,
        title,
        body,
        NOTIFICATION_CATEGORY.serviceRequest,
        {
          screenPath: 'INSPACCO.SERVICE_REQUEST.SERVICE_REQUEST_VIEW',
          params: {
            serviceRequestId: get(
              serviceReqRes,
              'data.serviceRequests.edges.[0].node.objectId'
            )
          },
        }
      );
    }

    await createActivityHistory(serviceRequest, req.user, `QUOTATION_${_.toUpper(currentQuotationStatus)} [#${quoationNumber}]`, historyTitle, description, metadata);
  }

  return;
}