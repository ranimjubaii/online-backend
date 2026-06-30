import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Course = sequelize.define('Course', {
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  course_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  hours: {
    type: DataTypes.INTEGER
  },
  lesson: {
    type: DataTypes.INTEGER
  },
  image: {
    type: DataTypes.STRING
  },
  price: {
    type: DataTypes.DECIMAL(10, 2)
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'upcoming'
  }
}, {
  tableName: 'courses',
  timestamps: false
});

export default Course;