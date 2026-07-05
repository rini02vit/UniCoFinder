import User from '../models/User.js';
import University from '../models/University.js';
import isValidObjectId from '../utils/isValidObjectId.js';

// @desc    Add university to wishlist
// @route   POST /api/wishlist/:universityId
// @access  Private
export const addUniversityToWishlist = async (req, res) => {
  try {
    const { universityId } = req.params;

    if (!isValidObjectId(universityId)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'universityId', message: 'Invalid university ID.' }],
      });
    }

    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found.',
        errors: [],
      });
    }

    const user = await User.findById(req.user._id);

    if (user.wishlist.includes(universityId)) {
      return res.status(409).json({
        success: false,
        message: 'University is already in your wishlist.',
        errors: [],
      });
    }

    user.wishlist.push(universityId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'University added to wishlist.',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Remove university from wishlist
// @route   DELETE /api/wishlist/:universityId
// @access  Private
export const removeUniversityFromWishlist = async (req, res) => {
  try {
    const { universityId } = req.params;

    if (!isValidObjectId(universityId)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'universityId', message: 'Invalid university ID.' }],
      });
    }

    const university = await University.findById(universityId);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found.',
        errors: [],
      });
    }

    const user = await User.findById(req.user._id);

    // Idempotent delete
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== universityId.toString()
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'University removed from wishlist.',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      select: '-__v -createdAt -updatedAt', // populate only safe info
    });

    res.status(200).json({
      success: true,
      message: 'Wishlist fetched successfully.',
      data: {
        wishlist: user.wishlist,
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
