import { has } from 'lodash';
import * as Parse from 'parse/node';
import { getPhoneAuthRecord, updatePhoneAuthRecord } from './phoneAuth';
import { getCacheStore } from '../cache-store';
import rollbar from './rollbar';

export function getUserByUserName(username: string): Promise<Parse.User> {
  const q = new Parse.Query(Parse.User);
  q.equalTo('username', username);
  return q.first({ useMasterKey: true });
}

export function getUserById(objectId: string): Promise<Parse.User> {
    const q = new Parse.Query(Parse.User);
  return q.get(objectId, {
      useMasterKey: true,
    });
}

export async function getUsersByIds(userIds:Array<string>):Promise<any[]>{
  try {
    const User = Parse.Object.extend("_User");
    const query = new Parse.Query(User);
    query.containedIn("objectId",userIds);
    const  users = await query.findAll({useMasterKey:true});
    return users;
  } catch (error) {
    rollbar.error(`Error while getting userID ${userIds} ${error.message}`);
    return Promise.resolve([]);
  }
}

export async function getUser(mobileNumber: string) {
  try {
    const UserObject = Parse.Object.extend('_User');
    const query = new Parse.Query(UserObject);
    query.equalTo('mobileNumber', mobileNumber);
    return await query.first({ useMasterKey: true });
  } catch (error) {
    rollbar.error(` User not found with number -> ${mobileNumber} ${error.message}`)
    throw new Parse.Error(Parse.Error.INVALID_QUERY, error);
  }
}

export async function linkUser(
  mobileNumber: string,
  otp: string,
  otherAttribuites?: any
) {
  const phoneAuth = await getPhoneAuthRecord(mobileNumber);
  await updatePhoneAuthRecord(mobileNumber, otp, phoneAuth);
  const userAuthData = {
    authData: {
      id: mobileNumber,
      otp: otp,
    },
  };
  try {
    const user = new Parse.User();
    user.setUsername(mobileNumber);
    user.set('mobileNumber', mobileNumber);
    if (otherAttribuites) {
      if (has(otherAttribuites, 'createdBy')) {
        user.set('createdBy', otherAttribuites.createdBy);
      }
      if (has(otherAttribuites, 'firstName')) {
        user.set('firstName', otherAttribuites.firstName);
      }
      if (has(otherAttribuites, 'lastName')) {
        user.set('lastName', otherAttribuites.lastName);
      }
      if (has(otherAttribuites, 'email')) {
        user.set('email', otherAttribuites.email);
      }
      if (has(otherAttribuites, 'profilePicture')) {
        user.set('profilePicture', otherAttribuites.profilePicture);
      }
    }
    const createdUser = await user.linkWith('phoneAuth', userAuthData);
    return createdUser;
  } catch (error) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, error);
  }
}

export async function setUserForCloudFunctionAndTriggersIfRequired(req: { user?: Parse.User, master?: boolean, headers?: any }): Promise<void> {
  const isMaster = req.master;

  if(!req.user && isMaster) {
    const headers = req.headers;
    const sessionToken = headers?.['x-inspacco-user-session-token'];
    const userId = headers?.['x-inspacco-user-id'];

    if(sessionToken && userId) {
      const user = await getAndValidateUserBySessionId(userId, sessionToken);
      req.user = user;
      req.master = false;
    }
  }
} 

async function getAndValidateUserBySessionId(userId: string, sessionId: string): Promise<Parse.User> {
  const cacheStore = await getCacheStore();
  let user = await cacheStore.get<Parse.User>(getUserSessionCacheKey(userId, sessionId));
  if(!user) {
    const q = new Parse.Query(Parse.User);
    user = await q.get(userId, {
      useMasterKey: true,
    });
    
    if(user) {

      if(user.id !== userId) {
        throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'User does not match with session token');
      }

      user.set('sessionToken', sessionId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (user as any).useMasterKey = true;
      await cacheStore.set(getUserSessionCacheKey(userId, sessionId), user, 30 * 1000);
    }
  }
  return user;
}

function getUserSessionCacheKey(userId: string, sessionId: string): string {
  return `__user__:${userId}:__session__:${sessionId}`;
}