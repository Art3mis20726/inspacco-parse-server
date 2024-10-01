import { size } from "lodash";
import { DisplayIdCounterCollections } from "./data/DisplayIdCounterCollections";


export const createDisplayIdCounterCollection = async () => {
    console.log('------------- Import DisplayId Counter Collection ----------------');
      for await (const collection of DisplayIdCounterCollections) {
        await _createDisplayIdCounterData(collection);
      }
};

 const _createDisplayIdCounterData = async (collection: string) => {
    const DisplayIdCounter = Parse.Object.extend('DisplayIdCounter');
  // Check if the collection already exists
  const isPresent = await new Parse.Query(DisplayIdCounter).equalTo('collection', collection).first({ useMasterKey: true });
  if(size(isPresent)){
     console.log(`Collection ${collection} already exists with latest counter ${isPresent.get('counter')}`);
     return;
  }else{
      const displayIdCounter = new DisplayIdCounter();
      displayIdCounter.set('collection',collection);
      displayIdCounter.set('counter',1);
      await displayIdCounter.save(null, { useMasterKey: true });
      console.log(`Collection ${collection} is created with counter 1`);
  }
 };