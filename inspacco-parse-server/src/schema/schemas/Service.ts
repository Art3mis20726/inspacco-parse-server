export const Service = {
  className: 'Service',
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
    name: {
      type: 'String',
      required: true,
    },
    description: {
      type: 'String',
      required: false,
    },
    requireAttendance: {
      type: 'Boolean',
      required: true,
      defaultValue: false,
    },
    status: {
      type: 'String',
      required: true,
      defaultValue: 'Active',
    },
    isStandard: {
      type: 'Boolean',
      required: false,
      defaultValue: true,
    },
    tasks: {
      type: 'Relation',
      targetClass: 'ServiceTask',
    },
    serviceKey: {
      type: 'String',
      required: false,
    },
    isPopular: {
      type: 'Boolean',
      defaultValue: false,
    },
    visibleTo: {
      type: 'String',
    },
    qualityAssuranceText: {
      type: 'String',
      required: false,
    },
    inclusionText: {
      type: 'String',
      required: false,
    },
    requirementForm: {
      type: 'String',
      required: false,
    },
    displayOrder:{
      type: 'Number',
      required: false,
      defaultValue:100
    }
  },
  classLevelPermissions: {
    find: {
      requiresAuthentication: true,
      'role:INSPACCO_ADMIN': true,
      '*': true,
    },
    count: {
      requiresAuthentication: true,
      'role:INSPACCO_ADMIN': true,
      '*': true,
    },
    get: {
      requiresAuthentication: true,
      'role:INSPACCO_ADMIN': true,
      '*': true,
    },
    create: {
      'role:INSPACCO_ADMIN': true,
    },
    update: {
      'role:INSPACCO_ADMIN': true,
    },
    delete: {
      'role:INSPACCO_ADMIN': true,
    },
    addField: {},
    protectedFields: {
      '*': [],
    },
  },
  indexes: {
    objectId: { objectId: 1 },
  },
  dbIndexes: [
    {
      name: 'serviceKey',
      keys: {
        serviceKey: 1
      },
      options: {
        unique: true
      }
    }
  ]
};
