const ExcelJS = require('exceljs');
import { get, map } from 'lodash';
import moment from 'moment';
import executeGraphql from '../../../util/graphqlClient';
import { renderFile } from 'pug';
import { getConfiguredEmailIds, sendEmail } from '../../../util/ses';
import { GET_SERVICE_REQUESTS_FOR_DAILY_REPORT } from '../../graphql/queries/reports/getServiceRequestsForDailyReport';
import { GET_PARTNER_SERVICE_REQUESTS_FOR_DAILY_REPORT } from '../../graphql/queries/reports/getPartnerServiceRequestsForDailyReport';
import { GET_PARTNERS_FOR_DAILY_REPORT } from '../../graphql/queries/reports/getPartnersForDailyReport';
import { GET_SOCIETIES_FOR_DAILY_REPORT } from '../../graphql/queries/reports/getSocietiesForDailyReport';

import {
  getUserById,
  setUserForCloudFunctionAndTriggersIfRequired,
} from '../../../util/user';

async function getServiceRequestsData(req: Parse.Cloud.FunctionRequest, startDate: Date, endDate: Date) {
  const { recordCount } = req.params;
  const serviceRequestsRes = await executeGraphql(req.user, GET_SERVICE_REQUESTS_FOR_DAILY_REPORT, {
    startDate,
    endDate,
    recordCount
  }, true);
  return get(serviceRequestsRes, 'data.serviceRequests.edges');
}

async function getPartnerServiceRequestsData(req: Parse.Cloud.FunctionRequest, startDate: Date, endDate: Date) {
  const { recordCount } = req.params;
  const partnerServiceRequestsRes = await executeGraphql(req.user, GET_PARTNER_SERVICE_REQUESTS_FOR_DAILY_REPORT, {
    startDate,
    endDate,
    recordCount
  }, true);
  return get(partnerServiceRequestsRes, 'data.partnerServiceRequests.edges');
}

async function getSocietiesData(req: Parse.Cloud.FunctionRequest, startDate: Date, endDate: Date) {
  const { recordCount } = req.params;
  const societiesRes = await executeGraphql(req.user, GET_SOCIETIES_FOR_DAILY_REPORT, {
    startDate,
    endDate,
    recordCount
  }, true);
  return get(societiesRes, 'data.societies.edges');
}


async function getPartnersData(req: Parse.Cloud.FunctionRequest, startDate: Date, endDate: Date) {
  const { recordCount } = req.params;
  const partnersRes = await executeGraphql(req.user, GET_PARTNERS_FOR_DAILY_REPORT, {
    startDate,
    endDate,
    recordCount
  }, true);
  return get(partnersRes, 'data.partners.edges');
}


async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  console.log('################ GENERATE DAILY REPORT ###############');
  const endDate: any = moment().startOf('day').add('21','hours');
  const startDate: any = moment().startOf('day').add('21','hours').subtract('1','day');
  
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Prophandy Technologies Pvt. Ltd.(Inspacco)';
  workbook.lastModifiedBy = 'Prophandy Technologies Pvt. Ltd.(Inspacco)';
  workbook.created = new Date();
  workbook.modified = new Date();
  await addServiceRequestReport(req, workbook, startDate, endDate);
  await addPartnerServiceRequestReport(req, workbook, startDate, endDate);
  await addPartnersReport(req, workbook, startDate, endDate);
  await addSocietiesReport(req, workbook, startDate, endDate);
  
  return new Promise((resolve, reject) => {
    try {
      const convertFileToBuffer = async() => {
        const fileBuffer = await workbook.xlsx.writeBuffer();
        const fileName = `Daily_Report_${moment().format('YYYY-MM-DD')}.xlsx`;
        const file = new Parse.File(
          fileName,
          Array.from(Buffer.from(fileBuffer))
        );
        return await file.save();
      };
      const convertFileToBase64 = async () => {
        const file = await convertFileToBuffer();
        sendReport(file, startDate, endDate);
        return resolve(file.url());
      };
      convertFileToBase64();
    } catch(error) {
      console.log(error);
      reject('Failed to generate daily report.');
    }
  });
}

