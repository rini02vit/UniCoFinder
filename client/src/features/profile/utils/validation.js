import { PROFILE_SECTIONS } from '../constants/profileConfig';

/**
 * Pure validation utility logic.
 */

export const validateRequired = (value) => {
  if (value === undefined || value === null) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

export const validateRange = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validates the entire form against profileConfig rules.
 * Returns an object of errors: { fieldId: 'Error message' }
 */
export const validateProfileForm = (formData) => {
  const errors = {};

  PROFILE_SECTIONS.forEach(section => {
    section.fields.forEach(field => {
      const val = formData[field.id];

      // Required check
      if (field.required && !validateRequired(val)) {
        errors[field.id] = 'This field is required.';
        return; // skip further checks for this field
      }

      // Skip format checks if not required and empty
      if (!field.required && !validateRequired(val)) {
        return;
      }

      // Email format
      if (field.type === 'email' && !validateEmail(val)) {
        errors[field.id] = 'Invalid email address.';
      }

      // Number ranges (GPA, Exams)
      if (field.type === 'number' || field.type === 'currency') {
        if (!validateRange(val, field.min, field.max)) {
          errors[field.id] = `Must be between ${field.min || 0} and ${field.max || 'unlimited'}.`;
        }
      }
    });
  });

  return errors;
};
