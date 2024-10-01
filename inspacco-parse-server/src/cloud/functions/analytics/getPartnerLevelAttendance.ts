import { get } from 'lodash';
import { GET_TASKS_STATUS } from '../../graphql/queries/getTasksByDate';
import executeGraphql from '../../../util/graphqlClient';
import { GET_PARTNER_LEVEL_TASKS_STATUS } from '../../graphql/queries/getPartnerLevelTaskByDate';
import { GET_PARTNER_LEVEL_INCIDENT_STATUS } from '../../graphql/queries/getPartnerLevelIncidentByDate';
import { GET_PARTNER_LEVEL_ATTENDACE_STATUS } from '../../graphql/queries/getPartnerLevelAttendanceByDate';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

const getListOfattendace = async (req: Parse.Cloud.FunctionRequest) => {
  const { startDate, endDate, selectedSociety, selectedPartner} = req.params;
  const taskStatus = await executeGraphql(req.user, GET_PARTNER_LEVEL_ATTENDACE_STATUS, {
    startDate,
    endDate,
    selectedSociety,
    selectedPartner
  });

  return get(taskStatus, 'data.attendances.edges');
};
async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const counts = {};
  const getTaskStatus = await getListOfattendace(req);
  const getStatus = getTaskStatus.map((service) => service.node.serviceStaff.serviceSubscription.service.name);
  getStatus.forEach((ele) => (counts[ele] = (counts[ele] || 0) + 1));
  return Object.keys(counts).length !== 0 ? counts : null;
}

export const getPartnerLevelAttendaces = {
  execute,
};
