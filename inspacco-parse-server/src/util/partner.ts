import { COLLECTIONS } from '../constants/common';

export async function getPartnerAdmin(partnerId: string) {
  const q = new Parse.Query(COLLECTIONS.PARTNER_MEMBER);
  const PartnerClass: Parse.ObjectStatic = Parse.Object.extend(
    COLLECTIONS.PARTNER
  );
  q.equalTo('partner', PartnerClass.createWithoutData(partnerId)); //
  q.equalTo('type', 'PARTNER_ADMIN');
  q.include('member');
  const admins = await q.findAll({
    useMasterKey: true,
  });
  return admins.map((doc) => doc.get('member'));
}

export async function getPartnerById(partnerId: string) {
  const q = new Parse.Query(COLLECTIONS.PARTNER);
  q.include('services');
  return q.get(partnerId, { useMasterKey: true });
}
export async function getPartnerByName(partnerName: string) {
  const q = new Parse.Query(COLLECTIONS.PARTNER);
  q.equalTo('name', partnerName);
  return q.first({ useMasterKey: true });
}
