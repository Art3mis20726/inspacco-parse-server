import { SERVICE_REQUEST_SUBSTATUS_MAP } from '../constants/common';
import { ServiceRequest } from '../models';
import AsyncLock from 'async-lock';

const lock = new AsyncLock();
export enum GraphType {
    SERVICE_SUBSTATUS = 'service_substatus',
    SERVICE_STATUS = 'service_status',
    COMPLETION_STATUS = 'completion_status',
    COUNT_BY_SERVICE = 'count_by_service',

}

export interface DashboardInputOptions {
    dateAfter?: number;
    dateBefore?: number;
    serviceIds?: string[];
    clientIds?: string[];
    graphTypes?: GraphType[];
}

const DEFAULT_GRAPHS = [
    GraphType.SERVICE_SUBSTATUS,
    GraphType.SERVICE_STATUS,
    GraphType.COMPLETION_STATUS,
    GraphType.COUNT_BY_SERVICE
];

interface ServiceRequestDocumentType {
    status: string;
    _id: string;
    serviceName: string | undefined;
}

interface DashboardData {
    subStatusCountData: { [key: string]: { serviceStatus: string, count: number} };
    serviceStatusCountData: { [key: string]: number };
    serviceNameCountData: { [key: string]: number };
    completionStatusCountData: { [key: string]: number };
    total: number;
}

export async function getDashboardData(input: DashboardInputOptions): Promise<unknown> {
    
    const graphTypes = (input && input.graphTypes) || DEFAULT_GRAPHS;
    input.graphTypes = graphTypes;

    const final: { [key in GraphType]? : unknown } = {};

    const query = getAggregateQuery(input);

    const data: DashboardData = {
        subStatusCountData: {},
        serviceStatusCountData: {},
        serviceNameCountData: {},
        completionStatusCountData: {},
        total: 0
    };

    const cursor = ServiceRequest.aggregate(query).cursor({ batchSize: 1000 }).exec();
    await cursor.eachAsync(async (doc: ServiceRequestDocumentType) => {
        data.total += 1;

        const serviceStatus = SERVICE_REQUEST_SUBSTATUS_MAP[doc.status]?.serviceStatus || 'Other';

        // set sub status count
        await lock.acquire(doc.status, async () => {
            if(!data.subStatusCountData[doc.status]) {
                data.subStatusCountData[doc.status] = { serviceStatus, count: 0 };
            }
            data.subStatusCountData[doc.status].count += 1;
        });
        
        // set service status count
        await lock.acquire(serviceStatus, async () => {
            if(!data.serviceStatusCountData[serviceStatus]) {
                data.serviceStatusCountData[serviceStatus] = 0;
            }
            data.serviceStatusCountData[serviceStatus] += 1; 
        });

        

        // set service name count if required
        if(doc.serviceName) {
            await lock.acquire(doc.serviceName, async () => {
                if(!data.serviceNameCountData[doc.serviceName]) {
                    data.serviceNameCountData[doc.serviceName] = 0;
                }
                data.serviceNameCountData[doc.serviceName] += 1; 
            });           
        }

        // set completion status count
        const completionStatuses: string[] = SERVICE_REQUEST_SUBSTATUS_MAP[doc.status]?.completionStatus || [];
        await Promise.all(completionStatuses.map(async (cStatus) => {
            await lock.acquire(cStatus, async () => {
                if(!data.completionStatusCountData[cStatus]) {
                    data.completionStatusCountData[cStatus] = 0;
                }
                data.completionStatusCountData[cStatus] += 1;
            });
        }));

    }, { parallel: 100 }); 

    const promises = [];

    if(graphTypes && graphTypes.includes(GraphType.SERVICE_SUBSTATUS)) {
        const func = async () => {
            final[GraphType.SERVICE_SUBSTATUS] = getDataForSubStatusGraph(data);
        };
        promises.push(func());
    }
    
    if(graphTypes && graphTypes.includes(GraphType.SERVICE_STATUS)) {
        const func = async () => {
            final[GraphType.SERVICE_STATUS] = getDataForServiceStatusGraph(data);
        };
        promises.push(func());
    }

    if(graphTypes && graphTypes.includes(GraphType.COMPLETION_STATUS)) {
        const func = async () => {
            final[GraphType.COMPLETION_STATUS] = getDataForCompletionStatusGraph(data);
        };
        promises.push(func());
    }

    if(graphTypes && graphTypes.includes(GraphType.COUNT_BY_SERVICE)) {
        const func = async () => {
            final[GraphType.COUNT_BY_SERVICE] = getDataForCountByServiceNameGraph(data);
        };
        promises.push(func());
    }

    await Promise.all(promises);

    return final;
}

