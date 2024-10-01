//using nodejs parse platform, Parse Javascript script to remove duplicate service staff of having staff and service subscription const batchSize = 50;
const schemaName = 'ServiceStaff';

const batchSize = 50;


const seenPartnerStaff = {};
let hasMore = true;
let counter = 0;
const query = new Parse.Query(schemaName);
query.limit(batchSize); // limit to 1000 records per query to avoid memory issues
while (hasMore) {
  const results = await query.find({ useMasterKey: true });
  hasMore = results.length === batchSize;

  for (const record of results) {
    const { id: staffId } = record.get('staff');
    const { id: serviceSubscriptionid } = record.get('serviceSubscription');
    const isTemporary = record.get('isTemporary');

    const staff_servicesubscription = `${staffId}_${serviceSubscriptionid}_${isTemporary}`;

    //console.log(mobileNumber);
    // If this mobile number has already been seen, add to duplicates array
    if (seenPartnerStaff[staff_servicesubscription]) {
      console.log('staff_servicesubscription', staff_servicesubscription);
      deleteServiceStaffRecord(record.id);
    } else {
      seenPartnerStaff[staff_servicesubscription] = record.id;
    }
  }
  query.skip(++counter * batchSize);
}
function findServiceStaffById(objectId) {
  const serviceStaffQuery = new Parse.Query('ServiceStaff');
  serviceStaffQuery.equalTo('objectId', objectId);
  return serviceStaffQuery.first({ useMasterKey: true });
}
function deleteServiceStaffRecord(objectId) {
  findServiceStaffById(objectId).then((serviceStaff) => {
    serviceStaff.destroy({ useMasterKey: true }).then(() => {
      console.log(`Staff ${serviceStaff.id} destroyed`);
    });
  });
}
