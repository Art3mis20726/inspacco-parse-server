export const ActivityHistory = {
    className: 'ActivityHistory',
    fields: {
      objectId: {
        type: 'String',
      },
      action:{
        type: 'String',
      },
      value:{
        type: 'String',
      },
      createdAt: {
        type: 'Date',
      },
      createdBy: {
        type: 'Pointer',
        targetClass: '_User',
        required: false,
      },
      title: {
        type: 'String',
        required: false,
      },
      description: {
        type: 'String',
        required: false,
      },
      metadata: {
        type: 'Object',
        required: false,
      },
      ACL: {
        type: 'ACL',
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
    }
  };
  