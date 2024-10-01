

export type IPermissionData = { action: string; description: string,roles:any[],resourceClass:string };

export const permissions: Array<IPermissionData> = [{
    action: 'read',
    description: 'Read Access to Partner',
    roles:['PARTNER_ADMIN'],
    resourceClass:'Partner'
  },{
    action: 'write',
    description: 'write Access to Partner',
    roles:['PARTNER_ADMIN'],
    resourceClass:'Partner'
  },{
    action: 'read',
    description: 'Read Access to Attachment',
    roles:['PARTNER_ADMIN'],
    resourceClass:'Attachment'
  },{
    action: 'write',
    description: 'write Access to Attachment',
    roles:['PARTNER_ADMIN'],
    resourceClass:'Attachment'
  },{
    action: 'read',
    description: 'Read Access to PartnerServiceRequest',
    roles:['PARTNER_ADMIN'],
    resourceClass:'PartnerServiceRequest'
  },{
    action: 'write',
    description: 'write Access to PartnerServiceRequest',
    roles:['PARTNER_ADMIN'],
    resourceClass:'PartnerServiceRequest'
  },{
    action: 'read',
    description: 'Read Access to ServiceQuotation',
    roles:['PARTNER_ADMIN'],
    resourceClass:'ServiceQuotation'
  },{
    action: 'write',
    description: 'write Access to ServiceQuotation',
    roles:['PARTNER_ADMIN'],
    resourceClass:'ServiceQuotation'
  },{
    action: 'read',
    description: 'Read Access to Incident',
    roles:['PARTNER_ADMIN'],
    resourceClass:'Incident'
  },{
    action: 'write',
    description: 'write Access to Incident',
    roles:['PARTNER_ADMIN'],
    resourceClass:'Incident'
  },{
    action: 'read',
    description: 'Read Access to Comments',
    roles:['PARTNER_ADMIN'],
    resourceClass:'Comments'
  },{
    action: 'write',
    description: 'write Access to Comments',
    roles:['PARTNER_ADMIN'],
    resourceClass:'Comments'
  },{
    action: 'read',
    description: 'Read Access to Society',
    roles:['PARTNER_ADMIN'],
    resourceClass:'Society'
  },{
    action: 'write',
    description: 'write Access to Society',
    roles:[],
    resourceClass:'Society'
  },{
    action: 'read',
    description: 'Read Access to Attendance',
    roles:['PARTNER_ADMIN'],
    resourceClass:'Attendance'
  },{
    action: 'write',
    description: 'write Access to Attendance',
    roles:['PARTNER_ADMIN'],
    resourceClass:'Attendance'
  },
  {
    action: 'read',
    description: 'Read Access to PartnerStaff',
    roles:['PARTNER_ADMIN'],
    resourceClass:'PartnerStaff'
  },{
    action: 'write',
    description: 'write Access to PartnerStaff',
    roles:['PARTNER_ADMIN'],
    resourceClass:'PartnerStaff'
  },{
    action: 'read',
    description: 'Read Access to ServiceSubscriptionSchedule',
    roles:['PARTNER_ADMIN'],
    resourceClass:'ServiceSubscriptionSchedule'
  },{
    action: 'write',
    description: 'write Access to ServiceSubscriptionSchedule',
    roles:['PARTNER_ADMIN'],
    resourceClass:'ServiceSubscriptionSchedule'
  },{
    action: 'read',
    description: 'Read Access to ServiceStaff',
    roles:['PARTNER_ADMIN'],
    resourceClass:'ServiceStaff'
  },{
    action: 'write',
    description: 'write Access to ServiceStaff',
    roles:['PARTNER_ADMIN'],
    resourceClass:'ServiceStaff'
  },
  {
    action: 'read',
    description: 'Read Access to SchedultVisitComment',
    roles:['PARTNER_ADMIN'],
    resourceClass:'SchedultVisitComment'
  },{
    action: 'write',
    description: 'write Access to SchedultVisitComment',
    roles:['PARTNER_ADMIN'],
    resourceClass:'SchedultVisitComment'
  },{
    action: 'read',
    description: 'Read Access to Task',
    roles:['PARTNER_ADMIN'],
    resourceClass:'Task'
  },{
    action: 'write',
    description: 'write Access to Task',
    roles:[],
    resourceClass:'Task'
  },{
    action: 'read',
    description: 'Read Access to TaskActivity',
    roles:['PARTNER_ADMIN'],
    resourceClass:'TaskActivity'
  },{
    action: 'write',
    description: 'write Access to TaskActivity',
    roles:['PARTNER_ADMIN'],
    resourceClass:'TaskActivity'
  },
  {
    action: 'read',
    description: 'Read Access to ServiceTask',
    roles:['PARTNER_ADMIN'],
    resourceClass:'ServiceTask'
  },{
    action: 'write',
    description: 'write Access to ServiceTask',
    roles:[],
    resourceClass:'ServiceTask'
  }
];
