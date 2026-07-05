import express from 'express';
import {
  getUniversities,
  searchUniversities,
  filterUniversities,
  recommendUniversities,
  getUniversityById,
} from '../controllers/universityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getUniversities);
router.get('/search', searchUniversities);
router.get('/filter', filterUniversities);
router.get('/recommend', protect, recommendUniversities);
router.get('/:id', getUniversityById);

export default router;
