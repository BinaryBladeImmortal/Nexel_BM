import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';
import { uploadAsset, uploadThumbnail, getFileUrl } from '../config/localStorage.js';
import { handleFileUpload, handleThumbnailUpload, addFileUrls, cleanupOnError } from '../middleware/uploadMiddleware.js';
import { advancedSearch } from '../middleware/searchMiddleware.js';
import Asset from '../models/assetModel.js';
import {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  updateAssetStatus
} from '../controllers/assetController.js';

const router = express.Router();

// Validation middleware
const validateAsset = [
  check('name').trim().notEmpty().withMessage('Name is required'),
  check('description').trim().notEmpty().withMessage('Description is required'),
  check('category').isIn(['3D Models', 'Textures', 'Audio', 'VFX', 'Animations', 'Other'])
    .withMessage('Invalid category'),
  check('fileUrl').trim().notEmpty().withMessage('File URL is required'),
  check('thumbnailUrl').trim().notEmpty().withMessage('Thumbnail URL is required'),
  check('price').isNumeric().withMessage('Price must be a number'),
  check('requiredSubscription')
    .isIn(['Starter', 'Pro', 'Power', 'Ultra'])
    .withMessage('Invalid subscription level')
];

// Routes
router.get('/', 
  advancedSearch(Asset), 
  addFileUrls, 
  getAssets
);
router.get('/:id', addFileUrls, getAsset);
router.post('/', 
  protect,
  uploadAsset.single('file'),
  uploadThumbnail.single('thumbnail'),
  handleFileUpload,
  handleThumbnailUpload,
  addFileUrls,
  cleanupOnError,
  validateAsset,
  createAsset
);
router.put('/:id',
  protect,
  uploadAsset.single('file'),
  uploadThumbnail.single('thumbnail'),
  handleFileUpload,
  handleThumbnailUpload,
  cleanupOnError,
  validateAsset,
  updateAsset
);
router.delete('/:id', protect, deleteAsset);
router.patch('/:id/status', protect, isAdmin, updateAssetStatus);

export default router;