import express from 'express';
import { getCountries, getCountryById, recommendCountries } from '../controllers/countryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCountries);
router.get('/recommend', protect, recommendCountries);
router.get('/:id', getCountryById);

export default router;
