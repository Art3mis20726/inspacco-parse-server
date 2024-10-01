import * as Parse from 'parse/node';
import { ROLES } from '../../constants/common';
import { getSchemaQuery } from '../../util';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
export const beforeSaveUserHandler = async (
  req: Parse.Cloud.BeforeSaveRequest<Parse.User>
) => {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const operation = req.object.id ? 'UPDATE' : 'CREATE';
  if (operation === 'CREATE') {
    const authData = req.object.get('authData');
    if (authData) {
      req.object.set('mobileNumber', authData?.phoneAuth?.id);
    }
    const user = await getSchemaQuery('_User')({ mobileNumber:req.object.get('mobileNumber') },null);
    if(user){
      throw new Parse.Error(
        Parse.Error.VALIDATION_ERROR,
        "Mobile Number already registered With Us"
      );
    }
    if (!/^[6789]\d{9}$/.test(req.object.get('mobileNumber'))) {
      throw new Parse.Error(
        Parse.Error.VALIDATION_ERROR,
        "Mobile Number is not valid"
      );
    }
    setACL(req);
  }
};

function setACL(req: Parse.Cloud.BeforeSaveRequest) {
  const acl = new Parse.ACL();
  acl.setRoleWriteAccess(ROLES.PARTNER_ADMIN, true);
  acl.setRoleWriteAccess(ROLES.PARTNER_KAM,true);
  acl.setRoleWriteAccess(ROLES.INSPACCO_KAM,true);
  acl.setRoleWriteAccess(ROLES.INSPACCO_ADMIN,true);
  acl.setPublicReadAccess(true);
  req.object.setACL(acl);
}