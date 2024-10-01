export const UserActivity = {
    className: 'UserActivity',
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
      userId: {
          type:'String',
      },
      foregroundTime: {
          type: 'Date',
      },
      backgroundTime: {
          type: 'Date',
      }, 
      userType: {
        type: 'String',
      },
      devicePlatform: {
        type: 'String',
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
    },
  };