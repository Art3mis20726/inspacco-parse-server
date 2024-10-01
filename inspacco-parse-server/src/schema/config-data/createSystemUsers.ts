import { has, size } from 'lodash';
import { getPhoneAuthRecord, updatePhoneAuthRecord } from '../../util/phoneAuth';
import { getRoleByName } from '../../util/role';
import { IUser, SYSTEM_USERS } from './data/SystemUsers';
import rollbar from '../../util/rollbar';

export  const createSystemUsers = async () =>{
 console.log('------------- Import System Users ----------------');
  for await (const user of SYSTEM_USERS) {
    await _createUser(user);
  }
};

const _createUser = async (user: IUser) => {
  const isUserPresent = await getUser(user.username);
  if (size(isUserPresent)) {
    
    console.log(`User ${user.firstName} ${user.lastName} is already exist.`);
    return;
  } else {
    const createdUser = await linkUser(user);
    await associateUserWithRole(createdUser,user.role);
    console.log("  ");
    console.log(
      ` ++ User ${user.firstName} ${user.lastName} is created with role ${user.role}`
    );
    return;
  }
};

const linkUser = async (systemUser: IUser) => {
const otp = "2021";
const phoneAuth = await getPhoneAuthRecord(systemUser.mobileNumber);
await updatePhoneAuthRecord(systemUser.mobileNumber,otp,phoneAuth);
  const userAuthData = {
    authData: {
      id: systemUser.mobileNumber,
      otp: otp,
    },
  };
  try {
    const user = new Parse.User();
    user.setUsername(systemUser.username);
    user.set('mobileNumber', systemUser.mobileNumber);
    user.set('firstName', systemUser.firstName);
    user.set('lastName', systemUser.lastName);
    if (has(systemUser.email, 'email')) {
      user.set('email', systemUser.email);
    }
    const createdUser = await user.linkWith('phoneAuth', userAuthData);
    return createdUser;
  } catch (error) {
    rollbar.error(`${userAuthData.authData.id} Phone number not updated ${error.message}`)
    throw new Parse.Error(Parse.Error.INVALID_QUERY, error);
  }
};

const associateUserWithRole = async (newUser:Parse.User,userRole: 'ROOT' | 'INSPACCO_ADMIN' = null) => {
  if (!userRole) {
    return;
  }
  if(size(newUser)){
    const roleRecord:Parse.Role = await getRoleByName(userRole);
    if(roleRecord){
      roleRecord.getUsers().add(newUser);
      await roleRecord.save(null, { useMasterKey: true });
    }
  }
};

async function getUser(username: string) {
  try {
    const UserObject = Parse.Object.extend('_User');
    const query = new Parse.Query(UserObject);
    query.equalTo('username', username);
    return await query.first({ useMasterKey: true });
  } catch (error) {
    throw new Parse.Error(Parse.Error.INVALID_QUERY, error);
  }
}
