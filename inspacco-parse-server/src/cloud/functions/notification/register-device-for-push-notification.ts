import Expo from "expo-server-sdk";
import { setUserForCloudFunctionAndTriggersIfRequired } from "../../../util/user";
import rollbar from "../../../util/rollbar";

async function execute(
  req: Parse.Cloud.FunctionRequest,
  validator?: Parse.Cloud.Validator
) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (!req.user) {
    throw 'You are not authorized to register a device. Please login.';
  }
  
  // if (!Expo.isExpoPushToken(req.params.token)) {
  //   throw `Push token ${req.params.token} is not a valid Expo push token.`;
  // }

  const ExpoPushToken = Parse.Object.extend('ExpoPushToken');
  try {
    const query = new Parse.Query(ExpoPushToken);
    query.equalTo('token', req.params.token);
    query.equalTo('user', req.user);
    const expoPushTokenRecord = await query.first({ useMasterKey: true });
    if (expoPushTokenRecord) {
      return {
        code: 200,
        message: 'The device already registered for push notification.',
      };
    } else {
        const expoPushTokenObject = new ExpoPushToken();
        expoPushTokenObject.set("token", req.params.token);
        expoPushTokenObject.set("device", req.params.device);
        expoPushTokenObject.set("user", req.user);
        await expoPushTokenObject.save(null, { useMasterKey: true });
      return {
        code: 200,
        message: 'The device registered succesfully for push notification.',
      };
    }
  } catch (error) {
    rollbar.error(`${req.user}  failed to register device for push notification ${error.message}`);

    throw error;
  }
}

const parseValidate = {
  fields: {
    token: {
      required: true,
      type: String,
    },
    device: {
      required: true,
      type: String,
    }
  },
};
export const registerPushNotification = {
  execute: execute,
  validate: parseValidate,
};
