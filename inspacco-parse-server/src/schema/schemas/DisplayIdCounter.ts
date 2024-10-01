export const DisplayIdCounter = {
  className: 'DisplayIdCounter',
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
    collection: {
      type: 'String',
      required: true,
    },
    counter: {
      type: 'Number',
      required: true,
      defaultValue: 1,
    },
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
  },
};
