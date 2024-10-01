import { COLLECTIONS, ROLES } from '../constants/common';

export async function getServiceSubscriptionScheduleById(id: string) {
  const q = new Parse.Query(COLLECTIONS.SERVICE_SUBSCRIPTION_SCHEDULE);
  return q.get(id, { useMasterKey: true });
}
