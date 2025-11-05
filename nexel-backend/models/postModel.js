import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
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
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['Question', 'Discussion', 'Showcase', 'News', 'Tutorial']],
    },
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  likes: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  comments: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'archived', 'reported']],
    },
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  tableName: 'posts',
  timestamps: true,
});

export default Post;