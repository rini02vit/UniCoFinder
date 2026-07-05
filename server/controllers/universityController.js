import University from '../models/University.js';
import isValidObjectId from '../utils/isValidObjectId.js';
import {
  buildPagination,
  buildSort,
  buildSearchFilter,
  buildFilter,
} from '../utils/universityQueryBuilder.js';

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
    if (user.cgpa === undefined || user.cgpa === null) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'profile',
            message: 'Incomplete profile: CGPA is required to generate recommendations.',
          },
        ],
      });
    }

    // 2. Build Hard Filters (Eligibility)
    const syntheticQuery = {
      studentCgpa: user.cgpa,
    };

    if (user.degree) {
      syntheticQuery.degree = user.degree;
    }

    if (user.englishExam) {
      syntheticQuery.englishExam = user.englishExam;
    }

    const matchFilter = buildFilter(syntheticQuery);

    // 3. Configure Recommendation Weights (Soft Ranking)
    const RECOMMENDATION_WEIGHTS = {
      countryMatch: 40,
      budgetFit: 30,
      ranking: 20,
    };

    const scoreAdditions = [];

    if (user.countryPreference) {
      scoreAdditions.push({
        $cond: [{ $eq: [{ $toLower: '$country' }, { $toLower: user.countryPreference }] }, RECOMMENDATION_WEIGHTS.countryMatch, 0]
      });
    }

    if (user.budget && user.budget > 0) {
      scoreAdditions.push({
        $cond: [
          { $and: [{ $lte: ['$tuitionFee', user.budget] }, { $gte: ['$tuitionFee', 0] }, { $ne: ['$tuitionFee', null] }] },
          { $multiply: [RECOMMENDATION_WEIGHTS.budgetFit, { $subtract: [1, { $divide: ['$tuitionFee', user.budget] }] }] },
          0
        ]
      });
    }

    scoreAdditions.push({
      $cond: [
        { $and: [{ $gt: ['$ranking', 0] }, { $ne: ['$ranking', null] }] },
        {
          $max: [
            0,
            { $multiply: [RECOMMENDATION_WEIGHTS.ranking, { $divide: [{ $subtract: [5000, '$ranking'] }, 5000] }] }
          ]
        },
        0
      ]
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
      $sort: { recommendationScore: -1, ranking: 1, name: 1 }
    });

    // 4. Calculate total for pagination metadata
    const total = await University.countDocuments(matchFilter);

    // 5. Apply pagination offsets natively
    const { page, limit, skip } = buildPagination(req.query);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const universities = await University.aggregate(pipeline);
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Recommendations generated successfully.',
      data: {
        universities,
        criteriaUsed: {
          cgpa: true,
          budget: !!user.budget,
          country: !!user.countryPreference,
          degree: !!user.degree,
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
      errors: [{ field: 'server', message: error.message }],
    });
  }
};
