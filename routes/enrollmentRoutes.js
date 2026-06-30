import express from "express";
import {
  enrollInCourse,
  getAllEnrollments,
  getStudentCourses,
  updateEnrollment,
  deleteEnrollment,
  getMyCourses,
  getAvailableCourses
} from "../controllers/enrollmentController.js";

import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(protect);
router.get(
  "/my-courses",
  getMyCourses
);
router.get(
  "/available/:student_id",
  getAvailableCourses
);
router.get(
  "/student/:id",
  getStudentCourses
);
router
  .route("/")
  .get(getAllEnrollments)
  .post(enrollInCourse);
router
  .route("/:id")
  .put(updateEnrollment)
  .delete(deleteEnrollment);

export default router;