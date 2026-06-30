import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js'; 
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  user_type: {
    type: DataTypes.ENUM('admin', 'student'),
    allowNull: false,
    defaultValue: 'student',
  },
}, {
  tableName: 'users', 
  timestamps: true,
  createdAt: 'created_at', 
  updatedAt: false,        
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default User;