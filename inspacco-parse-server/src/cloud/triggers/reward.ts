import { size } from "lodash";
import { COLLECTIONS } from "../../constants/common";
import { setUserForCloudFunctionAndTriggersIfRequired } from "../../util/user";
import rollbar from "../../util/rollbar";


export const beforeSaveReward = async (req: Parse.Cloud.BeforeSaveRequest) => {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    const operation = req.object.id ? 'UPDATE' : 'CREATE';
    req.context = {operation};
};

export const afterSaveReward = (req: Parse.Cloud.AfterSaveRequest) => {
    (async () => {
        await setUserForCloudFunctionAndTriggersIfRequired(req);
        if (req.context['operation'] === 'CREATE') {
        const fromUser = req.object.get('user');
        if( req.object.className !== COLLECTIONS.REWARD && !req.master){
            return;
        }

        try {
            const UserObj = Parse.Object.extend("_User");
            const query = new Parse.Query(UserObj);
            query.equalTo('objectId',fromUser.id);
            const User = await query.first({useMasterKey:true});
            if(size(User)){           
                const newRewardPoints = req.object.get('rewardPoints') || 0;
                User.increment('totalRewardPoints',Number(newRewardPoints));
                const isSave  = await User.save(null,{ useMasterKey: true });
            }
        } catch (error) {
            rollbar.error(`${fromUser}  failed to save reward points ${error.message}`);

            console.log(error);
        }
    }
    })();
};
