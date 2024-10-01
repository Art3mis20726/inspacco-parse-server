import { COLLECTIONS } from "../../constants/common";

export const SocietyMember = {
  className: 'SocietyMember',
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
    society: {
      type: 'Pointer',
      targetClass: 'Society',
      required: true,
    },
    member: {
      type: 'Pointer',
      targetClass: '_User',
      required: true,
    },
    type: {
      type: 'String',
      required: true,
    },
    subtype: {
      type: 'String',
      required: false,
    },
    clientFacilities:{
      type: 'Relation',
      targetClass: COLLECTIONS.CLIENT_FACILITY
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
