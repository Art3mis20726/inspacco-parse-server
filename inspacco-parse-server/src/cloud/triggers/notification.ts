import { setUserForCloudFunctionAndTriggersIfRequired } from "../../util/user";

export const beforeSaveNotificationHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  if (operation === 'CREATE' && req.object.get('user')) {
    req.object.setACL(new Parse.ACL(req.object.get('user')));
  }
};
