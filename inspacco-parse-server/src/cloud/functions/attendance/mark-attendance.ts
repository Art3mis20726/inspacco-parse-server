import { compact, filter, find, has, isNil } from 'lodash';
import moment from 'moment';
import { getConfig } from '../../../util/config';
import {
    COLLECTIONS,
    CONFIG,
    NOTIFICATION_CATEGORY,
    ROLES,
    TIMEZONE,
} from '../../../constants/common';
import executeGraphql from '../../../util/graphqlClient';
import { get } from 'lodash';
import { GET_SERVICE_SUBSCRIPTION_DETAILS } from '../../graphql/queries/getServiceSubscriptionDetails';
import {
    getSocietyAdmin,
    getSocietyKAMs,
    getSocietyManager,
    getSocietyCDAs,
} from '../../../util/society';
import { getPartnerAdmin } from '../../../util/partner';
import SendPushNotification, { sendFirebaseNotification } from '../../../util/sendPushNotification';
import SaveUserNotification from '../../../util/saveUserNotification';
import { getNotificationTitle } from '../../../util/notification';
import { getNotificationBody } from '../../../util/notification';
import { findUserRoles } from '../../../util/role';
import { GET_USERS_PROFILE_PIC } from '../../graphql/queries/getUsersProfilePic';
import { GET_ATTACHMENT_DATA } from '../../graphql/queries/getAttachmentData';
import { ATTACHMENTS_BASE_URL, FACE_RECOGNITION_BASE_URL } from '../../../util/secrets';
import { getSchemaQuery , getQuery, getSaveOrQueryOption , createRecord, isNumeric} from '../../../util/index';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';
import rollbar from '../../../util/rollbar';
const request = require('request');

export const getAttendanceUserScreenPath = async (user) => {
    let screenPath = '';
    const userRole = await findUserRoles(user);
    if (userRole.length === 0) {
        return screenPath;
    }

    try {
        let roleName;
        if (userRole.length > 0) {
            for (let i = 0; i < userRole.length; i++) {
                roleName = await userRole[i].getName().split('__')[0];
                switch (roleName) {
                    case ROLES.INSPACCO_ADMIN:
                        screenPath = 'INSPACCO.SOCIETY.ATTENDANCE_VIEW';
                        break;
                    case ROLES.INSPACCO_KAM:
                        screenPath = 'INSPACCO.SOCIETY.ATTENDANCE_VIEW';
                        break;
                    case ROLES.INSPACCO_CDA:
                        screenPath = 'INSPACCO.SOCIETY.ATTENDANCE_VIEW';
                        break;
                    case ROLES.PARTNER_ADMIN:
                        screenPath = 'PARTNER.SOCIETY.ATTENDANCE_VIEW';
                        break;
                    case ROLES.SOCIETY_ADMIN:
                        screenPath = 'SOCIETY.ATTENDANCE.ATTENDANCE_VIEW';
                        break;
                    case ROLES.SOCIETY_MANAGER:
                        screenPath = 'SOCIETY.ATTENDANCE.ATTENDANCE_VIEW';
                        break;
                    default:
                        screenPath = 'INSPACCO.SOCIETY.ATTENDANCE_VIEW';
                        break;
                }
            }
        }
        return screenPath;
    } catch (error) {
        rollbar.error(`${user}->${userRole} is getting not identifying ${error.message}`)
        return screenPath;
    }
};

