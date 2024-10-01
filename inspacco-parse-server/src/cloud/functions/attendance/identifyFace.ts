import { ATTACHMENTS_BASE_URL } from '../../../util/secrets';
import { getSchemaQuery } from '../../../util';
import { detectFace, identifyFace } from '../../../util/azurefaceservice';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

async function handleIdentifyFace(
  req: Parse.Cloud.FunctionRequest,
  validator?: Parse.Cloud.Validator
) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const { captured_image } = req.params;
  const imageUrl = ATTACHMENTS_BASE_URL + captured_image;
  const faceId = await detectFace(imageUrl);
  if (!faceId) {
    return {
      code: 404,
      message: 'Face Not Detected',
    };
  }
  const personId = await identifyFace(faceId);
  if (!personId) {
    return {
      code: 404,
      message: 'Face Not Identified',
    };
  }
  const user = await getSchemaQuery('_User')({ personFaceId: personId }, null);
  if (!user) {
    return {
      code: 404,
      message: 'User Not Found',
    };
  }
  return {
    code: 200,
    user,
  };
}
export const identifyface = {
  execute: handleIdentifyFace,
};
