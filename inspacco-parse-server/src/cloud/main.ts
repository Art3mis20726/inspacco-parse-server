import * as Parse from 'parse/node';
import { COLLECTIONS } from '../constants/common';
import { markAttendance } from './functions/attendance/mark-attendance';
import { createUser } from './functions/auth/create-user';
import { generateOtp } from './functions/auth/generate-otp';
import { afterSaveAttachmentHandler, beforeSaveAttachmentHandler, afterDeleteAttachmentHandler } from './triggers/attachment';
import {
  afterDeletePartnerHandler,
  afterSavePartnerHandler,
  beforeSavePartnerHandler,
} from './triggers/partner';
import {
  afterSavePartnerMemberHandler,
  beforeSavePartnerMemberHandler,
  afterDeletePartnerMemberHandler,
} from './triggers/partnerMember';
import {
  afterSaveServiceSubscriptionHandler,
  beforeSaveServiceSubscriptionHandler,

} from './triggers/serviceSubscription';
import {
  afterDeleteSocietyHandler,
  afterSaveSocietyHandler,
  beforeSaveSocietyHandler,
} from './triggers/society';
import {
  afterDeleteSocietyMemberHandler,
  afterSaveSocietyMemberHandler,
  beforeSaveSocietyMemberHandler,
} from './triggers/societyMember';
import { beforeSaveUserHandler } from './triggers/user';
import { createTask } from './functions/task/createTask';
import { removeTask } from './functions/task/removeTask';
import {
  afterSaveIncidentHandler,
  beforeDeleteIncidentHandler,
  beforeSaveIncidentHandler,
} from './triggers/incident';
import { beforeSaveAttendanceHandler } from './triggers/attendance';
import { afterDeletePartnerStaffHandler, beforeSavePartnerStaffHandler } from './triggers/partnerStaff';
import { sendNotification } from './functions/notification/send-notification';
import { getConfig } from './functions/config/getConfig';
import {
  afterSaveTakActivity,
  beforeSaveTaskActivityHandler,
} from './triggers/taskActivity';
import { afterSaveReward, beforeSaveReward } from './triggers/reward';

import { registerPushNotification } from './functions/notification/register-device-for-push-notification';
import { beforeSaveNotificationHandler } from './triggers/notification';
import {
  afterSaveIncidentCommentHandler,
  beforeDeleteIncidentCommentHandler,
  beforeSaveIncidentCommentHandler,
} from './triggers/incidentComment';
import { generateQuotationPdf } from './functions/quotation/generateQuotationPdf';
import { generateComplaintReport } from './functions/report/generateComplaintReport';
import { generateDailyReport } from './functions/report/generateDailyReport';
import { generateAttendanceReport } from './functions/report/generateAttendanceReport';
import { generateTaskReport } from './functions/report/generateTaskReport';
import { updateServiceRecord } from './functions/service/update-service-record';
import { beforeSaveServiceHandler } from './triggers/service';
import {
  beforeDeleteServiceRequestCommentHandler,
  beforeSaveServiceRequestCommentHandler,
} from './triggers/serviceRequestComment';
import {
  afterSaveServiceRequestHandler,
  beforeSaveServiceRequestHandler,
} from './triggers/serviceRequest';
import {
  afterSaveServiceQuotationHandler,
  beforeSaveServiceQuotationHandler,
} from './triggers/serviceQuotation';
import {
  afterSavePartnerServiceRequestHandler,
  beforeSavePartnerServiceRequestHandler,
} from './triggers/partnerServiceRequest';
import {
  afterSavePartnerServiceQuotationHandler,
  beforeSavePartnerServiceQuotationHandler,
} from './triggers/partnerServiceQuotation';
import { visitScheduler } from './functions/visit-scheduler/visit-scheduler';
import {
  afterSaveServiceSubscriptionSchedule,
  beforeSaveServiceSubscriptionSchedule,
} from './triggers/serviceSubscriptionSchedule';
import { getUserTotalRewardPoints } from './functions/reward/getUserTotalRewardPoints';

