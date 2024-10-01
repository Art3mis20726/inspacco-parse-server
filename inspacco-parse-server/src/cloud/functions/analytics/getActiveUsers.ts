import { get, uniq } from 'lodash';
import moment from 'moment';
import executeGraphql from '../../../util/graphqlClient';
import { GET_ACTIVE_USERS } from '../../graphql/queries/getActiveUsersData';
import * as _ from 'lodash';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

const getActiveUserList = async (req: Parse.Cloud.FunctionRequest) => {
  const { startDate, endDate } = req.params;

  const activeUsers = await executeGraphql(req.user, GET_ACTIVE_USERS, {
    startDate,
    endDate,
  });

  return get(activeUsers, 'data.userActivities.edges');
};
async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const counts = {};
  const getActiveUsers = await getActiveUserList(req);
  const res = getActiveUsers.map((ele) => ele.node);

  const filteredArray = res.filter(type => type.userType !== null);
  
  const uniqueObjArray: any = [...new Map(filteredArray.map(obj => [JSON.stringify(obj.userId), obj])).values()];
  const getStatus = uniqueObjArray.map((status) =>
    status.userType !== null
      ? status.userType
          .split('__')[0]
          .toUpperCase()
          .replace('INSPACCO_', '')
          .replace('SOCIETY_', 'SOC_')
      : status.userType
  );

  getStatus
    .filter((ele) => ele !== null && ele !== '')
    .forEach((ele) => (counts[ele] = (counts[ele] || 0) + 1));
  return Object.keys(counts).length !== 0 ? counts : null;
}

export const getActiveUser = {
  execute,
};
