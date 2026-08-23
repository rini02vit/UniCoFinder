import University from '../models/University.js';
import isValidObjectId from '../utils/isValidObjectId.js';
import {
  buildPagination,
  buildSort,
  buildSearchFilter,
  buildFilter,
  buildRecommendationPipeline,
} from '../utils/universityQueryBuilder.js';
import { buildPredictorPipeline } from '../utils/predictorQueryBuilder.js';
import Review from '../models/Review.js';
import Application from '../models/Application.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// @desc    Get all universities with pagination
// @route   GET /api/universities
// @access  Public
export const getUniversities = async (req, res) => {
  try {
    const { page, limit, skip } = buildPagination(req.query);
    const sortOptions = buildSort(req.query);

    const total = await University.countDocuments();
    const universities = await University.find({})
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

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
          hasNextPage: page < pages,
          hasPreviousPage: page > 1,
        },
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

// @desc    Search universities
// @route   GET /api/universities/search
// @access  Public
export const searchUniversities = async (req, res) => {
  try {
    const searchFilter = buildSearchFilter(req.query.q);

    // If q is empty or whitespace-only, return 400 Bad Request
    if (!searchFilter) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'q', message: 'Search keyword is required and cannot be empty.' }],
      });
    }

    const { page, limit, skip } = buildPagination(req.query);
    const sortOptions = buildSort(req.query);

    const total = await University.countDocuments(searchFilter);
    const universities = await University.find(searchFilter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Universities searched successfully.',
      data: {
        universities,
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
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Filter universities
// @route   GET /api/universities/filter
// @access  Public
export const filterUniversities = async (req, res) => {
  try {
    const filter = buildFilter(req.query);
    const { page, limit, skip } = buildPagination(req.query);
    const sortOptions = buildSort(req.query);

    const total = await University.countDocuments(filter);
    const universities = await University.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Universities filtered successfully.',
      data: {
        universities,
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
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Get university by ID
// @route   GET /api/universities/:id
// @access  Public
export const getUniversityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'id',
            message: 'The provided ID is not a valid MongoDB ObjectId.',
          },
        ],
      });
    }

    const universityDoc = await University.findById(id);

    if (!universityDoc) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
        errors: [],
      });
    }

    const university = universityDoc.toObject();
    university.isWishlisted = false;
    university.hasApplied = false;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user) {
          university.isWishlisted = user.wishlist.some(item => item.university.toString() === id);
          const app = await Application.findOne({ user: user._id, university: id });
          if (app) university.hasApplied = true;
        }
      } catch (error) {
        // Ignore token errors for public endpoint
      }
    }

    res.status(200).json({
      success: true,
      message: 'University fetched successfully.',
      data: {
        university,
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

// @desc    Recommend universities based on user profile
// @route   GET /api/universities/recommend
// @access  Private
export const recommendUniversities = async (req, res) => {
  try {
    const user = req.user;

    // 1. Mandatory Fields Validation
    if (
      (user.cgpa === undefined || user.cgpa === null) &&
      (!user.budget) &&
      (!user.course) &&
      (!user.countryPreference)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'profile',
            message: 'Incomplete profile: At least one preference (CGPA, budget, course, or country) is required.',
          },
        ],
      });
    }

    // 2. Build Recommendation Pipeline
    const pipeline = buildRecommendationPipeline(user);

    // 3. Apply pagination offsets natively
    const { page, limit, skip } = buildPagination(req.query);

    // Calculate total for pagination metadata
    // Since we score all universities, the total is the full count
    const total = await University.countDocuments();
    const pages = Math.ceil(total / limit);

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const universities = await University.aggregate(pipeline);

    res.status(200).json({
      success: true,
      message: 'Recommendations generated successfully.',
      data: {
        universities,
        criteriaUsed: {
          cgpa: user.cgpa !== undefined && user.cgpa !== null,
          budget: !!user.budget,
          course: !!user.course,
          country: !!user.countryPreference,
        },
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
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Get deterministic admission predictions
// @route   GET /api/universities/predict
// @access  Private
export const getAdmissionPredictions = async (req, res) => {
  try {
    const user = req.user;

    // MANDATORY REQUIREMENT: Profile must have CGPA
    if (user.cgpa === undefined || user.cgpa === null) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          {
            field: 'cgpa',
            message: 'CGPA is required for admission prediction. Please update your profile.',
          },
        ],
      });
    }

    const { page, limit, skip } = buildPagination(req.query);
    
    // Build and execute the deterministic prediction pipeline
    const pipeline = buildPredictorPipeline(user, req.query);
    
    // To calculate total, we need a separate count pipeline
    const countPipeline = [...pipeline];
    countPipeline.splice(-1, 1); // remove $sort
    countPipeline.push({ $count: 'total' });
    const countResult = await University.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;
    const pages = Math.ceil(total / limit);

    // Apply pagination to main pipeline
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const universities = await University.aggregate(pipeline);

    // Append deterministic explanations locally (keeps MongoDB aggregation lean)
    const dataWithExplanations = universities.map(uni => {
      let explanation = '';
      if (uni.matchStatus === 'Safe') {
        explanation = "Your CGPA strongly meets the requirement, making this a Safe heuristic classification.";
      } else if (uni.matchStatus === 'Target') {
        explanation = "Your profile is competitive, placing this university in your Target range based on available data.";
      } else {
        explanation = "This is a highly competitive Dream classification given the strict requirements or acceptance rate.";
      }

      // Remove the raw score from the output payload to prevent probability misinterpretation
      delete uni.rawAdmissionScore;
      delete uni.maxDenominator;
      delete uni.normalizedPredictorScore;

      return {
        ...uni,
        explanation,
        scoreBreakdown: {
          cgpaMet: user.cgpa >= uni.cgpaRequirement,
          acceptanceRate: uni.acceptanceRate
        }
      };
    });

    res.status(200).json({
      success: true,
      message: 'Admission predictions generated successfully.',
      data: {
        universities: dataWithExplanations,
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
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Get reviews for a university
// @route   GET /api/universities/:id/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'id', message: 'Invalid university ID.' }],
      });
    }

    const { page, limit, skip } = buildPagination(req.query);
    
    // Validate university exists
    const university = await University.findById(id);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
        errors: [],
      });
    }

    const results = await Review.aggregate([
      { $match: { university: new mongoose.Types.ObjectId(id) } },
      {
        $facet: {
          stats: [
            { $group: { _id: null, averageRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
          ],
          reviews: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
              }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            {
              $project: {
                rating: 1,
                comment: 1,
                createdAt: 1,
                'user._id': 1,
                'user.name': 1
              }
            }
          ]
        }
      }
    ]);

    const stats = results[0].stats[0] || { averageRating: 0, totalReviews: 0 };
    const reviews = results[0].reviews;
    const total = stats.totalReviews;
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully.',
      data: {
        stats: {
          averageRating: Number(stats.averageRating.toFixed(1)),
          totalReviews: stats.totalReviews
        },
        reviews,
        pagination: {
          total,
          page,
          limit,
          pages,
          hasNextPage: page < pages,
          hasPreviousPage: page > 1,
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Create a review for a university
// @route   POST /api/universities/:id/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'id', message: 'Invalid university ID.' }],
      });
    }

    if (rating === undefined || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'rating', message: 'Rating must be between 1 and 5.' }],
      });
    }

    if (!comment || comment.trim().length === 0 || comment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'comment', message: 'Comment must be between 1 and 1000 characters.' }],
      });
    }

    const university = await University.findById(id);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found',
        errors: [],
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      university: id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this university.',
        errors: [],
      });
    }

    const review = await Review.create({
      user: req.user._id,
      university: id,
      rating: Number(rating),
      comment: comment.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully.',
      data: { review }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this university.',
        errors: [],
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error',
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/universities/:id/reviews/:reviewId
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    if (!isValidObjectId(id) || !isValidObjectId(reviewId)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: 'id', message: 'Invalid ID parameters.' }],
      });
    }

    const review = await Review.findOne({ _id: reviewId, university: id });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found.',
        errors: [],
      });
    }

    // Authorization check
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review.',
        errors: [],
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      errors: [{ field: 'server', message: error.message }],
    });
  }
};

