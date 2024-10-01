import { COLLECTIONS, ROLES } from '../constants/common';

export async function getServiceRequestById(id: string) {
  const q = new Parse.Query(COLLECTIONS.SERVICE_REQUEST);
  return q.get(id, { useMasterKey: true });
}
