import { connect } from 'mongoose';

import {
  DATABASE_URI
} from '../util/secrets';

//main().catch(err => console.log(err));
mongooseConnect().then(()=>{ 
  console.log("Connected..."); 
}).catch((err)=>{
  console.log(err);
});

async function mongooseConnect() {
  console.log("*********** Connecting to MongoDB **********");
  await connect(DATABASE_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
