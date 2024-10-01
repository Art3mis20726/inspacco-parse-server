
export enum COLLECTIONS {
  SOCIETY = 'Society',
  PARTNER = 'Partner',
  SOCIETY_MEMBER = 'SocietyMember',
  PARTNER_MEMBER = 'PartnerMember',
  SERVICE_SUBSCRIPTION = 'ServiceSubscription',
  ATTACHMENT = 'Attachment',
  TASK = 'Task',
  INCIDENT = 'Incident',
  DISPLAY_ID_COUNTER = 'DisplayIdCounter',
  ATTENDANCE = 'Attendance',
  PARTNER_STAFF = 'PartnerStaff',

  TASK_ACTIVITY = 'TaskActivity',
  REWARD = 'Reward',

  NOTIFICATION = 'Notification',
  SERVICE = 'Service',
  INCIDENT_COMMENT = 'IncidentComment',
  SERVICE_REQUEST_COMMENT = 'ServiceRequestComment',
  SERVICE_REQUEST = 'ServiceRequest',
  SERVICE_QUOTATION = 'ServiceQuotation',
  PARTNER_SERVICE_REQUEST = 'PartnerServiceRequest',
  PARTNER_SERVICE_QUOTATION = 'PartnerServiceQuotation',
  SERVICE_SUBSCRIPTION_SCHEDULE = 'ServiceSubscriptionSchedule',
  REWARD_REDEEM_REQUEST = 'RewardRedeemRequest',
  SERVICE_STAFF = 'ServiceStaff',
  PARTNER_SERVICE_QUOTATION_DOCUMENT = "PARTNER_SERVICE_QUOTATION_DOCUMENT",
  SERVICE_QUOTATION_DOCUMENT = "SERVICE_QUOTATION_DOCUMENT",
  SCHEDULE_VISIT_COMMENT = "ScheduleVisitComment",
  EXPO_PUSH_TOKEN = 'ExpoPushToken',
  Permission = 'Permission',
  PartnerMemberSociety = 'PartnerMemberSociety',
  SCHEDULE_DEMO = 'ScheduleDemo',

  Shift = 'Shift',
  ClientRegistrationRequest = 'ClientRegistrationRequest',
  SOCIETY_STAFF = 'SocietyStaff',

  USER_SETTING = 'UserSetting',

  CLIENT_VENDOR_CATALOG_MAPPING = 'ClientVendorCatalogMapping',

  ORDER_REQUEST = 'OrderRequest',
  APPROVAL = 'Approval',
  ORDER_VENDOR_MAPPING = 'OrderVendorMapping',
  CLIENT_FACILITY = 'ClientFacility',
}

export enum ROLES {
  ROOT = 'ROOT',
  INSPACCO_ADMIN = 'INSPACCO_ADMIN',
  INSPACCO_KAM = 'INSPACCO_KAM',
  INSPACCO_CDA = 'INSPACCO_CDA',
  SOCIETY_ADMIN = 'SOCIETY_ADMIN',
  SOCIETY_MANAGER = 'SOCIETY_MANAGER',
  PARTNER_ADMIN = 'PARTNER_ADMIN',
  PARTNER_STAFF = 'PARTNER_STAFF',
  PARTNER_KAM = 'PARTNER_KAM'
}

export const DEVELOPER_LOGINS = [
  '0000000000', //FRESH_USER
  '9999999999', //INSPACCO_CDA
  '1111111111', //INSPACCO_ADMIN
  '2222222222', //INSPACCO_KAM
  '3333333333', //SOCIETY_ADMIN
  '4444444444', //SOCIETY_MANAGER
  '5555555555', //PARTNER_ADMIN,
  '1234567890', // ROOT
  '1234565432', // Partner Admin
  '7777777799', // PARTNER_ADMIN
  '1212121212', // SOCIETY MEMBER DISCOVERY
  '1313131313', // Demo SocietyMember 2
  '2323232323', // Demo Vendor 1
  '2424242424', // Demo Vendor 1
  '5500000077',
  '5500000078',
  '5500000079',
  '5500000080',
  '5500000081',
  '5500000082',
  '5500000083',
  '5500000084',
  '5500000085',
  '5500000086',
  '5500000087',
  '5500000088',
  '5500000089',
  '5500000090',
  '5500000091',
  '5500000092',
  '5500000093',
  '5500000094',
  '5500000095',
  '5500000096',
];

export enum CONFIG {
  MAX_PREV_DAYS_ATTENDANCE_ALLOWED = 'MAX_PREV_DAYS_ATTENDANCE_ALLOWED',
  devUsers = 'devUsers',
}

