import { get, has, size } from "lodash";
import { Role, User } from "parse/node";
import { getUser, linkUser, setUserForCloudFunctionAndTriggersIfRequired } from "../../../util/user";
import { findUserRoles } from "../../../util/role";
import { sendSMS } from "../../../util/sendSms";
import rollbar from "../../../util/rollbar";

async function execute(req: Parse.Cloud.FunctionRequest, validator?: Parse.Cloud.Validator) {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    const mobileNumber: string = req.params.mobileNumber;
    const otp: string = (Math.floor(Math.random() * 8999 + 1000)).toString();
    const userAttribuite = {
        "createdBy": req.user.id,
        "firstName": get(req, 'params.firstName'),
        "lastName": get(req, 'params.lastName'),
        "email": get(req, 'params.email')
    };
    const userCreated = await linkUser(mobileNumber, otp, userAttribuite);
    
    if (userCreated) {
        try {
            await onboardUser(mobileNumber,get(req, 'params.firstName'));
        } catch (error) {
            rollbar.error(`${mobileNumber} error while creating user ${error.message}`)
        }
       
        return {
            'code': 200,
            'message': "User has been created successfully.",
            'objectId': userCreated.id
        };
    }

    throw new Parse.Error(Parse.Error.SCRIPT_FAILED, "User creation failed.Something went wrong, please contact system admin");
}

async function onboardUser( mobile, firstName) {
    const userMobile = mobile;
    const userName = firstName || 'User';
    const appUrl = 'https://tinyurl.com/fcddbpxm';
    const message = `Dear ${userName}, You have been successfully on-boarded with Inspacco, for getting regular updates kindly download the app using given link - ${appUrl} Prophandy Technologies Pvt Ltd (Inspacco)`;
    const contentId = "1707162359299221306";//Manager
    const smsStatusText = await sendSMS(userMobile,message,contentId);
     return {
          code: 200,
          message: `Onboarding SMS send succesfully to ${userMobile}`,
          'smsStatus' : smsStatusText ? smsStatusText : 'Error'
     };
  }

async function validate(req: Parse.Cloud.FunctionRequest) {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    if (!req.user) {
        throw "Validation failed. Authentication required";
    }
    const authorizedRoles = ["ROOT", "INSPACCO_ADMIN", "INSPACCO_KAM", "PARTNER_ADMIN"];
    const currentUserRole: Role = await findUserRoles(req.user, authorizedRoles);

    console.log("==============CURRENT USER ROLE==============\n",currentUserRole);
    
    if (!size(currentUserRole)) {
        throw new Parse.Error(Parse.Error.VALIDATION_ERROR, "LoggedIn user is not authorized for creating user");
    }

    if (!has(req.params, "mobileNumber") && typeof (req.params.mobileNumber) !== "string") {
        throw "Validation failed. Please specify data for mobileNumber and must be 10 digit";
    }
    const isUserFound = await getUser(req.params.mobileNumber);
    if (isUserFound) {
        throw 'Validation failed.User is already available.';
    }   
    return;
}

export const createUser = {
    execute: execute,
    validate: validate
};

