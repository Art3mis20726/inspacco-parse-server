const ExcelJS = require('exceljs');
import { get } from 'lodash';
import moment from 'moment';

import {
  GET_TASK_FOR_REPORT,
  GET_TASKS_BY_SERVICE_SUBSCRIPTION_QUERY,
  GET_TASKS_BY_SOCIETY_QUERY,
} from '../../graphql/queries/getTaskReport';
import executeGraphql from '../../../util/graphqlClient';
import { ATTACHMENTS_BASE_URL } from '../../../util/secrets';
import {
  getDateInReportFormat,
  getDateTimeInReportFormat,
  getFullName,
  getSchemaFindQuery,
} from '../../../util/index';
import { COLLECTIONS } from '../../../constants/common';
import { Collection } from 'mongoose';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';
function getTaskActivitiesByDateRange(taskIds, startDate, endDate) {
  // Create a query for TaskActivity objects
  const TaskActivity = Parse.Object.extend(COLLECTIONS.TASK_ACTIVITY);
  const query = new Parse.Query(TaskActivity);

  // Create a pointer to the Task objects
  const tasks = taskIds.map((taskId) => {
    const Task = Parse.Object.extend(COLLECTIONS.TASK);
    const task = new Task();
    task.id = taskId;
    return task;
  });

  // Set the constraint to include Task objects from the provided taskIds
  query.containedIn('task', tasks);

  // Set the constraint to filter taskDate between startDate and endDate
  query.greaterThanOrEqualTo('taskDate', startDate);
  query.lessThanOrEqualTo('taskDate', endDate);
  query.descending('updatedAt');
  return query.find({ useMasterKey: true });

}
async function getTaskData(req: Parse.Cloud.FunctionRequest) {
  const {
    societyId,
    serviceId,
    startDate,
    endDate,
    status,
    recordCount,
    taskType = 'ServiceSubscription',
  } = req.params;

  let tasks = [];
  const societyServiceTasks = [];
  const taskIds = [];
  if (taskType === 'ServiceSubscription') {
    const getTaskIdsBySrerviceSubscriptionQuery = await executeGraphql(
      req.user,
      GET_TASKS_BY_SERVICE_SUBSCRIPTION_QUERY,
      {
        societyId: Array.isArray(societyId) ? societyId : [societyId],
        serviceId: Array.isArray(serviceId) ? serviceId : [serviceId],

      },
      true
    );
    tasks = get(
      getTaskIdsBySrerviceSubscriptionQuery,
      'data.serviceSubscriptions.edges'
    );
    tasks.forEach(serviceSubscription => {
      const { society, service, tasks } = serviceSubscription.node || {};
      const tIds = tasks?.edges?.map((a) => a.node?.objectId) || [];
      taskIds.push(...tIds);
      societyServiceTasks.push({ societyName: society?.name, serviceName: service?.name, taskIds: tIds });
    });

  } else {
    const getTaskIdsTasksQuery = await executeGraphql(
      req.user,
      GET_TASKS_BY_SOCIETY_QUERY,
      {
        societyId: Array.isArray(societyId) ? societyId : [societyId],
      }
    );
    tasks = get(getTaskIdsTasksQuery, 'data.societies.edges');
    tasks.forEach(serviceSubscription => {
      const { name, tasks } = serviceSubscription.node || {};
      const tIds = tasks?.edges?.map((a) => a.node?.objectId) || [];
      taskIds.push(...tIds);
      societyServiceTasks.push({ societyName: name, serviceName: '', taskIds: tIds });
    });
  }

  console.log('taskIds', taskIds);
  // const taskActivities = await getTaskActivitiesByDateRange(
  //   taskIds,
  //   new Date(startDate),
  //   new Date(endDate)
  // );
  const quotationRes = await executeGraphql(req.user, GET_TASK_FOR_REPORT, {
    taskIds,
    startDate,
    endDate,
    recordCount
  });
  return { taskData: get(quotationRes, 'data.taskActivities.edges'), societyServiceTasks };
}
async function handleReportInJSON(taskData, societyServiceTasks, user) {
  const _ = require('lodash');
  return new Promise(async (resolve, reject) => {
    const data = [];
    for (const taskElement of taskData) {
      const taskActivity = taskElement.node;
      let activityHistories =
        taskActivity.activityHistory?.edges?.map((obj) => obj.node) || [];
      activityHistories = activityHistories.filter(
        (obj) => obj.action === 'ChangeStatus'
      );
      activityHistories = _.sortBy(activityHistories, (obj) => obj.createdAt);
      // const activityHistory = activityHistories[activityHistories.length -1];
      let statusChangedOn = null;
      let statusChangedBy = null;
      const status = taskActivity.taskStatus;
      if (activityHistories && activityHistories.length) {
        const activityHistory = activityHistories[activityHistories.length - 1];
        statusChangedOn = getDateTimeInReportFormat(activityHistory.createdAt);
        statusChangedBy = getFullName(activityHistory?.createdBy);
      } else {
        statusChangedOn = getDateTimeInReportFormat(taskActivity.updatedAt);
        statusChangedBy = getFullName(taskActivity?.updatedBy);
      }
      const attachments: any = await getSchemaFindQuery(COLLECTIONS.ATTACHMENT)({ parentId: taskActivity.objectId }, user);
      const { societyName, serviceName } = societyServiceTasks.find(obj => obj?.taskIds.includes(taskActivity.task?.objectId)) || {};
      data.push({
        taskActivityId: taskActivity.objectId,
        taskName: taskActivity.task.summary,
        createdBy: getFullName(taskActivity.createdBy),
        startDate: getDateInReportFormat(taskActivity?.task?.startDate),
        endDate: getDateInReportFormat(taskActivity?.task?.endDate),
        serviceName,
        status,
        statusChangedBy,
        statusChangedOn,
        frequency: taskActivity.task.frequency,
        category: taskActivity.task.category,
        societyName,
        comment: taskActivity.comment,
        url:
          attachments.length > 0
            ? `${attachments
              .map((ele) => ATTACHMENTS_BASE_URL + ele.get('url'))
              .join(',\n')}`
            : '',
      });
    }
    resolve(data);
  });
}

