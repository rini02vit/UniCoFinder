import { body } from 'express-validator';

// ------------------------------------------------------------------
// COUNTRY VALIDATION
// ------------------------------------------------------------------
export const validateCountry = [
  body('name').optional().isString().trim().notEmpty().withMessage('Name must be a valid string.'),
  body('code').optional().isString().trim(),
  body('capital').optional().isString().trim(),
  body('currency').optional().isString().trim(),
  body('language').optional().isString().trim(),
  body('continent').optional().isString().trim(),
  body('averageTuitionFee').optional().isNumeric().withMessage('Must be a number.'),
  body('averageLivingCost').optional().isNumeric().withMessage('Must be a number.'),
  body('visaRequirements').optional().isString().trim(),
  body('workPermit').optional().isBoolean().withMessage('Must be a boolean.'),
  body('postStudyWorkVisa').optional().isBoolean().withMessage('Must be a boolean.'),
  body('visaFriendlinessScore').optional().isFloat({ min: 1, max: 10 }).withMessage('Must be between 1 and 10.'),
  body('safetyIndex').optional().isFloat({ min: 1, max: 100 }).withMessage('Must be between 1 and 100.'),
  body('description').optional().isString().trim()
];

export const validateCreateCountry = [
  body('name').exists().withMessage('Name is required.').isString().trim().notEmpty().withMessage('Name cannot be empty.'),
  ...validateCountry
];

// ------------------------------------------------------------------
// UNIVERSITY VALIDATION
// ------------------------------------------------------------------
export const validateUniversity = [
  body('name').optional().isString().trim().notEmpty().withMessage('Name must be a valid string.'),
  body('country').optional().isString().trim().notEmpty().withMessage('Country must be a valid string.'),
  body('city').optional().isString().trim(),
  body('degreeLevels').optional().isArray().withMessage('Must be an array of strings.'),
  body('degreeLevels.*').optional().isString().trim(),
  body('courses').optional().isArray().withMessage('Must be an array of strings.'),
  body('courses.*').optional().isString().trim(),
  body('tuitionFee').optional().isNumeric().withMessage('Must be a number.'),
  body('currency').optional().isString().trim(),
  body('ranking').optional().isNumeric().withMessage('Must be a number.'),
  body('cgpaRequirement').optional().isNumeric().withMessage('Must be a number.'),
  body('acceptanceRate').optional().isNumeric().withMessage('Must be a number.'),
  body('livingCost').optional().isNumeric().withMessage('Must be a number.'),
  body('englishExamRequirements').optional().isArray().withMessage('Must be an array of strings.'),
  body('englishExamRequirements.*').optional().isString().trim(),
  body('intakeMonths').optional().isArray().withMessage('Must be an array of strings.'),
  body('intakeMonths.*').optional().isString().trim(),
  body('applicationDeadline').optional().isISO8601().withMessage('Must be a valid date.'),
  body('website').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL.'),
  body('gallery').optional().isArray().withMessage('Must be an array of URLs.'),
  body('gallery.*').optional().isURL().withMessage('Must be a valid URL.'),
  body('description').optional().isString().trim()
];

export const validateCreateUniversity = [
  body('name').exists().withMessage('Name is required.'),
  body('country').exists().withMessage('Country is required.'),
  ...validateUniversity
];

// ------------------------------------------------------------------
// SCHOLARSHIP VALIDATION
// ------------------------------------------------------------------
export const validateScholarship = [
  body('name').optional().isString().trim().notEmpty().withMessage('Name must be a valid string.'),
  body('provider').optional({ checkFalsy: true }).isString().trim(),
  body('country').optional({ checkFalsy: true }).isString().trim(),
  body('university').optional({ checkFalsy: true }).isMongoId().withMessage('Must be a valid University ID.'),
  body('description').optional({ checkFalsy: true }).isString().trim(),
  body('minimumCgpa').optional().isNumeric().withMessage('Must be a number.'),
  body('degreeLevels').optional().isArray().withMessage('Must be an array of strings.'),
  body('degreeLevels.*').optional().isString().trim(),
  body('courses').optional().isArray().withMessage('Must be an array of strings.'),
  body('courses.*').optional().isString().trim(),
  body('eligibleCountries').optional().isArray().withMessage('Must be an array of strings.'),
  body('eligibleCountries.*').optional().isString().trim(),
  body('englishExamRequirements').optional().isArray().withMessage('Must be an array of strings.'),
  body('englishExamRequirements.*').optional().isString().trim(),
  body('amount').optional().isNumeric().withMessage('Must be a number.'),
  body('currency').optional().isString().trim(),
  body('coverageType').optional().isIn(['Full', 'Partial', 'Tuition', 'Living']).withMessage('Invalid coverage type.'),
  body('applicationDeadline').optional({ checkFalsy: true }).isISO8601().withMessage('Must be a valid date.'),
  body('website').optional({ checkFalsy: true }).isURL().withMessage('Must be a valid URL.')
];

export const validateCreateScholarship = [
  body('name').exists().withMessage('Name is required.'),
  ...validateScholarship
];

// ------------------------------------------------------------------
// USER VALIDATION
// ------------------------------------------------------------------
export const validateUserStatusUpdate = [
  body('isActive').exists().withMessage('isActive is required.').isBoolean().withMessage('isActive must be a boolean.')
];
