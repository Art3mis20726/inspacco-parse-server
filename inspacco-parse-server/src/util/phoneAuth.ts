import * as Parse from "parse/node";
import { getUser } from "./user";
import rollbar from "./rollbar";

export async function getPhoneAuthRecord(mobileNumber: string) {
    try {
        const PhoneAuthClassObject = Parse.Object.extend("PhoneAuth");
        const query = new Parse.Query(PhoneAuthClassObject);
        query.equalTo("mobileNumber", mobileNumber);
        const phoneAuthRecord = await query.first({ useMasterKey: true });
        return phoneAuthRecord;
    } catch (error) {
        rollbar.error(`${mobileNumber} failed while Phone Auth Record ${error.message}`)
        throw new Parse.Error(Parse.Error.INVALID_QUERY, error);
    }
}
async function updateUserAuthData(mobileNumber: string, otp: string) {
    const userRecord = await getUser(mobileNumber);
    if (userRecord) {
        const authData = {
            "phoneAuth": {
                "id": mobileNumber,
                "otp": otp
            }
        };
        userRecord.set("authData", authData);
        await userRecord.save(null, { useMasterKey: true });
        return true;
    } else {
        return false;
    }
}
export async function updatePhoneAuthRecord(mobileNumber: string, otp: string, phoneAuthRecord: any) {
    //@todo: Add Unique index on MobileNumber https://docs.mongodb.com/manual/core/index-unique/
    try {

        if (phoneAuthRecord) {
            phoneAuthRecord.set("otp", otp);
            phoneAuthRecord.increment("otpCounter");
            phoneAuthRecord.set("otpExpiry", new Date());//@todo: Need use moment and add +30 min
            await phoneAuthRecord.save(null, { useMasterKey: true });
            return await updateUserAuthData(mobileNumber, otp);
        } else {
            const PhoneAuthClassObject = Parse.Object.extend("PhoneAuth");
            const phoneAuthObject = new PhoneAuthClassObject();
            phoneAuthObject.set("mobileNumber", mobileNumber);
            phoneAuthObject.set("otp", otp);
            phoneAuthObject.increment("otpCounter");
            phoneAuthObject.set("otpExpiry", new Date());
            phoneAuthObject.set("userStatus", "Active");
            await phoneAuthObject.save(null, { useMasterKey: true });
            return await updateUserAuthData(mobileNumber, otp);
            return true;
        }

    } catch (error) {
        rollbar.error(`${mobileNumber} failed while update Phone Auth Record ${error.message}`)
        throw error;
    }
}