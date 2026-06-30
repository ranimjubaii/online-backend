import express from 'express';
import { loginUser, getUserProfile } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/User.js'; 
const router = express.Router();
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/admin/stats', protect, admin, async (req, res) => {
  try {
    const studentCount = await User.count({
      where: { user_type: 'student' }
    });
    const courseCount = 0;      
    const enrollmentCount = 0;  
    const materialCount = 0;    
    res.json({
      courses: courseCount,
      students: studentCount,
      enrollments: enrollmentCount,
      materials: materialCount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;