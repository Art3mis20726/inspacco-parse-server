

export const Approval = {
    className: 'Approval',
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
        approver: { type: 'Pointer', targetClass: '_User' },
        approved: { type: 'Boolean' },
        comments: { type: 'String' },
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
    },
};