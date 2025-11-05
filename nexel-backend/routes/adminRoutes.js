import express from "express";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getDashboardStats
} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, isAdmin);

// Dashboard stats
router.get("/stats", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
