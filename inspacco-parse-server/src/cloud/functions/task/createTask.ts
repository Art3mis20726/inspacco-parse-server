import moment from 'moment';
import * as Parse from 'parse/node';
import { COLLECTIONS } from '../../../constants/common';
import { findUserRoles } from '../../../util/role';
import { getUserById, setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';
import { getSchemaQuery ,getSaveOrQueryOption} from '../../../util';
import { getSocietyById } from '../../../util/society';
import { getServiceSubscription } from '../../../util/serviceSubscription';

type Params = {
  serviceSubscriptionId: string;
  summary: string;
  description: string;
  rewardPoints: number;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONCE';
  dayInWeek: number;
  dayInMonth: number;
  startDate: Date;
  endDate: Date;
  module: string;
  parentId: string;
};

async function _createTask(
  taskAttributes: Omit<Params, 'serviceSubscriptionId'>,
  user: Parse.User
) {
  const task = new Parse.Object('Task');
  [
    'summary',
    'description',
    'frequency',
    'rewardPoints',
    'dayInMonth',
    'dayInWeek',
    'startDate',
    'endDate',
    'isVisible',
    'module',
    'parentId',
    'assignedTo',
    'category',
    'parentTask'
  ].forEach((key) => {
    if (key === 'startDate' || key === 'endDate') {
      task.set(
        key,
        taskAttributes[key] ? moment.utc(taskAttributes[key]).toDate() : null
      );
    } else if(key === 'assignedTo'){
      const userPointer = {
        __type: 'Pointer',
        className: '_User',
        objectId: taskAttributes[key]
    };
      task.set('assignedTo',userPointer);
    } else if(key === 'parentTask' && taskAttributes[key]){
      const parentTask = {
        __type: 'Pointer',
        className: COLLECTIONS.TASK,
        objectId: taskAttributes[key]
    };
      task.set('parentTask',parentTask);
    }  else {
      task.set(key, taskAttributes[key]);
    }
  });
  return await task.save(null, getSaveOrQueryOption(user));
}

async function _getServiceSubscriptionRecord(
  serviceSubscriptionId: string,
  user: Parse.User
) {
  try {
    const q = new Parse.Query(COLLECTIONS.SERVICE_SUBSCRIPTION);
    return await q.get(serviceSubscriptionId, getSaveOrQueryOption(user));
  } catch (error) {
    throw error;
  }
}
const parentModules = ['ServiceSubscription','Society'];
async function execute(req: Parse.Cloud.FunctionRequest<Params>) {
  try {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    const task = await _createTask({ ...req.params }, req.user);
    
    if(parentModules.includes(req.params.module) &&  req.params.parentId){
      const parentModule = await (req.params.module === 'Society' ? getSocietyById(req.params.parentId): getServiceSubscription(req.params.parentId));
      const parentRelation = parentModule.relation('tasks');
      parentRelation.add(task);
      await parentModule.save(null, {
        useMasterKey: true,
      });
    }
    return {
      status: 'success',
    };
  } catch (error) {
    
    throw error;
  }
}

export const createTask = {
  execute,
  validate: {
    fields: {
      serviceSubscriptionId: {
        required: true,
        type: String,
      },
      summary: {
        required: true,
        type: String,
      },
      description: {
        required: false,
        type: String,
      },
      rewardPoints: {
        required: true,
        type: Number,
      },
      frequency: {
        required: true,
        type: String,
      },
      dayInWeek: {
        required: false,
        type: Number,
      },
      dayInMonth: {
        required: false,
        type: Number,
      },
      startDate: {
        required: false,
        type: Date,
      },
      endDate: {
        required: false,
        type: Date,
      },
    },
  },
};
