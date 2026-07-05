import express from 'express';
import {
  getUniversities,
  searchUniversities,
  filterUniversities,
  getUniversityById,
} from '../controllers/universityController.js';

const router = express.Router();

router.get('/', getUniversities);
router.get('/search', searchUniversities);
router.get('/filter', filterUniversities);
router.get('/:id', getUniversityById);

export default router;
