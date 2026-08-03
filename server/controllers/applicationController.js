import Application from '../models/Application.js';
import User from '../models/User.js';
import University from '../models/University.js';
import isValidObjectId from '../utils/isValidObjectId.js';

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
export const createApplication = async (req, res) => {
  try {
    const { universityId, course, term, status, notes, applicationDate } = req.body;

    if (!universityId || !isValidObjectId(universityId)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'universityId', message: 'Invalid or missing university ID.' }],
      });
    }

    if (!course) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'course', message: 'Course is required.' }],
      });
    }

    if (!term) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'term', message: 'Term is required.' }],
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

    const existingApplication = await Application.findOne({
      user: req.user._id,
      university: universityId,
      course,
      term,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'Application for this course and term at this university already exists.',
        errors: [],
      });
    }

    const validStatuses = [
      'Planning',
      'Applied',
      'Under Review',
      'Accepted',
      'Rejected',
      'Waitlisted',
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'status', message: 'Invalid status value.' }],
      });
    }

    const application = await Application.create({
      user: req.user._id,
      university: universityId,
      course,
      term,
      status: status || 'Planning',
      notes,
      applicationDate,
    });

    const user = await User.findById(req.user._id);
    user.applications.push(application._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Application created successfully.',
      data: {
        application,
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

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { course, term, status, notes, applicationDate } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'id', message: 'Invalid application ID.' }],
      });
    }

    const validStatuses = [
      'Planning',
      'Applied',
      'Under Review',
      'Accepted',
      'Rejected',
      'Waitlisted',
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'status', message: 'Invalid status value.' }],
      });
    }

    // Whitelist updates only
    const updateFields = {};
    if (course !== undefined) updateFields.course = course;
    if (term !== undefined) updateFields.term = term;
    if (status !== undefined) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;
    if (applicationDate !== undefined) updateFields.applicationDate = applicationDate;

    const application = await Application.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updateFields,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
        errors: [],
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application updated successfully.',
      data: {
        application,
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

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'id', message: 'Invalid application ID.' }],
      });
    }

    const application = await Application.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
        errors: [],
      });
    }

    const user = await User.findById(req.user._id);
    user.applications = user.applications.filter(
      (appId) => appId.toString() !== id.toString()
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully.',
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

// @desc    Get all applications for the authenticated user
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate({
        path: 'university',
        select: '-__v -createdAt -updatedAt',
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Applications fetched successfully.',
      data: {
        applications,
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
