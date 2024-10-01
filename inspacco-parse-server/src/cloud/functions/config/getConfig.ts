import { has } from 'lodash';
import { getConfig as getParseConfig } from '../../../util/config';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const { name } = req.params;
  return await getParseConfig(name);
}

async function validate(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (!has(req.params, 'name')) {
    throw 'Validation failed. "name" is required.';
  }
  return;
}

export const getConfig = {
  execute,
  validate,
};
