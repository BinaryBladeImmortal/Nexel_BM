import Tutorial from '../models/tutorialModel.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

// Get all tutorials with pagination and filters
export const getTutorials = async (req, res) => {
  try {
    const { items: tutorialItems, pagination } = res.searchResults;

    // Map status to published for each tutorial
    const tutorials = tutorialItems.map(tutorial => ({
      ...tutorial.get(),
      published: tutorial.status === 'published'
    }));
    
    // Get aggregated data for filters (simplified for SQLite)
    const allTutorials = await Tutorial.findAll({ attributes: ['category', 'difficulty', 'estimatedTime', 'tags'] });
    
    const categories = {};
    const subscriptions = {};
    const durationRanges = { '0-15': 0, '15-30': 0, '30-60': 0, '60-120': 0, '120+': 0 };
    const tagCounts = {};
    
    allTutorials.forEach(tutorial => {
      categories[tutorial.category] = (categories[tutorial.category] || 0) + 1;
      subscriptions[tutorial.requiredSubscription] = (subscriptions[tutorial.requiredSubscription] || 0) + 1;
      
      const duration = tutorial.duration || 0;
      if (duration < 15) durationRanges['0-15']++;
      else if (duration < 30) durationRanges['15-30']++;
      else if (duration < 60) durationRanges['30-60']++;
      else if (duration < 120) durationRanges['60-120']++;
      else durationRanges['120+']++;
      
      // Count tags
      if (Array.isArray(tutorial.tags)) {
        tutorial.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });
    
    // Get top 10 tags
    const popularTags = Object.entries(tagCounts)
      .map(([_id, count]) => ({ _id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      tutorials,
      pagination,
      filters: {
        categories: Object.entries(categories).map(([_id, count]) => ({ _id, count })),
        subscriptions: Object.entries(subscriptions).map(([_id, count]) => ({ _id, count })),
        durationRanges: Object.entries(durationRanges).map(([_id, count]) => ({ _id, count })),
        popularTags
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single tutorial
export const getTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    // Increment views
    tutorial.views += 1;
    await tutorial.save();

    res.json(tutorial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create tutorial
export const createTutorial = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Add verification status for YouTube tutorials
    const tutorialData = {
      ...req.body,
      author: req.user.id,
      verificationStatus: req.body.type === 'youtube' ? 'pending' : 'verified'
    };
    
    const savedTutorial = await Tutorial.create(tutorialData);

    res.status(201).json(savedTutorial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update tutorial
export const updateTutorial = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    // Check if user is author or admin
    if (tutorial.author !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Map published to status
    const updateData = {
      ...req.body,
      status: req.body.published ? 'published' : 'draft'
    };

    await tutorial.update(updateData);
    const updatedTutorial = await Tutorial.findByPk(req.params.id);

    // Map status back to published in response
    const response = {
      ...updatedTutorial.get(),
      published: updatedTutorial.status === 'published'
    };

    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete tutorial
export const deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    // Check if user is author or admin
    if (tutorial.author !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await tutorial.destroy();
    res.json({ message: 'Tutorial deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tutorial status (admin only)
export const updateTutorialStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const tutorial = await Tutorial.findByPk(req.params.id);

    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    tutorial.status = status;
    await tutorial.save();

    res.json(tutorial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Like/Unlike tutorial
export const toggleLike = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByPk(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    tutorial.likes = tutorial.likes + 1;
    await tutorial.save();

    res.json({ likes: tutorial.likes });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};