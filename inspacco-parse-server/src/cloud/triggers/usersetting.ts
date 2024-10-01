import * as Parse from 'parse/node';
import { getSchemaQuery } from '../../util';
import { COLLECTIONS } from '../../constants/common';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
export const beforeSaveUserSettingHandler = async (
    req: Parse.Cloud.BeforeSaveRequest
) => {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    const operation = req.object.id ? 'UPDATE' : 'CREATE';
    const existingObject = await getSchemaQuery(COLLECTIONS.USER_SETTING)({ user: req.user, settingType: req.object.get('settingType'), key: req.object.get('key') }, req.user);
    if (operation ==='CREATE' &&  existingObject) {
        throw new Parse.Error(
            Parse.Error.DUPLICATE_VALUE,
            'Combination of settingType and key must be unique.'
        );
    }
    req.context = {
        operation,
    };
};
