import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './userModel.js';

const UserLibrary = sequelize.define('UserLibrary', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'asset',
    validate: {
      isIn: [['asset', 'tutorial']],
    },
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'user_library',
  timestamps: true,
});

// Set up associations
User.hasMany(UserLibrary, { as: 'libraryItems', foreignKey: 'userId' });
UserLibrary.belongsTo(User, { foreignKey: 'userId' });

export default UserLibrary;