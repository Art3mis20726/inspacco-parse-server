import { COLLECTIONS, ROLES } from '../constants/common';

export async function getTaskById(taskId: string) {
  const q = new Parse.Query(COLLECTIONS.TASK);
  return await q.get(taskId, { useMasterKey: true });
}
