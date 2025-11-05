import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../databases/nexel.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
  },
});

// Test the connection and sync models
export const connectDB = async () => {
  try {
    console.log("🔌 Attempting to connect to SQLite database...");
    
    await sequelize.authenticate();
    console.log("✅ SQLite database connected successfully");
    
    // Only sync in development, and only force sync if explicitly requested
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false });
      console.log("✅ Database models synchronized (development)");
    } else {
      await sequelize.sync({ alter: false });
      console.log("✅ Database models synchronized (production)");
    }

    return sequelize;
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

export default sequelize;
