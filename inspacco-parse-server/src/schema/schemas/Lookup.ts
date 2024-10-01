export const Lookup = {
  className: 'Lookup',
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
    value: {
      type: 'String',
      required: false,
    },
    type: {
      type: 'String',
      required: false,
    },
    parentId: {
      type: 'String',
      required: false,
    },
  },
  classLevelPermissions: {
    find: {
      'role:INSPACCO_KAM': true,
    },
    count: {
      'role:INSPACCO_KAM': true,
    },
    get: {
      'role:INSPACCO_KAM': true,
    },
    create: {
      'role:INSPACCO_KAM': true,
    },
    update: {
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
