export const TaskActivity = {
  className: 'TaskActivity',
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
    task: {
      type: 'Pointer',
      targetClass: 'Task',
      required: true,
    },
    serviceSubscriptiontmp: {
      type: 'Pointer',
      targetClass: 'ServiceSubscription',
      required: false,
    },
    comment: {
      type: 'String',
      required: false,
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
    taskDate: {
      type: 'Date',
      required: true,
    },
    taskStatus: {
      type: 'String',
      required: true,
      defaultValue: 'OPEN',
    },
    activityHistory:{
      type:'Relation',
     targetClass:'ActivityHistory'
    },
    attachments:{
      type: 'Relation',
      targetClass: 'Attachment'
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
    delete: {},
    addField: {},
    protectedFields: {
      '*': [],
    },
  },
  indexes: {
    objectId: { objectId: 1 },
    taskDate: {taskDate: -1}
  },
};
