import { Op } from 'sequelize';
import User from "../models/userModel.js";
import Asset from "../models/assetModel.js";
import Tutorial from "../models/tutorialModel.js";
import ShowcaseGame from "../models/showcaseGameModel.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single user
export const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user (role, subscription, etc.)
export const updateUser = async (req, res) => {
  try {
    const { role, subscription, xp, level } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (role) user.role = role;
    if (subscription) user.subscriptionPlan = subscription.plan || subscription;
    if (xp !== undefined) user.xp = xp;
    if (level !== undefined) user.level = level;

    await user.save();

    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's related data (optional)
    // await Asset.destroy({ where: { creator: user.id } });
    // await ShowcaseGame.destroy({ where: { author: user.id } });

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Admin stats request received from:', req.user?.email);

    const totalUsers = await User.count();
    console.log('✅ Total users:', totalUsers);

    const totalAssets = await Asset.count();
    console.log('✅ Total assets:', totalAssets);

    const totalTutorials = await Tutorial.count();
    console.log('✅ Total tutorials:', totalTutorials);

    const totalShowcases = await ShowcaseGame.count();
    console.log('✅ Total showcases:', totalShowcases);

    // Get users by subscription plan
    const subscriptionStats = await User.findAll({
      attributes: [
        'subscriptionPlan',
        [User.sequelize.fn('COUNT', User.sequelize.col('subscriptionPlan')), 'count']
      ],
      group: ['subscriptionPlan'],
      raw: true
    });
    console.log('✅ Subscription stats:', subscriptionStats);

    // Recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });
    console.log('✅ New users (7d):', newUsers);

    const stats = {
      totalUsers,
      totalAssets,
      totalTutorials,
      totalShowcases,
      newUsers,
      subscriptionBreakdown: subscriptionStats.map(stat => ({
        _id: stat.subscriptionPlan || 'Free',
        count: parseInt(stat.count)
      }))
    };

    console.log('📤 Sending stats response:', stats);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('❌ Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.toString()
    });
  }
};