async function addServiceRequestReport(
    req: Parse.Cloud.FunctionRequest, workbook: any,
    startDate: any, endDate: any
  ) {
  const serviceRequestsData = await getServiceRequestsData(req, startDate.toDate(), endDate.toDate());  
  const worksheet = workbook.addWorksheet(`ServiceRequests`);
  worksheet.columns = [
    { header: 'SERVICE REQUEST ID', key: 'displayId', width: 15 },
    { header: 'REQUESTER NAME', key: 'requesterName', width: 25 },
    { header: 'REQUESTER MOBILE', key: 'requesterMobile', width: 25 },
    { header: 'SOCIETY', key: 'societyName', width: 20},
    { header: 'SERVICE NAME', key: 'serviceName', width: 15 },
    { header: 'RAISED ON', key: 'createdAt', width: 25 },
    { header: 'STATUS', key: 'status', width: 25 },
    { header: 'COMMENTS', key: 'comments', width: 25 },
  ];
  worksheet.getColumn(8).alignment = { wrapText: true };
  addHeaderStyle(worksheet);
  serviceRequestsData.forEach((serviceRequestElement,index) => {
    const serviceRequest = serviceRequestElement.node;
    const requester = serviceRequest.requester;
    const requesterName = requester ? `${requester.firstName} ${requester.lastName}` : 'NA';
    const comments = serviceRequest.comments.edges.map((ele, index) => `${index+1.} ${ele.node.comment}`+"\r\n");
    worksheet.addRow({
      displayId: serviceRequest.displayId,
      requesterName: requesterName,
      requesterMobile: serviceRequest.requester?.mobileNumber,
      societyName: serviceRequest.society?.name,
      serviceName: serviceRequest.service?.name,
      createdAt: serviceRequest.createdAt,
      status: serviceRequest.status,
      comments: comments.join("|"),
    });
  });
}

async function addPartnerServiceRequestReport(
    req: Parse.Cloud.FunctionRequest, workbook: any,
    startDate: any, endDate: any
  ) {
  const partnerServiceRequestsData = await getPartnerServiceRequestsData(req, startDate.toDate(), endDate.toDate());
  
  const worksheet = workbook.addWorksheet('PartnerServiceRequests');

  worksheet.columns = [
    { header: 'SERVICE REQUEST ID', key: 'displayId', width: 15 },
    { header: 'REQUESTER NAME', key: 'requesterName', width: 25 },
    { header: 'REQUESTER MOBILE', key: 'requesterMobile', width: 25 },
    { header: 'SOCIETY', key: 'societyName', width: 20},
    { header: 'SERVICE NAME', key: 'serviceName', width: 15 },
    { header: 'PARTNER NAME', key: 'partnerName', width: 15 },
    { header: 'ASSIGNED ON', key: 'assignedOn', width: 25 },
    { header: 'STATUS', key: 'status', width: 25 }
  ];

  worksheet.getColumn(8).alignment = { wrapText: true };

  addHeaderStyle(worksheet);

  return await Promise.all(
    partnerServiceRequestsData.map(async(partnerServiceRequestElement) => {
      const partnerServiceRequestId = partnerServiceRequestElement.node.objectId;
      const PartnerServiceRequest = Parse.Object.extend('PartnerServiceRequest');
      const query = new Parse.Query(PartnerServiceRequest);
      query.equalTo('objectId',partnerServiceRequestId);
      query.include('serviceRequest.requester');
      query.include('serviceRequest.society');
      query.include('partner');
      query.include('service');
      query.limit(1);
      const partnerServiceRequests = await query.find({ useMasterKey: true });

      if(partnerServiceRequests[0]) {
        const partnerServiceRequest = partnerServiceRequests[0];
        const serviceRequest = partnerServiceRequest.get('serviceRequest');
        if(serviceRequest) {
          const society = serviceRequest.get('society');
          const requester = serviceRequest.get('requester');
          const requesterName = requester ? `${requester.get('firstName')} ${requester.get('lastName')}` : 'NA';
          const service = partnerServiceRequest.get('service');
          const partner = partnerServiceRequest.get('partner');
          const row = {
            displayId: partnerServiceRequest.get('displayId'),
            requesterName: requesterName,
            requesterMobile: serviceRequest.get('requester').get('mobileNumber'),
            societyName: society?.get('name'),
            serviceName: service?.get('name'),
            partnerName: partner?.get('name'),
            assignedOn: partnerServiceRequest.createdAt,
            status: partnerServiceRequest.get('status')
          };
          worksheet.addRow(row);
        }
      }
    })
  );
}

