function getRequirementDataAsPlainObject(requirement = "") {
  //console.log('requirement',requirement)
  try {
    let requirementData = JSON.parse(requirement)?.filter(
      (obj) => obj
    );
    const plainOBj = {};
    requirementData?.forEach(({ fields = [] }) => {
      (fields || []).forEach(({ label, value }) => {
        plainOBj[label] = value;
      });
    });
    
    return plainOBj;
  } catch (e) {
    console.log("e", e);
    return {};
  }
}
const ServiceRequest = Parse.Object.extend('ServiceRequest');
const serviceRequestQuery = new Parse.Query(ServiceRequest);
serviceRequestQuery.doesNotExist('clientFacility'); 
serviceRequestQuery.exists('society');
serviceRequestQuery.exists('requirement');
serviceRequestQuery.descending('createdAt');
serviceRequestQuery.skip(0);
serviceRequestQuery.limit(500);

// Get all service requests
const serviceRequests = await serviceRequestQuery.find({ useMasterKey: true });

for (const serviceRequest of serviceRequests) {
  console.log('serviceRequest',serviceRequest.get('displayId'));
  // Extract the 'requirement' object from the ServiceRequest
  const requirement = serviceRequest.get('requirement');
  if(!requirement){
    continue;
  }
  const parsedRequirementObj = getRequirementDataAsPlainObject(requirement);
  console.log('parsedRequirementObj',JSON.stringify(parsedRequirementObj));
  const uniqueCode = parsedRequirementObj['Facility Unique Code'] || parsedRequirementObj['Unique Code'];
  if (!uniqueCode) {
    console.log(`No requirement or uniqueCode found for ServiceRequest with ID: ${serviceRequest.id}`);
    continue;
  }
  // Query ClientFacility for a matching uniqueCode
  const ClientFacility = Parse.Object.extend('ClientFacility');
  const clientFacilityQuery = new Parse.Query(ClientFacility);
  clientFacilityQuery.equalTo('uniqueCode', uniqueCode);
  clientFacilityQuery.equalTo('client',serviceRequest.get('society'));


  const matchingFacility = await clientFacilityQuery.first({ useMasterKey: true });

  if (matchingFacility) {
    console.log(`Found matching ClientFacility with uniqueCode: ${uniqueCode} for ServiceRequest with ID: ${serviceRequest.id}`);

    // Link the ClientFacility to the ServiceRequest
    serviceRequest.set('clientFacility', matchingFacility);

    // Save the updated ServiceRequest
     await serviceRequest.save(null, { useMasterKey: true });

    console.log(`ClientFacility with ID: ${matchingFacility.id} linked to ServiceRequest with ID: ${serviceRequest.id}`);
  } else {
    console.log(`No matching ClientFacility found for uniqueCode: ${uniqueCode}`);
  }
}
