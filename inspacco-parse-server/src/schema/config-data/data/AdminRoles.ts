export const ADMIN_ROLES= [
  {
    name: 'ROOT',
    childRole: null,
  },
  {
    name: 'INSPACCO_ADMIN',
    childRole: ['ROOT'],
  },
  {
    name: 'INSPACCO_CDA',
    childRole: ['INSPACCO_ADMIN']
  },
  {
    name: 'INSPACCO_KAM',
    childRole: ['INSPACCO_ADMIN', 'INSPACCO_CDA'],
  },
  {
    name: 'SOCIETY_ADMIN',
    childRole: ['INSPACCO_KAM'],
  },
  {
    name: 'SOCIETY_MANAGER',
    childRole: ['INSPACCO_KAM'],
  },
  {
    name: 'PARTNER_ADMIN',
    childRole: ['INSPACCO_KAM'],
  },
  {
    name: 'PARTNER_STAFF',
    childRole: ['INSPACCO_KAM'],
  },
  {
    name:'PARTNER_KAM',
    childRole:['INSPACCO_KAM']
  },
  {
    name:'SOCIETY_STAFF',
    childRole:['INSPACCO_KAM']
  }
];
