import fs from 'fs';
import { getPartnerByName } from '../util/partner';
import { getServiceByName } from '../util/service';
import { getSocietyByName } from '../util/society';
import { csvToJson } from '../util/csv';
import { getUserByUserName, setUserForCloudFunctionAndTriggersIfRequired } from '../util/user';
import { COLLECTIONS } from '../constants/common';
import { downloadFile, getSaveOrQueryOption, promiseAllSettled } from '../util/index';
import path from 'path';
import pLimit from 'p-limit';
const limit = pLimit(1);
import { sendEmail } from '../util/ses';
import moment from 'moment';
import rollbar from '../..../../util/rollbar';
import { error } from 'console';

const handleBooking = async (booking,req) => {
  return new Promise((resolve, reject) => {
    if (!booking.booking_id) {
      reject('booking_id not present or empty booking data');
      return;
    }
    if (!booking.guest_contact) {
      reject('guest_contact not present or empty booking data');
      return;
    }
    const checkin_time = booking.checkin
      ? `${booking.checkin} ${booking.checkin_time}`
      : null;
    const checkout_time = booking.checkout
      ? `${booking.checkout} ${booking.checkout_time}`
      : null;
    const society_name = booking.property_name;
    if (!society_name) {
      rollbar.error(`${booking.booking_id} Property name not provided`)
      throw new Error('Property Name Not provided');
    }
    const startDate = moment(booking.checkin).startOf('day').toDate();
    const endDate = moment(booking.checkout).endOf('day').toDate();
    const obj = {
      society_obj: {
        name: booking.property_name,
        city: booking.city,
        state: booking.state,
        addressLine1: booking.property_address,
      },
      service_subscription_obj: {
        startDate,
        endDate,
      },
      checkin_time,
      checkout_time,
      service_name: 'Villa Booking',
      partner_name: 'Vista Rooms',
      guest: {
        name: booking.guest_name || '',
        mobileNumber: booking.guest_contact,
        guestCount: booking.number_of_pax,
      },
    };
    try {
      createBooking(obj, () => {
        resolve('Booking Upload done');
      },req);
    } catch (e) {
      
      reject(e);
    }
  });
};

export const uploadBookings = async function (req, res,next) {
  console.log('req body', req.files);
  csvToJson(req.file.path, handleBooking, () => {
    console.log('Upload booking csv Done');
  });
};

