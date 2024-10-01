import * as Parse from 'parse/node';
import { getRoleByName } from '../../util/role';
import { COLLECTIONS, NOTIFICATION_CATEGORY, ROLES } from '../../constants/common';
import { getNextSequence } from '../../util/displayId';
import { getNotificationBody, getNotificationTitle, sendNotificationToInsapccoAdmin } from '../../util/notification';
import { compact } from 'lodash';
import { getServiceById } from '../../util/service';
import { getPartnerById } from '../../util/partner';
import { slugify } from '../../util/string';
import { map, sum } from 'lodash';
import { getSchemaQuery } from '../../util';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';

const createPartnerRole = async (partnerId: string, partnerRoleName: string) => {
  const roleName = `${partnerRoleName}__${partnerId}`;//`${ROLES.PARTNER_ADMIN}__${partnerId}`;
  const acl = new Parse.ACL();
  acl.setPublicReadAccess(true);
  acl.setRoleWriteAccess(ROLES.INSPACCO_KAM, true);
  acl.setRoleReadAccess(ROLES.INSPACCO_KAM, true);
  acl.setRoleWriteAccess(roleName, true);

  const role = new Parse.Role(roleName, acl);
  const kamRole = await getRoleByName(ROLES.INSPACCO_KAM);
  role.getRoles().add(kamRole);
  const partnerAdminRole = await role.save(null, { useMasterKey: true });

  const groupRole = await getRoleByName(partnerRoleName);
  groupRole.getRoles().add(partnerAdminRole);
  await groupRole.save(null, { useMasterKey: true });

  return partnerAdminRole;
};

function calculateAverage(obj: { [key: string]: number | string }): number {
  // Extract the values from the object
  const values: (number | string)[] = Object.values(obj);

  // Filter out non-numeric values and replace them with 0
  const numericValues: number[] = values.map(val => isNaN(Number(val)) ? 0 : Number(val));

  // Calculate the sum
  const sum: number = numericValues.reduce((acc, val) => acc + val, 0);

  // Calculate the average
  const average: number = sum / numericValues.length;

  return average;
}
export const beforeSavePartnerHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (!req.object.id) {
    const nextId = await getNextSequence(COLLECTIONS.PARTNER);
    req.object.set('displayId', nextId);
    const partner = await getSchemaQuery(COLLECTIONS.PARTNER)({ name: req.object.get('name') }, null);
    if (partner) {
      throw new Parse.Error(
        Parse.Error.VALIDATION_ERROR,
        `Partner with Same name already exists`
      );
    }
  }

  //let partnerObject: any = await getPartnerById(req.object.id);
  const partnerObject = req.object;
  const services = partnerObject.get('services');
  if (services) {
    const serviceNames = await Promise.all(map(services, async function (serviceData) {
      try {
        const serviceObject: any = await getServiceById(serviceData.id);
        return serviceObject.get('name');
      } catch (e) {
        console.log(e);
        return '';
      }
    }));
    req.object.set({ serviceNames: serviceNames.join(',') });
  }

  if (!partnerObject.get('slug')) {
    const partnerName = partnerObject.get('name');
    let slug = slugify(partnerName);

    const Partner = Parse.Object.extend('Partner');
    const query = new Parse.Query(Partner);
    query.equalTo("slug", slug);
    const count = await query.count({ useMasterKey: true });
    if (count > 0) {
      slug = `${slug}-${count + 1}`;
    }
    req.object.set({
      slug: slug
    });
  }

  const address = partnerObject.get('address');
  if (address) {
    req.object.set({
      fullAddress: compact([
        address.addressLine1,
        address.addressLine2,
        address.area,
        address.city,
        address.state,
        address.pincode,
      ]).join(', ')
    });
  }
  const ratingParameters = req.object.get('ratingParameters');
  if (ratingParameters) {
    const averageRating = calculateAverage(ratingParameters);
    req.object.set({
      rating: averageRating
    });
  }
  req.object.set({
    rankingScore: Math.round(calculateRankingScore(partnerObject))
  });
  req.context = {
    operation: req.object.id ? 'UPDATE' : 'CREATE',
  };
};

