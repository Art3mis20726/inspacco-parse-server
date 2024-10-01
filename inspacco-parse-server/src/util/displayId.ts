import { COLLECTIONS } from '../constants/common';
import mongodb from './mongodbClient';

export async function getNextSequence(collectionName: string) {
  const collection = mongodb
    .client()
    .db()
    .collection(COLLECTIONS.DISPLAY_ID_COUNTER);
  const counterDocument = await collection.findOneAndUpdate(
    { collection: collectionName.toUpperCase() },
    {
      $inc: { counter: 1 },
    }
  );
  return counterDocument.value.counter;
}
