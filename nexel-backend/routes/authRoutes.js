import express from "express";
import { registerUser, loginUser, getProfile, updateSubscription } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getProfile);
router.post("/update-subscription", protect, updateSubscription);

export default router;
