import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const CourseLink = sequelize.define('CourseLink', {
  link_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    field: 'link_id'
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'course_id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  link: { 
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'courselink',
  timestamps: false,
});

export default CourseLink;