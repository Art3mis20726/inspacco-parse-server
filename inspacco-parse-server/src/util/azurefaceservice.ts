import rollbar from "./rollbar";

const subscriptionKey = process.env.AZURE_FACE_SUBSCRIPTION_KEY || '7ac29dbe77c744428c989bc98c8c384a';
const personGroupId = 'inspacco_users';
const azureFaceEndpooint = process.env.AZURE_FACE_ENDPOINT;
console.log('azureFaceEndpooint',azureFaceEndpooint);
console.log('subscriptionKey',subscriptionKey);
const axios = require('axios');

const config = {
  headers: {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Content-Type': 'application/json',
  },
};
export async function createPersonGroup(groupName) {
  try {
    const requestBody = {
      name: groupName,
    };
    const response = await axios.put(
      `${azureFaceEndpooint}/persongroups/${personGroupId}`,
      requestBody,
      config
    );
    console.log('Person group created:', response.data);
  } catch (error) {
    rollbar.error(`${groupName} Person group not created ${error.message}`)
    console.error('Error:', error);
  }
}
export async function createPerson(personName, userId) {
  try {
    const requestBody = {
      name: personName,
      userData: userId,
    };

    const response = await axios.post(
      `${azureFaceEndpooint}/persongroups/${personGroupId}/persons`,
      requestBody,
      config
    );
    console.log('Person created:', response.data);
    return response.data.personId;
  } catch (error) {
    rollbar.error(`${userId} error while creating user ${error.message}`)
    console.error('Error:', error.message);
    return null;
  }
}

export async function addFaceToPerson( personId, imageUrl) {
  try {
    const requestBody = {
      url: imageUrl,
    };

    const response = await axios.post(
      `${azureFaceEndpooint}/persongroups/${personGroupId}/persons/${personId}/persistedFaces`,
      requestBody,
      config
    );
    console.log('Face added to person:', response.data);
   await trainPersonGroup();
  } catch (error) {
    rollbar.error(`${personId} Face not added ${error.message}`)
    console.error('Error:', error.message);
  }
}

export async function trainPersonGroup() {
  try {
    await axios.post(
      `${azureFaceEndpooint}/persongroups/${personGroupId}/train`,
      {},
      config
    );
    console.log('Training started for the person group.');
  } catch (error) {
    rollbar.error(`${personGroupId}  person ${error.message}`)
    console.error('Error:', error.message);
  }
}

export async function detectFace(imageUrl) {
  try {
    const requestBody = {
      url: imageUrl,
    };

    const response = await axios.post(
      `${azureFaceEndpooint}/detect`,
      requestBody,
      config
    );
    if (response.data.length === 0) {
      console.log('No face detected in the provided image.');
      return null;
    }

    const faceId = response.data[0].faceId;
    console.log('Face detected:', response.data[0]);
    return faceId;
  } catch (error) {
    rollbar.error(`${imageUrl} image Face not detected ${error.message}`)
    console.error('Error:', error.message);
    return null;
  }
}

export async function identifyFace( faceId) {
  try {
    const requestBody = {
      faceIds: [faceId],
      personGroupId: personGroupId,
      confidenceThreshold: 0.5,
      maxNumOfCandidatesReturned: 1,
    };
    console.log(requestBody);
    const response = await axios.post(
      `${azureFaceEndpooint}/identify`,
      requestBody,
      config
    );
    if (
      response.data.length === 0 ||
      !response.data[0].candidates ||
      response.data[0].candidates.length === 0
    ) {
      console.log('No match found in the dataset for the provided face.');
      return null;
    }

    const candidate = response.data[0].candidates[0];
    console.log('Face identified:', candidate);
    console.log('Person ID:', candidate.personId);
    console.log('Confidence:', candidate.confidence);
    return candidate.personId;
  } catch (error) {
    rollbar.error(`${faceId} Id failed while detecting the face ${error.message}`)
    console.error('Error:', error.stack);
    return null;
  }
}

createPersonGroup('Inspacco Users').then(()=>{
    console.log(`Azure Face Group Created ${personGroupId}`);
});
trainPersonGroup().then(()=>{
    console.log('Train Group done');
});