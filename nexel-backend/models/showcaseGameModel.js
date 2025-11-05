import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ShowcaseGame = sequelize.define('ShowcaseGame', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gameUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  xpReward: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    allowNull: false,
  },
  requiresSubscription: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
}, {
  tableName: 'showcase_games',
  timestamps: true,
});

export default ShowcaseGame;


