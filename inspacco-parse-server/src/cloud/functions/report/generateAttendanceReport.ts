const ExcelJS = require('exceljs');
import { chain, filter, find, get, orderBy, uniq, groupBy } from 'lodash';
import moment from 'moment-timezone';
import { COLLECTIONS, TIMEZONE } from '../../../constants/common';
import { GET_SOCIETY_LEVEL_STAFF_BY_SERVICE_SUBSCRIPTION_FOR_DATE_RANGE, GET_SOCIETY_LEVEL_STAFF_FOR_DATE_RANGE } from '../../graphql/queries/getSocietyLevelStaffForDateRange';
import executeGraphql from '../../../util/graphqlClient';
import { GET_ATTENDANCE_FOR_DATE } from '../../graphql/queries/getAttendanceForDate';
import { calculateBillingDays, diff_hours, getOTInHours, getSchemaQuery } from '../../../util/index';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

export interface IAttendanceDetails {
  isPresent: string;
  shift: string;
}
type attendaceData = {
  outTime: any;
  inTime: any;
  date: any;
  mode: any;
  staffId: string;
  staffName: string;
  siteName: string;
  type?: string;
  shift: any;
  isPresent: boolean;
  profileImage?: string;
  isTemporary?: boolean;
  attendanceDetails?: IAttendanceDetails[];
};
const targetedServices = [
  'Housekeeping',
  'Security',
  'Gardening',
  'Society Manager',
  'Plumber',
  'Electrician',
  'MST',
  'Accountant',
  'Society Supervisor',
  'STP Services',
  'Club House Management'
];
async function getAttendance(req: Parse.Cloud.FunctionRequest, serviceSubscriptionIds) {
  let { startDate, endDate } = req.params;
  const { recordCount } = req.params;
  startDate = moment(startDate).startOf('day').toISOString();
  endDate = moment(endDate).endOf('day').toISOString();
  const attendanceRes = await executeGraphql(req.user, GET_ATTENDANCE_FOR_DATE, {
    serviceSubscriptionIds,
    startDate,
    endDate,
    recordCount
  });
  return get(attendanceRes, 'data.attendances.edges');
}

async function getServiceStaffData(req: Parse.Cloud.FunctionRequest) {
  const { societyId, recordCount, serviceSubscriptionIds,source } = req.params;
  let { startDate, endDate } = req.params;
  if(source !== 'web'){
    startDate = moment(startDate).startOf('day').toISOString();
    endDate = moment(endDate).endOf('day').toISOString();
  }
  let serviceStaffData = null;
  if (serviceSubscriptionIds && Array.isArray(serviceSubscriptionIds)) {
    serviceStaffData = await executeGraphql(req.user, GET_SOCIETY_LEVEL_STAFF_BY_SERVICE_SUBSCRIPTION_FOR_DATE_RANGE,
      {
        serviceSubscriptionIds,
        startDate,
        endDate,
        recordCount
      }
    );
  } else {
    serviceStaffData = await executeGraphql(req.user, GET_SOCIETY_LEVEL_STAFF_FOR_DATE_RANGE,
      {
        societyId,
        startDate,
        endDate,
        recordCount
      }
    );
  }
  return get(serviceStaffData, 'data.serviceStaffs.edges');
}

