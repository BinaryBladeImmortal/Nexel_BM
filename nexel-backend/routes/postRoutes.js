import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';
import { uploadAttachment } from '../config/uploadConfig.js';
import { handleAttachmentsUpload, cleanupOnError } from '../middleware/uploadMiddleware.js';
import { advancedSearch } from '../middleware/searchMiddleware.js';
import Post from '../models/postModel.js';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  toggleLike,
  reportPost
} from '../controllers/postController.js';

const router = express.Router();

// Validation middleware
const validatePost = [
  check('title').trim().notEmpty().withMessage('Title is required'),
  check('content').trim().notEmpty().withMessage('Content is required'),
  check('category').isIn(['Question', 'Discussion', 'Showcase', 'News', 'Tutorial'])
    .withMessage('Invalid category')
];

const validateComment = [
  check('content').trim().notEmpty().withMessage('Comment content is required')
];

// Routes
router.get('/',
  advancedSearch(Post),
  getPosts
);
router.get('/:id', getPost);
router.post('/',
  protect,
  uploadAttachment.array('attachments', 5),
  handleAttachmentsUpload,
  cleanupOnError,
  validatePost,
  createPost
);
router.put('/:id',
  protect,
  uploadAttachment.array('attachments', 5),
  handleAttachmentsUpload,
  cleanupOnError,
  validatePost,
  updatePost
);
router.delete('/:id', protect, deletePost);
router.post('/:id/comments', protect, validateComment, addComment);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/report', protect, reportPost);

export default router;