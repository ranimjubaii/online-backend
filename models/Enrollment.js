import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Enrollment = sequelize.define(
  "Enrollment",
  {
    register_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },

    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    register_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },

    payment_data: {
      type: DataTypes.DATE,
      allowNull: true
    },

    payment_status: {
      type: DataTypes.STRING(50),
      defaultValue: "unpaid"
    }
  },
  {
    tableName: "registrations",
    timestamps: false
  }
);

export default Enrollment;