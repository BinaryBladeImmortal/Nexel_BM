import Progress from '../models/progressModel.js';

export const getProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (String(req.user.id) !== String(userId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const progress = await Progress.findOne({ where: { user: userId } });
    if (!progress) {
      return res.json({
        level: 1,
        currentXP: 0,
        nextLevelXP: 1000,
        completionPercentage: 0,
        badges: [],
        tutorialProgress: {},
      });
    }
    res.json({
      level: progress.level,
      currentXP: progress.currentXP,
      nextLevelXP: progress.nextLevelXP,
      completionPercentage: progress.completionPercentage,
      badges: progress.badges,
      tutorialProgress: progress.tutorialProgress || {},
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (String(req.user.id) !== String(userId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { level, currentXP, nextLevelXP, completionPercentage, badges, tutorialProgress } = req.body || {};

    const update = {
      user: userId,
      ...(level !== undefined ? { level } : {}),
      ...(currentXP !== undefined ? { currentXP } : {}),
      ...(nextLevelXP !== undefined ? { nextLevelXP } : {}),
      ...(completionPercentage !== undefined ? { completionPercentage } : {}),
      ...(badges !== undefined ? { badges } : {}),
      ...(tutorialProgress !== undefined ? { tutorialProgress } : {}),
    };

    // Use upsert to create or update
    const [doc] = await Progress.upsert(update, { returning: true });

    res.json({
      level: doc.level,
      currentXP: doc.currentXP,
      nextLevelXP: doc.nextLevelXP,
      completionPercentage: doc.completionPercentage,
      badges: doc.badges,
      tutorialProgress: doc.tutorialProgress || {},
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


