
export interface IUser {
    firstName: string;
    lastName: string;
    email?: string;
    mobileNumber: string;
    username: string;
    role: 'ROOT' | 'INSPACCO_ADMIN';
  }
  
  export const SYSTEM_USERS: Array<IUser> = [
    {
      firstName: 'System',
      lastName: 'User',
      email: 'system_admin@inspacco.com',
      mobileNumber: '7777777777',
      username: 'SYSTEM_ADMIN',
      role: null,
    },
    {
      firstName: 'Paresh',
      lastName: 'Kotkar',
      email: 'paresh@inspacco.com',
      mobileNumber: '9685092514',
      username: '9685092514',
      role: 'INSPACCO_ADMIN',
    },
    {
      firstName: 'Prashant',
      lastName: 'Chaudhari',
      email: 'prashant@inspacco.com',
      mobileNumber: '9096022828',
      username: '9096022828',
      role: 'ROOT',
    },
  ];
