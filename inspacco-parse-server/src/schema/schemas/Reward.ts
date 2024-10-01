export const Reward = {
  className: 'Reward',
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
    taskActivity: {
      type: 'Pointer',
      targetClass: 'TaskActivity',
      required: false,
    },
    user: {
      type: 'Pointer',
      targetClass: '_User',
      required: true,
    },
    rewardPoints: {
      type: 'Number',
      required: true,
      defaultValue: 0,
    },
    rewardDate: {
      type: 'Date',
      required: true,
    },
    redeemType: {
      type: 'String',
      required: false,
      defaultValue: 'OTHER',
    },
  },
  classLevelPermissions: {
    find: {
      requiresAuthentication: true,
      'role:ROOT': true,
      'role:INSPACCO_ADMIN': true,
    },
    count: {
      requiresAuthentication: true,
      'role:ROOT': true,
      'role:INSPACCO_ADMIN': true,
    },
    get: {
      requiresAuthentication: true,
      'role:ROOT': true,
      'role:INSPACCO_ADMIN': true,
    },
    create: {
      'role:ROOT': true,
      'role:INSPACCO_ADMIN': true,
    },
    update: {
      'role:ROOT': true,
      'role:INSPACCO_ADMIN': true,
    },
    delete: {
      'role:ROOT': true,
      'role:INSPACCO_ADMIN': true,
    },
    addField: {},
    protectedFields: {
      '*': [],
    },
  },
  indexes: {
    objectId: { objectId: 1 },
    user: { user: 1 },
  },
};
