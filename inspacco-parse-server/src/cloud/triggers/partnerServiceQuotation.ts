import * as Parse from 'parse/node';
import executeGraphql from '../../util/graphqlClient';
import { COLLECTIONS, NOTIFICATION_CATEGORY } from '../../constants/common';
import { getNextSequence } from '../../util/displayId';
import {
  getNotificationBody,
  getNotificationTitle,
  sendNotificationToInsapccoAdmin,
} from '../../util/notification';
import { GET_PARTNER_SERVICE_QUOTATION_INFO } from '../graphql/queries/getPartnerServiceQuotationInfo';
import { get } from 'lodash';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';

export const beforeSavePartnerServiceQuotationHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  req.context = {
    operation,
  };
  if (operation === 'CREATE') {
    // Set displayId
    const nextId = await getNextSequence(COLLECTIONS.PARTNER_SERVICE_QUOTATION);
    req.object.set('displayId', nextId);
  }
};

export const afterSavePartnerServiceQuotationHandler = async (
  req: Parse.Cloud.AfterSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (req.context['operation'] === 'CREATE') {
    setTimeout(async() => {
      const partnerServiceRequestGQL = await executeGraphql(
        req.user,
        GET_PARTNER_SERVICE_QUOTATION_INFO,
        {
          quotationId: req.object.id,
        },
        true
      );

      const serviceName = get(
        partnerServiceRequestGQL.data.partnerServiceRequests,
        'edges[0].node.service.name',
        null
      );

      const serviceRequestId =  get(
        partnerServiceRequestGQL.data.partnerServiceRequests,
        'edges[0].node.objectId',
        null
      );

      const data = {
        screenPath:'INSPACCO.SERVICE_REQUEST.PARTNER_SERVICE_REQUEST_QUOTATION_VIEW',
        params: {          
          quotationId: req.object.id,
          partnerServiceRequestId:serviceRequestId
        }
      };

    sendNotificationToInsapccoAdmin(
      req,
      getNotificationTitle('PARTNER_SERVICE_QUOTATION'),
      getNotificationBody('PARTNER_SERVICE_QUOTATION', {
        displayId: req.object.get('displayId'),
        service:serviceName || ''
      }),
      NOTIFICATION_CATEGORY.partnerServiceQuotation,
      data
    );
    },1000);
  }
};
