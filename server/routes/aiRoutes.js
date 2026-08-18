import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { getRecommendations, chatAssistant } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limiting for the AI endpoint to protect Groq API costs
const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests',
      errors: [{ field: 'rate_limit', message: 'Too many AI requests created from this IP, please try again after 15 minutes.' }]
    });
  }
});

// Validation rules for interests
const validateInterests = [
  body('interests')
    .isString().withMessage('Interests must be a string')
    .trim()
    .notEmpty().withMessage('Interests cannot be empty')
    .isLength({ min: 5, max: 500 }).withMessage('Interests must be between 5 and 500 characters')
    .escape()
];

const chatRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 chat requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests',
      errors: [{ field: 'rate_limit', message: 'Too many chat requests from this IP, please try again after 15 minutes.' }]
    });
  }
});

// @route   POST /api/ai-advisor/recommend
// @desc    Get AI recommendations based on user interests
// @access  Private
router.post(
  '/recommend',
  protect,
  aiRateLimiter,
  validateInterests,
  getRecommendations
);

// @route   POST /api/ai-advisor/chat
// @desc    Chat with AI Assistant
// @access  Private
router.post(
  '/chat',
  protect,
  chatRateLimiter,
  chatAssistant
);

export default router;
