import sequelize, { connectDB } from './config/database.js';

async function sync() {
  try {
    process.env.NODE_ENV = 'development';
    console.log('Syncing database...');
    await connectDB();
    console.log('Database synced successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
}

sync();