import User from '../models/User.js';
import Application from '../models/Application.js';
import Review from '../models/Review.js';
import University from '../models/University.js';
import Scholarship from '../models/Scholarship.js';

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const { range = '30d' } = req.query;
    
    // Parse range to get start date
    const days = parseInt(range.replace('d', '')) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const [
      registrations,
      applications,
      reviews,
      applicationStatuses,
      scholarshipsByCoverage,
      popularUniversities,
    ] = await Promise.all([
      // User registrations over time
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      // Applications created over time
      Application.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      // Reviews created over time
      Review.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      // Current Application Status Distribution
      Application.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      // Scholarship Activity (Coverage Type distribution)
      Scholarship.aggregate([
        {
          $group: {
            _id: '$coverageType',
            count: { $sum: 1 }
          }
        }
      ]),
      // Top 5 most applied-to universities
      Application.aggregate([
        {
          $group: {
            _id: '$university',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'universities',
            localField: '_id',
            foreignField: '_id',
            as: 'universityDetails'
          }
        },
        { $unwind: '$universityDetails' },
        {
          $project: {
            _id: 1,
            count: 1,
            name: '$universityDetails.name'
          }
        }
      ]),
    ]);

    // We can also fetch most wishlisted by unwinding User.wishlist, but skipping for brevity if not strictly needed,
    // though the plan promised most-wishlisted. Let's add it.
    const wishlistedUniversities = await User.aggregate([
      { $unwind: '$wishlist' },
      {
        $group: {
          _id: '$wishlist.university',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'universities',
          localField: '_id',
          foreignField: '_id',
          as: 'universityDetails'
        }
      },
      { $unwind: '$universityDetails' },
      {
        $project: {
          _id: 1,
          count: 1,
          name: '$universityDetails.name'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Analytics fetched successfully.',
      data: {
        registrationsOverTime: registrations,
        applicationsOverTime: applications,
        reviewsOverTime: reviews,
        applicationStatuses: applicationStatuses,
        scholarshipsByCoverage: scholarshipsByCoverage,
        popularUniversities,
        wishlistedUniversities
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
