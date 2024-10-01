import moment from 'moment';
import * as Parse from 'parse/node';
import { getServiceSubscription } from '../../../util/serviceSubscription';
import { COLLECTIONS, NOTIFICATION_CATEGORY } from '../../../constants/common';
import {
  getSocietyAdmin,
  getSocietyById,
  getSocietyKAMs,
  getSocietyManager,
} from '../../../util/society';
import { getPartnerAdmin, getPartnerById } from '../../../util/partner';
import SendPushNotification, { sendFirebaseNotification } from '../../../util/sendPushNotification';
import {
  getNotificationTitle,
  getNotificationBody,
  sendNotificationToInsapccoAdmin,
} from '../../../util/notification';
import { getServiceById } from '../../../util/service';
import SaveUserNotification from '../../../util/saveUserNotification';
import { title } from 'process';
import { getServiceRequestById } from '../../../util/serviceRequest';
import { getUserById, setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';
import { isEmpty } from 'lodash';

export enum SERVICE_SUBSCRIPTION_VISITS {
  UPCOMING = 'UPCOMING',
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export async function sendServiceVisitDateChangeNotification(
  serviceVisitRec: Parse.Object,
  serviceSubscriptionRec: Parse.Object,
  oldVisitDate: string
) {
  const societyAdmins = await getSocietyAdmin(
    serviceSubscriptionRec.get('society').id
  );
  const societyManagers = await getSocietyManager(
    serviceSubscriptionRec.get('society').id
  );
  const societyKAMs = await getSocietyKAMs(
    serviceSubscriptionRec.get('society').id
  );
  const service = await getServiceById(
    serviceSubscriptionRec.get('service').id
  );
  const society = await getSocietyById(
    serviceSubscriptionRec.get('society').id
  );
  const partnerAdmins = await getPartnerAdmin(
    serviceSubscriptionRec.get('partner').id
  );

  const title = getNotificationTitle(
    'SERVICE_SUBSCRIPTION_VISIT_SCHEDULED_DATE_CHANGE'
  );
  const body = getNotificationBody(
    'SERVICE_SUBSCRIPTION_VISIT_SCHEDULED_DATE_CHANGE',
    {
      service: service.get('name'),
      society: society.get('name'),
      newDate: moment(serviceVisitRec.get('date'))
        .utcOffset('+0530')
        .format('ddd, D MMM YYYY'),
      oldDate: moment(oldVisitDate)
        .utcOffset('+0530')
        .format('ddd, D MMM YYYY'),
    }
  );

  [...societyAdmins, ...societyManagers].forEach((user) => {
    SendPushNotification(user, title, body, {
      screenPath: 'SOCIETY.SERVICES.SERVICE_SUBSCRIPTION_VIEW',
      params: {
        serviceSubscriptionId: serviceSubscriptionRec.id,
      },
    });
    SaveUserNotification(
      user,
      NOTIFICATION_CATEGORY.serviceVisit,
      title,
      body,
      {
        screenPath: 'SOCIETY.SERVICES.SERVICE_SUBSCRIPTION_VIEW',
        params: {
          serviceSubscriptionId: serviceSubscriptionRec.id,
        },
      }
    );
  });
  [...societyKAMs].forEach((user) => {
    SendPushNotification(user, title, body, {
      screenPath: 'INSPACCO.SOCIETY.SERVICE_SUBSCRIPTION_VIEW',
      params: {
        serviceSubscriptionId: serviceSubscriptionRec.id,
      },
    });
    SaveUserNotification(
      user,
      NOTIFICATION_CATEGORY.serviceVisit,
      title,
      body,
      {
        screenPath: 'INSPACCO.SOCIETY.SERVICE_SUBSCRIPTION_VIEW',
        params: {
          serviceSubscriptionId: serviceSubscriptionRec.id,
        },
      }
    );
  });
  [...partnerAdmins].forEach((user) => {

    const data = {
      screenPath: 'PARTNER.HOME.SERVICE_SUBSCRIPTION_VIEW',
      params: {
        societyId: serviceSubscriptionRec.get('society').id,
      },
    };  
    
    sendFirebaseNotification(user, title, body, data);
    SendPushNotification(user, title, body, {
      screenPath: 'PARTNER.HOME.SERVICE_SUBSCRIPTION_VIEW',
      params: {
        societyId: serviceSubscriptionRec.get('society').id,
      },
    });
    SaveUserNotification(
      user,
      NOTIFICATION_CATEGORY.serviceVisit,
      title,
      body,
      {
        screenPath: 'PARTNER.HOME.SERVICE_SUBSCRIPTION_VIEW',
        params: {
          societyId: serviceSubscriptionRec.get('society').id,
        },
      }
    );
  });
}

export async function sendNextDayServiceVisitNotification(
  serviceVisitRec: Parse.Object,
  serviceSubscriptionRec: Parse.Object
) {
  const societyAdmins = await getSocietyAdmin(
    serviceSubscriptionRec.get('society').id
  );
  const societyManagers = await getSocietyManager(
    serviceSubscriptionRec.get('society').id
  );
  const societyKAMs = await getSocietyKAMs(
    serviceSubscriptionRec.get('society').id
  );
  const service = await getServiceById(
    serviceSubscriptionRec.get('service').id
  );
  const society = await getSocietyById(
    serviceSubscriptionRec.get('society').id
  );
  const partnerAdmins = await getPartnerAdmin(
    serviceSubscriptionRec.get('partner').id
  );

  const title = getNotificationTitle(
    'SERVICE_SUBSCRIPTION_VISIT_SCHEDULED_NEXTDAY'
  );
  const body = getNotificationBody(
    'SERVICE_SUBSCRIPTION_VISIT_SCHEDULED_NEXTDAY',
    {
      service: service.get('name'),
      society: society.get('name'),
    }
  );

  [...societyAdmins, ...societyManagers].forEach((user) => {
    SendPushNotification(user, title, body, {
      screenPath: 'SOCIETY.SERVICES.SERVICE_SUBSCRIPTION_VIEW',
      params: {
        serviceSubscriptionId: serviceSubscriptionRec.id,
      },
    });
    SaveUserNotification(
      user,
      NOTIFICATION_CATEGORY.serviceVisit,
      title,
      body,
      {
        screenPath: 'SOCIETY.SERVICES.SERVICE_SUBSCRIPTION_VIEW',
        params: {
          serviceSubscriptionId: serviceSubscriptionRec.id,
        },
      }
    );
  });
  [...societyKAMs].forEach((user) => {
    SendPushNotification(user, title, body, {
      screenPath: 'INSPACCO.SOCIETY.SERVICE_SUBSCRIPTION_VIEW',
      params: {
        serviceSubscriptionId: serviceSubscriptionRec.id,
      },
    });
    SaveUserNotification(
      user,
      NOTIFICATION_CATEGORY.serviceVisit,
      title,
      body,
      {
        screenPath: 'INSPACCO.SOCIETY.SERVICE_SUBSCRIPTION_VIEW',
        params: {
          serviceSubscriptionId: serviceSubscriptionRec.id,
        },
      }
    );
  });
  [...partnerAdmins].forEach((user) => {
    const data = {
      screenPath: 'PARTNER.HOME.SERVICE_SUBSCRIPTION_VIEW',
      params: {
        societyId: serviceSubscriptionRec.get('society').id,
      },
    };  
    sendFirebaseNotification(user, title, body, data);
    SendPushNotification(user, title, body, {
      screenPath: 'PARTNER.HOME.SERVICE_SUBSCRIPTION_VIEW',
      params: {
        societyId: serviceSubscriptionRec.get('society').id,
      },
    });
    SaveUserNotification(
      user,
      NOTIFICATION_CATEGORY.serviceVisit,
      title,
      body,
      {
        screenPath: 'PARTNER.HOME.SERVICE_SUBSCRIPTION_VIEW',
        params: {
          societyId: serviceSubscriptionRec.get('society').id,
        },
      }
    );
  });
}
export async function sendServiceVisitNotificationToSocietyAdmin(
  serviceVisitRec: Parse.Object,
  serviceSubscriptionRec: Parse.Object
) {
  const societyAdmins = await getSocietyAdmin(
    serviceSubscriptionRec.get('society').id
  );
  const societyManagers = await getSocietyManager(
    serviceSubscriptionRec.get('society').id
  );
  const service = await getServiceById(
    serviceSubscriptionRec.get('service').id
  );
  const society = await getSocietyById(
    serviceSubscriptionRec.get('society').id
  );

  const title = getNotificationTitle(
    'SERVICE_SUBSCRIPTION_VISIT_SCHEDULED__SOCIETY'
  );
  const body = getNotificationBody(
    'SERVICE_SUBSCRIPTION_VISIT_SCHEDULED__SOCIETY',
    {
      service: service.get('name'),
      date: moment(serviceVisitRec.get('date'))
        .utcOffset('+0530')
        .format('ddd, D MMM YYYY'),
    }
  );
  const data = {
    screenPath: 'SOCIETY.SERVICES.SERVICE_SUBSCRIPTION_VIEW',
    params: {
      serviceSubscriptionId: serviceSubscriptionRec.id,
    },
  };
  [...societyAdmins, ...societyManagers].forEach((user) => {
    SendPushNotification(user, title, body, data);
    SaveUserNotification(
      user,
      NOTIFICATION_CATEGORY.serviceVisit,
      title,
      body,
      data
    );
  });
}

export async function sendServiceVisitNotificationToSocietyKAM(
  serviceVisitRec: Parse.Object,
  serviceSubscriptionRec: Parse.Object
) {
  const societyKAMs = await getSocietyKAMs(
    serviceSubscriptionRec.get('society').id
  );
  const service = await getServiceById(
    serviceSubscriptionRec.get('service').id
  );
  const society = await getSocietyById(
    serviceSubscriptionRec.get('society').id
  );
  const title = getNotificationTitle(
    'SERVICE_SUBSCRIPTION_VISIT_SCHEDULED__KAM'
  );
  const body = getNotificationBody(
    'SERVICE_SUBSCRIPTION_VISIT_SCHEDULED__KAM',
    {
      service: service.get('name'),
      society: society.get('name'),
      date: moment(serviceVisitRec.get('date'))
        .utcOffset('+0530')
        .format('ddd, D MMM YYYY'),
    }
  );
  const data = {
    screenPath: 'INSPACCO.SOCIETY.SERVICE_SUBSCRIPTION_VIEW',
    params: {
      serviceSubscriptionId: serviceSubscriptionRec.id,
    },
  };
  [...societyKAMs].forEach((user) => {
    SendPushNotification(user, title, body, data);
    SaveUserNotification(
      user,
      NOTIFICATION_CATEGORY.serviceVisit,
      title,
      body,
      data
    );
  });
}
export async function sendServiceVisitNotificationToPartnerAdmin(
  serviceVisitRec: Parse.Object,
  serviceSubscriptionRec: Parse.Object
) {
  const partnerAdmins = await getPartnerAdmin(
    serviceSubscriptionRec.get('partner').id
  );
  const service = await getServiceById(
    serviceSubscriptionRec.get('service').id
  );
  const society = await getSocietyById(
    serviceSubscriptionRec.get('society').id
  );

  const title = getNotificationTitle(
    'SERVICE_SUBSCRIPTION_VISIT_SCHEDULED__PARTNER'
  );
  const body = getNotificationBody(
    'SERVICE_SUBSCRIPTION_VISIT_SCHEDULED__PARTNER',
    {
      service: service.get('name'),
      society: society.get('name'),
      date: moment(serviceVisitRec.get('date'))
        .utcOffset('+0530')
        .format('ddd, D MMM YYYY'),
    }
  );

  const data = {
    screenPath: 'PARTNER.HOME.SERVICE_SUBSCRIPTION_VIEW',
    params: {
      societyId: society.id,
    },
  };

  [...partnerAdmins].forEach((user) => {
    sendFirebaseNotification(user, title, body, data);
    SendPushNotification(user, title, body, data);
    SaveUserNotification(
      user,
      NOTIFICATION_CATEGORY.serviceVisit,
      title,
      body,
      data
    );
  });
}

async function handleServiceSubscriptionVisits() {
  // Before 7 day
  const q = new Parse.Query(COLLECTIONS.SERVICE_SUBSCRIPTION_SCHEDULE);
  q.equalTo('status', SERVICE_SUBSCRIPTION_VISITS.UPCOMING);
  const futureDate = moment().add(7, 'days').endOf('day').toDate();
  q.greaterThan('date', moment().endOf('day').toDate());
  q.lessThanOrEqualTo('date', futureDate);
  const visitRecords = await q.findAll({ useMasterKey: true });
  visitRecords.forEach(async (rec) => {
    rec.set('status', SERVICE_SUBSCRIPTION_VISITS.SCHEDULED);
    await rec.save(null, { useMasterKey: true });

    const serviceSubscription = await getServiceSubscription(
      rec.get('serviceSubscription').id
    );
    await sendServiceVisitNotificationToSocietyAdmin(rec, serviceSubscription);
    await sendServiceVisitNotificationToSocietyKAM(rec, serviceSubscription);
    await sendServiceVisitNotificationToPartnerAdmin(rec, serviceSubscription);
  });

  // Next Day
  const nextDayVisitQuery = new Parse.Query(
    COLLECTIONS.SERVICE_SUBSCRIPTION_SCHEDULE
  );
  nextDayVisitQuery.equalTo('status', SERVICE_SUBSCRIPTION_VISITS.SCHEDULED);
  const tomorrow = moment().add(1, 'day').endOf('day').toDate();
  nextDayVisitQuery.greaterThan('date', moment().endOf('day').toDate());
  nextDayVisitQuery.lessThanOrEqualTo('date', tomorrow);
  const tomorrowVisitRecords = await nextDayVisitQuery.findAll({
    useMasterKey: true,
  });
  tomorrowVisitRecords.forEach(async (rec) => {
    const serviceSubscription = await getServiceSubscription(
      rec.get('serviceSubscription').id
    );
    await sendNextDayServiceVisitNotification(rec, serviceSubscription);
  });
}

async function handleServiceRequestVisits(req: Parse.Cloud.FunctionRequest) {
  const q = new Parse.Query(COLLECTIONS.PARTNER_SERVICE_REQUEST);
  q.containedIn('status', ['OPEN', 'IN_PROGRESS']);
  const tomorrow = moment().add(1, 'days').endOf('day').toDate();
  q.greaterThan('visitDate', moment().startOf('day').toDate());
  q.lessThanOrEqualTo('visitDate', tomorrow);
  const pRequests = await q.findAll({ useMasterKey: true });

  pRequests.forEach(async (pRequest) => {
    const sRequest = await getServiceRequestById(
      pRequest.get('serviceRequest').id
    );
    const visitRequirementFromServiceReq = sRequest.get('visitRequirement');
    const requester = await getUserById(sRequest.get('requester').id);
    pRequest.set('visitRequirement', {
      ...pRequest.get('visitRequirement'),
      societyName: visitRequirementFromServiceReq.societyName,
      societyAddress: visitRequirementFromServiceReq.societyAddress,
      contactNumber: requester.get('mobileNumber'),
    });
    await pRequest.save(null, { useMasterKey: true });

    const service = await getServiceById(pRequest.get('service').id);
    const society = visitRequirementFromServiceReq.societyName;
    const partner = await getPartnerById(pRequest.get('partner').id);
    const partnerAdmins = await getPartnerAdmin(partner.id);

    // Partner admin
    const title = getNotificationTitle(
      'SERVICE_REQUEST_VISIT_SCHEDULED__PARTNER'
    );
    const body = getNotificationBody(
      'SERVICE_REQUEST_VISIT_SCHEDULED__PARTNER',
      {
        service: service.get('name'),
        day: moment(pRequest.get('visitDate')).isSame(moment(), 'day')
          ? 'today'
          : 'tomorrow',
      }
    );
    const data = {
      screenPath: 'PARTNER.HOME.SERVICE_REQUEST_VIEW',
      params: {
        partnerServiceRequestId: pRequest.id,
      },
    };
    [...partnerAdmins].forEach((user) => {
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

    // Requester
    const requesterTitle = getNotificationTitle(
      'SERVICE_REQUEST_VISIT_SCHEDULED__REQUESTER'
    );
    const requesterBody = getNotificationBody(
      'SERVICE_REQUEST_VISIT_SCHEDULED__REQUESTER',
      {
        service: service.get('name'),
        day: moment(pRequest.get('visitDate')).isSame(moment(), 'day')
          ? 'today'
          : 'tomorrow',
      }
    );
    const requesterData = {
      screenPath: isEmpty(sRequest.get('society'))
        ? 'GUEST.SERVICE_REQUEST.SERVICE_REQUEST_VIEW'
        : 'SOCIETY.HOME.SERVICE_REQUEST_VIEW',
      params: {
        serviceRequestId: sRequest.id,
      },
    };
    [requester].forEach((user) => {
      SendPushNotification(user, requesterTitle, requesterBody, requesterData);
      SaveUserNotification(
        user,
        NOTIFICATION_CATEGORY.serviceRequest,
        requesterTitle,
        requesterBody,
        requesterData
      );
    });

    // Inspacco Admin
    const adminTitle = getNotificationTitle(
      'SERVICE_REQUEST_VISIT_SCHEDULED__INSAPCCO_ADMIN'
    );
    const adminBody = getNotificationBody(
      'SERVICE_REQUEST_VISIT_SCHEDULED__INSAPCCO_ADMIN',
      {
        service: service.get('name'),
        society,
        partner: partner.get('name'),
        day: moment(pRequest.get('visitDate')).isSame(moment(), 'day')
          ? 'today'
          : 'tomorrow',
      }
    );
    const adminData = {
      screenPath: 'INSPACCO.SERVICE_REQUEST.PARTNER_SERVICE_REQUEST_VIEW',
      params: {
        partnerServiceReqId: pRequest.id,
      },
    };
    sendNotificationToInsapccoAdmin(
      req,
      adminTitle,
      adminBody,
      NOTIFICATION_CATEGORY.serviceRequest,
      adminData
    );
  });
}

async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (!req.master) {
    throw new Parse.Error(Parse.Error.INVALID_ACL, 'Permission denied');
  }

  console.log(
    `###################### VISIT SCHEDULER: ${moment
      .utc()
      .utcOffset('+0530')
      .format('lll')} ######################`
  );

  handleServiceSubscriptionVisits();
  handleServiceRequestVisits(req);

  return {
    now: moment().toLocaleString(),
  };
}

export const visitScheduler = {
  execute,
};
