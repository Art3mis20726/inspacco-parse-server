export const Notification = {
  className: 'Notification',
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
    user: {
      type: 'Pointer',
      targetClass: '_User',
      required: true,
    },
    category: {
      type: 'String',
      required: true,
    },
    isRead: {
      type: 'Boolean',
      required: true,
      defaultValue: false,
    },
    title: {
      type: 'String',
      required: true,
    },
    message: {
      type: 'String',
      required: false,
    },
    data: {
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
      requiresAuthentication: true,
    },
    update: {
      requiresAuthentication: true,
    },
    delete: {
      requiresAuthentication: true,
    },
    addField: {},
    protectedFields: {
      '*': [],
    },
  },
  indexes: {
    objectId: { objectId: 1 },
    user: {user: 1},
    createdAt: {createdAt: -1}
  },
};
