import { get, has } from "lodash";
import * as Parse from "parse/node";

export class PhoneAuth {
  async validateAuthData(authData: any, options: any) {
    try {
      if (authData) {       
        const isPhoneAuthOtpValidated = await validatePhoneAuthOtp(authData.id, authData.otp);
        if (isPhoneAuthOtpValidated) {
          setTimeout(() => {
            resetOtpCounter(authData.id);
          }, 100);
          return Promise.resolve();
        } else {
          throw new Parse.Error(Parse.Error.VALIDATION_ERROR, "Invalid Otp.");
        }

      } 
    } catch (error) {
      throw new Parse.Error(Parse.Error.SCRIPT_FAILED, error);
    }
  }

  validateAppId() {
    return Promise.resolve();
  }
}


async function validatePhoneAuthOtp(mobileNumber: string, otp: string): Promise<boolean> {
  try {
    const PhoneAuthClassObject = Parse.Object.extend("PhoneAuth");
    const query = new Parse.Query(PhoneAuthClassObject);
    query.equalTo("mobileNumber", mobileNumber);
    const phoneAuthRecord: any = await query.first({ useMasterKey: true });
    if (phoneAuthRecord) {
      return phoneAuthRecord.get("otp") === otp;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
}

async function resetOtpCounter(mobileNumber: string) {
  try {
    const PhoneAuthClassObject = Parse.Object.extend("PhoneAuth");
    const query = new Parse.Query(PhoneAuthClassObject);
    query.equalTo("mobileNumber", mobileNumber);
    const phoneAuthRecord: any = await query.first({ useMasterKey: true });
    if (phoneAuthRecord) {
      phoneAuthRecord.set("otpCounter", 1);
      return await phoneAuthRecord.save(null, { useMasterKey: true });
    }
    throw new Parse.Error(Parse.Error.OBJECT_NOT_FOUND, "User not found.Please generate otp again.");
  } catch (error) {
    throw error;
  }
}
export default PhoneAuth;
module.exports = PhoneAuth;