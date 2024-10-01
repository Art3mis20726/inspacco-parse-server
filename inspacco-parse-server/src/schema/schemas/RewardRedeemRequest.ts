export const RewardRedeemRequest = {
  className: 'RewardRedeemRequest',
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
    user: {
      type: 'Pointer',
      targetClass: '_User',
      required: true,
    },
    rewardPoints: {
      type: 'Number',
      required: true,
      defaultValue: 0,
    },
    upiId: {
      type: 'String',
    },
    status: {
      type: 'String',
      defaultValue: 'PENDING',
    },
    transactionDetails: {
      type: 'String',
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
