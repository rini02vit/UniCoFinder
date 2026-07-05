import express from 'express';
import {
  getUniversities,
  searchUniversities,
  filterUniversities,
} from '../controllers/universityController.js';

const router = express.Router();

router.get('/', getUniversities);
router.get('/search', searchUniversities);
router.get('/filter', filterUniversities);

export default router;
