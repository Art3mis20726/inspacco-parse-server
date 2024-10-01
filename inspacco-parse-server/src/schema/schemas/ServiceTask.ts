export const ServiceTask = {
  className: 'ServiceTask',
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
    summary: {
      type: 'String',
      required: true,
    },
    description: {
      type: 'String',
      required: false,
    },
    rewardPoints: {
      type: 'Number',
      required: false,
    },
    frequency: {
      type: 'String',
      required: true,
    },
    dayInWeek: {
      type: 'Number',
      required: false,
    },
    dayInMonth: {
      type: 'Number',
      required: false,
    },
    status: {
      type: 'String',
      required: true,
      defaultValue: 'Active',
    },
    isVisible: {
      type: 'Boolean',
      required: false,
      defaultValue: false,
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
