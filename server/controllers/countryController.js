import Country from '../models/Country.js';
import { buildPagination } from '../utils/universityQueryBuilder.js';

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
