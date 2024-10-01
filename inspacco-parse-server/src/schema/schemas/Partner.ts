export const Partner = {
  className: 'Partner',
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
    fullAddress: {
      type: 'String',
      required: false,
    },
    mobileNumber: {
      type: 'String',
      required: false,
    },
    email: {
      type: 'String',
      required: false,
    },
    website: {
      type: 'String',
      required: false,
    },
    description: {
      type: 'String',
      required: false,
    },
    priority: {
      type: 'Number',
      required: false,
    },
    estd: {
      type: 'Number',
      required: false,
    },
    numberOfClients: {
      type: 'Number',
      required: false,
    },
    annualTurnover: {
      type: 'Number',
      required: false,
    },
    package: {
      type: 'String',
      required: false,
      defaultValue: 'free'
    },
    experience: {
      type: 'Number',
      required: false,
    },
    verified: {
      type: 'Boolean',
      required: true,
      defaultValue: false,
    },
    rating: {
      type: 'Number',
      required: false,
    },
    ratingParameters: {
      type: 'Object',
      required: false,
      defaultValue: {
        'Service Rates': 0,
        'Quality of Work': 0,
        'Response Time': 0,
        'Punctuality': 0,
        'Honesty': 0
      },
    },
    rankingScore: {
      type: 'Number',
      required: false,
      defaultValue: 0
    },
    clients: {
      type: 'Relation',
      targetClass: 'Society',
    },
    logoName: {
      type: 'String',
      required: false,
    },
    address: {
      type: 'Object',
      required: false,
      defaultValue: {
        addressLine1: '',
        addressLine2: '',
        area: '',
        city: '',
        state: '',
        pincode: ''
      },
    },
    gstNumber: {
      type: 'String',
      required: false,
    },
    pan: {
      type: 'String',
      required: false,
    },
    services: {
      type: 'Array',
      required: false,
    },
    serviceNames: {
      type: 'String',
      required: false,
    },
    status: {
      type: 'String',
      required: true,
      defaultValue: 'Active',
    },
    slug: {
      type: 'String',
      required: false,
    },
    displayId: {
      type: 'Number',
      required: false,
    },
    ecommerceEnabled: {
      type: 'Boolean',
      defaultValue: false
    },
    ecommerceSetting: {
      type: 'Object'
    },
    preferedLanguage: {
      type: 'String',
      required: false,
      defaultValue: 'en'
    },


  },
  classLevelPermissions: {
    find: {
      requiresAuthentication: true,
      'role:INSPACCO_ADMIN': true,
      'role:INSPACCO_KAM': true,
      "*": true
    },
    count: {
      requiresAuthentication: true,
      'role:INSPACCO_ADMIN': true,
      'role:INSPACCO_KAM': true,
      "*": true,
    },
    get: {
      requiresAuthentication: true,
      'role:INSPACCO_ADMIN': true,
      'role:INSPACCO_KAM': true,
      "*": true
    },
    create: {
      'role:INSPACCO_ADMIN': true,
      'role:INSPACCO_KAM': true,
    },
    update: {
      'role:INSPACCO_ADMIN': true,
      'role:INSPACCO_KAM': true,
    },
    delete: {},
    addField: {},
    protectedFields: {
      '*': [],
    },
  },
  indexes: {
    objectId: { objectId: 1 },
    name_text: {
      name: 'text',
    },
  },
};
