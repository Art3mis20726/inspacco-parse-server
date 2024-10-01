import { MongoClient } from 'mongodb';
import { DATABASE_URI } from './secrets';

let _client: MongoClient = null;

async function connect() {
  try {
    _client = await MongoClient.connect(DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return _client;
  } catch (error) {
    console.error(error);
    throw new Error('######## Error in connecting to db ########');
  }
}
const mongodb = {
  connect,
  client: () => {
    return _client;
  },
};

export default mongodb;
