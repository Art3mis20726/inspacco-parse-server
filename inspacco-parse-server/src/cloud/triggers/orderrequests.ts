import { COLLECTIONS } from "../../constants/common";
import { getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from "../../util/user";

export const beforeSaveOrderRequestHandler = async (
    req: Parse.Cloud.BeforeSaveRequest
) => {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    const operation = req.object.id ? 'UPDATE' : 'CREATE';
    const user = req.master ? await getUserByUserName('SYSTEM_ADMIN') : req.user;
    req.context = {
        operation,
    };
    if (operation === 'CREATE') {
        // Set createdBy updatedBy
        req.object.set('createdBy', user);
        const orderRequestQuery = new Parse.Query(COLLECTIONS.ORDER_REQUEST);

        // Optionally, add conditions to the query (e.g., where cartId is equal to '123')
        orderRequestQuery.equalTo('cartId', req.object.get('cartId'));
        const existingObject = await orderRequestQuery.first({useMasterKey:true}); 
        if (existingObject) {
            throw new Parse.Error(
                Parse.Error.DUPLICATE_VALUE,
                'Record with CartId Exist'
            );
        }
        // const acl = new Parse.ACL();
        // //   acl.setPublicReadAccess(true);
        // //   acl.setPublicWriteAccess(false);
        // req.object.setACL(acl);
    } else {
        req.object.set('updatedBy', user);
    }
};