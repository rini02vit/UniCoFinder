import { getAIRecommendations, chatWithAssistant } from '../services/aiService.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Get AI recommendations for career, courses, and skills
 * @route   POST /api/ai-advisor/recommend
 * @access  Private
 */
export const getRecommendations = async (req, res) => {
  try {
    // 1. Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({ field: err.path || 'interests', message: err.msg }))
      });
    }

    const { interests } = req.body;

    // 2. Build minimal student context
    const studentContext = {
      course: req.user.course,
      degree: req.user.degree,
      cgpa: req.user.cgpa
    };

    // 3. Call AI Service
    const recommendations = await getAIRecommendations(studentContext, interests);

    // 4. Return successful response
    res.status(200).json({
      success: true,
      message: 'AI recommendations generated successfully.',
      data: recommendations
    });

  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Server Error',
      errors: [{ field: 'ai_service', message: error.message, details: error.validationErrors || undefined }]
    });
  }
};

/**
 * @desc    Chat with AI Assistant
 * @route   POST /api/ai-advisor/chat
 * @access  Private
 */
export const chatAssistant = async (req, res) => {
  try {
    const { messages } = req.body;
    
    // The user context is extracted purely from the authenticated req.user
    // ensuring the client cannot spoof its cgpa, budget, etc.
    const userContext = {
      cgpa: req.user.cgpa,
      countryPreference: req.user.countryPreference,
      course: req.user.course,
      budget: req.user.budget
    };

    const response = await chatWithAssistant(messages, userContext);

    res.status(200).json({
      success: true,
      message: 'Chat successful',
      data: response
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Server Error',
      errors: [{ field: 'ai_chat', message: error.message, details: error.validationErrors || undefined }]
    });
  }
};
