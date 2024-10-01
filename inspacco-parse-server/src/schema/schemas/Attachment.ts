export const Attachment = {
  className: 'Attachment',
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
      required: false,
    },
    fileName: {
      type: 'String',
      required: true,
    },
    url: {
      type: 'String',
      required: true,
    },
    parentId: {
      type: 'String',
      required: true,
    },
    module: {
      type: 'String',
      required: false,
    },
    status: {
      type: 'String',
      required: true,
      defaultValue: '"Active"',
    },
    permissionGroupId: {
      type: 'String',
      required: false,
    },
    createdBy: {
      type: 'Pointer',
      targetClass: '_User',
      required: false,
    },
  },
  classLevelPermissions: {
    find: {
      requiresAuthentication: true,
      "*": true
    },
    count: {
      requiresAuthentication: true,
      "*": true,
    },
    get: {
      requiresAuthentication: true,
      "*": true,
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
    parentId: { parentId: 1 },
    module: { module: 1 },
  },
};
