export const ScheduleDemo = {
    className: 'ScheduleDemo',
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
      Name: {
        type: 'String',
        required: true,
      },
      CompanyName: {
        type: 'String',
        required: false,
      },
      MobileNumber: {
        type: 'String',
        required: false,
      },
      email: {
        type: 'String',
        required: true,
      },
    //   status: {
    //     type: 'String',
    //     required: false,
    //     defaultValue: 'Active',
    //   },
      createdBy: {
        type: 'Pointer',
        targetClass: '_User',
        required: false,
      },
      updatedBy: {
        type: 'Pointer',
        targetClass: '_User',
        required: false,
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
  