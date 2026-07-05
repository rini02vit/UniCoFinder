import Country from '../models/Country.js';
import { buildPagination } from '../utils/universityQueryBuilder.js';
import isValidObjectId from '../utils/isValidObjectId.js';

// @desc    Get all countries with pagination
// @route   GET /api/countries
// @access  Public
export const getCountries = async (req, res) => {
  try {
    const { page, limit, skip } = buildPagination(req.query);

    const total = await Country.countDocuments();
    const countries = await Country.find({})
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Countries fetched successfully.',
      data: {
        countries,
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

// @desc    Get country by ID
// @route   GET /api/countries/:id
// @access  Public
export const getCountryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'id',
            message: 'Invalid country ID.',
          },
        ],
      });
    }

    const country = await Country.findById(id);

    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found.',
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Country fetched successfully.',
      data: {
        country,
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

// @desc    Recommend countries based on user profile
// @route   GET /api/countries/recommend
// @access  Private
export const recommendCountries = async (req, res) => {
  try {
    const user = req.user;

    // 1. Validation for sufficient profile
    if (!user.countryPreference && (!user.budget || user.budget <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'profile',
            message: 'Profile information is insufficient to generate recommendations.',
          },
        ],
      });
    }

    // 2. Configurable Weights
    const RECOMMENDATION_WEIGHTS = {
      preferredCountry: 50,
      workPermit: 20,
      postStudyWorkVisa: 20,
      affordability: 10,
    };

    const scoreAdditions = [];

    // Country Preference Match
    if (user.countryPreference) {
      scoreAdditions.push({
        $cond: [{ $eq: [{ $toLower: '$name' }, { $toLower: user.countryPreference }] }, RECOMMENDATION_WEIGHTS.preferredCountry, 0]
      });
    }

    // Global perks
    scoreAdditions.push({
      $cond: [{ $eq: ['$workPermit', true] }, RECOMMENDATION_WEIGHTS.workPermit, 0]
    });
    scoreAdditions.push({
      $cond: [{ $eq: ['$postStudyWorkVisa', true] }, RECOMMENDATION_WEIGHTS.postStudyWorkVisa, 0]
    });

    // Affordability
    if (user.budget && user.budget > 0) {
      scoreAdditions.push({
        $let: {
          vars: {
            totalCost: { $add: [{ $ifNull: ['$averageTuitionFee', 0] }, { $ifNull: ['$averageLivingCost', 0] }] }
          },
          in: {
            $cond: [
              { $and: [{ $gt: ['$$totalCost', 0] }, { $lte: ['$$totalCost', user.budget] }] },
              { $multiply: [RECOMMENDATION_WEIGHTS.affordability, { $subtract: [1, { $divide: ['$$totalCost', user.budget] }] }] },
              0
            ]
          }
        }
      });
    }

    const pipeline = [];

    // Stage 1: Match all (no hard filters applicable from profile)
    pipeline.push({ $match: {} });

    // Stage 2: Calculate recommendation score
    pipeline.push({
      $addFields: {
        recommendationScore: { $add: scoreAdditions.length > 0 ? scoreAdditions : [0] }
      }
    });

    // Stage 3: Deterministic Sort
    pipeline.push({
      $sort: { recommendationScore: -1, name: 1 }
    });

    // 4. Pagination
    const total = await Country.countDocuments();
    const { page, limit, skip } = buildPagination(req.query);
    
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const countries = await Country.aggregate(pipeline);
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Country recommendations generated successfully.',
      data: {
        countries,
        criteriaUsed: {
          budget: !!user.budget,
          countryPreference: !!user.countryPreference,
          cgpa: false, // Not applicable to Country schema
          degree: false, // Not applicable to Country schema
          englishExam: false,
          examScore: false,
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
