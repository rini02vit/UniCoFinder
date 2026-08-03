import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists.',
        errors: [],
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data received',
        errors: [],
      });
    }
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      errors: [],
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check password
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
          },
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
        errors: [],
      });
    }
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      errors: [],
    });
  }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
      errors: [],
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
    data: {},
  });
};