async function _sendNotification(
    req: Parse.Cloud.FunctionRequest,
    serviceSubscriptionData: any
) {
    const societyKAM = await getSocietyKAMs(
        serviceSubscriptionData.society.objectId
    );
    const societyAdmin = await getSocietyAdmin(
        serviceSubscriptionData.society.objectId
    );
    const societyManager = await getSocietyManager(
        serviceSubscriptionData.society.objectId
    );
    const partnerAdmin = await getPartnerAdmin(
        serviceSubscriptionData.partner.objectId
    );
    const societyCDA = await getSocietyCDAs(
        serviceSubscriptionData.society.objectId
    );

    const usersToNotify = [
        ...societyAdmin,
        ...societyKAM,
        ...societyCDA,
        ...societyManager,
        ...partnerAdmin,
    ].filter((user: Parse.User) => {
        return user.id !== req.user.id;
    });

    const serviceName = serviceSubscriptionData.service.name;
    const societyName = serviceSubscriptionData.society.name;

    // !For Firebase notfication to partner App
    console.log("PARTNER ADMIN USER=================> ", partnerAdmin);
    compact(partnerAdmin).forEach(async (user) => {

        const data = {
            screenPath: await getAttendanceUserScreenPath(user),
            params: {
                serviceSubscriptionsIds: [serviceSubscriptionData.objectId],
            },
        };
        console.log("PARTNER ADMIN USER", user);
        sendFirebaseNotification(user, getNotificationTitle('ATTENDANCE_MARKED'), getNotificationBody('ATTENDANCE_MARKED', {
            service: serviceName,
            society: societyName,
        }), data);
    });


    compact(usersToNotify).forEach(async (user) => {
        const data = {
            screenPath: await getAttendanceUserScreenPath(user),
            params: {
                serviceSubscriptionsIds: [serviceSubscriptionData.objectId],
            },
        };
        SendPushNotification(
            user,
            getNotificationTitle('ATTENDANCE_MARKED'),
            getNotificationBody('ATTENDANCE_MARKED', {
                service: serviceName,
                society: societyName,
            }),
            data
        );
        SaveUserNotification(
            user,
            NOTIFICATION_CATEGORY.attendance,
            getNotificationTitle('ATTENDANCE_MARKED'),
            getNotificationBody('ATTENDANCE_MARKED', {
                service: serviceName,
                society: societyName,
            }),
            data
        );
    });
}

async function getServiceSubscriptionData(req: Parse.Cloud.FunctionRequest) {
    const {
        serviceSubscriptionId
    } = req.params;
    const serviceSubscriptionRes = await executeGraphql(
        req.user,
        GET_SERVICE_SUBSCRIPTION_DETAILS, {
        id: serviceSubscriptionId,
    }
    );
    return get(serviceSubscriptionRes, 'data.serviceSubscription');
}

async function execute(
    req: Parse.Cloud.FunctionRequest,
    validator?: Parse.Cloud.Validator
) {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    const serviceSubscriptionData = await getServiceSubscriptionData(req);
    const newAttendanceRecords: Array<any> = filter(
        req.params.attendances,
        (el) => {
            return el.attendanceId === null && !isNil(el.serviceStaff);
        }
    );

    if (
        req.params.attendances.length !== newAttendanceRecords.length
    ) {
        await updateAttendanceRecord(req, serviceSubscriptionData);
    }

    if (newAttendanceRecords.length) {
        if (!req.params.isMarkedByUser) {
            await createAttendanceRecord(
                req,
                newAttendanceRecords,
                serviceSubscriptionData
            );
        } else {
            await new Promise((resolve, reject) => {
                resolve(checkFace(req.params.attendanceFile, req.user,req.params.staffUserId));
            }).then(async (e) => {
                if (e["code"] == 500) {
                    throw e;
                } else {
                    const respTemp = await createFaceRecognitionAttendanceRecord(
                        req,
                        newAttendanceRecords,
                        serviceSubscriptionData
                    );
                    console.log('respTemp',respTemp);
                }
            });
        }
    }

    const tempStaffs: Array<any> = filter(req.params.attendances, {
        serviceStaff: null,
    });
    if (tempStaffs.length) {
        const newServiceStaffs = await createServiceStaffRecord(
            tempStaffs,
            req.params.serviceSubscriptionId,
            req.user
        );
        const attendances = tempStaffs.map((staff, index) => {
            return {
                ...staff,
                serviceStaff: newServiceStaffs[index].id,
                isTemporary: true,
            };
        });
        await createAttendanceRecord(req, attendances, serviceSubscriptionData);
    }

    return {
        code: 200,
        message: 'Attendance is marked Successfully',
    };
}

