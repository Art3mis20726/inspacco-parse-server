export const OrderVendorMapping = {
    className: 'OrderVendorMapping',
    fields: {
        orderId: {
            type: 'String',
            required: true
        },
        partner: {
            type: 'Pointer',
            targetClass: 'Partner',
            required: false,
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
