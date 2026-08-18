import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
import { getDashboardStats } from '../controllers/adminDashboardController.js';
import { getAnalytics } from '../controllers/adminAnalyticsController.js';

const router = express.Router();

// Strict middleware chain for all admin routes: protect -> admin -> validation (if any) -> controller
router.get('/dashboard/stats', protect, admin, getDashboardStats);
router.get('/analytics', protect, admin, getAnalytics);

export default router;
