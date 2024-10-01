export const Task = {
  className: 'Task',
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
    summary: {
      type: 'String',
      required: true,
    },
    description: {
      type: 'String',
      required: false,
      defaultValue: '',
    },
    rewardPoints: {
      type: 'Number',
      required: false,
    },
    frequency: {
      type: 'String',
      required: true,
    },
    dayInWeek: {
      type: 'Number',
      required: false,
    },
    dayInMonth: {
      type: 'Number',
      required: false,
    },
    startDate: {
      type: 'Date',
      required: false,
    },
    endDate: {
      type: 'Date',
      required: false,
    },
    status: {
      type: 'String',
      required: true,
      defaultValue: 'Active',
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
    assignedTo: {
      type: 'Pointer',
      targetClass: '_User',
      required: false,
    },
    isVisible: {
      type: 'Boolean',
      required: false,
      defaultValue: false,
    },
    parentId : {
      type:'String',
      required: false
    },
    parentTask:{
      type:'Pointer',
      targetClass:'Task',
      required:false
    },
    category: {
      type:'String',
      required: false
    },
    module: {
      type:'String',
      required: false
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
    frequency: { frequency: 1 },
    dayInWeek: { dayInWeek: 1 },
    dayInMonth: { dayInMonth: 1 },
    startDate: { startDate: 1 },
    endDate: { endDate: 1 },
  },
};
