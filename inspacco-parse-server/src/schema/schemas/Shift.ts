export const Shift = {
    className: 'Shift',
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
        type: 'String'
      },
      startTime: {
        type: 'String',
        required: true,
      },
      endTime: {
        type: 'String',
        required: true
      },
      serviceSubscription:{
        type: 'Pointer',
        targetClass: 'ServiceSubscription',
        required: true,
      },
      shiftType : {
        type : 'String',
        defaultValue:'morning'
      }
    },
    classLevelPermissions: {
      find: {
        requiresAuthentication: true,
        'role:INSPACCO_ADMIN': true,
        '*': true,
      },
      count: {
        requiresAuthentication: true,
        'role:INSPACCO_ADMIN': true,
        '*': true,
      },
      get: {
        requiresAuthentication: true,
        'role:INSPACCO_ADMIN': true,
        '*': true,
      },
      create: {
        'role:INSPACCO_ADMIN': true,
        'role:PARTNER_ADMIN': true,
      },
      update: {
        'role:INSPACCO_ADMIN': true,
        'role:PARTNER_ADMIN': true,
      },
      delete: {
        'role:INSPACCO_ADMIN': true,
        'role:PARTNER_ADMIN':true
      },
      addField: {},
      protectedFields: {
        '*': [],
      },
    },
    indexes: {
      objectId: { objectId: 1 }
    },
  };
  