async function createServiceStaffRecord(
    tempStaffs: any[],
    serviceSubscriptionId: string,
    user: Parse.User
) {
    const ServiceStaff = Parse.Object.extend(COLLECTIONS.SERVICE_STAFF);
    const PartnerStaff = Parse.Object.extend(COLLECTIONS.PARTNER_STAFF);
    const ServiceSubscription = Parse.Object.extend(
        COLLECTIONS.SERVICE_SUBSCRIPTION
    );
    const records = tempStaffs.map((tempStaff) => {
        const serviceStaffRecord: Parse.Object = new ServiceStaff();
        serviceStaffRecord.set(
            'staff',
            PartnerStaff.createWithoutData(tempStaff.staffId)
        );
        serviceStaffRecord.set(
            'serviceSubscription',
            ServiceSubscription.createWithoutData(serviceSubscriptionId)
        );
        serviceStaffRecord.set('type', '-');
        serviceStaffRecord.set(
            'startDate',
            moment.tz(tempStaff.date, TIMEZONE).startOf('day').toDate()
        );
        serviceStaffRecord.set(
            'endDate',
            moment.tz(tempStaff.date, TIMEZONE).endOf('day').toDate()
        );
        serviceStaffRecord.set('isTemporary', true);
        return serviceStaffRecord.save(null, getSaveOrQueryOption(user));
    });
    return Promise.all(records);
}

async function createAttendanceRecord(
    req: Parse.Cloud.FunctionRequest,
    attendances: any[],
    serviceSubscriptionData: any
) {
    try {
        const ServiceStaff = Parse.Object.extend(COLLECTIONS.SERVICE_STAFF);
        const promises = attendances.map((result: any) => {
            const attendanceCreateObj = {
                date: new Date(result.date),
                attendanceDetails : result.attendanceDetails,
                isTemporary: result.isTemporary,
                serviceStaff: ServiceStaff.createWithoutData(result.serviceStaff)
            };
            if(req.params.attendanceFile){
                attendanceCreateObj['mode'] = 'facial';
                attendanceCreateObj['capturedPic'] = req.params.attendanceFile;
            }
            if(result.inTime){
                attendanceCreateObj['isPresent'] = true;
                attendanceCreateObj['inTime'] = new Date(result.inTime);
            }
            if(result.outTime){
                attendanceCreateObj['outTime'] = new Date(result.outTime);
                attendanceCreateObj['isPresent'] = true;
            }
            return createRecord(COLLECTIONS.ATTENDANCE)(attendanceCreateObj,req.user);
        });
        _sendNotification(req, serviceSubscriptionData);
        return Promise.all(promises);
    } catch (error) {
        throw error;
    }
}

async function updateAttendanceRecord(
    req: Parse.Cloud.FunctionRequest,
    serviceSubscriptionData: any
) {
    const updateRecords: Array<any> = [];
    try {
        if(req.params.attendanceFile && req.params.action === "checkout"){
               
            if (req.params.isMarkedByUser) {
                const res:any = await checkFace(req.params.attendanceFile, req.user,req.params.staffUserId);
                if(res?.code !== 200){
                    throw res;
                }
                
                const userLatitude = req.params.userLatitude;
                const userLongitude = req.params.userLongitude;
                const { serviceSubscriptionId } = req.params;
                //find society based on coordinates
                const serviceSubsubscription = await getSchemaQuery(COLLECTIONS.SERVICE_SUBSCRIPTION)({ objectId: serviceSubscriptionId }, req.user);
                if (!serviceSubsubscription) {
                    throw "No service subscription found";
                }

                const societyQuery = getQuery(COLLECTIONS.SOCIETY);
                const location = new Parse.GeoPoint(userLatitude, userLongitude);
                societyQuery.equalTo('objectId', serviceSubsubscription.get('society').id);
                //check within radius of 100 m
                let locationRangeInMeter = await getConfig('SOCIETY_LOCATION_RANGE_IN_METER',true);
                if(isNumeric(locationRangeInMeter)){
                    locationRangeInMeter = parseInt(locationRangeInMeter);
                }else{
                    locationRangeInMeter = 200;   
                }
                societyQuery.withinKilometers('location',location ,(locationRangeInMeter * 0.001),true);
                const society = await societyQuery.first(getSaveOrQueryOption(req.user));
                if (!society) {
                    throw `Site Location doesn’t match`;
                }
            }
            
                req.params.attendances.forEach((element) => {
                    if (element.attendanceId) {
                        updateRecords.push(element.attendanceId);
                    }
                });
                const Attendance = Parse.Object.extend('Attendance');
                const query = new Parse.Query(Attendance);
                query.limit(5000);
                query.containedIn('objectId', updateRecords);
                const attendanceRecords = await query.find(getSaveOrQueryOption(req.user));
                const attendancees = req.params.attendances.filter(obj=>obj.attendanceId);
                const promises = attendanceRecords.map((result: Parse.Object) => {
                    const attendance = attendancees.find(att=>att.attendanceId === result.id);
                    if(attendance){
                      
                        if(attendance.attendanceId){
                            result.set('outTime',new Date());
                        }
                      
                    }
                    return result.save(null, getSaveOrQueryOption(req.user));
                });
                _sendNotification(req, serviceSubscriptionData);
                return Promise.all(promises);
            
        }
         else {
            req.params.attendances.forEach((element) => {
            if (element.attendanceId) {
                updateRecords.push(element.attendanceId);
            }
        });
        const Attendance = Parse.Object.extend('Attendance');
        const query = new Parse.Query(Attendance);
        query.limit(5000);
        query.containedIn('objectId', updateRecords);
        const attendanceRecords = await query.find(getSaveOrQueryOption(req.user));
        const attendancees = req.params.attendances.filter(obj=>obj.attendanceId);
        const promises = attendanceRecords.map((result: Parse.Object) => {
            const attendance = attendancees.find(att=>att.attendanceId === result.id);
            if(attendance){
                if(attendance.inTime){
                    result.set('isPresent',true);
                    result.set('inTime',new Date(attendance.inTime));
                }
                if(attendance.outTime){
                    result.set('isPresent',true);
                    result.set('outTime',new Date(attendance.outTime));
                }
            }
            return result.save(null, getSaveOrQueryOption(req.user));
        });
        _sendNotification(req, serviceSubscriptionData);
        return Promise.all(promises);
    }
    } catch (error) {
        rollbar.error(`${req} Update Attendance Record ${error.message}`)
        throw error;
    }
}

