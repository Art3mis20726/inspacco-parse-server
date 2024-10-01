import { COLLECTIONS, ROLES } from '../constants/common';

export async function getSocietyKAMs(societyId: string) {
  const q = new Parse.Query(COLLECTIONS.SOCIETY_MEMBER);
  const SocietyClass: Parse.ObjectStatic = Parse.Object.extend(
    COLLECTIONS.SOCIETY
  );
  q.equalTo('society', SocietyClass.createWithoutData(societyId));
  q.equalTo('type', ROLES.INSPACCO_KAM);
  q.include('member');
  const KAMs = await q.findAll({
    useMasterKey: true,
  });
  return KAMs.map((doc) => doc.get('member'));
}

export async function getSocietyCDAs(societyId: string) {
  const q = new Parse.Query(COLLECTIONS.SOCIETY_MEMBER);
  const SocietyClass: Parse.ObjectStatic = Parse.Object.extend(
    COLLECTIONS.SOCIETY
  );
  q.equalTo('society', SocietyClass.createWithoutData(societyId));
  q.equalTo('type', ROLES.INSPACCO_CDA);
  q.include('member');
  const CDAs = await q.findAll({
    useMasterKey: true,
  });
  return CDAs.map((doc) => doc.get('member'));
}

export async function getSocietyAdmin(societyId: string) {
  const q = new Parse.Query(COLLECTIONS.SOCIETY_MEMBER);
  const SocietyClass: Parse.ObjectStatic = Parse.Object.extend(
    COLLECTIONS.SOCIETY
  );
  q.equalTo('society', SocietyClass.createWithoutData(societyId));
  q.equalTo('type', ROLES.SOCIETY_ADMIN);
  q.include('member');
  const admins = await q.findAll({
    useMasterKey: true,
  });
  return admins.map((doc) => doc.get('member'));
}

export async function getSocietyManager(societyId: string) {
  const q = new Parse.Query(COLLECTIONS.SOCIETY_MEMBER);
  const SocietyClass: Parse.ObjectStatic = Parse.Object.extend(
    COLLECTIONS.SOCIETY
  );
  q.equalTo('society', SocietyClass.createWithoutData(societyId));
  q.equalTo('type', ROLES.SOCIETY_MANAGER);
  q.include('member');
  const managers = await q.findAll({
    useMasterKey: true,
  });
  return managers.map((doc) => doc.get('member'));
}

export async function getSocietyById(societyId: string) {
  const q = new Parse.Query(COLLECTIONS.SOCIETY);
  return await q.get(societyId, { useMasterKey: true });
}
export async function getSocietyByName(societyName: string) {
  const q = new Parse.Query(COLLECTIONS.SOCIETY);
  q.equalTo('name', societyName);
  return q.first({ useMasterKey: true });
}
