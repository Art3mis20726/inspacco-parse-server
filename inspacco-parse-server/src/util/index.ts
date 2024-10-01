
import http from 'http';
import fs from 'fs';
import moment from 'moment';
import { TIMEZONE } from '../constants/common';
// import { sendEmail } from './email';
import { sendEmail } from './ses';
export const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const request = http.get(url, function (response) {
      response.pipe(file);
      // after download completed close filestream
      file.on("finish", () => {
        file.close();
        resolve(dest);
      });
    }).on('error', (e) => {
      reject(e.message);
      fs.unlink(dest, () => {
        return null;
      }); // Delete the file async. (But we don't check the result)
    });

  });
};

export const promiseAllSettled = function (promises) {
  const mappedPromises = promises.map((p) => {
    return p
      .then((value) => {
        return {
          status: 'fulfilled',
          value,
        };
      })
      .catch((reason) => {
        return {
          status: 'rejected',
          reason,
        };
      });
  });
  return Promise.all(mappedPromises);
};

export const getSaveOrQueryOption = (user) => {
  const option = user && !user.useMasterKey
    ? { sessionToken: user.getSessionToken() }
    : { useMasterKey: true };
  return option;
};
export const getSchemaQuery = (schemaname) => {
  return (queryObj, user) => {
    const query = getQuery(schemaname);
    Object.keys(queryObj).forEach(field => {
      query.equalTo(field, queryObj[field]);
    });
    return query.first(getSaveOrQueryOption(user));
  };
};
export const getSchemaFindQuery = (schemaname) => {
  return (queryObj, user) => {
    const query = getQuery(schemaname);
    Object.keys(queryObj).forEach(field => {
      query.equalTo(field, queryObj[field]);
    });
    return query.find(getSaveOrQueryOption(user));
  };
};
export function createRecord(schemaname) {
  return (obj, user) => {
    const Schema = Parse.Object.extend(schemaname);
    const schema = new Schema();
    return schema.save(obj, getSaveOrQueryOption(user));
  };
}
export const getQuery = (schemaname) => {
  const Schema = Parse.Object.extend(schemaname);
  return new Parse.Query(Schema);
};
export const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
export function getOTInHours(shift, inTime, outTime) {
  const { startTime = "09:30", endTime = "18:30" } = shift;
  const shiftHours: number = calculateHours(startTime, endTime);
  const attendanceHours: number = diff_hours(outTime, inTime);
  return attendanceHours <= shiftHours ? 0 : attendanceHours - shiftHours;
}
export function calculateHours(startTime, endTime) {
  const start = startTime.split(":");
  const end = endTime.split(":");
  const startDate = new Date();
  const endDate = new Date();
  startDate.setHours(start[0]);
  startDate.setMinutes(start[1]);
  endDate.setHours(end[0]);
  endDate.setMinutes(end[1]);
  const diff = endDate.getTime() - startDate.getTime();
  const hours = diff / 1000 / 60 / 60;
  return hours;
}

export function diff_hours(dt2, dt1) {
  if (dt2 && dt1) {
    dt2 = new Date(dt2);
    dt1 = new Date(dt1);
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return parseFloat(Math.abs(diff).toFixed(1));
  } else {
    return 0;
  }
}
export function calculateBillingDays(shift, totalOTInHours, presentDays) {
  const { startTime = "09:30", endTime = "18:30" } = shift;
  const shiftHours = calculateHours(startTime, endTime);
  const OTDays = totalOTInHours / shiftHours;
  return (OTDays + presentDays).toFixed(1);
}
export const getFullName = (obj) => {
  if (!obj && typeof obj !== 'object') {
    return 'N/A';
  }
  if (!(obj.firstName || obj.lastName)) {
    return 'N/A';
  }
  return `${obj?.firstName} ${obj?.lastName}`;
};
export const getDateInReportFormat = (date) => {
  if (!date) {
    return '';
  }
  const momentDate = moment.tz(date, TIMEZONE);
  if (!momentDate.isValid()) return 'N/A';
  return momentDate.format("DD/MM/YYYY");
};
export const getDateTimeInReportFormat = async (date) => {
  if (!date) {
    return '';
  }
  const momentDate = moment.tz(date, TIMEZONE);
  if (!momentDate.isValid()) return 'N/A';
  return momentDate.format("DD/MM/YYYY HH:mm A");
};
export const sendBulkUploadStatusMail = async ({ subject, allSettledResponse = [], emailIds = [], records = [], fields = [] }) => {

  const resultHtml = allSettledResponse.map((result: any, index) => {
    const record = records[index] || {};
    const tdsHtml = fields?.map(field => `<td style="border-collapse:collapse;font-family:Verdana, sant-serif;padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;text-align:left;" > ${record[field] || 'N/A'}</td>`);
    return `<tr>
         ${tdsHtml}
          <td style="color: ${result.status === 'fulfilled' ? 'green' : 'red'};border-collapse:collapse;font-family:Verdana, sant-serif;padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;text-align:left;" > ${result.status === 'fulfilled' ? 'Success' : 'Rejected'} </td>
          <td style="border-collapse:collapse;font-family:Verdana, sant-serif;padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;text-align:left;" >  ${result.reason
        ? result.reason instanceof Error
          ? result.reason.message
          : result.reason
        : ''
      }</td>
        </tr>`;
  });
  const columnHtml = fields?.map(field => `<th style="border-collapse:collapse;font-family:Verdana, sant-serif;padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;text-align:left;" >${field} </th>`);
  const emailHtml = `<html>
       <body>
         <table style="border-collapse:collapse;font-family:Verdana, sant-serif;" >
           <thead>
           ${columnHtml}
            <th style="border-collapse:collapse;font-family:Verdana, sant-serif;padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;text-align:left;" >Status </th>
            <th style="border-collapse:collapse;font-family:Verdana, sant-serif;padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;text-align:left;" >Error </th>
           </thead>
           <tbody>
             ${resultHtml}
           </tbody>
         </table>
       </body>
    </html/>
    `;
    // sendEmail
  await sendEmail(
    emailIds,
    subject || 'Upload Status',
    emailHtml,
    true
  );
};