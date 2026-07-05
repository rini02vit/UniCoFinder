import University from '../models/University.js';
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
      errors: [{ msg: error.message, param: 'server', location: 'server' }],
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
        errors: [{ msg: 'Search keyword is required and cannot be empty.', param: 'q', location: 'query' }],
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
      errors: [{ msg: error.message, param: 'server', location: 'server' }],
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
      errors: [{ msg: error.message, param: 'server', location: 'server' }],
    });
  }
};
