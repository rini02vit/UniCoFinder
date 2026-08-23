/**
 * Normalizes backend profile data into structured UI state.
 * Handles null checks, default values, and structure flattening.
 */
export const normalizeProfileData = (rawData) => {
  if (!rawData) return getEmptyProfile();

  // Extract inner user object if it's wrapped
  const user = rawData.data?.user || rawData.data || rawData;

  const names = (user.name || '').split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';

  return {
    firstName,
    lastName,
    email: user.email || '',
    phone: user.phone || '',
    
    currentDegree: user.degree || '',
    university: '',
    gpa: user.cgpa != null ? user.cgpa : '',
    
    preferredCourse: user.course || '',
    targetCountries: user.countryPreference || '',
    
    tuitionBudget: user.budget != null ? user.budget : '',
    livingBudget: '',
    
    ielts: user.englishExam === 'IELTS' ? user.examScore : '',
    toefl: user.englishExam === 'TOEFL' ? user.examScore : '',
    duolingo: user.englishExam === 'Duolingo' ? user.examScore : '',
  };
};

/**
 * Returns a safe, empty profile structure.
 */
export const getEmptyProfile = () => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  currentDegree: '',
  university: '',
  gpa: '',
  preferredCourse: '',
  targetCountries: '',
  tuitionBudget: '',
  livingBudget: '',
  ielts: '',
  toefl: '',
  duolingo: ''
});
