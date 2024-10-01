export const PhoneAuth = {
  className: 'PhoneAuth',
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
    mobileNumber: {
      type: 'String',
    },
    otpExpiry: {
      type: 'Date',
    },
    otpCounter: {
      type: 'Number',
    },
    otp: {
      type: 'String',
    },
    userStatus: {
      type: 'String',
    },
  },
  classLevelPermissions: {
    find: {},
    count: {},
    get: {},
    create: {},
    update: {},
    delete: {},
    addField: {},
    protectedFields: {},
  },
  indexes: {
    /*_id_: {
      _id: 1,
    },*/
    objectId: { objectId: 1 },
    UniqueIndex: {
      mobileNumber: 1,
    },
  },
};
