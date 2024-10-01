import rollbar from "../../../util/rollbar";
import { setUserForCloudFunctionAndTriggersIfRequired } from "../../../util/user";

async function execute(req: Parse.Cloud.FunctionRequest){
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    if (!req.user) {
        throw 'Validation failed. Authentication required';
    }
    let pendingPoints = 0;

    try {
        const RewardRedeemRequest = Parse.Object.extend("RewardRedeemRequest");
        const query = new Parse.Query(RewardRedeemRequest);
        query.equalTo("user", req.user);
        query.equalTo("status","PENDING");
        const rewardRedeemRequestRecords = await query.findAll({ useMasterKey: true });
        rewardRedeemRequestRecords.forEach((record)=>{
            pendingPoints =  Number(pendingPoints) +  Number(record.get('rewardPoints'));
        });
    } catch (error) {
        rollbar.error(`${req.user}  failed to retrieve pending points ${error.message}`);

        throw new Parse.Error(Parse.Error.INVALID_QUERY, error);
    }
   
    const actualPoints = req.user.get('totalRewardPoints') || 0;
    const availablePoints = actualPoints - pendingPoints ;

    return {        
        availablePoints: availablePoints,
        actualPoints:actualPoints,
        pendingPoints: pendingPoints
    };
}

export const getUserTotalRewardPoints = {
    execute
};