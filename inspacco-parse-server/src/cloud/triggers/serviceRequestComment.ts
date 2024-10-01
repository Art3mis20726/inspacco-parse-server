import moment from 'moment';
import * as Parse from 'parse/node';
import { COLLECTIONS } from '../../constants/common';
import { getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
export const beforeSaveServiceRequestCommentHandler = async (
  req: Parse.Cloud.BeforeSaveRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  const user = req.master ? await getUserByUserName('SYSTEM_ADMIN') : req.user;
  req.context = {
    operation,
  };
  if (operation === 'CREATE') {
    req.object.set('createdBy', user);

    const acl = new Parse.ACL();
    acl.setPublicReadAccess(true);
    acl.setPublicWriteAccess(false);
    req.object.setACL(acl);
  }
};

export const beforeDeleteServiceRequestCommentHandler = async (
  req: Parse.Cloud.BeforeDeleteRequest
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const q = new Parse.Query(COLLECTIONS.SERVICE_REQUEST_COMMENT);
  const comment = await q.get(req.object.id, {
    useMasterKey: true,
  });
  if (
    moment().diff(moment(comment.createdAt), 'minutes') > 60 ||
    req.user.id !== comment.get('createdBy')?.id
  ) {
    throw `Selected comment cannot be deleted.`;
  }
};
