import { has } from 'lodash';
import {
  ENVIRONMENT,
  SMS_ENTITY_ID,
  SMS_PWD,
  SMS_SENDER_ID,
  SMS_USER,
} from '../../../util/secrets';
import * as Parse from 'parse/node';
import { CONFIG, DEVELOPER_LOGINS } from '../../../constants/common';
import {
  getPhoneAuthRecord,
  updatePhoneAuthRecord,
} from '../../../util/phoneAuth';
import { getConfig } from '../../../util/config';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';
import rollbar from '../../../util/rollbar';
async function execute(
  req: Parse.Cloud.FunctionRequest,
  validator?: Parse.Cloud.Validator

) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (ENVIRONMENT !== 'production') {
    const devUsers = await getConfig(CONFIG.devUsers, true);
    if (devUsers && devUsers.includes(req.params.mobileNumber)) {
      return developerLogins(req);
    }
  }

  if (
    ENVIRONMENT !== 'production' &&
    DEVELOPER_LOGINS.includes(req.params.mobileNumber)
  ) {
    return developerLogins(req);
  }

  const mobileNumber: string = req.params.mobileNumber;
  const otp: string = Math.floor(Math.random() * 8999 + 1000).toString();
  const phoneAuthRecord = await getPhoneAuthRecord(mobileNumber);
  const otpCounter: number = phoneAuthRecord
    ? phoneAuthRecord.get('otpCounter')
    : 1;

  if (false && otpCounter >= 10) {
    //false for now
    // Add code for block User(create new column in table userStatus & userLastBlockedTime);
    throw new Parse.Error(
      Parse.Error.VALIDATION_ERROR,
      'Multiple Otp has been generated.Your account is disabled temprory.'
    );
  }

  const smsStatusText: string = await sendSMS(mobileNumber, otp);
  const isNewUser: boolean = await updatePhoneAuthRecord(
    mobileNumber,
    otp,
    phoneAuthRecord
  );

  return {
    code: 200,
    message: 'otp has been generated succesfully.',
    isNewUser: isNewUser,
    smsStatus: smsStatusText ? smsStatusText : 'Error',
  };
}

async function sendSMS(mobileNumber: string, otp: string) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const message: string = `Dear Customer, Your OTP for login is ${otp}, use this OTP to validate the login - Prophandy Technologies Pvt Ltd (Inspacco)`;
  try {
    const response = await Parse.Cloud.httpRequest({
      url: 'https://pgapi.vispl.in/fe/api/v1/send',
      params: {
        username: SMS_USER, // need to add in env file
        password: SMS_PWD, // need to add in env file
        unicode: false,
        messageType: 'text',
        to: mobileNumber,
        from: SMS_SENDER_ID,
        dltContentId: '1707161907313100711',
        EntityID: SMS_ENTITY_ID,
        text: message,
      },
    });
    return response.text;
  } catch (error) {
    rollbar.error(`SMS Not sent to ${mobileNumber} ${error.message}`)
    throw new Parse.Error(Parse.Error.CONNECTION_FAILED, error);
  }
}

/**
 * Custom Validation - Sample
 * @param req
 * @returns
 */
async function validate(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (
    has(req.params, 'mobileNumber') &&
    typeof req.params.mobileNumber === 'string' &&
    req.params.mobileNumber.length === 10
  ) {
    return;
  } else {
    throw 'Mobile Number must be 10 digit';
  }
}

const parseValidate = {
  fields: {
    mobileNumber: {
      required: true,
      type: String,
      options: (val: any) => {
        return val.length === 10;
      },
      error: 'Mobile Number must be 10 digit',
    },
  },
};

async function developerLogins(req: Parse.Cloud.FunctionRequest) {
  const mobileNumber: string = req.params.mobileNumber;
  const otp: string = '2021';
  const phoneAuthRecord = await getPhoneAuthRecord(mobileNumber);
  const isNewUser: boolean = await updatePhoneAuthRecord(
    mobileNumber,
    otp,
    phoneAuthRecord
  );
  return {
    code: 200,
    message: 'otp has been generated succesfully.',
    isNewUser: isNewUser,
    smsStatus: 'Developer mode, sms not sent',
  };
}

export const generateOtp = {
  execute: execute,
  validate: validate,
  parseValidate: parseValidate,
};
