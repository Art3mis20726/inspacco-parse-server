export const PartnerMember = {
  className: 'PartnerMember',
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
    partner: {
      type: 'Pointer',
      targetClass: 'Partner',
      required: false,
    },
    member: {
      type: 'Pointer',
      targetClass: '_User',
      required: false,
    },
    type: {
      type: 'String',
      required: false,
    },
    subtype: {
      type: 'String',
      required: false,
    },
  },
  classLevelPermissions: {
    find: {
      requiresAuthentication: true,
      'role:INSPACCO_KAM': true,
    },
    count: {
      requiresAuthentication: true,
      'role:INSPACCO_KAM': true,
    },
    get: {
      requiresAuthentication: true,
      'role:INSPACCO_KAM': true,
    },
    create: {
      requiresAuthentication: true,
      'role:INSPACCO_KAM': true,
    },
    update: {
      'role:INSPACCO_KAM': true,
    },
    delete: {
      'role:INSPACCO_KAM': true,
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
