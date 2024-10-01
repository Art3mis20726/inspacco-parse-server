import { getSaveOrQueryOption } from ".";
import { COLLECTIONS } from "../constants/common";

export async function getIncidentById(id: string, user: Parse.User) {
  const q = new Parse.Query(COLLECTIONS.INCIDENT);
  return await q.get(id,getSaveOrQueryOption(user));
}
