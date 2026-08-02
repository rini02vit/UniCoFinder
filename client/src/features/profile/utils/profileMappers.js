/**
 * Normalizes backend profile data into structured UI state.
 * Handles null checks, default values, and structure flattening.
 */
export const normalizeProfileData = (rawData) => {
  if (!rawData) return getEmptyProfile();

  return {
    firstName: rawData.firstName || '',
    lastName: rawData.lastName || '',
    email: rawData.email || '',
    phone: rawData.phone || '',
    
    currentDegree: rawData.currentDegree || '',
    university: rawData.university || '',
    gpa: rawData.gpa != null ? rawData.gpa : '',
    
    preferredCourse: rawData.preferredCourse || '',
    targetCountries: rawData.targetCountries || '',
    
    tuitionBudget: rawData.tuitionBudget != null ? rawData.tuitionBudget : '',
    livingBudget: rawData.livingBudget != null ? rawData.livingBudget : '',
    
    ielts: rawData.ielts != null ? rawData.ielts : '',
    toefl: rawData.toefl != null ? rawData.toefl : '',
    duolingo: rawData.duolingo != null ? rawData.duolingo : '',
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
