export const Permission = {
    className: 'Permission',
    fields: {
      resourceClass: {
        type: 'String',//TaskService,Service
        required: true
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
      description: {
        type: 'String',
        required: false,
      },
      action: {
        type: 'String',
        required: true
      },
      roles:{
        type: 'Relation',
        targetClass: '_Role',
      }
    },
    classLevelPermissions: {
      find: {
        requiresAuthentication: true,
        '*': true,
      },
      count: {
        requiresAuthentication: true
      },
      get: {
        requiresAuthentication: true,
        'role:ROOT': true,
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
      uniqueIndex:{
        action: 1,
        resourceClass: 1
      }
    },
  };
  