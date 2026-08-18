import express from 'express';
import {
  getUniversities,
  searchUniversities,
  filterUniversities,
  recommendUniversities,
  getUniversityById,
  getAdmissionPredictions,
  getReviews,
  createReview,
  deleteReview,
  getTrendingUniversities,
} from '../controllers/universityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getUniversities);
router.get('/trending', getTrendingUniversities);
router.get('/search', searchUniversities);
router.get('/filter', filterUniversities);
router.get('/recommend', protect, recommendUniversities);
router.get('/predict', protect, getAdmissionPredictions);
router.get('/:id', getUniversityById);

// Reviews
router.get('/:id/reviews', getReviews);
router.post('/:id/reviews', protect, createReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

export default router;
