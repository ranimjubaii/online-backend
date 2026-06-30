import express from 'express';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.route('/')
  .get(getStudents)
  .post(createStudent);

router.route('/:id')
  .put(updateStudent)
  .delete(deleteStudent);

export default router;