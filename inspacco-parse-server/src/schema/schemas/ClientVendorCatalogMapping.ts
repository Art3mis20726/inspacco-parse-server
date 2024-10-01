import { COLLECTIONS } from "../../constants/common";

export const ClientVendorCatalogMapping = {
    className: 'ClientVendorCatalogMapping',
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
        society: {
            type: 'Pointer',
            targetClass: COLLECTIONS.SOCIETY,
            required: true,
        },
        partner: {
            type: 'Pointer',
            targetClass: COLLECTIONS.PARTNER,
            required: true,
        },
       approvalRequired:{
         type:'Boolean',
         defaultValue: false
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
        partner_society: { partner: 1, society: 1}
    },
};