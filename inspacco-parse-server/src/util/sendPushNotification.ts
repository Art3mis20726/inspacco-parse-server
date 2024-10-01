import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { User } from 'parse';


import { FIREBASE_SERVER_KEY } from './secrets';
import rollbar from './rollbar';

const FCM = require('fcm-node');
const serverKey = FIREBASE_SERVER_KEY; //put your server key here
const fcm = new FCM(serverKey);

export const sendFirebaseNotification = async(
  user: User,
  title: string,
  body: string,
  data?: Record<string,unknown>
  ) => {

    // const parseUser = Parse.User.createWithoutData(user);
const expoPushTokens = await getPushNotificationToken(user);
for (const expoPushToken of expoPushTokens) {
  const pushToken = expoPushToken.get('token');

  
  const message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: pushToken, 
    notification: {
      title: title, 
      body: body,
      sound : "default", 
      badge: "1"
    },
    
    data: {  //you can send only notification or only data(or include both)
      data
    }
  };
  
  if(!JSON.stringify(pushToken).includes("ExponentPushToken")){
    console.log("FCM PUSH TOKEN", pushToken);
    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });
  }
}
};


export default async function SendPushNotification(
  user: User,
  title: string,
  body: string,
  data?: Record<string,unknown>
) {
  console.log("==================# USER OBJECT #================\n",user);
  try {
    const expoPushTokens = await getPushNotificationToken(user);
    for (const expoPushToken of expoPushTokens) {
      const pushToken = expoPushToken.get('token');
      const message: ExpoPushMessage = {
        to: pushToken,
        sound: 'default',
        title: title,
        body: body,
      };
      if (data) {
        message.data = data;
      }
      const expo = new Expo();
      expo.sendPushNotificationsAsync([message]);
    }
  } catch (error) {
    rollbar.error(`${user} Push notification Token ${error.message}`)
    throw error;
  }
}

async function getPushNotificationToken(user: User) {
  try {
    console.log("USER OBJECT ID=========>", user);
    
    const ExpoPushToken = Parse.Object.extend('ExpoPushToken');
    const query = new Parse.Query(ExpoPushToken);
    query.equalTo('user', user);
    const expoPushTokenRecords = await query.findAll({ useMasterKey: true });
    return expoPushTokenRecords;
  } catch (error) {
    rollbar.error(`${user} push notification token ${error.message}`)
    return [];
  }
}


// async function getPushNotificationTokenForFirebase(user: User) {
//   try {
//     console.log("USER OBJECT ID FOR FIREBASE=========>", user);
    
//     const ExpoPushToken = Parse.Object.extend('ExpoPushToken');
//     const query = new Parse.Query(ExpoPushToken);
//     query.equalTo('user', user);
//     const expoPushTokenRecords = await query.findAll({ useMasterKey: true });
//     return expoPushTokenRecords;
//   } catch (error) {
//     return [];
//   }
// }
