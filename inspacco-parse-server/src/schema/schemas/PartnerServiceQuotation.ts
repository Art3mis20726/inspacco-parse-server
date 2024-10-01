export const PartnerServiceQuotation = {
  className: 'PartnerServiceQuotation',
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
    discount: {
      type: 'Number',
      required: false,
      defaultValue: 0,
    },
    tax: {
      type: 'Number',
      required: false,
      defaultValue: 0,
    },
    otherCharges: {
      type: 'Number',
      required: false,
      defaultValue: 0,
    },    
    actualAmount: {
      type: 'Number',
      required: true,
    },
    totalAmount: {
      type: 'Number',
      required: true,
      defaultValue: 0,
    },
    note: {
      type: 'String',
    },
    status: {
      type: 'String',
      defaultValue: 'OPEN',
    },    
    items: {
      type: 'Relation',
      targetClass: 'PartnerServiceQuotationItem',
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
