import { sequelize } from './config/db.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const admin = await User.create({
      username: 'admin',
      email: 'ranim@gmail.com',
      password: '123456',
      user_type: 'admin',
    });

    console.log('✅ Admin created successfully:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();