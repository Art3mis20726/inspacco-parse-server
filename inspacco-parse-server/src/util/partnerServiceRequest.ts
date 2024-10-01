import { COLLECTIONS, ROLES } from '../constants/common';

export async function getPartnerServiceRequestById(id: string) {
  const q = new Parse.Query(COLLECTIONS.PARTNER_SERVICE_REQUEST);
  return q.get(id, { useMasterKey: true });
}
