import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { getDashboardStats } from '../controllers/adminDashboardController.js';
import { getAnalytics } from '../controllers/adminAnalyticsController.js';
import {
  getCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry
} from '../controllers/adminCountryController.js';
import {
  getUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity
} from '../controllers/adminUniversityController.js';
import {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship
} from '../controllers/adminScholarshipController.js';
import {
  getUsers,
  getUserById,
  updateUserStatus
} from '../controllers/adminUserController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  validateCreateCountry,
  validateCountry,
  validateCreateUniversity,
  validateUniversity,
  validateCreateScholarship,
  validateScholarship,
  validateUserStatusUpdate
} from '../validators/adminValidator.js';

const router = express.Router();

// Strict middleware chain for all admin routes: protect -> admin -> validation (if any) -> controller
router.get('/dashboard/stats', protect, admin, getDashboardStats);
router.get('/analytics', protect, admin, getAnalytics);

// Country Management
router.route('/countries')
  .get(protect, admin, getCountries)
  .post(protect, admin, validateCreateCountry, validateRequest, createCountry);

router.route('/countries/:id')
  .get(protect, admin, getCountryById)
  .put(protect, admin, validateCountry, validateRequest, updateCountry)
  .delete(protect, admin, deleteCountry);

// University Management
router.route('/universities')
  .get(protect, admin, getUniversities)
  .post(protect, admin, validateCreateUniversity, validateRequest, createUniversity);

router.route('/universities/:id')
  .get(protect, admin, getUniversityById)
  .put(protect, admin, validateUniversity, validateRequest, updateUniversity)
  .delete(protect, admin, deleteUniversity);

// Scholarship Management
router.route('/scholarships')
  .get(protect, admin, getScholarships)
  .post(protect, admin, validateCreateScholarship, validateRequest, createScholarship);

router.route('/scholarships/:id')
  .get(protect, admin, getScholarshipById)
  .put(protect, admin, validateScholarship, validateRequest, updateScholarship)
  .delete(protect, admin, deleteScholarship);

// User Management
router.route('/users')
  .get(protect, admin, getUsers);

router.route('/users/:id')
  .get(protect, admin, getUserById);

router.route('/users/:id/status')
  .patch(protect, admin, validateUserStatusUpdate, validateRequest, updateUserStatus);

export default router;
