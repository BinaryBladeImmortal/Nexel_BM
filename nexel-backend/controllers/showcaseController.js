import ShowcaseGame from '../models/showcaseGameModel.js';
import { Op } from 'sequelize';

const FALLBACK_GAMES = [
  {
    title: "Neon Runner",
    description: "Dash through glowing cityscapes and collect energy orbs.",
    author: "System",
    tags: ["#cyberpunk", "#endlessrunner"],
    thumbnail: "/game-synthwave-racing.jpg",
    gameUrl: "https://example.com/neon-runner-demo",
  },
  {
    title: "Hologram Defense",
    description: "Protect your mainframe with holographic shields.",
    author: "System",
    tags: ["#towerdefense", "#synthwave"],
    thumbnail: "/game-cyber-heist.jpg",
    gameUrl: "https://example.com/hologram-defense",
  },
  {
    title: "Synthwave Drift",
    description: "Race through neon highways in a synthwave atmosphere.",
    author: "System",
    tags: ["#racing", "#retro"],
    thumbnail: "/game-synthwave-racing.jpg",
    gameUrl: "https://example.com/synth-drift",
  },
  {
    title: "Neon Grid Escape",
    description: "Escape the grid while avoiding security drones.",
    author: "System",
    tags: ["#arcade", "#stealth"],
    thumbnail: "/asset-neon-city.jpg",
    gameUrl: "https://example.com/neon-grid-escape",
  },
];

export const getShowcases = async (req, res) => {
  try {
    const count = await ShowcaseGame.count();
    if (count === 0) {
      // Seed 3-5 demo games to DB so refresh shows changes
      const seed = FALLBACK_GAMES.slice(0, 4).map(g => ({ ...g, likes: Math.floor(Math.random()*200) }));
      await ShowcaseGame.bulkCreate(seed);
    }
    // Return all games (SQLite doesn't have $sample, so we get all and shuffle)
    const items = await ShowcaseGame.findAll({ raw: true });
    // Shuffle array for random order
    const shuffled = items.sort(() => Math.random() - 0.5).slice(0, 50);
    const normalized = shuffled.map((g) => ({
      ...g,
      _id: g.id, // Add _id for frontend compatibility
      thumbnail: (!g.thumbnail || String(g.thumbnail).endsWith('game-neon-runner.jpg'))
        ? '/game-synthwave-racing.jpg'
        : g.thumbnail,
      // Parse JSON fields from SQLite
      tags: typeof g.tags === 'string' ? JSON.parse(g.tags) : (g.tags || [])
    }));
    res.json({ games: normalized });
  } catch (err) {
    console.error('getShowcases error', err);
    // Fallback response
    const mock = FALLBACK_GAMES.slice(0, 4).map((g, i) => ({
      _id: `mock-${i}`,
      id: `mock-${i}`,
      ...g,
      likes: Math.floor(Math.random()*200),
      createdAt: new Date(),
    }));
    res.json({ games: mock });
  }
};

export const addShowcase = async (req, res) => {
  try {
    const game = await ShowcaseGame.create({ ...req.body, likes: 0 });
    res.status(201).json(game);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteShowcase = async (req, res) => {
  try {
    const { id } = req.params;
    await ShowcaseGame.destroy({ where: { id } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const toggleLikeShowcase = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await ShowcaseGame.findByPk(id);
    if (!game) return res.status(404).json({ message: 'Not found' });

    // Check if user is logged in
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Please log in to interact with showcase games',
        requiresAuth: true
      });
    }

    // Check if user has required subscription
    const hasAccess = req.user.subscriptionPlan && req.user.subscriptionPlan !== 'Free';
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Upgrade your plan to interact with showcase games',
        requiresUpgrade: true
      });
    }

    // Process the like/unlike
    const inc = req.body?.like === true ? 1 : req.body?.like === false ? -1 : 1;
    game.likes = Math.max(0, (game.likes || 0) + inc);
    await game.save();

    // Update user's XP if they liked the game
    if (req.body?.like === true && req.user.id !== 'admin-hardcoded') {
      try {
        await User.increment(
          { xp: 5 }, // Award 5 XP for liking a showcase game
          { where: { id: req.user.id } }
        );
      } catch (error) {
        console.error('Error updating XP:', error);
      }
    }

    res.json({
      success: true,
      likes: game.likes,
      xpGained: req.body?.like === true ? 5 : 0
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: err.message || 'Failed to update showcase game'
    });
  }
};


