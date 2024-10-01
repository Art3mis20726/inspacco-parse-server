import { get } from 'lodash';
import { GET_TASKS_STATUS } from '../../graphql/queries/getTasksByDate';
import executeGraphql from '../../../util/graphqlClient';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

const getListOfTasks = async (req: Parse.Cloud.FunctionRequest) => {
  const { startDate, endDate } = req.params;
  const taskStatus = await executeGraphql(req.user, GET_TASKS_STATUS, {
    startDate,
    endDate,
  });

  return get(taskStatus, 'data.taskActivities.edges');
};
async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const counts = {};
  const getTaskStatus = await getListOfTasks(req);
  const getStatus = getTaskStatus.map((status) => status.node.taskStatus);
  getStatus.forEach((ele) => (counts[ele] = (counts[ele] || 0) + 1));
  return Object.keys(counts).length !== 0 ? counts : null;
}

export const getTask = {
  execute,
};
