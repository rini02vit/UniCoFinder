import University from '../models/University.js';

// @desc    Get all universities with pagination
// @route   GET /api/universities
// @access  Public
export const getUniversities = async (req, res) => {
  try {
    // 1. Pagination parsing and clamping
    let page = parseInt(req.query.page, 10);
    let limit = parseInt(req.query.limit, 10);

    if (isNaN(page) || page <= 0) {
      page = 1;
    }

    if (isNaN(limit) || limit <= 0) {
      limit = 10;
    } else if (limit > 50) {
      limit = 50;
    }

    const skip = (page - 1) * limit;

    // 2. Fetch total count for metadata
    const total = await University.countDocuments();

    // 3. Query the database with skip, limit, and compound sorting
    const universities = await University.find({})
      .sort({ ranking: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    // 4. Calculate pagination metadata
    const pages = Math.ceil(total / limit);
    const hasNextPage = page < pages;
    const hasPreviousPage = page > 1;

    // 5. Send response
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
          hasNextPage,
          hasPreviousPage,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      errors: [
        {
          msg: error.message,
          param: 'server',
          location: 'server',
        },
      ],
    });
  }
};
