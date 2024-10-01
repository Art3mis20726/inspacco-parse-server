import { COLLECTIONS } from "../../constants/common";

export const OrderRequest = {
    className: COLLECTIONS.ORDER_REQUEST,
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
        cartId: {
            type: 'String',
            required: true
        },
        orderId: {
            type: 'String',
            required: false
        },
        clientvendorcatalogMapping: {
            type: 'Pointer',
            targetClass: COLLECTIONS.CLIENT_VENDOR_CATALOG_MAPPING,
            required: true,
        },
        firstLevelApproval: {
            type: 'Pointer',
            targetClass: COLLECTIONS.APPROVAL,
            required: false,
        },
        secondLevelApproval: {
            type: 'Pointer',
            targetClass: COLLECTIONS.APPROVAL,
            required: false,
        },
        status: {
            type: 'String',
            defaultValue: 'Pending Approval',
            enum: ["Pending Approval", 'Approved', 'Rejected']
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