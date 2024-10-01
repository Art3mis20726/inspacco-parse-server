const batchSize = 50;
const schemaName = 'PartnerStaff';
const query = new Parse.Query(schemaName);

query.exists('mobileNumber');
query.notEqualTo('mobileNumber', 'NA');
query.equalTo('isDeleted',false);
query.limit(batchSize); // limit to 1000 records per query to avoid memory issues

const duplicates = [];
const seenPartnerStaff = {};
let hasMore = true;
let counter = 0;
while (hasMore) {
  const results = await query.find({ useMasterKey: true });
  hasMore = results.length === batchSize;

  for (const record of results) {
    const mobileNumber = record.get('mobileNumber');
    const partner = record.get('partner');
    
    const partner_mobilenumber = `${partner.id}_${mobileNumber}`;
    
    //console.log(mobileNumber);
    // If this mobile number has already been seen, add to duplicates array
    if (seenPartnerStaff[partner_mobilenumber]) {
        console.log('partner_mobilenumber',partner_mobilenumber);
      const find = await findServiceStaffByStaffId(
        seenPartnerStaff[partner_mobilenumber]
      );
      if (find) {
        duplicates.push(record.id);
        deletePartnerStaffRecord(record.id);
      } else {
        seenPartnerStaff[partner_mobilenumber] = record.id;

        duplicates.push(seenPartnerStaff[partner_mobilenumber]);
        deletePartnerStaffRecord(seenPartnerStaff[partner_mobilenumber]);
      }
    } else {
      seenPartnerStaff[partner_mobilenumber] = record.id;
    }
  }
  query.skip((++counter) * batchSize);
}
console.log(duplicates.join(','));
function findServiceStaffByObjectId(staffId) {
  const partnerStaffQuery = new Parse.Query(schemaName);
  partnerStaffQuery.equalTo('objectId', staffId);
  return partnerStaffQuery.first({ useMasterKey: true });
}
function findServiceStaffByStaffId(staffId) {
  const serviceStaffQuery = new Parse.Query('ServiceStaff');
  let staffPointer = {
    __type: 'Pointer',
    className: schemaName,
    objectId: staffId,
  };
  serviceStaffQuery.equalTo('staff', staffPointer);
  return serviceStaffQuery.first({ useMasterKey: true });
}
function deletePartnerStaffRecord(staffId) {
  findServiceStaffByObjectId(staffId).then((staff) => {
    staff.destroy({ useMasterKey: true }).then(() => {
      console.log(`Staff ${staff.id} destroyed`);
    });
  });
}
