import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './userModel.js';
import Tutorial from './tutorialModel.js';

const UserReward = sequelize.define('UserReward', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  tutorialId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tutorials',
      key: 'id',
    },
  },
  xp: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_rewards',
  timestamps: true,
});

// Define associations
UserReward.belongsTo(User, { foreignKey: 'userId' });
UserReward.belongsTo(Tutorial, { foreignKey: 'tutorialId' });

export default UserReward;