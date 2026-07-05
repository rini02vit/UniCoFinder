import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.status(200).json({
        success: true,
        message: 'Profile fetched successfully.',
        data: {
          user,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
        errors: [],
      });
    }
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    // 1. Check for empty body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            msg: 'Request body cannot be empty',
            param: 'body',
            location: 'body',
          },
        ],
      });
    }

    // 2. Enforce whitelist and check for prohibited/unknown fields
    const allowedUpdates = [
      'name',
      'cgpa',
      'course',
      'degree',
      'budget',
      'countryPreference',
      'englishExam',
      'examScore',
    ];
    
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      const prohibitedFields = updates.filter(update => !allowedUpdates.includes(update));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: prohibitedFields.map((field) => ({
          msg: `Field '${field}' is not allowed or prohibited from being updated via this route`,
          param: field,
          location: 'body',
        })),
      });
    }

    // 3. Find user and apply updates
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: [],
      });
    }

    // Update the allowed fields
    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    const updatedUser = await user.save();

    // Remove password from response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: userResponse,
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
