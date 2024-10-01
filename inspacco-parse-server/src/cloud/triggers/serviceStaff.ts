
import { isString } from "lodash";
import { getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from "../../util/user";
import { getSchemaQuery } from "../../util";
import { COLLECTIONS } from "../../constants/common";

export const beforeSaveServiceStaffHandler = async (
    req: Parse.Cloud.BeforeSaveRequest
  ) => {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    const operation = req.object.id ? 'UPDATE' : 'CREATE';
    const user = req.master ? await getUserByUserName('SYSTEM_ADMIN') : req.user;

    

    if (operation === 'CREATE') {
        const staff = req.object.get('staff');
        const serviceSubscription = req.object.get('serviceSubscription');
         const existingServiceStaff =  await getSchemaQuery(COLLECTIONS.SERVICE_STAFF)({staff,serviceSubscription},null);
         if(existingServiceStaff){
            const partnerStaff = await getSchemaQuery(COLLECTIONS.PARTNER_STAFF)({ objectId:staff.id},null);
            throw new Parse.Error(
                Parse.Error.VALIDATION_ERROR,
                `${partnerStaff.get('firstName')} ${partnerStaff.get('lastName')} (${partnerStaff.get('mobileNumber')}) already assigned to Service`
              );
         }
        //Update serviceKey
    }
    req.context = {
      operation
    };
  };