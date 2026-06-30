import User from '../models/User.js';
import Student from '../models/Student.js'; 
import { sequelize } from '../config/db.js'; 
const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: User,
          as: 'user', 
          where: { user_type: 'student' },
          attributes: ['username', 'email'] 
        }
      ]
    });

    const formattedStudents = students.map(student => ({
      student_id: student.student_id,
      user_id: student.user_id,
      full_name: student.full_name,
      phone: student.phone,
      address: student.address,
      payment_status: student.payment_status || 'unpaid', 
      username: student.user ? student.user.username : '',
      email: student.user ? student.user.email : ''
    }));
    res.json(formattedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createStudent = async (req, res) => {
  const { username, email, password, full_name, phone, address, payment_status } = req.body;
  const t = await sequelize.transaction();
  try {
    const studentExists = await User.findOne({ 
      where: { email },
      transaction: t 
    });
    if (studentExists) {
      await t.rollback();
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    const user = await User.create({
      username,
      email,
      password, 
      user_type: 'student'
    }, { transaction: t });
    const student = await Student.create({
      user_id: user.user_id,
      full_name,
      phone: phone || null,
      address: address || null,
      payment_status: payment_status || 'unpaid' 
    }, { transaction: t });
    await t.commit();
    res.status(201).json({
      student_id: student.student_id,
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      full_name: student.full_name,
      phone: student.phone,
      address: student.address,
      payment_status: student.payment_status 
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};
const updateStudent = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const student = await Student.findOne({ 
      where: { student_id: req.params.id },
      include: [{ model: User, as: 'user' }],
      transaction: t
    });

    if (!student || !student.user) {
      await t.rollback();
      return res.status(404).json({ message: 'Student profile data not found' });
    }
    student.full_name = req.body.full_name || student.full_name;
    student.phone = req.body.phone !== undefined ? req.body.phone : student.phone;
    student.address = req.body.address !== undefined ? req.body.address : student.address;
    if (req.body.payment_status !== undefined) {
      student.payment_status = req.body.payment_status; 
    }
    
    await student.save({ transaction: t });

    const user = await User.findOne({ 
      where: { user_id: student.user_id }, 
      transaction: t 
    });
    
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password; 
      }
      await user.save({ transaction: t });
    }

    await t.commit();

    res.json({
      student_id: student.student_id,
      user_id: student.user_id,
      full_name: student.full_name,
      phone: student.phone,
      address: student.address,
      payment_status: student.payment_status, 
      username: user ? user.username : '',
      email: user ? user.email : ''
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const student = await Student.findOne({ 
      where: { student_id: req.params.id },
      transaction: t 
    });
    
    if (student) {
      const user = await User.findOne({ 
        where: { user_id: student.user_id },
        transaction: t 
      });
      
      await student.destroy({ transaction: t });
      if (user) {
        await user.destroy({ transaction: t });
      }

      await t.commit();
      res.json({ message: 'Student and associated user account wiped cleanly' });
    } else {
      await t.rollback();
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

export { getStudents, createStudent, updateStudent, deleteStudent };