import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found.',
          errors: [],
        });
      }

      if (req.user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: 'Account is disabled.',
          errors: [],
        });
      }

      next();
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route.',
        errors: [],
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route.',
      errors: [],
    });
  }
};
