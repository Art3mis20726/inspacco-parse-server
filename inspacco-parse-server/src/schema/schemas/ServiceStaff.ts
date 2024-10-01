export const ServiceStaff = {
  className: 'ServiceStaff',
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
    serviceSubscription: {
      type: 'Pointer',
      targetClass: 'ServiceSubscription',
      required: true,
    },
    type: {
      type: 'String',
      required: false,
      defaultValue: '',
    },
    startDate: {
      type: 'Date',
      required: false,
    },
    endDate: {
      type: 'Date',
      required: false,
    },
    staff: {
      type: 'Pointer',
      targetClass: 'PartnerStaff',
      required: true,
    },
    status: {
      type: 'String',
      required: true,
      defaultValue: 'Active',
    },
    isTemporary: {
      type: 'Boolean',
    },
    shift : {
      type: 'Pointer',
      targetClass: 'Shift'
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
    service_subscription_staff_index: {serviceSubscription:1,staff:1},
  },
};
