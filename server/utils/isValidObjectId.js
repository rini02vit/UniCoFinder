import mongoose from 'mongoose';

/**
 * Validates whether a given string is a mathematically valid MongoDB ObjectId.
 * @param {string} id - The ID string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id);
};

export default isValidObjectId;