async function addPartnersReport(
    req: Parse.Cloud.FunctionRequest, workbook: any,
    startDate: any, endDate: any
  ) {
  const partnersData = await getPartnersData(req, startDate.toDate(), endDate.toDate());  
  const worksheet = workbook.addWorksheet(`Partners`);
  worksheet.columns = [
    { header: 'PARTNER ID', key: 'displayId', width: 15 },
    { header: 'PARTNER NAME', key: 'partnerName', width: 15 },
    { header: 'PARTNER ADDRESS', key: 'partnerAddress', width: 15 },
    { header: 'PARTNER MOBILE', key: 'partnerMobile', width: 15 },
    { header: 'PARTNER EMAIL', key: 'partnerEmail', width: 15 },
    { header: 'PARTNER WEBSITE', key: 'partnerWebsite', width: 15 },
    { header: 'PARTNER DESCRIPTION', key: 'partnerDescription', width: 15 },
    { header: 'PARTNER ESTD', key: 'partnerEstd', width: 15 },
    { header: 'PARTNER CLIENTS', key: 'partnerClients', width: 15 },
    { header: 'PARTNER ANNUAL TURNOVER', key: 'partnerTurnover', width: 15 },
    { header: 'PARTNER EXPERIENCE', key: 'partnerExperience', width: 15 },
    { header: 'PARTNER SERVICES', key: 'partnerServices', width: 15 },
    { header: 'PARTNER GST', key: 'partnerGst', width: 15 },
    { header: 'PARTNER PAN', key: 'partnerPan', width: 15 },
  ];
  addHeaderStyle(worksheet);
  partnersData.forEach((partnerElement,index) => {
    const partner = partnerElement.node;
    worksheet.addRow({
      displayId: partner.displayId,
      partnerName: partner.name,
      partnerAddress: partner.fullAddress,
      partnerMobile: partner.mobileNumber,
      partnerEmail: partner.email,
      partnerWebsite: partner.website,
      partnerDescription: partner.description,
      partnerEstd: partner.estd,
      partnerClients: partner.numberOfClients,
      partnerTurnover: partner.annualTurnover,
      partnerExperience: partner.experience,
      partnerServices: partner.serviceNames,
      partnerGst: partner.gstNumber,
      partnerPan: partner.pan,
    });
  });
}

async function addSocietiesReport(
    req: Parse.Cloud.FunctionRequest, workbook: any,
    startDate: any, endDate: any
  ) {
  const societiesData = await getSocietiesData(req, startDate.toDate(), endDate.toDate());
  const worksheet = workbook.addWorksheet(`Societies`);
  worksheet.columns = [
    { header: 'SOCIETY ID', key: 'displayId', width: 15 },
    { header: 'SOCIETY NAME', key: 'societyName', width: 15 },
    { header: 'SOCIETY EMAIL', key: 'societyEmail', width: 15 },
    { header: 'SOCIETY ADDRESS', key: 'societyAddress', width: 15 },
    { header: 'SOCIETY STATUS', key: 'societyStatus', width: 15 },
    { header: 'SOCIETY AMENITIES', key: 'societyAmenities', width: 15 },
    { header: 'SOCIETY ADMIN NAME', key: 'societyAdminName', width: 15 },
    { header: 'SOCIETY ADMIN MOBILE', key: 'societyAdminMobile', width: 15 },
  ];
  addHeaderStyle(worksheet);
  return await Promise.all(
    societiesData.map(async(societyElement) => {
      const society = societyElement.node;
      let societyAdmin: any = null;
      try{
        const Society = Parse.Object.extend('Society');
        const societyObject = new Society();
        societyObject.id = society.objectId;
        const SocietyMember = Parse.Object.extend('SocietyMember');
        const query = new Parse.Query(SocietyMember);
        query.equalTo("society", societyObject);
        query.equalTo("type", 'SOCIETY_ADMIN');
        query.limit(1);
        const societyMembers = await query.find({useMasterKey: true});
        const societyMember = societyMembers[0];
        societyAdmin = societyMember ? await getUserById(societyMember.get('member').id) : null;
      } catch(e) {
      }
      
      const societyAdminName = societyAdmin ? `${societyAdmin.get('firstName')} ${societyAdmin.get('lastName')}` : 'NA';
      const fullAddress = [
        society.addressLine1,
        society.addressLine2,
        society.area,
        society.city,
        society.state,
        society.pincode
      ].join(',');
      const amenities = map(society.amenities, (amenity)=>{ return amenity.value; });

      worksheet.addRow({
        displayId: society.displayId,
        societyName: society.name,
        societyEmail: society.email,
        societyAddress: fullAddress,
        societyStatus: society.status,
        societyAmenities: amenities.join('|'),
        societyAdminName: societyAdminName,
        societyAdminMobile: societyAdmin?.get('mobileNumber')
      });
    })
  );
}

function addHeaderStyle(worksheet) {
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
}

async function sendReport(file, startDate, endDate) {
  const sendEmailTo = await getConfiguredEmailIds();
  await sendEmail(
    sendEmailTo,
    '[Inspacco] Daily Report',
    renderFile('./src/emailTemplates/reports/sendDailyReport.pug', {
      startDate: moment(startDate).format('DD-MM-YYYY'),
      endDate: moment(endDate).format('DD-MM-YYYY')
    }),
    true,
    [{ filename: "report.xlsx", path: file.url() }]
  );
}

export const generateDailyReport = {
  execute,
};
