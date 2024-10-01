import * as Parse from 'parse/node';
import { COLLECTIONS } from '../../../constants/common';
import { findUserRoles } from '../../../util/role';
import { getSaveOrQueryOption, getSchemaQuery } from '../../../util/index';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';
import rollbar from '../../../util/rollbar'
type Params = {
  serviceSubscriptionId: string;
  taskId: string;
};

async function _getServiceSubscriptionRecord(
  serviceSubscriptionId: string,
  user: Parse.User
) {
  try {
    const q = new Parse.Query(COLLECTIONS.SERVICE_SUBSCRIPTION);
    return await q.get(serviceSubscriptionId, getSaveOrQueryOption(user));
  } catch (error) {
    rollbar.error(`${serviceSubscriptionId} error while getting service subscription Record ${error.message}`)
    throw error;
  }
}

async function _getTask(taskId: string, user: Parse.User) {
  try {
    const q = new Parse.Query(COLLECTIONS.TASK);
    return await q.get(taskId, getSaveOrQueryOption(user));
  } catch (error) {
    throw error;
  }
}

async function execute(req: Parse.Cloud.FunctionRequest<Params>) {
  try {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    const serviceSubscriptionRecord = await _getServiceSubscriptionRecord(
      req.params.serviceSubscriptionId,
      req.user
    );
    const taskRelation = serviceSubscriptionRecord.relation('tasks');
    taskRelation.remove(await _getTask(req.params.taskId, req.user));
    await serviceSubscriptionRecord.save(null, {
      useMasterKey: true,
    });
    const task  = await getSchemaQuery(COLLECTIONS.TASK)({ objectId:req.params.taskId },req.user);
    const taskActivityQuery = new Parse.Query(COLLECTIONS.TASK_ACTIVITY);
    taskActivityQuery.equalTo('task', task);
     // Find the TaskActivity records
    const taskActivities = await taskActivityQuery.find({ useMasterKey: true });
    await Parse.Object.destroyAll(taskActivities, { useMasterKey: true });
    await task.destroy({ useMasterKey:true } );
    return {
      status: 'success',
    };
  } catch (error) {
    throw error;
  }
}

export const removeTask = {
  execute,
  validate: {
    fields: {
      serviceSubscriptionId: {
        required: true,
        type: String,
      },
      taskId: {
        required: true,
        type: String,
      },
    },
  },
};
