export const Attendance = {
  className: 'Attendance',
  fields: {
    objectId: {
      type: 'String',
    },
    attendanceDetails: {
      type: 'String',
      required: false
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
    date: {
      type: 'Date',
      required: true,
    },
    isPresent: {
      type: 'Boolean',
      required: false,
    },
    isTemporary: {
      type: 'Boolean',
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
    shift: {
      type: 'String',
      required: false,
      defaultValue: 'DAY',
    },
    serviceStaff: {
      type: 'Pointer',
      targetClass: 'ServiceStaff',
      required: true,
    },
    mode:{
      type : 'String',
      required:true,
      defaultValue:'manual'
    },
    capturedPic: {
      type: 'String'
    },
    userLongitude: {
      type: 'Number'
    },
    userLatitude: {
      type: 'Number'
    },
    inTime : {
      type: 'Date'
    },
    outTime : {
      type : 'Date'
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
    serviceStaff: { serviceStaff: 1 },
  },
};