async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  console.log('################ GENERATE TASK REPORT ###############');
  const { startDate, endDate, reportOutput = 'file', taskType } = req.params;
  const { taskData, societyServiceTasks } = await getTaskData(req);
  const _ = require('lodash');

  if (reportOutput === 'data') {
    return handleReportInJSON(taskData, societyServiceTasks, req.user);
  }
  return new Promise(async (resolve, reject) => {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Prophandy Technologies Pvt. Ltd.(Inspacco)';
      workbook.lastModifiedBy = 'Prophandy Technologies Pvt. Ltd.(Inspacco)';
      workbook.created = new Date();
      workbook.modified = new Date();
      const worksheet = workbook.addWorksheet(
        `${moment(startDate).format('DD-MM-YYYY')} To ${moment(endDate).format(
          'DD-MM-YYYY'
        )}`
      );
      const sheetColumns = [
        { header: 'Task Id', key: 'taskId', width: 25 },
        { header: 'SUMMARY', key: 'taskName', width: 20 },
        { header: 'FACILITY', key: 'societyName', width: 25 },
        { header: 'STATUS', key: 'status', width: 15 },
        { header: 'START DATE', key: 'startDate', width: 20 },
        { header: 'END DATE', key: 'endDate', width: 20 },
        { header: 'COMMENT', key: 'comment', width: 25 },
        { header: 'STATUS CHANGED BY', key: 'statusChangedBy', width: 25 },
        { header: 'STATUS CHANGED ON', key: 'statusChangedOn', width: 25 },
        { header: 'CREATED BY', key: 'createdBy', width: 20 },
        { header: 'FREQUENCY', key: 'frequency', width: 20 },
        { header: 'CATEGORY', key: 'category', width: 20 },
        { header: 'ASSIGNED TO', key: 'assignedTo', width: 25 },
        { header: 'Attachment 1', key: 'attachment1', width: 30 },
        { header: 'Attachment 2', key: 'attachment2', width: 30 },
        { header: 'Attachment 3', key: 'attachment3', width: 30 },
        { header: 'Attachment 4', key: 'attachment4', width: 30 },
        { header: 'Attachment 5', key: 'attachment5', width: 30 },
      ];
      if (taskType !== 'Society') {
        sheetColumns.push({ header: 'SERVICE NAME', key: 'serviceName', width: 25 });
      }
      worksheet.columns = sheetColumns;
      worksheet.getRow(1).font = {
        color: { argb: 'FFFFFFFF' },
        size: 10,
        bold: true,
      };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0047B3' },
      };
      for (const taskElement of taskData) {

        const taskActivity = taskElement.node;
        let activityHistories =
          taskActivity.activityHistory?.edges?.map((obj) => obj.node) || [];
        activityHistories = activityHistories.filter(
          (obj) => obj.action === 'ChangeStatus'
        );
        activityHistories = _.sortBy(activityHistories, (obj) => obj.createdAt);
        // const activityHistory = activityHistories[activityHistories.length -1];
        let statusChangedOn = null;
        let statusChangedBy = null;
        const status = taskActivity.taskStatus;
        if (activityHistories && activityHistories.length) {
          const activityHistory =
            activityHistories[activityHistories.length - 1];
          statusChangedOn = getDateTimeInReportFormat(
            activityHistory.createdAt
          );
          statusChangedBy = getFullName(activityHistory?.createdBy);
        } else {
          statusChangedOn = getDateTimeInReportFormat(taskActivity.updatedAt);
          statusChangedBy = getFullName(taskActivity?.updatedBy);
        }
        const { societyName, serviceName } = societyServiceTasks.find(obj => obj?.taskIds.includes(taskActivity.task?.objectId)) || {};
        const attachments: any = await getSchemaFindQuery(COLLECTIONS.ATTACHMENT)({ parentId: taskActivity.objectId }, req.user);
        const worksheetrow = {
          taskId: taskActivity?.objectId,
          taskName: taskActivity.task.summary,
          createdBy: getFullName(taskActivity.createdBy),
          startDate: getDateInReportFormat(
            taskActivity?.task?.startDate
          ),
          endDate: getDateInReportFormat(
            taskActivity?.task?.endDate
          ),
          serviceName,
          status,
          statusChangedBy,
          statusChangedOn,
          frequency: taskActivity.task.frequency,
          category: taskActivity.task.category,
          societyName,
          comment: taskActivity.comment,
          module:
            taskActivity?.task?.module === 'Society' ? 'Internal' : 'Vendor',
          url:
            attachments?.length > 0
              ? `${attachments
                .map((ele) => ATTACHMENTS_BASE_URL + ele?.get('url'))
                .join(',\n')}`
              : '',
          assignedTo: getFullName(taskActivity?.task?.assignedTo || {})
        };
        if (attachments?.length) {
          attachments?.forEach((el, i) => {
            worksheetrow[`attachment${i + 1}`] = { text: el?.get('name'), hyperlink: ATTACHMENTS_BASE_URL + el?.get('url') };
          });
        }
        worksheet.addRow(worksheetrow);
      }
      const convertFileToBuffer = async () => {
        const fileBuffer = await workbook.xlsx.writeBuffer();
        const fileName = `Task_${taskType !== 'SOCIETY' ? 'Vendor' : 'Internal'}_Report_${moment().format('YYYY-MM-DD')}.xlsx`;
        const file = new Parse.File(
          fileName,
          Array.from(Buffer.from(fileBuffer))
        );
        return file.save().then((res) => {
          resolve(res.url());
        });
      };
      const convertFileToBase64 = async () => {
        return resolve(await convertFileToBuffer());
      };
      convertFileToBase64();
    } catch (error) {
      console.error(error.stack);
      reject('Failed to generate task report .');
    }
  });
}

export const generateTaskReport = {
  execute,
};