import {
  afterSaveRewardRedeemRequest,
  beforeSaveRewardRedeemRequest,
} from './triggers/rewardRedeemRequest';
import { afterSaveTaskHandler, beforeDeleteTaskHandler, beforeSaveTaskHandler } from './triggers/task';
import { copyTaskToTaskActivity } from './functions/task/copyTaskToActivity';
import { copyTask } from './functions/task/copyTask';
import { getTask } from './functions/analytics/getTasks';
import { getServiceRequest } from './functions/analytics/getServiceRequest';
import { getActiveUser } from './functions/analytics/getActiveUsers';
import { getAppOpen } from './functions/analytics/getAppOpenCount';
import { getComplaintsResponse } from './functions/analytics/getComplaints';
import {
  afterSaveScheduleVisitCommentHandler,
 //beforeDeleteIncidentCommentHandler,
  beforeSaveScheduleVisitCommentHandler,
} from './triggers/scheduleVisitComment';
import { getUserDetails } from './functions/discovery/getUsers';
import { hanldeUploadBookingsCloud } from '../controllers/bookings';
import { getPartnerLevelTask } from './functions/analytics/getPartnerLevelTasks';
import {  getPartnerLevelAttendaces } from './functions/analytics/getPartnerLevelAttendance';
import { generateScheduleDemo } from './functions/ScheduleDemo/generateScheduleDemo';
import { getPartnerLevelIncident } from './functions/analytics/GetPartnerLevelincidents';
import { beforeSaveClientRegistrationRequestHandler } from './triggers/clientRegistrationRequest';
import { beforeSaveServiceStaffHandler } from './triggers/serviceStaff';
import { getSocietyAttendanceStats } from './functions/analytics/getSocietyAttendancePercent';
import { getSocietyServiceRequestMonthlyCount } from './functions/analytics/getSocietyServiceRequestMonthlyCount';
import { beforeSaveSocietyStaffHandler } from './triggers/societyStaff';
import { identifyface } from './functions/attendance/identifyFace';
import { beforeSaveClientVendorCatalogMappingHandler } from './triggers/clientvendorcatalogmapping';
import { beforeSaveUserSettingHandler } from './triggers/usersetting';
import { beforeSaveOrderRequestHandler } from './triggers/orderrequests';

// Functions
Parse.Cloud.define(
  'generateOtp',
  generateOtp.execute,
  generateOtp.parseValidate
);

Parse.Cloud.define('createUser', createUser.execute, createUser.validate);
Parse.Cloud.define(
  'markAttendance',
  markAttendance.execute,
  markAttendance.validate
);
Parse.Cloud.define(
  'identifyFace',
  identifyface.execute
);
Parse.Cloud.define('attendanceStats',getSocietyAttendanceStats.execute);
Parse.Cloud.define('serviceRequestMonthWiseCount',getSocietyServiceRequestMonthlyCount.execute);
Parse.Cloud.define(
  'sendNotification',
  sendNotification.execute,
  sendNotification.validate
);
Parse.Cloud.define(
  'generateScheduleDemo', 
  generateScheduleDemo.execute
  );

Parse.Cloud.define('createTask', createTask.execute);
Parse.Cloud.define('removeTask', removeTask.execute, removeTask.validate);
Parse.Cloud.define('getConfig', getConfig.execute, getConfig.validate);

Parse.Cloud.define(
  'registerPushNotification',
  registerPushNotification.execute,
  registerPushNotification.validate
);

Parse.Cloud.define('updateServiceKey', updateServiceRecord.execute);
Parse.Cloud.define('visitScheduler', visitScheduler.execute);
Parse.Cloud.define('GenerateQuotationPdf', generateQuotationPdf.execute);
Parse.Cloud.define('GenerateComplaintReport', generateComplaintReport.execute);
Parse.Cloud.define('GenerateAttendanceReport', generateAttendanceReport.execute);
Parse.Cloud.define('GenerateTaskReport', generateTaskReport.execute);
Parse.Cloud.define(
  'getUserTotalRewardPoints',
  getUserTotalRewardPoints.execute
);
Parse.Cloud.define('CopyTaskToTaskActivity', copyTaskToTaskActivity.execute);
Parse.Cloud.define('GenerateDailyReport', generateDailyReport.execute);

Parse.Cloud.define(
  'copyTaskToTaskActivity',
  copyTask.execute,
  copyTask.validate
);


Parse.Cloud.define(
  'uploadBookings',
  hanldeUploadBookingsCloud
);


Parse.Cloud.define('GetTasks', getTask.execute);
Parse.Cloud.define('GetPartnerLevelTasks', getPartnerLevelTask.execute);
Parse.Cloud.define('GetPartnerLevelincidents', getPartnerLevelIncident.execute);
Parse.Cloud.define('GetPartnerLevelAttendance', getPartnerLevelAttendaces.execute);
Parse.Cloud.define('GetServiceRequest',getServiceRequest.execute);
Parse.Cloud.define('GetActiveUsers',getActiveUser.execute);
Parse.Cloud.define('GetAppOpenCount',getAppOpen.execute);
Parse.Cloud.define('GetComplaints', getComplaintsResponse.execute);

