import { get } from 'lodash';
import { GET_APP_OPEN_COUNT } from '../../graphql/queries/getAppOpenCount';
import executeGraphql from '../../../util/graphqlClient';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

const getAppOpenCount = async (req: Parse.Cloud.FunctionRequest) => {
  const { startDate, endDate } = req.params;

  const appOpenCount = await executeGraphql(req.user, GET_APP_OPEN_COUNT, {
    startDate,
    endDate,
  });
  return get(appOpenCount, 'data.userActivities.edges');
};
async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  let counts;
  const getAppOpenStatus = await getAppOpenCount(req);

  if (getAppOpenStatus.length >= 1000 && getAppOpenStatus.length < 1000000) {
    counts = (getAppOpenStatus.length / 1000).toFixed(2) + 'k';
  } else if (getAppOpenStatus.length >= 1000000) {
    counts = (getAppOpenStatus.length / 1000000).toFixed(2) + 'M';
  } else {
    counts = getAppOpenStatus.length;
  }
  return counts;
}

export const getAppOpen = {
  execute,
};
