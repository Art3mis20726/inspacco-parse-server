import { Request, Response, NextFunction } from 'express';


const FETCH_USER_BY_MOBILE_OPERATION = 'getUsersByMobileNumber';
const FETCH_USER_BY_MOBILE_OPERATION_QUERY = 'users(where: {mobileNumber: {equalTo: $mobileNumber}})';

const CODE_GENERATION_OPERATION = 'callCloudeCode';
const CODE_GENERATION_OPERATION_QUERY = 'callCloudCode(input: {functionName: generateOtp, params: $params})';

const CODE_VERIFFICATION_OPERATION = 'LoginWithPhoneAuth';
const CODE_VERIFFICATION_OPERATION_QUERY = 'logInWith(input: {authData: $authData})';

const GET_USER_ROLE_OPERATION = 'getUserRoles';
const GET_USER_ROLE_OPERATION_QUERY = 'roles(first: 100000, where: {users: {have: {objectId: {equalTo: $user}}}})';

const CREATE_USER_OPERATION = 'CreateUser';
const CREATE_USER_OPERATION_QUERY = 'createUser(';


export function authenticateMiddleware() {
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
        if(shouldValidate(req)) {
            const sessionToken = req.context?.sessionToken;
            const session = req.context?.session;
            const user = req.context?.user;
            const isMaster = req.context?.master || false;

            if (!isMaster && !sessionToken) {
                res.status(401).json({ error: 'Missing headers' });
                return;
            } else if(!isMaster && (!session || !user)) {
                res.status(401).json({ error: 'Invalid session token' });
                return;
            }
        } 
        next();
    };
    
}

function shouldValidate(req: Request): boolean {
    const sessionToken = req.context?.sessionToken;
    const isMaster = req.context?.master || false;

    const validate = !sessionToken && 
                        !isMaster && 
                        isGraphQLRequest(req.originalUrl) && 
                        !isFetchUserByMobileNumebrRequest(req) && 
                        !isCodeGenerationRequest(req) &&
                        !isCodeVerificationRequest(req) &&
                        !isGetUserRoleRequest(req) &&
                        !isCreateUserRequest(req);
    return validate;
}

function isGraphQLRequest(originalPath: string): boolean {
    return originalPath === '/graphql';
}

function isFetchUserByMobileNumebrRequest(req: Request) {
    const body = req.body;
    return body && body.operationName && body.operationName === FETCH_USER_BY_MOBILE_OPERATION && body.query && body.query.trim().includes(FETCH_USER_BY_MOBILE_OPERATION_QUERY);
}

function isCodeGenerationRequest(req: Request) {
    const body = req.body;
    return body && body.operationName && body.operationName === CODE_GENERATION_OPERATION && body.query && body.query.trim().includes(CODE_GENERATION_OPERATION_QUERY);
}

function isCodeVerificationRequest(req: Request) {
    const body = req.body;
    return body && body.operationName && body.operationName === CODE_VERIFFICATION_OPERATION && body.query && body.query.trim().includes(CODE_VERIFFICATION_OPERATION_QUERY);
}

function isGetUserRoleRequest(req: Request) {
    const body = req.body;
    return body && body.operationName && body.operationName === GET_USER_ROLE_OPERATION && body.query && body.query.trim().includes(GET_USER_ROLE_OPERATION_QUERY);
}

function isCreateUserRequest(req: Request) {
    const body = req.body;
    return body && body.operationName && body.operationName === CREATE_USER_OPERATION && body.query && body.query.trim().includes(CREATE_USER_OPERATION_QUERY);
}