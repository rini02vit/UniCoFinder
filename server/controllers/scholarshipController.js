import Scholarship from '../models/Scholarship.js';
import { buildPagination } from '../utils/universityQueryBuilder.js';
import isValidObjectId from '../utils/isValidObjectId.js';
import { buildScholarshipRecommendationPipeline } from '../utils/scholarshipQueryBuilder.js';

// @desc    Get all scholarships with pagination
// @route   GET /api/scholarships
// @access  Public
export const getScholarships = async (req, res) => {
  try {
    const { page, limit, skip } = buildPagination(req.query);

    const total = await Scholarship.countDocuments();
    const scholarships = await Scholarship.find({})
      .sort({ applicationDeadline: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Scholarships fetched successfully.',
      data: {
        scholarships,
        pagination: {
          total,
          page,
          limit,
          pages,
          hasNextPage: page < pages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      errors: [
        {
          field: 'server',
          message: error.message,
        },
      ],
    });
  }
};

// @desc    Get scholarship by ID
// @route   GET /api/scholarships/:id
// @access  Public
export const getScholarshipById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'id',
            message: 'Invalid scholarship ID.',
          },
        ],
      });
    }

    const scholarship = await Scholarship.findById(id);

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: 'Scholarship not found.',
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Scholarship fetched successfully.',
      data: {
        scholarship,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      errors: [
        {
          field: 'server',
          message: error.message,
        },
      ],
    });
  }
};

// @desc    Recommend scholarships based on user profile
// @route   GET /api/scholarships/recommend
// @access  Private
export const recommendScholarships = async (req, res) => {
  try {
    const user = req.user;

    // 1. Build Recommendation Pipeline
    const pipeline = buildScholarshipRecommendationPipeline(user);

    // 2. Add Pagination
    const total = await Scholarship.countDocuments();
    const { page, limit, skip } = buildPagination(req.query);
    
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const scholarships = await Scholarship.aggregate(pipeline);
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Scholarship recommendations generated successfully.',
      data: {
        scholarships,
        criteriaUsed: {
          cgpa: !!user.cgpa,
          degree: !!user.degree,
          course: !!user.course,
          countryPreference: !!user.countryPreference,
        },
        pagination: {
          total,
          page,
          limit,
          pages,
          hasNextPage: page < pages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      errors: [
        {
          field: 'server',
          message: error.message,
        },
      ],
    });
  }
};
