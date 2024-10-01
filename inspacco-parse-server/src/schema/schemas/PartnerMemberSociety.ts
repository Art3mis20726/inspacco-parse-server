export const PartnerMemberSociety = {
    className: 'PartnerMemberSociety',
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
      partnerMember: {
        type: 'Pointer',
        targetClass: 'PartnerMember',
        required: true,
      },
      society: {
        type: 'Pointer',
        targetClass: 'Society',
        required: true,
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
        'role:PARTNER_ADMIN': true,
        requiresAuthentication: true,
      },
      update: {
        'role:PARTNER_ADMIN': true,
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
  