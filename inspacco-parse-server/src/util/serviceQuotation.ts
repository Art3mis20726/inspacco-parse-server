import { COLLECTIONS, ROLES } from '../constants/common';

export async function getServiceQuotationById(id: string) {
  const q = new Parse.Query(COLLECTIONS.SERVICE_QUOTATION);
  return q.get(id, { useMasterKey: true });
}
