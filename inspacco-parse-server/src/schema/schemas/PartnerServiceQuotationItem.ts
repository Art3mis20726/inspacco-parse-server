

export const PartnerServiceQuotationItem = {
    className: 'PartnerServiceQuotationItem',
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
      displayId: {
        type: 'Number',
        required: false,
      },
      serialNumber: {
        type: 'Number',
        required: true,
      },
      serviceDescription: {
        type: 'String',
        required: true,
      },
      quantity: {
        type: 'Number',
        required: true,
        defaultValue: 1,
      },
      rate: {
        type: 'Number',
        required: true,
      },
      amount: {
        type: 'Number',
        required: true,
        defaultValue: 0,
      },
      comment:{
          type:'String',
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
    },
  };
  