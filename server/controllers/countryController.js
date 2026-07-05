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
