export const User = {
  className: '_User',
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
    username: {
      type: 'String',
    },
    password: {
      type: 'String',
    },
    email: {
      type: 'String',
    },
    emailVerified: {
      type: 'Boolean',
    },
    authData: {
      type: 'Object',
    },
    firstName: {
      type: 'String',
      required: false,
    },
    lastName: {
      type: 'String',
      required: false,
    },
    gender: {
      type: 'String',
      required: false,
    },
    dob: {
      type: 'Date',
      required: false,
    },
    profilePicture: {
      type: 'String',
      required: false,
    },
    mobileNumber: {
      type: 'String',
      required: false,
    },
    createdBy: {
      type: 'String',
      required: false,
      defaultValue: 'System',
    },
    totalRewardPoints: {
      type: 'Number',
      required: true,
      defaultValue: 0,
    },
    personFaceId:{
      type:'String'
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
    mobileNumber_index: { mobileNumber: 1 },
    /*    
	  username_1: {
		username: 1,
	  },
	  case_insensitive_email: {
		email: 1,
	  },
	  email_1: {
		email: 1,
	  },
	  case_insensitive_username: {
		username: 1,
	  },*/
  }
};
