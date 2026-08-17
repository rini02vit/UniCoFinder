import express from 'express';
import { body } from 'express-validator';
import {
  addUniversityToWishlist,
  removeUniversityFromWishlist,
  getWishlist,
  updateWishlistMetadata,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.route('/:universityId')
  .post(protect, addUniversityToWishlist)
  .delete(protect, removeUniversityFromWishlist)
  .patch(
    protect,
    [
      body('note')
        .optional()
        .isString()
        .withMessage('Note must be a string')
        .isLength({ max: 1000 })
        .withMessage('Note cannot exceed 1000 characters'),
      body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High'])
        .withMessage('Priority must be Low, Medium, or High'),
    ],
    validateRequest,
    updateWishlistMetadata
  );

router.route('/')
  .get(protect, getWishlist);

export default router;
