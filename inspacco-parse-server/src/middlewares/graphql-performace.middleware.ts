import { Request, Response, NextFunction } from 'express';
import { executeGraphqlWithOperationName } from '../util/graphqlClient';

const ALLOWED_ROLES = ['INSPACCO_ADMIN', 'INSPACCO_KAM'];

export function graphqlPerformanceMiddleware() {
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {

        const useMasterKey = shouldUseMasterKey(req);
        if(useMasterKey) {
            const user = req.context?.user;
            const query = req.body.query;
            const params = req.body.variables;
            const operationName = req.body.operationName;

            const data = await executeGraphqlWithOperationName(user, query, params, operationName, true);

            res.json(data);
            return;
        }
        next();
    };
}

function shouldUseMasterKey(req: Request): boolean {
    const originalPath = req.originalUrl;
    const roles = req.context?.roles || [];
    const body = req.body;

    return !isMaster(req) && isGraphQLRequest(originalPath) && hasAnyRoles(roles) && hasJsonBody(body); // && isQueryRequest(body);
}

function isGraphQLRequest(originalPath: string): boolean {
    return originalPath === '/graphql';
}

function hasAnyRoles(roles: Parse.Role[]): boolean {
    const rolesNames = roles.map(role => role.get('name'));
    return ALLOWED_ROLES.some(role => rolesNames.includes(role));
}

function hasJsonBody(body: {[key: string]: any}): boolean {
    return body && typeof body === 'object' && Object.keys(body).length > 0;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isQueryRequest(body: {[key: string]: any}): boolean {
    return body && body.query && body.query.trim().startsWith('query'); 
}

function isMaster(req: Request): boolean {
    return !!req.context?.master;
}