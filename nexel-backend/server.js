import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import tutorialRoutes from "./routes/tutorialRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import showcaseRoutes from "./routes/showcaseRoutes.js";
import discussionsRoutes from "./routes/discussionsRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";

// Import error handler
import errorHandler from "./middleware/errorMiddleware.js";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Connect to database
await connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    // Add production domains here
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Last-Event-ID'],
  exposedHeaders: ['Content-Type', 'Cache-Control', 'Last-Event-ID'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Middleware
app.use(helmet()); // Security headers
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev')); // HTTP request logger

// Prevent parameter pollution
app.use(hpp());

// Apply rate limiting to all routes
app.use(limiter);

// Serve static files from the public directory
app.use('/assets', express.static('public/assets'));

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "NEXEL Backend Running 🚀" });
});

// API routes
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/assets`, assetRoutes);
app.use(`${API_PREFIX}/tutorials`, tutorialRoutes);
app.use(`${API_PREFIX}/posts`, postRoutes);
app.use(`${API_PREFIX}/progress`, progressRoutes);
app.use(`${API_PREFIX}/leaderboard`, leaderboardRoutes);
app.use(`${API_PREFIX}/showcase`, showcaseRoutes);
app.use(`${API_PREFIX}/discussions`, discussionsRoutes);
app.use(`${API_PREFIX}/library`, libraryRoutes);
app.use(`${API_PREFIX}/subscriptions`, subscriptionRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/rewards`, rewardRoutes);

// 404 handler - Keep this as the last route
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server with retry logic
const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async () => {
  try {
    // Test MongoDB connection first
    await connectDB();
    
    const server = app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
      console.error(error.name, error.message);
      if (server) {
        server.close(() => {
          console.log('Server closed due to uncaught exception');
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    // Handle graceful shutdown
    const gracefulShutdown = () => {
      console.log('Shutting down gracefully...');
      if (server) {
        server.close(() => {
          console.log('Server closed');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    // Listen for termination signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