async function validate(req: Parse.Cloud.FunctionRequest) {
    await setUserForCloudFunctionAndTriggersIfRequired(req);
    if (!req.user) {
        throw 'Validation failed. Authentication required';
    }

    if (!has(req.params, 'serviceSubscriptionId')) {
        throw 'Validation failed. serviceSubscriptionId is required.';
    }

    if (!has(req.params, 'attendances') || req.params.attendances.length === 0) {
        throw 'Validation failed. Please specify data for attendances in array';
    }

    if (
        !has(req.params.attendances[0], 'attendanceId') ||
        !has(req.params.attendances[0], 'date') ||
        !has(req.params.attendances[0], 'serviceStaff')
    ) {
        throw 'attendanceId, date, serviceStaff are required object params';
    }

    const maxDaysAllowed = await getConfig(
        CONFIG.MAX_PREV_DAYS_ATTENDANCE_ALLOWED
    );

    req.params.attendances.forEach((attendance) => {
        if (moment().diff(moment(attendance.date), 'days') > maxDaysAllowed) {
            throw `Validation failed. Attendance cannot be marked/updated for date before ${maxDaysAllowed} days from today.`;
        }
    });

    return;
}


//face recognition fuctions starts here
const checkFace = async (attachmentID: any, user: any,staffUserId:any) => {

    const code = 500;
    let msg = "";

    const baseUrl = ATTACHMENTS_BASE_URL;


    console.log(`base url is : ${baseUrl}`);


    const userProfilePicOriginal = await executeGraphql(
        user,
        GET_USERS_PROFILE_PIC, {
        userId: staffUserId || user.id,
    },
        true
    );

    console.log(`profile pic url test is : ${userProfilePicOriginal}`);

    const profilePicData = userProfilePicOriginal.data.user.profilePicture;

    const attachmentUrl = baseUrl + attachmentID;
    const profileUrl = baseUrl + profilePicData;

    if (!attachmentID) {
        msg = 'Attachment is missing';
    }
    if (!profilePicData) {
        msg = 'No Profile picture';
    }

    if (msg) {
        return {
            code: code,
            message: msg,
        };
    }

    return new Promise((resolve, reject) => {
        makeApiCallAzure(attachmentUrl, profileUrl, user.id).then((e) => {
            resolve(e);
        });
    });
};

// const makeFaceCheckRequest = async (profileUrl: string, uploadedFileUrl: string, userId: string) => {


