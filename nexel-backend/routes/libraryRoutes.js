import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';
import UserLibrary from '../models/libraryModel.js';

const router = express.Router();

// Get user's library items
router.get('/', protect, async (req, res) => {
  try {
    // Fetch the user's library items
    const libraryItems = await UserLibrary.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'title', 'description', 'thumbnail', 'type', 'isPremium', 'itemId'],
      order: [['createdAt', 'DESC']]
    });

    // Return the items array directly as that's what the frontend expects
    res.json(libraryItems);
  } catch (error) {
    console.error('Error fetching library:', error);
    res.status(500).json({ message: 'Failed to fetch library items' });
  }
});

// Add item to library
router.post('/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { title, description, thumbnail, type = 'asset', isPremium = false } = req.body;

    // Create new library entry
    const libraryItem = await UserLibrary.create({
      userId: req.user.id,
      itemId: parseInt(itemId),
      title,
      description,
      thumbnail,
      type,
      isPremium
    });
    
    res.status(201).json(libraryItem);
  } catch (error) {
    console.error('Error adding to library:', error);
    res.status(500).json({ message: 'Failed to add item to library' });
  }
});

// Remove item from library
router.delete('/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Delete the library item
    await UserLibrary.destroy({
      where: {
        userId: req.user.id,
        itemId: parseInt(itemId)
      }
    });
    
    res.json({ message: 'Item removed from library' });
  } catch (error) {
    console.error('Error removing from library:', error);
    res.status(500).json({ message: 'Failed to remove item from library' });
  }
});

export default router;