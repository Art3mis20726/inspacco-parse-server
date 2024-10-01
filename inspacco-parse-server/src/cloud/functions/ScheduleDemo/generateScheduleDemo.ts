import { renderFile } from 'pug';
import { NOTIFICATION_MSG } from '../../../constants/notificationMessages';
import { NOTIFICATION_CATEGORY } from '../../../constants/common';
import { getConfiguredEmailIds, sendEmail } from '../../../util/email';
import { getNotificationBody, getNotificationTitle, sendNotificationToInsapccoAdmin } from '../../../util/notification';
import { sendSMS } from '../../../util/sendSms';
import { compact, get } from 'lodash';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';

async function execute(
  req: Parse.Cloud.FunctionRequest,
) { 
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  switch (req.params.type) {
    case 'SCHEDULE_DEMO':
      return scheduleDemo(req);
    default:
      return {
        code: 200,
        message: 'Nofication type does not matched',
      };
  }
}

async function scheduleDemo(req: Parse.Cloud.FunctionRequest) {
//   const userMobile = req.user.get('mobileNumber');
//   const message = `Dear Customer, Welcome aboard! Thank you for submitting the request, One of our representative will contact you to take this further - Prophandy Technologies Pvt Ltd (Inspacco)`;
//   const contentId = '1707162359152794387';
//   const smsStatusText = await sendSMS(userMobile, message, contentId);

  const sendEmailTo = await getConfiguredEmailIds();
  const emailRes = await sendEmail(
    sendEmailTo,
    'Schedule Demo Request',
    renderFile('./src/emailTemplates/scheduleDemo.pug', {
      contactNumber: req.params.data.mobileNumber ? req.params.data.mobileNumber : `-`,
      name:`${req.params.data.name}`,
      companyName: req.params.data.companyName ? `${req.params.data.companyName}` : `-`,
      email: req.params.data.email ? `${req.params.data.email}` : `-`
    }),
    true
  );

  //Start Notification
//   const data = req.params.data ? JSON.stringify(req.params.data) : '-';
//   const notificationTitle = getNotificationTitle('AVAIL_SERVICES');
//   const notificationBody = getNotificationBody('AVAIL_SERVICES', {
//     name: compact([req.user.get('firstName'), req.user.get('lastName')]).join(
//       ' '
//     ),
//     services: req.params.data?.services.join(', '),
//   })
//   sendNotificationToInsapccoAdmin(
//     req,
//     notificationTitle,
//     notificationBody,
//     NOTIFICATION_CATEGORY.guest
//   );
 //End Notification

//   return {
//     code: 200,
//     message: `Avail service SMS send succesfully to ${userMobile} for ${data}.`,
//     smsStatus: smsStatusText ? smsStatusText : 'Error',
//   };
}

// async function provideService(req: Parse.Cloud.FunctionRequest) {
//   const userMobile = get(req.params.data,'mobileNumber',null)|| req.user.get('mobileNumber');
//   const message = `Dear Supplier Partner, Welcome aboard! Thank you for submitting the request, One of our representative will contact you to take this further - Prophandy Technologies Pvt Ltd (Inspacco)`;
//   const contentId = '1707162359169731530';
//   const smsStatusText = await sendSMS(userMobile, message, contentId);
//   const sendEmailTo = await getConfiguredEmailIds();
//   await sendEmail(
//     sendEmailTo,
//     '[Inspacco Mobile] Provide service request',
//     renderFile('./src/emailTemplates/provideServiceRequest.pug', {
//       contactNumber: userMobile ,
//       name: get(req.params.data,'fullName','') || `${req.user.get('fullName')||''}`,
//       services: get(req.params.data,'serviceInfo',''),
//       email: get(req.params.data,'email','')
//     }),
//     true
//   );
//   //Start Notification
//   const data = req.params.data ? JSON.stringify(req.params.data) : '-';
//   const notificationTitle = getNotificationTitle('PROVIDE_SERVICES');
//   const notificationBody = getNotificationBody('PROVIDE_SERVICES', {
//     name: `${get(req.params.data,'fullName','-')}`,
//     services:`${get(req.params.data,'serviceInfo','-')}`,
//     contactNumber: userMobile,
//   })
//   sendNotificationToInsapccoAdmin(
//     req,
//     notificationTitle,
//     notificationBody,
//     NOTIFICATION_CATEGORY.guest
//   );
//  //End Notification
//   return {
//     code: 200,
//     message: `Provide Service SMS send succesfully to ${userMobile} for ${data}`,
//     smsStatus: smsStatusText ? smsStatusText : 'Error',
//   };
// }

// async function onboardUser(req: Parse.Cloud.FunctionRequest) {
//   const userMobile = req.user.get('mobileNumber');
//   const userName = req.user.get('firstName');
//   const appUrl = 'https://tinyurl.com/fcddbpxm';
//   const message = `Dear ${userName}, You have been successfully on-boarded with Inspacco, 
//   for getting regular updates kindly download the app using given link - ${appUrl} Prophandy Technologies Pvt Ltd (Inspacco)`;
//   const contentId = '1707162359278090737'; //Manager
//   const smsStatusText = await sendSMS(userMobile, message, contentId);
//   return {
//     code: 200,
//     message: `Onboarding SMS send succesfully to ${userMobile}`,
//     smsStatus: smsStatusText ? smsStatusText : 'Error',
//   };
// }



const parseValidate = {
  fields: {
    type: {
      required: true,
      type: String,
    },
    data: {
      type: Object,
    },
  },
};
export const generateScheduleDemo = {
  execute: execute,
};
