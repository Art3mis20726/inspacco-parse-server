export const ClientRegistrationRequest = {
    className: 'ClientRegistrationRequest',
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
      clientType: {
        type: 'String',
        required: true,
        enum: ['pending', 'in progress', 'completed']
      },
      clientName:{
        type: 'String',
        required: true,
      },
      email:{
        type: 'String',
        required:true
      },
      pincode:{
        type:'String'
      },
      address:{
        type:'String'
      },
      message:{
        type:'String'
      },
      createdBy: {
        type: 'Pointer',
        targetClass: '_User',
        required: false,
      },
      updatedBy: {
        type: 'Pointer',
        targetClass: '_User',
        required: false,
      }
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
        'role:ROOT':true,
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
  