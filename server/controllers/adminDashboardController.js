import User from '../models/User.js';
import University from '../models/University.js';
import Scholarship from '../models/Scholarship.js';
import Country from '../models/Country.js';
import Application from '../models/Application.js';
import Review from '../models/Review.js';

// @desc    Get dashboard statistics and overview
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalUniversities,
      totalScholarships,
      totalCountries,
      totalApplications,
      totalReviews,
      recentUsers,
      recentApplications,
      applicationStatuses,
    ] = await Promise.all([
      User.countDocuments(),
      University.countDocuments(),
      Scholarship.countDocuments(),
      Country.countDocuments(),
      Application.countDocuments(),
      Review.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt isActive role'),
      Application.find().sort({ createdAt: -1 }).limit(5).populate('university', 'name').select('course status createdAt university'),
      Application.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    // Format application statuses into a nice object
    const statusDistribution = applicationStatuses.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched successfully.',
      data: {
        counts: {
          users: totalUsers,
          universities: totalUniversities,
          scholarships: totalScholarships,
          countries: totalCountries,
          applications: totalApplications,
          reviews: totalReviews,
        },
        applicationDistribution: statusDistribution,
        recentActivity: {
          users: recentUsers,
          applications: recentApplications,
        }
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
