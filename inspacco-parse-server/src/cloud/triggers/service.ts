
import { isString } from "lodash";
import { getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from "../../util/user";

export const beforeSaveServiceHandler = async (
    req: Parse.Cloud.BeforeSaveRequest
  ) => {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    const operation = req.object.id ? 'UPDATE' : 'CREATE';
    const user = req.master ? await getUserByUserName('SYSTEM_ADMIN') : req.user;
    const serviceName = req.object.get('name');
    if (operation === 'CREATE') {
        //Update serviceKey
        if(serviceName && isString(serviceName)){
            const serviceKey = serviceName.split(" ").join("_").toUpperCase();
            req.object.set('serviceKey', serviceKey);
        }
    }
    req.context = {
      operation
    };
  };