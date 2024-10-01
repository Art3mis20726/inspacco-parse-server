import { User } from 'parse';
import { NOTIFICATION_CATEGORY } from '../constants/common';
import rollbar from './rollbar';
export default function SaveUserNotification(
  user: User,
  category: NOTIFICATION_CATEGORY = NOTIFICATION_CATEGORY.other,
  title: string,
  message: string,
  data?: any
) {
  try {
    const Notification = Parse.Object.extend('Notification');
    const notification:Parse.Object<any>  = new Notification();
    notification.set("user",user);
    notification.set("category",category);
    notification.set("title",title);
    notification.set("message",message);
    //notification.setACL(new Parse.ACL(user))
    if(data){
        notification.set("data",data);
    }
    notification.save(null, { useMasterKey: true });
  } catch (error) {
    rollbar.error(`${user} -> ${title} Saving user notification ${error.message}`)
  }
}
