export const SocietyStaff = {
    className: 'SocietyStaff',
    fields: {
      objectId: {
        type: 'String',
      },
      employeeId : {
        type:'String'
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
      society: {
        type: 'Pointer',
        targetClass: 'Society',
        required: true,
      },
      status: {
        type: 'String',
        required: true,
        defaultValue: 'Active',
      },
      displayId: {
        type: 'Number',
        required: false,
      },
      isDeleted: {
        type: 'Boolean',
        required: false,
        defaultValue: false,
      },
      user: {
        type: 'Pointer',
        targetClass: '_User'
      },
      department:{
        type:'String'
      }
    },
    classLevelPermissions: {
      find: {
        '*': true,
      },
      count: {
        '*': true,
      },
      get: {
        '*': true,
      },
      create: {
        '*': true,
      },
      update: {
        '*': true,
      },
      delete: {
        '*': true,
      },
      addField: {
        '*': true,
      },
      protectedFields: {
        '*': [],
      },
    },
    indexes: {
      objectId: { objectId: 1 },
      society_user: { society:1,user:1}
    },
  };
  