import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['3D Models', 'Textures', 'Audio', 'VFX', 'Animations', 'Other']],
    },
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnailUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  downloadCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  creator: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
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
  detailedDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  compatibility: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  features: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  fileSize: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  version: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requirements: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  tableName: 'assets',
  timestamps: true,
});

export default Asset;