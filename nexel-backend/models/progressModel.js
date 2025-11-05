import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  currentXP: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  nextLevelXP: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
  },
  completionPercentage: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  badges: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  tutorialProgress: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
}, {
  tableName: 'progress',
  timestamps: true,
});

export default Progress;


