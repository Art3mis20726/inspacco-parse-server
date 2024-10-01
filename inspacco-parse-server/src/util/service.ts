import { COLLECTIONS, ROLES } from '../constants/common';

export async function getServiceById(serviceId: string) {
  const q = new Parse.Query(COLLECTIONS.SERVICE);
  return await q.get(serviceId, { useMasterKey: true });
}
export async function getServiceByName(serviceName: string) {
  const q = new Parse.Query(COLLECTIONS.SERVICE);
  q.equalTo("name",serviceName);
  return q.first({useMasterKey:true});
}
