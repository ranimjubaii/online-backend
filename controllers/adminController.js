import Course from '../models/Course.js';
import Student from '../models/Student.js';
import Enrollment from '../models/Enrollment.js';
import Material from '../models/CourseLink.js'; 
export const getAdminStats = async (req, res) => {
  try {
    const [coursesCount, studentsCount, enrollmentsCount, materialsCount] = await Promise.all([
      Course.count(),
      Student.count(),
      Enrollment.count(),
      Material.count(),
    ]);

    res.json({
      courses: coursesCount,
      students: studentsCount,
      enrollments: enrollmentsCount,
      materials: materialsCount
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to compile admin statistics matrix", 
      error: error.message 
    });
  }
};