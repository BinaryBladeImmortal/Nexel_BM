import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { getShowcases, addShowcase, deleteShowcase, toggleLikeShowcase } from '../controllers/showcaseController.js';

const router = express.Router();

// Public routes
router.get('/', getShowcases);

// Protected routes
router.post('/', protect, isAdmin, addShowcase);
router.delete('/:id', protect, isAdmin, deleteShowcase);
router.patch('/:id/like', protect, toggleLikeShowcase);

export default router;


