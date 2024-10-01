import { get } from 'lodash';
import moment from 'moment-timezone';
import { Moment } from 'moment';
import { GET_ALL_SERVICE_SUBSCRIPTION_TASKS, GET_ALL_SOCIETY_TASKS } from '../../../cloud/graphql/queries/getAllServiceSubscriptionTasks';
import executeGraphql from '../../../util/graphqlClient';
import { TIMEZONE } from '../../../constants/common';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

async function execute(
  req: Parse.Cloud.FunctionRequest,
  validator?: Parse.Cloud.Validator
) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (!req.master) {
    throw 'Validation failed. Authentication required';
  }

  console.log(
    `############### Copy Task To TaskActivity : ${moment
      .tz(TIMEZONE)
      .format('llll')} ###############`
  );
  console.log(`Copy task start:${moment.tz(TIMEZONE).toLocaleString()}`);
  const futureDays = 1;
  const date = req.params.date
    ? moment(req.params.date).tz(TIMEZONE)
    : moment().tz(TIMEZONE);
  date.set({
    hours: 12,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  (async () => {
    try {
      for (let i = 0; i < futureDays; i++) {
        const allTaskServiceSubscriptions = await executeGraphql(
          req.user,
          GET_ALL_SERVICE_SUBSCRIPTION_TASKS,
          {
            date: date.toDate(),
            dayOfWeek: date.day(),
            dayOfMonth: Number(date.format('DD')),
          },
          true
        );
        const allTaskSocieties = await executeGraphql(
          req.user,
          GET_ALL_SOCIETY_TASKS,
          {
            date: date.toDate(),
            dayOfWeek: date.day(),
            dayOfMonth: Number(date.format('DD')),
          },
          true
        );
        const societyTasks =  get(
          allTaskSocieties,
          'data.societies.edges',
          []
        );
        const serviceSubscriptions = get(
          allTaskServiceSubscriptions,
          'data.serviceSubscriptions.edges',
          []
        );

        for (let j = 0; j < serviceSubscriptions.length; j++) {
          await createTaskActivityRecords(
            serviceSubscriptions[j].node,
            moment(date)
          );
        }
        for (let j = 0; j < societyTasks.length; j++) {
          await createTaskActivityRecords(
            societyTasks[j].node,
            moment(date)
          );
        }
        date.add(1, 'day');
      }
    } catch (error) {
      console.error('Copy Task Failed', error);
    } finally {
      console.log(`Copy task finished:${moment.tz(TIMEZONE).toLocaleString()}`);
    }
  })();

  return {
    code: 200,
    message: `Tasks copied succesfully.`,
  };
}

const parseValidate = {
  fields: {
    date: {
      required: true,
      type: Date,
    },
  },
};

// async function isTaskActivityPresent(
//   task: any,
//   serviceSubscriptionId: string,
//   date: Moment
// ) {
//   const TaskActivity = Parse.Object.extend('TaskActivity');
//   const ServiceSubscription = Parse.Object.extend('ServiceSubscription');
//   const Task = Parse.Object.extend('Task');
//   const q = new Parse.Query(TaskActivity);
//   q.equalTo('task', Task.createWithoutData(task.objectId));
//   q.equalTo(
//     'serviceSubscription',
//     ServiceSubscription.createWithoutData(serviceSubscriptionId)
//   );
//   if (task.frequency !== 'ONCE') {
//     const startDate = moment(date).startOf('day').toDate();
//     const endDate = moment(date).endOf('day').toDate();
//     q.greaterThanOrEqualTo('taskDate', startDate);
//     q.lessThanOrEqualTo('taskDate', endDate);
//   }
//   return q.first({ useMasterKey: true });
// }

export function buildTaskActivityRecord(
  task,
  date: Moment
) {
  const TaskActivity = Parse.Object.extend('TaskActivity');
  const Task = Parse.Object.extend('Task');
  // const ServiceSubscription = Parse.Object.extend('ServiceSubscription');
  const record: Parse.Object = new TaskActivity();
  record.set('task', Task.createWithoutData(task.objectId));
  // record.set(
  //   'serviceSubscription',
  //   ServiceSubscription.createWithoutData(serviceSubscriptionId)
  // );
  record.set('taskDate', date.toDate());
  if (task.createdBy?.objectId) {
    record.set(
      'createdBy',
      Parse.User.createWithoutData(task.createdBy.objectId)
    );
    record.set(
      'updatedBy',
      Parse.User.createWithoutData(task.createdBy.objectId)
    );
  }
  return record;
}

async function createTaskActivityRecords(obj, date: Moment) {
  try {
    const taskActivityRecords = [];
    const tasks = get(obj, 'tasks.edges', []);
    for (let i = 0; i < tasks.length; i++) {
      /* const taskActivityPresent = await isTaskActivityPresent(
        tasks[i].node,
        serviceSubscription.objectId,
        moment(date)
      ); */
      taskActivityRecords.push(
        buildTaskActivityRecord(
          tasks[i].node,
          moment(date)
        )
      );
    }
    await Parse.Object.saveAll(taskActivityRecords, { useMasterKey: true });
  } catch (error) {
    throw error;
  }
}

export const copyTaskToTaskActivity = {
  execute: execute,
};