function calculateRankingScore(partnerObject): number {
  const profileScore: number = getScoreOnProfile(partnerObject);
  //console.log("ProfileScore: "+profileScore)
  const expScore: number = getScoreOnExperienceAndClients(partnerObject);
  //console.log("ExpScore: "+expScore)
  const inspaccoRatingScore: number = getScoreOnInspaccoRating(partnerObject);
  //console.log("InspaccoRatingScore: "+inspaccoRatingScore)
  const packageScore: number = getScoreOnPackage(partnerObject);
  //console.log("PackageScore: "+packageScore)
  return (profileScore / 5 + expScore / 10 + inspaccoRatingScore / 5 + packageScore / 2);
}

function getScoreOnProfile(partnerObject): number {
  const scoresForProfileDetails = {
    description: 2,
    logoName: 1,
    estd: 1,
    photos: 2,
    numberOfClients: 1,
    annualTurnover: 1,
    verified: 1
  };
  const points = map(scoresForProfileDetails, function (points, field) {
    return !!partnerObject.get(field) ? points : 0;
  });
  return sum(points);
}

function getScoreOnExperienceAndClients(partnerObject): number {
  const exp = partnerObject.get('experience');
  const numberOfClients = partnerObject.get('numberOfClients');
  if (exp < 5 && numberOfClients > 20) {
    return 10;
  } else if (exp < 5 && numberOfClients > 10) {
    return 8;
  } else if (exp < 5 && numberOfClients < 10) {
    return 5;
  } else if (exp > 5 && numberOfClients > 50) {
    return 10;
  } else {
    return 8;
  }
}

function getScoreOnInspaccoRating(partnerObject): number {
  return partnerObject.get('rating') || 0;
}

function getScoreOnPackage(partnerObject): number {
  switch (partnerObject.get('package')) {
    case 'free':
      return 0;
    case 'basic':
      return 8;
    case 'premium':
      return 10;
    default:
      return 0;
  }
}

export const afterSavePartnerHandler = (req: Parse.Cloud.AfterSaveRequest) => {
  (async () => {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    if (req.context['operation'] == 'CREATE') {
      const partnerAdminRole = await createPartnerRole(req.object.id, ROLES.PARTNER_ADMIN);
      const partnerStaffRole = await createPartnerRole(req.object.id, ROLES.PARTNER_STAFF);
      const partnerKamRole = await createPartnerRole(req.object.id, ROLES.PARTNER_KAM);


      const acl = new Parse.ACL();
      acl.setPublicReadAccess(true);
      acl.setRoleWriteAccess(partnerAdminRole, true);
      req.object.setACL(acl);

      await req.object.save(null, { useMasterKey: true });

      const title = getNotificationTitle('PARTNER_ONBOARD');
      const body = getNotificationBody('PARTNER_ONBOARD', {
        partner: req.object.get('name'),
        name: compact([req.user?.get('firstName'), req.user?.get('lastName')]).join(' ')
      });
      sendNotificationToInsapccoAdmin(req, title, body, NOTIFICATION_CATEGORY.onBoarding);
    }
  })();
};
export const afterDeletePartnerHandler = async (req: Parse.Cloud.AfterDeleteRequest) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const partner = req.object;
  const subscriptionsQuery = new Parse.Query(COLLECTIONS.SERVICE_SUBSCRIPTION);
  subscriptionsQuery.equalTo("partner", partner);
  const subscriptions = await subscriptionsQuery.find({ useMasterKey: true });
  const partnerMemberQuery = new Parse.Query(COLLECTIONS.PARTNER_MEMBER);
  partnerMemberQuery.equalTo("partner", partner);
  const partnerMembers = await partnerMemberQuery.find({ useMasterKey: true });
  await Parse.Object.destroyAll(subscriptions, { useMasterKey: true });
  await Parse.Object.destroyAll(partnerMembers, { useMasterKey: true });
};