//   let code = 500;
//   let msg = "";

//   let params = {
//       fileUrlOne: profileUrl,
//       fileUrlTwo: uploadedFileUrl,
//       id: userId
//   }
//   return new Promise(function(resolve, reject) {
//       request.post({
//           url: FACE_RECOGNITION_BASE_URL,
//           form: params,
//           headers: {
//               'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
//               'Content-Type': 'application/x-www-form-urlencoded'
//           },
//           method: 'POST',
//           json: true
//       }, async function(err, response, body) {
//           if (err) {
//               msg = 'Some error occurred';
//           }
//           else{
//             if (body.res) {
//               if (body.res != "True") {
//                   msg = "Face doesn't match";
//               } else {
//                   code = 200;
//                   msg = "Face matched attendance marked successfully";
//               }
//             }
//             else {
//                   msg = 'No face detected';
//               }
//           }
//           let resp = {
//               code: code,
//               message: msg ?? "unknown error",
//           };
//           return resolve(resp);
//       })
//   });
// }
//face recognition function ends here


//azure face recognition starts here

const endPointUrl = 'https://inspacco-18-oct-face-rec.cognitiveservices.azure.com/face/v1.0/';
const finalKey = '7ac29dbe77c744428c989bc98c8c384a';

const detectPath = 'detect?returnFaceId=true';
const verifyPath = 'verify';

const makeRequestHelper = async (bodyData, path) => {
    return new Promise((resolve, reject) => {
        const options = {
            'method': 'POST',
            'url': endPointUrl + path,
            'headers': {
                'Ocp-Apim-Subscription-Key': finalKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyData)

        };
        request(options, function (error, response) {
            if (error) reject(error);
            resolve(response.body);
        });
    });
};

const makeApiCallAzure = async (url1, url2, id) => {

    let code = 500;
    let msg = "";

    const faceDataBody1 = {
        "url": url1
    };

    const faceDataBody2 = {
        "url": url2
    };
    const [detectFaceData1,detectFaceData2]   =  await Promise.all([makeRequestHelper(faceDataBody1, detectPath),makeRequestHelper(faceDataBody2, detectPath)]);
    const decodedData1 = JSON.parse(detectFaceData1.toString());
    if (decodedData1.error) {
        return {
            code: 500,
            message: decodedData1.message + ' of Caputred Photo'
        };
    }
    const decodedData2 = JSON.parse(detectFaceData2.toString());
    if (decodedData1.error) {
        return {
            code: 500,
            message: decodedData1.message + ' of Profile Pic'
        };
    }
    if(!decodedData1[0]){
        return {
            code: 500,
            message:`Face doesn't match`
        };
    }
    if(!decodedData2[0]){
        return {
            code: 500,
            message:`Face doesn't match`
        };
    }
    const faceId1 = decodedData1[0].faceId;
    const faceId2 = decodedData2[0].faceId;

    const verifyDataBody = {
        "faceId1": faceId1,
        "faceId2": faceId2
    };

    const verifyfaces = await makeRequestHelper(verifyDataBody, verifyPath);

    const finalResp = JSON.parse(verifyfaces.toString());
    const boolResult = finalResp.isIdentical;


    if (boolResult) {
        code = 200;
        msg = "Face matched attendance marked successfully";
    } else {
        msg = "Face doesn't match";
    }


    const resp = {
        code: code,
        message: msg ?? "unknown error",
    };

    return resp;



};

//azure face recognition ends here 



//check geolocation 
async function arePointsNearBool(checkPoint, centerPoint, km) {
    const ky = 40000 / 360;
    const kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    const dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    const dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}


//add extra meters to users coordinate
async function addMeterToCoordinates(lat, long) {
    const meter = 600;
    const earthRadius = 6378.137;
    const pi = Math.PI;
    const meterToDegree = (1 / ((2 * pi / 360) * earthRadius)) / 1000;

    const new_latitude = lat + (meter * meterToDegree);
    const new_longitude = long + (meter * meterToDegree) / Math.cos(lat * (pi / 180));

    return { lat: new_latitude, long: new_longitude };
}

