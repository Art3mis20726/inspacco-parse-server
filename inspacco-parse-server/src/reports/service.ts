/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISociety, Society, ActivityHistory, IService, Service, IUser, User, ServiceRequest } from '../models';

interface ServiceRequestDocumentType {
    _id: {
        _id: string;
        serviceId: string;
        userId: string;
        clientId: string;
        displayId: number;
        status: string;
        requirement: string;
    },
    activities: {
        _created_at: Date;
        value: string;
    }[];
}

export interface ReportRequest {
    dateAfter?: number | string;
    dateBefore?: number | string;
    clientIds: string[];
}

export async function getReports(request: ReportRequest): Promise<unknown> {

    const startDate = new Date(request.dateAfter);
    const endDate = new Date(request.dateBefore);

    // 1. Get Clients
    const clientsMap = await getClients(request);

    // 2. Get User ids, service ids and servicerequest ids
    const query = getQueryToFetchIds(request);
    const data = await ActivityHistory.aggregate(query);

    if(!data || data.length === 0 || !data[0].serviceRequestIds || data[0].serviceRequestIds.length === 0) {
        throw new Error("No Records found");
    }

    // 3. Get Services
    const servicesMap = await getServices(data[0].serviceIds);

    // 4. Get Users
    const usersMap = await getUsers(data[0].userIds);

    // 5. Get ServiceRequests
    const serviceRequestQuery = getQueryForServiceRequests(data[0].serviceRequestIds);
    const cursor = ServiceRequest.aggregate(serviceRequestQuery).cursor({ batchSize: 1000 }).exec();

    const finalData = [];
    await cursor.eachAsync(async (doc: ServiceRequestDocumentType) => {
        const map = {};

        const item = doc._id;
        const activities = doc.activities;

        // service request data
        map['id'] = item.displayId;
        if(item.requirement) {
            const requirements = JSON.parse(item.requirement);
            if(requirements && requirements.length > 0) {
                const requirement = requirements[0];
                const fields = requirement.fields || [];
                const referenceNumberDetails = fields.find((item) => item.name === 'referenceNumber') || {};
                if(referenceNumberDetails) {
                    map['referenceNumber'] = referenceNumberDetails['value'];
                }
            }
        }

        // service data
        const serviceObj = servicesMap[item.serviceId];
        if(serviceObj) {
            map['serviceName'] = serviceObj.name;
        }

        // user data
        const userObj = usersMap[item.userId];
        if(userObj) {
            map['owner'] = `${userObj.firstName} ${userObj.lastName}`;
        }

        // set client data
        const clientObj = clientsMap[item.clientId];
        if(clientObj) {
            map['state'] = clientObj.state;
            map['city'] = clientObj.city;
        }

        // set activities
        map['currentStatus'] = item.status;
        for(let aIndex = 0; aIndex < activities.length; aIndex++) {
            const activity = activities[aIndex];
            if(activity._created_at < endDate && !map['closingStatus']) {
                map['closingStatus'] = activity.value;
            }
            
            if(activity._created_at < startDate && !map['openingStatus']) {
                map['openingStatus'] = activity.value;
            } 
        }
        
        if(!map['openingStatus']) {
            map['openingStatus'] = 'TO_BE_WORKED_UPON';
        }

        finalData.push(map);
    }, { parallel: 100 }); 
    return finalData;
}

async function getClients(request: ReportRequest): Promise<{ [key: string]: ISociety }> {
    const clients = await Society.find({ _id: { $in: request.clientIds } });
    return clients.reduce((map, item) => { 
        map[item._id] = item;
        return map;
    }, {});
}

function getQueryToFetchIds(request: ReportRequest): any[] {
    const clientIds = request.clientIds.map((id) => `Society$${id}`);
    const startDate = new Date(request.dateAfter);
    const endDate = new Date(request.dateBefore);

    return [
        { $match: { _created_at: { $gte: startDate, $lt: endDate } } },
        { $project: { _id: 1 } },
        { $lookup: {
            from: "_Join:activityHistory:ServiceRequest",
            localField: "_id",
            foreignField: "relatedId",
            as: "relationData"
            }
        },
        { $unwind: "$relationData"},
        { $lookup: {
            from: "ServiceRequest",
            localField: "relationData.owningId",
            foreignField: "_id",
            as: "serviceRequest"
            }
        },
        { $unwind: "$serviceRequest"},
        { $match: { 'serviceRequest._p_society': {$in: clientIds } } },
        { $addFields: { serviceId: { $substr: [ "$serviceRequest._p_service", 8, -1 ]}, userId: { $substr: [ "$serviceRequest._p_requester", 6, -1 ]} }},
        { $group: { _id: 1, serviceRequestIds: { $addToSet: "$serviceRequest._id"}, serviceIds: { $addToSet: "$serviceId" }, userIds: { $addToSet: "$userId" } } }
    ];
}

async function getServices(serviceIds: string[]): Promise<{ [key: string]: IService }> {
    const services = await Service.find({ _id: { $in: serviceIds } });
    return services.reduce((map, item) => { 
        map[item._id] = item;
        return map;
    }, {});
}

async function getUsers(userIds: string[]): Promise<{ [key: string]: IUser }> {
    const users = await User.find({ _id: { $in: userIds } });
    return users.reduce((map, item) => { 
        map[item._id] = item;
        return map;
    }, {});
}

function getQueryForServiceRequests(serviceRequestIds: string[]): any[] {
    return [
        { $match: { _id: { $in: serviceRequestIds } } },
        { $addFields: { serviceId: { $substr: [ "$_p_service", 8, -1 ]}, userId: { $substr: [ "$_p_requester", 6, -1 ]}, clientId: { $substr: [ "$_p_society", 8, -1 ]} }},
        { $lookup: {
              from: "_Join:activityHistory:ServiceRequest",
              localField: "_id",
              foreignField: "owningId",
              as: "relationData"
            }
        },
        { $unwind: "$relationData"},
        { $lookup: {
              from: "ActivityHistory",
              localField: "relationData.relatedId",
              foreignField: "_id",
              as: "activity"
            }
        },
        { $unwind: "$activity"},
        { $sort: { _p_society: 1, _created_at: 1, 'activity._created_at': -1 } },
        { $group: { _id: { _id: '$_id', serviceId: '$serviceId', userId: '$userId', clientId: '$clientId', displayId: '$displayId', status: '$status', requirement: '$requirement' }, activities: { $push: "$activity" } } }
    ];
}