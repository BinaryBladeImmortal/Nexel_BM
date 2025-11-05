import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Tutorial = sequelize.define('Tutorial', {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['modeling', 'texturing', 'animation', 'scripting', 'game-design', 'vfx']],
    },
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  author: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'draft',
    validate: {
      isIn: [['draft', 'published', 'archived']],
    },
  },
  requiredSubscription: {
    type: DataTypes.STRING,
    defaultValue: 'Starter',
    validate: {
      isIn: [['Starter', 'Pro', 'Power', 'Ultra']],
    },
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  xpReward: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },
  estimatedTime: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  difficulty: {
    type: DataTypes.STRING,
    defaultValue: 'Beginner',
    validate: {
      isIn: [['Beginner', 'Intermediate', 'Advanced']],
    },
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'tutorials',
  timestamps: true,
});

export default Tutorial;