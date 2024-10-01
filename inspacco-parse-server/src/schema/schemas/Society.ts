import { COLLECTIONS } from "../../constants/common";

export const Society = {
  className: 'Society',
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
    name: {
      type: 'String',
      required: true,
    },
    addressLine1: {
      type: 'String',
      required: false,
      defaultValue: '',
    },
    addressLine2: {
      type: 'String',
      required: false,
    },
    area: {
      type: 'String',
      required: false,
    },
    city: {
      type: 'String',
      required: false,
    },
    pincode: {
      type: 'Number',
      required: false,
    },
    state: {
      type: 'String',
      required: false,
    },
    email: {
      type: 'String',
      required: false,
    },
    status: {
      type: 'String',
      required: true,
      defaultValue: 'Active',
    },
    amenities: {
      type: 'Array',
      required: false,
    },
    displayId: {
      type: 'Number',
      required: false,
    },
    societyLat: {
      type: 'String'
    },
    societyLong: {
      type: 'String'
    },
    location: {
      type: 'GeoPoint'
    },
    tasks: {
      type: 'Relation',
      targetClass: 'Task',
    },
    logo: {
      type: 'String'
    },
    description: {
      type: 'String'
    },
    services: {
      type: 'Relation',
      targetClass: COLLECTIONS.SERVICE,
    },
    registeredEntityName: {
      type: 'String'
    },
    GSTNo: {
      type: 'String'
    },
    GSTState: {
      type: 'String'
    },
    POCName: {
      type: 'String',
    },
    POCMobileNumber: {
      type: 'String',
    },
    POCEmail: {
      type: 'String',
    },
    CINNumber: {
      type: 'String'
    },
    clientPhoneNumber: {
      type: 'String'
    },
    settings: {
      type: 'Object',
      required: false
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
      'role:INSPACCO_KAM': true,
      requiresAuthentication: true,
    },
    update: {
      'role:INSPACCO_KAM': true,
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
    name_text: { name: 'text' },
  },
};