// Triggers
Parse.Cloud.beforeSave(COLLECTIONS.SOCIETY, beforeSaveSocietyHandler);
Parse.Cloud.afterSave(COLLECTIONS.SOCIETY, afterSaveSocietyHandler);
Parse.Cloud.afterDelete(COLLECTIONS.SOCIETY,afterDeleteSocietyHandler);

Parse.Cloud.beforeSave(COLLECTIONS.PARTNER, beforeSavePartnerHandler);
Parse.Cloud.afterSave(COLLECTIONS.PARTNER, afterSavePartnerHandler);
Parse.Cloud.afterDelete(COLLECTIONS.PARTNER,afterDeletePartnerHandler);

Parse.Cloud.afterSave(COLLECTIONS.TASK_ACTIVITY, afterSaveTakActivity);
Parse.Cloud.beforeSave(
  COLLECTIONS.TASK_ACTIVITY,
  beforeSaveTaskActivityHandler
);

Parse.Cloud.beforeSave(COLLECTIONS.REWARD, beforeSaveReward);
Parse.Cloud.afterSave(COLLECTIONS.REWARD, afterSaveReward);

Parse.Cloud.beforeSave(
  COLLECTIONS.REWARD_REDEEM_REQUEST,
  beforeSaveRewardRedeemRequest
);
Parse.Cloud.afterSave(
  COLLECTIONS.REWARD_REDEEM_REQUEST,
  afterSaveRewardRedeemRequest
);

Parse.Cloud.beforeSave(
  COLLECTIONS.SOCIETY_MEMBER,
  beforeSaveSocietyMemberHandler
);
Parse.Cloud.afterSave(
  COLLECTIONS.SOCIETY_MEMBER,
  afterSaveSocietyMemberHandler
);
Parse.Cloud.afterDelete(
  COLLECTIONS.SOCIETY_MEMBER,
  afterDeleteSocietyMemberHandler
);

Parse.Cloud.beforeSave(
  COLLECTIONS.PARTNER_MEMBER,
  beforeSavePartnerMemberHandler
);
Parse.Cloud.afterSave(
  COLLECTIONS.PARTNER_MEMBER,
  afterSavePartnerMemberHandler
);
Parse.Cloud.beforeSave(
  COLLECTIONS.SERVICE_STAFF,
  beforeSaveServiceStaffHandler
);

Parse.Cloud.afterDelete(
  COLLECTIONS.PARTNER_MEMBER,
  afterDeletePartnerMemberHandler
);

Parse.Cloud.beforeSave(
  COLLECTIONS.SERVICE_SUBSCRIPTION,
  beforeSaveServiceSubscriptionHandler
);

Parse.Cloud.afterSave(
  COLLECTIONS.SERVICE_SUBSCRIPTION,
  afterSaveServiceSubscriptionHandler
);

Parse.Cloud.beforeSave(Parse.User, beforeSaveUserHandler);

Parse.Cloud.beforeSave(COLLECTIONS.ATTACHMENT, beforeSaveAttachmentHandler);
Parse.Cloud.afterSave(COLLECTIONS.ATTACHMENT, afterSaveAttachmentHandler);
Parse.Cloud.afterDelete(COLLECTIONS.ATTACHMENT, afterDeleteAttachmentHandler);

Parse.Cloud.beforeSave(
  COLLECTIONS.SERVICE_REQUEST_COMMENT,
  beforeSaveServiceRequestCommentHandler
);
Parse.Cloud.beforeDelete(
  COLLECTIONS.SERVICE_REQUEST_COMMENT,
  beforeDeleteServiceRequestCommentHandler
);

Parse.Cloud.beforeSave(
  COLLECTIONS.SERVICE_REQUEST,
  beforeSaveServiceRequestHandler
);
Parse.Cloud.afterSave(
  COLLECTIONS.SERVICE_REQUEST,
  afterSaveServiceRequestHandler
);

Parse.Cloud.beforeSave(
  COLLECTIONS.SERVICE_QUOTATION,
  beforeSaveServiceQuotationHandler
);
Parse.Cloud.afterSave(
  COLLECTIONS.SERVICE_QUOTATION,
  afterSaveServiceQuotationHandler
);

Parse.Cloud.beforeSave(
  COLLECTIONS.PARTNER_SERVICE_REQUEST,
  beforeSavePartnerServiceRequestHandler
);
Parse.Cloud.afterSave(
  COLLECTIONS.PARTNER_SERVICE_REQUEST,
  afterSavePartnerServiceRequestHandler
);

