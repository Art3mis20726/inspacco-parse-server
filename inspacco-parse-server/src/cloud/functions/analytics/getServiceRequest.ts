import { get } from 'lodash';
import moment from 'moment';
import executeGraphql from '../../../util/graphqlClient';
import { GET_SERVICE_REQUEST_STATUS } from '../../graphql/queries/getServieRequestByDate';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

const getListOfRequest = async (req: Parse.Cloud.FunctionRequest) => {
  const { startDate, endDate } = req.params;
  const taskStatus = await executeGraphql(
    req.user,
    GET_SERVICE_REQUEST_STATUS,
    {
      startDate,
      endDate,
    }
  );

  return get(taskStatus, 'data.serviceRequests.edges');
};
async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const counts = {};
  const getTaskStatus = await getListOfRequest(req);

  const getStatus = getTaskStatus.map((status) => status.node.status);
  getStatus.forEach((ele) => (counts[ele] = (counts[ele] || 0) + 1));

  return Object.keys(counts).length !== 0 ? counts : null;
}

export const getServiceRequest = {
  execute,
};
