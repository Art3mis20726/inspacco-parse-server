export const ExpoPushToken = {
  className: 'ExpoPushToken',
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
    token: {
      type: 'String',
      required: true,
    },
    device: {
      type: 'String',
      required: true,
    }
  },

  classLevelPermissions: {
    find: {},
    count: {},
    get: {},
    create: {},
    update: {},
    delete: {},
    addField: {},
    protectedFields: {
      '*': [],
    },
  },
  indexes: {
    objectId: { objectId: 1 },
  }
};
