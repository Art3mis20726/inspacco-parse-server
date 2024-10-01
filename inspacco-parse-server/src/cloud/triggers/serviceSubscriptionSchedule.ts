import moment from 'moment';
import * as Parse from 'parse/node';
import { getServiceSubscription } from '../../util/serviceSubscription';
import { getServiceSubscriptionScheduleById } from '../../util/serviceSubscriptionSchedule';
import { getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import {
  sendServiceVisitDateChangeNotification,
  sendServiceVisitNotificationToPartnerAdmin,
  sendServiceVisitNotificationToSocietyAdmin,
  sendServiceVisitNotificationToSocietyKAM,
  SERVICE_SUBSCRIPTION_VISITS,
} from '../functions/visit-scheduler/visit-scheduler';

export const beforeSaveServiceSubscriptionSchedule = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  req.context = {
    operation,
    prevObject:
      operation === 'UPDATE'
        ? await getServiceSubscriptionScheduleById(req.object.id)
        : undefined,
  };
  if (
    operation === 'CREATE' ||
    !moment(req.object.get('date')).isSame(
      moment((<any>req.context['prevObject']).get('date'))
    )
  ) {
    if (moment(req.object.get('date')).diff(moment(), 'days') <= 7) {
      req.object.set('status', SERVICE_SUBSCRIPTION_VISITS.SCHEDULED);
    } else {
      req.object.set('status', SERVICE_SUBSCRIPTION_VISITS.UPCOMING);
    }
  }
};

export const afterSaveServiceSubscriptionSchedule = async (
  req: Parse.Cloud.AfterSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const user = req.master ? await getUserByUserName('SYSTEM_ADMIN') : req.user;
  if (
    req.context['operation'] === 'CREATE' &&
    req.object.get('status') === SERVICE_SUBSCRIPTION_VISITS.SCHEDULED
  ) {
    const serviceSubscription = await getServiceSubscription(
      req.object.get('serviceSubscription').id
    );
    sendServiceVisitNotificationToSocietyAdmin(req.object, serviceSubscription);
    sendServiceVisitNotificationToPartnerAdmin(req.object, serviceSubscription);
  }

  if (
    req.context['operation'] === 'UPDATE' &&
    !moment(req.object.get('date')).isSame(
      moment((<any>req.context['prevObject']).get('date'))
    ) &&
    (<any>req.context['prevObject']).get('status') ===
      SERVICE_SUBSCRIPTION_VISITS.SCHEDULED
  ) {
    const serviceSubscription = await getServiceSubscription(
      req.object.get('serviceSubscription').id
    );
    sendServiceVisitDateChangeNotification(
      req.object,
      serviceSubscription,
      (<any>req.context['prevObject']).get('date')
    );
  } else if (
    req.context['operation'] === 'UPDATE' &&
    !moment(req.object.get('date')).isSame(
      moment((<any>req.context['prevObject']).get('date'))
    ) &&
    (<any>req.context['prevObject']).get('status') ===
      SERVICE_SUBSCRIPTION_VISITS.UPCOMING &&
    req.object.get('status') === SERVICE_SUBSCRIPTION_VISITS.SCHEDULED
  ) {
    const serviceSubscription = await getServiceSubscription(
      req.object.get('serviceSubscription').id
    );
    sendServiceVisitNotificationToSocietyAdmin(req.object, serviceSubscription);
    sendServiceVisitNotificationToPartnerAdmin(req.object, serviceSubscription);
    sendServiceVisitNotificationToSocietyKAM(req.object, serviceSubscription);
  }
};