export enum TASK_ACTIVITY_STATUS {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum REWARD_REDEEM_STATUS {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',

  REJECTED = 'REJECTED',
}

export enum NOTIFICATION_CATEGORY {
  complaint = 'COMPLAINT',
  task = 'TASK',
  attendance = 'ATTENDANCE',
  onBoarding = 'ONBOARDING',
  guest = 'GUEST',
  other = 'OTHER',
  serviceRequest = 'SERVICE_REQUEST',
  PartnerServiceRequest = 'PARTNER_SERVICE_REQUEST',
  partnerServiceQuotation = 'PARTNER_SERVICE_QUOTATION',
  serviceQuotation = 'SERVICE_QUOTATION',
  serviceVisit = 'SERVICE_VISIT',

  rewardRedeemRequest = 'REWARD_REDEEM_REQUEST',
}

export const TIMEZONE = 'Asia/Kolkata';

export const SERVICE_REQUEST_SUBSTATUS_MAP = {
  'TO_BE_WORKED_UPON': { label: 'To Be Worked Upon', color: 'yellow-500', serviceStatus: 'Open', completionStatus: [] },
  'SITE_ADDRESS_NOT_AVAILABLE': { label: 'Site Address Not Available', color: 'red-500', serviceStatus: 'Open', completionStatus: [] },
  'ORDERED_SERVICE_NOT_IN_SCOPE': { label: 'Ordered Service Not In Scope', color: 'blue-500', serviceStatus: 'Closed', completionStatus: [] },
  'REPEATED_ORDER': { label: 'Repeated Order', color: 'yellow-500', serviceStatus: 'Closed', completionStatus: [] },
  'SITE_POC_NOT_RESPONDING': { label: 'Site POC Not Responding', color: 'purple-500', serviceStatus: 'Open', completionStatus: [] },
  'WORK_ALREADY_CLOSED': { label: 'Work Already Closed', color: 'blue-500', serviceStatus: 'Closed', completionStatus: [] },
  'VISIT_SCHEDULED': { label: 'Visit Scheduled', color: 'green-500', serviceStatus: 'Open', completionStatus: [] },
  'VISIT_RESCHEDULED': { label: 'Visit Rescheduled', color: 'yellow-500', serviceStatus: 'Open', completionStatus: [] },
  'VISIT_DONE_CLIENT_ASKED_TO_WAIT': { label: 'Visit Done, Client Asked To Wait', color: 'cyan-500', serviceStatus: 'Open', completionStatus: ['Visit Completed'] },
  'VISIT_DONE_QUOTATION_PENDING': { label: 'Visit Done, Quotation Pending', color: 'lime-500', serviceStatus: 'Open', completionStatus: ['Visit Completed'] },
  'QUOTATION_APPROVAL_PENDING': { label: 'Quotation Approval Pending', color: 'yellow-200', serviceStatus: 'In Progress', completionStatus: ['Visit Completed', 'Quotation Shared'] },
  'REVISED_QUOTATION_PENDING': { label: 'Revised Quotation Pending', color: 'yellow-200', serviceStatus: 'In Progress', completionStatus: ['Visit Completed', 'Quotation Shared'] },
  'QUOTATION_APPROVED': { label: 'Quotation Approved', color: 'teal-500', serviceStatus: 'In Progress', completionStatus: ['Visit Completed', 'Quotation Shared', 'Quotation Approved'] },
  'ORDER_ON_HOLD': { label: 'Order On Hold', color: 'yellow-500', serviceStatus: 'In Progress', completionStatus: [] },
  'ORDER_LOST': { label: 'Order Lost', color: 'red-200', serviceStatus: 'Closed', completionStatus: [] },
  'WORK_DONE_INVOICE_PENDING': { label: 'Work Done, Invoice Pending', color: 'purple-500', serviceStatus: 'Completed', completionStatus: ['Visit Completed', 'Quotation Shared', 'Quotation Approved', 'Work Completed'] },
  'INVOICE_ATTACHED_PAYMENT_PENDING': { label: 'Invoice Attached, Payment Pending', color: 'pink-500', serviceStatus: 'Completed', completionStatus: ['Visit Completed', 'Quotation Shared', 'Quotation Approved', 'Work Completed'] },
  'PAYMENT_RECEIVED': { label: 'Payment Received', color: 'green-500', serviceStatus: 'Completed', completionStatus: ['Visit Completed', 'Quotation Shared', 'Quotation Approved', 'Work Completed'] }
};