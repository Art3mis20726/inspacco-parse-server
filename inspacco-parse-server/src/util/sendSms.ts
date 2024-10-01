import rollbar from "./rollbar";
import { SMS_ENTITY_ID, SMS_PWD, SMS_SENDER_ID, SMS_USER } from "./secrets";

export async function sendSMS(mobileNumber: string,message:string,contentId:string,senderId?:string) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    try {
        const response = await Parse.Cloud.httpRequest({
            url: 'https://pgapi.vispl.in/fe/api/v1/send',
            params: {
                username: SMS_USER,
                password: SMS_PWD,
                unicode: false,
                messageType: "text",
                to: mobileNumber,
                from: senderId||'INSPCO',
                dltContentId: contentId,
                EntityID: SMS_ENTITY_ID,
                text: message
            }
        });   
        return response.text;
    } catch (error) {
        rollbar.error(`${mobileNumber}  SMS failed ${error.message}`);

        throw new Parse.Error(Parse.Error.CONNECTION_FAILED,error);
    }
 }