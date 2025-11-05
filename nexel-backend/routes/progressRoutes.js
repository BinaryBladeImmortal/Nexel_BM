import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getProgress, updateProgress } from '../controllers/progressController.js';

const router = express.Router();

// Fetch current user's progress (auth required to protect other users' data)
router.get('/:userId', protect, getProgress);

// Update progress after completing a tutorial
router.post('/:userId', protect, updateProgress);

export default router;


