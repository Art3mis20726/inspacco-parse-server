import { COLLECTIONS } from "../../constants/common";
export const ServiceQuotation = {
  className: 'ServiceQuotation',
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
    actualAmount: {
      type: 'Number',
      required: true,
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
    margin: {
      type: 'Number',
      required: false,
      defaultValue: 0,
    },
    totalAmount: {
      type: 'Number',
      required: true,
      defaultValue: 0,
    },
    note: {
      type: 'String',
    },
    quotationReceiverName:{
      type: 'String'
    },
    status: {
      type: 'String',
      defaultValue: 'OPEN',
    },
    items: {
      type: 'Relation',
      targetClass: 'ServiceQuotationItem',
    },
    partner: {
      type: 'Pointer',
      targetClass: COLLECTIONS.PARTNER,
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
