export const PartnerStaff = {
  className: 'PartnerStaff',
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
    firstName: {
      type: 'String',
      required: true,
    },
    lastName: {
      type: 'String',
      required: true,
    },
    mobileNumber: {
      type: 'String',
      required: true,
    },
    address: {
      type: 'String',
      required: false,
    },
    profileImage: {
      type: 'String',
      required: false,
    },
    partner: {
      type: 'Pointer',
      targetClass: 'Partner',
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
    partner_user: { partner:1,user:1}
  },
};
