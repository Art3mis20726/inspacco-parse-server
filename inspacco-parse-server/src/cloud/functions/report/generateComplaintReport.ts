const ExcelJS = require('exceljs');
import { get } from 'lodash';
import moment from 'moment';
import executeGraphql from '../../../util/graphqlClient';
import { GET_SOCIETY_LEVEL_INCIDENTS_FOR_REPORT, GET_SOCIETY_SERVICE_LEVEL_INCIDENTS_FOR_REPORT } from '../../graphql/queries/getSocietyLevelIncidents';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

async function getComplaintData(req: Parse.Cloud.FunctionRequest) {
  const { societyId, startDate, endDate, status, recordCount,serviceId } = req.params;
  if(serviceId){
    const quotationRes = await executeGraphql(req.user, GET_SOCIETY_SERVICE_LEVEL_INCIDENTS_FOR_REPORT, {
      societyId,
      serviceId: Array.isArray(serviceId) ? serviceId : [serviceId],
      status,
      startDate,
      endDate,
      recordCount
    });
    return get(quotationRes, 'data.incidents.edges');
  }else {
    const quotationRes = await executeGraphql(req.user, GET_SOCIETY_LEVEL_INCIDENTS_FOR_REPORT, {
      societyId,
      status,
      startDate,
      endDate,
      recordCount
    });
    return get(quotationRes, 'data.incidents.edges');
  }
}

