
import moment from 'moment';

import { COLLECTIONS } from '../../../constants/common';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';
import rollbar from '../../../util/rollbar';
const getServiceRequestCountByMonth = async (startDate, endDate, societyIds,serviceIds) => {
  const serviceRequestQuery = new Parse.Query(COLLECTIONS.SERVICE_REQUEST);
  serviceRequestQuery.greaterThanOrEqualTo("createdAt", startDate.toDate());
  serviceRequestQuery.lessThanOrEqualTo("createdAt", endDate.toDate());
  serviceRequestQuery.containedIn("society", societyIds);
  serviceRequestQuery.descending("createdAt");
  if(serviceIds && Array.isArray(serviceIds)){
    serviceRequestQuery.containedIn("service", serviceIds);
  }
  try {
    const results = await serviceRequestQuery.find({useMasterKey:true});

    const requestCountsByMonth = {};
    const currentMonth = moment(startDate);
    while (currentMonth.isSameOrBefore(endDate, 'month')) {
      const monthYear = currentMonth.format("MMM YY");
      requestCountsByMonth[monthYear] = 0;
      currentMonth.add(1, 'month');
    }
    // Iterate through the results and count the requests for each month
    results.forEach((request) => {
      const monthYear = moment(request.createdAt).format("MMM YY");

      if (requestCountsByMonth.hasOwnProperty(monthYear)) {
        requestCountsByMonth[monthYear]++;
      } else {
        requestCountsByMonth[monthYear] = 1;
      }
    });

    return requestCountsByMonth;
  } catch (error) {
    rollbar.error(`Error retrieving service request counts: ${error.message}`)
    console.log("Error retrieving service request counts:", error);
    throw error;
  }
};
async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const { startDate, endDate, societyIds,serviceIds } = req.params;

  const statistics = await getServiceRequestCountByMonth( moment(startDate), moment(endDate), societyIds,serviceIds);
  return statistics;
}

export const getSocietyServiceRequestMonthlyCount = {
  execute,
};
