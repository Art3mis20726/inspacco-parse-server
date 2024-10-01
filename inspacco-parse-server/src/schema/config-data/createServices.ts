import { size } from "lodash";
import { IServiceData, services } from "./data/Services";


export const createServices = async () => {
    console.log('------------- Import Services ----------------');
      for await (const document of services) {
        await _createService(document);
      }
};

 const _createService = async (service: IServiceData) => {
    const Service = Parse.Object.extend('Service');
  // Check if the collection already exists
  const isPresent = await new Parse.Query(Service).equalTo('name', service.name).first({ useMasterKey: true });
  if(size(isPresent)){
     console.log(`Service ${service.name} already exists`);
     return;
  }else{
      const newService = new Service();
      newService.set('name',service.name);
      newService.set('requireAttendance',service.requireAttendance);
      await newService.save(null, { useMasterKey: true });
      console.log(`Service ${service.name} is created`);
  }
 };