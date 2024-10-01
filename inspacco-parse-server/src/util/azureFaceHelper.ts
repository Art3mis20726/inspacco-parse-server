import rollbar from "./rollbar";
import { AZURE_FACE_ENDPOINT, AZURE_FACE_SUBSCRIPTION_KEY } from "./secrets";
const request = require('request');
const endPointUrl = AZURE_FACE_ENDPOINT;
const finalKey = AZURE_FACE_SUBSCRIPTION_KEY;
const logger = require('./logger');
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
            if (error) {
                return reject(error);
            }
            console.log('response',response.statusCode);
            let body = null;
            try{
              body = JSON.parse(response.body);
            }catch(e){
                return reject(e);
            }
            if(response.statusCode !== 200){
                return reject(body.error);
            }
            try{
                resolve(body);
            }catch(e){
                reject(e);
            }
            
        });
    });
};
export const detectFace = (payload)=>{
    return makeRequestHelper(payload,detectPath).then((data)=>{
        console.info('detectFace Response',data);  
        if(Array.isArray(data)){
            return data[0];
        }
        return null;
    }).catch(e=>{
        rollbar.error(` ${payload} detectFace error ${e.message}`,);
        console.error(e);
    });
};

export const verifyFace:any = (payload) => {
   return makeRequestHelper(payload,verifyPath).then((data)=>{ 
       console.info('any Response',data);
        if(data) return data;
        return null;
    });
};