function getAggregateQuery(input: DashboardInputOptions): unknown[] {
    const { dateAfter, dateBefore, serviceIds, graphTypes,clientIds } = input;

    // 1. Create Match Query
    const query: { [key: string]: unknown } = {};

    if (dateAfter && dateBefore) {
        query._created_at = { $gte: new Date(dateAfter), $lte: new Date(dateBefore) };
    } else if (dateAfter) {
        query._created_at = { $gte: new Date(dateAfter) };
    } else if (dateBefore) {
        query._created_at = { $lte: new Date(dateBefore) };
    }

    if(serviceIds) {
        const array = serviceIds.map((item) => `Service$${item}`);
        query._p_service = { $in: array };
    }
    if(clientIds) {
        const array = clientIds.map((item) => `Society$${item}`);
        query._p_society = { $in: array };
    }
    // 2. Create Aggregate Pipeline
    const pipeline: unknown[] = [
        { $match: query },
    ];

    if(graphTypes && graphTypes.includes(GraphType.COUNT_BY_SERVICE)) {
        pipeline.push(
            { $addFields: { serviceId: { $substr: [ "$_p_service", 8, -1]} }}
        );
        pipeline.push(
            { $lookup: {
                from: "Service",
                localField: "serviceId",
                foreignField: "_id",
                as: "service"
             }
         },
        );
        pipeline.push(
            {
                $unwind: "$service"
            }
        );
    }

    pipeline.push({
        $project: {
            _id: 1,
            status: 1,
            serviceName: '$service.name'
        }
    });
    return pipeline;
}

function getDataForSubStatusGraph(data: DashboardData) {
    const final = { data: [] };
    for (const key of Object.keys(data.subStatusCountData)) {
        const value = data.subStatusCountData[key];
        final['data'].push({
            name: key,
            displayName: SERVICE_REQUEST_SUBSTATUS_MAP[key]?.label || key,
            ...value,
        });
    }

    return final;
}

function getDataForServiceStatusGraph(data: DashboardData) {
    const final = { data: [], total: data.total };
    for (const key of Object.keys(data.serviceStatusCountData)) {
        const value = data.serviceStatusCountData[key];
        final['data'].push({
            count: value,
            serviceStatus:  key,
            percentage: ((value / data.total) * 100),
        });
    }
    return final;
}

function getDataForCompletionStatusGraph(data: DashboardData) {
    const final = { data: [], total: data.total };
    for (const key of Object.keys(data.completionStatusCountData)) {
        const value = data.completionStatusCountData[key];
        final['data'].push({
            count: value,
            completionStatus:  key,
            percentage: ((value / data.total) * 100),
        });
    }
    return final;
}

function getDataForCountByServiceNameGraph(data: DashboardData) {
    const final = { data: [] };
    for (const key of Object.keys(data.serviceNameCountData)) {
        const value = data.serviceNameCountData[key];
        final['data'].push({
            count: value,
            serviceName:  key,
        });
    }

    final['data'] = final.data.sort((item1, item2) => {
        if(item1.count === item2.count) {
            return item1.serviceName.localeCompare(item2.serviceName);
        }

        return item2.count - item1.count;
    });

    return final;
}