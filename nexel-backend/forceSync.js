import sequelize from './config/database.js';
import './models/assetModel.js';
import './models/tutorialModel.js';
import './models/showcaseGameModel.js';
import './models/userModel.js';
import './models/progressModel.js';

async function forceSync() {
  try {
    console.log('🔄 Force syncing database...');
    await sequelize.sync({ force: true });
    console.log('✅ Database synced successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
}

forceSync();