export const ServiceSubscriptionSchedule = {
  className: 'ServiceSubscriptionSchedule',
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
    serviceSubscription: {
      type: 'Pointer',
      targetClass: 'ServiceSubscription',
      required: true,
    },
    date: {
      type: 'Date',
      required: true,
    },
    status: {
      type: 'String',
    },
    createdBy: {
      type: 'Pointer',
      targetClass: '_User',
      required: false,
    },
    updatedBy: {
      type: 'Pointer',
      targetClass: '_User',
      required: false,
    },
    remark: {
      type: 'String',
    },
    comments: {
      type: 'Relation',
      targetClass: 'ScheduleVisitComment',
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
