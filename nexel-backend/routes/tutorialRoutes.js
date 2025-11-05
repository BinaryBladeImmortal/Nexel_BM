import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';
import { uploadThumbnail } from '../config/uploadConfig.js';
import { handleThumbnailUpload, cleanupOnError } from '../middleware/uploadMiddleware.js';
import { advancedSearch } from '../middleware/searchMiddleware.js';
import Tutorial from '../models/tutorialModel.js';
import {
  getTutorials,
  getTutorial,
  createTutorial,
  updateTutorial,
  deleteTutorial,
  updateTutorialStatus,
  toggleLike
} from '../controllers/tutorialController.js';

const router = express.Router();

// Validation middleware
const validateTutorial = [
  check('title').trim().notEmpty().withMessage('Title is required'),
  check('description').trim().notEmpty().withMessage('Description is required'),
  check('content').trim().notEmpty().withMessage('Content is required'),
  check('category').isIn(['modeling', 'texturing', 'animation', 'scripting', 'game-design', 'vfx'])
    .withMessage('Invalid category'),
  check('difficulty').isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid difficulty level'),
  check('xpReward').isNumeric().withMessage('XP reward must be a number'),
  check('estimatedTime').isNumeric().withMessage('Estimated time must be a number')
];

// Routes
router.get('/',
  advancedSearch(Tutorial),
  getTutorials
);
router.get('/:id', getTutorial);
router.post('/',
  protect,
  uploadThumbnail.single('thumbnail'),
  handleThumbnailUpload,
  cleanupOnError,
  validateTutorial,
  createTutorial
);
router.put('/:id',
  protect,
  uploadThumbnail.single('thumbnail'),
  handleThumbnailUpload,
  cleanupOnError,
  validateTutorial,
  updateTutorial
);
router.delete('/:id', protect, deleteTutorial);
router.patch('/:id/status', protect, isAdmin, updateTutorialStatus);
router.post('/:id/like', protect, toggleLike);

export default router;