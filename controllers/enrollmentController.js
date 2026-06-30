import { QueryTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Enrollment from "../models/Enrollment.js";

const getMyCourses = async (req, res) => {
  try {

    const currentUserId =
      req.user?.id ||
      req.user?.user_id ||
      req.user?.student_id;

    if (!currentUserId) {
      return res.status(400).json({
        message: "User ID missing from token"
      });
    }

    const myCourses = await sequelize.query(
      `
      SELECT
        c.course_id,
        c.course_name,
        c.description,
        c.image,
        c.hours,
        c.lesson
      FROM registrations r
      INNER JOIN courses c
        ON r.course_id = c.course_id
      INNER JOIN students s
        ON r.student_id = s.student_id
      WHERE s.user_id = :userId
      AND r.payment_status = 'paid'
      `,
      {
        replacements: { userId: currentUserId },
        type: QueryTypes.SELECT
      }
    );

    res.status(200).json(myCourses);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

const getAvailableCourses = async (req, res) => {

  try {

    const { student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({
        message: "Student ID is required"
      });
    }

    const courses = await sequelize.query(
      `
      SELECT
        c.course_id,
        c.course_name,
        c.price
      FROM courses c
      WHERE c.course_id NOT IN (
        SELECT r.course_id
        FROM registrations r
        WHERE r.student_id = :student_id
      )
      ORDER BY c.course_name ASC
      `,
      {
        replacements: { student_id },
        type: QueryTypes.SELECT
      }
    );

    res.status(200).json(courses);

  } catch (error) {

    console.error("AVAILABLE COURSES ERROR:", error);

    res.status(500).json({
      message: error.message
    });
  }
};

const enrollInCourse = async (req, res) => {

  try {

    const {
      student_id,
      course_id,
      price,
      payment_status
    } = req.body;

    if (!student_id || !course_id) {
      return res.status(400).json({
        message: "student_id and course_id are required"
      });
    }
    const existingEnrollment = await Enrollment.findOne({
      where: {
        student_id,
        course_id
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: "Student already enrolled in this course"
      });
    }
    const enrollment = await Enrollment.create({
      student_id,
      course_id,
      price,
      payment_status: payment_status || "paid",
      payment_data:
        payment_status === "paid"
          ? new Date()
          : null
    });

    res.status(201).json({
      message: "Enrollment created successfully",
      enrollment
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

const getAllEnrollments = async (req, res) => {

  try {

    const records = await sequelize.query(
      `
      SELECT
        r.register_id,
        r.student_id,
        r.course_id,
        r.price,
        r.payment_status,
        r.register_date,
        s.full_name,
        c.course_name
      FROM registrations r
      INNER JOIN students s
        ON r.student_id = s.student_id
      INNER JOIN courses c
        ON r.course_id = c.course_id
      ORDER BY r.register_id DESC
      `,
      {
        type: QueryTypes.SELECT
      }
    );

    res.status(200).json(records);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};
const getStudentCourses = async (req, res) => {

  try {

    const records = await Enrollment.findAll({
      where: {
        student_id: req.params.id
      }
    });

    res.status(200).json(records);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

const updateEnrollment = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      payment_status,
      price
    } = req.body;

    const enrollment = await Enrollment.findOne({
      where: {
        register_id: id
      }
    });

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found"
      });
    }

    await Enrollment.update(
      {
        payment_status:
          payment_status || enrollment.payment_status,

        price:
          price || enrollment.price,

        payment_data:
          payment_status === "paid"
            ? new Date()
            : enrollment.payment_data
      },
      {
        where: {
          register_id: id
        }
      }
    );

    res.status(200).json({
      message: "Enrollment updated successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

const deleteEnrollment = async (req, res) => {

  try {

    const deleted = await Enrollment.destroy({
      where: {
        register_id: req.params.id
      }
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Enrollment not found"
      });
    }

    res.status(200).json({
      message: "Enrollment deleted successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};

export {
  getMyCourses,
  getAvailableCourses,
  enrollInCourse,
  getAllEnrollments,
  getStudentCourses,
  updateEnrollment,
  deleteEnrollment
};