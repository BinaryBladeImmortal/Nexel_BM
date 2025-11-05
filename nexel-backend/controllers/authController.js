import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { Op } from 'sequelize';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const emailNorm = (email || '').trim().toLowerCase();
    console.log('Register attempt:', { username, email: emailNorm });
    // Case-insensitive lookup to avoid duplicates with existing mixed-case data
    const existingUser = await User.findOne({ where: { email: { [Op.like]: emailNorm } } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email: emailNorm,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailNorm = (email || '').trim().toLowerCase();
    console.log('Login attempt:', { email: emailNorm });

    // HARDCODED ADMIN CHECK (Hidden from database)
    if (emailNorm === 'admin@gmail.com' && password === 'admin') {
      // Generate special admin token with fixed ID
      const adminToken = jwt.sign({ id: 'admin-hardcoded' }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });

      return res.json({
        _id: 'admin-hardcoded',
        username: 'Admin',
        email: 'admin@gmail.com',
        role: 'admin',
        subscription: { plan: 'Ultra', startDate: new Date(), endDate: null },
        xp: 99999,
        level: 100,
        token: adminToken,
      });
    }

    // Regular user login
    const user = await User.findOne({ where: { email: { [Op.like]: emailNorm } } });
    if (!user) {
      console.log('Login failed: user not found');
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const pwdOk = await user.matchPassword(password);
    if (!pwdOk) {
      console.log('Login failed: password mismatch');
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      subscription: {
        plan: user.subscriptionPlan,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate
      },
      xp: user.xp,
      level: user.level,
      token: generateToken(user.id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      subscription: {
        plan: user.subscriptionPlan,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate
      },
      xp: user.xp,
      level: user.level,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSubscription = async (req, res) => {
  try {
    const { plan, startDate, endDate } = req.body;
    
    // Validate plan
    const validPlans = ["Free", "Starter", "Pro", "Power", "Ultra"];
    if (!plan || !validPlans.includes(plan)) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update subscription
    user.subscriptionPlan = plan;
    user.subscriptionStartDate = startDate ? new Date(startDate) : new Date();
    user.subscriptionEndDate = endDate ? new Date(endDate) : null;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });
    
    res.json({
      message: "Subscription updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error('Subscription update error:', err);
    res.status(500).json({ message: err.message });
  }
};
