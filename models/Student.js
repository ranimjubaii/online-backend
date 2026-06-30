import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js'; 
import User from './User.js';

const Student = sequelize.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  full_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: null
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'students',
  timestamps: false,
  underscored: true
});

export default Student;