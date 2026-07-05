import express from 'express';
import {
  getScholarships,
  getScholarshipById,
  recommendScholarships,
} from '../controllers/scholarshipController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getScholarships);
router.get('/recommend', protect, recommendScholarships);
router.get('/:id', getScholarshipById);

export default router;
