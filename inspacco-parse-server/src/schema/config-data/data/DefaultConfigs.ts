export interface IConfig {
  name: string;
  value: any;

  useMasterKey: boolean;
}
export const DEFAULT_CONFIGS: Array<IConfig> = [
  {
    name: 'EXECUTE_SCHEMA_ON_SERVER_START',
    value: {EXECUTE_SCHEMA_ON_SERVER_START : false},
    useMasterKey: true,
  },
  {
    name: 'MAX_PREV_DAYS_ATTENDANCE_ALLOWED',
    value: { MAX_PREV_DAYS_ATTENDANCE_ALLOWED: 7 },
    useMasterKey: false,
  },  
  {
    name: 'MAX_PREV_DAYS_TASK_ALLOWED',
    value: { MAX_PREV_DAYS_TASK_ALLOWED: 7 },
    useMasterKey: false,
  },
  {
    name: 'NEW_USER_NOTIFY_EMAIL_LIST',
    value: {
      NEW_USER_NOTIFY_EMAIL_LIST: [
        'prashant@inspacco.com',
        'paresh@inspacco.com',
        'ajay@inspacco.com',
        'harshit@inspacco.com',
      ],
    },
    useMasterKey: false,
  },
  {
    useMasterKey: true,
    name: 'devUsers',
    value: {
      devUsers: [
        '5500000001',
        '5500000002',
        '5500000003',
        '5500000004',
        '5500000005',
        '5500000006',
        '5500000007',
        '5500000008',
        '5500000009',
        '5500000010',
        '5500000100',
        '5500000101',
        '5500000102',
        '5500000103',
        '5500000104',
        '5500000105',
        '5500000200',
        '5500000201',
        '5500000202',
        '5500000203',
        '5500000204',
        '5500000300',
        '5500000301',
        '5500000302',
        '5500000303',
        '5500000304',
      ],
    },
  },
  {
    name: 'SOCIETY_LOCATION_RANGE_IN_METER',
    value: { SOCIETY_LOCATION_RANGE_IN_METER: 200 },
    useMasterKey: false,
  },
];