async function handleReportInJSON(complaintData){
  const _ = require('lodash');
  return new Promise((resolve,reject)=>{
    const data = [];
    complaintData.forEach((complaintElement,index) => {
      let activityHistories =  complaintElement?.node?.activityHistory?.edges?.filter(node =>
        node.node.action === 'editIncidentStatus');
        activityHistories = _.sortBy(activityHistories,({node})=>{
          return node.createdAt;
        }); 
        const activityHistory = activityHistories[activityHistories.length -1];
      //  console.log('TASKDATA------------> ',activityHistory);
      const comments = complaintElement.node.comments.edges.map((ele, index) => `${index+1.} ${ele.node.comment}`+"\r\n");
      data.push({
        displayId: complaintElement.node.displayId,
        societyName: complaintElement.node.serviceSubscription.society.name,
        summary: complaintElement.node.summary,
        name: complaintElement.node.serviceSubscription.service.name,
        createdBy: `${complaintElement.node.createdBy.firstName ? complaintElement.node.createdBy.firstName : "" } ${complaintElement.node.createdBy.LastName ? complaintElement.node.createdBy.LastName : ""}`,
        assignedTo: `${complaintElement.node.assignee.firstName ? complaintElement.node.assignee.firstName : "" } ${complaintElement.node.assignee.lastName ? complaintElement.node.assignee.lastName : ""} `,
        priority: complaintElement.node.priority,
        createdAt: moment(complaintElement.node.createdAt).format("DD/MM/YYYY"),
        status: activityHistory?.node?.value != null ? activityHistory?.node?.value : complaintElement.node.status,
        statusChangedBy: `${activityHistory?.node?.createdBy?.firstName ? activityHistory?.node?.createdBy?.firstName : complaintElement?.node?.createdBy?.firstName } ${activityHistory?.node?.createdBy?.LastName ? activityHistory?.node?.createdBy?.LastName : complaintElement?.node?.createdBy?.lastName}`,
        statusChangedOn:  activityHistory?.node?.createdAt ? moment(activityHistory?.node?.createdAt).format("DD/MM/YYYY") : moment(complaintElement?.node?.createdAt).format("DD/MM/YYYY"),
        resolvedDate: complaintElement.node.status == 'RESOLVED' ? moment(complaintElement.node.updatedAt).format("DD/MM/YYYY") : '-',
        category: complaintElement.node.category,
        comment: comments.join(""),
      });
    });
    resolve(data);
  });
}
async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  console.log('################ GENERATE COMPLAINT REPORT ###############');
  const { startDate, endDate ,reportOutput='file' } = req.params;
  const complaintData = await getComplaintData(req);
  const _ = require('lodash');
  if(reportOutput === 'data'){
    return handleReportInJSON(complaintData);
  }
  return new Promise((resolve, reject) => {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Prophandy Technologies Pvt. Ltd.(Inspacco)';
      workbook.lastModifiedBy = 'Prophandy Technologies Pvt. Ltd.(Inspacco)';
      workbook.created = new Date();
      workbook.modified = new Date();
      const worksheet = workbook.addWorksheet(`${moment(startDate).format('DD-MM-YYYY')} To ${moment(endDate).format('DD-MM-YYYY')}`);
      worksheet.columns = [
        { header: 'COMPLAINT ID', key: 'displayId', width: 15 },
        {header: 'SITE NAME', key: 'societyName', width: 25 },
        { header: 'SERVICE NAME', key: 'name', width: 20},
        { header: 'CREATED BY', key: 'createdBy', width: 20},
        { header: 'ASSIGNED TO', key: 'assignedTo', width: 20},
        { header: 'SUMMARY', key: 'summary', width: 30 },
        { header: 'PRIORITY', key: 'priority', width: 15 },
        { header: 'RAISED ON', key: 'createdAt', width: 25 },
        { header: 'STATUS', key: 'status', width: 15 },
        { header: 'STATUS CHANGED BY', key: 'statusChangedBy', width: 25 },
        { header: 'STATUS CHANGED ON', key: 'statusChangedOn', width: 25 },
        { header: 'Resolved Date', key: 'resolvedDate', width: 25 },
        { header: 'CATEGORY', key: 'category', width: 15 },
        { header: 'Comment', key: 'comment', width: 25 },
      ];
      worksheet.getColumn(8).alignment = { wrapText: true };
      worksheet.getRow(1).font = {
        color: {argb: 'FFFFFFFF'},
        size: 10,
        bold: true
      };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {argb: 'FF0047B3'}
      };
      complaintData.forEach((complaintElement,index) => {
        let activityHistories =  complaintElement?.node?.activityHistory?.edges?.filter(node =>
          node.node.action === 'editIncidentStatus');
          activityHistories = _.sortBy(activityHistories,({node})=>{
            return node.createdAt;
          }); 
          const activityHistory = activityHistories[activityHistories.length -1];
        //  console.log('TASKDATA------------> ',activityHistory);
        const comments = complaintElement.node.comments.edges.map((ele, index) => `${index+1.} ${ele.node.comment}`+"\r\n");
        worksheet.addRow({
          displayId: complaintElement.node.displayId,
          societyName: complaintElement.node.serviceSubscription.society.name,
          summary: complaintElement.node.summary,
          name: complaintElement.node.serviceSubscription.service.name,
          createdBy: `${complaintElement.node.createdBy.firstName ? complaintElement.node.createdBy.firstName : "" } ${complaintElement.node.createdBy.LastName ? complaintElement.node.createdBy.LastName : ""}`,
          assignedTo: `${complaintElement.node.assignee.firstName ? complaintElement.node.assignee.firstName : "" } ${complaintElement.node.assignee.lastName ? complaintElement.node.assignee.lastName : ""} `,
          priority: complaintElement.node.priority,
          createdAt: moment(complaintElement.node.createdAt).format("DD/MM/YYYY"),
          status: activityHistory?.node?.value != null ? activityHistory?.node?.value : complaintElement.node.status,
          statusChangedBy: `${activityHistory?.node?.createdBy?.firstName ? activityHistory?.node?.createdBy?.firstName : complaintElement?.node?.createdBy?.firstName } ${activityHistory?.node?.createdBy?.LastName ? activityHistory?.node?.createdBy?.LastName : complaintElement?.node?.createdBy?.lastName}`,
          statusChangedOn:  activityHistory?.node?.createdAt ? moment(activityHistory?.node?.createdAt).format("DD/MM/YYYY") : moment(complaintElement?.node?.createdAt).format("DD/MM/YYYY"),
          resolvedDate: complaintElement.node.status == 'RESOLVED' ? moment(complaintElement.node.updatedAt).format("DD/MM/YYYY") : '-',
          category: complaintElement.node.category,
          comment: comments.join(""),
        });
      });
  
      const convertFileToBuffer = async() => {
        const fileBuffer = await workbook.xlsx.writeBuffer();
        const fileName = `Complaint_Report_${moment().format('YYYY-MM-DD')}.xlsx`;
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
    } catch(error) {
      reject('Failed to generate complaint report.');
    }
  });
}

export const generateComplaintReport = {
  execute,
};
