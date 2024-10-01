// Define the PartnerStaff class
const batchSize = 100;

const getSaveOrQueryOption = (user) => {
  let option = user && !user.useMasterKey
    ? { sessionToken: user.getSessionToken() }
    : { useMasterKey: true };
  return option;
};
function createRecord(schemaname) {
  return (obj, user) => {
    const Schema = Parse.Object.extend(schemaname);
    const schema = new Schema();
    return schema.save(obj, getSaveOrQueryOption(user));
  };
}
// Create a query for PartnerStaff where user is empty
const PartnerStaff = Parse.Object.extend('PartnerStaff');
const query = new Parse.Query(PartnerStaff);
query.doesNotExist('user');
query.exists('mobileNumber');
query.notEqualTo('mobileNumber','NA');
let partnerStaffList = await query.find({ useMasterKey: true });

let counter = 0;
while (partnerStaffList.length > 0 && counter < 10) {
    counter++;
  const mobileNumberList = partnerStaffList
    .map((partnerStaff) => partnerStaff.get('mobileNumber'))
    .filter((v) => /^[6789]\d{9,10}$/.test(v));

  // Create a query for User where mobileNumber is in mobileNumberList
  const userQuery = new Parse.Query(Parse.User);
  userQuery.containedIn('mobileNumber', mobileNumberList);

  // Find the User records
  const userList = await userQuery.find({ useMasterKey: true });
  // Create a map of mobileNumber to User
  const userMap = {};
  userList.forEach((user) => {
    userMap[user.get('mobileNumber')] = user;
  });

  // Update PartnerStaff with the corresponding User
  for (const partnerStaff of partnerStaffList) {
    const mobileNumber = partnerStaff.get('mobileNumber');
    if (userMap[mobileNumber] && /^[6789]\d{9,10}$/.test(mobileNumber)) {
      partnerStaff.set('user', userMap[mobileNumber]);
      console.log('staff', partnerStaff.get('mobileNumber'));
       await partnerStaff.save(null, { useMasterKey: true });
    } else if (/^[6789]\d{9,10}$/.test(mobileNumber)) {

      const obj = {
        firstName:partnerStaff.get('firstName'),
        lastName: partnerStaff.get('lastName'),
        mobileNumber,
        username:mobileNumber,
        password:' ',
        totalRewardPoints: 0,
        profilePicture:partnerStaff.get('profileImage')
      };
      const user = await createRecord('_User')(obj);
      console.log(` user ${user.get('mobileNumber')} created`);
      partnerStaff.set('user', user);
      await partnerStaff.save(null, { useMasterKey: true });
    }
  }
  query.skip(batchSize);
  partnerStaffList = await query.find({ useMasterKey: true });
}
// Find the PartnerStaff records

// Create a list of mobile numbers from partnerStaffList