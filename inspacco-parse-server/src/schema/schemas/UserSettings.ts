export const UserSetting = {
    className: 'UserSetting',
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
        user: {
            type: 'Pointer',
            targetClass: '_User',
            required: true,
        },
        settingType: {
            type: 'String',
        },
        key: {
            type: 'String',
            required: true
        },
        value: {
            type: 'String',
            required: true
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
        userid_key_type: { user: 1, key: 1, value: 1 }
    },
};