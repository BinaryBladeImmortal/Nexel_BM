import Post from '../models/postModel.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

// Get all posts with pagination and filters
export const getPosts = async (req, res) => {
  try {
    const { items: posts, pagination } = res.searchResults;
    
    // Get aggregated data for filters (simplified for SQLite)
    const allPosts = await Post.findAll({ attributes: ['category', 'tags', 'author', 'likes', 'comments'] });
    
    const categories = {};
    const tagCounts = {};
    const authorStats = {};
    let totalLikes = 0;
    let totalComments = 0;
    
    allPosts.forEach(post => {
      categories[post.category] = (categories[post.category] || 0) + 1;
      
      // Count tags
      if (Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
      
      // Author stats
      if (!authorStats[post.author]) {
        authorStats[post.author] = { postCount: 0, totalLikes: 0, totalComments: 0 };
      }
      authorStats[post.author].postCount++;
      authorStats[post.author].totalLikes += Array.isArray(post.likes) ? post.likes.length : 0;
      authorStats[post.author].totalComments += Array.isArray(post.comments) ? post.comments.length : 0;
      
      totalLikes += Array.isArray(post.likes) ? post.likes.length : 0;
      totalComments += Array.isArray(post.comments) ? post.comments.length : 0;
    });
    
    const popularTags = Object.entries(tagCounts)
      .map(([_id, count]) => ({ _id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    const topAuthors = Object.entries(authorStats)
      .map(([_id, stats]) => ({ _id, ...stats }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);

    res.json({
      posts,
      pagination,
      filters: {
        categories: Object.entries(categories).map(([_id, count]) => ({ _id, count })),
        popularTags,
        topAuthors,
        engagement: {
          avgLikes: allPosts.length > 0 ? totalLikes / allPosts.length : 0,
          avgComments: allPosts.length > 0 ? totalComments / allPosts.length : 0,
          totalPosts: allPosts.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create post
export const createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const savedPost = await Post.create({
      ...req.body,
      author: req.user.id
    });

    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.update(req.body);
    const updatedPost = await Post.findByPk(req.params.id);

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is author or admin
    if (post.author !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment
export const addComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user.id,
      content: req.body.content,
      createdAt: new Date()
    };

    const comments = Array.isArray(post.comments) ? [...post.comments] : [];
    comments.push(comment);
    post.comments = comments;
    await post.save();

    res.json(post.comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Toggle like
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likes = Array.isArray(post.likes) ? [...post.likes] : [];
    const userLikedIndex = likes.indexOf(req.user.id);
    
    if (userLikedIndex === -1) {
      likes.push(req.user.id);
    } else {
      likes.splice(userLikedIndex, 1);
    }

    post.likes = likes;
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Report post
export const reportPost = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.status = 'reported';
    await post.save();

    res.json({ message: 'Post reported successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};