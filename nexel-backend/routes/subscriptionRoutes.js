import express from 'express';
import User from '../models/userModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Update user subscription
router.post('/update-subscription', protect, async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid request body'
      });
    }

    const { plan } = req.body;
    if (!plan) {
      return res.status(400).json({
        success: false,
        error: 'Plan is required'
      });
    }

    const userId = req.user.id;

    if (!['Free', 'Starter', 'Pro', 'Power', 'Ultra'].includes(plan)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid plan specified'
      });
    }

    const startDate = new Date();
    let endDate = new Date();
    
    // Set subscription end date based on plan
    if (plan !== 'Free') {
      switch(plan) {
        case 'Starter':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        case 'Pro':
          endDate.setMonth(endDate.getMonth() + 3);
          break;
        case 'Power':
          endDate.setMonth(endDate.getMonth() + 6);
          break;
        case 'Ultra':
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
      }
    } else {
      endDate = null;
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found'
      });
    }

    // Update user subscription
    await user.update({
      subscriptionPlan: plan,
      subscriptionStartDate: plan === 'Free' ? null : startDate,
      subscriptionEndDate: endDate
    });

    // Get the updated user data
    const updatedUser = await User.findByPk(userId);
    if (!updatedUser) {
      throw new Error('Failed to fetch updated user data');
    }

    // Return success response
    return res.json({
      success: true,
      user: {
        id: updatedUser.id,
        subscription: {
          plan: updatedUser.subscriptionPlan,
          startDate: updatedUser.subscriptionStartDate,
          endDate: updatedUser.subscriptionEndDate
        }
      }
    });

  } catch (error) {
    console.error('Subscription update error:', error);
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to update subscription'
    });
  }
});

export default router;
