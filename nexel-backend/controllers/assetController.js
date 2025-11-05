import Asset from '../models/assetModel.js';
import { validationResult } from 'express-validator';
import { deleteFile } from '../config/localStorage.js';
import { Op } from 'sequelize';

// Get all assets with pagination and filters
export const getAssets = async (req, res) => {
  try {
    const { items: assets, pagination } = res.searchResults;
    
    // Get category and subscription counts for filters (simplified for SQLite)
    const allAssets = await Asset.findAll({ attributes: ['category', 'requiredSubscription', 'price'] });
    
    // Group by category
    const categories = {};
    const subscriptions = {};
    const priceRanges = { '0-10': 0, '10-50': 0, '50-100': 0, '100-500': 0, '500+': 0 };
    
    allAssets.forEach(asset => {
      categories[asset.category] = (categories[asset.category] || 0) + 1;
      subscriptions[asset.requiredSubscription] = (subscriptions[asset.requiredSubscription] || 0) + 1;
      
      const price = asset.price || 0;
      if (price < 10) priceRanges['0-10']++;
      else if (price < 50) priceRanges['10-50']++;
      else if (price < 100) priceRanges['50-100']++;
      else if (price < 500) priceRanges['100-500']++;
      else priceRanges['500+']++;
    });

    res.json({
      assets,
      pagination,
      filters: {
        categories: Object.entries(categories).map(([_id, count]) => ({ _id, count })),
        subscriptions: Object.entries(subscriptions).map(([_id, count]) => ({ _id, count })),
        priceRanges: Object.entries(priceRanges).map(([_id, count]) => ({ _id, count }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single asset by ID
export const getAsset = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new asset
export const createAsset = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const savedAsset = await Asset.create({
      ...req.body,
      creator: req.user.id
    });

    res.status(201).json(savedAsset);
  } catch (error) {
    // Clean up uploaded files if there was an error
    if (req.file) {
      deleteFile(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
};

// Update asset
export const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Check if user is creator or admin
    if (asset.creator !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to update this asset' });
    }

    // If new file is uploaded, delete the old one
    if (req.file && asset.fileUrl) {
      deleteFile(asset.fileUrl);
    }

    // If new thumbnail is uploaded, delete the old one
    if (req.thumbnail && asset.thumbnailUrl) {
      deleteFile(asset.thumbnailUrl);
    }

    await asset.update(req.body);
    const updatedAsset = await Asset.findByPk(req.params.id);

    res.json(updatedAsset);
  } catch (error) {
    // Clean up uploaded files if there was an error
    if (req.file) {
      deleteFile(req.file.path);
    }
    if (req.thumbnail) {
      deleteFile(req.thumbnail.path);
    }
    res.status(400).json({ message: error.message });
  }
};

// Delete asset
export const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Check if user is creator or admin
    if (asset.creator !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to delete this asset' });
    }

    // Delete files from local storage
    if (asset.fileUrl) {
      deleteFile(asset.fileUrl);
    }
    if (asset.thumbnailUrl) {
      deleteFile(asset.thumbnailUrl);
    }

    await asset.destroy();
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update asset status (admin only)
export const updateAssetStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const asset = await Asset.findByPk(req.params.id);
    
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    asset.status = status;
    await asset.save();

    res.json(asset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};