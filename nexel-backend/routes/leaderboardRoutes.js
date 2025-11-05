import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Fetch users sorted by XP (Sequelize syntax)
    const users = await User.findAll({
      attributes: ['username', 'level', 'xp'],
      order: [['xp', 'DESC']],
      limit: 10,
      raw: true
    });

    if (users && users.length > 0) {
      const enriched = users.map((u, idx) => ({
        rank: idx + 1,
        username: u.username,
        level: u.level || 1,
        xp: u.xp || 0,
        projectCount: Math.floor(Math.random() * 16) + 5,
      }));
      return res.json({ users: enriched });
    }

    // Fallback mock data (if no users found)
    const mock = [
      { username: 'CyberDev_X', level: 28, xp: 15420 },
      { username: 'NeonCoder', level: 27, xp: 14890 },
      { username: 'RetroMaster', level: 25, xp: 13750 },
      { username: 'GlitchArtist', level: 23, xp: 12340 },
      { username: 'SynthWave_Dev', level: 22, xp: 11680 },
      { username: 'HoloSmith', level: 21, xp: 11010 },
      { username: 'ByteRonin', level: 20, xp: 10300 },
      { username: 'VoxelSamurai', level: 19, xp: 9800 },
      { username: 'NeonDrifter', level: 18, xp: 9200 },
      { username: 'PixelNetrunner', level: 17, xp: 8700 },
    ].map((u, idx) => ({ ...u, rank: idx + 1, projectCount: Math.floor(Math.random() * 16) + 5 }));

    return res.json({ users: mock });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ message: 'Failed to load leaderboard' });
  }
});

export default router;


