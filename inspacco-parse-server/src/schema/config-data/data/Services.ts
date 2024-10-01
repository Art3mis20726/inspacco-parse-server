export type IServiceData = { name: string; requireAttendance: boolean };
export const services: Array<IServiceData> = [
  {
    name: 'Security',
    requireAttendance: true,
  },
  {
    name: 'Gardening',
    requireAttendance: true,
  },
  {
    name: 'Society Manager',
    requireAttendance: true,
  },
  {
    name: 'Accountant',
    requireAttendance: false,
  },
  {
    name: 'Swimming Pool Maintenance',
    requireAttendance: false,
  },
  {
    name: 'Pest Control',
    requireAttendance: false,
  },
  {
    name: 'Tank Cleaning Service',
    requireAttendance: false,
  },
  {
    name: 'Lift AMC',
    requireAttendance: false,
  },
  {
    name: 'STP and WTP Operator',
    requireAttendance: false,
  },
  {
    name: 'Solar AMC',
    requireAttendance: false,
  },
  {
    name: 'Civil Work',
    requireAttendance: false,
  },
  {
    name: 'Fabrication',
    requireAttendance: false,
  },
  {
    name: 'Painting',
    requireAttendance: false,
  },
  {
    name: 'Waterproofing',
    requireAttendance: false,
  },
  {
    name: 'Housekeeping',
    requireAttendance: true,
  },
  {
    name: 'CCTV Installation', // Remove after phase2 prod
    requireAttendance: false,
  },
  {
    name: 'Fire System Work',
    requireAttendance: false,
  },
  {
    name: 'Deep Cleaning',
    requireAttendance: false,
  },
  {
    name: 'Bird Net',
    requireAttendance: false,
  },
  {
    name: 'EV Solution',
    requireAttendance: false,
  },
  {
    name: 'Villa Booking',
    requireAttendance:true
  }
];