async function execute(req: Parse.Cloud.FunctionRequest) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  console.log('################ GENERATE ATTENDANCE REPORT ###############');
  const serviceStaffData = await getServiceStaffData(req);
  const { startDate, endDate } = req.params;
  const serviceSubscriptionIds = uniq(
    serviceStaffData?.map((serviceStaff) => {
      return serviceStaff.node.serviceSubscription.objectId;
    })
  );
  const attendance = await getAttendance(req, serviceSubscriptionIds);



  let services = [];
  const detailedAttendance = [];
  if (serviceStaffData && serviceStaffData.length > 0) {
    services = orderBy(
      serviceStaffData,
      [(data) => [data.node.serviceSubscription.service.displayOrder]],
      ['asc']
    );
  }

  const setStaffAttendace = (
    serviceName: string,
    attendanceData: attendaceData[]
  ) => {

    attendanceData.map((attendanceItem: attendaceData) => {
      const isStaffFound = detailedAttendance.find((obj) => {
        const date1 = moment(attendanceItem.date).format('D/MM/YYYY');
        const date2 = moment(obj.date).format('D/MM/YYYY');
        return obj.staffId === attendanceItem.staffId && obj.serviceName === serviceName && date1 === date2;
      });
      if (isStaffFound) {
        // const hourlyData = checkPresentHours(attendanceItem.attendanceDetails);
        // isStaffFound.numberOfDays += hourlyData.numberOfDays;
        isStaffFound.numberOfShift += 1;
      } else {
        // const hourlyData = checkPresentHours(attendanceItem.attendanceDetails);
        detailedAttendance.push({
          staffId: attendanceItem.staffId,
          staffName: attendanceItem.staffName,
          siteName: attendanceItem.siteName,
          serviceName,
          mode: attendanceItem.mode,
          date: moment(attendanceItem.date).tz(TIMEZONE).toDate(),
          inTime: attendanceItem.inTime,
          outTime: attendanceItem.outTime,
          // numberOfDays: hourlyData.numberOfDays,
          numberOfShift: 0,
          shift: attendanceItem.shift
        });
      }
    });
  };
  chain(services)
    .uniqBy(
      (serviceStaffRec) => serviceStaffRec.node.serviceSubscription.objectId
    )
    .map((serviceStaffRec) => serviceStaffRec.node.serviceSubscription)
    .value()
    .forEach((serviceSubscriptionRec) => {
      const attendanceRecords = filter(
        attendance,
        (attendanceRec) => {
          return (
            attendanceRec.node?.serviceStaff?.serviceSubscription
              ?.objectId === serviceSubscriptionRec.objectId
          );
        }
      );

      // if (targetedServices.includes(serviceSubscriptionRec.service.name)) {
      const attendanceData = attendanceRecords.map((rec) => {
        // console.log('Rec---------> ', rec.node.serviceStaff);

        const { firstName, lastName, objectId } = rec.node.serviceStaff.staff;
        return {
          staffId: objectId,
          staffName: `${firstName} ${lastName}`,
          siteName: rec.node.serviceStaff.serviceSubscription.society.name,
          type: rec.node.serviceStaff.type,
          shift: rec.node.serviceStaff.shift != null ? rec.node.serviceStaff.shift.shiftType : undefined,
          // shift: rec.node.shift,
          mode: rec.node.mode,
          date: rec.node.date,
          inTime: rec.node.inTime,
          outTime: rec.node.outTime,
          isPresent: rec.node.isPresent,
          isTemporary: rec.node.isTemporary,
          attendanceDetails: rec?.node?.attendanceDetails
            ? JSON.parse(rec.node.attendanceDetails)
            : [],
        };
      });
      // console.log("Attendance Data==============>\n", attendanceData);

      setStaffAttendace(
        serviceSubscriptionRec.service.name,
        attendanceData
      );
    }
      // }
    );
  return new Promise((resolve, reject) => {
    try {
      const staffs = groupBy(detailedAttendance, (att) => att.staffId);
      //   console.log(staffs);


      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Prophandy Technologies Pvt. Ltd.(Inspacco)';
      workbook.lastModifiedBy = 'Prophandy Technologies Pvt. Ltd.(Inspacco)';
      workbook.created = new Date();
      workbook.modified = new Date();
      const worksheet = workbook.addWorksheet(`${moment(startDate).format('DD-MM-YYYY')} To ${moment(endDate).format('DD-MM-YYYY')}`);


      const attendanceData = [];

      for (const staffid in staffs) {
        // const staff = staffs[staffid]
        const myStaff = staffs[staffid][0] || {};
        const shift = myStaff.shift || {
          startTime: "09:30",
          endTime: "18:30",
        };

        const attendeeData = {
          staffId: staffid,
          siteName: myStaff.siteName,
          serviceName: myStaff.serviceName,
          staffName: myStaff.staffName,
          raw: []
        };
        let date = new Date(startDate);
        let presentDays = 0;
        let totalOTInHours = 0;

        while (date <= new Date(endDate)) {
          const staff = staffs[staffid].find(
            (obj) =>
              new Date(obj.date).toLocaleDateString() === date.toLocaleDateString()
          );
          if (staff) {
            const OTHours = getOTInHours(shift, staff.inTime, staff.outTime);
            totalOTInHours += OTHours;
            const inTime = staff.inTime
              ? moment(staff.inTime).tz(TIMEZONE).format("hh:mm A")
              : "-";
            const outTime = staff.outTime
              ? moment(staff.outTime).tz(TIMEZONE).format("hh:mm A")
              : "-";
            // attendeeData[
            //   date.toLocaleDateString()
            // ] = `In Time: ${inTime}\nOut Time: ${outTime}\nNo Of Hours : ${diff_hours(
            //   staff.outTime,
            //   staff.inTime
            // )}\nOT: ${OTHours}\nmode : ${staff.mode}`;
            // attendanceData["present"] = true;
            attendeeData[date.toLocaleDateString()] = 'Present';
            attendeeData['raw'].push({
              name: date.toLocaleDateString(), value: {
                'In Time': inTime,
                'Out Time': outTime,
                'No Of Hours': diff_hours(staff.outTime, staff.inTime),
                'OT': OTHours,
                'mode': staff.mode
              }
            });
            presentDays++;
          } else {
            attendeeData[date.toLocaleDateString()] = "Absent";
            attendeeData["present"] = false;
            attendeeData['raw'].push({
              name: date.toLocaleDateString(), value: {
                'In Time': '',
                'Out Time': '',
                'No Of Hours': '',
                'OT': '',
                'mode': ''
              }
            });
            // attendeeData["present"] = false;
          }
          date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        }
        attendeeData["presentDays"] = presentDays;
        attendeeData["totalOTInHours"] = totalOTInHours;
        attendeeData["billingDays"] = calculateBillingDays(
          shift,
          totalOTInHours,
          presentDays
        );
        attendanceData.push({ ...attendeeData, attendanceFields: 'Attendance State' });
        ['In Time', 'Out Time', 'No Of Hours', 'OT', 'mode'].forEach(field => {
          const newObj = { attendanceFields: field };
          attendeeData.raw.forEach(obj => {

            newObj[obj.name] = obj.value[field];
          });
          attendanceData.push(newObj);

        });
      }

      // console.log(attendanceData);
      const dateColumns = [];
      let date = new Date(startDate);
      while (date <= new Date(endDate)) {
        dateColumns.push({
          header: date.toLocaleDateString(),
          key: date.toLocaleDateString(),
          width: 20,
          //   style: { font: { name: "Arial Black" } },
        });
        date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      }

      worksheet.views = [{}];
      worksheet.columns = [
        { header: "Staff Name", key: "staffName", width: 20 },
        { header: "Service Name", key: "serviceName", width: 20 },
        { header: "Site Name", key: "siteName", width: 20 },
        { header: "Present Days", key: "presentDays", width: 20 },
        { header: "Total OT in Hours", key: "totalOTInHours", width: 20 },
        {
          header: "Billing Days (Present Days + OT Days)",
          key: "billingDays",
          width: 20,
        },
        {
          header: 'Days -',
          key: 'attendanceFields',
          width: 30
        },
        ...dateColumns,
      ];
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "cccccc" },
      };
      worksheet.getRow(1).font = { bold: true };

      attendanceData.forEach((attendee) => {
        const row = worksheet.addRow(attendee);
        if (attendee.presentDays) {
          row.alignment = { wrapText: true, vertical: "middle" };
        }
        row.eachCell((cell, colNumber) => {
          //red=>FF0000
          //white>FFFFFF
          if (cell.value === "Absent") {
            row.getCell(colNumber).font = { bold: true, color: { argb: "FF0000" } };
            // row.getCell(colNumber).fill = {
            //     type: 'pattern',
            //     pattern: 'solid',
            //     fgColor: {argb: 'FF0000'}
            // };
          }
        });
      });
      const convertFileToBuffer = async () => {
        const fileBuffer = await workbook.xlsx.writeBuffer();
        const fileName = `Attendance_Report_${moment().format('YYYY-MM-DD')}.xlsx`;
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
      
      reject('Failed to generate attendance report.');
    }
  });
}

export const generateAttendanceReport = {
  execute,
};
