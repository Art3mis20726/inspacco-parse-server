export const Incident = {
  className: 'Incident',
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
    serviceSubscription: {
      type: 'Pointer',
      targetClass: 'ServiceSubscription',
      required: true,
    },
    category: {
      type: 'String',
      required: true,
    },
    priority: {
      type: 'String',
      required: true,
      defaultValue: 'LOW',
    },
    summary: {
      type: 'String',
      required: true,
    },
    description: {
      type: 'String',
      required: false,
    },
    status: {
      type: 'String',
      required: true,
      defaultValue: 'OPEN',
    },
    assignedGroup: {
      type: 'String',
      required: false,
      defaultValue: 'INSPACCO',
    },
    assignee: {
      type: 'Pointer',
      targetClass: '_User',
      required: false,
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
    displayId: {
      type: 'Number',
      required: false,
    },
    comments: {
      type: 'Relation',
      targetClass: 'IncidentComment',
    },
    activityHistory:{
      type:'Relation',
     targetClass:'ActivityHistory'
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
      'role:ROOT':true,
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
  },
};
