import { getPartnerByName } from "../util/partner";
import { csvToJson } from "../util/csv";
import { getServiceByName } from "../util/service";
import { COLLECTIONS } from "../constants/common";
import { createRecord, getSaveOrQueryOption, promiseAllSettled, sendBulkUploadStatusMail } from "../util";
import fetch from 'node-fetch';
import pLimit from 'p-limit';
import { getSocietyByName } from "../util/society";
import rollbar from "../util/rollbar";
const limit = pLimit(1);
export const handleBulkVendorUploadRequest = (req, res, next) => {
    const records = [];
    csvToJson(
        req.file?.path,
        (obj) => {
            records.push(obj);
        }, async () => {
            res.status(200).json({
                message: 'Upload is in Processing ,will receive mail for status'
            });
            const partnersPromises = records.map((partner_obj) =>
                limit(() => handlePartnerCreate(partner_obj, req,next))
            );
            const results = await promiseAllSettled(partnersPromises);
            const emailIds = ['sunil@inspacco.com'];
            if (req.user?.get('email')) {
                emailIds.push(req.user.get('email'));
            }
            sendBulkUploadStatusMail({
                records,
                fields: ['Service Name', 'Company Name'],
                subject: `Partner: Bulk Upload Status for ${req?.file?.originalname}`,
                allSettledResponse: results,
                emailIds
            });
        });

};
// export const handleBulkVendorUploadRequest = (req, res, next) => {
//     csvToJson(req.file.path, (obj) => handlePartnerCreate(obj, req), () => {
//         console.log('Upload booking csv Done');
//     });
//     res.status(200).json({
//         message: 'Upload is in Processing ,will receive mail for status'
//     });
// };
async function getPincodeInfo(pincode) {
    try {
        console.log(`calling getPincodeInfo ${pincode}`);
        const pincodeRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`).then(response => response.json());
        // console.log(typeof pincodeRes);
        const { Status, PostOffice = [] } = pincodeRes?.[0] || {};
        if (Status === 'Success') {
            if (PostOffice?.length) {
                return PostOffice[0];
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (e) {
        console.log('err', e);
    }
}
function validatePincode(pincode) {
    const pincodePattern = /^[0-9]{6}$/;
    return pincodePattern.test(pincode);
}
function validateMobileNumber(mobileNumber) {
    // Regular expression to match:
    // - Optional country code +91 or 91
    // - Followed by exactly 10 digits
    const mobileNumberPattern = /^(?:\+91|91)?[0-9]{10}$/;
    return mobileNumberPattern.test(mobileNumber);
}
async function handlePartnerCreate(partnerob, req,next) {
    return new Promise(async (resolve, reject) => {
        console.log(partnerob);
        const partner_name = partnerob['Company Name']?.trim();
        const service_name = partnerob['Service Name']?.trim();
        const mobileNumber = partnerob['Mobile No']?.trim();
        const clientNames = partnerob['Client Names']?.trim();
        const pincode = partnerob['Pincode']?.trim();
        const errors = [];
        if (!service_name) {
            errors.push(`Service Name Not Provided`);
        }
        if (!pincode) {
            errors.push(`Pincode Name Not Provided `);
            console.error(`Pincode Name Not Provided for ${partner_name}`);
        }
        if (!mobileNumber) {
            errors.push(`Mobile Number Not Provided `);
            // reject(`Mobile Number Not Provided for ${partner_name}`);
            console.error(`Mobile Number Not Provided for ${partner_name}`);
            // return;
        }
        if (!validateMobileNumber(mobileNumber)) {
            errors.push(`Mobile Number : ${mobileNumber} Not Valid `);
            // reject(`Mobile Number : ${mobileNumber} Not Valid for ${partner_name}`);
            console.error(`Mobile Number Not Valid for ${partner_name}`);
            // return;
        }
        if (!validatePincode(pincode)) {
            errors.push(`Pincode : ${pincode} Not Valid`);
            // reject(`Pincode : ${pincode} Not Valid for ${partner_name}`);
        }
        // Need javascript code for mobile number validatio and pincode validatioon  to work

        let partner = await getPartnerByName(partner_name);
        const service = await getServiceByName(service_name);
        if (!service) {
            rollbar.error(`Service Name Not Found ${service_name} in Our System`)
            errors.push(`Service Name Not Found ${service_name} in Our System`);
            // reject(`Service Name Not Found for ${service_name}`);
            console.error(`Service Name Not Found for ${service_name}`);
            // return;
        }
        if (partner) {
            const serviceNames = partner.get('serviceNames');
            if (!serviceNames?.split(',').includes('service_name')) {
                partner.get('services').push(service);
                await partner.save(null, getSaveOrQueryOption(req.user));
            }
            errors.push(`Partner ${partner_name} already Exist`);
            // reject(`Partner ${partner_name} already Exist`);
            // return;

        }
        if (errors?.length) {
            reject(errors?.join('\n'));
            return;
        }
        let pincodeInfo: any = {};
        try {
            const pincodeRes = await getPincodeInfo(pincode);
            pincodeInfo = { city: pincodeRes?.['Region'], state: pincodeRes?.['State'], area: pincodeRes?.['Name'] };
        } catch (e) {
            next(e);
        }
        const partner_data = {
            name: partner_name,
            mobileNumber,
            status: partnerob['Status'] || "Not onboarded",
            address: {
                addressLine1: partnerob['Address'],
                area: pincodeInfo.area,
                city: pincodeInfo.city || partnerob['City'],
                state: pincodeInfo.state || partnerob['State'],
                pincode: partnerob['Pincode'],
                zone: partnerob['Region']
            },
            services: [
                {
                    __type: "Pointer",
                    className: "Service",
                    objectId: service.id
                }],
        };
        try {
            partner = await createRecord(COLLECTIONS.PARTNER)(partner_data, req.user);
            console.log(`Partner ${partner.get('name')} created`);
            if (clientNames?.length) {
                const clientNamesArr = clientNames.split(',').map(clientName => clientName.trim());
                let i = 0;
                for (const clientName of clientNamesArr) {
                    const client = await getSocietyByName(clientName);
                    if (client) {
                        partner.relation('clients').add(client);
                        i++;
                    }
                }
                if (i > 0) {
                    await partner.save(null, getSaveOrQueryOption(req?.context?.user));
                }
            }
            resolve(partner);
        } catch (e) {
            rollbar.error(`${mobileNumber} Partner not created ${e.message}`)
            next(e)
            reject();
        }

    });

}