Parse.Cloud.beforeSave(
  COLLECTIONS.PARTNER_SERVICE_QUOTATION,
  beforeSavePartnerServiceQuotationHandler
);
Parse.Cloud.afterSave(
  COLLECTIONS.PARTNER_SERVICE_QUOTATION,
  afterSavePartnerServiceQuotationHandler
);

//shan change

Parse.Cloud.beforeSave(
  COLLECTIONS.PARTNER_SERVICE_QUOTATION_DOCUMENT,
  beforeSaveAttachmentHandler
);
Parse.Cloud.afterSave(
  COLLECTIONS.PARTNER_SERVICE_QUOTATION_DOCUMENT,
  afterSaveAttachmentHandler
);

Parse.Cloud.beforeSave(
  COLLECTIONS.SERVICE_QUOTATION_DOCUMENT,
  beforeSaveAttachmentHandler
);
Parse.Cloud.afterSave(
  COLLECTIONS.SERVICE_QUOTATION_DOCUMENT,
  afterSaveAttachmentHandler
);
////////
Parse.Cloud.beforeSave(
  COLLECTIONS.SCHEDULE_VISIT_COMMENT,
  beforeSaveScheduleVisitCommentHandler
);
// Parse.Cloud.beforeDelete(
//   COLLECTIONS.SCHEDULE_VISIT_COMMENT,
//   beforeDeleteIncidentCommentHandler
// );
Parse.Cloud.afterSave(
  COLLECTIONS.SCHEDULE_VISIT_COMMENT,
  afterSaveScheduleVisitCommentHandler
);

//Incident
Parse.Cloud.beforeSave(COLLECTIONS.INCIDENT, beforeSaveIncidentHandler);
Parse.Cloud.afterSave(COLLECTIONS.INCIDENT, afterSaveIncidentHandler);
Parse.Cloud.beforeDelete(COLLECTIONS.INCIDENT, beforeDeleteIncidentHandler);

Parse.Cloud.beforeSave(COLLECTIONS.ATTENDANCE, beforeSaveAttendanceHandler);
Parse.Cloud.beforeSave(
  COLLECTIONS.PARTNER_STAFF,
  beforeSavePartnerStaffHandler
);
Parse.Cloud.beforeSave(
  COLLECTIONS.SOCIETY_STAFF,
  beforeSaveSocietyStaffHandler
);

Parse.Cloud.afterDelete(COLLECTIONS.PARTNER_STAFF,afterDeletePartnerStaffHandler);
//Notification
Parse.Cloud.beforeSave(COLLECTIONS.NOTIFICATION, beforeSaveNotificationHandler);

Parse.Cloud.beforeSave(
  COLLECTIONS.INCIDENT_COMMENT,
  beforeSaveIncidentCommentHandler
);
Parse.Cloud.beforeDelete(
  COLLECTIONS.INCIDENT_COMMENT,
  beforeDeleteIncidentCommentHandler
);
Parse.Cloud.afterSave(
  COLLECTIONS.INCIDENT_COMMENT,
  afterSaveIncidentCommentHandler
);

//Service
Parse.Cloud.beforeSave(COLLECTIONS.SERVICE, beforeSaveServiceHandler);

Parse.Cloud.beforeSave(
  COLLECTIONS.SERVICE_SUBSCRIPTION_SCHEDULE,
  beforeSaveServiceSubscriptionSchedule
);
Parse.Cloud.afterSave(
  COLLECTIONS.SERVICE_SUBSCRIPTION_SCHEDULE,
  afterSaveServiceSubscriptionSchedule
);

//Task
Parse.Cloud.beforeSave(COLLECTIONS.TASK, beforeSaveTaskHandler);
Parse.Cloud.afterSave(COLLECTIONS.TASK, afterSaveTaskHandler);
Parse.Cloud.beforeDelete(COLLECTIONS.TASK,beforeDeleteTaskHandler);
Parse.Cloud.beforeSave(
  COLLECTIONS.ClientRegistrationRequest,
  beforeSaveClientRegistrationRequestHandler
);

//Client Vendor Catalo

Parse.Cloud.beforeSave(COLLECTIONS.CLIENT_VENDOR_CATALOG_MAPPING, beforeSaveClientVendorCatalogMappingHandler);
Parse.Cloud.beforeSave(COLLECTIONS.USER_SETTING, beforeSaveUserSettingHandler);
Parse.Cloud.beforeSave(COLLECTIONS.ORDER_REQUEST, beforeSaveOrderRequestHandler);
//Check existing user in discovery app

Parse.Cloud.define('getUserDetails', getUserDetails.execute);