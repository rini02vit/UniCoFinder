import express from 'express';
import {
  createApplication,
  updateApplication,
  deleteApplication,
  getApplications,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(protect, createApplication)
  .get(protect, getApplications);

router
  .route('/:id')
  .put(protect, updateApplication)
  .delete(protect, deleteApplication);

export default router;