export const hanldeUploadBookingsCloud = async function (
  req: Parse.Cloud.FunctionRequest
) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  const { partnerName, bookingFileUrl, bookingFileName } = req.params || {};
  const filePath = path.resolve(__dirname, '../../tmp/' + bookingFileName);
  const downloadRes = await downloadFile(bookingFileUrl, filePath);
  const bookings = [];
  csvToJson(
    filePath,
    (booking) => {
      bookings.push(booking);
    },
    async () => {
      const bookingPromises = bookings.map((booking) =>
        limit(() => handleBooking(booking,req))
      );
      const results = await promiseAllSettled(bookingPromises);
      const resultHtml = results.map((result: any, index) => {
        const booking_id = bookings[index].booking_id;
        return `<tr>
              <td style="border-collapse:collapse;font-family:Verdana, sant-serif;padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;text-align:left;" > ${booking_id}</td>
              <td style="color: ${result.status === 'fulfilled'? 'green':'red'};border-collapse:collapse;font-family:Verdana, sant-serif;padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;text-align:left;" > ${result.status === 'fulfilled'? 'Success':'Rejected'} </td>
              <td style="border-collapse:collapse;font-family:Verdana, sant-serif;padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;text-align:left;" >  ${
                result.reason
                  ? result.reason instanceof Error
                    ? result.reason.message
                    : result.reason
                  : ''
              }</td>
            </tr>`;
      });
      const emailHtml = `<html>
           <body>
             <table style="border-collapse:collapse;font-family:Verdana, sant-serif;" >
               <thead>
                <th style="border-collapse:collapse;font-family:Verdana, sant-serif;padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;text-align:left;" >Booking Id </th>
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
      const emailIds = ['email@inspacco.com'];
      if(req.user.get('email')){
         emailIds.push(req.user.get('email'));
      }
      await sendEmail(
        emailIds,
        ` Upload Booking Status for ${bookingFileName}`,
        emailHtml,
        true
      );
      // console.log('result',result);
    }
  );
};
async function createBooking(
  { society_obj, service_subscription_obj, service_name, partner_name, guest,checkin_time,checkout_time },
  cb,
  req
) {
  if (typeof cb !== 'function') {
    cb = () => {
      return null;
    };
  }
  let society = await getSocietyByName(society_obj.name);
  if (!society) {
    society = await createSociety(society_obj);
  }
  const service = await getServiceByName(service_name);
  if (!service) {
    throw new Error(`Service ${service_name} not Exist`);
  }
  let requirementForm = service.get('requirementForm');
  try {
    requirementForm = JSON.parse(requirementForm);
  } catch (e) {
    rollbar.error(`${society} has this service ${service} error to create booking ${e.message}`)
    requirementForm = [];
  }
  if (!requirementForm.length) {
    requirementForm = updateRequirement(
      requirementForm,
      'guestName',
      guest.name
    );
    requirementForm = updateRequirement(
      requirementForm,
      'guestCount',
      guest.guestCount
    );
    requirementForm = updateRequirement(
      requirementForm,
      'checkinTime',
      checkin_time
    );
    requirementForm = updateRequirement(
      requirementForm,
      'checkoutTime',
      checkout_time
    );
  }
  const partner = await getPartnerByName(partner_name);
  if (!partner) {
    rollbar.error(`Partner ${partner_name} not Exist`)
    throw new Error(`Partner ${partner_name} not Exist`);
  }
  let user = await getUserByUserName(guest.mobileNumber);
  if (!user) {
    user = await createUser({
      firstName: guest.name.split(' ')[0],
      lastName: guest.name.split(' ')[1],
      mobileNumber: guest.mobileNumber,
      username: guest.mobileNumber,
      password: 'test123',
    });
  }
  const service_request = await createServiceRequest({
    society,
    requirement: `${JSON.stringify(requirementForm)}`,
    status: 'CLOSED',
    service: service,
    requester: user,
  });
  const partner_service_request = await createPartnerServiceRequest({
    serviceRequest: service_request,
    requirement: `${JSON.stringify(requirementForm)}`,
    status: 'CLOSED',
    service,
    // society,
    partner,
  },req?.user);
  const service_subscription = await createServiceSubscription({
    partnerServiceRequest: partner_service_request,
    service, //villa booking
    society, //Villa1 ,Villa2
    partner, //Vista Rooms
    startDate: service_subscription_obj.startDate,
    endDate: service_subscription_obj.endDate,
    status: 'Active'
  },req?.user);
  cb();
}

function createUser(obj = {}) {
  const User = Parse.Object.extend('_User');
  const user_object = new User();
  return user_object.save(obj, { useMasterKey: true });
}
function createSociety(obj = {}) {
  const Society = Parse.Object.extend(COLLECTIONS.SOCIETY);
  const society_object = new Society();
  return society_object.save(obj, { useMasterKey: true });
}
function createServiceRequest(obj = {}) {
  const ServiceRequest = Parse.Object.extend(COLLECTIONS.SERVICE_REQUEST);
  const service_request = new ServiceRequest();
  return service_request.save(obj, { useMasterKey: true });
}
function createPartnerServiceRequest(obj = {},user) {
  const PartnerServiceRequest = Parse.Object.extend(
    COLLECTIONS.PARTNER_SERVICE_REQUEST
  );
  const partner_service_request = new PartnerServiceRequest();
  return partner_service_request.save(obj, getSaveOrQueryOption(user));
}
function createServiceSubscription(obj = {},user) {
  const ServiceSubscription = Parse.Object.extend(
    COLLECTIONS.SERVICE_SUBSCRIPTION
  );
  const service_subscription = new ServiceSubscription();
  return service_subscription.save(obj, getSaveOrQueryOption(user));
}
const updateRequirement = (reqment, name, value) => {
  return reqment.map((obj) => {
    obj.fields = obj.fields.map((field) => {
      if (field.name === name) {
        field.value = value;
      }
      return field;
    });
    return obj;
  });
};

