import express from 'express';
import { 
  getAllMaterialsAdminView, 
  addMaterial, 
  updateMaterial,
  getCourseMaterials, 
  deleteMaterial 
} from '../controllers/materialController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.route('/')
  .get(protect, admin, getAllMaterialsAdminView)
  .post(protect, admin, addMaterial);

router.route('/course/:courseId')
  .get(protect, getCourseMaterials);
router.route('/:id')
  .put(protect, admin, updateMaterial)   
  .delete(protect, admin, deleteMaterial);

export default router;