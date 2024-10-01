export const WhiteLabel = {
    className: 'WhiteLabel',
    fields: {
      label: {
        type: 'String',//TaskService,Service
        required:true
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
      description: {
        type: 'String'
      },
      partners:{
        type: 'Relation',
        targetClass: 'Partner',
      }
    },
    classLevelPermissions: {
      find: {
        requiresAuthentication: true
      },
      count: {
        requiresAuthentication: true
      },
      get: {
        requiresAuthentication: true
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
      label:{label:1,value:1}
    }
  };
  