export const COUNTRY_OPTIONS = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands'
];

export const COURSE_OPTIONS = [
  'Computer Science', 'Data Science', 'Business Administration', 'Engineering', 'Medicine', 'Law', 'Arts'
];

export const PROFILE_SECTIONS = [
  {
    id: 'personal',
    title: 'Personal Details',
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', required: true },
      { id: 'lastName', label: 'Last Name', type: 'text', required: true },
      { id: 'email', label: 'Email Address', type: 'email', required: true },
      { id: 'phone', label: 'Phone Number', type: 'tel', required: false, placeholder: '+1 (555) 000-0000' }
    ]
  },
  {
    id: 'academic',
    title: 'Academic Details',
    fields: [
      { id: 'currentDegree', label: 'Current Degree', type: 'text', required: true },
      { id: 'university', label: 'University/Institution', type: 'text', required: true },
      { id: 'gpa', label: 'GPA', type: 'number', min: 0, max: 4.0, step: 0.1, required: true }
    ]
  },
  {
    id: 'preferences',
    title: 'Study Preferences',
    fields: [
      { id: 'preferredCourse', label: 'Preferred Course', type: 'select', options: COURSE_OPTIONS, required: true },
      { id: 'targetCountries', label: 'Target Destination', type: 'select', options: COUNTRY_OPTIONS, required: true }
    ]
  },
  {
    id: 'budget',
    title: 'Budget Estimates',
    fields: [
      { id: 'tuitionBudget', label: 'Max Annual Tuition', type: 'currency', min: 0, step: 1000, required: true },
      { id: 'livingBudget', label: 'Max Annual Living Cost', type: 'currency', min: 0, step: 1000, required: true }
    ]
  },
  {
    id: 'exams',
    title: 'English Exam Scores',
    fields: [
      { id: 'ielts', label: 'IELTS Band Score', type: 'number', min: 0, max: 9.0, step: 0.5, required: false },
      { id: 'toefl', label: 'TOEFL iBT Score', type: 'number', min: 0, max: 120, step: 1, required: false },
      { id: 'duolingo', label: 'Duolingo Score', type: 'number', min: 0, max: 160, step: 5, required: false }
    ]
  }
];
