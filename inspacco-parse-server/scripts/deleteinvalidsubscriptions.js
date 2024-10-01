const batchSize = 200;
let skip = 0;
let hasMoreSubscriptions = true;

async function cleanupInvalidSubscriptions() {
  const ServiceSubscription = Parse.Object.extend('ServiceSubscription');
  
  // Use the master key to bypass ACLs and ensure deletion
  const query = new Parse.Query(ServiceSubscription);
  query.skip(skip).limit(batchSize).descending('createdAt');
  query.include('partner');
  query.include('society');
  

  try {
    const subscriptions = await query.find({useMasterKey:true});
    //console.log('length=>'+subscriptions.length)
    if (subscriptions.length === 0) {
      hasMoreSubscriptions = false;
      return;
    }

    for (const subscription of subscriptions) {
      const partner = subscription.get('partner');
      const society = subscription.get('society');
      //console.log('partner',partner)
      //console.log('society',society)
      // Check if partner or society exist
      let needtoDelete = false;
      if(partner){
        // console.log('partner',partner.id)
         const partnerQuery = new Parse.Query('Partner');
         partnerQuery.equalTo('objectId', partner.id);
         const count =  await partnerQuery.count({useMasterKey:true});
         if(count ==0 ){
           needtoDelete = true;
         }
      }
      if(society){
       // console.log('society',society.id)
        const societyQuery = new Parse.Query('Society');
        societyQuery.equalTo('objectId', society.id);
        const count =  await societyQuery.count({useMasterKey:true});
         if(count ==0 ){
           needtoDelete = true;
         }
      }
      

     

      if (needtoDelete) {
        // Delete the subscription if partner or society doesn't exist
        //await subscription.destroy({useMasterKey:true});
        console.log(`Deleted subscription ${subscription.id}`);
      }
    }

    if (subscriptions.length < batchSize) {
      hasMoreSubscriptions = false;
      return;
    }
   // hasMoreSubscriptions = false;
    skip += batchSize;
  } catch (error) {
    console.error('Error cleaning up subscriptions:', error);
  }
}

// Iterate through batches until no more subscriptions are found
while (hasMoreSubscriptions) {
  await cleanupInvalidSubscriptions();
}