import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

import { sequelize } from './config/db.js'; 

import User from './models/User.js';
import Student from './models/Student.js';
import Enrollment from './models/Enrollment.js';
import Course from './models/Course.js';     
import Material from './models/CourseLink.js'; 
User.hasOne(Student, { foreignKey: 'user_id', as: 'student' });
Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Enrollment.belongsTo(Course, { 
  foreignKey: 'course_id', 
  targetKey: 'course_id',
  as: 'course' 
});

Course.hasMany(Enrollment, { 
  foreignKey: 'course_id', 
  sourceKey: 'course_id', 
  as: 'enrollments' 
});
import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
import courseRoutes from './routes/courseRoutes.js'; 
import materialRoutes from './routes/materialRoutes.js'; 
import enrollmentRoutes from './routes/enrollmentRoutes.js'; 
import adminRoutes from './routes/adminRoutes.js'; 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/courses', courseRoutes); 
app.use('/api/materials', materialRoutes); 
app.use('/api/enrollments', enrollmentRoutes); 
app.use('/api/admin', adminRoutes); 

sequelize.authenticate()
  .then(() => {
    console.log('📦 Database connected successfully.');
    return sequelize.sync(); 
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running perfectly on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });