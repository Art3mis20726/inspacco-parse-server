import { getCacheStore } from "../cache-store";
import { Request, Response, NextFunction } from 'express';
import { MASTER_KEY } from "../util/secrets";

export function currentUserMiddleware() {
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
        const sessionToken = req.get('X-Parse-Session-Token');
        const masterKey = req.get('X-Parse-Master-Key');

        if(sessionToken) {
            const session = await getSessionData(sessionToken);
            const user = session?.get('user');

            let roles = [];
            if(user) {
                roles = await getUserRoles(user);
                user.set('sessionToken', sessionToken);
            }

            req.context = {
                session: session,
                user,
                roles,
                sessionToken,
                master: false,
            };
        } else {
            req.context = { sessionToken, master: masterKey === MASTER_KEY };
        }

        next();
    };
    
}

async function getSessionData(sessionToken: string): Promise<Parse.Session | undefined> {
    const cacheStore = await getCacheStore();
    let session = await cacheStore.get<Parse.Session>(getSessionCacheKey(sessionToken));
    if(!session) {
        const query = new Parse.Query(Parse.Session);
        query.equalTo('sessionToken', sessionToken);
        session = await query.first({ useMasterKey: true });
        if(session) {
            await cacheStore.set(getSessionCacheKey(sessionToken), session);
        }
    }
    return session;
}

async function getUserRoles(user: Parse.User): Promise<Parse.Role[]> {
    const cacheStore = await getCacheStore();
    let roles = await cacheStore.get<Parse.Role[]>(getRolesCacheKey(user.id));
    if(!roles) {
        const query = new Parse.Query(Parse.Role);
        query.equalTo("users", user);
        query.select(['name']);
        roles = await query.find({ useMasterKey: true });
        if(roles) {
            await cacheStore.set(getRolesCacheKey(user.id), roles);
        }
    }
    return roles;
}

function getSessionCacheKey(sessionToken): string {
    return `__session__:${sessionToken}`;
}

function getRolesCacheKey(userId): string {
    return `__roles__:${userId}`;
}