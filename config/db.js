import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Database connected via Sequelize successfully.');
    await sequelize.sync({ alter: false });
    console.log('Database tables synchronized.');
  } catch (error) {
    console.error('Unable to connect to the PostgreSQL database:', error.message);
    process.exit(1);
  }
};

export { sequelize, connectDB };