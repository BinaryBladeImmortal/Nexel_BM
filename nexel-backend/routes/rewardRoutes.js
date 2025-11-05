import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { verifyTutorialCompletion } from '../controllers/rewardController.js';

const router = express.Router();

// POST /api/rewards/verify - Verify tutorial completion
router.post('/verify', protect, verifyTutorialCompletion);

export default router;