//check geo attendance and mark 
async function createFaceRecognitionAttendanceRecord(
    req: Parse.Cloud.FunctionRequest,
    attendances: any[],
    serviceSubscriptionData: any
) {
    try {

        //required params
        let partnerStaffId = null;
        let serviceStaffId = null;
        let serviceSubscriptionID = null;
        let serviceSubscriptionTemp = null;

        const userLatitude = req.params.userLatitude;
        const userLongitude = req.params.userLongitude;


        //add 600 meter to user coordinate
        const calculatedLatLong = await addMeterToCoordinates(userLatitude, userLongitude);
        const newLatitude = calculatedLatLong.lat;
        const newLongitude = calculatedLatLong.long;


        //get users partner staff id based on user id 

        const userPointer = {
            __type: 'Pointer',
            className: '_User',
            objectId: req.params.staffUserId ||  req.user.id
        };

        console.log("user id id ");
        console.log(req.user.id);

        const { serviceSubscriptionId } = req.params;
        //find society based on coordinates
       
        const serviceSubsubscription = await getSchemaQuery(COLLECTIONS.SERVICE_SUBSCRIPTION)({ objectId: serviceSubscriptionId }, req.user);
        if (!serviceSubsubscription) {
            throw "No service subscription found";
        }
        const partnerPointer = {
            __type: 'Pointer',
            className: COLLECTIONS.PARTNER,
            objectId: serviceSubsubscription.get('partner').id
        };
        const partnerStaffObject = await getSchemaQuery(COLLECTIONS.PARTNER_STAFF)({ user: userPointer ,partner:partnerPointer}, req.user);

        if (!partnerStaffObject) {
            throw "Partner staff not found";
        }

        partnerStaffId = partnerStaffObject.id;

       

        const societyQuery = getQuery(COLLECTIONS.SOCIETY);
        const location = new Parse.GeoPoint(userLatitude, userLongitude);
        let locationRangeInMeter = await getConfig('SOCIETY_LOCATION_RANGE_IN_METER',true);
        if(isNumeric(locationRangeInMeter)){
            locationRangeInMeter = parseInt(locationRangeInMeter);
        }else{
            locationRangeInMeter = 200;   
        }
        societyQuery.equalTo('objectId', serviceSubsubscription.get('society').id);
        societyQuery.withinKilometers('location',location ,(locationRangeInMeter * 0.001),true);
        const society = await societyQuery.first(getSaveOrQueryOption(req.user));
        if (!society) {
            throw `Site Location doesn’t match`;
        }
        const serviceStaffObject = await getSchemaQuery(COLLECTIONS.SERVICE_STAFF)({ staff: partnerStaffObject, serviceSubscription: serviceSubsubscription },req.user);
        console.log("service staff object");
        
        console.log(serviceStaffObject);
        if (serviceStaffObject) {
            serviceStaffId = serviceStaffObject.id;
            serviceSubscriptionID = serviceSubsubscription.id;
            serviceSubscriptionTemp = serviceSubsubscription;
        }
        if (serviceStaffId == null || serviceSubscriptionID == null) {
            throw "No matching subscription with current user found";
        } else {   
            const ServiceStaff = Parse.Object.extend(COLLECTIONS.SERVICE_STAFF);
            const promises = attendances.map((result: any) => {

                const attendanceCreateObj = {
                    date : new Date(result.date),
                    attendanceDetails: `[]`,
                    serviceStaff : ServiceStaff.createWithoutData(serviceStaffId),
                    isTemporary : result.isTemporary,
                    capturedPic: req.params.attendanceFile,
                    mode: 'facial',
                    userLatitude:parseFloat(userLatitude),
                    userLongitude : parseFloat(userLongitude),
                    isPresent:true
                };
                if(req.params.action === 'checkin'){
                    attendanceCreateObj['inTime'] = new Date();
                }
                if(req.params.action === 'checkout'){
                    attendanceCreateObj['outTime'] = new Date();
                }
                return createRecord(COLLECTIONS.ATTENDANCE)(attendanceCreateObj,req.user);
            });
            _sendNotification(req, serviceSubscriptionTemp.toJSON());
            return Promise.all(promises);
        }
    } catch (error) {
        rollbar.error(`${req} -> ${attendances} Face recognition Attendance ${error.message}`)
        throw error;
    }
}

export const markAttendance = {
    execute: execute,
    validate: validate,
};