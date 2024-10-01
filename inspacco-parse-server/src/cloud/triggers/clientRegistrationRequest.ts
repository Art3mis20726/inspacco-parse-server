import * as Parse from 'parse/node';
import { getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
export const beforeSaveClientRegistrationRequestHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  const user = req.master ? await getUserByUserName('SYSTEM_ADMIN') : req.user;
  if (operation === 'CREATE') {
    req.object.set('createdBy', user);
    req.object.set('updatedBy', user);
  } else {
    req.object.set('updatedBy', user);
  }
  req.context = {
    operation,
  };
};
