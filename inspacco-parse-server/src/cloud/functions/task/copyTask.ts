import moment from 'moment';
import { TASK_ACTIVITY_LAST_COPIED_DATE } from '../../graphql/queries/getTaskActivity';
// import { TASK_ACTIVITY_COUNT_QUERY } from '../../graphql/queries/getTaskActivity';
import executeGraphql from '../../../util/graphqlClient';
import { GET_TASKS_QUERY } from '../../graphql/queries/getTasks';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';
import { getSaveOrQueryOption } from '../../../util';
import rollbar from '../../../util/rollbar';

async function execute(
  req: Parse.Cloud.FunctionRequest,
  validator?: Parse.Cloud.Validator
) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (!req.user) {
    throw 'Validation failed. Authentication required';
  }

/*   //Variables
  const maximumCopyDaysAllowed = 7; //7 days
  const selectedDate = req.params.date;
  const societyId = req.params.societyId;
  const startDay = moment(selectedDate).startOf('day').toISOString();
  const endDay = moment(selectedDate).endOf('day').toISOString();

  //Check if Task Already Copied
  const isPresent = await checkIfTasksAlreadyAvailable(
    req.user,
    societyId,
    startDay,
    endDay
  );
  if (isPresent) {
    //if Yes return;
    return {
      code: 200,
      message: `Tasks activities already copied for ${moment(
        req.params.date
      ).format('ll')}`,
    };
  }

  //Check For last Copied Date
  let copyTaskfromDate = await getLastCopiedDate(req.user, societyId);
  if (copyTaskfromDate) {
    // If same date  return
    const startDayOfCopiedDate = moment(copyTaskfromDate)
      .startOf('day')
      .toISOString();
    if (moment(startDayOfCopiedDate).isSame(moment(startDay))) {
      return {
        code: 200,
        message: ` Last tasks activities copied data is same as  ${moment(
          req.params.date
        ).format('ll')}`,
      };
    }
  } else {
    //if Null check of todays task available in task.
    copyTaskfromDate = moment(endDay).subtract(maximumCopyDaysAllowed, 'days');
  }

  //Missing Days is greater than 30 only copy for last 30 days
  let missingDays = moment(endDay).diff(moment(copyTaskfromDate), 'days');

  if (missingDays > maximumCopyDaysAllowed) {
    //30
    copyTaskfromDate = moment(endDay).subtract(maximumCopyDaysAllowed, 'days');
  }
  copyTaskfromDate = moment(copyTaskfromDate).toISOString();

  await copyTaskToTaskActivity(
    req.user,
    societyId,
    copyTaskfromDate,
    selectedDate
  ); */

  return {
    code: 200,
    message: `Tasks copy skipped.`,
  };
}

const parseValidate = {
  fields: {
    societyId: {
      required: true,
      type: String,
    },
    date: {
      required: true,
      type: String,
    },
  },
};

// async function checkIfTasksAlreadyAvailable(user, societyId, startDay, endDay) {
//   let query = TASK_ACTIVITY_COUNT_QUERY;
//   let params = {
//     societyId: societyId,
//     startDay: startDay,
//     endDay: endDay,
//   };
//   const result = await executeGraphql(user, query, params);
//   const isAlreadyAvailble = result?.data?.taskActivities?.count > 0 || false;
//   return isAlreadyAvailble;
// }

// async function getLastCopiedDate(user, societyId) {
//   let query = TASK_ACTIVITY_LAST_COPIED_DATE;
//   let params = {
//     societyId: societyId,
//   };
//   const result = await executeGraphql(user, query, params);
//   let lastCopiedDate = null;
//   if (result?.data?.taskActivities?.edges.length) {
//     lastCopiedDate =
//       result?.data?.taskActivities?.edges[0]?.node?.taskDate || null;
//   }
//   return lastCopiedDate;
// }

async function copyTaskToTaskActivity(
  user,
  societyId,
  copyTaskfromDate,
  tillSelectedDate
) {
  const selectedDate = copyTaskfromDate;
  // If same date  return
  let fromDate: any = moment(copyTaskfromDate).startOf('day');
  const tillDate = moment(tillSelectedDate).startOf('day');
  let condition = moment(fromDate).isSameOrBefore(moment(tillDate));

  //Copy data from date to requested date.
  while (condition) {
    const result = await getTasks(user, societyId, fromDate);
    const subscribedServices = result.data.serviceSubscriptions.edges;
    for await (const service of subscribedServices) {
      const subscriptionNode = service.node;
      await createTaskActivityRecord(
        user,
        fromDate,
        subscriptionNode.tasks.edges,
        subscriptionNode.objectId
      );
    }

    fromDate = moment(fromDate._d).add(1, 'd');

    condition = moment(fromDate).isSameOrBefore(moment(tillDate));
  }
}

async function createTaskActivityRecord(
  user: Parse.User,
  date,
  tasks,
  serviceSubscriptionId
) {
  try {
    const promises = tasks.map((task) => {
      const TaskActivity = Parse.Object.extend('TaskActivity');
      const Task = Parse.Object.extend('Task');
      // const ServiceSubscription = Parse.Object.extend('ServiceSubscription');
      const taskActivityRecord: Parse.Object = new TaskActivity();
      taskActivityRecord.set('taskDate', new Date(date));
      taskActivityRecord.set(
        'task',
        Task.createWithoutData(task.node.objectId)
      );
      // taskActivityRecord.set(
      //   'serviceSubscription',
      //   ServiceSubscription.createWithoutData(serviceSubscriptionId)
      // );
      return taskActivityRecord.save(null, getSaveOrQueryOption(user));
    });
    return await Promise.all(promises);
  } catch (error) {
    rollbar.error(`${user} failed while creating Task Activity Record ${error.message}`)
    throw error;
  }
}

async function getTasks(user, societyId, selectedDate) {
  const query = GET_TASKS_QUERY;
  const params = {
    societyId: societyId, //'B9yyyU4CBa',
    date: selectedDate, //'2021-06-23T06:30:00.000Z',
    dayOfWeek: moment(selectedDate).day(), // 5,
    dayOfMonth: Number(moment(selectedDate).format('DD')), //23,
  };
  const result = await executeGraphql(user, query, params);
  return result;
}

export const copyTask = {
  execute: execute,
  validate: parseValidate,
};
