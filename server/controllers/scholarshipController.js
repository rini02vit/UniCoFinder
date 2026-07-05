import Scholarship from '../models/Scholarship.js';
import { buildPagination } from '../utils/universityQueryBuilder.js';
import isValidObjectId from '../utils/isValidObjectId.js';

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

    // 1. Mandatory Fields Validation
    if (user.cgpa === undefined || user.cgpa === null || !user.degree) {
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

    // 2. Build Hard Filters
    const matchFilter = {};

    // CGPA: minimumCgpa <= user.cgpa
    matchFilter.minimumCgpa = { $lte: user.cgpa };

    // Degree: degreeLevels contains user.degree
    matchFilter.degreeLevels = user.degree;

    // Country Preference
    if (user.countryPreference) {
      matchFilter.eligibleCountries = user.countryPreference;
    }

    // English Exam
    if (user.englishExam) {
      matchFilter.englishExamRequirements = user.englishExam;
    }

    // 3. Configure Recommendation Weights
    const RECOMMENDATION_WEIGHTS = {
      countryMatch: 40,
      amount: 30,
      deadline: 20,
      universityLinked: 10,
    };

    const scoreAdditions = [];

    // Country Match (40 pts)
    if (user.countryPreference) {
      scoreAdditions.push({
        $cond: [{ $eq: [{ $toLower: '$country' }, { $toLower: user.countryPreference }] }, RECOMMENDATION_WEIGHTS.countryMatch, 0]
      });
    }

    // Higher Amount (30 pts)
    // To reward higher amounts, we can normalize based on a presumed max amount (e.g., $50,000) or simply give points for having an amount.
    // The prompt says "Higher Scholarship Amount -> 30". We'll use a simple cap logic.
    scoreAdditions.push({
      $cond: [
        { $and: [{ $gt: ['$amount', 0] }, { $ne: ['$amount', null] }] },
        {
          $multiply: [
            RECOMMENDATION_WEIGHTS.amount,
            { $min: [1, { $divide: ['$amount', 50000] }] } // Caps at 50,000 for full 30 pts
          ]
        },
        0
      ]
    });

    // Earlier Deadline (20 pts)
    // Rewards deadlines closer to today.
    scoreAdditions.push({
      $cond: [
        { $and: [{ $gt: ['$applicationDeadline', new Date()] }] },
        {
          $max: [
            0,
            {
              $multiply: [
                RECOMMENDATION_WEIGHTS.deadline,
                {
                  $subtract: [
                    1,
                    {
                      $divide: [
                        { $subtract: ['$applicationDeadline', new Date()] },
                        1000 * 60 * 60 * 24 * 365 // Max out over a year
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        0
      ]
    });

    // University Linked (10 pts)
    scoreAdditions.push({
      $cond: [{ $ne: ['$university', null] }, RECOMMENDATION_WEIGHTS.universityLinked, 0]
    });

    const pipeline = [];

    // Stage 1: Hard filters
    pipeline.push({ $match: matchFilter });

    // Stage 2: Calculate recommendation score
    pipeline.push({
      $addFields: {
        recommendationScore: { $add: scoreAdditions.length > 0 ? scoreAdditions : [0] }
      }
    });

    // Stage 3: Deterministic Sort
    pipeline.push({
      $sort: { recommendationScore: -1, applicationDeadline: 1, name: 1 }
    });

    // 4. Pagination metadata
    const total = await Scholarship.countDocuments(matchFilter);
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
          cgpa: true,
          degree: true,
          countryPreference: !!user.countryPreference,
          englishExam: !!user.englishExam,
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
