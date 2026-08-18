import User from '../models/User.js';
import Application from '../models/Application.js';
import Review from '../models/Review.js';
import University from '../models/University.js';

const SAFE_USER_FIELDS = 'name email role isActive cgpa course degree budget countryPreference englishExam examScore createdAt updatedAt';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Search by name or email
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    // Filter by status
    if (req.query.status === 'active') {
      query.isActive = true;
    } else if (req.query.status === 'disabled') {
      query.isActive = false;
    }

    const [users, total] = await Promise.all([
      User.find(query).select(SAFE_USER_FIELDS).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: `Invalid value provided for field: ${error.path}` });
    }
    res.status(500).json({ success: false, message: 'Server Error', errors: [{ message: error.message }] });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const [user, applications, reviews] = await Promise.all([
      User.findById(userId)
        .select(SAFE_USER_FIELDS)
        .populate('wishlist.university', 'name country'),
      Application.find({ user: userId })
        .select('university course term status applicationDate')
        .populate('university', 'name'),
      Review.find({ user: userId })
        .select('university rating comment createdAt')
        .populate('university', 'name')
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        profile: user,
        applications,
        reviews
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: `Invalid value provided for field: ${error.path}` });
    }
    res.status(500).json({ success: false, message: 'Server Error', errors: [{ message: error.message }] });
  }
};

// @desc    Update user status
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { isActive } = req.body;

    // Check for unknown fields
    const allowedFields = ['isActive'];
    const updates = Object.keys(req.body);
    const hasUnknownFields = updates.some(field => !allowedFields.includes(field));
    if (hasUnknownFields) {
      return res.status(400).json({ success: false, message: 'Only isActive can be updated' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Do not allow updating an admin's status
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot modify the status of an administrator' });
    }

    user.isActive = isActive;
    await user.save();

    // Re-fetch to return safe fields
    const updatedUser = await User.findById(userId).select(SAFE_USER_FIELDS);

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: `Invalid value provided for field: ${error.path}` });
    }
    res.status(500).json({ success: false, message: 'Server Error', errors: [{ message: error.message }] });
  }
};
