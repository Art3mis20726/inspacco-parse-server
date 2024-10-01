import { compact, isString } from 'lodash';
import { serviceData } from './serviceData';
import { setUserForCloudFunctionAndTriggersIfRequired } from '../../../util/user';
import rollbar from '../../../util/rollbar';

async function execute(
  req: Parse.Cloud.FunctionRequest,
  validator?: Parse.Cloud.Validator
) {
  await setUserForCloudFunctionAndTriggersIfRequired(req);
  if (!req.master) {
    throw new Parse.Error(Parse.Error.INVALID_ACL, 'Master key required.');
  }

  const Service = Parse.Object.extend('Service');
  const query = new Parse.Query(Service);
  //query.doesNotExist('serviceKey');
  const serviceRecords = await query.findAll({ useMasterKey: true });

  if (serviceRecords.length) {
    try {
      const promises = serviceRecords.map((serviceRecord: Parse.Object) => {
        const name = serviceRecord.get('name');
        if (name && serviceData[name]) {
          serviceRecord.set('name', serviceData[name].name);
          serviceRecord.set(
            'serviceKey',
            serviceData[name].name.split(' ').join('_').toUpperCase()
          );
          serviceRecord.set('description', serviceData[name].description);
          serviceRecord.set(
            'qualityAssuranceText',
            serviceData[name].qualityAssurance.join(';')
          );
          serviceRecord.set(
            'requirementForm',
            JSON.stringify(serviceData[name].reqForm)
          );
          serviceRecord.set(
            'isPopular',
            true
          );
          if(serviceData[name].displaySeq) {
            serviceRecord.set('displayOrder', serviceData[name].displaySeq);
          }
        }
        return serviceRecord.save(null, { useMasterKey: true });
      });
      const updated = await Promise.all(compact(promises));
      return {
        code: 200,
        message: serviceRecords.length + ' service record updated succesfully.',
        status: updated,
      };
    } catch (error) {
      rollbar.error(`${name}  service record update failed ${error.message}`, );

      throw error;
    }
  } else {
    return {
      code: 200,
      message: 'All records have serviceKey value',
      status: 'No records updated.',
    };
  }
}
export const updateServiceRecord = { execute };