// @desc    Get trending universities
// @route   GET /api/universities/trending
// @access  Public
export const getTrendingUniversities = async (req, res) => {
  try {
    // 1. Applications Count
    const appCounts = await Application.aggregate([
      { $group: { _id: '$university', count: { $sum: 1 } } }
    ]);
    
    // 2. Wishlist Count
    const wishlistCounts = await User.aggregate([
      { $unwind: '$wishlist' },
      { $group: { _id: '$wishlist.university', count: { $sum: 1 } } }
    ]);

    // 3. Merge in memory
    const scores = {};
    
    appCounts.forEach(app => {
      if(app._id) {
        scores[app._id.toString()] = app.count;
      }
    });

    wishlistCounts.forEach(wl => {
      if(wl._id) {
        const id = wl._id.toString();
        scores[id] = (scores[id] || 0) + wl.count;
      }
    });

    // If no activity, return empty array
    if (Object.keys(scores).length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No trending universities found.',
        data: { universities: [] }
      });
    }

    // Sort descending by score
    let sortedItems = Object.keys(scores)
      .map(id => ({ id, score: scores[id] }))
      .sort((a, b) => b.score - a.score);
    
    // Take top 20 to allow for tie-breaking with ranking
    const top20Ids = sortedItems.slice(0, 20).map(item => item.id);
    const topUniversities = await University.find({ _id: { $in: top20Ids } });

    // Re-map with actual university objects to access ranking
    const enrichedItems = sortedItems.slice(0, 20).map(item => {
      const uni = topUniversities.find(u => u._id.toString() === item.id);
      return {
        uni,
        score: item.score
      };
    }).filter(item => item.uni); // remove any where uni wasn't found (deleted)

    // Final Sort: score descending, then ranking ascending (lower is better)
    enrichedItems.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const rankA = a.uni.ranking || 999999;
      const rankB = b.uni.ranking || 999999;
      return rankA - rankB;
    });

    const finalUniversities = enrichedItems.slice(0, 10).map(item => item.uni);

    res.status(200).json({
      success: true,
      message: 'Trending universities fetched successfully.',
      data: { universities: finalUniversities }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      errors: [{ field: 'server', message: error.message }],
    });
  }
};
