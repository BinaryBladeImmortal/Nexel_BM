import User from '../models/userModel.js';
import Tutorial from '../models/tutorialModel.js';
import UserReward from '../models/userRewardModel.js';

// Verify tutorial completion and award XP
export const verifyTutorialCompletion = async (req, res) => {
  try {
    const { userId, type, id: tutorialId } = req.body;

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, reason: "User not found" });
    }

    // Check if tutorial exists
    const tutorial = await Tutorial.findByPk(tutorialId);
    if (!tutorial) {
      return res.status(404).json({ success: false, reason: "Tutorial not found" });
    }

    // Check if already verified
    const existingReward = await UserReward.findOne({
      where: { userId, tutorialId, verified: true }
    });

    if (existingReward) {
      return res.status(400).json({ success: false, reason: "Already rewarded" });
    }

    // Create or update reward
    const [reward, created] = await UserReward.findOrCreate({
      where: { userId, tutorialId },
      defaults: {
        xp: tutorial.xpReward || 100,
        verified: true,
        timestamp: new Date()
      }
    });

    if (!created) {
      reward.verified = true;
      reward.xp = tutorial.xpReward || 100;
      reward.timestamp = new Date();
      await reward.save();
    }

    // Update user XP
    user.xp = (user.xp || 0) + (tutorial.xpReward || 100);
    await user.save();

    return res.status(200).json({
      success: true,
      xpAwarded: tutorial.xpReward || 100,
      totalXp: user.xp,
      message: `Tutorial completed! +${tutorial.xpReward || 100} XP earned`
    });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ success: false, reason: error.message });
  }
};