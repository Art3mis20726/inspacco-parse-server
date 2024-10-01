const PartnerStaff = Parse.Object.extend('PartnerStaff');
  const partnerStaffQuery = new Parse.Query(PartnerStaff);
  partnerStaffQuery.exists('profileImage');
  partnerStaffQuery.limit(3000);
  const partnerStaffList = await partnerStaffQuery.find({ useMasterKey: true });

  // Iterate over the PartnerStaff objects and update profileImage
  for (const partnerStaff of partnerStaffList) {
    const profileImage = partnerStaff.get('profileImage');
    if(profileImage){
       partnerStaff.set('profileImage', profileImage);
    try {
      await partnerStaff.save(null, { useMasterKey: true });
      console.log(`ProfileImage updated for PartnerStaff with objectId ${partnerStaff.id}`);
    } catch (error) {
      console.error(`Error updating ProfileImage for PartnerStaff with objectId ${partnerStaff.id}:`, error);
    }
    }
    // Update the profileImage field with the same value
   
  }