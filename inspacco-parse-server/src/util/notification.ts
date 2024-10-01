import { forEach } from 'lodash';
import { GET_USERS_BY_ROLE_NAME } from '../cloud/graphql/queries/getUsersByRoleName';
import { NOTIFICATION_CATEGORY } from '../constants/common';
import { NOTIFICATION_MSG } from '../constants/notificationMessages';
import executeGraphql from './graphqlClient';
import SaveUserNotification from './saveUserNotification';
import SendPushNotification from './sendPushNotification';
import { getUsersByIds } from './user';

type Variables = {
  [name: string]: string;
};
export function getNotificationTitle(key: string, variables: Variables = {}) {
  let msg = NOTIFICATION_MSG[key].title;
  forEach(variables, (value, key) => {
    msg = msg.replace(new RegExp(`\\$${key}\\$`, 'g'), value);
  });
  return msg;
}

export function getNotificationBody(key: string, variables: Variables = {}) {
  let msg = NOTIFICATION_MSG[key].body;
  forEach(variables, (value, key) => {
    msg = msg.replace(new RegExp(`\\$${key}\\$`, 'g'), value);
  });
  return msg;
}

export async function sendNotificationToInsapccoAdmin(
  req,
  title,
  body,
  category: NOTIFICATION_CATEGORY = NOTIFICATION_CATEGORY.other,
  data?
) {
  const InspaccoAdminUsersData = await executeGraphql(
    req?.user,
    GET_USERS_BY_ROLE_NAME,
    { roleName: 'INSPACCO_ADMIN' },
    true
  );
  const InspaccoAdminUsersObj =
    InspaccoAdminUsersData.data?.roles?.edges[0]?.node?.users.edges || [];
  const adminUserIds = InspaccoAdminUsersObj.map(({ node }) => {
    return node.objectId;
  });
  const InspaccoAdminUsers = await getUsersByIds(adminUserIds);
  InspaccoAdminUsers.forEach((user) => {
    SendPushNotification(user, title, body, data);
    SaveUserNotification(user, category, title, body, data);
  });
}
