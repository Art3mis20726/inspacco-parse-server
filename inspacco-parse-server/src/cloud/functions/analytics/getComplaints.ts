import { get } from 'lodash';
import { GET_COMPLAINTS_STATUS } from '../../graphql/queries/getComplaintsByDate';
import executeGraphql from '../../../util/graphqlClient';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

const getComplaints = async (req: Parse.Cloud.FunctionRequest) => {
  const { startDate, endDate } = req.params;
  const ComplaintStatus = await executeGraphql(
    req.user,
    GET_COMPLAINTS_STATUS,
    {
      startDate,
      endDate,
    }
  );
  return get(ComplaintStatus, 'data.incidents.edges');
};
async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const counts = {};
  const getComplaintStatus = await getComplaints(req);

  const getStatus = getComplaintStatus.map((status) => status.node.status);
  getStatus.forEach((ele) => (counts[ele] = (counts[ele] || 0) + 1));

  return Object.keys(counts).length !== 0 ? counts : null;
}

export const getComplaintsResponse = {
  execute,
};
