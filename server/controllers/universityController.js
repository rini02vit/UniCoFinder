import University from '../models/University.js';
import isValidObjectId from '../utils/isValidObjectId.js';
import {
  buildPagination,
  buildSort,
  buildSearchFilter,
  buildFilter,
  buildRecommendationPipeline,
} from '../utils/universityQueryBuilder.js';
import { buildPredictorPipeline } from '../utils/predictorQueryBuilder.js';

// @desc    Get all universities with pagination
// @route   GET /api/universities
// @access  Public
export const getUniversities = async (req, res) => {
  try {
    const { page, limit, skip } = buildPagination(req.query);
    const sortOptions = buildSort(req.query);

    const total = await University.countDocuments();
    const universities = await University.find({})
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Universities fetched successfully.',
      data: {
        universities,
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
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Search universities
// @route   GET /api/universities/search
// @access  Public
export const searchUniversities = async (req, res) => {
  try {
    const searchFilter = buildSearchFilter(req.query.q);

    // If q is empty or whitespace-only, return 400 Bad Request
    if (!searchFilter) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'q', message: 'Search keyword is required and cannot be empty.' }],
      });
    }

    const { page, limit, skip } = buildPagination(req.query);
    const sortOptions = buildSort(req.query);

    const total = await University.countDocuments(searchFilter);
    const universities = await University.find(searchFilter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Universities searched successfully.',
      data: {
        universities,
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
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Filter universities
// @route   GET /api/universities/filter
// @access  Public
export const filterUniversities = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const { page, limit, skip } = buildPagination(req.query);
    const sortOptions = buildSort(req.query);

    const total = await University.countDocuments(filter);
    const universities = await University.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Universities filtered successfully.',
      data: {
        universities,
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
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Get university by ID
// @route   GET /api/universities/:id
// @access  Public
export const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'id',
            message: 'The provided ID is not a valid MongoDB ObjectId.',
          },
        ],
      });
    }

    const university = await University.findById(id);

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'University fetched successfully.',
      data: {
        university,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Recommend universities based on user profile
// @route   GET /api/universities/recommend
// @access  Private
export const recommendUniversities = async (req, res) => {
  try {
    const user = req.user;

    // 1. Mandatory Fields Validation
    if (
      (user.cgpa === undefined || user.cgpa === null) &&
      (!user.budget) &&
      (!user.course) &&
      (!user.countryPreference)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'profile',
            message: 'Incomplete profile: At least one preference (CGPA, budget, course, or country) is required.',
          },
        ],
      });
    }

    // 2. Build Recommendation Pipeline
    const pipeline = buildRecommendationPipeline(user);

    // 3. Apply pagination offsets natively
    const { page, limit, skip } = buildPagination(req.query);

    // Calculate total for pagination metadata
    // Since we score all universities, the total is the full count
    const total = await University.countDocuments();
    const pages = Math.ceil(total / limit);

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const universities = await University.aggregate(pipeline);

    res.status(200).json({
      success: true,
      message: 'Recommendations generated successfully.',
      data: {
        universities,
        criteriaUsed: {
          cgpa: user.cgpa !== undefined && user.cgpa !== null,
          budget: !!user.budget,
          course: !!user.course,
          country: !!user.countryPreference,
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
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Get deterministic admission predictions
// @route   GET /api/universities/predict
// @access  Private
export const getAdmissionPredictions = async (req, res) => {
  try {
    const user = req.user;

    // MANDATORY REQUIREMENT: Profile must have CGPA
    if (user.cgpa === undefined || user.cgpa === null) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'cgpa',
            message: 'CGPA is required for admission prediction. Please update your profile.',
          },
        ],
      });
    }

    const { page, limit, skip } = buildPagination(req.query);
    
    // Build and execute the deterministic prediction pipeline
    const pipeline = buildPredictorPipeline(user, req.query);
    
    // To calculate total, we need a separate count pipeline
    const countPipeline = [...pipeline];
    countPipeline.splice(-1, 1); // remove $sort
    countPipeline.push({ $count: 'total' });
    const countResult = await University.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;
    const pages = Math.ceil(total / limit);

    // Apply pagination to main pipeline
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const universities = await University.aggregate(pipeline);

    // Append deterministic explanations locally (keeps MongoDB aggregation lean)
    const dataWithExplanations = universities.map(uni => {
      let explanation = '';
      if (uni.matchStatus === 'Safe') {
        explanation = "Your CGPA strongly meets the requirement, making this a Safe heuristic classification.";
      } else if (uni.matchStatus === 'Target') {
        explanation = "Your profile is competitive, placing this university in your Target range based on available data.";
      } else {
        explanation = "This is a highly competitive Dream classification given the strict requirements or acceptance rate.";
      }

      // Remove the raw score from the output payload to prevent probability misinterpretation
      delete uni.rawAdmissionScore;
      delete uni.maxDenominator;
      delete uni.normalizedPredictorScore;

      return {
        ...uni,
        explanation,
        scoreBreakdown: {
          cgpaMet: user.cgpa >= uni.cgpaRequirement,
          acceptanceRate: uni.acceptanceRate
        }
      };
    });

    res.status(200).json({
      success: true,
      message: 'Admission predictions generated successfully.',
      data: {
        universities: dataWithExplanations,
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
      errors: [{ field: 'server', message: error.message }],
    });
  }
};
