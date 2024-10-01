export const PartnerServiceRequest = {
  className: 'PartnerServiceRequest',
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
    serviceRequest: {
      type: 'Pointer',
      targetClass: 'ServiceRequest',
      required: true,
    },
    displayId: {
      type: 'Number',
      required: false,
    },
    partner: {
      type: 'Pointer',
      targetClass: 'Partner',
      required: true,
    },
    pocName:{
      type:'String',
      required: false
    },
    pocNumber:{
      type: 'String',
      requried: false,
    },
    requirement: {
      type: 'String',
      required: false,
    },
    status: {
      type: 'String',
      required: true,
      defaultValue: 'OPEN',
    },
    quotations: {
      type: 'Relation',
      targetClass: 'PartnerServiceQuotation',
    },
    inspaccoNote: {
      type: 'String',
    },
    service: {
      type: 'Pointer',
      targetClass: 'Service',
      required: true,
    },
    visitDate: {
      type: 'Date',
      required: false,
    },
    visitRequirement: {
      type: 'Object',
      required: false,
    },
  },
  classLevelPermissions: {
    find: {
      requiresAuthentication: true,
    },
    count: {
      requiresAuthentication: true,
    },
    get: {
      requiresAuthentication: true,
    },
    create: {
      'role:INSPACCO_KAM': true,
      requiresAuthentication: true,
    },
    update: {
      'role:INSPACCO_KAM': true,
      requiresAuthentication: true,
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
