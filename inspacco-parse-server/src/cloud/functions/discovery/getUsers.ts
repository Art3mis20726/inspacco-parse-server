import { get, has, size } from "lodash";
import { Role, User } from "parse/node";
import { getUser, linkUser, setUserForCloudFunctionAndTriggersIfRequired } from "../../../util/user";
import { findUserRoles } from "../../../util/role";

async function checkExistingUser(req: Parse.Cloud.FunctionRequest) {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    const isUserFound = await getUser(req.params.mobileNumber);
    return isUserFound;
}

export const getUserDetails = {
    execute: checkExistingUser 
};