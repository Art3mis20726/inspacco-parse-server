export const ServiceSubscription = {
  className: 'ServiceSubscription',
  fields: {
    objectId: {
      type: 'String',
    },
    createdAt: {
      type: 'Date',
    },
    updatedAt: {
      type: 'Date',
    },
    ACL: {
      type: 'ACL',
    },
    society: {
      type: 'Pointer',
      targetClass: 'Society',
      required: true,
    },
    partner: {
      type: 'Pointer',
      targetClass: 'Partner',
      required: true,
    },
    service: {
      type: 'Pointer',
      targetClass: 'Service',
      required: true,
    },
    startDate: {
      type: 'Date',
      required: false,
    },
    endDate: {
      type: 'Date',
      required: false,
    },
    status: {
      type: 'String',
      required: false,
    },
    serviceEnded: {
      type: 'Boolean',
      required: false,
      defaultValue: false,
    },
    createdBy: {
      type: 'Pointer',
      targetClass: '_User',
      required: false,
    },
    updatedBy: {
      type: 'Pointer',
      targetClass: '_User',
      required: false,
    },
    tasks: {
      type: 'Relation',
      targetClass: 'Task',
    },
    displayId: {
      type: 'Number',
      required: false,
    },
    partnerServiceRequest:{
      type:'Pointer',
      targetClass:'PartnerServiceRequest',
      required: false,
    },
    partnerMember:{
      type:'Pointer',
      targetClass:'PartnerMember',
      required: false,
    },
  },  
  classLevelPermissions: {
    find: {
      requiresAuthentication: true,
      'role:INSPACCO_KAM': true,
    },
    count: {
      requiresAuthentication: true,
      'role:INSPACCO_KAM': true,
    },
    get: {
      requiresAuthentication: true,
      'role:INSPACCO_KAM': true,
    },
    create: {
      requiresAuthentication:true,
      'role:PARTNER_ADMIN': true,
      'role:INSPACCO_KAM': true,
    },
    update: {
      'role:PARTNER_ADMIN': true,
      'role:PARTNER_KAM': true, 
      'role:INSPACCO_KAM': true,
    },
    delete: {},
    addField: {},
    protectedFields: {
      '*': [],
    },
  },
  indexes: {
    objectId: { objectId: 1 },
  },
};
