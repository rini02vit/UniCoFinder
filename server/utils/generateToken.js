import jwt from 'jsonwebtoken';

/**
 * Generates a JSON Web Token for an authenticated user.
 * 
 * @param {string} userId - The user's MongoDB _id
 * @returns {string} The signed JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export default generateToken;
