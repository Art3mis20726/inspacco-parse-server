import { COLLECTIONS } from "../../constants/common";


export const ClientFacility = {
    className: COLLECTIONS.CLIENT_FACILITY,
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
        client: {
            type: 'Pointer',
            targetClass: COLLECTIONS.SOCIETY,
            required:true
        },
        name: {
            type: 'String',
        },
        uniqueCode: {
            type: 'String',
            required:true,
        },
        facilityType: {
            type: 'String',

        },
        address: {
            type: 'String',
        },
        city: {
            type: 'String',
        },
        state: {
            type: 'String',
        },
        pincode: {
            type: 'String',
        },
        region: {
            type: 'String',
        },
        POCName: {
            type: 'String',
        },
        POCMobileNumber:{
            type: 'String',
        },
        POCEmail:{
            type: 'String',
        }
    },
    indexes: {
        objectId: { objectId: 1 },
        createdAt: { createdAt: 1 },
        updatedAt: { updatedAt: 1 },
        client: { client: 1 },
        uniqueCode: { uniqueCode: 1 },
        facilityType: { facilityType: 1 },
        uniqueCodeAndClient: { uniqueCode: 1, client: 1 },
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
};