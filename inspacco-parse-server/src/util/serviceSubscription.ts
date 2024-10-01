import { COLLECTIONS, ROLES } from '../constants/common';

export async function getServiceSubscription(serviceSubscriptionId: string) {
  const q = new Parse.Query(COLLECTIONS.SERVICE_SUBSCRIPTION);
  return q.get(serviceSubscriptionId, { useMasterKey: true });
}
