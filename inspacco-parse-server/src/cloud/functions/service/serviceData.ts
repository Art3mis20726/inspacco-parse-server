const societyFieldGroup = {
  group: 'G1',
  fields: [
    {
      label: 'Client Name',
      name: 'societyName',
      isRequired: true,
      type: 'DYNAMICTEXT',
      value: '',
    },
    {
      label: 'Client Address',
      name: 'societyAddress',
      isRequired: true,
      type: 'TEXTAREA',
      value: '',
    },
    {
      label: 'No. of wings',
      name: 'wings',
      isRequired: false,
      type: 'NUMBER',
      value: '',
    },
    {
      label: 'No. of flats',
      name: 'flats',
      isRequired: false,
      type: 'NUMBER',
      value: '',
    },
  ],
};
export const serviceData: {
  [serviceName: string]: {
    name: string;
    description: string;
    qualityAssurance: string[];
    displaySeq?: number;
    reqForm: any[];
  };
} = {
  Accountant: {
    name: 'Accountant',
    description:
      'Inspacco provides professional accounting services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Templatized SOPs',
      'Quality Service',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Experience',
            name: 'experience',
            isRequired: true,
            type: 'LIST',
            options: ['0-2 Years', '2-5 Years', '5-10 Years', '10+ Years'],
            value: '',
          },
          {
            label: 'Nature of Job',
            name: 'jobNature',
            isRequired: true,
            type: 'LIST',
            options: ['Full Time', 'Part Time'],
            value: '',
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Locality',
            name: 'locality',
            isRequired: false,
            type: 'LIST',
            options: [
              'Within 5km',
              'Within 10km',
              'Within 15km',
              'Does not matter',
            ],
            value: '',
          },
          {
            label: 'ERP/Tally Knowledge',
            name: 'erpKnowledge',
            isRequired: false,
            type: 'LIST',
            options: ['Yes', 'Can be tought', 'Do not required'],
            value: '',
          },
        ],
      },
      {
        group: 'G4',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'CCTV AMC': {
    name: 'CCTV',
    description:
      'Inspacco provides professional CCTV Installtion and AMC services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Easy EMI and Installment Option',
    ],
    displaySeq: 5,
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Service Type',
            name: 'serviceType',
            isRequired: true,
            type: 'LIST',
            options: [
              'CCTV Installation',
              'CCTV AMC',
              'CCTV Installation and AMC',
            ],
            value: '',
          },
          {
            label: 'Number of Cameras',
            name: 'cameraCount',
            isRequired: true,
            type: 'NUMBER',
            value: '',
          },
          {
            label: 'Number of DVR/NVR',
            name: 'dvrNvrCount',
            isRequired: false,
            type: 'NUMBER',
            value: '',
          },
          {
            label: 'Camera Brand',
            name: 'cameraBranch',
            isRequired: false,
            type: 'TEXT',
            value: '',
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Technician Visit Freq',
            name: 'visitFreq',
            isRequired: false,
            type: 'LIST',
            options: ['Monthly', 'Quaterly'],
            value: '',
          },
        ],
      },
      {
        group: 'G4',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'Civil Work': {
    name: 'Civil Work',
    description:
      'Inspacco provides professional Civil work service, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Templatized SOPs',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Requirement',
            name: 'requirement',
            isRequired: true,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'Deep Cleaning': {
    name: 'Deep Cleaning',
    description:
      'Inspacco provides professional Deep Cleaning service, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Templatized SOPs',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Kind of Deep Cleaning',
            name: 'cleaningType',
            isRequired: true,
            type: 'LIST',
            options: ['Jet Spray Cleaning', 'Scrubber Machine Cleaning'],
            value: '',
          },
          {
            label: 'Floors per Wing',
            name: 'floorPerWing',
            isRequired: true,
            type: 'NUMBER',
            value: '',
          },
          {
            label: 'Common area in sq.ft.',
            name: 'commonArea',
            isRequired: false,
            type: 'NUMBER',
            value: '',
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  Fabrication: {
    name: 'Fabrication',
    description:
      'Inspacco provides professional Fabrication service, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Templatized SOPs',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Requirement',
            name: 'requirement',
            isRequired: true,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'Fire AMC': {
    name: 'Fire System',
    description:
      'Inspacco provides professional Fire System Installtion and AMC services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Easy EMI and Installment Option',
    ],
    displaySeq: 6,
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Number of Floors',
            name: 'floors',
            isRequired: true,
            type: 'NUMBER',
            value: '',
          },
          {
            label: 'Service Type',
            name: 'serviceType',
            isRequired: true,
            type: 'LIST',
            options: [
              'Fire System Installation',
              'Fire Extinguisher Refilling & Service',
              'Fire System AMC',
            ],
            value: '',
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  Gardening: {
    name: 'Gardening',
    description:
      'Inspacco provides professional gardening services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Templatized SOPs',
    ],
    displaySeq: 3,
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Job Nature',
            name: 'jobNature',
            isRequired: true,
            type: 'LIST',
            options: ['Full Time', 'Part Time', 'Visit Basis'],
            value: '',
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  Housekeeping: {
    name: 'Housekeeping',
    description:
      'Inspacco provides professional housekeeping services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Templatized SOPs',
    ],
    displaySeq: 1,
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Staff Required',
            name: 'staffCount',
            isRequired: true,
            type: 'NUMBER',
            value: '',
          },
          {
            label: 'Including Material',
            name: 'materialIncluded',
            isRequired: true,
            type: 'BOOLEAN',
            value: true,
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Include Common Area Deep Cleaning',
            name: 'deepCleaningIncluded',
            isRequired: false,
            type: 'BOOLEAN',
            value: false,
          },
          {
            label: 'Deep Cleaning Frequency',
            name: 'deepCleanFreq',
            isRequired: false,
            type: 'LIST',
            options: ['Monthly', 'Quterly', 'Half Yearly', 'Yearly'],
            value: '',
          },
        ],
      },
      {
        group: 'G4',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'Lift AMC': {
    name: 'Lift',
    description:
      'Inspacco provides professional Lift Installation and maintenance services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Templatized SOPs',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Number of floors',
            name: 'floors',
            isRequired: true,
            type: 'NUMBER',
            value: '',
          },
          {
            label: 'Service Type',
            name: 'serviceType',
            isRequired: true,
            type: 'LIST',
            options: [
              'Lift Installation',
              'Lift AMC',
              'Lift Installation and AMC',
            ],
            value: '',
          },
          {
            label: 'Number of Lifts',
            name: 'liftCount',
            isRequired: true,
            type: 'NUMBER',
            value: '',
          },
          {
            label: 'Lift Branch and Details',
            name: 'liftDetails',
            isRequired: true,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  Painting: {
    name: 'Painting',
    description:
      'Inspacco provides professional Painting services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Industry and Experinced Experts',
      'Easy EMI and Installment Option',
    ],
    displaySeq: 7,
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Requirement',
            name: 'requirement',
            isRequired: true,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'Pest Control': {
    name: 'Pest Control',
    description:
      'Inspacco provides professional Pest Control services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Industry and Experinced Experts',
      'Quality Service',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Number of Floors',
            name: 'floors',
            isRequired: true,
            type: 'NUMBER',
            value: '',
          },
          {
            label: 'Common area and parking space (sq.ft)',
            name: 'commonAreaSize',
            isRequired: true,
            type: 'NUMBER',
            value: '',
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'STP and WTP Operator': {
    name: 'STP Services',
    description:
      'Inspacco provides professional STP maintenance services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Templatized SOPs',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Nature of Service',
            name: 'serviceType',
            isRequired: true,
            type: 'LIST',
            options: ['Maintenance', 'Repair'],
            value: '',
          },
          {
            label: 'Including Material',
            name: 'materialIncluded',
            isRequired: true,
            type: 'BOOLEAN',
            value: true,
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  Security: {
    name: 'Security',
    description:
      'Inspacco provides professional security services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Templatized SOPs',
      'Quality Service',
    ],
    displaySeq: 2,
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Guards in day shift',
            name: 'guardsDayShift',
            isRequired: true,
            type: 'NUMBER',
            value: '',
          },
          {
            label: 'Guards in night shift',
            name: 'guardsNightShift',
            isRequired: true,
            type: 'NUMBER',
            value: '',
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Do you want security supervisor?',
            name: 'securitySupervisorRequired',
            isRequired: false,
            type: 'BOOLEAN',
            value: false,
          },
          {
            label: 'Supervisors in day shift',
            name: 'supervisorsDayShift',
            isRequired: false,
            type: 'NUMBER',
            value: '',
          },
          {
            label: 'Supervisors in night shift',
            name: 'supervisorsNightShift',
            isRequired: false,
            type: 'NUMBER',
            value: '',
          },
        ],
      },
      {
        group: 'G4',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'Society Manager': {
    name: 'Society Manager',
    description:
      'Inspacco provides professional society manager services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Templatized SOPs',
      'Quality Service',
    ],
    displaySeq: 4,
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Expected Qualification',
            name: 'qualification',
            isRequired: true,
            type: 'LIST',
            options: ['Graduation', 'Post Graduation', 'Does not matter'],
            value: '',
          },
          {
            label: 'Expected Experience',
            name: 'experience',
            isRequired: true,
            type: 'LIST',
            options: ['0-2 Years', '2-5 Years', '5+ Years'],
            value: '',
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Nature of Job',
            name: 'jobNature',
            isRequired: true,
            type: 'LIST',
            options: ['Full Time', 'Part Time'],
            value: '',
          },
          {
            label: 'Locality',
            name: 'locality',
            isRequired: false,
            type: 'LIST',
            options: [
              'Within 5km',
              'Within 10km',
              'Within 15km',
              'Does not matter',
            ],
            value: '',
          },
          {
            label: 'ERP Knowledge',
            name: 'erpKnowledge',
            isRequired: false,
            type: 'LIST',
            options: ['Must Have', 'Can be tought', 'Do not required'],
            value: '',
          },
        ],
      },
      {
        group: 'G4',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'Solar AMC': {
    name: 'Solar',
    description:
      'Inspacco provides professional Solar Installtion and AMC services, avail now for your gated community			',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Easy EMI and Installment Option',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Service Type',
            name: 'serviceType',
            isRequired: true,
            type: 'LIST',
            options: ['Solar Installation', 'Solar AMC', 'Solar Repair'],
            value: '',
          },
        ],
      },
      {
        group: 'G4',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'Swimming Pool Maintenance': {
    name: 'Swimming Pool',
    description:
      'Inspacco provides professional swimming pool maintenance services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Templatized SOPs',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Service Type',
            name: 'serviceType',
            isRequired: true,
            type: 'LIST',
            options: [
              'Maintenance',
              'Life Guard',
              'Maintenance and Life Guard both',
            ],
            value: '',
          },
          {
            label: 'Including Material',
            name: 'materialIncluded',
            isRequired: true,
            type: 'BOOLEAN',
            value: true,
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Swimming Pool details',
            name: 'swimmingPoolDetails',
            isRequired: true,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
      {
        group: 'G4',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'Tank Cleaning Service': {
    name: 'Tank Cleaning',
    description:
      'Inspacco provides professional Tank cleaning services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Templatized SOPs',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G3',
        fields: [
          {
            label: 'Tank details',
            name: 'tankDetails',
            isRequired: true,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
      {
        group: 'G4',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  Waterproofing: {
    name: 'Waterproofing',
    description:
      'Inspacco provides professional Water proofing services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Industry and Experinced Experts',
      'Easy EMI and Installment Option',
    ],
    displaySeq: 8,
    reqForm: [
      societyFieldGroup,
      {
        group: 'G3',
        fields: [
          {
            label: 'Requirements',
            name: 'requirements',
            isRequired: true,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      }
    ],
  },
  'Bird Net': {
    name: 'Bird Net',
    description:
      'Inspacco provides professional Bird Net services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Templatized SOPs',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Number of Floors',
            name: 'floors',
            isRequired: true,
            type: 'NUMBER',
            value: '',
          },
          {
            label: 'Requirement',
            name: 'requirement',
            isRequired: true,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'EV Solution': {
    name: 'EV Solution',
    description:
      'Book a visit of Inspacco Industry expert for your gated community to get complete information and benefits of EV Solution',
    qualityAssurance: [
      'Industry and Experinced Experts',
      'Pricing Transparency',
      'Professional Experience',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Requirement',
            name: 'requirement',
            isRequired: true,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'Generator Service': {
    name: 'Generator Service',
    description:
      'Inspacco provides professional Generator Service service, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Templatized SOPs',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Service Type',
            name: 'serviceType',
            isRequired: true,
            type: 'LIST',
            options: ['Generator Installation', 'Generator AMC', 'Generator Repair'],
            value: '',
          },
          {
            label: 'Generator Brand',
            name: 'generatorBrand',
            isRequired: true,
            type: 'TEXT',
            value: '',
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
  'Legal Solution': {
    name: 'Legal Solution',
    description:
      'Inspacco provides professional Legal Solution services, avail now for your gated community',
    qualityAssurance: [
      'Professional Experience',
      'Quality Service',
      'Templatized SOPs',
    ],
    reqForm: [
      societyFieldGroup,
      {
        group: 'G2',
        fields: [
          {
            label: 'Service Type',
            name: 'serviceType',
            isRequired: true,
            type: 'LIST',
            options: ['Society Registrations and Handover', 'Conveyance Deed', 'Consultation'],
            value: '',
          },
        ],
      },
      {
        group: 'G3',
        fields: [
          {
            label: 'Any other specific requirement',
            name: 'otherRequirement',
            isRequired: false,
            type: 'TEXTAREA',
            value: '',
          },
        ],
      },
    ],
  },
};
