import express from 'express';
import { body } from 'express-validator';
import { getUserProfile, updateUserProfile, getNotifications } from '../controllers/userController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);

router.put(
  '/profile',
  protect,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('cgpa')
      .optional()
      .isNumeric()
      .withMessage('CGPA must be a number')
      .isFloat({ min: 0, max: 10 })
      .withMessage('CGPA must be between 0 and 10'),
    body('budget')
      .optional()
      .isNumeric()
      .withMessage('Budget must be a number')
      .isFloat({ min: 0 })
      .withMessage('Budget must be greater than or equal to 0'),
    body('examScore')
      .optional()
      .isNumeric()
      .withMessage('Exam score must be a number')
      .isFloat({ min: 0 })
      .withMessage('Exam score must be greater than or equal to 0'),
    body('course')
      .optional()
      .trim()
      .isString()
      .withMessage('Course must be a string'),
    body('degree')
      .optional()
      .trim()
      .isString()
      .withMessage('Degree must be a string'),
    body('countryPreference')
      .optional()
      .trim()
      .isString()
      .withMessage('Country preference must be a string'),
    body('englishExam')
      .optional()
      .trim()
      .isString()
      .withMessage('English exam must be a string'),
  ],
  validateRequest,
  updateUserProfile
);

// @route   GET /api/users/notifications
// @desc    Get user notifications
// @access  Private
router.get('/notifications', protect, getNotifications);

export default router;
