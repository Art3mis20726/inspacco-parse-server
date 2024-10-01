type NotificationMessage = {
  [key: string]: {
    title: string;
    body: string;
  };
};
export const NOTIFICATION_MSG: NotificationMessage = {
  NEW_INCIDENT: {
    title: 'New Complaint',
    body: '$name$ raised a complaint #$displayId$ on $service$ for $society$.',
  },
  INCIDENT_ASSIGNMENT_CHANGED: {
    title: 'Complaint Assigned',
    body: 'Complaint #$displayId$ is assigned to you.',
  },
  INCIDENT_STATUS_CHANGED: {
    title: 'Complaint status changed',
    body: 'Complaint #$displayId$ status changed to $status$',
  },
  INCIDENT_COMMENT: {
    title: '$user$ added a comment on complaint #$displayId$ ',
    body: '$comment$',
  },
  AVAIL_SERVICES: {
    title: 'Avail Service',
    body: '$name$ wants to avail service for $services$.',
  },
  PROVIDE_SERVICES: {
    title: 'Provide Service',
    body: '$name$ wants to provide service for $services$. Contact number: $contactNumber$',
  },
  SOCIETY_ONBOARD: {
    title: 'New Society',
    body: '$society$ society has been on-boarded successfully by $name$.',
  },
  PARTNER_ONBOARD: {
    title: 'New Partner',
    body: '$partner$ partner has been on-boarded successfully by $name$.',
  },
  PARTNER_MEMBER: {
    title: 'Partner Admin',
    body:
      'Congratulations on becoming a partner admin with Inspacco. Please signout and login again.',
  },
  SOCIETY_MEMBER_ADDED: {
    title: '$role$',
    body:
      'You have been added as a $role$ for $society$. Please signout and login again.',
  },
  SERVICE_SUBSCRIBED: {
    title: 'Service Added',
    body: '$service$ service has been added successfully for $society$',
  },
  SERVICE_SUBSCRIBED_FOR_NEW_PARTNER: {
    title: 'Partner Changed',
    body: 'Supplier Partner has been changed for $service$ for $society$',
  },
  NEW_SERVICE_REQUEST: {
    title: 'New Service Request',
    body: 'New service request #$displayId$ created for $service$',
  },
  PARTNER_SERVICE_REQUEST: {
    title: 'New Service Request',
    body:
      'New service request #$displayId$ received for $service$ service from Inspacco.',
  },
  PARTNER_SERVICE_QUOTATION: {
    title: 'Partner Quotation Received',
    body: 'Quotation #$displayId$ received for $service$ service from Partner.',
  },
  PARTNER_SERVICE_QUOTATION_DOCUMENT: {
    title: 'Partner Quotation Document Received',
    body: 'Quotation Document received for $service$ service from Partner.',
  },
  SERVICE_QUOTATION_DOCUMENT: {
    title: 'Service Quotation Document Received',
    body: 'Quotation Document received for $service$ service from Inspacco.',
  },
  SERVICE_QUOTATION: {
    title: 'Quotation Received',
    body:
      'Quotation #$displayId$ received for $service$ service from Inspacco.',
  },
  SERVICE_SUBSCRIPTION_VISIT_SCHEDULED__SOCIETY: {
    title: 'Scheduled Service Visit',
    body: 'There is Scheduled Service Visit for $service$ on $date$',
  },
  SERVICE_SUBSCRIPTION_VISIT_SCHEDULED__PARTNER: {
    title: 'Scheduled Service Visit',
    body:
      'There is Scheduled Service Visit for $service$ on $date$ to $society$',
  },
  SERVICE_SUBSCRIPTION_VISIT_SCHEDULED__KAM: {
    title: 'Scheduled Service Visit',
    body:
      'There is Scheduled Service Visit for $service$ on $date$ to $society$',
  },
  SERVICE_SUBSCRIPTION_VISIT_SCHEDULED_DATE_CHANGE: {
    title: 'Scheduled Service Visit Date Change',
    body:
      'Scheduled Service Visit date for $service$ has been changed from $oldDate$ to $newDate$. Society - $society$',
  },
  SERVICE_SUBSCRIPTION_VISIT_SCHEDULED_NEXTDAY: {
    title: 'Scheduled Service Visit Tomorrow',
    body:
      'There is Scheduled Service Visit tomorrow for $service$. Society - $society$',
  },
  SERVICE_REQUEST_VISIT_SCHEDULED__PARTNER: {
    title: 'Scheduled Visit',
    body:
      "Society name and address have been updated for your $day$'s visit for $service$ related requirements.",
  },
  SERVICE_REQUEST_VISIT_SCHEDULED__REQUESTER: {
    title: 'Scheduled Visit',
    body:
      'Inspacco Partner will be visiting your premises $day$ for $service$ related requirements',
  },
  SERVICE_REQUEST_VISIT_SCHEDULED__INSAPCCO_ADMIN: {
    title: 'Scheduled Visit',
    body:
      '$partner$ will be visiting $society$ $day$ for $service$ related requirements.',
  },
  SERVICE_REQUEST_VISIT_DATE_CHANGED__INSAPCCO_ADMIN: {
    title: 'Scheduled Visit Date Changed',
    body:
      '$requester$ has changed the visit date from $oldDate$ to $newDate$ for $service$.',
  },
  SERVICE_REQUEST_VISIT_DATE_CHANGED__PARTNER: {
    title: 'Scheduled Visit Date Changed',
    body:
      'Inspacco has changed the visit date from $oldDate$ to $newDate$ for $service$.',
  },
  SERVICE_REQUEST_CANCELLED: {
    title: 'Service Request Cancelled',
    body: 'Service request for $service$ has been cancelled.',
  },
  REWARD_REDEEM_REQUEST: {
    title: 'Reward Redeem Request',
    body: '$user$ raised redeem request for $points$ points.',
  },
  REWARD_REDEEM_REQUEST_PROCESSED: {
    title: 'Redeem Request Processed',
    body:
      'Dear $user$, your redeem request for $points$ is processed. Check your bank statement.',
  },
  REWARD_REDEEM_REQUEST_REJECTED: {
    title: 'Redeem Request Rejected',
    body:
      'Dear $user$, your redeem request for $points$ is rejecetd. Please contact Inspacco.',
  },
  ADHOC_TASK_ADDED: {
    title: 'New Task Created',
    body: '$user$ has created a task for $date$ - "$taskSummary$"',
  },
  ADHOC_TASK_COMPLETED: {
    title: 'Task Completed',
    body: '$user$ has marked the task status completed for "$taskSummary$"',
  },
  SERVICE_QUOTATION_ACCEPTED: {
    title: 'Quotation Accepted',
    body:
      '$user$ has accepted the quotation #$quotationNumber$ for $serviceName$',
  },
  ATTENDANCE_MARKED: {
    title: 'Attendance Marked',
    body: 'Attendance for "$service$" has been marked for "$society$".'
  },
  SCHEDULE_VISIT_COMMENT: {
    title: '$user$ added a comment for scheduled visit ',
    body: '$comment$',
  },
};
