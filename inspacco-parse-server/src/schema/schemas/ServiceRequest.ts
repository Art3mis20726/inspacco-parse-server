import { COLLECTIONS } from "../../constants/common";

export const ServiceRequest = {
  className: 'ServiceRequest',
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
    displayId: {
      type: 'Number',
      required: false,
    },
    requester: {
      type: 'Pointer',
      targetClass: '_User',
      required: true,
    },
    society: {
      type: 'Pointer',
      targetClass: 'Society',
      required: false,
    },
    service: {
      type: 'Pointer',
      targetClass: 'Service',
      required: true,
    },
    requirement: {
      type: 'String',
      required: false,
    },
    comments: {
      type: 'Relation',
      targetClass: 'ServiceRequestComment',
    },
    status: {
      type: 'String',
      required: true,
      defaultValue: 'OPEN',
    },
    quotations: {
      type: 'Relation',
      targetClass: 'ServiceQuotation',
    },
    visitDate: {
      type: 'Date',
      required: false,
    },
    priority: {
      type: 'String',
      required: false,
      defaultValue: 'LOW',
    },
    subService: {
      type: 'String',
      required: false,
      defaultValue: 'Others',
    },
    resolutionComment: {
      type: 'String',
      // required: true,
    },
    visitRequirement: {
      type: 'Object',
      required: false,
    },
    referralCode: {
      type: 'String'
    },
    activityHistory:{
      type:'Relation',
     targetClass:'ActivityHistory'
    },
    partner: {
      type: 'Pointer',
      targetClass: COLLECTIONS.PARTNER,
      required: false,
    },
    clientFacility:{
      type:'Pointer',
      targetClass: COLLECTIONS.CLIENT_FACILITY,
      required: false,
    }
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
      requiresAuthentication: true,
    },
    update: {
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
    objectId_status: { objectId: 1, status: 1 },
    objectId_visitDate: { objectId: 1, visitDate: 1 },
    status: { status: 1 },
    society_createdAt: { society: 1, createdAt: 1 },
    createdAt: { createdAt: 1 },
  },
  // support new indexes types
  dbIndexes: [
    {
      name: 'displayId',
      keys: {
        displayId: 1
      },
      options: {
        unique: true
      }
    }
  ]
};
