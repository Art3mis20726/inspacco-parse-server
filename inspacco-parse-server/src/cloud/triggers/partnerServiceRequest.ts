import moment from 'moment';
import * as Parse from 'parse/node';
import executeGraphql from '../../util/graphqlClient';
import {
  COLLECTIONS,
  NOTIFICATION_CATEGORY,
  ROLES
} from '../../constants/common';
import { SERVICE_REQUEST_STATUS } from '../../constants/serviceRequestStatuses';
import { getNextSequence } from '../../util/displayId';
import {
  getNotificationBody,
  getNotificationTitle,
  sendNotificationToInsapccoAdmin
} from '../../util/notification';
import { getPartnerAdmin } from '../../util/partner';
import { getPartnerServiceRequestById } from '../../util/partnerServiceRequest';
import SaveUserNotification from '../../util/saveUserNotification';
import SendPushNotification, { sendFirebaseNotification } from '../../util/sendPushNotification';
import { getServiceById } from '../../util/service';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import { getSaveOrQueryOption } from '../../util';
export const beforeSavePartnerServiceRequestHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  req.context = {
    operation,
    prevObject:
      operation === 'UPDATE'
        ? await getPartnerServiceRequestById(req.object.id)
        : undefined,
  };
  if (operation === 'CREATE') {
    // Set displayId
    const nextId = await getNextSequence(COLLECTIONS.PARTNER_SERVICE_REQUEST);
    req.object.set('displayId', nextId);

    setACL(req);
  }
};

function setACL(req: Parse.Cloud.BeforeSaveRequest) {
  const acl = new Parse.ACL();
  if (req.object.get('partner')) {
    acl.setRoleReadAccess(
      `${ROLES.PARTNER_ADMIN}__${req.object.get('partner').id}`,
      true
    );
    acl.setRoleWriteAccess(
      `${ROLES.PARTNER_ADMIN}__${req.object.get('partner').id}`,
      true
    );
  }
  acl.setRoleReadAccess(ROLES.INSPACCO_ADMIN, true);
  acl.setRoleWriteAccess(ROLES.INSPACCO_ADMIN, true);
  req.object.setACL(acl);
}

export const afterSavePartnerServiceRequestHandler = (
  req: Parse.Cloud.AfterSaveRequest
) => {
  (async () => {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    if (req.context['operation'] === 'CREATE') {
      try {
        const service = await getServiceById(req.object.get('service').id);
        const partnerAdmins = await getPartnerAdmin(
          req.object.get('partner').id
        );
        partnerAdmins.forEach((partner) => {
          const title = getNotificationTitle('PARTNER_SERVICE_REQUEST');
          const body = getNotificationBody('PARTNER_SERVICE_REQUEST', {
            displayId: req.object.get('displayId'),
            service: service.get('name'),
          });
          const data = {
            screenPath: 'PARTNER.HOME.SERVICE_REQUEST_VIEW',
            params: {
              serviceRequestId: req.object.id ,
            },
          };
          sendFirebaseNotification(partner, title, body, data);
          SendPushNotification(partner, title, body, data);
          SaveUserNotification(
            partner,
            NOTIFICATION_CATEGORY.PartnerServiceRequest,
            title,
            body,
            data
          );
        });
      } catch (error) {
        console.log(error);
      }

      // Mark ServiceRequest Inprogress when atleast one partnerServiceRequest gets added
      const q = new Parse.Query('ServiceRequest');
      const serviceReqRecord = await q.get(
        req.object.get('serviceRequest').id,
        getSaveOrQueryOption(req.user)
      );
      if (serviceReqRecord && serviceReqRecord.get('status') === 'OPEN') {
        serviceReqRecord.set('status', 'IN_PROGRESS');
        await serviceReqRecord.save(null, getSaveOrQueryOption(req.user));
      }
    } else {
      // Mark PartnerServiceRequest Inprogress when atleast one quotation gets added
      const rel = req.object.relation('quotations');
      const q = rel.query();
      const quotations = await q.findAll(getSaveOrQueryOption(req.user));
      if (quotations && req.object.get('status') === 'OPEN') {
        req.object.set('status', 'IN_PROGRESS');

        await req.object.save(null, getSaveOrQueryOption(req.user));
      }
    }

    // Visit Date changed
    if (
      req.context['operation'] === 'UPDATE' &&
      !moment((<any>req.context['prevObject']).get('visitDate')).isSame(
        moment(req.object.get('visitDate'))
      )
    ) {
      const service = await getServiceById(req.object.get('service').id);
      const partnerAdmin = await getPartnerAdmin(req.object.get('partner').id);
      const title = getNotificationTitle(
        'SERVICE_REQUEST_VISIT_DATE_CHANGED__PARTNER'
      );
      const body = getNotificationBody(
        'SERVICE_REQUEST_VISIT_DATE_CHANGED__PARTNER',
        {
          oldDate: moment((<any>req.context['prevObject']).get('visitDate')).format(
            'lll'
          ),
          newDate: moment(req.object.get('visitDate')).format('lll'),
          service: service.get('name'),
        }
      );
      const data = {
        screenPath: 'PARTNER.HOME.SERVICE_REQUEST_VIEW',
        params: {
          partnerServiceRequestId: req.object.id,
        },
      };
      partnerAdmin.forEach((user) => {
        sendFirebaseNotification(user, title, body, data);
        SendPushNotification(user, title, body, data);
        SaveUserNotification(
          user,
          NOTIFICATION_CATEGORY.serviceRequest,
          title,
          body,
          data
        );
      });
    }

    // Status changed to cancelled
    if (
      req.context['operation'] === 'UPDATE' &&
      (<any>req.context['prevObject']).get('status') !== req.object.get('status') &&
      req.object.get('status') === SERVICE_REQUEST_STATUS.CANCELLED
    ) {
      const service = await getServiceById(req.object.get('service').id);

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
            serviceRequestId: req.object.id,
          },
        }
      );
      const partnerAdmin = await getPartnerAdmin(req.object.get('partner').id);
      partnerAdmin.forEach((user) => {
        sendFirebaseNotification(user, title, body, {
          screenPath: 'PARTNER.HOME.SERVICE_REQUEST_VIEW',
          params: {
            partnerServiceRequestId: req.object.id,
          },
        });
        SendPushNotification(user, title, body, {
          screenPath: 'PARTNER.HOME.SERVICE_REQUEST_VIEW',
          params: {
            partnerServiceRequestId: req.object.id,
          },
        });
        SaveUserNotification(
          user,
          NOTIFICATION_CATEGORY.serviceRequest,
          title,
          body,
          {
            screenPath: 'PARTNER.HOME.SERVICE_REQUEST_VIEW',
            params: {
              partnerServiceRequestId: req.object.id,
            },
          }
        );
      });
    }
  })();
};
