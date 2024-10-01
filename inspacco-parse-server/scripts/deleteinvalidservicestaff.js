const batchSize = 200;
let skip = 0;
let hasMoreServiceStaff = true;

async function cleanupInvalidServiceStaff() {
  const ServiceStaff = Parse.Object.extend('ServiceStaff');

  // Use the master key to bypass ACLs and ensure deletion
  const query = new Parse.Query(ServiceStaff);
  query.skip(skip).limit(batchSize).descending('createdAt');
  query.include('partnerStaff');

  try {
    const serviceStaffRecords = await query.find({ useMasterKey: true });

    if (serviceStaffRecords.length === 0) {
      hasMoreServiceStaff = false;
      return;
    }

    for (const serviceStaff of serviceStaffRecords) {
      const partnerStaff = serviceStaff.get('staff');

      if (partnerStaff) {
        const partnerStaffQuery = new Parse.Query('PartnerStaff');
        partnerStaffQuery.equalTo('objectId', partnerStaff.id);
        const partnerStaffCount = await partnerStaffQuery.count({ useMasterKey: true });

        if (partnerStaffCount === 0) {
          // Delete the ServiceStaff record if PartnerStaff doesn't exist
          await serviceStaff.destroy({ useMasterKey: true });
          console.log(`Deleted ServiceStaff record ${serviceStaff.id}`);
        }
      }
    }

    if (serviceStaffRecords.length < batchSize) {
      hasMoreServiceStaff = false;
      return;
    }

    skip += batchSize;
  } catch (error) {
    console.error('Error cleaning up ServiceStaff records:', error);
  }
}

// Iterate through batches until no more ServiceStaff records are found
while (hasMoreServiceStaff) {
  await cleanupInvalidServiceStaff();
}
