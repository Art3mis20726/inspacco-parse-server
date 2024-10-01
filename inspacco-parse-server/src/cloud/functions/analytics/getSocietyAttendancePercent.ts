import { get } from 'lodash';
import { GET_TASKS_STATUS } from '../../graphql/queries/getTasksByDate';
import executeGraphql from '../../../util/graphqlClient';
import { GET_PARTNER_LEVEL_TASKS_STATUS } from '../../graphql/queries/getPartnerLevelTaskByDate';
import { GET_PARTNER_LEVEL_INCIDENT_STATUS } from '../../graphql/queries/getPartnerLevelIncidentByDate';
import { GET_PARTNER_LEVEL_ATTENDACE_STATUS } from '../../graphql/queries/getPartnerLevelAttendanceByDate';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

function groupBy(arr, key) {
  return arr.reduce((acc, obj) => {
    const group = obj.get(key).id;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(obj);
    return acc;
  }, {});
}
const getAttendanceStatistics = async (startDate, endDate, societyIds,serviceSubscriptionIds) => {
  console.log('calling getAttendanceStatistics');
  const Attendance = Parse.Object.extend('Attendance');
  const ServiceStaff = Parse.Object.extend('ServiceStaff');
  const ServiceSubscription = Parse.Object.extend('ServiceSubscription');
  const Society = Parse.Object.extend('Society');

  // Define the query for Attendance schema
  const attendanceQuery = new Parse.Query(Attendance);
  attendanceQuery.greaterThanOrEqualTo('date', new Date(startDate)); // Start date of the range
  attendanceQuery.lessThanOrEqualTo('date', new Date(endDate)); // End date of the range

  // Define the query for ServiceSubscription schema
  const serviceSubscriptionQuery = new Parse.Query(ServiceSubscription);
  serviceSubscriptionQuery.containedIn('society', societyIds); // Filter by societyIds
  if(serviceSubscriptionIds && Array.isArray(serviceSubscriptionIds) && serviceSubscriptionIds.length){
    serviceSubscriptionQuery.containedIn('objectId', serviceSubscriptionIds); // Filter by societyIds
  }
  // Define the query for ServiceStaff schema
  const serviceStaffQuery = new Parse.Query(ServiceStaff);
  serviceStaffQuery.matchesQuery(
    'serviceSubscription',
    serviceSubscriptionQuery
  );

  // Combine the queries using includeKey to retrieve the associated ServiceStaff and ServiceSubscription
  // attendanceQuery.include('serviceStaff');
  attendanceQuery.matchesQuery(
    'serviceStaff',
    serviceStaffQuery
  );

  const results = await attendanceQuery.find({ useMasterKey: true });
  const partnerStaff = groupBy(results,'serviceStaff');
  const presentStaff = results;

  // Find the absent staff by comparing with the list of present staff
 
  const staff = await serviceStaffQuery.find({ useMasterKey: true });

  const totalStaffCount = staff.length;
  
  const presentStaffCount =  Object.keys(partnerStaff).length;
  const absentStaffCount = totalStaffCount - presentStaffCount;

  // Calculate Facial and Manual percentages from Attendance mode field
  const facialStaffCount = presentStaff.filter(
    (staff) => staff.get('mode') === 'facial'
  ).length;
  const manualStaffCount = presentStaff.filter(
    (staff) => staff.get('mode') === 'manual'
  ).length;

  const facialPercentage = (facialStaffCount / presentStaffCount) * 100;
  const manualPercentage = (manualStaffCount / presentStaffCount) * 100;
  console.log('presentStaffCount', presentStaffCount);
  console.log('absentStaffCount', absentStaffCount);
  console.log('facialStaffCount', facialStaffCount);
  console.log('manualStaffCount', manualPercentage);
  return {
    presentStaffCount,
    absentStaffCount,
    totalStaffCount,
    facialStaffCount,
    manualPercentage,
    facialPercentage
  };
};
const getListOfattendace = async (req: Parse.Cloud.FunctionRequest) => {
  const { startDate, endDate, societyIds,serviceSubscriptionIds=[] } = req.params;

  const statistics = await getAttendanceStatistics(startDate, endDate, societyIds,serviceSubscriptionIds);
  return statistics;
};
async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const result = await getListOfattendace(req);
  return {
    counts:result
  };
}

export const getSocietyAttendanceStats = {
  execute,
};
