const batchSize = 10;
const schemaName = '_User';
const query = new Parse.Query(schemaName);
query.exists('mobileNumber');
query.limit(batchSize); // limit to 1000 records per query to avoid memory issues

const duplicates = [];
const seenMobileNumbers = [];
let hasMore = true;
let counter = 0;
while (hasMore) {
  const results = await query.find({ useMasterKey: true });
  hasMore = results.length === batchSize;

  for (const user of results) {
    const mobileNumber = user.get('mobileNumber');
    //console.log(mobileNumber);
    // If this mobile number has already been seen, add to duplicates array
    if (seenMobileNumbers.includes(mobileNumber)) {
      console.log(user);
      duplicates.push(user.id);
    } else {
      // Otherwise, add to the set of seen mobile numbers
      seenMobileNumbers.push(mobileNumber);
    }
  }
  query.skip((++counter) * batchSize);
}
console.log(duplicates.join(','));