import * as Parse from 'parse/node';
import { getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from '../../util/user';
import { getSchemaQuery } from '../../util';
import { COLLECTIONS } from '../../constants/common';
export const beforeSaveClientVendorCatalogMappingHandler = async (
    req: Parse.Cloud.BeforeSaveRequest
) => {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    const operation = req.object.id ? 'UPDATE' : 'CREATE';
    if (operation === 'CREATE') {
        const existingObject = await getSchemaQuery(COLLECTIONS.CLIENT_VENDOR_CATALOG_MAPPING)({ society: req.object.get('society'), partner: req.object.get('partner') }, req.user);
        throw new Parse.Error(
            Parse.Error.DUPLICATE_VALUE,
            'Combination of Society and Partner must be unique.'
        );
    }
    req.context = {
        operation,
    };
};
